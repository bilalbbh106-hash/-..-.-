// main.js - الملف الرئيسي للجافاسكريبت

document.addEventListener('DOMContentLoaded', function() {
    // تهيئة الموقع
    initSite();
    
    // تحميل المنتجات
    loadProducts();
    
    // إضافة مستمعي الأحداث
    setupEventListeners();
    
    // تهيئة نظام السحب
    initDragScroll();
});

// تهيئة الموقع
function initSite() {
    // إضافة تأثيرات عند التمرير
    setupScrollAnimations();
    
    // إعداد القائمة المتنقلة
    setupMobileMenu();
    
    // تحميل الإعلانات
    loadAds();
    
    // التحقق من وجود جلسة أدمن
    checkAdminSession();
}

// تحميل المنتجات من Supabase
async function loadProducts() {
    const productsContainer = document.getElementById('productsContainer');
    if (!productsContainer) return;
    
    try {
        // محاكاة بيانات المنتجات (في الواقع سيتم جلبها من Supabase)
        const products = [
            {
                id: 1,
                title: "كود 1000 جوهرة فري فاير",
                description: "كود لشراء 1000 جوهرة في لعبة فري فاير",
                price: 1.10,
                oldPrice: 1.50,
                category: "recharge",
                badge: "الأكثر مبيعاً"
            },
            {
                id: 2,
                title: "حساب فري فاير مستوى 70",
                description: "حساب بمستوى عالي وأسلحة نادرة",
                price: 15.99,
                oldPrice: 25.00,
                category: "freefire",
                badge: "حصري"
            },
            {
                id: 3,
                title: "زيادة متابعين انستغرام 1000",
                description: "زيادة 1000 متابع حقيقي لانستغرام",
                price: 5.50,
                oldPrice: 8.00,
                category: "social",
                badge: "مميز"
            },
            {
                id: 4,
                title: "كود 5000 جوهرة فري فاير",
                description: "كود لشراء 5000 جوهرة في لعبة فري فاير",
                price: 5.00,
                oldPrice: 7.00,
                category: "recharge",
                badge: "عرض خاص"
            }
        ];
        
        productsContainer.innerHTML = '';
        
        products.forEach(product => {
            const productCard = createProductCard(product);
            productsContainer.appendChild(productCard);
        });
        
    } catch (error) {
        console.error('خطأ في تحميل المنتجات:', error);
        productsContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>عذراً، حدث خطأ في تحميل المنتجات. يرجى المحاولة لاحقاً.</p>
            </div>
        `;
    }
}

// إنشاء بطاقة منتج
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card fade-in';
    card.dataset.id = product.id;
    card.dataset.category = product.category;
    
    card.innerHTML = `
        <div class="product-image">
            ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
            <i class="fas ${getProductIcon(product.category)}"></i>
        </div>
        <div class="product-content">
            <h3 class="product-title">${product.title}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-price">
                ${product.oldPrice ? `<span>$${product.oldPrice}</span>` : ''}
                $${product.price}
            </div>
            <button class="btn btn-buy" data-product-id="${product.id}">
                <i class="fas fa-shopping-cart"></i> شراء الآن
            </button>
        </div>
    `;
    
    return card;
}

// الحصول على أيقونة المنتج حسب الفئة
function getProductIcon(category) {
    switch(category) {
        case 'freefire': return 'fa-fire';
        case 'recharge': return 'fa-gem';
        case 'social': return 'fa-share-alt';
        default: return 'fa-shopping-bag';
    }
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
    // زر دخول الأدمن
    const adminLoginBtn = document.querySelector('.admin-login-btn');
    const adminModal = document.getElementById('adminModal');
    const closeModal = document.querySelector('.close-modal');
    const adminLoginForm = document.getElementById('adminLoginForm');
    
    if (adminLoginBtn) {
        adminLoginBtn.addEventListener('click', () => {
            adminModal.style.display = 'flex';
        });
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            adminModal.style.display = 'none';
        });
    }
    
    // إغلاق النافذة عند النقر خارجها
    window.addEventListener('click', (e) => {
        if (e.target === adminModal) {
            adminModal.style.display = 'none';
        }
        
        const purchaseModal = document.getElementById('purchaseModal');
        if (e.target === purchaseModal) {
            purchaseModal.style.display = 'none';
        }
    });
    
    // معالجة تسجيل دخول الأدمن
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', handleAdminLogin);
    }
    
    // أزرار شراء المنتجات
    document.addEventListener('click', (e) => {
        if (e.target.closest('.btn-buy')) {
            const productId = e.target.closest('.btn-buy').dataset.productId;
            openPurchaseModal(productId);
        }
        
        // إغلاق نافذة الشراء
        if (e.target.closest('.close-purchase-modal')) {
            document.getElementById('purchaseModal').style.display = 'none';
        }
        
        // اختيار طريقة الدفع
        if (e.target.closest('.payment-option')) {
            const paymentOptions = document.querySelectorAll('.payment-option');
            paymentOptions.forEach(option => option.classList.remove('active'));
            e.target.closest('.payment-option').classList.add('active');
        }
        
        // تأكيد عملية الشراء
        if (e.target.id === 'confirmPurchase') {
            confirmPurchase();
        }
    });
    
    // تصفية المنتجات حسب الفئة
    const categoryLinks = document.querySelectorAll('.btn-category');
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.getAttribute('href').replace('#', '');
            filterProductsByCategory(category);
        });
    });
}

// تسجيل دخول الأدمن
async function handleAdminLogin(e) {
    e.preventDefault();
    
    const password = document.getElementById('adminPassword').value;
    const modal = document.getElementById('adminModal');
    
    // كلمة المرور: Maski2026
    if (password === 'Maski2026') {
        // حفظ جلسة الأدمن
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('adminSessionTime', Date.now());
        
        // إظهار رسالة نجاح
        showNotification('تم الدخول بنجاح!', 'success');
        
        // إعادة التوجيه إلى لوحة التحكم
        setTimeout(() => {
            window.location.href = 'admin/dashboard.html';
        }, 1000);
    } else {
        showNotification('كلمة المرور غير صحيحة!', 'error');
    }
}

// التحقق من جلسة الأدمن
function checkAdminSession() {
    const loggedIn = localStorage.getItem('adminLoggedIn');
    const sessionTime = localStorage.getItem('adminSessionTime');
    
    if (loggedIn && sessionTime) {
        const sessionAge = Date.now() - parseInt(sessionTime);
        const sessionMaxAge = 24 * 60 * 60 * 1000; // 24 ساعة
        
        if (sessionAge > sessionMaxAge) {
            // انتهت الجلسة
            localStorage.removeItem('adminLoggedIn');
            localStorage.removeItem('adminSessionTime');
        }
    }
}

// فتح نافذة الشراء
async function openPurchaseModal(productId) {
    const modal = document.getElementById('purchaseModal');
    const purchaseDetails = document.getElementById('purchaseDetails');
    
    // محاكاة جلب بيانات المنتج (في الواقع من Supabase)
    const product = {
        id: productId,
        title: "كود 1000 جوهرة فري فاير",
        description: "كود لشراء 1000 جوهرة في لعبة فري فاير",
        price: 1.10
    };
    
    purchaseDetails.innerHTML = `
        <div class="purchase-product-info">
            <h4>${product.title}</h4>
            <p>${product.description}</p>
            <div class="purchase-price">
                السعر: <strong>$${product.price}</strong>
            </div>
        </div>
        <div class="purchase-notice">
            <i class="fas fa-info-circle"></i>
            بعد التأكيد، ستتوجه إلى بوابة NowPayments لإتمام الدفع
        </div>
    `;
    
    modal.style.display = 'flex';
}

// تأكيد عملية الشراء
async function confirmPurchase() {
    const selectedPayment = document.querySelector('.payment-option.active');
    
    if (!selectedPayment) {
        showNotification('يرجى اختيار طريقة الدفع', 'warning');
        return;
    }
    
    const paymentMethod = selectedPayment.dataset.method;
    
    try {
        // محاكاة عملية الدفع (في الواقع: إرسال طلب إلى NowPayments)
        showNotification('جارٍ توجيهك إلى بوابة الدفع...', 'info');
        
        // هنا سيتم إعادة التوجيه إلى NowPayments
        setTimeout(() => {
            // window.location.href = `https://nowpayments.io/payment/?data=...`;
            showNotification('تم إنشاء طلب الدفع بنجاح!', 'success');
            document.getElementById('purchaseModal').style.display = 'none';
        }, 1500);
        
    } catch (error) {
        console.error('خطأ في عملية الدفع:', error);
        showNotification('حدث خطأ في عملية الدفع', 'error');
    }
}

