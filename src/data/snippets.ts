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
];
