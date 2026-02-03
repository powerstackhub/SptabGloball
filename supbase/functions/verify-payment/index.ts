import { createClient } from 'npm:@supabase/supabase-js@2'
import { createHmac } from 'node:crypto'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface VerifyPaymentRequest {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  donation_id: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get payment configuration from app_configuration table
    const { data: config, error: configError } = await supabase
      .from('app_configuration')
      .select('razorpay_key_secret')
      .limit(1)
      .single()

    if (configError || !config || !config.razorpay_key_secret) {
      throw new Error('Payment configuration not found')
    }

    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, donation_id }: VerifyPaymentRequest = await req.json()

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = createHmac('sha256', config.razorpay_key_secret)
      .update(body)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      throw new Error('Invalid payment signature')
    }

    // Update donation record
    const { error: updateError } = await supabase
      .from('donations')
      .update({
        razorpay_payment_id,
        razorpay_signature,
        status: 'paid',
        updated_at: new Date().toISOString(),
      })
      .eq('id', donation_id)

    if (updateError) {
      throw updateError
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Payment verified successfully',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Error verifying payment:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})