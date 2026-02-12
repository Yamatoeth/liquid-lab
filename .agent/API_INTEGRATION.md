# API Integration Guide

## Supabase Integration

### Setup

```typescript
// lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
```

### Authentication

#### Sign Up

```typescript
// lib/supabase/auth.ts
export async function signUp(email: string, password: string, fullName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  if (error) throw error

  // Create profile entry
  if (data.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: data.user.id,
          email: data.user.email!,
          full_name: fullName,
        },
      ])

    if (profileError) throw profileError
  }

  return data
}
```

#### Sign In

```typescript
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}
```

#### Sign Out

```typescript
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}
```

#### Get Session

```typescript
export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) throw error
  return session
}
```

### Database Queries

#### Fetch All Snippets

```typescript
// lib/supabase/snippets.ts
export async function fetchSnippets(filters?: {
  categoryId?: string
  search?: string
  featured?: boolean
}) {
  let query = supabase
    .from('snippets')
    .select(`
      *,
      categories (
        id,
        name,
        slug
      ),
      snippet_tags (
        tags (
          id,
          name,
          slug
        )
      )
    `)
    .eq('is_published', true)

  if (filters?.categoryId) {
    query = query.eq('category_id', filters.categoryId)
  }

  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }

  if (filters?.featured) {
    query = query.eq('is_featured', true)
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) throw error
  return data
}
```

#### Fetch Single Snippet

```typescript
export async function fetchSnippetBySlug(slug: string) {
  const { data, error } = await supabase
    .from('snippets')
    .select(`
      *,
      categories (
        id,
        name,
        slug
      ),
      snippet_tags (
        tags (
          id,
          name,
          slug
        )
      )
    `)
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (error) throw error
  return data
}
```

#### Check User Access

```typescript
export async function checkSnippetAccess(userId: string, snippetId: string) {
  const { data, error } = await supabase
    .rpc('has_snippet_access', {
      p_user_id: userId,
      p_snippet_id: snippetId,
    })

  if (error) throw error
  return data
}
```

#### Fetch User Library

```typescript
export async function fetchUserLibrary(userId: string) {
  const { data, error } = await supabase
    .from('user_library_view')
    .select('*')
    .eq('user_id', userId)
    .order('granted_at', { ascending: false })

  if (error) throw error
  return data
}
```

#### Add to Favorites

```typescript
export async function addFavorite(userId: string, snippetId: string) {
  const { data, error } = await supabase
    .from('favorites')
    .insert([{ user_id: userId, snippet_id: snippetId }])

  if (error) throw error
  return data
}
```

#### Remove from Favorites

```typescript
export async function removeFavorite(userId: string, snippetId: string) {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('snippet_id', snippetId)

  if (error) throw error
}
```

---

## Stripe Integration

### Setup

```typescript
// lib/stripe/client.ts
import { loadStripe } from '@stripe/stripe-js'

export const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
)
```

### Product Configuration

Create these products in Stripe Dashboard:

#### 1. Individual Snippets
- **Type**: One-time payment
- **Pricing**: Variable (set per snippet)
- **Metadata**: 
  - `type`: `snippet_purchase`
  - `snippet_id`: UUID of snippet

#### 2. Monthly Subscription
- **Type**: Recurring subscription
- **Interval**: Monthly
- **Price**: $29/month (or your pricing)
- **Metadata**:
  - `type`: `subscription`
  - `plan`: `monthly`

#### 3. Yearly Subscription
- **Type**: Recurring subscription
- **Interval**: Yearly
- **Price**: $249/year (or your pricing)
- **Metadata**:
  - `type`: `subscription`
  - `plan`: `yearly`

### One-Time Purchase Flow

```typescript
// lib/stripe/purchases.ts
import { supabase } from '@/lib/supabase/client'

export async function createSnippetCheckout(
  snippetId: string,
  userId: string
) {
  // Call your backend API to create Stripe Checkout Session
  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      snippetId,
      userId,
      mode: 'payment',
    }),
  })

  const { sessionId } = await response.json()

  // Redirect to Stripe Checkout
  const stripe = await stripePromise
  const { error } = await stripe!.redirectToCheckout({ sessionId })

  if (error) throw error
}
```

### Subscription Flow

