# Type Definitions

## Database Types

Generate types from Supabase schema:

```bash
npx supabase gen types typescript --project-id your-project-id > src/types/database.types.ts
```

### Core Types

```typescript
// types/index.ts

export interface Database {
  public: {
    Tables: {
      profiles: Profile
      snippets: Snippet
      categories: Category
      purchases: Purchase
      user_snippet_access: UserSnippetAccess
      favorites: Favorite
      tags: Tag
      snippet_tags: SnippetTag
    }
    Views: {
      user_library_view: UserLibraryView
    }
    Functions: {
      has_snippet_access: {
        Args: { p_user_id: string; p_snippet_id: string }
        Returns: boolean
      }
      grant_all_snippet_access: {
        Args: { p_user_id: string }
        Returns: void
      }
    }
  }
}

// Profile
export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  subscription_status: SubscriptionStatus
  subscription_plan: SubscriptionPlan | null
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  subscription_start_date: string | null
  subscription_end_date: string | null
  created_at: string
  updated_at: string
}

export type SubscriptionStatus = 'none' | 'active' | 'canceled' | 'past_due'
export type SubscriptionPlan = 'monthly' | 'yearly'

// Snippet
export interface Snippet {
  id: string
  title: string
  slug: string
  description: string
  short_description: string | null
  category_id: string | null
  price_cents: number
  liquid_code: string
  css_code: string | null
  javascript_code: string | null
  preview_image_url: string | null
  demo_video_url: string | null
  screenshots: string[]
  compatible_themes: string[]
  shopify_version: string
  difficulty: DifficultyLevel
  installation_time: string | null
  installation_steps: InstallationStep[] | null
  configuration_options: ConfigurationOption[] | null
  downloads_count: number
  likes_count: number
  is_published: boolean
  is_featured: boolean
  created_at: string
  updated_at: string
  // Relations
  categories?: Category
  snippet_tags?: Array<{ tags: Tag }>
}

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced'

export interface InstallationStep {
  step: number
  title: string
  description: string
  code?: string
}

export interface ConfigurationOption {
  name: string
  description: string
  type: 'text' | 'number' | 'boolean' | 'color'
  default: string | number | boolean
}

// Category
export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  display_order: number
  created_at: string
}

// Purchase
export interface Purchase {
  id: string
  user_id: string
  snippet_id: string
  stripe_payment_intent_id: string
  amount_cents: number
  currency: string
  status: PurchaseStatus
  purchased_at: string
}

export type PurchaseStatus = 'pending' | 'completed' | 'refunded' | 'failed'

// User Snippet Access
export interface UserSnippetAccess {
  id: string
  user_id: string
  snippet_id: string
  access_type: AccessType
  granted_at: string
}

export type AccessType = 'purchase' | 'subscription'

// Favorite
export interface Favorite {
  id: string
  user_id: string
  snippet_id: string
  created_at: string
}

// Tag
export interface Tag {
  id: string
  name: string
  slug: string
  created_at: string
}

// Snippet Tag (Junction)
export interface SnippetTag {
  snippet_id: string
  tag_id: string
}

// User Library View
export interface UserLibraryView {
  user_id: string
  snippet_id: string
  title: string
  slug: string
  description: string
  category_id: string | null
  category_name: string | null
  preview_image_url: string | null
  access_type: AccessType
  granted_at: string
}
```

---

## Component Props

```typescript
// types/components.ts

// Snippet Components
export interface SnippetCardProps {
  snippet: Snippet
  hasAccess?: boolean
  onFavorite?: (snippetId: string) => void
  isFavorited?: boolean
}

export interface SnippetGridProps {
  snippets: Snippet[]
  userSnippetIds?: string[]
  loading?: boolean
  emptyMessage?: string
}

export interface SnippetDetailProps {
  snippet: Snippet
  hasAccess: boolean
  onPurchase: () => void
  onSubscribe: () => void
}

export interface SnippetCodeProps {
  code: string
  language: 'liquid' | 'css' | 'javascript'
  title?: string
  showLineNumbers?: boolean
}

// Filter Components
export interface CategoryFilterProps {
  categories: Category[]
  selectedId: string | null
  onSelect: (id: string | null) => void
}

export interface FilterSidebarProps {
  categories: Category[]
  tags: Tag[]
  selectedCategory: string | null
  selectedTags: string[]
  onCategoryChange: (id: string | null) => void
  onTagToggle: (tagId: string) => void
  onClearFilters: () => void
}

// Auth Components
export interface LoginFormProps {
  onSuccess?: () => void
  onSignUpClick?: () => void
}

export interface SignupFormProps {
  onSuccess?: () => void
  onLoginClick?: () => void
}

// UI Components
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  loading?: boolean
}

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error'
}
```

---

## API Response Types

```typescript
// types/api.ts

// Generic API Response
export interface APIResponse<T = any> {
  data?: T
  error?: APIError
  meta?: PaginationMeta
}

export interface APIError {
  message: string
  code: string
  statusCode: number
}

export interface PaginationMeta {
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
}

// Supabase Response Types
export type SupabaseResponse<T> = {
  data: T | null
  error: Error | null
}

// Stripe Types
export interface StripeCheckoutSession {
  id: string
  url: string
  payment_status: 'paid' | 'unpaid' | 'no_payment_required'
}

export interface StripeSubscription {
  id: string
  customer: string
  status: 'active' | 'canceled' | 'incomplete' | 'past_due' | 'trialing'
  current_period_start: number
  current_period_end: number
  plan: {
    id: string
    amount: number
    interval: 'month' | 'year'
  }
}

export interface StripeCustomer {
  id: string
  email: string
  subscriptions: {
    data: StripeSubscription[]
  }
}
```

