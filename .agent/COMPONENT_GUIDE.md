# Component Guide

## Component Architecture

LiquidMktplace follows a modular component structure with clear separation of concerns. All components are built with TypeScript and follow consistent patterns.

## Directory Structure

```
/components
  /auth
    - LoginForm.tsx
    - SignupForm.tsx
    - AuthModal.tsx
  /layout
    - Header.tsx
    - Footer.tsx
    - Navigation.tsx
    - Container.tsx
  /snippets
    - SnippetCard.tsx
    - SnippetGrid.tsx
    - SnippetDetail.tsx
    - SnippetCode.tsx
    - SnippetPreview.tsx
  /dashboard
    - LibraryGrid.tsx
    - LibraryItem.tsx
    - SubscriptionStatus.tsx
  /ui
    - Button.tsx
    - Input.tsx
    - Card.tsx
    - Badge.tsx
    - Modal.tsx
    - SearchBar.tsx
  /filters
    - CategoryFilter.tsx
    - FilterSidebar.tsx
  /checkout
    - PricingCard.tsx
    - CheckoutButton.tsx
```

---

## Core Components

### 1. SnippetCard

Display snippet in grid view with preview image, title, category, and price.

```typescript
// components/snippets/SnippetCard.tsx
import { Link } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import type { Snippet } from '@/types'

interface SnippetCardProps {
  snippet: Snippet
  hasAccess?: boolean
}

export function SnippetCard({ snippet, hasAccess = false }: SnippetCardProps) {
  const formattedPrice = (snippet.price_cents / 100).toFixed(2)

  return (
    <Link to={`/snippets/${snippet.slug}`}>
      <div className="group relative bg-white border border-grey-100 rounded-xl overflow-hidden hover:border-grey-200 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
        {/* Preview Image */}
        <div className="aspect-video bg-grey-50 overflow-hidden">
          {snippet.preview_image_url ? (
            <img
              src={snippet.preview_image_url}
              alt={snippet.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-grey-300">
              No preview
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Category Badge */}
          {snippet.categories && (
            <span className="inline-block px-3 py-1 text-xs font-medium bg-grey-50 text-black rounded-full mb-3">
              {snippet.categories.name}
            </span>
          )}

          {/* Title */}
          <h3 className="text-xl font-semibold mb-2 text-black group-hover:text-grey-800">
            {snippet.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-grey-400 mb-4 line-clamp-2">
            {snippet.short_description || snippet.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between">
            {hasAccess ? (
              <span className="text-sm font-medium text-black">
                In Your Library
              </span>
            ) : (
              <span className="text-lg font-bold text-black">
                ${formattedPrice}
              </span>
            )}

            <ShoppingCart className="w-5 h-5 text-grey-400 group-hover:text-black transition-colors" />
          </div>
        </div>
      </div>
    </Link>
  )
}
```

### 2. SnippetGrid

Grid layout for displaying multiple snippets with responsive columns.

```typescript
// components/snippets/SnippetGrid.tsx
import { SnippetCard } from './SnippetCard'
import type { Snippet } from '@/types'

interface SnippetGridProps {
  snippets: Snippet[]
  userSnippetIds?: string[]
}

export function SnippetGrid({ snippets, userSnippetIds = [] }: SnippetGridProps) {
  if (snippets.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-grey-400 text-lg">No snippets found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {snippets.map((snippet) => (
        <SnippetCard
          key={snippet.id}
          snippet={snippet}
          hasAccess={userSnippetIds.includes(snippet.id)}
        />
      ))}
    </div>
  )
}
```

### 3. SnippetCode

Syntax-highlighted code block with copy functionality.

```typescript
// components/snippets/SnippetCode.tsx
import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface SnippetCodeProps {
  code: string
  language: 'liquid' | 'css' | 'javascript'
  title?: string
}

export function SnippetCode({ code, language, title }: SnippetCodeProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-grey-50 border border-grey-100 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-grey-100">
        <span className="text-sm font-medium text-black uppercase tracking-wide">
          {title || language}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-black hover:bg-grey-100 rounded-lg transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          customStyle={{
            margin: 0,
            padding: '1.5rem',
            background: '#FAFAFA',
            fontSize: '14px',
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}
```

### 4. SearchBar

Search input with real-time filtering.

```typescript
// components/ui/SearchBar.tsx
import { Search, X } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search snippets...',
}: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-grey-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-12 pr-12 py-4 bg-white border border-grey-200 rounded-xl text-base focus:outline-none focus:border-black focus:ring-2 focus:ring-black/10 transition-all"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-grey-400 hover:text-black transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}
```

### 5. CategoryFilter

