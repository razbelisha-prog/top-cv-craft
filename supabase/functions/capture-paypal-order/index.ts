import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId, paypalDetails } = await req.json();

    if (!orderId) {
      return new Response(
        JSON.stringify({ error: 'Missing orderId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If paypalDetails is provided, the order was already captured client-side
    // Just validate and return success
    if (paypalDetails && paypalDetails.status === 'COMPLETED') {
      console.log('Order already captured successfully:', orderId);
      
      const captureInfo = paypalDetails.purchase_units?.[0]?.payments?.captures?.[0];
      
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

    // Capture the order
    const captureResponse = await fetch(`https://api-m.paypal.com/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    // Handle already captured orders gracefully
    if (!captureResponse.ok) {
      const errorData = await captureResponse.json();
      
      // If order was already captured, treat as success
      if (errorData.details?.[0]?.issue === 'ORDER_ALREADY_CAPTURED') {
        console.log('Order was already captured:', orderId);
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
