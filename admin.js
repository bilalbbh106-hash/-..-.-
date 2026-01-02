// admin.js - لوحة تحكم الأدمن

document.addEventListener('DOMContentLoaded', function() {
    // التحقق من صلاحية الدخول
    checkAdminAuth();
    
    // تهيئة لوحة التحكم
    initAdminDashboard();
    
    // إعداد مستمعي الأحداث
    setupAdminEventListeners();
});

// التحقق من مصادقة الأدمن
function checkAdminAuth() {
    const loggedIn = localStorage.getItem('adminLoggedIn');
    const sessionTime = localStorage.getItem('adminSessionTime');
    
    if (!loggedIn || !sessionTime) {
        window.location.href = '../index.html';
        return;
    }
    
    const sessionAge = Date.now() - parseInt(sessionTime);
    const sessionMaxAge = 24 * 60 * 60 * 1000;
    
    if (sessionAge > sessionMaxAge) {
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('adminSessionTime');
        window.location.href = '../index.html';
    }
}

// تهيئة لوحة التحكم
function initAdminDashboard() {
    // تحميل الإحصائيات
    loadStats();
    
    // تحميل الطلبات الحديثة
    loadRecentOrders();
    
    // تحميل المنتجات
    loadAdminProducts();
    
    // تحميل الأكواد
    loadCodes();
}

// تحميل الإحصائيات
async function loadStats() {
    try {
        // محاكاة البيانات (في الواقع من Supabase)
        const stats = {
            totalSales: 12450.75,
            totalOrders: 342,
            activeProducts: 28,
            pendingOrders: 12
        };
        
        document.getElementById('totalSales').textContent = `$${stats.totalSales.toFixed(2)}`;
        document.getElementById('totalOrders').textContent = stats.totalOrders;
        document.getElementById('activeProducts').textContent = stats.activeProducts;
        document.getElementById('pendingOrders').textContent = stats.pendingOrders;
        
    } catch (error) {
        console.error('خطأ في تحميل الإحصائيات:', error);
    }
}

// تحميل الطلبات الحديثة
async function loadRecentOrders() {
    const ordersContainer = document.getElementById('recentOrders');
    if (!ordersContainer) return;
    
    try {
        // محاكاة البيانات
        const orders = [
            { id: 'ORD-001', customer: 'أحمد محمد', amount: 15.99, status: 'مكتمل', date: '2026-01-01' },
            { id: 'ORD-002', customer: 'سارة خالد', amount: 5.50, status: 'قيد الانتظار', date: '2026-01-01' },
            { id: 'ORD-003', customer: 'خالد علي', amount: 1.10, status: 'مكتمل', date: '2026-01-01' },
            { id: 'ORD-004', customer: 'فاطمة عبدالله', amount: 25.00, status: 'ملغي', date: '2025-12-31' }
        ];
        
        ordersContainer.innerHTML = orders.map(order => `
            <tr>
                <td>${order.id}</td>
                <td>${order.customer}</td>
                <td>$${order.amount}</td>
                <td><span class="status-badge status-${order.status === 'مكتمل' ? 'success' : order.status === 'قيد الانتظار' ? 'warning' : 'danger'}">${order.status}</span></td>
                <td>${order.date}</td>
                <td>
                    <button class="btn-action view-order" data-id="${order.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `).join('');
        
    } catch (error) {
        console.error('خطأ في تحميل الطلبات:', error);
        ordersContainer.innerHTML = `
            <tr>
                <td colspan="6" class="error">عذراً، حدث خطأ في تحميل الطلبات</td>
            </tr>
        `;
    }
}