Filter snippets by category.

```typescript
// components/filters/CategoryFilter.tsx
import type { Category } from '@/types'

interface CategoryFilterProps {
  categories: Category[]
  selectedId: string | null
  onSelect: (id: string | null) => void
}

export function CategoryFilter({
  categories,
  selectedId,
  onSelect,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect(null)}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          selectedId === null
            ? 'bg-black text-white'
            : 'bg-white border border-grey-200 text-black hover:bg-grey-50'
        }`}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedId === category.id
              ? 'bg-black text-white'
              : 'bg-white border border-grey-200 text-black hover:bg-grey-50'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  )
}
```

### 6. PricingCard

Subscription plan card with features list and CTA.

```typescript
// components/checkout/PricingCard.tsx
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface PricingCardProps {
  plan: 'monthly' | 'yearly'
  price: number
  features: string[]
  onSubscribe: () => void
  highlighted?: boolean
}

export function PricingCard({
  plan,
  price,
  features,
  onSubscribe,
  highlighted = false,
}: PricingCardProps) {
  const interval = plan === 'monthly' ? 'month' : 'year'
  const savings = plan === 'yearly' ? 'Save 30%' : null

  return (
    <div
      className={`relative bg-white rounded-2xl p-8 ${
        highlighted
          ? 'border-2 border-black shadow-xl'
          : 'border border-grey-200'
      }`}
    >
      {/* Savings Badge */}
      {savings && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="inline-block px-4 py-1.5 bg-black text-white text-sm font-semibold rounded-full">
            {savings}
          </span>
        </div>
      )}

      {/* Plan Name */}
      <h3 className="text-2xl font-bold text-black mb-2 capitalize">
        {plan}
      </h3>

      {/* Price */}
      <div className="mb-6">
        <span className="text-5xl font-bold text-black">${price}</span>
        <span className="text-grey-400 ml-2">/{interval}</span>
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <Check className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
            <span className="text-grey-800">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Button
        onClick={onSubscribe}
        variant={highlighted ? 'primary' : 'secondary'}
        fullWidth
      >
        Subscribe Now
      </Button>
    </div>
  )
}
```

### 7. Button

Reusable button component with variants.

```typescript
// components/ui/Button.tsx
import { ButtonHTMLAttributes, forwardRef } from 'react'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles = 'font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'

    const variants = {
      primary: 'bg-black text-white hover:bg-grey-800 active:scale-98',
      secondary: 'bg-white text-black border border-grey-200 hover:bg-grey-50',
      ghost: 'bg-transparent text-black hover:bg-grey-50',
    }

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`
          ${baseStyles}
          ${variants[variant]}
          ${sizes[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        {...props}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading...
          </span>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
```

---

## Custom Hooks

### useAuth

```typescript
// hooks/useAuth.ts
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  return { user, loading }
}
```

### useSnippets

```typescript
// hooks/useSnippets.ts
import { useEffect, useState } from 'react'
import { fetchSnippets } from '@/lib/supabase/snippets'
import type { Snippet } from '@/types'

export function useSnippets(filters?: {
  categoryId?: string
  search?: string
}) {
  const [snippets, setSnippets] = useState<Snippet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    loadSnippets()
  }, [filters?.categoryId, filters?.search])

  async function loadSnippets() {
    try {
      setLoading(true)
      const data = await fetchSnippets(filters)
      setSnippets(data)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  return { snippets, loading, error, refetch: loadSnippets }
}
```

---

## Testing Components

```typescript
// __tests__/SnippetCard.test.tsx
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { SnippetCard } from '@/components/snippets/SnippetCard'

const mockSnippet = {
  id: '1',
  title: 'Mega Menu',
  slug: 'mega-menu',
  description: 'Full-width dropdown navigation',
  short_description: 'Dropdown nav',
  price_cents: 2999,
  preview_image_url: '/preview.jpg',
  categories: { name: 'Header' },
}

describe('SnippetCard', () => {
  it('renders snippet information', () => {
    render(
      <BrowserRouter>
        <SnippetCard snippet={mockSnippet} />
      </BrowserRouter>
    )

    expect(screen.getByText('Mega Menu')).toBeInTheDocument()
    expect(screen.getByText('$29.99')).toBeInTheDocument()
    expect(screen.getByText('Header')).toBeInTheDocument()
  })

  it('shows access indicator when user owns snippet', () => {
    render(
      <BrowserRouter>
        <SnippetCard snippet={mockSnippet} hasAccess />
      </BrowserRouter>
    )

    expect(screen.getByText('In Your Library')).toBeInTheDocument()
  })
})
```
