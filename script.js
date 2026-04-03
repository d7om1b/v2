// ========================================
// PMU STUDENT HUB - COMPLETE SCRIPT
// Version: 2.0
// ========================================

// ========== UTILITY FUNCTIONS ==========

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
    
    // تحديث البحث عند فتح صفحة البحث
    if (pageId === 'search-page') {
        loadRecentSearches();
    }
}

// ========== TOAST NOTIFICATION ==========
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
    } else {
        alert(message);
    }
}

// ========== ROOM DATA ==========
const roomsData = {
    "101": {
        building: "Building A",
        floor: "First Floor",
        location: "Near North Elevator",
        image: "./room2.png",
        desc: "Located near the North Elevator. Perfect for group studies and lectures.",
        descAr: "يقع بالقرب من المصعد الشمالي. مثالي للدراسات الجماعية والمحاضرات"
    },
    "102": {
        building: "Building A",
        floor: "First Floor",
        location: "Near South Elevator",
        image: "https://via.placeholder.com/400x200?text=Room+102",
        desc: "Located near the South Elevator. Quiet area for studying.",
        descAr: "يقع بالقرب من المصعد الجنوبي. منطقة هادئة للدراسة"
    },
    "201": {
        building: "Building B",
        floor: "Second Floor",
        location: "Next to Faculty Office",
        image: "https://via.placeholder.com/400x200?text=Room+201",
        desc: "Computer lab with 30 workstations. Available for students.",
        descAr: "معمل حاسوب مزود بـ 30 محطة عمل. متاح للطلاب"
    },
    "202": {
        building: "Building B",
        floor: "Second Floor",
        location: "Opposite to Library",
        image: "https://via.placeholder.com/400x200?text=Room+202",
        desc: "Study room with group discussion area.",
        descAr: "غرفة دراسة مع منطقة مناقشة جماعية"
    },
    "301": {
        building: "Building C",
        floor: "Third Floor",
        location: "Computer Lab",
        image: "https://via.placeholder.com/400x200?text=Room+301",
        desc: "Advanced computer lab with modern equipment.",
        descAr: "معمل حاسوب متقدم بأجهزة حديثة"
    }
};

// ========== SEARCH FUNCTIONS ==========
// Search Room
function searchRoom() {
    const input = document.getElementById('roomInput').value.trim();
    const resultDiv = document.getElementById('room-result');
    
    if (!input) {
        showToast('Please enter a room number', true);
        return;
    }
    
    const roomData = roomsData[input];
    if (roomData) {
        // تحديث الصورة
        const roomImage = document.getElementById('room-image');
        if (roomImage) {
            roomImage.src = roomData.image;
            roomImage.alt = `Room ${input} Image`;
        }
        
        // تحديث معلومات الغرفة
        document.getElementById('room-number').innerHTML = `Room ${input}`;
        document.getElementById('room-building').innerHTML = roomData.building;
        document.getElementById('room-floor').innerHTML = roomData.floor;
        document.getElementById('room-location').innerHTML = roomData.location;
        
        // إظهار النتيجة
        resultDiv.classList.remove('hidden');
        
        // حفظ البحث الأخير
        let recents = JSON.parse(localStorage.getItem('pmu_recent_searches') || '[]');
        recents = [input, ...recents.filter(r => r !== input)].slice(0, 5);
        localStorage.setItem('pmu_recent_searches', JSON.stringify(recents));
        loadRecentSearches();
        
        showToast(`📍 Room ${input} found!`);
    } else {
        resultDiv.classList.add('hidden');
        showToast('Room not found! Try 101, 102, 201, 202, or 301', true);
    }
}

// Load Recent Searches
function loadRecentSearches() {
    const container = document.getElementById('recent-list');
    if (!container) return;
    const recents = JSON.parse(localStorage.getItem('pmu_recent_searches') || '[]');
    if (recents.length === 0) {
        container.innerHTML = '<p style="color: #6c757d; font-size: 12px; width: 100%; text-align: center;">No recent searches</p>';
        return;
    }
    container.innerHTML = recents.map(room => `
        <div class="recent-item" onclick="searchRecent('${room}')">
            <i class="fa-solid fa-clock-rotate-left"></i>
            <span>Room ${room}</span>
        </div>
    `).join('');
}

function searchRecent(room) {
    document.getElementById('roomInput').value = room;
    searchRoom();
}

function clearRecentSearches() {
    localStorage.removeItem('pmu_recent_searches');
    loadRecentSearches();
    showToast('Recent searches cleared');
}

// Enter key search
document.getElementById('roomInput')?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') searchRoom();
});

// ========== FAVORITES FUNCTIONS ==========
let favorites = JSON.parse(localStorage.getItem('pmu_favorites')) || [];

function toggleFavorite() {
    const roomNumber = window.currentRoomNumber;
    if (!roomNumber) {
        showToast('No room selected!', true);
        return;
    }
    
    if (favorites.includes(roomNumber)) {
        favorites = favorites.filter(r => r !== roomNumber);
        showToast(`Room ${roomNumber} removed from favorites`);
    } else {
        favorites.push(roomNumber);
        showToast(`Room ${roomNumber} added to Favorites! ❤️`);
    }
    
    localStorage.setItem('pmu_favorites', JSON.stringify(favorites));
    renderFavorites();
}

