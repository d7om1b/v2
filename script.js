// ========================================
// PMU STUDENT HUB - MAIN SCRIPT (FIXED)
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

function showScreen(screenId, element) {
    console.log('Showing screen:', screenId);
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    const target = document.getElementById(screenId);
    if (target) target.classList.add('active');
    if (element) {
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        element.classList.add('active');
    }
}

// ========== ROOMS DATA ==========
const roomsData = {
    "101": { 
        building: "Building A", 
        floor: "First Floor", 
        location: "Near North Elevator", 
        image: "room1.png" 
    },
    "102": { 
        building: "Building A", 
        floor: "First Floor", 
        location: "Near South Elevator", 
        image: "room2.png"
    },
    "201": { 
        building: "Building B", 
        floor: "Second Floor", 
        location: "Next to Faculty Office", 
        image: "room1.png"
    }
};

// Default rooms for favorites
const defaultRooms = {
    "101": {
        building: "Building A",
        floor: "First Floor",
        location: "Near North Elevator",
        image: "room1.png"
    },
    "102": {
        building: "Building A",
        floor: "First Floor",
        location: "Near South Elevator",
        image: "room1.png"
    },
    "201": {
        building: "Building B",
        floor: "Second Floor",
        location: "Next to Faculty Office",
        image: "room1.png"
    }
};

let customRooms = JSON.parse(localStorage.getItem('pmu_custom_rooms')) || {};

// ========== SEARCH FUNCTIONS ==========
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

// ========== NOTIFICATIONS ==========
function openNotificationsModal() {
    const modal = document.getElementById('notifications-modal');
    if (modal) modal.classList.remove('hidden');
}
function closeNotificationsModal() {
    const modal = document.getElementById('notifications-modal');
    if (modal) modal.classList.add('hidden');
}
function markAllNotificationsRead() { 
    closeNotificationsModal(); 
    showToast('All marked as read'); 
}