// تصفية المنتجات حسب الفئة
function filterProductsByCategory(category) {
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
        if (category === 'all' || product.dataset.category === category) {
            product.style.display = 'block';
            product.classList.add('fade-in', 'visible');
        } else {
            product.style.display = 'none';
        }
    });
}

// تحميل الإعلانات
function loadAds() {
    // A-ADS إعلان
    const aAdsHeader = document.getElementById('a-ads-header');
    if (aAdsHeader) {
        aAdsHeader.innerHTML = `
            <!-- A-ADS Code -->
            <script async src="https://a-ads.com/code.js"></script>
            <div class="a-ads" data-ad-client="your-client-id" data-ad-slot="header"></div>
        `;
    }
    
    // Adstera إعلان
    const adsteraFooter = document.getElementById('adstera-footer');
    if (adsteraFooter) {
        adsteraFooter.innerHTML = `
            <!-- Adstera Code -->
            <script async src="https://www.adstera.com/tag.js"></script>
            <div class="adstera-ad" data-zone="footer"></div>
        `;
    }
}

// إعداد القائمة المتنقلة
function setupMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.innerHTML = navLinks.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // إغلاق القائمة عند النقر على رابط
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }
}

// إعداد تأثيرات التمرير
function setupScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });
    
    fadeElements.forEach(element => {
        observer.observe(element);
    });
}

// إظهار الإشعارات
function showNotification(message, type = 'info') {
    // إزالة أي إشعارات سابقة
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-times-circle',
        warning: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };
    
    notification.innerHTML = `
        <i class="fas ${icons[type]}"></i>
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    // إضافة الأنيميشن
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // إغلاق الإشعار
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // إزالة الإشعار تلقائياً بعد 5 ثواني
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// إضافة تنسيقات الإشعارات
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(30, 30, 46, 0.95);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 1rem;
        z-index: 10000;
        transform: translateX(150%);
        transition: transform 0.3s ease;
        border-left: 4px solid var(--primary-color);
        backdrop-filter: blur(10px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        max-width: 400px;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification-success {
        border-left-color: var(--success-color);
    }
    
    .notification-error {
        border-left-color: var(--danger-color);
    }
    
    .notification-warning {
        border-left-color: var(--warning-color);
    }
    
    .notification-info {
        border-left-color: var(--primary-color);
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        margin-right: -5px;
    }
`;

document.head.appendChild(notificationStyles);
