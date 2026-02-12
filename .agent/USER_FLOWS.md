# User Flows & Page Wireframes

## User Personas

### 1. The Developer (Primary)
- **Goal**: Find and implement Liquid snippets quickly
- **Pain Points**: Limited time, needs reliable code
- **Behavior**: Searches by feature, reads reviews, values clear documentation

### 2. The Store Owner (Secondary)
- **Goal**: Enhance store without hiring developers
- **Pain Points**: Non-technical, budget-conscious
- **Behavior**: Browses featured snippets, needs easy installation

### 3. The Agency (Growth)
- **Goal**: Access library for multiple client projects
- **Pain Points**: Needs scalable solution
- **Behavior**: Likely to subscribe, bulk implementation

---

## Core User Flows

### Flow 1: First-Time Visitor → Purchase

```
1. Land on homepage
   ↓
2. See value proposition + featured snippets
   ↓
3. Search or browse by category
   ↓
4. View snippet detail page
   ↓
5. Decision point:
   a) Buy single snippet → Stripe checkout → Access code
   b) Subscribe → Plan selection → Stripe checkout → Access all
   ↓
6. Receive email confirmation
   ↓
7. Access "My Library"
   ↓
8. Copy code and implement
```

### Flow 2: Subscriber Browsing

```
1. Sign in
   ↓
2. Browse snippets (all show "In Your Library")
   ↓
3. Click snippet to view details
   ↓
4. Access code immediately (no purchase needed)
   ↓
5. Copy and implement
   ↓
6. Return for more snippets
```

### Flow 3: Search & Filter

```
1. Enter search query
   ↓
2. See filtered results (real-time)
   ↓
3. Apply category filter
   ↓
4. Sort by newest/popular/price
   ↓
5. Click snippet card
   ↓
6. View detail page
```

---

## Page Wireframes

### 1. Landing Page

```
┌─────────────────────────────────────────────┐
│  [Logo]              [Search]    [Sign In] │
├─────────────────────────────────────────────┤
│                                             │
│          HERO SECTION                       │
│   "Premium Liquid Snippets for Shopify"    │
│   [Large Search Bar]                        │
│   [Browse Categories] [View All Snippets]  │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│   FEATURED SNIPPETS (3 cards)              │
│   [Card 1] [Card 2] [Card 3]               │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│   SUBSCRIPTION CTA                          │
│   "Unlock All Snippets"                     │
│   [Monthly Plan] [Yearly Plan]             │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│   CATEGORIES GRID                           │
│   [Header] [Product] [Cart] [Sections]     │
│   [Animations] [Utilities]                  │
│                                             │
└─────────────────────────────────────────────┘
```

**Key Elements**:
- Clear value proposition above the fold
- Prominent search bar
- Featured snippets with visual previews
- Subscription call-to-action
- Category navigation

---

### 2. Snippet Browse Page

```
┌─────────────────────────────────────────────┐
│  [Logo]    [Home] [Snippets] [Pricing]     │
│                         [Search] [Account]  │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────┐  ┌──────────────────────────┐ │
│  │ FILTERS │  │  SNIPPET GRID            │ │
│  │         │  │                          │ │
│  │ [All]   │  │  ┌────┐ ┌────┐ ┌────┐  │ │
│  │ ☑ Hdr   │  │  │    │ │    │ │    │  │ │
│  │ ☐ Prod  │  │  │ S1 │ │ S2 │ │ S3 │  │ │
│  │ ☐ Cart  │  │  │    │ │    │ │    │  │ │
│  │         │  │  └────┘ └────┘ └────┘  │ │
│  │ Price   │  │                          │ │
│  │ [0-100] │  │  ┌────┐ ┌────┐ ┌────┐  │ │
│  │         │  │  │    │ │    │ │    │  │ │
│  │ Diff.   │  │  │ S4 │ │ S5 │ │ S6 │  │ │
│  │ ☐ Begn  │  │  │    │ │    │ │    │  │ │
│  │ ☑ Inter │  │  └────┘ └────┘ └────┘  │ │
│  │ ☐ Adv   │  │                          │ │
│  └─────────┘  │  [Load More]             │ │
│               └──────────────────────────┘ │
└─────────────────────────────────────────────┘
```

