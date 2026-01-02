// drag-scroll.js - نظام السحب للمحتوى

function initDragScroll() {
    const scrollContainer = document.getElementById('categoriesScroll');
    if (!scrollContainer) return;
    
    let isDragging = false;
    let startX;
    let scrollLeft;
    
    // أزرار السحب
    const scrollLeftBtn = document.querySelector('.scroll-left');
    const scrollRightBtn = document.querySelector('.scroll-right');
    
    // السحب بالمؤشر
    scrollContainer.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX - scrollContainer.offsetLeft;
        scrollLeft = scrollContainer.scrollLeft;
        scrollContainer.style.cursor = 'grabbing';
        scrollContainer.style.userSelect = 'none';
    });
    
    scrollContainer.addEventListener('mouseleave', () => {
        isDragging = false;
        scrollContainer.style.cursor = 'grab';
    });
    
    scrollContainer.addEventListener('mouseup', () => {
        isDragging = false;
        scrollContainer.style.cursor = 'grab';
        scrollContainer.style.userSelect = 'auto';
    });
    
    scrollContainer.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - scrollContainer.offsetLeft;
        const walk = (x - startX) * 2;
        scrollContainer.scrollLeft = scrollLeft - walk;
    });
    
    // السحب باللمس (للأجهزة المحمولة)
    scrollContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].pageX - scrollContainer.offsetLeft;
        scrollLeft = scrollContainer.scrollLeft;
    });
    
    scrollContainer.addEventListener('touchmove', (e) => {
        if (!startX) return;
        const x = e.touches[0].pageX - scrollContainer.offsetLeft;
        const walk = (x - startX) * 2;
        scrollContainer.scrollLeft = scrollLeft - walk;
    });
    
    // أزرار السحب
    if (scrollLeftBtn) {
        scrollLeftBtn.addEventListener('click', () => {
            scrollContainer.scrollLeft += 350;
        });
    }
    
    if (scrollRightBtn) {
        scrollRightBtn.addEventListener('click', () => {
            scrollContainer.scrollLeft -= 350;
        });
    }
    
    // إضافة تأثير السحب للمؤشر
    scrollContainer.style.cursor = 'grab';
    
    // إضافة تأثير عند التمرير
    scrollContainer.addEventListener('scroll', () => {
        const cards = scrollContainer.querySelectorAll('.category-card');
        cards.forEach((card, index) => {
            const rect = card.getBoundingClientRect();
            const isVisible = rect.left < window.innerWidth && rect.right > 0;
            
            if (isVisible) {
                card.style.transform = 'translateY(-10px)';
                card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
            } else {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = 'none';
            }
        });
    });
    
    // السحب الأفقي بعجلة الماوس
    scrollContainer.addEventListener('wheel', (e) => {
        if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
            e.preventDefault();
            scrollContainer.scrollLeft += e.deltaY * 2;
        }
    });
}

// تهيئة السحب لجميع العناصر القابلة للسحب
document.addEventListener('DOMContentLoaded', () => {
    initDragScroll();
    
    // جعل جميع الحاويات القابلة للسحب قابلة للسحب
    const draggableContainers = document.querySelectorAll('.drag-scroll-wrapper');
    draggableContainers.forEach(container => {
        makeDraggable(container);
    });
});

// دالة لجعل أي عنصر قابل للسحب
function makeDraggable(element) {
    const scrollContainer = element.querySelector('.categories-scroll') || element;
    
    let pos = { top: 0, left: 0, x: 0, y: 0 };
    
    const mouseDownHandler = function(e) {
        scrollContainer.style.cursor = 'grabbing';
        scrollContainer.style.userSelect = 'none';
        
        pos = {
            left: scrollContainer.scrollLeft,
            top: scrollContainer.scrollTop,
            x: e.clientX,
            y: e.clientY,
        };
        
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };
    
    const mouseMoveHandler = function(e) {
        const dx = e.clientX - pos.x;
        const dy = e.clientY - pos.y;
        
        scrollContainer.scrollLeft = pos.left - dx;
        scrollContainer.scrollTop = pos.top - dy;
    };
    
    const mouseUpHandler = function() {
        scrollContainer.style.cursor = 'grab';
        scrollContainer.style.userSelect = 'auto';
        
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    };
    
    scrollContainer.addEventListener('mousedown', mouseDownHandler);
    scrollContainer.style.cursor = 'grab';
}
