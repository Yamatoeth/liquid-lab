export interface Snippet {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  image: string;
  code: string;
  features: string[];
}

export const categories = [
  "All",
  "Header",
  "Product Page",
  "Cart",
  "Sections",
  "Animations",
  "Footer",
  "Utilities",
  "React",
  "TypeScript",
  "Backend",
  "UX",
  "Forms",
  "Performance",
  "Media",
  "Accessibility",
  "PWA",
];

export const snippets: Snippet[] = [
  {
    id: "mega-menu",
    title: "Mega Menu",
    description: "A fully responsive mega menu with multi-column dropdowns, image support, and smooth animations. Drop-in ready for any Shopify theme.",
    category: "Header",
    price: 29,
    image: "",
    code: `{% comment %} Mega Menu - LiquidMktplace {% endcomment %}
<nav class="mega-menu" x-data="{ open: null }">
  {% for link in linklists.main-menu.links %}
    <div class="mega-menu__item"
         @mouseenter="open = '{{ link.title }}'"
         @mouseleave="open = null">
      <a href="{{ link.url }}" class="mega-menu__link">
        {{ link.title }}
        {% if link.links.size > 0 %}
          <svg class="mega-menu__chevron">...</svg>
        {% endif %}
      </a>
      {% if link.links.size > 0 %}
        <div class="mega-menu__dropdown"
             x-show="open === '{{ link.title }}'"
             x-transition>
          {% for child in link.links %}
            <a href="{{ child.url }}">{{ child.title }}</a>
          {% endfor %}
        </div>
      {% endif %}
    </div>
  {% endfor %}
</nav>`,
    features: ["Responsive design", "Multi-column layout", "Image support", "Smooth transitions"],
  },
  {
    id: 'debounce-ts',
    title: 'Debounce Utility (TypeScript)',
    description: 'Small, strongly-typed debounce helper for event handlers and input processing.',
    category: 'Utilities',
    price: 0,
    image: '',
    code: `export function debounce<T extends (...args: any[]) => any>(fn: T, wait = 200) {
  let timer: ReturnType<typeof setTimeout> | null = null
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), wait)
  }
}

// Usage:
// const onChange = debounce((v: string) => fetchSuggestions(v), 300)
`,
    features: ['Strongly typed', 'Small footprint', 'Easy to reuse'],
  },
  {
    id: 'throttle-js',
    title: 'Throttle Utility (JS)',
    description: 'Lightweight throttle function for scroll/resize events to improve performance.',
    category: 'Utilities',
    price: 0,
    image: '',
    code: `export function throttle(fn, wait = 100) {
  let last = 0
  return function(...args) {
    const now = Date.now()
    if (now - last >= wait) {
      last = now
      fn.apply(this, args)
    }
  }
}
`,
    features: ['Performance', 'Simple API', 'No dependencies'],
  },
  {
    id: 'fetch-retry',
    title: 'Fetch with Retry',
    description: 'A small wrapper around fetch that retries transient failures with exponential backoff.',
    category: 'Utilities',
    price: 0,
    image: '',
    code: `export async function fetchWithRetry(input, init = {}, retries = 3, backoff = 300) {
  try {
    const res = await fetch(input, init)
    if (!res.ok) throw new Error('Fetch failed: ' + res.status)
    return res
  } catch (err) {
    if (retries <= 0) throw err
    await new Promise((r) => setTimeout(r, backoff))
    return fetchWithRetry(input, init, retries - 1, backoff * 2)
  }
}
`,
    features: ['Retries', 'Exponential backoff', 'Network resilience'],
  },
  {
    id: 'react-search-autocomplete',
    title: 'React Search Autocomplete (TSX)',
    description: 'Accessible search autocomplete component with keyboard navigation and debounced queries.',
    category: 'React',
    price: 9,
    image: '',
    code: `import React, { useState, useEffect, useRef } from 'react'
import { debounce } from '@/utils/debounce'

export default function SearchAutocomplete({ onSelect }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [open, setOpen] = useState(false)
  const active = useRef(-1)

  useEffect(() => {
    if (!query) return setResults([])
    const handler = debounce(async () => {
      const r = await fetch('/api/search?q=' + encodeURIComponent(query)).then(r => r.json())
      setResults(r)
      setOpen(true)
    }, 250)
    handler()
  }, [query])

  return (
    <div className="autocomplete">
      <input aria-autocomplete="list" value={query} onChange={e => setQuery(e.target.value)} />
      {open && results.length > 0 && (
        <ul role="listbox">
          {results.map((r, i) => (
            <li key={r.id} role="option" aria-selected={active.current === i} onClick={() => onSelect(r)}>{r.title}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
`,
    features: ['Keyboard accessible', 'Debounced', 'Lightweight'],
  },
  {
    id: 'react-modal',
    title: 'Accessible React Modal',
    description: 'A small, accessible modal component that traps focus and restores it on close.',
    category: 'React',
    price: 12,
    image: '',
    code: `import React, { useEffect, useRef } from 'react'
export default function Modal({ open, onClose, children }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return
    const prev = document.activeElement
    ref.current?.focus()
    return () => { prev?.focus?.() }
  }, [open])
  if (!open) return null
  return (
    <div role="dialog" aria-modal="true" className="modal">
      <div tabIndex={-1} ref={ref}>{children}</div>
      <button onClick={onClose}>Close</button>
    </div>
  )
}
`,
    features: ['Focus trap', 'ARIA-friendly', 'Small footprint'],
  },
  {
    id: 'typescript-utility-types',
    title: 'TypeScript: DeepPartial & OmitRecursively',
    description: 'Helpful TypeScript utility types for partial updates and nested omit operations.',
    category: 'TypeScript',
    price: 0,
    image: '',
    code: `export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type OmitRecursively<T, K extends keyof any> = T extends object
  ? { [P in Exclude<keyof T, K>]: OmitRecursively<T[P], K> }
  : T
`,
    features: ['Deep partials', 'Recursive utilities', 'Type safety'],
  },
  {
    id: 'supabase-auth-helper',
    title: 'Supabase Auth Helper (SSR-friendly)',
    description: 'Server-side helper to verify Supabase auth and fetch user profile for SSR/edge functions.',
    category: 'Backend',
    price: 0,
    image: '',
    code: `import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
export async function getServerUser(ctx) {
  const supabase = createServerSupabaseClient(ctx)
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return null
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle()
  return { session, profile }
}
`,
    features: ['SSR friendly', 'Auth verification', 'Profile fetch'],
  },
  {
    id: 'stripe-create-portal-snippet',
    title: 'Server: Create Stripe Portal Session',
    description: 'Minimal Express handler that creates a Stripe Customer Portal session (example for server/index.js).',
    category: 'Backend',
    price: 0,
    image: '',
    code: `app.post('/create-portal-session', async (req, res) => {
  const { customerId, returnUrl } = req.body
  if (!customerId) return res.status(400).json({ error: 'customerId required' })
  const session = await stripe.billingPortal.sessions.create({ customer: customerId, return_url: returnUrl })
  res.json({ url: session.url })
})
`,
    features: ['Stripe Billing Portal', 'Server-side safe', 'One-endpoint example'],
  },
  {
    id: 'skip-link',
    title: 'Accessible Skip Link',
    description: 'A classic skip-to-content link that becomes visible on keyboard focus — small but high-impact for a11y.',
    category: 'Accessibility',
    price: 0,
    image: '',
    code: `<a class="skip-link" href="#content">Skip to content</a>
<style>
.skip-link{position:absolute;left:-999px;top:auto;width:1px;height:1px;overflow:hidden}
.skip-link:focus{position:static;width:auto;height:auto;left:0}
</style>`,
    features: ['Keyboard access', 'WCAG friendly', 'Tiny code'],
  },
  {
    id: 'form-validate-vanilla',
    title: 'Vanilla JS Form Validation',
    description: 'Client-side form validation with patterns, custom messages, and submit blocking.',
    category: 'Forms',
    price: 0,
    image: '',
    code: `document.querySelector('form').addEventListener('submit', (e) => {
  const email = e.target.querySelector('[name=email]')
  if (!/^[^@]+@[^@]+\.[^@]+$/.test(email.value)) {
    e.preventDefault()
    email.setCustomValidity('Please enter a valid email')
    email.reportValidity()
  }
})
`,
    features: ['No library', 'Custom messages', 'Progressive enhancement'],
  },
  {
    id: 'lazy-image',
    title: 'Lazy Image Component (IntersectionObserver)',
    description: 'Lightweight lazy-loading image element using IntersectionObserver with low-res placeholder support.',
    category: 'Performance',
    price: 0,
    image: '',
    code: `class LazyImage extends HTMLElement {
  connectedCallback() {
    const src = this.getAttribute('data-src')
    const img = document.createElement('img')
    img.alt = this.getAttribute('alt') || ''
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          img.src = src
          obs.disconnect()
        }
      })
    })
    this.appendChild(img)
    obs.observe(this)
  }
}
customElements.define('lazy-image', LazyImage)
`,
    features: ['IntersectionObserver', 'Custom element', 'Placeholder support'],
  },
  {
    id: 'skeleton-loader',
    title: 'Skeleton Loader CSS',
    description: 'A small CSS-only skeleton loader for cards and content placeholders.',
    category: 'UX',
    price: 0,
    image: '',
    code: `.skeleton{background:linear-gradient(90deg,#f0f0f0 25%,#e6e6e6 50%,#f0f0f0 75%);background-size:200% 100%;animation:shimmer 1.2s infinite}
@keyframes shimmer{to{background-position:-200% 0}}`,
    features: ['CSS only', 'Easy to style', 'Performance friendly'],
  },
  {
    id: "floating-cart",
    title: "Floating Cart Drawer",
    description: "A sleek slide-out cart drawer with upsell recommendations, quantity controls, and real-time price updates.",
    category: "Cart",
    price: 39,
    image: "",
    code: `{% comment %} Floating Cart Drawer - LiquidMktplace {% endcomment %}
<div id="cart-drawer" class="cart-drawer" x-data="cartDrawer()">
  <div class="cart-drawer__overlay" @click="close()"></div>
  <div class="cart-drawer__content">
    <header class="cart-drawer__header">
      <h2>Your Cart ({{ cart.item_count }})</h2>
      <button @click="close()">&times;</button>
    </header>
    <div class="cart-drawer__items">
      {% for item in cart.items %}
        <div class="cart-drawer__item">
          <img src="{{ item.image | img_url: '120x' }}" />
          <div>
            <p>{{ item.title }}</p>
            <p>{{ item.price | money }}</p>
          </div>
        </div>
      {% endfor %}
    </div>
  </div>
</div>`,
    features: ["Slide-out animation", "Upsell section", "Quantity controls", "Free shipping bar"],
  },
  {
    id: "sticky-atc",
    title: "Sticky Add to Cart",
    description: "A sticky add-to-cart bar that appears on scroll with variant selector, quantity picker, and dynamic pricing.",
    category: "Product Page",
    price: 24,
    image: "",
    code: `{% comment %} Sticky ATC - LiquidMktplace {% endcomment %}
<div class="sticky-atc" x-data="stickyAtc()" x-show="visible">
  <div class="sticky-atc__inner">
    <img src="{{ product.featured_image | img_url: '60x' }}" />
    <span class="sticky-atc__title">{{ product.title }}</span>
    <span class="sticky-atc__price">{{ product.price | money }}</span>
    <button class="sticky-atc__button" @click="addToCart()">
      Add to Cart
    </button>
  </div>
</div>`,
    features: ["Scroll-triggered", "Variant selector", "Dynamic pricing", "Mobile optimized"],
  },
  {
    id: "announcement-bar",
    title: "Animated Announcement Bar",
    description: "A marquee-style announcement bar with smooth scrolling text, countdown timer support, and customizable styling.",
    category: "Header",
    price: 19,
    image: "",
    code: `{% comment %} Announcement Bar - LiquidMktplace {% endcomment %}
<div class="announcement-bar">
  <div class="announcement-bar__track">
    {% for block in section.blocks %}
      <span class="announcement-bar__item">
        {{ block.settings.text }}
      </span>
    {% endfor %}
  </div>
</div>`,
    features: ["Marquee animation", "Countdown timer", "Multiple messages", "Customizable colors"],
  },
  {
    id: "image-hotspots",
    title: "Image Hotspots",
    description: "Interactive image hotspots that reveal product information on hover. Perfect for lookbook and lifestyle pages.",
    category: "Sections",
    price: 34,
    image: "",
    code: `{% comment %} Image Hotspots - LiquidMktplace {% endcomment %}
<div class="image-hotspots" x-data="{ active: null }">
  <img src="{{ section.settings.image | img_url: 'master' }}" />
  {% for block in section.blocks %}
    <button class="hotspot"
            style="top: {{ block.settings.y }}%; left: {{ block.settings.x }}%"
            @click="active = {{ forloop.index }}">
      <span class="hotspot__pulse"></span>
    </button>
  {% endfor %}
</div>`,
    features: ["Click/hover reveal", "Product linking", "Animated pulse", "Mobile responsive"],
  },
  {
    id: "scroll-animations",
    title: "Scroll Reveal Animations",
    description: "A lightweight scroll animation system using Intersection Observer. Fade, slide, and scale effects for any element.",
    category: "Animations",
    price: 19,
    image: "",
    code: `{% comment %} Scroll Animations - LiquidMktplace {% endcomment %}
<script>
  document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('[data-reveal]')
      .forEach(el => observer.observe(el));
  });
</script>`,
    features: ["Zero dependencies", "Multiple effects", "Stagger support", "Performance optimized"],
  },
  {
    id: "tabs-section",
    title: "Tabbed Content Section",
    description: "Elegant tabbed content section with smooth transitions. Perfect for FAQs, product details, or feature highlights.",
    category: "Sections",
    price: 22,
    image: "",
    code: `{% comment %} Tabs Section - LiquidMktplace {% endcomment %}
<div class="tabs-section" x-data="{ tab: 0 }">
  <div class="tabs-section__nav">
    {% for block in section.blocks %}
      <button @click="tab = {{ forloop.index0 }}"
              :class="{ 'active': tab === {{ forloop.index0 }} }">
        {{ block.settings.title }}
      </button>
    {% endfor %}
  </div>
  {% for block in section.blocks %}
    <div x-show="tab === {{ forloop.index0 }}" x-transition>
      {{ block.settings.content }}
    </div>
  {% endfor %}
</div>`,
    features: ["Smooth transitions", "Schema ready", "Accessible", "Customizable"],
  },
  {
    id: "footer-newsletter",
    title: "Newsletter Footer",
    description: "A premium footer section with newsletter signup, social links, and multi-column navigation. Fully customizable via theme settings.",
    category: "Footer",
    price: 24,
    image: "",
    code: `{% comment %} Newsletter Footer - LiquidMktplace {% endcomment %}
<footer class="footer-premium">
  <div class="footer-premium__newsletter">
    <h3>{{ section.settings.heading }}</h3>
    <p>{{ section.settings.subheading }}</p>
    {% form 'customer' %}
      <input type="email" name="contact[email]" placeholder="Enter your email" />
      <button type="submit">Subscribe</button>
    {% endform %}
  </div>
  <div class="footer-premium__links">
    {% for block in section.blocks %}
      <div>
        <h4>{{ block.settings.heading }}</h4>
        {% assign menu = linklists[block.settings.menu] %}
        {% for link in menu.links %}
          <a href="{{ link.url }}">{{ link.title }}</a>
        {% endfor %}
      </div>
    {% endfor %}
  </div>
</footer>`,
    features: ["Newsletter integration", "Social links", "Multi-column nav", "Theme settings"],
  },
  {
    id: 'countdown-sale',
    title: 'Product Countdown Timer (Liquid + JS)',
    description: 'Display a per-product sale countdown based on a metafield (useful for limited-time promotions).',
    category: 'Product Page',
    price: 12,
    image: '',
    code: `{% comment %} Countdown Timer - requires product.metafields.custom.sale_ends (unix timestamp) {% endcomment %}
{% assign sale_ends = product.metafields.custom.sale_ends | default: nil %}
{% if sale_ends %}
  <div class="countdown" data-unix="{{ sale_ends }}">
    <span class="cd-days">0</span>d
    <span class="cd-hours">0</span>h
    <span class="cd-mins">0</span>m
    <span class="cd-secs">0</span>s
  </div>
  <script>
    (function(){
      const el = document.querySelector('.countdown[data-unix]');
      if (!el) return;
      const end = parseInt(el.dataset.unix,10)*1000;
      function tick(){
        const diff = Math.max(0, end - Date.now());
        const s = Math.floor(diff/1000)%60;
        const m = Math.floor(diff/60000)%60;
        const h = Math.floor(diff/3600000)%24;
        const d = Math.floor(diff/86400000);
        el.querySelector('.cd-days').textContent = d;
        el.querySelector('.cd-hours').textContent = h;
        el.querySelector('.cd-mins').textContent = m;
        el.querySelector('.cd-secs').textContent = s;
        if (diff<=0) clearInterval(timer);
      }
      const timer = setInterval(tick,1000); tick();
    })();
  </script>
{% endif %}`,
    features: ['Metafield-driven', 'Client-side countdown', 'Product-level promotions'],
  },
  {
    id: 'shipping-estimator',
    title: 'Cart Shipping Estimator (Snippet)',
    description: 'Allow customers to estimate shipping cost by entering a postal code on the cart page (uses shipping rates object).',
    category: 'Cart',
    price: 0,
    image: '',
    code: `{% comment %} Shipping Estimator - rely on shop.shipping_methods or provide a JS fallback {% endcomment %}
<div id="shipping-estimator">
  <label>Enter ZIP / Postal code</label>
  <input id="zip" type="text" />
  <button id="calc">Estimate</button>
  <div id="shipping-results"></div>
</div>
<script>
  document.getElementById('calc')?.addEventListener('click', async () => {
    const zip = document.getElementById('zip').value;
    const res = await fetch('/cart/shipping_rates.json?shipping_address[zip]='+encodeURIComponent(zip));
    const data = await res.json();
    const out = (data.shipping_rates||[]).map(function(r){ return '<div>' + r.name + ': ' + r.price + '</div>' }).join('') || '<div>No rates</div>';
    document.getElementById('shipping-results').innerHTML = out;
  })
</script>`,
    features: ['Estimate in-cart', 'AJAX', 'Improves conversions'],
  },
  {
    id: 'quick-view-snippet',
    title: 'Quick View Modal Snippet (Liquid + AJAX)',
    description: 'Small quick-view snippet: fetch product JSON and open a modal without leaving collection pages.',
    category: 'Sections',
    price: 18,
    image: '',
    code: `{% comment %} Quick View - include on collection grid, add data-product-handle attr to buttons {% endcomment %}
<div id="quick-view-modal" class="modal" hidden>
  <div class="modal__inner" id="quick-view-inner"></div>
  <button id="quick-view-close">Close</button>
</div>
<script>
  document.addEventListener('click', async (e)=>{
    const btn = e.target.closest('[data-product-handle]');
    if (!btn) return;
    e.preventDefault();
    const handle = btn.getAttribute('data-product-handle');
    const res = await fetch('/products/'+handle+'.js');
    const product = await res.json();
    var html = '';
    html += '<h2>' + (product.title || '') + '</h2>';
    if (product.images && product.images[0]) html += '<img src="' + product.images[0] + '" alt="" />';
    html += '<p>' + (product.description || '') + '</p>';
    html += '<div>' + (product.price ? (product.price/100) : '') + '</div>';
    document.getElementById('quick-view-inner').innerHTML = html;
    document.getElementById('quick-view-modal').hidden = false;
  });
  document.getElementById('quick-view-close')?.addEventListener('click', ()=>document.getElementById('quick-view-modal').hidden=true);
</script>`,
    features: ['AJAX product fetch', 'Modal quick preview', 'Drop-in for grids'],
  },
  {
    id: 'related-by-tag',
    title: 'Related Products by Tag (Liquid)',
    description: 'Render a small related products list by taking the first product tag and listing other products sharing it.',
    category: 'Product Page',
    price: 8,
    image: '',
    code: `{% comment %} Related by tag - picks first tag and finds collection.products with that tag {% endcomment %}
{% assign t = product.tags.first %}
{% if t %}
  <div class="related-by-tag">
    <h3>Related</h3>
    <ul>
      {% for p in collections.all.products | where: "tags", t limit: 4 %}
        {% if p.id != product.id %}
          <li><a href="{{ p.url }}">{{ p.title }}</a></li>
        {% endif %}
      {% endfor %}
    </ul>
  </div>
{% endif %}`,
    features: ['Simple related list', 'Tag-based', 'No JS required'],
  },
  {
    id: 'metafield-badges',
    title: 'Product Badges from Metafields',
    description: 'Render small badges for products driven by metafields (e.g., bestseller, new, limited).',
    category: 'Product Page',
    price: 6,
    image: '',
    code: `{% comment %} Badges: product.metafields.labels.* keys expected {% endcomment %}
<div class="product-badges">
  {% for key in product.metafields.labels %}
    {% assign val = product.metafields.labels[key] %}
    {% if val == 'true' or val == true %}
      <span class="badge badge-{{ key }}">{{ key | replace: '_', ' ' | capitalize }}</span>
    {% endif %}
  {% endfor %}
</div>`,
    features: ['Metafield driven', 'Tiny markup', 'Theme-editor friendly'],
  },
  {
    id: 'bundle-upsell',
    title: 'Bundled Upsell Snippet',
    description: 'Offer a small bundle on product pages: show two related product handles and a bundle add-to-cart form.',
    category: 'Product Page',
    price: 29,
    image: '',
    code: `{% comment %} Bundle upsell - set handles in section settings or product metafield {% endcomment %}
{% assign h1 = product.metafields.bundle.first_handle %}
{% assign h2 = product.metafields.bundle.second_handle %}
{% if h1 or h2 %}
  <div class="bundle-upsell">
    <h4>Bundle & Save</h4>
    <form action="/cart/add" method="post">
      <input type="hidden" name="items[][id]" value="{{ product.selected_or_first_available_variant.id }}" />
      {% if h1 %}
        {% assign p1 = all_products[h1] %}
        <input type="hidden" name="items[][id]" value="{{ p1.selected_or_first_available_variant.id }}" />
        <div>{{ p1.title }}</div>
      {% endif %}
      {% if h2 %}
        {% assign p2 = all_products[h2] %}
        <input type="hidden" name="items[][id]" value="{{ p2.selected_or_first_available_variant.id }}" />
        <div>{{ p2.title }}</div>
      {% endif %}
      <button type="submit">Add bundle</button>
    </form>
  </div>
{% endif %}`,
    features: ['Bundle add-to-cart', 'Metafield configuration', 'Increases AOV'],
  },
  {
    id: 'stock-progress',
    title: 'Stock Level Progress Bar',
    description: 'Show a progress bar indicating the percentage of stock remaining (based on inventory_quantity and a configured threshold).',
    category: 'Product Page',
    price: 5,
    image: '',
    code: `{% comment %} Stock progress - configure threshold via section setting or metafield {% endcomment %}
{% assign qty = product.variants.first.inventory_quantity | default: 0 %}
{% assign threshold = product.metafields.stock.threshold | default: 100 %}
{% assign pct = qty | divided_by: threshold | times: 100 | round %}
<div class="stock-progress">
  <div class="bar"><div class="fill" style="width:{{ pct }}%"></div></div>
  <small>{{ qty }} left</small>
</div>`,
    features: ['Urgency UX', 'Simple math', 'Metafield thresholds'],
  },
  {
    id: 'age-gate',
    title: 'Age Gate Popup (Liquid + JS)',
    description: 'Simple age verification overlay stored in localStorage to avoid repeat prompts.',
    category: 'UX',
    price: 0,
    image: '',
    code: `<div id="age-gate" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.8);align-items:center;justify-content:center;">
  <div style="background:white;padding:24px;max-width:320px;text-align:center;">
    <p>Are you 18 or older?</p>
    <button id="age-yes">Yes</button>
    <button id="age-no">No</button>
  </div>
</div>
<script>
  if (!localStorage.getItem('age_ok')) {
    document.getElementById('age-gate').style.display = 'flex'
    document.getElementById('age-yes').addEventListener('click', ()=>{ localStorage.setItem('age_ok','1'); document.getElementById('age-gate').remove() })
    document.getElementById('age-no').addEventListener('click', ()=>{ window.location.href = 'https://www.google.com' })
  }
</script>`,
    features: ['Simple overlay', 'localStorage remember', 'Compliance helper'],
  },
];