**Key Elements**:
- Left sidebar filters (collapsible on mobile)
- Grid of snippet cards (3 columns desktop, 1-2 mobile)
- Clear category badges
- Price and access indicators
- Pagination or infinite scroll

---

### 3. Snippet Detail Page

```
┌─────────────────────────────────────────────┐
│  [Logo]    [< Back to Snippets]  [Account] │
├─────────────────────────────────────────────┤
│                                             │
│  ┌────────────────┐  ┌──────────────────┐  │
│  │                │  │                  │  │
│  │   PREVIEW      │  │  Mega Menu       │  │
│  │   IMAGE/VIDEO  │  │  [Header Nav]    │  │
│  │                │  │                  │  │
│  │                │  │  Full-width...   │  │
│  └────────────────┘  │                  │  │
│                      │  $29.99          │  │
│                      │                  │  │
│                      │  [Buy Snippet]   │  │
│                      │  [Subscribe All] │  │
│                      └──────────────────┘  │
├─────────────────────────────────────────────┤
│  TABS                                       │
│  [Overview] [Code] [Installation] [FAQ]    │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ OVERVIEW TAB                        │   │
│  │                                     │   │
│  │ Description text...                 │   │
│  │                                     │   │
│  │ Features:                           │   │
│  │ • Feature 1                         │   │
│  │ • Feature 2                         │   │
│  │                                     │   │
│  │ Compatible Themes: Dawn, Refresh... │   │
│  │ Difficulty: Intermediate            │   │
│  │ Installation: 10 minutes            │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  RELATED SNIPPETS                           │
│  [Card 1] [Card 2] [Card 3]                │
│                                             │
└─────────────────────────────────────────────┘
```

**Key Elements**:
- Large preview image/video
- Clear pricing and CTAs
- Tabbed content (Overview, Code, Installation)
- Metadata (difficulty, time, compatibility)
- Related snippets recommendation

---

### 4. Code Access (After Purchase/Subscribe)

```
┌─────────────────────────────────────────────┐
│  Mega Menu - Code Access                    │
├─────────────────────────────────────────────┤
│  TABS: [Liquid] [CSS] [JavaScript]          │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ LIQUID CODE           [Copy Code]   │   │
│  │ ─────────────────────────────────   │   │
│  │ 1  {% section 'header' %}           │   │
│  │ 2    <div class="mega-menu">        │   │
│  │ 3      {% for link in linklists %}  │   │
│  │ 4        <a href="{{ link.url }}">  │   │
│  │ 5          {{ link.title }}         │   │
│  │ ...                                 │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  INSTALLATION STEPS                         │
│  ─────────────────                          │
│  1. Navigate to theme editor                │
│  2. Create new section: header-menu.liquid  │
│  3. Paste the Liquid code above             │
│  4. Add CSS to theme.css.liquid            │
│  5. Save and preview                        │
│                                             │
│  CONFIGURATION OPTIONS                      │
│  ─────────────────────                      │
│  • Max Menu Width: 1200px                   │
│  • Dropdown Animation: 300ms                │
│  • Mobile Breakpoint: 768px                 │
│                                             │
└─────────────────────────────────────────────┘
```

**Key Elements**:
- Syntax-highlighted code blocks
- Easy copy buttons
- Step-by-step installation guide
- Configuration documentation
- Video tutorial (optional)

---

### 5. User Dashboard (My Library)

```
┌─────────────────────────────────────────────┐
│  [Logo]    [Home] [My Library] [Account]   │
├─────────────────────────────────────────────┤
│                                             │
│  MY LIBRARY                                 │
│  ─────────                                  │
│                                             │
│  ┌──────────────────────────────────────┐  │
│  │ Subscription Status                  │  │
│  │ ──────────────────                   │  │
│  │ ✓ All-Access Active                  │  │
│  │ Renews: Feb 1, 2025                  │  │
│  │ [Manage Subscription]                │  │
│  └──────────────────────────────────────┘  │
│                                             │
│  FILTER: [All] [Purchased] [Subscribed]    │
│                                             │
│  ┌────────────────────────────────────┐    │
│  │ SNIPPET GRID                       │    │
│  │                                    │    │
│  │  ┌──────┐  ┌──────┐  ┌──────┐    │    │
│  │  │      │  │      │  │      │    │    │
│  │  │  S1  │  │  S2  │  │  S3  │    │    │
│  │  │      │  │      │  │      │    │    │
│  │  └──────┘  └──────┘  └──────┘    │    │
│  │  [View]     [View]     [View]     │    │
│  │                                    │    │
│  └────────────────────────────────────┘    │
│                                             │
└─────────────────────────────────────────────┘
```

