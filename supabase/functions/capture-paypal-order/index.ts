import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function saveRegistration(
  supabase: any,
  data: {
    participantName: string;
    participantEmail: string;
    participantPhone?: string;
    participantsCount: number;
    workshopDate: string;
    amountPaid: string;
    currency: string;
    paypalOrderId: string;
    paymentStatus: string;
  }
) {
  // First, try to find an existing pending registration by email
  const { data: existingRows, error: fetchError } = await supabase
    .from('registrations')
    .select('id')
    .eq('participant_email', data.participantEmail)
    .eq('payment_status', 'pending')
    .order('created_at', { ascending: false })
    .limit(1);

  if (fetchError) {
    console.error('Error fetching existing registration:', fetchError);
  }

  if (existingRows && existingRows.length > 0) {
    // Update the existing pending record — preserve phone/name that were already saved
    const { error } = await supabase
      .from('registrations')
      .update({
        paypal_order_id: data.paypalOrderId,
        payment_status: data.paymentStatus,
        amount_paid: parseFloat(data.amountPaid) || 0,
        currency: data.currency || 'ILS',
        workshop_date: data.workshopDate || undefined,
      })
      .eq('id', existingRows[0].id);

    if (error) {
      console.error('Error updating registration:', error);
    } else {
      console.log('Updated existing pending registration for:', data.participantEmail);
    }
  } else {
    // No pending record found — insert a new one
    const { error } = await supabase.from('registrations').upsert({
      participant_name: data.participantName,
      participant_email: data.participantEmail,
      participant_phone: data.participantPhone || '',
      participants_count: data.participantsCount || 1,
      workshop_date: data.workshopDate,
      amount_paid: parseFloat(data.amountPaid) || 0,
      currency: data.currency || 'ILS',
      paypal_order_id: data.paypalOrderId,
      payment_status: data.paymentStatus,
    }, { onConflict: 'paypal_order_id' });

    if (error) {
      console.error('Error saving registration:', error);
    } else {
      console.log('Created new registration for:', data.participantEmail);
    }
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId, paypalDetails, participantName, participantEmail, participantPhone, participants, workshopDate, amount, currency } = await req.json();

    if (!orderId) {
      return new Response(
        JSON.stringify({ error: 'Missing orderId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with service role to bypass RLS
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // If paypalDetails is provided, the order was already captured client-side
    if (paypalDetails && paypalDetails.status === 'COMPLETED') {
      console.log('Order already captured successfully:', orderId);
      
      const captureInfo = paypalDetails.purchase_units?.[0]?.payments?.captures?.[0];

      // Save registration to database
      await saveRegistration(supabase, {
        participantName: participantName || '',
        participantEmail: participantEmail || paypalDetails.payer?.email_address || '',
        participantPhone: participantPhone || '',
        participantsCount: participants || 1,
        workshopDate: workshopDate || '',
        amountPaid: amount || captureInfo?.amount?.value || '0',
        currency: currency || 'ILS',
        paypalOrderId: orderId,
        paymentStatus: 'completed',
      });
      
      return new Response(
        JSON.stringify({
          status: paypalDetails.status,
          transactionId: captureInfo?.id,
          payerEmail: paypalDetails.payer?.email_address,
          alreadyCaptured: true,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If no paypalDetails, attempt server-side capture (fallback)
    const PAYPAL_CLIENT_ID = Deno.env.get('PAYPAL_CLIENT_ID');
    const PAYPAL_SECRET_KEY = Deno.env.get('PAYPAL_SECRET_KEY');

    if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET_KEY) {
      throw new Error('PayPal credentials not configured');
    }

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

    const captureResponse = await fetch(`https://api-m.paypal.com/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!captureResponse.ok) {
      const errorData = await captureResponse.json();
      
      if (errorData.details?.[0]?.issue === 'ORDER_ALREADY_CAPTURED') {
        console.log('Order was already captured:', orderId);

        await saveRegistration(supabase, {
          participantName: participantName || '',
          participantEmail: participantEmail || '',
          participantPhone: participantPhone || '',
          participantsCount: participants || 1,
          workshopDate: workshopDate || '',
          amountPaid: amount || '0',
          currency: currency || 'ILS',
          paypalOrderId: orderId,
          paymentStatus: 'completed',
        });

        return new Response(
          JSON.stringify({
            status: 'COMPLETED',
            transactionId: orderId,
            alreadyCaptured: true,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      console.error('PayPal capture error:', JSON.stringify(errorData));
      throw new Error('Failed to capture PayPal order');
    }

    const captureData = await captureResponse.json();

    // Save registration
    await saveRegistration(supabase, {
      participantName: participantName || '',
      participantEmail: participantEmail || captureData.payer?.email_address || '',
      participantPhone: participantPhone || '',
      participantsCount: participants || 1,
      workshopDate: workshopDate || '',
      amountPaid: amount || captureData.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value || '0',
      currency: currency || 'ILS',
      paypalOrderId: orderId,
      paymentStatus: 'completed',
    });

    return new Response(
      JSON.stringify({
        status: captureData.status,
        transactionId: captureData.purchase_units?.[0]?.payments?.captures?.[0]?.id,
        payerEmail: captureData.payer?.email_address,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error capturing PayPal order:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