```typescript
export async function createSubscriptionCheckout(
  plan: 'monthly' | 'yearly',
  userId: string
) {
  const response = await fetch('/api/create-subscription-checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      plan,
      userId,
    }),
  })

  const { sessionId } = await response.json()

  const stripe = await stripePromise
  const { error } = await stripe!.redirectToCheckout({ sessionId })

  if (error) throw error
}
```

### Backend Webhook Handler

```typescript
// api/stripe-webhook.ts (Node.js/Express example)
import Stripe from 'stripe'
import { supabase } from './supabase-admin' // Use service role key

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function handleStripeWebhook(req, res) {
  const sig = req.headers['stripe-signature']
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret)
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutCompleted(event.data.object)
      break

    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      await handleSubscriptionUpdate(event.data.object)
      break

    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object)
      break

    case 'invoice.payment_succeeded':
      await handlePaymentSucceeded(event.data.object)
      break

    case 'invoice.payment_failed':
      await handlePaymentFailed(event.data.object)
      break
  }

  res.json({ received: true })
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId
  const type = session.metadata?.type

  if (type === 'snippet_purchase') {
    const snippetId = session.metadata?.snippetId
    const amountCents = session.amount_total

    // Record purchase
    await supabase.from('purchases').insert([
      {
        user_id: userId,
        snippet_id: snippetId,
        stripe_payment_intent_id: session.payment_intent,
        amount_cents: amountCents,
        status: 'completed',
      },
    ])

    // Grant access
    await supabase.from('user_snippet_access').insert([
      {
        user_id: userId,
        snippet_id: snippetId,
        access_type: 'purchase',
      },
    ])
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string
  
  // Find user by Stripe customer ID
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (!profile) return

  // Update subscription status
  await supabase
    .from('profiles')
    .update({
      subscription_status: subscription.status,
      subscription_plan: subscription.metadata?.plan,
      stripe_subscription_id: subscription.id,
      subscription_start_date: new Date(subscription.current_period_start * 1000).toISOString(),
      subscription_end_date: new Date(subscription.current_period_end * 1000).toISOString(),
    })
    .eq('id', profile.id)

  // Grant access to all snippets if active
  if (subscription.status === 'active') {
    await supabase.rpc('grant_all_snippet_access', { p_user_id: profile.id })
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (!profile) return

  // Update subscription status
  await supabase
    .from('profiles')
    .update({
      subscription_status: 'canceled',
    })
    .eq('id', profile.id)

  // Remove subscription-based access
  await supabase
    .from('user_snippet_access')
    .delete()
    .eq('user_id', profile.id)
    .eq('access_type', 'subscription')
}
```

### Customer Portal

```typescript
export async function createCustomerPortalSession(customerId: string) {
  const response = await fetch('/api/create-portal-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customerId }),
  })

  const { url } = await response.json()
  window.location.href = url
}
```

---

## Real-time Subscriptions

### Listen to User Profile Changes

```typescript
// hooks/useProfile.ts
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export function useProfile(userId: string) {
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    // Fetch initial profile
    fetchProfile()

    // Subscribe to changes
    const subscription = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          setProfile(payload.new)
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [userId])

  async function fetchProfile() {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    setProfile(data)
  }

  return profile
}
```

---

## Error Handling

```typescript
// lib/errors.ts
export class APIError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message)
    this.name = 'APIError'
  }
}

export function handleSupabaseError(error: any) {
  console.error('Supabase Error:', error)
  
  switch (error.code) {
    case '23505': // Unique violation
      throw new APIError('This record already exists', 'DUPLICATE_RECORD', 409)
    case '23503': // Foreign key violation
      throw new APIError('Referenced record not found', 'NOT_FOUND', 404)
    case 'PGRST116': // Row not found
      throw new APIError('Record not found', 'NOT_FOUND', 404)
    default:
      throw new APIError(error.message || 'Database error', 'DB_ERROR', 500)
  }
}

export function handleStripeError(error: any) {
  console.error('Stripe Error:', error)
  
  throw new APIError(
    error.message || 'Payment processing error',
    'PAYMENT_ERROR',
    402
  )
}
```

---

## Testing

### Mock Supabase Client

```typescript
// __mocks__/supabase.ts
export const mockSupabase = {
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: {}, error: null }),
  })),
  auth: {
    signUp: jest.fn(),
    signInWithPassword: jest.fn(),
    signOut: jest.fn(),
    getSession: jest.fn(),
  },
}
```

### Stripe Test Cards

```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
Requires Authentication: 4000 0025 0000 3155
```