**Key Elements**:
- Subscription status card (if applicable)
- Grid of accessible snippets
- Quick access to code
- Filter by access type
- Download history

---

### 6. Subscription Pricing Page

```
┌─────────────────────────────────────────────┐
│  [Logo]    [Home] [Snippets] [Pricing]     │
├─────────────────────────────────────────────┤
│                                             │
│         UNLOCK ALL SNIPPETS                 │
│         Get unlimited access to our         │
│         entire library                      │
│                                             │
│  ┌──────────────┐    ┌──────────────┐      │
│  │   MONTHLY    │    │   YEARLY     │      │
│  │              │    │ [Save 30%]   │      │
│  │   $29/mo     │    │   $249/yr    │      │
│  │              │    │              │      │
│  │ ✓ Unlimited  │    │ ✓ Unlimited  │      │
│  │ ✓ Updates    │    │ ✓ Updates    │      │
│  │ ✓ Support    │    │ ✓ Support    │      │
│  │              │    │ ✓ Priority   │      │
│  │              │    │              │      │
│  │ [Subscribe]  │    │ [Subscribe]  │      │
│  └──────────────┘    └──────────────┘      │
│                                             │
│  OR BUY INDIVIDUAL SNIPPETS                 │
│  Starting at $19.99                         │
│  [Browse Snippets]                          │
│                                             │
└─────────────────────────────────────────────┘
```

**Key Elements**:
- Clear plan comparison
- Savings indicator on yearly
- Feature lists
- Alternative option (individual purchase)
- Trust indicators (money-back guarantee, etc.)

---

### 7. Checkout Page (Stripe-hosted)

```
┌─────────────────────────────────────────────┐
│  [Stripe Logo]        🔒 Secure Checkout    │
├─────────────────────────────────────────────┤
│                                             │
│  Order Summary                              │
│  ──────────                                 │
│  Mega Menu Snippet              $29.99      │
│  ─────────────────────────────────────      │
│  Total                          $29.99      │
│                                             │
│  Email                                      │
│  [user@example.com]                         │
│                                             │
│  Card Information                           │
│  [4242 4242 4242 4242]                      │
│  [MM / YY]  [CVC]                           │
│                                             │
│  Billing Address                            │
│  [Address fields...]                        │
│                                             │
│  [Pay $29.99]                               │
│                                             │
│  Powered by Stripe                          │
└─────────────────────────────────────────────┘
```

**Note**: Stripe handles the checkout UI. We redirect to Stripe Checkout.

---

## Mobile Considerations

### Key Adaptations
1. **Navigation**: Hamburger menu for categories
2. **Grid**: Single column for snippet cards
3. **Filters**: Bottom sheet or collapsible sidebar
4. **Code Blocks**: Horizontal scroll with copy button
5. **Checkout**: Stripe's mobile-optimized flow

### Touch Targets
- Minimum 44px height for all buttons
- Adequate spacing between interactive elements
- Swipe gestures for carousels

---

## Accessibility

### WCAG 2.1 AA Compliance
- Color contrast: Minimum 4.5:1 for text
- Keyboard navigation: All interactive elements accessible
- Screen reader support: Semantic HTML, ARIA labels
- Focus indicators: Visible on all focusable elements

### Best Practices
- Alt text for all images
- Descriptive link text
- Form labels and error messages
- Skip navigation links

---

## Performance Optimization

### Page Load Strategy
1. **Critical CSS**: Inline above-the-fold styles
2. **Lazy Loading**: Images and below-fold content
3. **Code Splitting**: Route-based chunks
4. **Caching**: Static assets with long cache times

### Target Metrics
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1

---

## Error States

### Common Scenarios
1. **No Results Found**: Suggest clearing filters or browsing all
2. **Payment Failed**: Clear error message, retry option
3. **Network Error**: Offline message, retry button
4. **Access Denied**: Prompt to purchase or subscribe
5. **Loading States**: Skeleton screens or spinners

### Empty States
- **No Library Items**: Encourage exploration
- **No Favorites**: Suggest popular snippets
- **Search No Results**: Similar snippets recommendation
