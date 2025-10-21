// مدیریت صفحه محصولات
class ProductsPage {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.currentCategory = 'all';
        this.init();
    }

    async init() {
        await this.loadProducts();
        this.setupEventListeners();
        this.displayProducts();
    }

  async loadProducts() {
    try {
        // استفاده از API Manager جدید
        this.products = await apiManager.getProducts();
        this.filteredProducts = this.products;
            console.error('خطا در دریافت محصولات:', error);
            // استفاده از داده‌های نمونه در صورت خطا
            this.loadSampleProducts();
        }
    }

    loadSampleProducts() {
        this.products = [
            {
                id: 1,
                title: "لپ‌تاپ گیمینگ",
                price: 15000000,
                category: "electronics",
                image: "https://via.placeholder.com/300x200",
                description: "لپ‌تاپ گیمینگ با مشخصات فنی بالا",
                rating: { rate: 4.5, count: 120 }
            },
            {
                id: 2,
                title: "هدفون بی‌سیم",
                price: 800000,
                category: "electronics",
                image: "https://via.placeholder.com/300x200",
                description: "هدفون بی‌سیم با کیفیت صدای عالی",
                rating: { rate: 4.2, count: 85 }
            },
            {
                id: 3,
                title: "تی‌شرت مردانه",
                price: 150000,
                category: "clothing",
                image: "https://via.placeholder.com/300x200",
                description: "تی‌شرت مردانه با جنس کتان",
                rating: { rate: 4.0, count: 200 }
            }
        ];
        this.filteredProducts = this.products;
    }

    setupEventListeners() {
        // فیلتر دسته‌بندی
        document.querySelectorAll('[data-category]').forEach(button => {
            button.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                this.filterByCategory(category);
                
                // آپدیت وضعیت دکمه‌ها
                document.querySelectorAll('[data-category]').forEach(btn => {
                    btn.classList.remove('active');
                });
                e.target.classList.add('active');
            });
        });

        // جستجو
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchProducts(e.target.value);
            });
        }
    }

    filterByCategory(category) {
        this.currentCategory = category;
        
        if (category === 'all') {
            this.filteredProducts = this.products;
        } else {
            this.filteredProducts = this.products.filter(product => 
                product.category === category
            );
        }
        
        this.displayProducts();
    }

    searchProducts(query) {
        const searchTerm = query.toLowerCase();
        this.filteredProducts = this.products.filter(product =>
            product.title.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
        );
        this.displayProducts();
    }

    displayProducts() {
        const container = document.getElementById('products-container');
        
        if (this.filteredProducts.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center">
                    <p class="text-muted">محصولی یافت نشد.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.filteredProducts.map(product => `
            <div class="col-md-4 col-lg-3 mb-4 fade-in-up">
                <div class="card product-card h-100">
                    <img src="${product.image}" 
                         class="card-img-top product-image" 
                         alt="${product.title}"
                         style="height: 200px; object-fit: cover;">
                    <div class="card-body d-flex flex-column">
                        <h6 class="card-title">${product.title}</h6>
                        <p class="card-text text-muted small">${product.category}</p>
                        
                        <div class="rating mb-2">
                            ${this.generateStarRating(product.rating.rate)}
                            <small class="text-muted">(${product.rating.count})</small>
                        </div>
                        
                        <div class="mt-auto">
                            <p class="card-text fw-bold text-primary">
                                ${product.price ? product.price.toLocaleString() + ' تومان' : 'قیمت نامعلوم'}
                            </p>
                            <div class="d-grid gap-2">
                                <button class="btn btn-primary btn-sm add-to-cart" 
                                        data-product='${JSON.stringify(product)}'>
                                    <i class="fas fa-cart-plus"></i>
                                    افزودن به سبد
                                </button>
                                <button class="btn btn-outline-secondary btn-sm view-details"
                                        data-product='${JSON.stringify(product)}'>
                                    <i class="fas fa-eye"></i>
                                    مشاهده جزئیات
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        // اضافه کردن event listener به دکمه‌ها
        this.attachProductEventListeners();
    }

    generateStarRating(rating) {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        
        for (let i = 0; i < fullStars; i++) {
            stars.push('<i class="fas fa-star text-warning"></i>');
        }
        
        if (hasHalfStar) {
            stars.push('<i class="fas fa-star-half-alt text-warning"></i>');
        }
        
        const emptyStars = 5 - stars.length;
        for (let i = 0; i < emptyStars; i++) {
            stars.push('<i class="far fa-star text-warning"></i>');
        }
        
        return stars.join('');
    }

    attachProductEventListeners() {
        // دکمه‌های افزودن به سبد خرید
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const product = JSON.parse(e.target.closest('.add-to-cart').dataset.product);
                window.cartManager.addToCart(product);
            });
        });

        // دکمه‌های مشاهده جزئیات
        document.querySelectorAll('.view-details').forEach(button => {
            button.addEventListener('click', (e) => {
                const product = JSON.parse(e.target.closest('.view-details').dataset.product);
                this.showProductDetails(product);
            });
        });
    }

    showProductDetails(product) {
        const modalTitle = document.getElementById('productModalTitle');
        const modalBody = document.getElementById('productModalBody');
        
        modalTitle.textContent = product.title;
        modalBody.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <img src="${product.image}" class="img-fluid rounded" alt="${product.title}">
                </div>
                <div class="col-md-6">
                    <h5>${product.title}</h5>
                    <p class="text-muted">${product.description}</p>
                    <div class="mb-3">
                        <strong class="text-primary">${product.price ? product.price.toLocaleString() + ' تومان' : 'قیمت نامعلوم'}</strong>
                    </div>
                    <div class="mb-3">
                        <strong>دسته‌بندی:</strong> ${product.category}
                    </div>
                    <div class="mb-3">
                        ${this.generateStarRating(product.rating.rate)}
                        <span class="text-muted">(${product.rating.count} نظر)</span>
                    </div>
                    <button class="btn btn-primary w-100 add-to-cart-modal" 
                            data-product='${JSON.stringify(product)}'>
                        <i class="fas fa-cart-plus"></i>
                        افزودن به سبد خرید
                    </button>
                </div>
            </div>
        `;

        // event listener برای دکمه افزودن به سبد در مودال
        modalBody.querySelector('.add-to-cart-modal').addEventListener('click', () => {
            window.cartManager.addToCart(product);
            const modal = bootstrap.Modal.getInstance(document.getElementById('productModal'));
            modal.hide();
        });

        // نمایش مودال
        const modal = new bootstrap.Modal(document.getElementById('productModal'));
        modal.show();
    }
}

// مقداردهی اولیه وقتی صفحه لود شد
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('products-container')) {
        window.productsPage = new ProductsPage();
    }
});