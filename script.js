// ========================================
// PMU STUDENT HUB - MAIN SCRIPT (FINAL)
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

// ========== RECENT SEARCHES SYSTEM ==========
function saveRecentSearch(roomNumber) {
    if (!roomNumber) return;
    
    let recentSearches = JSON.parse(localStorage.getItem('pmu_recent_searches')) || [];
    recentSearches = recentSearches.filter(item => item !== roomNumber);
    recentSearches.unshift(roomNumber);
    recentSearches = recentSearches.slice(0, 10);
    localStorage.setItem('pmu_recent_searches', JSON.stringify(recentSearches));
    renderRecentSearches();
}

function renderRecentSearches() {
    const container = document.getElementById('recent-list');
    if (!container) return;
    
    const recentSearches = JSON.parse(localStorage.getItem('pmu_recent_searches')) || [];
    
    if (recentSearches.length === 0) {
        container.innerHTML = `<div class="empty-recent-item">🔍 No recent searches</div>`;
        return;
    }
    
    container.innerHTML = recentSearches.map(room => `
        <div class="recent-item" onclick="selectRecentRoom('${room}')">
            <i class="fa-solid fa-clock-rotate-left"></i>
            <span>Room ${room}</span>
            <button class="remove-recent" onclick="event.stopPropagation(); removeSingleRecent('${room}')">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
    `).join('');
}

function selectRecentRoom(roomNumber) {
    const input = document.getElementById('roomInput');
    if (input) {
        input.value = roomNumber;
    }
    window.currentRoomNumber = roomNumber;
    searchRoom();
}

function removeSingleRecent(roomNumber) {
    let recentSearches = JSON.parse(localStorage.getItem('pmu_recent_searches')) || [];
    recentSearches = recentSearches.filter(item => item !== roomNumber);
    localStorage.setItem('pmu_recent_searches', JSON.stringify(recentSearches));
    renderRecentSearches();
    showToast(`🗑️ Removed Room ${roomNumber} from recent searches`);
}

function setupSearchInputEvents() {
    const input = document.getElementById('roomInput');
    const recentList = document.getElementById('recent-list');
    
    if (!input || !recentList) return;
    
    input.addEventListener('focus', () => {
        const recentSearches = JSON.parse(localStorage.getItem('pmu_recent_searches')) || [];
        if (recentSearches.length > 0) {
            renderRecentSearches();
            recentList.style.display = 'block';
        }
    });
    
    input.addEventListener('blur', () => {
        setTimeout(() => {
            recentList.style.display = 'none';
        }, 200);
    });
    
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            recentList.style.display = 'none';
            searchRoom();
        }
    });
}

// ========== ROOMS DATA ==========
const roomsData = {
    "G101": { building: "College of engineering | كلية الهندسة", floor: "Ground Floor", location: "Female Campus", image: "room1.png" },
    "F101": { building: "College of Architecture and Design | كلية العمارة و التصميم", floor: "First Floor", location: "Female Campus", image: "room2.png" },
    "S101": { building: "College of Law | كلية القانون", floor: "Second Floor", location: "Female Campus", image: "room3.png" }
};

const defaultRooms = {
   "G101": { building: "College of engineering | كلية الهندسة", floor: "Ground Floor", location: "Female Campus", image: "room1.png" },
    "F101": { building: "College of Architecture and Design | كلية العمارة و التصميم", floor: "First Floor", location: "Female Campus", image: "room2.png" },
    "S101": { building: "College of Law | كلية القانون", floor: "Second Floor", location: "Female Campus", image: "room3.png" }
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
    
    let adminRooms = JSON.parse(localStorage.getItem('pmu_admin_rooms')) || {};
    const allRooms = { ...roomsData, ...adminRooms };
    const roomData = allRooms[input];
    
    if (roomData) {
        saveRecentSearch(input);
        
        let roomImage = roomData.image;
        if (roomImage && roomImage.startsWith('data:')) {
            document.getElementById('room-image').src = roomImage;
        } else {
            document.getElementById('room-image').src = roomData.image || 'room1.png';
        }
        
        document.getElementById('room-number').innerHTML = `Room ${input}`;
        document.getElementById('room-building').innerHTML = roomData.building;
        document.getElementById('room-floor').innerHTML = roomData.floor;
        document.getElementById('room-location').innerHTML = roomData.location;
        resultDiv.classList.remove('hidden');
        showToast(`📍 Room ${input} found!`);
    } else {
        resultDiv.classList.add('hidden');
        showToast('Room not found! Try G101, F101, S101, or any room added by admin', true);
    }
}

