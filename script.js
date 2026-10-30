/**
 * PAWSPHERE - E-Commerce & Services Interactive Application Script
 * Features: LocalStorage State, Dynamic Cart Drawer, Search, Category Filter, Countdown, Modals.
 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. SAMPLE PRODUCT DATA
    const products = [
        {
            id: 'p1',
            name: "Premium Grain-Free Dry Dog Food (5kg)",
            category: "Dogs",
            originalPrice: 2999,
            price: 2299,
            rating: 4.8,
            reviews: 124,
            badge: "Bestseller",
            image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=600&q=80"
        },
        {
            id: 'p2',
            name: "Interactive Feather Cat Scratch Tower",
            category: "Cats",
            originalPrice: 2499,
            price: 1899,
            rating: 4.9,
            reviews: 88,
            badge: "Hot Sale",
            image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=600&q=80"
        },
        {
            id: 'p3',
            name: "Ultra-Soft Memory Foam Pet Bed",
            category: "Dogs",
            originalPrice: 4299,
            price: 3199,
            rating: 4.7,
            reviews: 56,
            badge: "Luxury",
            image: "https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=600&q=80"
        },
        {
            id: 'p4',
            name: "Natural Herbal Pet Shampoo & Conditioner",
            category: "Grooming",
            originalPrice: 899,
            price: 699,
            rating: 4.6,
            reviews: 210,
            badge: "Organic",
            image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=600&q=80"
        },
        {
            id: 'p5',
            name: "Adjustable Reflective No-Pull Harness",
            category: "Dogs",
            originalPrice: 1599,
            price: 1199,
            rating: 4.8,
            reviews: 94,
            badge: "Popular",
            image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=600&q=80"
        },
        {
            id: 'p6',
            name: "Catnip Infused Plush Mouse Toys (Pack of 3)",
            category: "Cats",
            originalPrice: 699,
            price: 499,
            rating: 4.5,
            reviews: 142,
            badge: "Fun Pick",
            image: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=600&q=80"
        },
        {
            id: 'p7',
            name: "Vet-Approved Dental Care Chew Sticks",
            category: "Healthcare",
            originalPrice: 799,
            price: 599,
            rating: 4.9,
            reviews: 310,
            badge: "Vet Choice",
            image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80"
        },
        {
            id: 'p8',
            name: "Portable Travel Water Bottle & Dispenser",
            category: "Accessories",
            originalPrice: 999,
            price: 799,
            rating: 4.7,
            reviews: 78,
            badge: "Travel",
            image: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=600&q=80"
        }
    ];

    // 2. STATE MANAGEMENT WITH LOCAL STORAGE
    let cart = JSON.parse(localStorage.getItem('pawsphere_cart')) || [];
    let wishlist = JSON.parse(localStorage.getItem('pawsphere_wishlist')) || [];

    // DOM Elements
    const productGrid = document.getElementById('productGrid');
    const cartCountEl = document.getElementById('cartCount');
    const drawerCartCountEl = document.getElementById('drawerCartCount');
    const wishlistCountEl = document.getElementById('wishlistCount');
    const cartDrawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('overlay');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartSubtotalEl = document.getElementById('cartSubtotal');
    const cartTotalEl = document.getElementById('cartTotal');

    // 3. RENDER PRODUCTS
    function renderProducts(items) {
        if (!productGrid) return;
        productGrid.innerHTML = '';
        
        if (items.length === 0) {
            productGrid.innerHTML = `<p class="no-results">No products matched your criteria.</p>`;
            return;
        }

        items.forEach(prod => {
            const isWishlisted = wishlist.includes(prod.id);
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <span class="product-badge">${prod.badge}</span>
                <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" data-id="${prod.id}">
                    <i class="fa-${isWishlisted ? 'solid' : 'regular'} fa-heart"></i>
                </button>
                <div class="product-image-box">
                    <img src="${prod.image}" alt="${prod.name}">
                </div>
                <div class="product-content">
                    <h3 class="product-title">${prod.name}</h3>
                    <div class="rating-stars">
                        <i class="fa-solid fa-star"></i> ${prod.rating} <span>(${prod.reviews})</span>
                    </div>
                    <div class="price-row">
                        <span class="current-price">₹${prod.price.toLocaleString()}</span>
                        <span class="original-price">₹${prod.originalPrice.toLocaleString()}</span>
                    </div>
                    <button class="btn btn-primary btn-block add-to-cart-btn" data-id="${prod.id}">
                        <i class="fa-solid fa-cart-plus"></i> Add to Cart
                    </button>
                </div>
            `;
            productGrid.appendChild(card);
        });

        attachProductEvents();
    }

    // 4. ATTACH EVENT LISTENERS FOR DYNAMIC PRODUCT CARDS
    function attachProductEvents() {
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.