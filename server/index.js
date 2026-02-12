import express from 'express'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const app = express()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2022-11-15' })

// Supabase server client (service role key required)
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY
let supabase
if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
} else {
  console.warn('Supabase service role key or URL missing. Server-side DB operations will be disabled.')
}

app.use(express.json())

// Create a Checkout Session
app.post('/create-checkout-session', async (req, res) => {
  const { snippetId, amount, quantity = 1, customerEmail, successUrl, cancelUrl } = req.body
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: `Snippet ${snippetId}` },
            unit_amount: Math.round(Number(amount || 0) * 100),
          },
          quantity,
        },
      ],
      success_url: successUrl || `${req.headers.origin}/?checkout=success`,
      cancel_url: cancelUrl || `${req.headers.origin}/?checkout=canceled`,
      metadata: { snippet_id: snippetId, customer_email: customerEmail },
    })
    res.json({ url: session.url, id: session.id })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

// Create a Subscription Checkout Session
app.post('/create-subscription-session', async (req, res) => {
  const { plan, customerEmail, successUrl, cancelUrl } = req.body
  try {
    const priceMap = {
      monthly: process.env.STRIPE_PRICE_MONTHLY,
      yearly: process.env.STRIPE_PRICE_YEARLY,
    }
    const priceId = priceMap[plan]
    if (!priceId) return res.status(400).json({ error: 'Invalid plan or price not configured' })

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl || `${req.headers.origin}/?checkout=success`,
      cancel_url: cancelUrl || `${req.headers.origin}/?checkout=canceled`,
      metadata: { plan },
      customer_email: customerEmail || undefined,
    })

    res.json({ url: session.url, id: session.id })
  } catch (err) {
    console.error('create-subscription-session error', err)
    res.status(500).json({ error: err.message })
  }
})

// Create a Stripe Customer Portal session
app.post('/create-portal-session', express.json(), async (req, res) => {
  const { customerId, returnUrl, email } = req.body || {}
  try {
    let cust = customerId || null
    if (!cust && email && supabase) {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('stripe_customer_id')
        .eq('email', email)
        .limit(1)
        .maybeSingle()
      if (error) console.error('Error finding profile for portal session:', error.message)
      else if (profile?.stripe_customer_id) cust = profile.stripe_customer_id
    }

    if (!cust) return res.status(400).json({ error: 'customerId or email required' })

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: cust,
      return_url: returnUrl || req.headers.origin || '',
    })

    res.json({ url: portalSession.url })
  } catch (err) {
    console.error('create-portal-session error', err)
    res.status(500).json({ error: err.message })
  }
})

