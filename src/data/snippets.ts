export interface Snippet {
    id: string;
    title: string;
    description: string;
    category: string;
    price: number;
    images: string[];
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
    title: "Social Proof",
    description: "A fully responsive mega menu with multi-column dropdowns, image support, and smooth animations. Drop-in ready for any Shopify theme.",
    category: "Header",
    price: 4.99,
    images: ["mega-menu/image.png"],
    code: `<div class="social-proof-block">
    <div class="profile-circles-wrapper">
        <div class="profile-circle" style="background-image: url(https://cdn.shopify.com/s/files/1/0687/1620/0001/files/imgi_98_98b1b6ad81ee0071dfbb8984387f0674.jpg?v=1765287838);"></div>
        <div class="profile-circle" style="background-image: url(https://cdn.shopify.com/s/files/1/0687/1620/0001/files/imgi_94_89ab355028fc16076f99d87b910079b9.jpg?v=1765287838);"></div>
        <div class="profile-circle" style="background-image: url(https://cdn.shopify.com/s/files/1/0687/1620/0001/files/imgi_97_e9082007b92f4d1e23dce25c3cbb1caa.jpg?v=1765287838);"></div>
    </div>

    <div class="social-proof__text-wrapper">
        <p class="social-proof__names">
            [CUSTOMER NAMES]
            <span class="verified-badge" aria-label="Verified">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1e90ff" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </span>
        </p>
        <p class="social-proof__purchases">
            [TEXT]
        </p>
    </div>
</div>

<style>

/* -------------------------------------- */
/* Styles for social proof */
/* -------------------------------------- */

.social-proof-block {
    display: flex;
    align-items: center;
    padding: 15px 0;
    max-width: 450px;
    margin: 10px auto;
}

.profile-circles-wrapper {
    display: flex;
    position: relative;
    margin-right: 15px;
}

/* Style for profile circle */

.profile-circle {
    width: 45px; /* Taille du cercle */
    height: 45px;
    border-radius: 50%;
    background-size: cover;
    background-position: center;
    border: 2px solid white; /* Bordure blanche pour séparer les cercles */
    position: relative;
    left: 0;
    z-index: 10;
}

/* Offset circles for the superimposition effect */

.profile-circles-wrapper .profile-circle:nth-child(2) {
    margin-left: -15px;
    z-index: 9;
}

.profile-circles-wrapper .profile-circle:nth-child(3) {
    margin-left: -15px;
    z-index: 8;
}

.social-proof__text-wrapper {
    line-height: 1;
}


.social-proof__names {
    font-size: 1.5em;
    font-weight: 700;
    color: #333;
    margin: 0 0 5px 0;
    display: flex;
    align-items: center;
}


.verified-badge {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: #1e90ff; /* Bleu vif */
    display: inline-flex;
    justify-content: center;
    align-items: center;
    margin-left: 8px;
}

.verified-badge svg {
    width: 14px;
    height: 14px;
}


.social-proof__purchases {
    font-size: 1em;
    color: #555;
    margin: 0;
    font-weight: 400;
}

.social-proof__purchases strong {
    font-weight: 700;
}
</style>`,
    features: ["Responsive design", "Multi-column layout", "Image support", "Smooth transitions"],
  },
];