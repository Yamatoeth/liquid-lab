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
        const snippetId = metadata.snippet_id || null
        const email = metadata.customer_email || session.customer_details?.email || null

        if (!snippetId) {
          console.warn('No snippet_id in session metadata; skipping')
        } else if (!email) {
          console.warn('No customer email found in session; skipping')
        } else {
          // Find user by email in profiles
          const { data: user, error: userErr } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', email)
            .limit(1)
            .single()

          if (userErr) {
            console.error('Error fetching user by email:', userErr.message)
          } else if (!user) {
            console.warn('No user found for email', email)
          } else {
            const userId = user.id
            // Insert purchase record
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

            // Grant access to snippet
            const { error: aErr } = await supabase.from('user_snippet_access').insert([
              { user_id: userId, snippet_id: snippetId },
            ])
            if (aErr) console.error('Error granting access:', aErr.message)
          }
        }
      } catch (err) {
        console.error('Error handling webhook persistence:', err)
      }
    }
  }

  res.json({ received: true })
})

const PORT = process.env.PORT || 4242
app.listen(PORT, () => console.log(`Stripe webhook server listening on port ${PORT}`))
