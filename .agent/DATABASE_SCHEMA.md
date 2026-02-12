# Database Schema

## Overview

LiquidMktplace uses Supabase (PostgreSQL) for data management. This document outlines all database tables, relationships, and key queries.

## Tables

### 1. profiles
Extends Supabase Auth users with additional profile information.

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  subscription_status TEXT CHECK (subscription_status IN ('none', 'active', 'canceled', 'past_due')),
  subscription_plan TEXT CHECK (subscription_plan IN ('monthly', 'yearly', NULL)),
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT,
  subscription_start_date TIMESTAMP WITH TIME ZONE,
  subscription_end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can read and update their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

### 2. categories
Snippet categorization (Header, Product Page, Animations, etc.)

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT, -- Icon name from icon library
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed data
INSERT INTO categories (name, slug, description, icon, display_order) VALUES
  ('Header & Navigation', 'header-navigation', 'Mega menus, sticky headers, mobile navigation', 'Layout', 1),
  ('Product Pages', 'product-pages', 'Variant selectors, image galleries, sticky ATC', 'ShoppingCart', 2),
  ('Cart & Checkout', 'cart-checkout', 'Floating carts, upsells, checkout enhancements', 'CreditCard', 3),
  ('Sections', 'sections', 'Hero sections, testimonials, feature grids', 'Grid', 4),
  ('Animations', 'animations', 'Scroll effects, hover states, transitions', 'Sparkles', 5),
  ('Utilities', 'utilities', 'Filters, search, breadcrumbs, pagination', 'Tool', 6);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Categories are publicly readable"
  ON categories FOR SELECT
  USING (true);
```

### 3. snippets
Core snippet content and metadata

```sql
CREATE TABLE snippets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT, -- For card previews
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  price_cents INTEGER NOT NULL DEFAULT 0, -- Price in cents (e.g., 2999 = $29.99)
  
  -- Code content
  liquid_code TEXT NOT NULL,
  css_code TEXT,
  javascript_code TEXT,
  
  -- Visual assets
  preview_image_url TEXT, -- Main preview image
  demo_video_url TEXT, -- Optional demo video
  screenshots JSONB DEFAULT '[]'::JSONB, -- Array of screenshot URLs
  
  -- Metadata
  compatible_themes TEXT[], -- Array of compatible theme names
  shopify_version TEXT DEFAULT '2.0', -- Minimum Shopify theme version
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  installation_time TEXT, -- e.g., "5 minutes", "15 minutes"
  
  -- Documentation
  installation_steps JSONB, -- Structured installation guide
  configuration_options JSONB, -- Customization options
  
  -- Stats
  downloads_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  
  -- Status
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_snippets_category ON snippets(category_id);
CREATE INDEX idx_snippets_published ON snippets(is_published);
CREATE INDEX idx_snippets_featured ON snippets(is_featured);
CREATE INDEX idx_snippets_slug ON snippets(slug);

-- Enable RLS
ALTER TABLE snippets ENABLE ROW LEVEL SECURITY;

-- Published snippets are publicly readable
CREATE POLICY "Published snippets are publicly readable"
  ON snippets FOR SELECT
  USING (is_published = true);
```

### 4. purchases
Individual snippet purchases

```sql
CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  snippet_id UUID REFERENCES snippets(id) ON DELETE CASCADE,
  
  -- Payment details
  stripe_payment_intent_id TEXT UNIQUE,
  amount_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'usd',
  
  -- Status
  status TEXT CHECK (status IN ('pending', 'completed', 'refunded', 'failed')),
  
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, snippet_id) -- Prevent duplicate purchases
);

-- Indexes
CREATE INDEX idx_purchases_user ON purchases(user_id);
CREATE INDEX idx_purchases_snippet ON purchases(snippet_id);

-- Enable RLS
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- Users can view their own purchases
CREATE POLICY "Users can view own purchases"
  ON purchases FOR SELECT
  USING (auth.uid() = user_id);
