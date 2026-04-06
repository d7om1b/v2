// ========================================
// PMU STUDENT HUB - MAIN SCRIPT (CLEAN)
// Version: 2.0
// ========================================

// ========== UTILITY FUNCTIONS ==========
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

function setRealHeight() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// ========== NAVIGATION ==========
function switchPage(pageId, element) {
    console.log('Switching to:', pageId);
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    const target = document.getElementById(pageId);
    if (target) target.classList.add('active');
    if (element) {
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        element.classList.add('active');
    }
}

// ========== ROOMS DATA ==========
const roomsData = {
    "101": { building: "Building A", floor: "First Floor", location: "Near North Elevator", image: "room1.png" },
    "102": { building: "Building A", floor: "First Floor", location: "Near South Elevator", image: "room2.png" },
    "201": { building: "Building B", floor: "Second Floor", location: "Next to Faculty Office", image: "room1.png" }
};

const defaultRooms = {
    "101": { building: "Building A", floor: "First Floor", location: "Near North Elevator", image: "room1.png" },
    "102": { building: "Building A", floor: "First Floor", location: "Near South Elevator", image: "room1.png" },
    "201": { building: "Building B", floor: "Second Floor", location: "Next to Faculty Office", image: "room1.png" }
};

let customRooms = JSON.parse(localStorage.getItem('pmu_custom_rooms')) || {};

// ========== SEARCH FUNCTIONS ==========
function searchRoom() {
    const input = document.getElementById('roomInput').value.trim();
    const resultDiv = document.getElementById('room-result');
    if (!input) { showToast('Please enter a room number', true); return; }
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

function clearRecentSearches() { showToast('Recent searches cleared'); }

// ========== NOTIFICATIONS ==========
function openNotificationsModal() {
    const modal = document.getElementById('notifications-modal');
    if (modal) modal.classList.remove('hidden');
}
function closeNotificationsModal() {
    const modal = document.getElementById('notifications-modal');
    if (modal) modal.classList.add('hidden');
}
function markAllNotificationsRead() { closeNotificationsModal(); showToast('All marked as read'); }

// ========== LOGIN & DASHBOARD ==========
function handleStudentLogin() {
    const emailInput = document.querySelector('#profile-page .pmu-outlined-field input[type="email"]');
    const passInput = document.querySelector('#profile-page .pmu-outlined-field input[type="password"]');
    if (!emailInput || !passInput) { showToast('Login form not found', true); return; }
    const email = emailInput.value.trim();
    const password = passInput.value.trim();
    if (email && password) {
        const dashboardName = document.getElementById('dashboard-name');
        const dashboardEmail = document.getElementById('dashboard-email');
        if (dashboardName) dashboardName.innerText = email.split('@')[0] || "Student";
        if (dashboardEmail) dashboardEmail.innerText = email;
        showToast('Login successful! Welcome back.');
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        const dashboard = document.getElementById('student-dashboard');
        if (dashboard) dashboard.classList.add('active');
    } else {
        showToast('Please enter both email and password', true);
    }
}

function logoutFromDashboard() {
    if (confirm('Are you sure you want to sign out?')) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        const profilePage = document.getElementById('profile-page');
        if (profilePage) profilePage.classList.add('active');
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        const profileNav = document.querySelector('.nav-item[onclick*="profile-page"]');
        if (profileNav) profileNav.classList.add('active');
        showToast('Logged out successfully');
    }
}

// ========== AVATAR FUNCTIONS ==========
function changeProfileAvatar() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const avatarImg = document.getElementById('profile-avatar-img');
                if (avatarImg) avatarImg.src = event.target.result;
                localStorage.setItem('user_avatar', event.target.result);
                showToast('Profile picture updated!');
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
}

function loadSavedAvatar() {
    const savedAvatar = localStorage.getItem('user_avatar');
    if (savedAvatar) {
        const avatarImg = document.getElementById('profile-avatar-img');
        if (avatarImg) avatarImg.src = savedAvatar;
    }
}

function searchBuilding(roomNumber) {
    const roomInput = document.getElementById('roomInput');
    if (roomInput) {
        roomInput.value = roomNumber;
        switchPage('search-page');
        searchRoom();
    } else {
        showToast(`Searching for Room ${roomNumber}`);
    }
}

// ========== FAVORITES FUNCTIONS ==========
let favorites = JSON.parse(localStorage.getItem('pmu_favorites')) || [];

function toggleFavorite() {
    const roomNumber = window.currentRoomNumber;
    if (!roomNumber) { showToast("No room selected!", true); return; }
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
    const container = document.getElementById('favorites-container');
    if (!container) return;
    if (favorites.length === 0) {
        container.innerHTML = `<div class="empty-favorites"><i class="fa-regular fa-heart"></i><p>No favorite rooms yet</p><span>Save rooms from search results</span></div>`;
        return;
    }
    const allRooms = { ...defaultRooms, ...customRooms };
    container.innerHTML = favorites.map(room => {
        const roomData = allRooms[room];
        return `<div class="favorite-card" onclick="goToRoom('${room}')">
            <div class="favorite-info">
                <div class="favorite-icon"><i class="fa-solid fa-door-open"></i></div>
                <div class="favorite-details"><h4>Room ${room}</h4><p>${roomData?.building || 'Building'} • ${roomData?.floor || 'Floor 1'}</p></div>
            </div>
            <button class="remove-fav-btn" onclick="event.stopPropagation(); removeFavorite('${room}')"><i class="fa-solid fa-trash-can"></i></button>
        </div>`;
    }).join('');
}

function removeFavorite(roomNumber) {
    favorites = favorites.filter(r => r !== roomNumber);
    localStorage.setItem('pmu_favorites', JSON.stringify(favorites));
    renderFavorites();
    showToast(`Room ${roomNumber} removed from favorites`);
}