// ========== LOGIN & DASHBOARD ==========
function handleStudentLogin() {
    const emailInput = document.querySelector('#profile-page .pmu-outlined-field input[type="email"]');
    const passInput = document.querySelector('#profile-page .pmu-outlined-field input[type="password"]');
    if (!emailInput || !passInput) { 
        showToast('Login form not found', true); 
        return; 
    }
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
                if (avatarImg) {
                    avatarImg.src = event.target.result;
                    localStorage.setItem('user_avatar', event.target.result);
                    showToast('Profile picture updated!');
                }
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

// ========== SEARCH BUILDING ==========
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

// ========== INTERACTIVE MAP ==========
let mapScale = 1;
let mapTranslateX = 0, mapTranslateY = 0;
let mapIsDragging = false;
let mapStartX, mapStartY;
let mapContainer, mapImage;

function initInteractiveMap() {
    mapContainer = document.getElementById('map-container');
    mapImage = document.getElementById('campus-map-image');
    
    if (!mapContainer || !mapImage) {
        console.log('Map container or image not found');
        return;
    }
    
    console.log('Map initialized');
    
    mapContainer.addEventListener('mousedown', onMapDragStart);
    window.addEventListener('mousemove', onMapDragMove);
    window.addEventListener('mouseup', onMapDragEnd);
    mapContainer.addEventListener('touchstart', onMapTouchStart);
    window.addEventListener('touchmove', onMapTouchMove);
    window.addEventListener('touchend', onMapDragEnd);
    
    document.getElementById('zoomInBtn')?.addEventListener('click', () => {
        mapScale = Math.min(3, mapScale + 0.2);
        updateMapTransform();
    });
    
    document.getElementById('zoomOutBtn')?.addEventListener('click', () => {
        mapScale = Math.max(0.5, mapScale - 0.2);
        updateMapTransform();
    });
    
    document.getElementById('resetBtn')?.addEventListener('click', () => {
        mapScale = 1;
        mapTranslateX = 0;
        mapTranslateY = 0;
        updateMapTransform();
    });
    
    updateMapTransform();
}

function onMapDragStart(e) {
    e.preventDefault();
    mapIsDragging = true;
    mapStartX = e.clientX - mapTranslateX;
    mapStartY = e.clientY - mapTranslateY;
    if (mapContainer) mapContainer.style.cursor = 'grabbing';
}

function onMapDragMove(e) {
    if (!mapIsDragging) return;
    e.preventDefault();
    mapTranslateX = e.clientX - mapStartX;
    mapTranslateY = e.clientY - mapStartY;
    updateMapTransform();
}

function onMapTouchStart(e) {
    if (e.touches.length === 1) {
        e.preventDefault();
        const touch = e.touches[0];
        mapIsDragging = true;
        mapStartX = touch.clientX - mapTranslateX;
        mapStartY = touch.clientY - mapTranslateY;
    }
}

function onMapTouchMove(e) {
    if (!mapIsDragging || e.touches.length !== 1) return;
    e.preventDefault();
    const touch = e.touches[0];
    mapTranslateX = touch.clientX - mapStartX;
    mapTranslateY = touch.clientY - mapStartY;
    updateMapTransform();
}

function onMapDragEnd() {
    mapIsDragging = false;
    if (mapContainer) mapContainer.style.cursor = 'grab';
}

function updateMapTransform() {
    if (mapImage) {
        mapImage.style.transform = `translate(${mapTranslateX}px, ${mapTranslateY}px) scale(${mapScale})`;
    }
}

// ========== FAVORITES FUNCTIONS ==========
let favorites = JSON.parse(localStorage.getItem('pmu_favorites')) || [];

function toggleFavorite() {
    const roomNumber = window.currentRoomNumber;
    if (!roomNumber) {
        showToast("No room selected!", true);
        return;
    }
    
    if (favorites.includes(roomNumber)) {
        favorites = favorites.filter(r => r !== roomNumber);
        showToast(`Room ${roomNumber} removed from favorites`);
        const favBtn = document.querySelector('.action-btn.favorite i');
        if (favBtn) {
            favBtn.classList.remove('fa-solid');
            favBtn.classList.add('fa-regular');
        }
    } else {
        favorites.push(roomNumber);
        showToast(`Room ${roomNumber} added to Favorites! ❤️`);
        const favBtn = document.querySelector('.action-btn.favorite i');
        if (favBtn) {
            favBtn.classList.remove('fa-regular');
            favBtn.classList.add('fa-solid');
        }
    }
    
    localStorage.setItem('pmu_favorites', JSON.stringify(favorites));
    renderFavorites();
}

function renderFavorites() {
    const container = document.getElementById('favorites-container');
    if (!container) return;
    
    if (favorites.length === 0) {
        container.innerHTML = `
            <div class="empty-favorites">
                <i class="fa-regular fa-heart"></i>
                <p>No favorite rooms yet</p>
                <span>Save rooms from search results</span>
            </div>
        `;
        return;
    }
    
    const allRooms = { ...defaultRooms, ...customRooms };
    
    container.innerHTML = favorites.map(room => {
        const roomData = allRooms[room];
        return `
            <div class="favorite-card" onclick="goToRoom('${room}')">
                <div class="favorite-info">
                    <div class="favorite-icon">
                        <i class="fa-solid fa-door-open"></i>
                    </div>
                    <div class="favorite-details">
                        <h4>Room ${room}</h4>
                        <p>${roomData?.building || 'Building'} • ${roomData?.floor || 'Floor 1'}</p>
                    </div>
                </div>
                <button class="remove-fav-btn" onclick="event.stopPropagation(); removeFavorite('${room}')">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `;
    }).join('');
}

function removeFavorite(roomNumber) {
    favorites = favorites.filter(r => r !== roomNumber);
    localStorage.setItem('pmu_favorites', JSON.stringify(favorites));
    renderFavorites();
    showToast(`Room ${roomNumber} removed from favorites`);
}

function clearAllFavorites() {
    if (favorites.length === 0) {
        showToast("No favorites to clear", true);
        return;
    }
    if (confirm('Are you sure you want to remove all favorite rooms?')) {
        favorites = [];
        localStorage.setItem('pmu_favorites', JSON.stringify(favorites));
        renderFavorites();
        showToast('All favorites cleared');
    }
}

function goToRoom(roomNumber) {
    const input = document.getElementById('roomInput');
    if (input) input.value = roomNumber;
    searchRoom();
    showScreen('search-page');
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
                initInteractiveMap();
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
    if (signinBtn) {
        signinBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleStudentLogin();
        });
    }
    
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            logoutFromDashboard();
        });
    }
    
    const roomInput = document.getElementById('roomInput');
    if (roomInput) {
        roomInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') searchRoom();
        });
    }
    
    renderFavorites();
    
    if (document.getElementById('map-container')) {
        initInteractiveMap();
    }
});

// ========== EXPORT FUNCTIONS ==========
window.switchPage = switchPage;
window.showScreen = showScreen;
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

// تحديث searchRoom لتخزين رقم الغرفة الحالي
const originalSearchRoom = searchRoom;
window.searchRoom = function() {
    const input = document.getElementById('roomInput').value.trim();
    window.currentRoomNumber = input;
    
    setTimeout(() => {
        const favBtn = document.querySelector('.action-btn.favorite i');
        if (favBtn) {
            if (favorites.includes(input)) {
                favBtn.classList.remove('fa-regular');
                favBtn.classList.add('fa-solid');
            } else {
                favBtn.classList.remove('fa-solid');
                favBtn.classList.add('fa-regular');
            }
        }
    }, 100);
    
    return originalSearchRoom.apply(this, arguments);
};