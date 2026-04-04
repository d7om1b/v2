// ========================================
// PMU STUDENT HUB - MAIN SCRIPT
// Version: 2.0
// ========================================

// ========== UTILITY FUNCTIONS ==========

// Toast Notification
function showToast(message, isError = false) {
    const toast = document.getElementById('custom-toast');
    if (toast) {
        toast.querySelector('span').innerText = message;
        toast.style.border = `1px solid ${isError ? '#e74c3c' : '#f39c12'}`;
        toast.classList.remove('toast-hidden');
        toast.classList.add('toast-show');
        setTimeout(() => {
            toast.classList.remove('toast-show');
            setTimeout(() => toast.classList.add('toast-hidden'), 300);
        }, 2000);
    }
}

// حساب الـ vh للأجهزة المحمولة
function setRealHeight() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// ========== NAVIGATION ==========
function switchPage(pageId, element) {
    console.log('Switching to:', pageId);
    
    // إخفاء جميع الشاشات
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // إظهار الشاشة المطلوبة
    const target = document.getElementById(pageId);
    if (target) {
        target.classList.add('active');
        console.log('Activated:', pageId);
    } else {
        console.error('Page not found:', pageId);
    }
    
    // تحديث شريط التنقل
    if (element) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        element.classList.add('active');
    }
}

// ========== SEARCH FUNCTIONS ==========
const roomsData = {
    "101": { building: "Building A", floor: "First Floor", location: "Near North Elevator", image: "./room1" },
    "102": { building: "Building A", floor: "First Floor", location: "Near South Elevator", image: "./room2" },
    "201": { building: "Building B", floor: "Second Floor", location: "Next to Faculty Office", image: "https://via.placeholder.com/400x200?text=Room+201" }
};

function searchRoom() {
    const input = document.getElementById('roomInput').value.trim();
    const resultDiv = document.getElementById('room-result');
    
    if (!input) {
        showToast('Please enter a room number', true);
        return;
    }
    
    const roomData = roomsData[input];
    if (roomData) {
        document.getElementById('room-image').src = roomData.image;
        document.getElementById('room-number').innerHTML = `Room ${input}`;
        document.getElementById('room-building').innerHTML = roomData.building;
        document.getElementById('room-floor').innerHTML = roomData.floor;
        document.getElementById('room-location').innerHTML = roomData.location;
        resultDiv.classList.remove('hidden');
        showToast(`📍 Room ${input} found!`);
    } else {
        resultDiv.classList.add('hidden');
        showToast('Room not found! Try 101, 102, or 201', true);
    }
}

function clearRecentSearches() {
    showToast('Recent searches cleared');
}

// ========== NOTIFICATIONS MODAL ==========
function openNotificationsModal() {
    const modal = document.getElementById('notifications-modal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

function closeNotificationsModal() {
    const modal = document.getElementById('notifications-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

function markAllNotificationsRead() {
    closeNotificationsModal();
    showToast('All notifications marked as read');
}

// ========== LOGIN & DASHBOARD ==========
function handleStudentLogin() {
    console.log('🔵 Login button clicked');
    
    const emailInput = document.querySelector('#profile-page .pmu-outlined-field input[type="email"]');
    const passInput = document.querySelector('#profile-page .pmu-outlined-field input[type="password"]');
    
    if (!emailInput || !passInput) {
        showToast('Login form not found', true);
        return;
    }
    
    const email = emailInput.value.trim();
    const password = passInput.value.trim();
    
    if (email && password) {
        // تحديث اسم المستخدم في Dashboard
        const dashboardName = document.getElementById('dashboard-name');
        const dashboardEmail = document.getElementById('dashboard-email');
        
        if (dashboardName) {
            dashboardName.innerText = email.split('@')[0] || "Student";
        }
        if (dashboardEmail) {
            dashboardEmail.innerText = email;
        }
        
        showToast('Login successful! Welcome back.');
        
        // إخفاء جميع الشاشات
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // إظهار Dashboard
        const dashboard = document.getElementById('student-dashboard');
        if (dashboard) {
            dashboard.classList.add('active');
            console.log('✅ Dashboard activated');
        }
    } else {
        showToast('Please enter both email and password', true);
    }
}

function logoutFromDashboard() {
    if (confirm('Are you sure you want to sign out?')) {
        // العودة إلى صفحة البروفايل
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        const profilePage = document.getElementById('profile-page');
        if (profilePage) {
            profilePage.classList.add('active');
        }
        
        // تحديث شريط التنقل
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        const profileNav = document.querySelector('.nav-item[onclick*="profile-page"]');
        if (profileNav) {
            profileNav.classList.add('active');
        }
        
        showToast('Logged out successfully');
    }
}

// ========== SPLASH SCREEN ==========
window.addEventListener('load', function() {
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        const container = document.querySelector('.app-container');
        if (splash) {
            splash.style.opacity = '0';
            setTimeout(() => {
                splash.classList.add('hidden');
                if (container) {
                    container.classList.remove('hidden');
                }
                setRealHeight();
            }, 500);
        }
    }, 1500);
    
    setRealHeight();
});

window.addEventListener('resize', setRealHeight);
window.addEventListener('orientationchange', setRealHeight);

// ========== DOM CONTENT LOADED ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - PMU Student Hub ready');
    loadSavedAvatar();
    // زر تسجيل الدخول
    const signinBtn = document.getElementById('signinBtn');
    if (signinBtn) {
        signinBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleStudentLogin();
        });
    }
    
    // زر تسجيل الخروج
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            logoutFromDashboard();
        });
    }
    
    // زر البحث (Enter key)
    const roomInput = document.getElementById('roomInput');
    if (roomInput) {
        roomInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchRoom();
            }
        });
    }
});

// ========== EXPORT FUNCTIONS FOR GLOBAL USE ==========
window.switchPage = switchPage;
window.showToast = showToast;
window.searchRoom = searchRoom;
window.clearRecentSearches = clearRecentSearches;
window.openNotificationsModal = openNotificationsModal;
window.closeNotificationsModal = closeNotificationsModal;
window.markAllNotificationsRead = markAllNotificationsRead;
window.handleStudentLogin = handleStudentLogin;
window.logoutFromDashboard = logoutFromDashboard;


// ========== PROFILE AVATAR FUNCTIONS ==========

// تغيير صورة البروفايل
function changeProfileAvatar() {
    // إنشاء input لاختيار ملف
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const avatarImg = document.getElementById('logo.png');
                if (avatarImg) {
                    avatarImg.src = event.target.result;
                    // حفظ الصورة في localStorage
                    localStorage.setItem('user_avatar', event.target.result);
                    showToast('Profile picture updated!');
                }
            };
            reader.readAsDataURL(file);
        }
    };
    
    input.click();
}

// تحميل الصورة المحفوظة عند بدء التشغيل
function loadSavedAvatar() {
    const savedAvatar = localStorage.getItem('user_avatar');
    if (savedAvatar) {
        const avatarImg = document.getElementById('B1.png');
        if (avatarImg) {
            avatarImg.src = savedAvatar;
        }
    }
}

// إضافة استدعاء تحميل الصورة في DOMContentLoaded
// أضف هذا السطر داخل document.addEventListener('DOMContentLoaded', function() { ... })
// loadSavedAvatar();