// تحميل المنتجات في لوحة التحكم
async function loadAdminProducts() {
    const productsContainer = document.getElementById('adminProducts');
    if (!productsContainer) return;
    
    try {
        // محاكاة البيانات
        const products = [
            { id: 1, name: 'كود 1000 جوهرة', category: 'شحن', price: 1.10, stock: 150, status: 'نشط' },
            { id: 2, name: 'حساب مستوى 70', category: 'فري فاير', price: 15.99, stock: 5, status: 'نشط' },
            { id: 3, name: '1000 متابع انستغرام', category: 'خدمات', price: 5.50, stock: '∞', status: 'نشط' },
            { id: 4, name: 'كود 5000 جوهرة', category: 'شحن', price: 5.00, stock: 80, status: 'غير نشط' }
        ];
        
        productsContainer.innerHTML = products.map(product => `
            <tr>
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>$${product.price}</td>
                <td>${product.stock}</td>
                <td><span class="status-badge status-${product.status === 'نشط' ? 'success' : 'danger'}">${product.status}</span></td>
                <td>
                    <button class="btn-action edit-product" data-id="${product.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-action delete-product" data-id="${product.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
        
    } catch (error) {
        console.error('خطأ في تحميل المنتجات:', error);
    }
}

// تحميل الأكواد
async function loadCodes() {
    const codesContainer = document.getElementById('codesList');
    if (!codesContainer) return;
    
    try {
        // محاكاة البيانات (في الواقع من Supabase)
        const codes = [
            { id: 1, code: 'FF1000-ABC123', product: '1000 جوهرة', used: false, createdAt: '2026-01-01' },
            { id: 2, code: 'FF1000-XYZ789', product: '1000 جوهرة', used: true, createdAt: '2025-12-31' },
            { id: 3, code: 'FF5000-DEF456', product: '5000 جوهرة', used: false, createdAt: '2026-01-01' }
        ];
        
        codesContainer.innerHTML = codes.map(code => `
            <tr>
                <td>${code.id}</td>
                <td><code>${code.code}</code></td>
                <td>${code.product}</td>
                <td><span class="status-badge status-${code.used ? 'danger' : 'success'}">${code.used ? 'مستخدم' : 'متاح'}</span></td>
                <td>${code.createdAt}</td>
                <td>
                    <button class="btn-action copy-code" data-code="${code.code}">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button class="btn-action delete-code" data-id="${code.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
        
    } catch (error) {
        console.error('خطأ في تحميل الأكواد:', error);
    }
}

// إعداد مستمعي الأحداث في لوحة التحكم
function setupAdminEventListeners() {
    // تسجيل الخروج
    const logoutBtn = document.getElementById('adminLogout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // زر إنشاء منشور جديد
    const newPostBtn = document.getElementById('newPostBtn');
    const postModal = document.getElementById('postModal');
    const closePostModal = document.querySelector('.close-post-modal');
    
    if (newPostBtn && postModal) {
        newPostBtn.addEventListener('click', () => {
            postModal.style.display = 'flex';
        });
    }
    
    if (closePostModal) {
        closePostModal.addEventListener('click', () => {
            postModal.style.display = 'none';
        });
    }
    
    // رفع الصور
    const imageUpload = document.getElementById('postImages');
    const imagePreview = document.getElementById('imagePreview');
    
    if (imageUpload && imagePreview) {
        imageUpload.addEventListener('change', handleImageUpload);
    }
    
    // نشر المنشور
    const publishForm = document.getElementById('publishForm');
    if (publishForm) {
        publishForm.addEventListener('submit', handlePublishPost);
    }
    
    // إضافة أكواد جديدة
    const addCodesBtn = document.getElementById('addCodesBtn');
    const codesModal = document.getElementById('codesModal');
    const closeCodesModal = document.querySelector('.close-codes-modal');
    
    if (addCodesBtn && codesModal) {
        addCodesBtn.addEventListener('click', () => {
            codesModal.style.display = 'flex';
        });
    }
    
    if (closeCodesModal) {
        closeCodesModal.addEventListener('click', () => {
            codesModal.style.display = 'none';
        });
    }
    
    // حفظ الأكواد
    const saveCodesForm = document.getElementById('saveCodesForm');
    if (saveCodesForm) {
        saveCodesForm.addEventListener('submit', handleSaveCodes);
    }
    
    // نسخ الأكواد
    document.addEventListener('click', (e) => {
        if (e.target.closest('.copy-code')) {
            const code = e.target.closest('.copy-code').dataset.code;
            copyToClipboard(code);
        }
    });
}

// تسجيل خروج الأدمن
function handleLogout() {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminSessionTime');
    window.location.href = '../index.html';
}

// رفع الصور للمنشور
function handleImageUpload(e) {
    const files = e.target.files;
    const preview = document.getElementById('imagePreview');
    const maxImages = 7;
    
    if (files.length > maxImages) {
        alert(`يمكنك رفع ${maxImages} صور كحد أقصى`);
        e.target.value = '';
        return;
    }
    
    preview.innerHTML = '';
    
    for (let i = 0; i < Math.min(files.length, maxImages); i++) {
        const file = files[i];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const imgContainer = document.createElement('div');
            imgContainer.className = 'preview-image';
            imgContainer.innerHTML = `
                <img src="${e.target.result}" alt="معاينة ${i + 1}">
                <button type="button" class="remove-image">&times;</button>
            `;
            
            preview.appendChild(imgContainer);
            
            // زر إزالة الصورة
            imgContainer.querySelector('.remove-image').addEventListener('click', () => {
                imgContainer.remove();
                updateFileInput();
            });
        };
        
        reader.readAsDataURL(file);
    }
}

// تحديث حقل رفع الملفات
function updateFileInput() {
    // في تطبيق حقيقي، قد تحتاج إلى إعادة إنشاء حقل الملفات
}

// نشر المنشور
async function handlePublishPost(e) {
    e.preventDefault();
    
    const title = document.getElementById('postTitle').value;
    const content = document.getElementById('postContent').value;
    const category = document.getElementById('postCategory').value;
    const images = document.getElementById('postImages').files;
    
    if (!title || !content || !category) {
        alert('يرجى ملء جميع الحقول المطلوبة');
        return;
    }
    
    try {
        // محاكاة الحفظ (في الواقع إلى Supabase)
        const postData = {
            title,
            content,
            category,
            images: images.length,
            publishedAt: new Date().toISOString()
        };
        
        // إظهار رسالة نجاح
        showAdminNotification('تم نشر المنشور بنجاح!', 'success');
        
        // إغلاق النافذة المنبثقة
        document.getElementById('postModal').style.display = 'none';
        
        // إعادة تعيين النموذج
        e.target.reset();
        document.getElementById('imagePreview').innerHTML = '';
        
        // تحديث قائمة المنشورات
        setTimeout(() => {
            loadRecentPosts();
        }, 1000);
        
    } catch (error) {
        console.error('خطأ في نشر المنشور:', error);
        showAdminNotification('حدث خطأ في نشر المنشور', 'error');
    }
}

// حفظ الأكواد الجديدة
async function handleSaveCodes(e) {
    e.preventDefault();
    
    const codesText = document.getElementById('codesText').value;
    const productId = document.getElementById('codeProduct').value;
    const price = document.getElementById('codePrice').value;
    
    if (!codesText || !productId || !price) {
        alert('يرجى ملء جميع الحقول المطلوبة');
        return;
    }
    
    try {
        // تقسيم النص إلى أكواد فردية
        const codes = codesText.split('\n')
            .map(code => code.trim())
            .filter(code => code.length > 0);
        
        // محاكاة الحفظ (في الواقع إلى Supabase)
        const codesData = {
            codes,
            productId,
            price: parseFloat(price),
            addedAt: new Date().toISOString(),
            addedBy: 'Admin'
        };
        
        // إظهار رسالة نجاح
        showAdminNotification(`تم حفظ ${codes.length} كود بنجاح!`, 'success');
        
        // إغلاق النافذة المنبثقة
        document.getElementById('codesModal').style.display = 'none';
        
        // إعادة تعيين النموذج
        e.target.reset();
        
        // تحديث قائمة الأكواد
        setTimeout(() => {
            loadCodes();
        }, 1000);
        
    } catch (error) {
        console.error('خطأ في حفظ الأكواد:', error);
        showAdminNotification('حدث خطأ في حفظ الأكواد', 'error');
    }
}

// نسخ النص إلى الحافظة
function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => {
            showAdminNotification('تم نسخ الكود إلى الحافظة', 'success');
        })
        .catch(err => {
            console.error('فشل في النسخ: ', err);
            showAdminNotification('فشل في نسخ الكود', 'error');
        });
}

