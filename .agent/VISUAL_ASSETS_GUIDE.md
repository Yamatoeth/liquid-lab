# Visual Assets Guide

## Overview

LiquidMktplace requires two types of visual assets:
1. **Product Visuals** - Accurate screenshots of actual code output (builds trust)
2. **Marketing Visuals** - Premium aesthetic images for branding (builds desire)

This guide defines the strategy, tools, and processes for creating and maintaining all visual assets.

---

## Visual Asset Types

### 1. Product Screenshots (Technical Proof)

**Purpose:** Show developers exactly what the code produces

**Requirements:**
- Must be actual rendered output of the Liquid code
- Multiple views: Desktop, Mobile, Hover states
- Clean, minimal context (focus on the snippet)
- Consistent dimensions and quality

**File Naming Convention:**
```
snippets/{slug}/preview-desktop.png      (1200x800px)
snippets/{slug}/preview-mobile.png       (375x667px)
snippets/{slug}/preview-hover.png        (1200x800px)
snippets/{slug}/preview-interaction.gif  (optional animation)
```

**Use Cases:**
- Main image on snippet detail page
- Thumbnail in snippet grid
- "What you'll get" section
- Installation guide reference

---

### 2. Marketing Visuals (Brand Assets)

**Purpose:** Create premium aesthetic and category identity

**Requirements:**
- Abstract, high-end design
- Consistent with black/white brand palette
- Evokes the category purpose (not literal code)
- Professional, polished finish

**File Naming Convention:**
```
marketing/hero-background.png
marketing/category-{slug}-header.png
marketing/feature-{name}.png
marketing/social-og-image.png
```

**Use Cases:**
- Landing page hero section
- Category page headers
- Email marketing headers
- Social media posts
- Blog post featured images

---

## Production Strategy

### Phase 1: MVP Launch (Week 1-2)
**Goal:** Get first 10 snippets live with real screenshots

**Method:** Manual Shopify Screenshots
- Create test Shopify store (Partner account, free)
- Use Dawn theme (clean, modern default)
- Install snippet code manually
- Take screenshots at standard sizes
- Basic editing in browser DevTools

**Time Investment:** 15-30 minutes per snippet

**Deliverable:** 10 snippets with real screenshots

---

### Phase 2: Automation (Week 3-4)
**Goal:** Build automated screenshot generator

**Method:** Puppeteer/Playwright Script
- Automated browser automation
- Inject code into minimal HTML template
- Capture at multiple breakpoints
- Save to Supabase Storage
- Generate on snippet creation

**Time Investment:** 2-3 days to build, then automatic

**Deliverable:** Screenshot generator CLI tool

---

### Phase 3: Premium Polish (Week 5-6)
**Goal:** Add marketing visuals for brand elevation

**Method:** AI-Generated Art (Gemini, Midjourney, Claude Artifacts)
- Generate abstract category visuals
- Create hero section backgrounds
- Design email templates
- Social media assets

**Time Investment:** 2-4 hours total

**Deliverable:** Complete marketing asset library

---

## Screenshot Specifications

### Desktop Screenshots
```
Dimensions: 1200 × 800px
Format: PNG
Quality: High (90%)
Background: White (#FFFFFF)
Device: 1920px viewport
Browser: Chromium (consistent rendering)
```

### Mobile Screenshots
```
Dimensions: 375 × 667px (iPhone SE)
Format: PNG
Quality: High (90%)
Background: White (#FFFFFF)
Device: iPhone SE viewport
Browser: Chromium mobile emulation
```

### Hover State Screenshots
```
Dimensions: 1200 × 800px
Format: PNG
Trigger: :hover CSS state
Capture: After hover animation completes
```

### Interactive Demos (Optional)
```
Format: GIF or MP4
Duration: 3-5 seconds
Loop: Yes
FPS: 30
Size: < 2MB
```

---

## Manual Screenshot Process

### Setup (One-Time)

1. **Create Shopify Partner Account**
   - Go to https://partners.shopify.com
   - Sign up for free account
   - Create development store

2. **Install Dawn Theme**
   - Use latest Dawn theme (free, modern)
   - Minimal customization for clean screenshots

3. **Prepare Screenshot Tools**
   - Browser: Chrome/Firefox (consistent)
   - Extensions: Full Page Screen Capture
   - Editor: Browser DevTools (resize viewport)

### Per-Snippet Workflow

**Step 1: Install Code**
```
1. Copy Liquid code to appropriate theme file
2. Copy CSS to assets/theme.css
3. Copy JavaScript to assets/custom.js
4. Save and preview
```

**Step 2: Prepare View**
```
1. Open theme preview in browser
2. Navigate to page showing snippet
3. Resize window to 1920px width
4. Remove unnecessary elements (header/footer if needed)
5. Scroll to center snippet in view
```

