// ========================================
// PMU STUDENT HUB - MAIN SCRIPT
// ========================================

// Navigation
function switchPage(pageId, element) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    const target = document.getElementById(pageId);
    if (target) target.classList.add('active');
    
    if (element) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        element.classList.add('active');
    }
    
    if (pageId === 'search-page') loadRecentSearches();
}

// Toast
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

// Room Data
const roomsData = {
    "101": { building: "Building A", floor: "First Floor", location: "Near North Elevator" },
    "102": { building: "Building A", floor: "First Floor", location: "Near South Elevator" },
    "201": { building: "Building B", floor: "Second Floor", location: "Next to Faculty Office" },
    "202": { building: "Building B", floor: "Second Floor", location: "Opposite to Library" },
    "301": { building: "Building C", floor: "Third Floor", location: "Computer Lab" }
};

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
        document.getElementById('room-number').innerHTML = `Room ${input}`;
        document.getElementById('room-building').innerHTML = roomData.building;
        document.getElementById('room-floor').innerHTML = roomData.floor;
        document.getElementById('room-location').innerHTML = roomData.location;
        resultDiv.classList.remove('hidden');
        
        let recents = JSON.parse(localStorage.getItem('pmu_recent_searches') || '[]');
        recents = [input, ...recents.filter(r => r !== input)].slice(0, 5);
        localStorage.setItem('pmu_recent_searches', JSON.stringify(recents));
        loadRecentSearches();
        showToast(`Room ${input} found!`);
    } else {
        resultDiv.classList.add('hidden');
        showToast('Room not found!', true);
    }
}

// Load Recent Searches
function loadRecentSearches() {
    const container = document.getElementById('recent-list');
    if (!container) return;
    const recents = JSON.parse(localStorage.getItem('pmu_recent_searches') || '[]');
    if (recents.length === 0) {
        container.innerHTML = '<p style="color: #6c757d; font-size: 12px;">No recent searches</p>';
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

// Splash Screen
window.addEventListener('load', function() {
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        const container = document.querySelector('.app-container');
        if (splash) {
            splash.style.opacity = '0';
            setTimeout(() => {
                splash.classList.add('hidden');
                if (container) container.classList.remove('hidden');
            }, 500);
        }
    }, 2000);
    loadRecentSearches();
});

// vh for mobile
function setRealHeight() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}
setRealHeight();
window.addEventListener('resize', setRealHeight);
window.addEventListener('orientationchange', setRealHeight);