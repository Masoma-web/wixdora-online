// مدیریت صفحه سبد خرید
class CartPage {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.init();
    }

    init() {
        this.displayCartItems();
        this.setupEventListeners();
        this.updateOrderSummary();
    }

    displayCartItems() {
        const cartContent = document.getElementById('cart-content');
        
        if (this.cart.length === 0) {
            cartContent.innerHTML = `
                <div class="text-center py-5">
                    <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                    <h4 class="text-muted">سبد خرید شما خالی است</h4>
                    <p class="text-muted">می‌توانید از صفحه محصولات، کالاهای مورد نظر خود را اضافه کنید</p>
                    <a href="products.html" class="btn btn-primary mt-3">
                        <i class="fas fa-shopping-bag"></i>
                        مشاهده محصولات
                    </a>
                </div>
            `;
            return;
        }

        cartContent.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>محصول</th>
                                    <th>قیمت</th>
                                    <th>تعداد</th>
                                    <th>جمع</th>
                                    <th>عملیات</th>
                                </tr>
                            </thead>
                            <tbody id="cart-items">
                                ${this.generateCartItems()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        this.attachCartEventListeners();
    }

    generateCartItems() {
        return this.cart.map(item => `
            <tr id="cart-item-${item.id}">
                <td>
                    <div class="d-flex align-items-center">
                        <img src="${item.image}" 
                             alt="${item.title}" 
                             class="rounded me-3"
                             style="width: 60px; height: 60px; object-fit: cover;">
                        <div>
                            <h6 class="mb-0">${item.title}</h6>
                            <small class="text-muted">${item.category}</small>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="price">${this.formatPrice(item.price)}</span>
                </td>
                <td>
                    <div class="quantity-controls d-flex align-items-center">
                        <button class="btn btn-sm btn-outline-secondary decrease-quantity" 
                                data-id="${item.id}">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity mx-2">${item.quantity}</span>
                        <button class="btn btn-sm btn-outline-secondary increase-quantity" 
                                data-id="${item.id}">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </td>
                <td>
                    <strong class="item-total">${this.formatPrice(item.price * item.quantity)}</strong>
                </td>
                <td>
                    <button class="btn btn-sm btn-danger remove-item" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    attachCartEventListeners() {
        // حذف آیتم
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.closest('.remove-item').dataset.id);
                this.removeItem(productId);
            });
        });

        // افزایش تعداد
        document.querySelectorAll('.increase-quantity').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.closest('.increase-quantity').dataset.id);
                this.updateQuantity(productId, 1);
            });
        });

        // کاهش تعداد
        document.querySelectorAll('.decrease-quantity').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.closest('.decrease-quantity').dataset.id);
                this.updateQuantity(productId, -1);
            });
        });
    }

    removeItem(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.displayCartItems();
        this.updateOrderSummary();
        this.updateCartCount();
        
        // نمایش پیام
        this.showMessage('محصول از سبد خرید حذف شد', 'danger');
    }

    updateQuantity(productId, change) {
        const item = this.cart.find(item => item.id === productId);
        
        if (item) {
            item.quantity += change;
            
            if (item.quantity <= 0) {
                this.removeItem(productId);
                return;
            }
            
            this.saveCart();
            this.updateItemDisplay(productId);
            this.updateOrderSummary();
            this.updateCartCount();
        }
    }

    updateItemDisplay(productId) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            const row = document.getElementById(`cart-item-${productId}`);
            if (row) {
                row.querySelector('.quantity').textContent = item.quantity;
                row.querySelector('.item-total').textContent = this.formatPrice(item.price * item.quantity);
            }
        }
    }

    updateOrderSummary() {
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const discount = 0; // می‌توانید سیستم تخفیف اضافه کنید
        const total = subtotal - discount;

        document.getElementById('subtotal').textContent = this.formatPrice(subtotal);
        document.getElementById('discount').textContent = this.formatPrice(discount);
        document.getElementById('total').textContent = this.formatPrice(total);

        // فعال/غیرفعال کردن دکمه ادامه فرآیند خرید
        const checkoutBtn = document.getElementById('checkout-btn');
        checkoutBtn.disabled = this.cart.length === 0;
    }

    updateCartCount() {
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        
        // آپدیت در navbar
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            cartCount.textContent = totalItems;
        }
        
        // آپدیت در localStorage برای sync بین صفحات
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    setupEventListeners() {
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                this.proceedToCheckout();
            });
        }
    }

    proceedToCheckout() {
        // بررسی آیا کاربر وارد شده است
        const user = JSON.parse(localStorage.getItem('currentUser'));
        
        if (!user) {
            this.showMessage('لطفاً ابتدا وارد حساب کاربری خود شوید', 'warning');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            return;
        }

        // نمایش مودال تسویه حساب
        this.showCheckoutModal();
    }

    showCheckoutModal() {
        const modalHTML = `
            <div class="modal fade" id="checkoutModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">تسویه حساب</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form id="checkout-form">
                                <div class="mb-3">
                                    <label class="form-label">آدرس تحویل</label>
                                    <textarea class="form-control" rows="3" required></textarea>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">روش پرداخت</label>
                                    <select class="form-select" required>
                                        <option value="">انتخاب کنید...</option>
                                        <option value="cash">پرداخت در محل</option>
                                        <option value="card">پرداخت آنلاین</option>
                                    </select>
                                </div>
                                <div class="alert alert-info">
                                    <strong>مبلغ قابل پرداخت:</strong>
                                    <span id="modal-total">${document.getElementById('total').textContent}</span>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">انصراف</button>
                            <button type="button" class="btn btn-success" id="confirm-checkout">
                                <i class="fas fa-check"></i>
                                تأیید سفارش
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // اضافه کردن مودال به صفحه
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        const modal = new bootstrap.Modal(document.getElementById('checkoutModal'));
        modal.show();

        // تأیید نهایی سفارش
        document.getElementById('confirm-checkout').addEventListener('click', () => {
            this.completeOrder();
            modal.hide();
        });

        // حذف مودال از DOM وقتی بسته شد
        document.getElementById('checkoutModal').addEventListener('hidden.bs.modal', function () {
            this.remove();
        });
    }

    completeOrder() {
        // شبیه‌سازی پرداخت موفق
        this.showMessage('سفارش شما با موفقیت ثبت شد!', 'success');
        
        // خالی کردن سبد خرید
        this.cart = [];
        this.saveCart();
        this.updateCartCount();
        
        setTimeout(() => {
            this.displayCartItems();
            this.updateOrderSummary();
        }, 2000);
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    formatPrice(price) {
        return price.toLocaleString() + ' تومان';
    }

    showMessage(message, type = 'info') {
        // حذف پیام قبلی اگر وجود دارد
        const existingAlert = document.querySelector('.alert-dismissible');
        if (existingAlert) {
            existingAlert.remove();
        }

        const alert = document.createElement('div');
        alert.className = `alert alert-${type} alert-dismissible fade show`;
        alert.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 9999;
            min-width: 300px;
            text-align: center;
        `;
        alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        document.body.appendChild(alert);

        // حذف خودکار پیام بعد از 3 ثانیه
        setTimeout(() => {
            if (alert.parentNode) {
                alert.remove();
            }
        }, 3000);
    }
}

// مقداردهی اولیه وقتی صفحه لود شد
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('cart-content')) {
        window.cartPage = new CartPage();
    }
});