**Step 3: Capture Desktop**
```
1. Use DevTools to set viewport: 1920 × 1080
2. Take screenshot (Cmd+Shift+5 on Mac)
3. Crop to 1200 × 800px (centered on snippet)
4. Save as: preview-desktop.png
```

**Step 4: Capture Mobile**
```
1. Toggle device toolbar (Cmd+Shift+M)
2. Select "iPhone SE" preset
3. Screenshot the viewport
4. Crop to 375 × 667px
5. Save as: preview-mobile.png
```

**Step 5: Capture Hover State (if applicable)**
```
1. Right-click element → Inspect
2. Force :hover state in Styles panel
3. Wait for animation to complete
4. Screenshot
5. Save as: preview-hover.png
```

**Step 6: Upload to Supabase**
```
1. Go to Supabase Storage
2. Upload to: snippets/{slug}/
3. Copy public URL
4. Update snippet record: preview_image_url
```

---

## Automated Screenshot Generator

### Tool: Puppeteer Script

**File:** `scripts/generate-screenshot.js`

```javascript
const puppeteer = require('puppeteer');
const fs = require('fs');

async function generateScreenshot(snippet) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Desktop screenshot
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setContent(buildHTML(snippet));
  await page.screenshot({
    path: `screenshots/${snippet.slug}-desktop.png`,
    clip: { x: 360, y: 140, width: 1200, height: 800 }
  });

  // Mobile screenshot
  await page.setViewport({ width: 375, height: 667 });
  await page.screenshot({
    path: `screenshots/${snippet.slug}-mobile.png`,
    fullPage: false
  });

  await browser.close();
}

function buildHTML(snippet) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #ffffff;
            padding: 40px;
          }
          ${snippet.css_code || ''}
        </style>
      </head>
      <body>
        ${snippet.liquid_code}
        <script>${snippet.javascript_code || ''}</script>
      </body>
    </html>
  `;
}

module.exports = { generateScreenshot };
```

### Usage

```bash
# Generate for single snippet
node scripts/generate-screenshot.js --slug mega-menu

# Batch generate for all snippets
node scripts/generate-screenshot.js --all

# Upload to Supabase after generation
node scripts/generate-screenshot.js --slug mega-menu --upload
```

### Integration with Admin

When admin creates/updates snippet:
1. Code is saved to database
2. Trigger screenshot generation
3. Upload to Supabase Storage
4. Update snippet.preview_image_url
5. Show success confirmation

---

## Marketing Visual Guidelines

### Category Headers

**Specifications:**
```
Dimensions: 1920 × 400px
Format: PNG or WebP
Style: Abstract, minimal, monochrome
Elements: Geometric shapes, gradients, patterns
Text: None (headers added in HTML)
```

**Example Prompts for AI Generation:**

**Header & Navigation:**
```
"Abstract minimal black and white geometric composition representing 
navigation and wayfinding, clean lines, premium aesthetic, 
high contrast, modern"
```

**Product Pages:**
```
"Minimalist abstract visualization of product display and commerce, 
flowing shapes, black and white gradient, sophisticated, elegant"
```

**Cart & Checkout:**
```
"Abstract geometric representation of shopping and transactions, 
circular flow, monochrome palette, premium finish"
```

**Sections:**
```
"Modular grid-based abstract composition, building blocks metaphor, 
clean geometric shapes, black and white, architectural"
```

**Animations:**
```
"Dynamic motion visualization, flowing curves and particles, 
monochrome, energy and movement, abstract minimal"
```

**Utilities:**
```
"Technical precision tools abstract composition, clean lines, 
geometric accuracy, black and white, minimalist"
```

### Hero Section Background

**Specifications:**
```
Dimensions: 2880 × 1800px (high-res for retina)
Format: WebP (smaller file size)
Style: Subtle, doesn't compete with text
Opacity: 5-10% (very faint)
Pattern: Geometric or gradient
```

**Example Prompt:**
```
"Ultra-minimal abstract background pattern, very subtle geometric 
grid, barely visible, monochrome, high-end SaaS aesthetic, 
premium white space"
```

### Social Media Assets

**Open Graph Image (og:image):**
```
Dimensions: 1200 × 630px
Format: PNG
Content: Logo + tagline + visual element
Text: Large, readable at thumbnail size
```

**Twitter Card:**
```
Dimensions: 1200 × 675px
Format: PNG
Similar to OG image but 16:9 ratio
```

**Template:**
```
┌─────────────────────────────────────┐
│                                     │
│         [Logo]                      │
│                                     │
│    Premium Liquid Snippets          │
│       for Shopify Stores            │
│                                     │
│    [Abstract visual element]        │
│                                     │
└─────────────────────────────────────┘
```

---

## Quality Standards

### Screenshot Quality Checklist

- [ ] Snippet is clearly visible and centered
- [ ] No browser UI visible (address bar, bookmarks)
- [ ] No Lorem Ipsum or placeholder text
- [ ] Clean, realistic demo content
- [ ] Proper cropping (no extra whitespace)
- [ ] Consistent lighting/shadows
- [ ] File size < 500KB (optimized)
- [ ] Correct dimensions
- [ ] High resolution (2x for retina)

### Marketing Visual Checklist

- [ ] Matches brand aesthetic (black/white/minimal)
- [ ] Professional finish (no amateur effects)
- [ ] Evokes category purpose
- [ ] Works at various sizes
- [ ] File size optimized for web
- [ ] No copyright issues (100% original or licensed)

---

## Asset Storage Structure

### Supabase Storage Buckets

```
snippets/
├── mega-menu/
│   ├── preview-desktop.png
│   ├── preview-mobile.png
│   ├── preview-hover.png
│   └── demo.gif (optional)
├── sticky-add-to-cart/
│   ├── preview-desktop.png
│   └── preview-mobile.png
└── ...

