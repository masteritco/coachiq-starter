import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    })

    const { planId, billingCycle, userId, userEmail, successUrl, cancelUrl } = await req.json()

    // Price mapping for your actual Stripe Price IDs
    const priceMap = {
      starter: {
        monthly: 'price_1RpL7yINUjA7ni6Gf2xFVpij',
        yearly: 'price_1RpL7yINUjA7ni6Gf2xFVpij' // Using monthly for now
      },
      pro: {
        monthly: 'price_1RpL8dINUjA7ni6GvSzmc285',
        yearly: 'price_1RpL8dINUjA7ni6GvSzmc285' // Using monthly for now
      }
    }

    const priceId = priceMap[planId]?.[billingCycle]
    if (!priceId) {
      throw new Error(`Invalid plan: ${planId} ${billingCycle}`)
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: userEmail,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId,
        planId,
        billingCycle
      },
      subscription_data: {
        metadata: {
          userId,
          planId,
          billingCycle
        }
      }
    })

    return new Response(
      JSON.stringify({
        sessionId: session.id,
        url: session.url
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})