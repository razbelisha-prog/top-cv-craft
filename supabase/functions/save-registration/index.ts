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
    const { participantName, participantEmail, participantPhone, participantsCount, workshopDate } = await req.json();

    if (!participantName || !participantEmail) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Use a pending ID based on email + timestamp to allow tracking
    const pendingId = `pending-${Date.now()}-${participantEmail.replace(/[^a-zA-Z0-9]/g, '')}`;

    const { error } = await supabase.from('registrations').insert({
      participant_name: participantName,
      participant_email: participantEmail,
      participant_phone: participantPhone || '',
      participants_count: participantsCount || 1,
      workshop_date: workshopDate || '',
      amount_paid: 0,
      currency: 'ILS',
      paypal_order_id: pendingId,
      payment_status: 'pending',
    });

    if (error) {
      console.error('Error saving registration:', error);
      throw new Error(error.message);
    }

    console.log('Registration saved for:', participantEmail);

    return new Response(
      JSON.stringify({ success: true, pendingId }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