// تحميل المنشورات الحديثة
async function loadRecentPosts() {
    const postsContainer = document.getElementById('recentPosts');
    if (!postsContainer) return;
    
    try {
        // محاكاة البيانات
        const posts = [
            { id: 1, title: 'عرض خاص على الجواهر', category: 'عروض', date: '2026-01-01', views: 150 },
            { id: 2, title: 'خدمات جديدة للتسويق', category: 'خدمات', date: '2025-12-31', views: 89 },
            { id: 3, title: 'حسابات فري فاير نادرة', category: 'فري فاير', date: '2025-12-30', views: 245 }
        ];
        
        postsContainer.innerHTML = posts.map(post => `
            <div class="post-item">
                <h4>${post.title}</h4>
                <div class="post-meta">
                    <span class="post-category">${post.category}</span>
                    <span class="post-date">${post.date}</span>
                    <span class="post-views">${post.views} مشاهدة</span>
                </div>
                <div class="post-actions">
                    <button class="btn-action edit-post" data-id="${post.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-action delete-post" data-id="${post.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('خطأ في تحميل المنشورات:', error);
    }
}

// إظهار إشعارات الأدمن
function showAdminNotification(message, type = 'info') {
    // إزالة أي إشعارات سابقة
    const existingNotification = document.querySelector('.admin-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `admin-notification notification-${type}`;
    
    notification.innerHTML = `
        <i class="fas ${getNotificationIcon(type)}"></i>
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    document.querySelector('.admin-container').appendChild(notification);
    
    // إظهار الإشعار
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
    
    // إزالة الإشعار تلقائياً
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

// الحصول على أيقونة الإشعار
function getNotificationIcon(type) {
    switch(type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-times-circle';
        case 'warning': return 'fa-exclamation-circle';
        default: return 'fa-info-circle';
    }
}

// إضافة تنسيقات إشعارات الأدمن
const adminNotificationStyles = document.createElement('style');
adminNotificationStyles.textContent = `
    .admin-notification {
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
    
    .admin-notification.show {
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
    
    .admin-notification .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        margin-right: -5px;
    }
`;

document.head.appendChild(adminNotificationStyles);