marketing/
├── categories/
│   ├── header-navigation.png
│   ├── product-pages.png
│   ├── cart-checkout.png
│   ├── sections.png
│   ├── animations.png
│   └── utilities.png
├── hero/
│   ├── background-pattern.webp
│   └── background-gradient.webp
└── social/
    ├── og-image.png
    └── twitter-card.png
```

### File Size Limits

```
Product Screenshots:  < 500KB each
Marketing Headers:    < 200KB each
Hero Backgrounds:     < 100KB (heavily optimized)
Social Images:        < 300KB each
```

---

## Image Optimization

### Optimization Tools

**Automated (Recommended):**
```bash
# Install sharp for Node.js
npm install sharp

# Optimize all images
node scripts/optimize-images.js
```

**Manual Options:**
- TinyPNG (https://tinypng.com) - Web-based
- ImageOptim (Mac) - Desktop app
- Squoosh (https://squoosh.app) - Web-based

### Optimization Settings

**PNG Screenshots:**
```
Quality: 90%
Strip metadata: Yes
Progressive: No (PNG doesn't support)
```

**WebP (for marketing):**
```
Quality: 85%
Lossless: No
Effort: 6 (balanced)
```

---

## Maintenance & Updates

### When to Regenerate Screenshots

- [ ] Snippet code is updated
- [ ] Visual bug is fixed
- [ ] Shopify theme version changes significantly
- [ ] User reports inaccurate preview

### When to Create New Marketing Visuals

- [ ] New category is added
- [ ] Brand refresh/rebrand
- [ ] Special promotion or season
- [ ] A/B testing different styles

### Quarterly Audit

Every 3 months, review:
1. Screenshot accuracy (code vs. image)
2. File sizes (optimization opportunities)
3. Broken image links
4. Outdated marketing visuals
5. User feedback on visuals

---

## Alternative Approaches (Not Recommended)

### ❌ Figma Mockups
**Why avoid:** Not actual code output, trust issue

**When to use:** Never for product screenshots, only for design exploration

### ❌ Stock Photos
**Why avoid:** Generic, no connection to actual snippets

**When to use:** Absolutely never

### ❌ Hand-drawn Illustrations
**Why avoid:** Doesn't match minimalist aesthetic, time-consuming

**When to use:** Blog posts or educational content (not product pages)

---

## Quick Reference

### First 10 Snippets (This Week)

**Method:** Manual Shopify screenshots
**Time:** 3-4 hours total
**Tools:** Shopify Partner store, browser screenshot
**Output:** 10 snippets × 2 images = 20 screenshots

### Automation Setup (Next Week)

**Method:** Build Puppeteer script
**Time:** 2-3 days development
**Tools:** Node.js, Puppeteer, Supabase SDK
**Output:** Automated screenshot generation

### Marketing Polish (Week 3)

**Method:** AI-generated art
**Time:** 2-4 hours
**Tools:** Claude Artifacts, Midjourney, or Gemini
**Output:** 6 category headers + 1 hero background

---

## Success Metrics

**Product Screenshots:**
- Conversion rate: 15%+ increase with real screenshots
- Support tickets: 50%+ reduction ("Is this accurate?")
- Trust indicators: Reviews mention "exactly as shown"

**Marketing Visuals:**
- Premium perception: User feedback mentions "professional"
- Social sharing: Higher engagement with branded images
- Brand recall: Consistent visual identity

---

## Resources

**Puppeteer Documentation:**
https://pptr.dev/

**Shopify Partner Program:**
https://partners.shopify.com/

**Image Optimization:**
https://squoosh.app/

**AI Image Generation:**
- Claude Artifacts (for geometric/abstract)
- Midjourney (for premium aesthetic)
- Stable Diffusion (free, self-hosted)

**Design Inspiration:**
- Linear.app (minimal SaaS aesthetic)
- Stripe.com (clean product screenshots)
- Vercel.com (premium developer tools)
