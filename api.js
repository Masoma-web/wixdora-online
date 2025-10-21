// مدیریت API و داده‌های خارجی
class ApiManager {
    constructor() {
        // استفاده از داده‌های محلی
    }

    async getProducts(limit = 20) {
        try {
            // داده‌های نمونه فارسی
            const sampleProducts = [
                {
                    id: 1,
                    title: "لپ‌تاپ گیمینگ ایسوس",
                    price: 45000000,
                    category: "electronics",
                    image: "https://via.placeholder.com/300x200/007bff/ffffff?text=لپ‌تاپ+گیمینگ",
                    description: "لپ‌تاپ گیمینگ با پردازنده Core i7 و کارت گرافیک RTX 3060",
                    rating: { rate: 4.5, count: 120 }
                },
                {
                    id: 2,
                    title: "هدفون بی‌سیم سونی",
                    price: 850000,
                    category: "electronics",
                    image: "https://via.placeholder.com/300x200/28a745/ffffff?text=هدفون+بی‌سیم",
                    description: "هدفون بی‌سیم با نویزکنسلینگ و باتری 30 ساعته",
                    rating: { rate: 4.2, count: 85 }
                },
                {
                    id: 3,
                    title: "تی‌شرت مردانه کتان",
                    price: 150000,
                    category: "clothing",
                    image: "https://via.placeholder.com/300x200/dc3545/ffffff?text=تی‌شرت+مردانه",
                    description: "تی‌شرت مردانه از جنس کتان با کیفیت بالا",
                    rating: { rate: 4.0, count: 200 }
                },
                {
                    id: 4,
                    title: "گوشی هوآوی P50",
                    price: 12000000,
                    category: "electronics",
                    image: "https://via.placeholder.com/300x200/6f42c1/ffffff?text=گوشی+هوآوی",
                    description: "گوشی هوشمند با دوربین 50 مگاپیکسل و پردازنده قدرتمند",
                    rating: { rate: 4.3, count: 150 }
                },
                {
                    id: 5,
                    title: "کفش ورزشی نایک",
                    price: 650000,
                    category: "clothing",
                    image: "https://via.placeholder.com/300x200/fd7e14/ffffff?text=کفش+ورزشی",
                    description: "کفش ورزشی با کفی ارتوپدی و طراحی مدرن",
                    rating: { rate: 4.1, count: 180 }
                },
                {
                    id: 6,
                    title: "ساعت مچی هوشمند",
                    price: 1200000,
                    category: "electronics",
                    image: "https://via.placeholder.com/300x200/20c997/ffffff?text=ساعت+هوشمند",
                    description: "ساعت هوشمند با قابلیت اندازه گیری ضربان قلب و خواب",
                    rating: { rate: 4.4, count: 95 }
                }
            ];
            
            // شبیه‌سازی تاخیر شبکه
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            return sampleProducts.slice(0, limit);
            
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    }

    async getProduct(id) {
        const products = await this.getProducts();
        return products.find(product => product.id === id);
    }

    async getCategories() {
        return ["electronics", "clothing", "jewelery", "men's clothing", "women's clothing"];
    }

    async getProductsByCategory(category) {
        const products = await this.getProducts();
        return products.filter(product => product.category === category);
    }
}

// تابع‌های کمکی global
window.apiManager = new ApiManager();

// تابع برای لود محصولات در صفحه اصلی
async function loadFeaturedProducts() {
    try {
        console.log('در حال دریافت محصولات...');
        const products = await apiManager.getProducts(6);
        console.log('محصولات دریافت شد:', products);
        
        const container = document.getElementById('featured-products');
        if (container) {
            displayProducts(products, container);
        }
    } catch (error) {
        console.error('خطا در بارگذاری محصولات:', error);
        // استفاده از داده‌های محلی در صورت خطا
        loadLocalProducts();
    }
}

function loadLocalProducts() {
    console.log('استفاده از داده‌های محلی...');
    const localProducts = [
        {
            id: 1,
            title: "لپ‌تاپ گیمینگ (محلی)",
            price: 15000000,
            category: "electronics",
            image: "https://via.placeholder.com/300x200/007bff/ffffff?text=لپ‌تاپ+گیمینگ",
            description: "لپ‌تاپ گیمینگ با مشخصات فنی بالا",
            rating: { rate: 4.5, count: 120 }
        },
        {
            id: 2,
            title: "هدفون بی‌سیم (محلی)", 
            price: 800000,
            category: "electronics",
            image: "https://via.placeholder.com/300x200/28a745/ffffff?text=هدفون+بی‌سیم",
            description: "هدفون بی‌سیم با کیفیت صدای عالی",
            rating: { rate: 4.2, count: 85 }
        }
    ];
    
    const container = document.getElementById('featured-products');
    if (container) {
        displayProducts(localProducts, container);
    }
}

// تابع نمایش محصولات
function displayProducts(products, container) {
    console.log('نمایش محصولات:', products);
    
    if (!products || products.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center">
                <p class="text-muted">محصولی یافت نشد.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = products.map(product => `
        <div class="col-md-4 col-lg-3 mb-4 fade-in-up">
            <div class="card product-card h-100">
                <img src="${product.image}" 
                     class="card-img-top product-image" 
                     alt="${product.title}"
                     style="height: 200px; object-fit: cover;">
                <div class="card-body d-flex flex-column">
                    <h6 class="card-title">${product.title}</h6>
                    <p class="card-text text-muted small">${this.getCategoryName(product.category)}</p>
                    
                    <div class="rating mb-2">
                        ${this.generateStarRating(product.rating.rate)}
                        <small class="text-muted">(${product.rating.count})</small>
                    </div>
                    
                    <div class="mt-auto">
                        <p class="card-text fw-bold text-primary">
                            ${product.price.toLocaleString()} تومان
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
    attachProductEventListeners(container);
}

function getCategoryName(category) {
    const categories = {
        'electronics': 'الکترونیک',
        'clothing': 'پوشاک', 
        'jewelery': 'جواهرات',
        "men's clothing": 'پوشاک مردانه',
        "women's clothing": 'پوشاک زنانه'
    };
    return categories[category] || category;
}

function generateStarRating(rating) {
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

function attachProductEventListeners(container) {
    // دکمه‌های افزودن به سبد خرید
    container.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const product = JSON.parse(e.target.closest('.add-to-cart').dataset.product);
            if (window.cartManager) {
                window.cartManager.addToCart(product);
            }
        });
    });

    // دکمه‌های مشاهده جزئیات
    container.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', (e) => {
            const product = JSON.parse(e.target.closest('.view-details').dataset.product);
            if (window.productsPage) {
                window.productsPage.showProductDetails(product);
            }
        });
    });
}

// وقتی صفحه لود شد، محصولات رو بارگذاری کن
document.addEventListener('DOMContentLoaded', function() {
    console.log('صفحه لود شد - شروع بارگذاری محصولات');
    if (document.getElementById('featured-products')) {
        loadFeaturedProducts();
    }
});