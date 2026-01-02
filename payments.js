// payments.js - نظام الدفع

class PaymentSystem {
    constructor() {
        this.nowPaymentsApiKey = 'YOUR_NOWPAYMENTS_API_KEY';
        this.supabaseUrl = 'YOUR_SUPABASE_URL';
        this.supabaseKey = 'YOUR_SUPABASE_KEY';
        this.currentOrder = null;
    }
    
    // إنشاء طلب دفع جديد
    async createPayment(orderData) {
        try {
            // حفظ الطلب في قاعدة البيانات
            const orderId = await this.saveOrder(orderData);
            
            // إنشاء دفعة في NowPayments
            const paymentData = {
                price_amount: orderData.total,
                price_currency: "usd",
                pay_currency: orderData.paymentMethod === 'crypto' ? "btc" : "usd",
                ipn_callback_url: `${window.location.origin}/api/payment-callback`,
                order_id: orderId,
                order_description: orderData.description,
                success_url: `${window.location.origin}/payment-success.html`,
                cancel_url: `${window.location.origin}/payment-cancel.html`
            };
            
            const response = await fetch('https://api.nowpayments.io/v1/payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': this.nowPaymentsApiKey
                },
                body: JSON.stringify(paymentData)
            });
            
            if (!response.ok) {
                throw new Error('فشل في إنشاء الدفع');
            }
            
            const payment = await response.json();
            
            // حفظ بيانات الدفع في قاعدة البيانات
            await this.savePaymentDetails(orderId, payment);
            
            // توجيه المستخدم إلى صفحة الدفع
            if (payment.pay_address) {
                window.location.href = `https://nowpayments.io/payment/?iid=${payment.payment_id}`;
            }
            
            return payment;
            
        } catch (error) {
            console.error('خطأ في إنشاء الدفع:', error);
            throw error;
        }
    }
    
    // حفظ الطلب في Supabase
    async saveOrder(orderData) {
        try {
            // في الواقع، سيتم الاتصال بـ Supabase
            // هذا مثال محاكاة
            const orderId = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
            
            // حفظ في localStorage كمثال
            const orders = JSON.parse(localStorage.getItem('masky_orders') || '[]');
            orders.push({
                id: orderId,
                ...orderData,
                status: 'pending',
                createdAt: new Date().toISOString()
            });
            
            localStorage.setItem('masky_orders', JSON.stringify(orders));
            
            return orderId;
            
        } catch (error) {
            console.error('خطأ في حفظ الطلب:', error);
            throw error;
        }
    }
    
    // حفظ تفاصيل الدفع
    async savePaymentDetails(orderId, paymentDetails) {
        try {
            // حفظ في localStorage كمثال
            const payments = JSON.parse(localStorage.getItem('masky_payments') || '[]');
            payments.push({
                orderId,
                ...paymentDetails,
                recordedAt: new Date().toISOString()
            });
            
            localStorage.setItem('masky_payments', JSON.stringify(payments));
            
        } catch (error) {
            console.error('خطأ في حفظ تفاصيل الدفع:', error);
        }
    }
    
    // التحقق من حالة الدفع
    async checkPaymentStatus(paymentId) {
        try {
            const response = await fetch(`https://api.nowpayments.io/v1/payment/${paymentId}`, {
                headers: {
                    'x-api-key': this.nowPaymentsApiKey
                }
            });
            
            if (!response.ok) {
                throw new Error('فشل في التحقق من حالة الدفع');
            }
            
            const status = await response.json();
            return status;
            
        } catch (error) {
            console.error('خطأ في التحقق من حالة الدفع:', error);
            throw error;
        }
    }
    
    // معالجة رد الاتصال من NowPayments
    async handlePaymentCallback(paymentData) {
        try {
            // التحقق من توقيع الطلب
            if (!this.verifyCallbackSignature(paymentData)) {
                throw new Error('توقيع غير صالح');
            }
            
            const { payment_id, order_id, payment_status } = paymentData;
            
            // تحديث حالة الطلب
            await this.updateOrderStatus(order_id, payment_status);
            
            // إذا كان الدفع مكتملاً، إرسال المنتج
            if (payment_status === 'finished') {
                await this.deliverProduct(order_id);
            }
            
            return { success: true };
            
        } catch (error) {
            console.error('خطأ في معالجة رد الاتصال:', error);
            throw error;
        }
    }
    
    // تحديث حالة الطلب
    async updateOrderStatus(orderId, status) {
        try {
            // في الواقع، تحديث في Supabase
            const orders = JSON.parse(localStorage.getItem('masky_orders') || '[]');
            const orderIndex = orders.findIndex(order => order.id === orderId);
            
            if (orderIndex !== -1) {
                orders[orderIndex].status = status;
                orders[orderIndex].updatedAt = new Date().toISOString();
                localStorage.setItem('masky_orders', JSON.stringify(orders));
            }
            
        } catch (error) {
            console.error('خطأ في تحديث حالة الطلب:', error);
            throw error;
        }
    }
    
    // تسليم المنتج (إرسال الكود)
    async deliverProduct(orderId) {
        try {
            // في الواقع، جلب الكود من قاعدة البيانات وإرساله
            const orders = JSON.parse(localStorage.getItem('masky_orders') || '[]');
            const order = orders.find(o => o.id === orderId);
            
            if (order) {
                // هنا سيتم إرسال الكود عبر البريد الإلكتروني أو عرضه
                console.log('تم تسليم المنتج للطلب:', orderId);
                
                // تحديث حالة التسليم
                order.delivered = true;
                order.deliveredAt = new Date().toISOString();
                localStorage.setItem('masky_orders', JSON.stringify(orders));
            }
            
        } catch (error) {
            console.error('خطأ في تسليم المنتج:', error);
            throw error;
        }
    }
    
    // التحقق من توقيع رد الاتصال
    verifyCallbackSignature(paymentData) {
        // في الواقع، التحقق من توقيع NowPayments
        // هذا مثال مبسط
        return true;
    }
    
    // إنشاء فاتورة
    generateInvoice(orderData) {
        const invoice = `
            <div class="invoice">
                <h3>فاتورة الشراء</h3>
                <div class="invoice-details">
                    <p><strong>رقم الفاتورة:</strong> INV-${Date.now()}</p>
                    <p><strong>التاريخ:</strong> ${new Date().toLocaleDateString('ar-SA')}</p>
                    <p><strong>المنتج:</strong> ${orderData.productName}</p>
                    <p><strong>الكمية:</strong> 1</p>
                    <p><strong>السعر:</strong> $${orderData.price}</p>
                    <hr>
                    <p><strong>الإجمالي:</strong> $${orderData.total}</p>
                </div>
            </div>
        `;
        
        return invoice;
    }
}

// تهيئة نظام الدفع
const paymentSystem = new PaymentSystem();

// تصدير للاستخدام في الملفات الأخرى
window.PaymentSystem = paymentSystem;
