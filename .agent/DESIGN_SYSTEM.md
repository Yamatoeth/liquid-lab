# Design System

## Visual Identity

LiquidMktplace embodies premium minimalism with a strict black and white aesthetic. Every design decision prioritizes clarity, sophistication, and developer-friendly presentation.

## Color Palette

### Primary Colors
```css
--black: #000000;      /* Primary text, headers, CTAs */
--white: #FFFFFF;      /* Backgrounds, cards */
```

### Accent Colors
```css
--grey-50: #FAFAFA;    /* Subtle backgrounds */
--grey-100: #F5F5F5;   /* Light borders, dividers */
--grey-200: #E5E5E5;   /* Medium borders */
--grey-300: #D4D4D4;   /* Disabled states */
--grey-400: #A3A3A3;   /* Secondary text */
--grey-800: #262626;   /* Hover states on black */
```

### Usage Guidelines
- **Backgrounds**: White (#FFFFFF) for main content areas
- **Cards**: White with subtle grey borders (#F5F5F5)
- **Text**: Black (#000000) for primary, Grey-400 for secondary
- **Dividers**: Grey-100 or Grey-200
- **Hover States**: Grey-50 for light elements, Grey-800 for dark

## Typography

### Font Families
**Primary**: Inter, system-ui, -apple-system
**Code**: 'JetBrains Mono', 'Fira Code', monospace

### Type Scale
```css
/* Display - Hero sections */
--text-6xl: 3.75rem;   /* 60px - Landing hero */
--text-5xl: 3rem;      /* 48px - Page headers */
--text-4xl: 2.25rem;   /* 36px - Section headers */

/* Headings */
--text-3xl: 1.875rem;  /* 30px - Card titles */
--text-2xl: 1.5rem;    /* 24px - Subsections */
--text-xl: 1.25rem;    /* 20px - Component headers */
--text-lg: 1.125rem;   /* 18px - Emphasized text */

/* Body */
--text-base: 1rem;     /* 16px - Primary text */
--text-sm: 0.875rem;   /* 14px - Secondary text */
--text-xs: 0.75rem;    /* 12px - Labels, captions */
```

### Font Weights
- **Regular**: 400 (body text)
- **Medium**: 500 (emphasized text)
- **Semibold**: 600 (subheadings)
- **Bold**: 700 (headings, CTAs)

### Line Heights
- **Tight**: 1.25 (large headings)
- **Snug**: 1.375 (small headings)
- **Normal**: 1.5 (body text)
- **Relaxed**: 1.625 (long-form content)

## Spacing System

Use 8px base unit for consistent spacing:

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
```

## Border Radius

```css
--radius-sm: 0.375rem;   /* 6px - Small elements */
--radius-md: 0.5rem;     /* 8px - Buttons, inputs */
--radius-lg: 0.75rem;    /* 12px - Cards */
--radius-xl: 1rem;       /* 16px - Large cards */
--radius-2xl: 1.5rem;    /* 24px - Hero sections */
--radius-full: 9999px;   /* Pills, avatars */
```

## Shadows

```css
/* Subtle elevation */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

/* Card elevation */
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
             0 2px 4px -1px rgba(0, 0, 0, 0.06);

/* Hover states */
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
             0 4px 6px -2px rgba(0, 0, 0, 0.05);

/* Modals, dropdowns */
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
             0 10px 10px -5px rgba(0, 0, 0, 0.04);
```

## Components

### Buttons

#### Primary Button
```css
background: #000000
color: #FFFFFF
padding: 12px 24px
border-radius: 8px
font-weight: 600
transition: all 0.2s

hover: background: #262626
active: scale(0.98)
```

#### Secondary Button
```css
background: #FFFFFF
color: #000000
border: 1px solid #E5E5E5
padding: 12px 24px
border-radius: 8px
font-weight: 600

hover: background: #FAFAFA
```

#### Ghost Button
```css
background: transparent
color: #000000
padding: 12px 24px

hover: background: #F5F5F5
```

### Cards

#### Snippet Card
```css
background: #FFFFFF
border: 1px solid #F5F5F5
border-radius: 12px
padding: 24px
box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05)

hover: 
  border-color: #E5E5E5
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1)
  transform: translateY(-2px)
```

### Input Fields

```css
background: #FFFFFF
border: 1px solid #E5E5E5
border-radius: 8px
padding: 10px 16px
font-size: 16px

focus:
  border-color: #000000
  outline: none
  ring: 2px solid rgba(0, 0, 0, 0.1)
```

### Code Blocks

```css
background: #FAFAFA
border: 1px solid #F5F5F5
border-radius: 12px
padding: 24px
font-family: 'JetBrains Mono', monospace
font-size: 14px
line-height: 1.6
overflow-x: auto

/* Syntax highlighting in monochrome */
keyword: #000000, font-weight: 600
string: #262626
comment: #A3A3A3, font-style: italic
function: #000000, font-weight: 500
```

## Layout Grid

### Container Widths
```css
--container-sm: 640px;   /* Single column content */
--container-md: 768px;   /* Forms, detail pages */
--container-lg: 1024px;  /* Product grids */
--container-xl: 1280px;  /* Main content area */
--container-2xl: 1536px; /* Maximum width */
```

### Grid System
- **Snippet Grid**: 3 columns on desktop, 2 on tablet, 1 on mobile
- **Gap**: 24px (--space-6)
- **Responsive breakpoints**: 640px, 768px, 1024px, 1280px

## Animations

### Transitions
```css
/* Standard */
transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

/* Smooth */
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

/* Bouncy (for micro-interactions) */
transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### Hover Effects
- **Cards**: translateY(-2px) + shadow increase
- **Buttons**: Background color change + scale(0.98) on active
- **Links**: Opacity to 0.7

## Accessibility

### Focus States
```css
outline: 2px solid #000000
outline-offset: 2px
```

### Minimum Contrast Ratios
- Large text (18px+): 3:1
- Normal text: 4.5:1
- Interactive elements: 3:1

### Touch Targets
Minimum size: 44px × 44px for all interactive elements

## Iconography

- **Style**: Outline icons, 2px stroke
- **Size**: 20px or 24px (use consistently)
- **Library**: Lucide React or Heroicons
- **Color**: Match surrounding text color

## Best Practices

1. **Whitespace**: Be generous. More space = premium feel
2. **Consistency**: Use design tokens, not arbitrary values
3. **Hierarchy**: Size, weight, and color establish importance
4. **Alignment**: Everything aligns to an 8px grid
5. **Mobile-first**: Design for mobile, enhance for desktop