function renderFavorites() {
    const favContainer = document.getElementById('favorites-list');
    if (!favContainer) return;
    favContainer.innerHTML = '';
    if (favorites.length === 0) {
        favContainer.innerHTML = '<p style="color:rgba(255,255,255,0.5); font-size:12px; text-align:center;">No favorites yet</p>';
        return;
    }
    favorites.forEach(room => {
        favContainer.innerHTML += `
            <div class="fav-item-card" onclick="goToRoom('${room}')">
                <span><i class="fa-solid fa-location-dot" style="color:#f39c12;"></i> Room ${room}</span>
                <button onclick="event.stopPropagation(); removeFromFav('${room}')"><i class="fa-solid fa-trash-can"></i></button>
            </div>
        `;
    });
}

function removeFromFav(roomNumber) {
    favorites = favorites.filter(r => r !== roomNumber);
    localStorage.setItem('pmu_favorites', JSON.stringify(favorites));
    renderFavorites();
    showToast(`Room ${roomNumber} removed`);
}

function goToRoom(roomNumber) {
    document.getElementById('roomInput').value = roomNumber;
    searchRoom();
}

function shareLocation() {
    const roomNumber = window.currentRoomNumber;
    if (roomNumber) {
        const text = `📍 Room ${roomNumber} at PMU University`;
        if (navigator.share) {
            navigator.share({ title: 'PMU Location', text: text });
        } else {
            navigator.clipboard.writeText(text);
            showToast('Location copied to clipboard!');
        }
    } else {
        showToast('No room selected', true);
    }
}

// ========== PROFILE FUNCTIONS ==========
function handleSignIn() {
    const email = document.querySelector('#profile-page .pmu-outlined-field input[type="email"]').value;
    const password = document.querySelector('#profile-page .pmu-outlined-field input[type="password"]').value;
    
    if (email && password) {
        showToast('Login successful! Welcome back.');
    } else {
        showToast('Please enter both email and password', true);
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
                if (container) container.classList.remove('hidden');
                setRealHeight();
            }, 500);
        }
    }, 2000);
    
    loadRecentSearches();
    renderFavorites();
});

// ========== WINDOW EVENTS ==========
window.addEventListener('resize', setRealHeight);
window.addEventListener('orientationchange', setRealHeight);

// ========== SERVICE WORKER (PWA) ==========
// ========== SERVICE WORKER (PWA) ==========
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')  // أضف ./
            .then(registration => {
                console.log('✅ Service Worker registered:', registration.scope);
            })
            .catch(error => {
                console.log('❌ Service Worker registration failed:', error);
            });
    });
}

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('PMU Student Hub - Script Loaded');
    console.log('Home page:', document.getElementById('home-page'));
    console.log('Search page:', document.getElementById('search-page'));
    console.log('Profile page:', document.getElementById('profile-page'));
    
    setRealHeight();
    loadRecentSearches();
    renderFavorites();
});

// ========== EXPORT FUNCTIONS FOR GLOBAL USE ==========
window.switchPage = switchPage;
window.showToast = showToast;
window.searchRoom = searchRoom;
window.clearRecentSearches = clearRecentSearches;
window.searchRecent = searchRecent;
window.toggleFavorite = toggleFavorite;
window.removeFromFav = removeFromFav;
window.goToRoom = goToRoom;
window.shareLocation = shareLocation;
window.handleSignIn = handleSignIn;

// ========== NOTIFICATIONS FUNCTIONS ==========

// فتح نافذة الإشعارات
function openNotificationsModal() {
    console.log('Opening notifications modal');
    const modal = document.getElementById('notifications-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('active');
        console.log('Modal opened');
    } else {
        console.error('Modal element not found');
    }
}

// إغلاق نافذة الإشعارات
function closeNotificationsModal() {
    console.log('Closing notifications modal');
    const modal = document.getElementById('notifications-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('active');
    }
}

// تحديد جميع الإشعارات كمقروءة
function markAllNotificationsRead() {
    const notifications = document.querySelectorAll('.notification-item');
    notifications.forEach(notif => {
        notif.classList.remove('unread');
    });
    
    // تحديث العداد
    const badge = document.querySelector('.notification-badge');
    if (badge) {
        badge.style.display = 'none';
        badge.innerText = '0';
    }
    
    showToast('All notifications marked as read');
    closeNotificationsModal();
}

// إضافة إشعار جديد
function addNotification(title, message) {
    const container = document.getElementById('notifications-list');
    if (!container) return;
    
    const notification = document.createElement('div');
    notification.className = 'notification-item unread';
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fa-regular fa-bell"></i>
        </div>
        <div class="notification-content">
            <h4>${title}</h4>
            <p>${message}</p>
            <span>Just now</span>
        </div>
    `;
    
    container.insertBefore(notification, container.firstChild);
    
    // تحديث العداد
    const badge = document.querySelector('.notification-badge');
    if (badge) {
        badge.style.display = 'flex';
        let count = parseInt(badge.innerText) || 0;
        badge.innerText = count + 1;
    }
    
    showToast('New notification added');
}

// إغلاق النافذة عند الضغط على ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeNotificationsModal();
    }
});