---

## Form Types

```typescript
// types/forms.ts

// Auth Forms
export interface LoginFormData {
  email: string
  password: string
}

export interface SignupFormData {
  email: string
  password: string
  fullName: string
  acceptTerms: boolean
}

// Snippet Forms (Admin)
export interface SnippetFormData {
  title: string
  description: string
  short_description: string
  category_id: string
  price_cents: number
  liquid_code: string
  css_code?: string
  javascript_code?: string
  difficulty: DifficultyLevel
  installation_time?: string
  compatible_themes: string[]
  shopify_version: string
  is_featured: boolean
}

// Search/Filter Forms
export interface SearchFilters {
  query: string
  categoryId: string | null
  tags: string[]
  difficulty: DifficultyLevel | null
  minPrice?: number
  maxPrice?: number
  sortBy: SortOption
}

export type SortOption = 'newest' | 'popular' | 'price_asc' | 'price_desc' | 'title_asc'
```

---

## Utility Types

```typescript
// types/utils.ts

// Make all properties optional recursively
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

// Make specific properties required
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

// Omit multiple properties
export type OmitMultiple<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

// Extract specific properties
export type PickMultiple<T, K extends keyof T> = Pick<T, K>

// Snippet with category name (common query result)
export type SnippetWithCategory = Snippet & {
  category_name: string | null
}

// User with access info
export type UserWithAccess = Profile & {
  has_active_subscription: boolean
  snippet_access: string[]
}
```

---

## Hook Return Types

```typescript
// types/hooks.ts

// Auth Hook
export interface UseAuthReturn {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (data: Partial<Profile>) => Promise<void>
}

// Snippets Hook
export interface UseSnippetsReturn {
  snippets: Snippet[]
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

// User Library Hook
export interface UseUserLibraryReturn {
  library: UserLibraryView[]
  loading: boolean
  error: Error | null
  hasAccess: (snippetId: string) => boolean
  refetch: () => Promise<void>
}

// Favorites Hook
export interface UseFavoritesReturn {
  favorites: string[]
  loading: boolean
  addFavorite: (snippetId: string) => Promise<void>
  removeFavorite: (snippetId: string) => Promise<void>
  isFavorited: (snippetId: string) => boolean
}
```

---

## Context Types

```typescript
// types/context.ts

// Auth Context
export interface AuthContextValue {
  user: User | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (data: Partial<Profile>) => Promise<void>
}

// Cart Context (for multi-item purchases)
export interface CartContextValue {
  items: CartItem[]
  addItem: (snippet: Snippet) => void
  removeItem: (snippetId: string) => void
  clearCart: () => void
  total: number
}

export interface CartItem {
  snippet: Snippet
  quantity: 1 // Always 1 for digital products
}

// Toast/Notification Context
export interface ToastContextValue {
  showToast: (message: string, type: 'success' | 'error' | 'info') => void
  hideToast: () => void
}
```

---

## Validation Schemas (Zod)

```typescript
// types/validation.ts
import { z } from 'zod'

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  fullName: z.string().min(2, 'Full name is required'),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
})

// Snippet Schema
export const snippetSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  short_description: z.string().max(100, 'Short description is too long'),
  category_id: z.string().uuid('Invalid category'),
  price_cents: z.number().min(0).max(1000000),
  liquid_code: z.string().min(10, 'Code is required'),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
})

// Search Schema
export const searchSchema = z.object({
  query: z.string().max(100),
  categoryId: z.string().uuid().nullable(),
  tags: z.array(z.string().uuid()),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).nullable(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
})

// Type inference from schemas
export type LoginFormData = z.infer<typeof loginSchema>
export type SignupFormData = z.infer<typeof signupSchema>
export type SnippetFormData = z.infer<typeof snippetSchema>
export type SearchFormData = z.infer<typeof searchSchema>
```

---

## Constants

```typescript
// types/constants.ts

export const SUBSCRIPTION_PLANS = {
  MONTHLY: {
    id: 'monthly',
    name: 'Monthly',
    price: 29,
    interval: 'month',
    features: [
      'Unlimited snippet downloads',
      'Access to all categories',
      'Priority support',
      'Lifetime updates',
    ],
  },
  YEARLY: {
    id: 'yearly',
    name: 'Yearly',
    price: 249,
    interval: 'year',
    features: [
      'Unlimited snippet downloads',
      'Access to all categories',
      'Priority support',
      'Lifetime updates',
      'Save 30% vs monthly',
    ],
  },
} as const

export const DIFFICULTY_LABELS = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
} as const

export const CATEGORY_ICONS = {
  'header-navigation': 'Layout',
  'product-pages': 'ShoppingCart',
  'cart-checkout': 'CreditCard',
  sections: 'Grid',
  animations: 'Sparkles',
  utilities: 'Tool',
} as const
```