// ========== CLEAR SEARCH RESULTS ==========
function clearRecentSearches() {
    const resultDiv = document.getElementById('room-result');
    if (resultDiv) {
        resultDiv.classList.add('hidden');
    }
    
    const roomInput = document.getElementById('roomInput');
    if (roomInput) {
        roomInput.value = '';
    }
    
    window.currentRoomNumber = null;
    showToast('🧹 Search results cleared');
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
    
    let adminRooms = JSON.parse(localStorage.getItem('pmu_admin_rooms')) || {};
    const allRooms = { ...roomsData, ...adminRooms };
    
    if (!allRooms[roomNumber]) {
        showToast("Room not found!", true);
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
    const container = document.getElementById('favorites-container');
    if (!container) return;
    
    if (favorites.length === 0) {
        container.innerHTML = `<div class="empty-favorites"><i class="fa-regular fa-heart"></i><p>No favorite rooms yet</p><span>Save rooms from search results</span></div>`;
        return;
    }
    
    let adminRooms = JSON.parse(localStorage.getItem('pmu_admin_rooms')) || {};
    const allRooms = { ...defaultRooms, ...adminRooms };
    
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
    const roomInput = document.getElementById('roomInput');
    if (roomInput) {
        roomInput.value = roomNumber;
    }
    window.currentRoomNumber = roomNumber;
    switchPage('search-page');
    searchRoom();
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

// ========== PINCH ZOOM MAP WITH BOUNDARIES ==========
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
    
    function applyBoundaries() {
        if (!img || !container) return;
        
        const imgWidth = img.offsetWidth * scale;
        const imgHeight = img.offsetHeight * scale;
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        
        let minX = (containerWidth - imgWidth) / 2;
        let maxX = (containerWidth - imgWidth) / 2;
        let minY = (containerHeight - imgHeight) / 2;
        let maxY = (containerHeight - imgHeight) / 2;
        
        if (imgWidth > containerWidth) {
            minX = -(imgWidth - containerWidth);
            maxX = 0;
        }
        
        if (imgHeight > containerHeight) {
            minY = -(imgHeight - containerHeight);
            maxY = 0;
        }
        
        const extraMove = 20;
        minX -= extraMove;
        maxX += extraMove;
        minY -= extraMove;
        maxY += extraMove;
        
        translateX = Math.min(maxX, Math.max(minX, translateX));
        translateY = Math.min(maxY, Math.max(minY, translateY));
    }
    
    function updateTransform() {
        if (!img) return;
        applyBoundaries();
        img.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    }
    
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
    
    document.getElementById('btnZoomIn')?.addEventListener('click', () => {
        scale = Math.min(3, scale + 0.2);
        updateTransform();
    });
    
    document.getElementById('btnZoomOut')?.addEventListener('click', () => {
        scale = Math.max(1, scale - 0.2);
        updateTransform();
    });
    
    document.getElementById('btnReset')?.addEventListener('click', () => {
        scale = 1;
        translateX = 0;
        translateY = 0;
        updateTransform();
    });
    
    window.addEventListener('resize', () => {
        updateTransform();
    });
    
    console.log('✅ Pinch zoom map ready with boundaries');
}

// ========== LOAD HOME PAGE DATA ==========
function loadHomePageData() {
    console.log('🔄 Loading home page data...');
    
    const savedSchedule = localStorage.getItem('pmu_home_schedule');
    if (savedSchedule) {
        const schedule = JSON.parse(savedSchedule);
        const scheduleContainer = document.querySelector('.schedule-cards');
        if (scheduleContainer && schedule.length > 0) {
            scheduleContainer.innerHTML = schedule.map(item => `
                <div class="schedule-card ${item.status === 'ongoing' ? 'ongoing' : ''}">
                    <div class="card-time">
                        <span>${item.time.split(' - ')[0]}</span>
                        <span>${item.time.split(' - ')[1] || ''}</span>
                    </div>
                    <div class="card-info">
                        <h4>${item.name}</h4>
                        <p>${item.teacher}</p>
                        <div class="location"><i class="fa-solid fa-location-dot"></i> ${item.room}</div>
                    </div>
                    <div class="card-status ${item.status}">${item.status === 'ongoing' ? 'Ongoing' : 'Upcoming'}</div>
                </div>
            `).join('');
        }
    }
    
    const savedAnnouncements = localStorage.getItem('pmu_home_announcements');
    if (savedAnnouncements) {
        const announcements = JSON.parse(savedAnnouncements);
        const announcementsContainer = document.querySelector('.announcement-cards');
        if (announcementsContainer && announcements.length > 0) {
            announcementsContainer.innerHTML = announcements.map(item => `
                <div class="announcement-card">
                    <div class="announce-icon"><i class="fa-regular fa-newspaper"></i></div>
                    <div class="announce-content">
                        <h4>${item.title}</h4>
                        <p>${item.message}</p>
                        <span>${item.time}</span>
                    </div>
                </div>
            `).join('');
        }
    }
    
    const events = localStorage.getItem('home_stats_events');
    const rooms = localStorage.getItem('home_stats_rooms');
    const reminders = localStorage.getItem('home_stats_reminders');
    
    const eventsElement = document.querySelector('.stat-item:first-child .stat-num');
    const roomsElement = document.querySelector('.stat-item:nth-child(2) .stat-num');
    const remindersElement = document.querySelector('.stat-item:last-child .stat-num');
    
    if (events && eventsElement) eventsElement.innerText = events;
    if (rooms && roomsElement) roomsElement.innerText = rooms;
    if (reminders && remindersElement) remindersElement.innerText = reminders;
    
    const welcomeName = localStorage.getItem('home_welcome_name');
    if (welcomeName) {
        const welcomeElement = document.querySelector('#home-page .welcome-text h1');
        if (welcomeElement) welcomeElement.innerText = welcomeName;
    }
    
    const studentId = localStorage.getItem('home_student_id');
    if (studentId) {
        const idElement = document.querySelector('#home-page .student-id-box strong');
        if (idElement) idElement.innerText = studentId;
    }
    
    const studentLevel = localStorage.getItem('home_student_level');
    if (studentLevel) {
        const levelElement = document.querySelector('#home-page .level-badge strong');
        if (levelElement) levelElement.innerText = studentLevel;
    }
    
    const profileName = localStorage.getItem('profile_display_name');
    if (profileName) {
        const dashboardName = document.querySelector('#student-dashboard h2');
        if (dashboardName) dashboardName.innerText = profileName;
    }
    
    console.log('✅ Home page data loaded successfully');
}

// ========== ADMIN ACCESS ==========
function openAdminLogin() {
    window.location.href = 'admin-login.html';
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
    
    // Admin trigger
    const adminTrigger = document.querySelector('.student-id-box');
    if (adminTrigger) {
        adminTrigger.style.cursor = 'pointer';
        adminTrigger.addEventListener('click', function(e) {
            e.stopPropagation();
            openAdminLogin();
        });
        console.log('✅ Admin trigger ready');
    }
    
    renderFavorites();
    initMap();
    
    // ========== تهيئة نظام البحث الأخير ==========
    renderRecentSearches();
    setupSearchInputEvents();
    
    // ========== تحميل بيانات الصفحة الرئيسية ==========
    loadHomePageData();
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
window.saveRecentSearch = saveRecentSearch;
window.renderRecentSearches = renderRecentSearches;
window.selectRecentRoom = selectRecentRoom;
window.removeSingleRecent = removeSingleRecent;
window.setupSearchInputEvents = setupSearchInputEvents;

// تحديث searchRoom لتخزين رقم الغرفة الحالي
const originalSearchRoom = searchRoom;
window.searchRoom = function() {
    const input = document.getElementById('roomInput').value.trim();
    window.currentRoomNumber = input;
    return originalSearchRoom.apply(this, arguments);
};