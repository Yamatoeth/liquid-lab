# LiquidMktplace

> A premium, minimalist marketplace for Shopify Custom Liquid snippets

## Overview

LiquidMktplace is a SaaS platform designed to help Shopify developers and store owners access high-quality, ready-to-use Liquid code snippets. The platform offers both individual snippet purchases and an All-Access subscription model for unlimited downloads.

## Key Features

- **Premium Snippet Library**: Curated collection of production-ready Liquid code snippets
- **Dual Monetization**: Individual purchases or All-Access subscription
- **Developer-Friendly**: Syntax-highlighted code delivery with detailed documentation
- **Clean UX**: Minimalist, Apple-inspired interface focused on usability
- **Powerful Search & Filtering**: Find snippets by category, feature, or use case

## Tech Stack

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe (for purchases and subscriptions)
- **Code Highlighting**: Prism.js or Shiki

## Design Philosophy

### Aesthetic Principles
- **Minimalism First**: Every element serves a purpose
- **Black & White**: Strictly monochrome with subtle grey accents
- **Premium Feel**: Large border-radius, soft shadows, generous whitespace
- **Developer-Centric**: Clear code presentation, detailed documentation

### Typography
- Primary: Inter, Geist, or SF Pro
- Code Blocks: JetBrains Mono or Fira Code

### Color Palette
```
Primary Black: #000000
Primary White: #FFFFFF
Light Border: #F5F5F5
Medium Border: #E5E5E5
```

## Project Structure

```
/src
  /components
    /auth          # Login, Signup, Auth forms
    /layout        # Header, Footer, Navigation
    /snippets      # SnippetCard, SnippetGrid, SnippetDetail
    /dashboard     # User dashboard components
    /ui            # Reusable UI components
  /pages
    /landing       # Homepage
    /snippets      # Snippet browsing and detail pages
    /dashboard     # User library and account
    /checkout      # Payment flows
  /lib
    /supabase      # Supabase client configuration
    /stripe        # Stripe integration
  /hooks           # Custom React hooks
  /types           # TypeScript type definitions
  /utils           # Helper functions
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- Supabase account and project
- Stripe account (for payment processing)

### Environment Variables
Create a `.env.local` file:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### Installation
```bash
npm install
npm run dev
```

## Documentation

- [Design System](./DESIGN_SYSTEM.md) - Complete UI/UX specifications
- [Database Schema](./DATABASE_SCHEMA.md) - Supabase table structures
- [API Integration](./API_INTEGRATION.md) - Stripe and Supabase integration guide
- [Component Guide](./COMPONENT_GUIDE.md) - Component architecture and usage
- [Product Roadmap](./ROADMAP.md) - Feature development timeline

## Core User Flows

### 1. Browse & Search
User lands → Searches/filters snippets → Views snippet detail → Decides to purchase or subscribe

### 2. Individual Purchase
User selects snippet → Clicks "Buy this Snippet" → Stripe checkout → Code access granted

### 3. Subscription
User clicks "Unlock All" → Selects plan (monthly/yearly) → Stripe checkout → Full library access

### 4. Access Content
Authenticated user → Views "My Library" → Copies code → Implements in Shopify

## Next Steps

1. Set up Supabase database tables
2. Configure Stripe products and pricing
3. Build core component library
4. Implement authentication flow
5. Create snippet upload/management system
6. Develop payment integration
7. Build user dashboard

## Contributing

This is a proprietary project. Refer to internal guidelines for contribution standards.

## License

Proprietary - All rights reserved