```

### 5. user_snippet_access
Tracks which snippets users have access to (via purchase or subscription)

```sql
CREATE TABLE user_snippet_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  snippet_id UUID REFERENCES snippets(id) ON DELETE CASCADE,
  access_type TEXT CHECK (access_type IN ('purchase', 'subscription')),
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, snippet_id)
);

-- Indexes
CREATE INDEX idx_access_user ON user_snippet_access(user_id);
CREATE INDEX idx_access_snippet ON user_snippet_access(snippet_id);

-- Enable RLS
ALTER TABLE user_snippet_access ENABLE ROW LEVEL SECURITY;

-- Users can view their own access
CREATE POLICY "Users can view own access"
  ON user_snippet_access FOR SELECT
  USING (auth.uid() = user_id);
```

### 6. favorites
User snippet favorites/bookmarks

```sql
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  snippet_id UUID REFERENCES snippets(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, snippet_id)
);

-- Indexes
CREATE INDEX idx_favorites_user ON favorites(user_id);

-- Enable RLS
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Users can manage their own favorites
CREATE POLICY "Users can view own favorites"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON favorites FOR DELETE
  USING (auth.uid() = user_id);
```

### 7. tags
Flexible tagging system for snippets

```sql
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE snippet_tags (
  snippet_id UUID REFERENCES snippets(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (snippet_id, tag_id)
);

-- Public read access
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tags are publicly readable"
  ON tags FOR SELECT
  USING (true);

ALTER TABLE snippet_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Snippet tags are publicly readable"
  ON snippet_tags FOR SELECT
  USING (true);
```

## Views

### user_library_view
Simplified view of user's accessible snippets

```sql
CREATE VIEW user_library_view AS
SELECT 
  usa.user_id,
  s.id as snippet_id,
  s.title,
  s.slug,
  s.description,
  s.category_id,
  c.name as category_name,
  s.preview_image_url,
  usa.access_type,
  usa.granted_at
FROM user_snippet_access usa
JOIN snippets s ON usa.snippet_id = s.id
LEFT JOIN categories c ON s.category_id = c.id
WHERE s.is_published = true;
```

## Functions

### Grant subscription access
Automatically grant access to all snippets when user subscribes

```sql
CREATE OR REPLACE FUNCTION grant_all_snippet_access(p_user_id UUID)
RETURNS void AS $$
BEGIN
  INSERT INTO user_snippet_access (user_id, snippet_id, access_type)
  SELECT p_user_id, id, 'subscription'
  FROM snippets
  WHERE is_published = true
  ON CONFLICT (user_id, snippet_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Check snippet access
Determine if user can access a specific snippet

```sql
CREATE OR REPLACE FUNCTION has_snippet_access(p_user_id UUID, p_snippet_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  has_access BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 
    FROM user_snippet_access 
    WHERE user_id = p_user_id 
    AND snippet_id = p_snippet_id
  ) INTO has_access;
  
  RETURN has_access;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Triggers

### Update timestamp trigger

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_snippets_updated_at
  BEFORE UPDATE ON snippets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## Key Queries

### Get user's library

```sql
SELECT * 
FROM user_library_view 
WHERE user_id = $1 
ORDER BY granted_at DESC;
```

### Search snippets

```sql
SELECT s.*, c.name as category_name
FROM snippets s
LEFT JOIN categories c ON s.category_id = c.id
WHERE s.is_published = true
  AND (
    s.title ILIKE '%' || $1 || '%'
    OR s.description ILIKE '%' || $1 || '%'
  )
ORDER BY s.created_at DESC;
```

### Featured snippets

```sql
SELECT s.*, c.name as category_name
FROM snippets s
LEFT JOIN categories c ON s.category_id = c.id
WHERE s.is_published = true AND s.is_featured = true
ORDER BY s.created_at DESC
LIMIT 6;
```

## Migration Order

1. Create `profiles` table (extends auth.users)
2. Create `categories` table
3. Create `tags` table
4. Create `snippets` table
5. Create `snippet_tags` junction table
6. Create `purchases` table
7. Create `user_snippet_access` table
8. Create `favorites` table
9. Create views
10. Create functions
11. Create triggers
