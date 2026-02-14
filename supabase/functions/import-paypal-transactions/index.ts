import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const PAYPAL_CLIENT_ID = Deno.env.get('PAYPAL_CLIENT_ID');
    const PAYPAL_SECRET_KEY = Deno.env.get('PAYPAL_SECRET_KEY');

    if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET_KEY) {
      throw new Error('PayPal credentials not configured');
    }

    // Get PayPal access token
    const authResponse = await fetch('https://api-m.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET_KEY}`)}`,
      },
      body: 'grant_type=client_credentials',
    });

    if (!authResponse.ok) {
      const errorText = await authResponse.text();
      console.error('PayPal auth error:', errorText);
      throw new Error('Failed to authenticate with PayPal');
    }

    const authData = await authResponse.json();
    const accessToken = authData.access_token;

    // Fetch transactions from Feb 10, 2026 to now
    const startDate = '2026-02-10T00:00:00-0000';
    const endDate = new Date().toISOString();

    const txnUrl = `https://api-m.paypal.com/v1/reporting/transactions?start_date=${startDate}&end_date=${endDate}&fields=all&page_size=100&page=1`;
    
    console.log('Fetching transactions from:', txnUrl);

    const txnResponse = await fetch(txnUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!txnResponse.ok) {
      const errorText = await txnResponse.text();
      console.error('PayPal transactions error:', errorText);
      throw new Error(`Failed to fetch transactions: ${txnResponse.status} - ${errorText}`);
    }

    const txnData = await txnResponse.json();
    console.log('Total transactions found:', txnData.total_items);
    console.log('Raw transaction data:', JSON.stringify(txnData, null, 2));

    // Create Supabase client with service role
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const results: any[] = [];

    if (txnData.transaction_details && txnData.transaction_details.length > 0) {
      for (const txn of txnData.transaction_details) {
        const txnInfo = txn.transaction_info || {};
        const payerInfo = txn.payer_info || {};
        const cartInfo = txn.cart_info || {};
        const shippingInfo = txn.shipping_info || {};

        // Only process completed sales (transaction_event_code starting with T00 = purchases)
        const eventCode = txnInfo.transaction_event_code || '';
        const transactionStatus = txnInfo.transaction_status || '';
        
        // S = Successful
        if (transactionStatus !== 'S') {
          console.log(`Skipping transaction ${txnInfo.transaction_id} with status: ${transactionStatus}`);
          continue;
        }

        const amount = txnInfo.transaction_amount?.value || '0';
        // Skip negative amounts (refunds) and zero amounts
        if (parseFloat(amount) <= 0) {
          console.log(`Skipping transaction ${txnInfo.transaction_id} with amount: ${amount}`);
          continue;
        }

        const payerName = payerInfo.payer_name 
          ? `${payerInfo.payer_name.given_name || ''} ${payerInfo.payer_name.surname || ''}`.trim()
          : (payerInfo.payer_name?.alternate_full_name || 'Unknown');
        
        const payerEmail = payerInfo.email_address || '';
        const payerPhone = payerInfo.phone_number?.national_number || 
                          payerInfo.phone_number?.phone_number || '';
        const currency = txnInfo.transaction_amount?.currency_code || 'ILS';
        const transactionId = txnInfo.transaction_id || '';
        const txnDate = txnInfo.transaction_initiation_date || '';

        // Extract workshop date from custom_field or item description if available
        let workshopDate = '';
        if (cartInfo.item_details && cartInfo.item_details.length > 0) {
          const itemName = cartInfo.item_details[0].item_name || '';
          workshopDate = itemName;
        }
        if (!workshopDate && txnInfo.custom_field) {
          try {
            const customData = JSON.parse(txnInfo.custom_field);
            workshopDate = customData.workshopDate || '';
          } catch {
            workshopDate = txnInfo.custom_field || '';
          }
        }
        if (!workshopDate) {
          workshopDate = txnDate ? new Date(txnDate).toLocaleDateString('he-IL') : 'לא ידוע';
        }

        const record = {
          participant_name: payerName,
          participant_email: payerEmail,
          participant_phone: payerPhone,
          participants_count: 1,
          workshop_date: workshopDate,
          amount_paid: parseFloat(amount) || 0,
          currency: currency,
          paypal_order_id: transactionId,
          payment_status: 'completed',
        };

        console.log('Saving record:', JSON.stringify(record));

        const { error } = await supabase.from('registrations').upsert(record, {
          onConflict: 'paypal_order_id',
        });

        if (error) {
          console.error('Error saving:', error);
          results.push({ ...record, status: 'error', error: error.message });
        } else {
          results.push({ ...record, status: 'saved' });
        }
      }
    }

    return new Response(
      JSON.stringify({
        total_transactions_from_paypal: txnData.total_items,
        transactions_processed: txnData.transaction_details?.length || 0,
        records_saved: results.filter(r => r.status === 'saved').length,
        records_failed: results.filter(r => r.status === 'error').length,
        details: results,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error importing transactions:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