// Stripe webhook endpoint
// Important: Stripe requires the raw request body for signature verification.
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature']
  let event
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    console.log('Checkout session completed:', session.id, session.metadata)

    if (!supabase) {
      console.warn('Supabase client unavailable: skipping persistence')
    } else {
      try {
        const metadata = session.metadata || {}
        const plan = metadata.plan || null
        const snippetId = metadata.snippet_id || null
        const email = metadata.customer_email || session.customer_details?.email || null

        // If no email, we cannot map to a user — warn and skip server-side persistence
        if (!email) {
          console.warn('No customer email found in session; skipping persistence')
        } else {
          // Find user by email in profiles
          const { data: user, error: userErr } = await supabase
            .from('profiles')
            .select('id, stripe_subscription_id')
            .eq('email', email)
            .limit(1)
            .maybeSingle()

          if (userErr) {
            console.error('Error fetching user by email:', userErr.message)
          } else if (!user) {
            console.warn('No user found for email', email)
          } else {
            const userId = user.id

            // --- Handle one-off purchases (snippet purchase) with idempotency ---
            if (snippetId) {
              try {
                // Skip if this session was already processed
                const { data: existingPurchase } = await supabase
                  .from('purchases')
                  .select('id')
                  .eq('stripe_session_id', session.id)
                  .limit(1)
                  .maybeSingle()

                if (existingPurchase) {
                  console.log('Purchase already recorded for session', session.id)
                } else {
                  const { error: pErr } = await supabase.from('purchases').insert([
                    {
                      user_id: userId,
                      snippet_id: snippetId,
                      amount: (session.amount_total || 0) / 100,
                      stripe_session_id: session.id,
                      status: 'completed',
                    },
                  ])
                  if (pErr) console.error('Error inserting purchase:', pErr.message)

                  // Grant access to snippet if not already granted
                  const { data: existingAccess } = await supabase
                    .from('user_snippet_access')
                    .select('id')
                    .eq('user_id', userId)
                    .eq('snippet_id', snippetId)
                    .limit(1)
                    .maybeSingle()
                  if (existingAccess) {
                    console.log('User already has access to snippet', snippetId)
                  } else {
                    const { error: aErr } = await supabase.from('user_snippet_access').insert([
                      { user_id: userId, snippet_id: snippetId, access_type: 'purchase' },
                    ])
                    if (aErr) console.error('Error granting access:', aErr.message)
                  }
                }
              } catch (err) {
                console.error('Error handling purchase persistence:', err)
              }
            }

            // --- Handle subscription sessions: idempotent update + grant library access ---
            if (plan) {
              try {
                // If this subscription id was already recorded on the profile, skip re-processing
                const subscriptionId = session.subscription || null
                if (subscriptionId && user.stripe_subscription_id === subscriptionId) {
                  console.log('Subscription already processed for subscription id', subscriptionId)
                } else {
                  // Update profile subscription fields
                  const updates = {
                    subscription_status: 'active',
                    subscription_plan: plan,
                    stripe_subscription_id: subscriptionId,
                    stripe_customer_id: session.customer || null,
                    subscription_start_date: new Date().toISOString(),
                  }
                  const { error: upErr } = await supabase.from('profiles').update(updates).eq('id', userId)
                  if (upErr) console.error('Error updating profile subscription:', upErr.message)

                  // Grant access to ALL published snippets for this user (idempotent)
                  const { data: published, error: sErr } = await supabase
                    .from('snippets')
                    .select('id')
                    .eq('is_published', true)
                  if (sErr) {
                    console.error('Error fetching published snippets:', sErr.message)
                  } else if (published && published.length > 0) {
                    const snippetIds = published.map((s) => s.id)

                    // Fetch existing access rows for this user to avoid conflicts
                    const { data: existingRows, error: exErr } = await supabase
                      .from('user_snippet_access')
                      .select('snippet_id')
                      .eq('user_id', userId)
                    if (exErr) {
                      console.error('Error fetching existing access rows:', exErr.message)
                    } else {
                      const existingIds = new Set((existingRows || []).map((r) => r.snippet_id))
                      const toInsert = snippetIds.filter((id) => !existingIds.has(id)).map((id) => ({ user_id: userId, snippet_id: id, access_type: 'subscription' }))
                      if (toInsert.length > 0) {
                        const { error: insErr } = await supabase.from('user_snippet_access').insert(toInsert)
                        if (insErr) console.error('Error granting subscription access to snippets:', insErr.message)
                        else console.log(`Granted subscription access to ${toInsert.length} snippets for user ${userId}`)
                      } else {
                        console.log('User already has access to all published snippets')
                      }
                    }
                  }
                }
              } catch (err) {
                console.error('Error handling subscription persistence:', err)
              }
            }
          }
        }
      } catch (err) {
        console.error('Error handling webhook persistence:', err)
      }
    }
  }

  // Invoice payment succeeded — used for recurring subscription renewals
  if (event.type === 'invoice.payment_succeeded') {
    const invoice = event.data.object
    try {
      const subscriptionId = invoice.subscription || null
      const customerId = invoice.customer || null
      if (!subscriptionId) {
        console.warn('invoice.payment_succeeded: no subscription id')
      } else if (!supabase) {
        console.warn('Supabase client unavailable: skipping invoice handling')
      } else {
        // Find profile by stripe_customer_id
        const { data: user, error: uErr } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .limit(1)
          .maybeSingle()
        if (uErr) console.error('Error finding profile for invoice:', uErr.message)
        else if (!user) console.warn('No profile for customer', customerId)
        else {
          const userId = user.id
          // Upsert subscription record with active status
          const currentPeriodEnd = invoice.lines?.data?.[0]?.period?.end ? new Date(invoice.lines.data[0].period.end * 1000).toISOString() : null
          await supabase.from('subscriptions').upsert([
            {
              user_id: userId,
              stripe_subscription_id: subscriptionId,
              stripe_customer_id: customerId,
              status: 'active',
              current_period_end: currentPeriodEnd,
            },
          ], { onConflict: 'stripe_subscription_id' })
          // Ensure profile shows active subscription
          await supabase.from('profiles').update({ subscription_status: 'active' }).eq('id', userId)
        }
      }
    } catch (err) {
      console.error('Error handling invoice.payment_succeeded:', err)
    }
  }

  // Subscription updated (status change, renewal, etc.)
  if (event.type === 'customer.subscription.updated') {
    const subscription = event.data.object
    try {
      const subscriptionId = subscription.id
      const customerId = subscription.customer || null
      if (!subscriptionId) {
        console.warn('customer.subscription.updated missing id')
      } else if (!supabase) {
        console.warn('Supabase client unavailable: skipping subscription update')
      } else {
        // Find profile
        const { data: user, error: uErr } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .limit(1)
          .maybeSingle()
        if (uErr) console.error('Error finding profile for subscription update:', uErr.message)
        else if (!user) console.warn('No profile for customer', customerId)
        else {
          const userId = user.id
          const updates = {
            stripe_subscription_id: subscriptionId,
            stripe_customer_id: customerId,
            status: subscription.status,
            current_period_start: subscription.current_period_start ? new Date(subscription.current_period_start * 1000).toISOString() : null,
            current_period_end: subscription.current_period_end ? new Date(subscription.current_period_end * 1000).toISOString() : null,
            price_id: subscription.items?.data?.[0]?.price?.id || null,
            plan: subscription.items?.data?.[0]?.price?.recurring?.interval || null,
          }
          await supabase.from('subscriptions').upsert([{ user_id: userId, ...updates }], { onConflict: 'stripe_subscription_id' })
          // Update profile subscription status
          await supabase.from('profiles').update({ subscription_status: subscription.status, subscription_plan: updates.plan }).eq('id', userId)
        }
      }
    } catch (err) {
      console.error('Error handling customer.subscription.updated:', err)
    }
  }

  // Subscription cancelled / deleted
  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object
    try {
      const subscriptionId = subscription.id
      const customerId = subscription.customer || null
      if (!subscriptionId) {
        console.warn('customer.subscription.deleted missing id')
      } else if (!supabase) {
        console.warn('Supabase client unavailable: skipping subscription deletion')
      } else {
        const { data: user, error: uErr } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .limit(1)
          .maybeSingle()
        if (uErr) console.error('Error finding profile for subscription deletion:', uErr.message)
        else if (!user) console.warn('No profile for customer', customerId)
        else {
          const userId = user.id
          // Mark subscription row as canceled
          await supabase.from('subscriptions').upsert([
            { user_id: userId, stripe_subscription_id: subscriptionId, status: 'canceled', canceled_at: new Date().toISOString() }
          ], { onConflict: 'stripe_subscription_id' })
          // Update profile
          await supabase.from('profiles').update({ subscription_status: 'canceled', subscription_end_date: new Date().toISOString() }).eq('id', userId)
        }
      }
    } catch (err) {
      console.error('Error handling customer.subscription.deleted:', err)
    }
  }

  res.json({ received: true })
})

const PORT = process.env.PORT || 4242
app.listen(PORT, () => console.log(`Stripe webhook server listening on port ${PORT}`))