function clearAllFavorites() {
    if (favorites.length === 0) { showToast("No favorites to clear", true); return; }
    if (confirm('Are you sure you want to remove all favorite rooms?')) {
        favorites = [];
        localStorage.setItem('pmu_favorites', JSON.stringify(favorites));
        renderFavorites();
        showToast('All favorites cleared');
    }
}

function goToRoom(roomNumber) {
    document.getElementById('roomInput').value = roomNumber;
    searchRoom();
    showScreen('search-page');
}

function shareLocation() {
    const roomNumber = window.currentRoomNumber;
    if (roomNumber) {
        const text = `📍 Room ${roomNumber} at PMU University`;
        if (navigator.share) navigator.share({ title: 'PMU Location', text: text });
        else navigator.clipboard.writeText(text).then(() => showToast('Location copied!'));
    } else {
        showToast('No room selected', true);
    }
}

// ========== DIRECTIONS FUNCTION ==========
function showDirections() {
    const roomNumber = document.getElementById('room-number').innerText;
    const roomBuilding = document.getElementById('room-building').innerText;
    const roomFloor = document.getElementById('room-floor').innerText;
    localStorage.setItem('directions_room', JSON.stringify({ number: roomNumber, building: roomBuilding, floor: roomFloor }));
    switchPage('map-page');
}

// ========== PINCH ZOOM MAP (ONLY ZOOM IN, NO ZOOM OUT BELOW 1) ==========
function initMap() {
    const container = document.getElementById('mapTouchContainer');
    const img = document.getElementById('mapImage');
    
    if (!container || !img) {
        console.log('Map elements not found');
        return;
    }
    
    let scale = 1;
    let translateX = 0;
    let translateY = 0;
    let initialDistance = 0;
    let initialScale = 1;
    let startX = 0, startY = 0;
    let isDragging = false;
    
    function updateTransform() {
        img.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    }
    
    // تكبير باللمس (Pinch to Zoom) - فقط تكبير، لا تصغير عن 1
    container.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            initialDistance = Math.hypot(dx, dy);
            initialScale = scale;
        } else if (e.touches.length === 1) {
            isDragging = true;
            startX = e.touches[0].clientX - translateX;
            startY = e.touches[0].clientY - translateY;
        }
    });
    
    container.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            const distance = Math.hypot(dx, dy);
            let newScale = initialScale * (distance / initialDistance);
            // 🔥 منع التصغير عن الحجم الطبيعي (الحد الأدنى = 1)
            newScale = Math.min(3, Math.max(1, newScale));
            if (Math.abs(newScale - scale) > 0.01) {
                scale = newScale;
                updateTransform();
            }
        } else if (e.touches.length === 1 && isDragging) {
            e.preventDefault();
            translateX = e.touches[0].clientX - startX;
            translateY = e.touches[0].clientY - startY;
            updateTransform();
        }
    });
    
    container.addEventListener('touchend', () => {
        isDragging = false;
    });
    
    // أزرار التحكم
    document.getElementById('btnZoomIn')?.addEventListener('click', () => {
        scale = Math.min(3, scale + 0.2);
        updateTransform();
    });
    
    document.getElementById('btnZoomOut')?.addEventListener('click', () => {
        // 🔥 منع التصغير عن الحجم الطبيعي
        scale = Math.max(1, scale - 0.2);
        updateTransform();
    });
    
    document.getElementById('btnReset')?.addEventListener('click', () => {
        scale = 1;
        translateX = 0;
        translateY = 0;
        updateTransform();
    });
    
    console.log('✅ Pinch zoom map ready - zoom in only, min scale = 1');
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
                initMap();
            }, 500);
        }
    }, 1500);
    setRealHeight();
    loadSavedAvatar();
});

window.addEventListener('resize', setRealHeight);
window.addEventListener('orientationchange', setRealHeight);

// ========== DOM CONTENT LOADED ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - PMU Student Hub ready');
    
    const signinBtn = document.getElementById('signinBtn');
    if (signinBtn) signinBtn.addEventListener('click', (e) => { e.preventDefault(); handleStudentLogin(); });
    
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', () => logoutFromDashboard());
    
    const roomInput = document.getElementById('roomInput');
    if (roomInput) roomInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') searchRoom(); });
    
    renderFavorites();
    initMap();
});

// ========== SWITCH PAGE WITH MAP REINIT ==========
const originalSwitch = switchPage;
window.switchPage = function(pageId, element) {
    originalSwitch(pageId, element);
    if (pageId === 'map-page') {
        setTimeout(initMap, 100);
    }
};

// ========== EXPORT FUNCTIONS ==========
window.switchPage = switchPage;
window.showToast = showToast;
window.searchRoom = searchRoom;
window.clearRecentSearches = clearRecentSearches;
window.openNotificationsModal = openNotificationsModal;
window.closeNotificationsModal = closeNotificationsModal;
window.markAllNotificationsRead = markAllNotificationsRead;
window.handleStudentLogin = handleStudentLogin;
window.logoutFromDashboard = logoutFromDashboard;
window.changeProfileAvatar = changeProfileAvatar;
window.searchBuilding = searchBuilding;
window.toggleFavorite = toggleFavorite;
window.removeFavorite = removeFavorite;
window.clearAllFavorites = clearAllFavorites;
window.goToRoom = goToRoom;
window.shareLocation = shareLocation;
window.showDirections = showDirections;

// تحديث searchRoom لتخزين رقم الغرفة الحالي
const originalSearchRoom = searchRoom;
window.searchRoom = function() {
    const input = document.getElementById('roomInput').value.trim();
    window.currentRoomNumber = input;
    return originalSearchRoom.apply(this, arguments);
};