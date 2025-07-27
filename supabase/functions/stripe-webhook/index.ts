import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.21.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
})

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  const body = await req.text()
  
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature!,
      Deno.env.get('STRIPE_WEBHOOK_SECRET') || ''
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return new Response('Webhook signature verification failed', { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const { userId, planId } = session.metadata || {}
        const subscriptionId = session.subscription as string

        if (userId && planId) {
          // Calculate current period end (30 days for monthly, 365 days for yearly)
          const currentPeriodEnd = new Date()
          if (session.mode === 'subscription') {
            // For subscriptions, we'll get the actual period end from the subscription object
            if (subscriptionId) {
              const subscription = await stripe.subscriptions.retrieve(subscriptionId)
              currentPeriodEnd.setTime(subscription.current_period_end * 1000)
            } else {
              // Fallback: assume monthly
              currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1)
            }
          }

          // Update user subscription in database
          const { error } = await supabase
            .from('user_profiles')
            .update({ 
              subscription_tier: planId,
              stripe_subscription_id: subscriptionId,
              subscription_status: 'active',
              current_period_end: currentPeriodEnd.toISOString(),
              cancel_at_period_end: false,
              updated_at: new Date().toISOString()
            })
            .eq('id', userId)

          if (error) {
            console.error('Error updating user subscription:', error)
          } else {
            console.log(`Updated user ${userId} to ${planId} plan with period end ${currentPeriodEnd.toISOString()}`)
          }
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string
        
        // Find user by customer ID
        const customer = await stripe.customers.retrieve(customerId)
        if (customer && !customer.deleted && customer.email) {
          const updateData: any = {
            subscription_status: subscription.status,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
            updated_at: new Date().toISOString()
          }
          
          // If subscription is set to cancel at period end, don't downgrade immediately
          if (subscription.cancel_at_period_end) {
            console.log(`Subscription ${subscription.id} will cancel at period end: ${new Date(subscription.current_period_end * 1000).toISOString()}`)
          }
          
          const { error } = await supabase
            .from('user_profiles')
            .update(updateData)
            .eq('email', customer.email)

          if (error) {
            console.error('Error updating subscription status:', error)
          } else {
            console.log(`Updated subscription status for ${customer.email}`)
          }
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // Find user by customer ID and downgrade to free
        const customer = await stripe.customers.retrieve(customerId)
        if (customer && !customer.deleted && customer.email) {
          const { error } = await supabase
            .from('user_profiles')
            .update({ 
              subscription_tier: 'free',
              subscription_status: 'canceled',
              cancel_at_period_end: false,
              stripe_subscription_id: null,
              current_period_end: null,
              updated_at: new Date().toISOString()
            })
            .eq('email', customer.email)

          if (error) {
            console.error('Error downgrading user subscription:', error)
          } else {
            console.log(`Downgraded user ${customer.email} to free plan`)
          }
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return new Response('Webhook handled successfully', { status: 200 })
  } catch (error) {
    console.error('Error handling webhook:', error)
    return new Response('Webhook handler failed', { status: 500 })
  }
})