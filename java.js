// مدیریت حالت تاریک/روشن
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme();
        this.setupEventListeners();
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('theme', this.theme);
    }

    setupEventListeners() {
        const toggleBtn = document.getElementById('dark-mode-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggleTheme());
        }
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        this.updateToggleButton();
    }

    updateToggleButton() {
        const toggleBtn = document.getElementById('dark-mode-toggle');
        if (toggleBtn) {
            const icon = toggleBtn.querySelector('i');
            icon.className = this.theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }
}

// مدیریت سبد خرید
class CartManager {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.updateCartCount();
    }

    addToCart(product) {
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                ...product,
                quantity: 1
            });
        }
        
        this.saveCart();
        this.updateCartCount();
        this.showAddToCartAnimation();
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartCount();
    }

    updateCartCount() {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
        }
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    showAddToCartAnimation() {
        // نمایش انیمیشن اضافه شدن به سبد خرید
        const animation = document.createElement('div');
        animation.className = 'add-to-cart-animation';
        animation.textContent = '✓ اضافه شد';
        animation.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 1000;
        `;
        
        document.body.appendChild(animation);
        
        setTimeout(() => {
            document.body.removeChild(animation);
        }, 2000);
    }
}

// مقداردهی اولیه
document.addEventListener('DOMContentLoaded', function() {
    // مقداردهی مدیریت تم
    const themeManager = new ThemeManager();
    
    // مقداردهی مدیریت سبد خرید
    window.cartManager = new CartManager();
    
    // نمایش محصولات ویژه در صفحه اصلی
    if (document.getElementById('featured-products')) {
        loadFeaturedProducts();
    }
});

// بارگذاری محصولات ویژه
async function loadFeaturedProducts() {
    try {
        const productsContainer = document.getElementById('featured-products');
        
        // نمایش لودر
        productsContainer.innerHTML = `
            <div class="col-12 text-center">
                <div class="loading-spinner"></div>
                <p class="mt-2">در حال بارگذاری محصولات...</p>
            </div>
        `;
        
        // در اینجا محصولات از API گرفته می‌شوند
        // فعلاً از داده‌های نمونه استفاده می‌کنیم
        const featuredProducts = [
            {
                id: 1,
                title: "لپ‌تاپ گیمینگ",
                price: 15000000,
                image: "https://via.placeholder.com/300x200",
                category: "الکترونیک"
            },
            {
                id: 2,
                title: "هدفون بی‌سیم",
                price: 800000,
                image: "https://via.placeholder.com/300x200",
                category: "الکترونیک"
            },
            {
                id: 3,
                title: "ماوس گیمینگ",
                price: 400000,
                image: "https://via.placeholder.com/300x200",
                category: "الکترونیک"
            }
        ];
        
        // نمایش محصولات
        displayProducts(featuredProducts, productsContainer);
        
    } catch (error) {
        console.error('خطا در بارگذاری محصولات:', error);
        document.getElementById('featured-products').innerHTML = `
            <div class="col-12 text-center text-danger">
                <p>خطا در بارگذاری محصولات. لطفاً دوباره تلاش کنید.</p>
            </div>
        `;
    }
}

// نمایش محصولات در صفحه
function displayProducts(products, container) {
    container.innerHTML = products.map(product => `
        <div class="col-md-4 col-lg-3 fade-in-up">
            <div class="card product-card h-100">
                <img src="${product.image}" class="card-img-top product-image" alt="${product.title}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${product.title}</h5>
                    <p class="card-text text-muted">${product.category}</p>
                    <div class="mt-auto">
                        <p class="card-text fw-bold text-primary">${product.price.toLocaleString()} تومان</p>
                        <button class="btn btn-primary w-100 add-to-cart" data-product='${JSON.stringify(product)}'>
                            <i class="fas fa-cart-plus"></i>
                            افزودن به سبد
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    // اضافه کردن event listener به دکمه‌های سبد خرید
    container.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const product = JSON.parse(this.dataset.product);
            window.cartManager.addToCart(product);
        });
    });
}
// جمع کل قیمت
function updateCartTotal() {
    const cart = getCartFromStorage();
    let totalPrice = 0;
    cart.forEach(item => totalPrice += item.price * item.quantity);
    console.log('جمع کل:', totalPrice.toLocaleString(), 'تومان'); // برای تست
}
