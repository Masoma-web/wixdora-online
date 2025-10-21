// مدیریت احراز هویت
class AuthManager {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateUI();
    }

    setupEventListeners() {
        // فرم ورود
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // فرم ثبت نام
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }

        // اعتبارسنجی real-time
        this.setupRealTimeValidation();
    }

    setupRealTimeValidation() {
        // اعتبارسنجی ایمیل در ثبت نام
        const registerEmail = document.getElementById('register-email');
        if (registerEmail) {
            registerEmail.addEventListener('blur', () => {
                this.validateEmail(registerEmail);
            });
        }

        // اعتبارسنجی تطابق رمز عبور
        const password = document.getElementById('register-password');
        const confirmPassword = document.getElementById('register-confirm-password');
        
        if (password && confirmPassword) {
            confirmPassword.addEventListener('blur', () => {
                this.validatePasswordMatch(password, confirmPassword);
            });
        }
    }

    validateEmail(input) {
        const email = input.value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(email)) {
            this.showFieldError(input, 'لطفاً یک ایمیل معتبر وارد کنید');
            return false;
        }

        // بررسی وجود ایمیل در سیستم
        const existingUser = this.users.find(user => user.email === email);
        if (existingUser) {
            this.showFieldError(input, 'این ایمیل قبلاً ثبت شده است');
            return false;
        }

        this.showFieldSuccess(input);
        return true;
    }

    validatePasswordMatch(passwordInput, confirmInput) {
        if (passwordInput.value !== confirmInput.value) {
            this.showFieldError(confirmInput, 'رمز عبورها مطابقت ندارند');
            return false;
        }

        this.showFieldSuccess(confirmInput);
        return true;
    }

    showFieldError(input, message) {
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
        
        let feedback = input.nextElementSibling;
        if (!feedback || !feedback.classList.contains('invalid-feedback')) {
            feedback = document.createElement('div');
            feedback.className = 'invalid-feedback';
            input.parentNode.appendChild(feedback);
        }
        feedback.textContent = message;
    }

    showFieldSuccess(input) {
        input.classList.add('is-valid');
        input.classList.remove('is-invalid');
    }

    async handleLogin() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const rememberMe = document.getElementById('remember-me').checked;

        // اعتبارسنجی اولیه
        if (!email || !password) {
            this.showMessage('لطفاً تمام فیلدها را پر کنید', 'error');
            return;
        }

        // شبیه‌سازی تأخیر برای واقعی‌تر شدن
        this.showLoading(true);

        // تأخیر مصنوعی
        await new Promise(resolve => setTimeout(resolve, 1000));

        // بررسی کاربر
        const user = this.users.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.currentUser = {
                id: user.id,
                name: user.name,
                email: user.email
            };

            // ذخیره در localStorage
            if (rememberMe) {
                localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            } else {
                sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            }

            this.showMessage('ورود موفقیت‌آمیز!', 'success');
            this.updateUI();

            // ریدایرکت به صفحه اصلی بعد از 2 ثانیه
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);

        } else {
            this.showMessage('ایمیل یا رمز عبور نادرست است', 'error');
        }

        this.showLoading(false);
    }

    async handleRegister() {
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;

        // اعتبارسنجی
        if (!name || !email || !password || !confirmPassword) {
            this.showMessage('لطفاً تمام فیلدها را پر کنید', 'error');
            return;
        }

        if (!this.validateEmail(document.getElementById('register-email'))) {
            return;
        }

        if (password.length < 6) {
            this.showMessage('رمز عبور باید حداقل ۶ کاراکتر باشد', 'error');
            return;
        }

        if (!this.validatePasswordMatch(
            document.getElementById('register-password'),
            document.getElementById('register-confirm-password')
        )) {
            return;
        }

        this.showLoading(true);

        // تأخیر مصنوعی
        await new Promise(resolve => setTimeout(resolve, 1000));

        // ایجاد کاربر جدید
        const newUser = {
            id: Date.now(),
            name: name,
            email: email,
            password: password,
            createdAt: new Date().toISOString()
        };

        this.users.push(newUser);
        localStorage.setItem('users', JSON.stringify(this.users));

        // ورود خودکار بعد از ثبت نام
        this.currentUser = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email
        };

        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

        this.showMessage('ثبت نام موفقیت‌آمیز!', 'success');
        this.updateUI();

        // ریدایرکت به صفحه اصلی
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);

        this.showLoading(false);
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUser');
        this.updateUI();
        this.showMessage('خروج موفقیت‌آمیز', 'info');
    }

    updateUI() {
        const loginLink = document.querySelector('a[href="login.html"]');
        
        if (this.currentUser && loginLink) {
            loginLink.innerHTML = `
                <i class="fas fa-user"></i>
                ${this.currentUser.name}
            `;
            
            // اضافه کردن منوی dropdown برای خروج
            this.createUserDropdown(loginLink);
        }
    }

    createUserDropdown(loginLink) {
        // حذف dropdown قبلی اگر وجود دارد
        const existingDropdown = loginLink.closest('.dropdown');
        if (existingDropdown) {
            return;
        }

        // ایجاد dropdown جدید
        const dropdownHTML = `
            <div class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                    <i class="fas fa-user"></i>
                    ${this.currentUser.name}
                </a>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="profile.html">پروفایل</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item text-danger" href="#" id="logout-btn">خروج</a></li>
                </ul>
            </div>
        `;

        loginLink.outerHTML = dropdownHTML;

        // event listener برای دکمه خروج
        document.getElementById('logout-btn').addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
            window.location.href = 'index.html';
        });
    }

    showLoading(show) {
        const buttons = document.querySelectorAll('#login-form button, #register-form button');
        buttons.forEach(button => {
            if (show) {
                button.disabled = true;
                button.innerHTML = `
                    <span class="spinner-border spinner-border-sm" role="status"></span>
                    در حال پردازش...
                `;
            } else {
                button.disabled = false;
                if (button.closest('#login-form')) {
                    button.innerHTML = `
                        <i class="fas fa-sign-in-alt"></i>
                        ورود
                    `;
                } else {
                    button.innerHTML = `
                        <i class="fas fa-user-plus"></i>
                        ثبت نام
                    `;
                }
            }
        });
    }

    showMessage(message, type = 'info') {
        // حذف پیام قبلی اگر وجود دارد
        const existingAlert = document.querySelector('.alert-dismissible');
        if (existingAlert) {
            existingAlert.remove();
        }

        const alertClass = {
            'success': 'alert-success',
            'error': 'alert-danger',
            'info': 'alert-info',
            'warning': 'alert-warning'
        }[type] || 'alert-info';

        const alert = document.createElement('div');
        alert.className = `alert ${alertClass} alert-dismissible fade show`;
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

    // بررسی آیا کاربر وارد شده است
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // گرفتن اطلاعات کاربر فعلی
    getCurrentUser() {
        return this.currentUser;
    }
}

// مقداردهی اولیه وقتی صفحه لود شد
document.addEventListener('DOMContentLoaded', function() {
    window.authManager = new AuthManager();
});