import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface CreateOrderRequest {
  amount: number;
  currency?: string;
  donor_name: string;
  donor_email: string;
  donor_phone: string;
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
      .select('razorpay_key_id, razorpay_key_secret, is_live_mode')
      .limit(1)
      .single()

    if (configError || !config || !config.razorpay_key_id || !config.razorpay_key_secret) {
      throw new Error('Payment configuration not found or incomplete')
    }

    const { amount, currency = 'INR', donor_name, donor_email, donor_phone }: CreateOrderRequest = await req.json()

    if (!amount || amount <= 0) {
      throw new Error('Invalid amount')
    }

    if (!donor_name || !donor_email || !donor_phone) {
      throw new Error('Donor information is required')
    }

    // Create Razorpay order
    const razorpayAuth = btoa(`${config.razorpay_key_id}:${config.razorpay_key_secret}`)
    
    const orderData = {
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt: `donation_${Date.now()}`,
      notes: {
        donor_name,
        donor_email,
        donor_phone,
      }
    }

    const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${razorpayAuth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    })

    if (!razorpayResponse.ok) {
      const errorText = await razorpayResponse.text()
      throw new Error(`Razorpay API error: ${errorText}`)
    }

    const razorpayOrder = await razorpayResponse.json()

    // Save donation record
    const { data: donation, error: donationError } = await supabase
      .from('donations')
      .insert({
        donor_name,
        donor_email,
        donor_phone,
        amount,
        currency,
        order_id: razorpayOrder.id,
        razorpay_order_id: razorpayOrder.id,
        status: 'pending',
      })
      .select()
      .single()

    if (donationError) {
      throw donationError
    }

    return new Response(
      JSON.stringify({
        success: true,
        order: razorpayOrder,
        donation_id: donation.id,
        key_id: config.razorpay_key_id,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Error creating payment order:', error)
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