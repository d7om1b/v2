// ========================================
// PMU STUDENT HUB - ADMIN PANEL SCRIPT
// ========================================

// ========== ADMIN CREDENTIALS ==========
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin';

// ========== CHECK LOGIN STATUS ==========
function checkAdminAuth() {
    const isLoggedIn = localStorage.getItem('admin_logged_in');
    const currentPage = window.location.pathname;
    
    if (currentPage.includes('admin-panel.html')) {
        if (isLoggedIn !== 'true') {
            window.location.href = 'admin-login.html';
        }
    }
}

// ========== LOGIN FUNCTION ==========
function handleAdminLogin(e) {
    e.preventDefault();
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        localStorage.setItem('admin_logged_in', 'true');
        localStorage.setItem('admin_name', username);
        showAdminToast('✅ Login successful! Redirecting...');
        setTimeout(() => {
            window.location.href = 'admin-panel.html';
        }, 1000);
    } else {
        showAdminToast('❌ Invalid username or password!', true);
    }
}

// ========== LOGOUT FUNCTION ==========
function adminLogout() {
    localStorage.removeItem('admin_logged_in');
    localStorage.removeItem('admin_name');
    showAdminToast('Logged out successfully');
    setTimeout(() => {
        window.location.href = 'admin-login.html';
    }, 1000);
}

// ========== ADMIN TOAST ==========
function showAdminToast(message, isError = false) {
    let toast = document.querySelector('.admin-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'admin-toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.background = isError ? '#e74c3c' : '#2ecc71';
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

// ========== SCHEDULE MANAGEMENT ==========
// بيانات الجدول الافتراضية
const defaultSchedule = [
    { time: "09:00 - 10:30", name: "Computer Science 101", teacher: "Dr. Ahmed Al-Rashid", room: "Room 101, Building A", status: "ongoing" },
    { time: "11:00 - 12:30", name: "Mathematics 201", teacher: "Dr. Sarah Al-Otaibi", room: "Room 201, Building B", status: "upcoming" },
    { time: "14:00 - 15:30", name: "Physics Lab", teacher: "Dr. Khalid Al-Zahrani", room: "Lab 3, Building C", status: "upcoming" }
];

function loadSchedule() {
    const saved = localStorage.getItem('pmu_admin_schedule');
    if (saved) {
        return JSON.parse(saved);
    }
    return [...defaultSchedule];
}

function saveSchedule(schedule) {
    localStorage.setItem('pmu_admin_schedule', JSON.stringify(schedule));
    renderScheduleList();
    applyScheduleToHomePage();
}

function renderScheduleList() {
    const container = document.getElementById('scheduleList');
    if (!container) return;
    
    const schedule = loadSchedule();
    
    if (schedule.length === 0) {
        container.innerHTML = '<div class="empty-state">No classes scheduled. Add your first class!</div>';
        return;
    }
    
    container.innerHTML = schedule.map((item, index) => `
        <div class="schedule-item" data-index="${index}">
            <div class="schedule-info">
                <div class="schedule-time">🕐 ${item.time}</div>
                <h4>${item.name}</h4>
                <p>👨‍🏫 ${item.teacher}</p>
                <p>📍 ${item.room}</p>
                <span class="schedule-status ${item.status}">${item.status === 'ongoing' ? 'Ongoing' : 'Upcoming'}</span>
            </div>
            <div class="schedule-actions">
                <button class="edit-schedule" onclick="editScheduleItem(${index})">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button class="delete-schedule" onclick="deleteScheduleItem(${index})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function applyScheduleToHomePage() {
    const schedule = loadSchedule();
    localStorage.setItem('pmu_home_schedule', JSON.stringify(schedule));
}

// ========== ADD SCHEDULE FROM FORM ==========
function addScheduleFromForm() {
    const time = document.getElementById('newScheduleTime')?.value.trim();
    const name = document.getElementById('newScheduleName')?.value.trim();
    const teacher = document.getElementById('newScheduleTeacher')?.value.trim();
    const room = document.getElementById('newScheduleRoom')?.value.trim();
    const status = document.getElementById('newScheduleStatus')?.value;
    
    if (!time || !name) {
        showAdminToast('⚠️ Please fill Time and Course Name', true);
        return;
    }
    
    const newItem = {
        time: time,
        name: name,
        teacher: teacher || 'Staff',
        room: room || 'TBA',
        status: status || 'upcoming'
    };
    
    const schedule = loadSchedule();
    schedule.push(newItem);
    saveSchedule(schedule);
    
    // Clear form
    const timeInput = document.getElementById('newScheduleTime');
    const nameInput = document.getElementById('newScheduleName');
    const teacherInput = document.getElementById('newScheduleTeacher');
    const roomInput = document.getElementById('newScheduleRoom');
    const statusSelect = document.getElementById('newScheduleStatus');
    
    if (timeInput) timeInput.value = '';
    if (nameInput) nameInput.value = '';
    if (teacherInput) teacherInput.value = '';
    if (roomInput) roomInput.value = '';
    if (statusSelect) statusSelect.value = 'upcoming';
    
    showAdminToast('✅ Class added successfully!');
}

function editScheduleItem(index) {
    const schedule = loadSchedule();
    const item = schedule[index];
    
    // Fill the add form for editing
    const timeInput = document.getElementById('newScheduleTime');
    const nameInput = document.getElementById('newScheduleName');
    const teacherInput = document.getElementById('newScheduleTeacher');
    const roomInput = document.getElementById('newScheduleRoom');
    const statusSelect = document.getElementById('newScheduleStatus');
    
    if (timeInput) timeInput.value = item.time;
    if (nameInput) nameInput.value = item.name;
    if (teacherInput) teacherInput.value = item.teacher || '';
    if (roomInput) roomInput.value = item.room || '';
    if (statusSelect) statusSelect.value = item.status || 'upcoming';
    
    // Change button to "Update"
    const addBtn = document.getElementById('addScheduleFormBtn');
    if (addBtn) {
        const originalText = addBtn.innerHTML;
        addBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Class';
        
        addBtn.onclick = () => {
            updateScheduleItem(index);
            addBtn.innerHTML = originalText;
            addBtn.onclick = addScheduleFromForm;
            // Clear form
            if (timeInput) timeInput.value = '';
            if (nameInput) nameInput.value = '';
            if (teacherInput) teacherInput.value = '';
            if (roomInput) roomInput.value = '';
            if (statusSelect) statusSelect.value = 'upcoming';
        };
    }
    
    // Scroll to form
    if (timeInput) timeInput.scrollIntoView({ behavior: 'smooth' });
}

function updateScheduleItem(index) {
    const time = document.getElementById('newScheduleTime')?.value.trim();
    const name = document.getElementById('newScheduleName')?.value.trim();
    const teacher = document.getElementById('newScheduleTeacher')?.value.trim();
    const room = document.getElementById('newScheduleRoom')?.value.trim();
    const status = document.getElementById('newScheduleStatus')?.value;
    
    if (!time || !name) {
        showAdminToast('⚠️ Please fill Time and Course Name', true);
        return;
    }
    
    const schedule = loadSchedule();
    schedule[index] = {
        time: time,
        name: name,
        teacher: teacher || 'Staff',
        room: room || 'TBA',
        status: status || 'upcoming'
    };
    saveSchedule(schedule);
    showAdminToast('✏️ Class updated successfully!');
}

function deleteScheduleItem(index) {
    if (confirm('Delete this class from schedule?')) {
        const schedule = loadSchedule();
        schedule.splice(index, 1);
        saveSchedule(schedule);
        showAdminToast('🗑️ Class deleted');
    }
}

// ========== ANNOUNCEMENTS MANAGEMENT ==========
const defaultAnnouncements = [
    { title: "Registration for Spring 2025", message: "Registration opens next week.", time: "2 hours ago" },
    { title: "Final Exam Schedule Released", message: "Final exams will begin on December 15th.", time: "1 day ago" }
];

function loadAnnouncements() {
    const saved = localStorage.getItem('pmu_admin_announcements');
    if (saved) {
        return JSON.parse(saved);
    }
    return [...defaultAnnouncements];
}

function saveAnnouncements(announcements) {
    localStorage.setItem('pmu_admin_announcements', JSON.stringify(announcements));
    renderAnnouncementsList();
    applyAnnouncementsToHomePage();
}

function renderAnnouncementsList() {
    const container = document.getElementById('announcementsList');
    if (!container) return;
    
    const announcements = loadAnnouncements();
    
    if (announcements.length === 0) {
        container.innerHTML = '<div class="empty-state">No announcements. Add your first announcement!</div>';
        return;
    }
    
    container.innerHTML = announcements.map((item, index) => `
        <div class="announcement-item" data-index="${index}">
            <div class="announcement-info">
                <h4>📢 ${item.title}</h4>
                <p>${item.message}</p>
                <span class="announcement-time">🕐 ${item.time}</span>
            </div>
            <div class="announcement-actions">
                <button class="edit-announcement" onclick="editAnnouncement(${index})">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button class="delete-announcement" onclick="deleteAnnouncement(${index})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function applyAnnouncementsToHomePage() {
    const announcements = loadAnnouncements();
    localStorage.setItem('pmu_home_announcements', JSON.stringify(announcements));
}

// ========== ADD ANNOUNCEMENT FROM FORM ==========
function addAnnouncementFromForm() {
    const title = document.getElementById('newAnnounceTitle')?.value.trim();
    const message = document.getElementById('newAnnounceMessage')?.value.trim();
    let time = document.getElementById('newAnnounceTime')?.value.trim();
    
    if (!title || !message) {
        showAdminToast('⚠️ Please fill Title and Message', true);
        return;
    }
    
    if (!time) {
        time = 'Just now';
    }
    
    const newItem = {
        title: title,
        message: message,
        time: time
    };
    
    const announcements = loadAnnouncements();
    announcements.unshift(newItem);
    saveAnnouncements(announcements);
    
    // Clear form
    const titleInput = document.getElementById('newAnnounceTitle');
    const messageInput = document.getElementById('newAnnounceMessage');
    const timeInput = document.getElementById('newAnnounceTime');
    
    if (titleInput) titleInput.value = '';
    if (messageInput) messageInput.value = '';
    if (timeInput) timeInput.value = '';
    
    showAdminToast('✅ Announcement added successfully!');
}

function editAnnouncement(index) {
    const announcements = loadAnnouncements();
    const item = announcements[index];
    
    // Fill the add form for editing
    const titleInput = document.getElementById('newAnnounceTitle');
    const messageInput = document.getElementById('newAnnounceMessage');
    const timeInput = document.getElementById('newAnnounceTime');
    
    if (titleInput) titleInput.value = item.title;
    if (messageInput) messageInput.value = item.message;
    if (timeInput) timeInput.value = item.time || '';
    
    // Change button to "Update"
    const addBtn = document.getElementById('addAnnouncementFormBtn');
    if (addBtn) {
        const originalText = addBtn.innerHTML;
        addBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Announcement';
        
        addBtn.onclick = () => {
            updateAnnouncement(index);
            addBtn.innerHTML = originalText;
            addBtn.onclick = addAnnouncementFromForm;
            // Clear form
            if (titleInput) titleInput.value = '';
            if (messageInput) messageInput.value = '';
            if (timeInput) timeInput.value = '';
        };
    }
    
    // Scroll to form
    if (titleInput) titleInput.scrollIntoView({ behavior: 'smooth' });
}

function updateAnnouncement(index) {
    const title = document.getElementById('newAnnounceTitle')?.value.trim();
    const message = document.getElementById('newAnnounceMessage')?.value.trim();
    let time = document.getElementById('newAnnounceTime')?.value.trim();
    
    if (!title || !message) {
        showAdminToast('⚠️ Please fill Title and Message', true);
        return;
    }
    
    if (!time) time = 'Just now';
    
    const announcements = loadAnnouncements();
    announcements[index] = {
        title: title,
        message: message,
        time: time
    };
    saveAnnouncements(announcements);
    showAdminToast('✏️ Announcement updated successfully!');
}

function deleteAnnouncement(index) {
    if (confirm('Delete this announcement?')) {
        const announcements = loadAnnouncements();
        announcements.splice(index, 1);
        saveAnnouncements(announcements);
        showAdminToast('🗑️ Announcement deleted');
    }
}

// ========== ROOMS MANAGEMENT ==========
function loadRooms() {
    const defaultRooms = {
        "G101": { building: "College of engineering | كلية الهندسة", floor: "Ground Floor", location: "Female Campus", image: "room1.png" },
        "F101": { building: "College of Architecture and Design | كلية العمارة و التصميم", floor: "First Floor", location: "Female Campus", image: "room2.png" },
        "S101": { building: "College of Law | كلية القانون", floor: "Second Floor", location: "Female Campus", image: "room3.png" }
    };
    
    const saved = localStorage.getItem('pmu_admin_rooms');
    if (saved) {
        return JSON.parse(saved);
    }
    return defaultRooms;
}

function saveRooms(rooms) {
    localStorage.setItem('pmu_admin_rooms', JSON.stringify(rooms));
    renderRoomsList();
}

function renderRoomsList() {
    const container = document.getElementById('roomsList');
    if (!container) return;
    
    const rooms = loadRooms();
    const roomEntries = Object.entries(rooms);
    
    if (roomEntries.length === 0) {
        container.innerHTML = '<div class="empty-state">No rooms found. Add your first room!</div>';
        return;
    }
    
    container.innerHTML = roomEntries.map(([roomNumber, data]) => `
        <div class="room-item" data-room="${roomNumber}">
            <div class="room-info">
                <h4>Room ${roomNumber}</h4>
                <p>${data.building} • ${data.floor}</p>
            </div>
            <div class="room-actions">
                <button class="edit-room" onclick="editRoom('${roomNumber}')">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button class="delete-room" onclick="deleteRoom('${roomNumber}')">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function addRoom() {
    const roomNumber = document.getElementById('newRoomNumber')?.value.trim().toUpperCase();
    const building = document.getElementById('newRoomBuilding')?.value.trim();
    const floor = document.getElementById('newRoomFloor')?.value.trim();
    const location = document.getElementById('newRoomLocation')?.value.trim();
    
    if (!roomNumber || !building || !floor || !location) {
        showAdminToast('Please fill all fields', true);
        return;
    }
    
    const rooms = loadRooms();
    
    if (rooms[roomNumber]) {
        showAdminToast('Room already exists!', true);
        return;
    }
    
    rooms[roomNumber] = {
        building: building,
        floor: floor,
        location: location,
        image: "room1.png"
    };
    
    saveRooms(rooms);
    
    // Clear form
    const numberInput = document.getElementById('newRoomNumber');
    const buildingInput = document.getElementById('newRoomBuilding');
    const floorInput = document.getElementById('newRoomFloor');
    const locationInput = document.getElementById('newRoomLocation');
    
    if (numberInput) numberInput.value = '';
    if (buildingInput) buildingInput.value = '';
    if (floorInput) floorInput.value = '';
    if (locationInput) locationInput.value = '';
    
    showAdminToast(`✅ Room ${roomNumber} added successfully!`);
}

function deleteRoom(roomNumber) {
    if (confirm(`Are you sure you want to delete Room ${roomNumber}?`)) {
        const rooms = loadRooms();
        delete rooms[roomNumber];
        saveRooms(rooms);
        renderRoomsList();
        showAdminToast(`🗑️ Room ${roomNumber} deleted`);
    }
}

function editRoom(roomNumber) {
    const rooms = loadRooms();
    const room = rooms[roomNumber];
    if (!room) return;
    
    const newBuilding = prompt('Edit Building:', room.building);
    if (newBuilding) room.building = newBuilding;
    
    const newFloor = prompt('Edit Floor:', room.floor);
    if (newFloor) room.floor = newFloor;
    
    const newLocation = prompt('Edit Location:', room.location);
    if (newLocation) room.location = newLocation;
    
    saveRooms(rooms);
    renderRoomsList();
    showAdminToast(`✏️ Room ${roomNumber} updated`);
}

// ========== APPEARANCE MANAGEMENT ==========
function loadAppearanceSettings() {
    const primaryColor = localStorage.getItem('app_primary_color') || '#112a4e';
    const accentColor = localStorage.getItem('app_accent_color') || '#f39c12';
    
    const primaryInput = document.getElementById('primaryColor');
    const accentInput = document.getElementById('accentColor');
    const primaryValue = document.getElementById('primaryColorValue');
    const accentValue = document.getElementById('accentColorValue');
    
    if (primaryInput) primaryInput.value = primaryColor;
    if (accentInput) accentInput.value = accentColor;
    if (primaryValue) primaryValue.textContent = primaryColor;
    if (accentValue) accentValue.textContent = accentColor;
}

function saveColors() {
    const primaryColor = document.getElementById('primaryColor')?.value;
    const accentColor = document.getElementById('accentColor')?.value;
    
    if (primaryColor) localStorage.setItem('app_primary_color', primaryColor);
    if (accentColor) localStorage.setItem('app_accent_color', accentColor);
    
    showAdminToast('🎨 Colors saved! Changes will apply on next app refresh');
}

function loadHomeText() {
    const welcomeName = localStorage.getItem('home_welcome_name') || 'Hadeel Al-Shammari';
    const studentId = localStorage.getItem('home_student_id') || '202001256';
    const studentLevel = localStorage.getItem('home_student_level') || 'Senior';
    
    const welcomeInput = document.getElementById('welcomeName');
    const idInput = document.getElementById('studentId');
    const levelInput = document.getElementById('studentLevel');
    
    if (welcomeInput) welcomeInput.value = welcomeName;
    if (idInput) idInput.value = studentId;
    if (levelInput) levelInput.value = studentLevel;
}

function saveHomeText() {
    const welcomeName = document.getElementById('welcomeName')?.value;
    const studentId = document.getElementById('studentId')?.value;
    const studentLevel = document.getElementById('studentLevel')?.value;
    
    if (welcomeName) localStorage.setItem('home_welcome_name', welcomeName);
    if (studentId) localStorage.setItem('home_student_id', studentId);
    if (studentLevel) localStorage.setItem('home_student_level', studentLevel);
    
    showAdminToast('🏠 Home page text saved!');
}

// ========== PROFILE MANAGEMENT ==========
function loadProfileSettings() {
    const displayName = localStorage.getItem('profile_display_name') || 'Hadeel Al-Shammari';
    const studentId = localStorage.getItem('profile_student_id') || '202001256';
    const email = localStorage.getItem('profile_email') || 'hadeel@pmu.edu.sa';
    
    const nameInput = document.getElementById('profileDisplayName');
    const idInput = document.getElementById('profileStudentId');
    const emailInput = document.getElementById('profileEmail');
    
    if (nameInput) nameInput.value = displayName;
    if (idInput) idInput.value = studentId;
    if (emailInput) emailInput.value = email;
}

function saveProfile() {
    const displayName = document.getElementById('profileDisplayName')?.value;
    const studentId = document.getElementById('profileStudentId')?.value;
    const email = document.getElementById('profileEmail')?.value;
    
    if (displayName) localStorage.setItem('profile_display_name', displayName);
    if (studentId) localStorage.setItem('profile_student_id', studentId);
    if (email) localStorage.setItem('profile_email', email);
    
    showAdminToast('👤 Profile saved!');
}

// ========== STATISTICS MANAGEMENT ==========
function loadStatistics() {
    const events = localStorage.getItem('home_stats_events') || '12';
    const rooms = localStorage.getItem('home_stats_rooms') || '24';
    const reminders = localStorage.getItem('home_stats_reminders') || '5';
    
    const eventsInput = document.getElementById('statsEvents');
    const roomsInput = document.getElementById('statsRooms');
    const remindersInput = document.getElementById('statsReminders');
    
    if (eventsInput) eventsInput.value = events;
    if (roomsInput) roomsInput.value = rooms;
    if (remindersInput) remindersInput.value = reminders;
}

function saveStatistics() {
    const events = document.getElementById('statsEvents')?.value;
    const rooms = document.getElementById('statsRooms')?.value;
    const reminders = document.getElementById('statsReminders')?.value;
    
    if (events) localStorage.setItem('home_stats_events', events);
    if (rooms) localStorage.setItem('home_stats_rooms', rooms);
    if (reminders) localStorage.setItem('home_stats_reminders', reminders);
    
    showAdminToast('📊 Statistics saved!');
}

// ========== DATA EXPORT/IMPORT ==========
function exportData() {
    const data = {
        rooms: loadRooms(),
        schedule: loadSchedule(),
        announcements: loadAnnouncements(),
        colors: {
            primary: localStorage.getItem('app_primary_color'),
            accent: localStorage.getItem('app_accent_color')
        },
        homeText: {
            welcomeName: localStorage.getItem('home_welcome_name'),
            studentId: localStorage.getItem('home_student_id'),
            studentLevel: localStorage.getItem('home_student_level')
        },
        profile: {
            displayName: localStorage.getItem('profile_display_name'),
            studentId: localStorage.getItem('profile_student_id'),
            email: localStorage.getItem('profile_email')
        },
        stats: {
            events: localStorage.getItem('home_stats_events'),
            rooms: localStorage.getItem('home_stats_rooms'),
            reminders: localStorage.getItem('home_stats_reminders')
        }
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pmu_hub_backup_${new Date().toISOString().slice(0,19)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showAdminToast('📦 Data exported successfully!');
}

function importData(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            if (data.rooms) saveRooms(data.rooms);
            if (data.schedule) saveSchedule(data.schedule);
            if (data.announcements) saveAnnouncements(data.announcements);
            if (data.colors) {
                if (data.colors.primary) localStorage.setItem('app_primary_color', data.colors.primary);
                if (data.colors.accent) localStorage.setItem('app_accent_color', data.colors.accent);
            }
            if (data.homeText) {
                if (data.homeText.welcomeName) localStorage.setItem('home_welcome_name', data.homeText.welcomeName);
                if (data.homeText.studentId) localStorage.setItem('home_student_id', data.homeText.studentId);
                if (data.homeText.studentLevel) localStorage.setItem('home_student_level', data.homeText.studentLevel);
            }
            if (data.profile) {
                if (data.profile.displayName) localStorage.setItem('profile_display_name', data.profile.displayName);
                if (data.profile.studentId) localStorage.setItem('profile_student_id', data.profile.studentId);
                if (data.profile.email) localStorage.setItem('profile_email', data.profile.email);
            }
            if (data.stats) {
                if (data.stats.events) localStorage.setItem('home_stats_events', data.stats.events);
                if (data.stats.rooms) localStorage.setItem('home_stats_rooms', data.stats.rooms);
                if (data.stats.reminders) localStorage.setItem('home_stats_reminders', data.stats.reminders);
            }
            
            showAdminToast('📥 Data imported successfully!');
            setTimeout(() => window.location.reload(), 1500);
        } catch (error) {
            showAdminToast('❌ Invalid backup file!', true);
        }
    };
    reader.readAsText(file);
}

function resetToDefault() {
    if (confirm('⚠️ WARNING: This will delete ALL custom data. Are you sure?')) {
        localStorage.clear();
        // Reset to default rooms
        const defaultRooms = {
            "G101": { building: "College of engineering | كلية الهندسة", floor: "Ground Floor", location: "Female Campus", image: "room1.png" },
            "F101": { building: "College of Architecture and Design | كلية العمارة و التصميم", floor: "First Floor", location: "Female Campus", image: "room2.png" },
            "S101": { building: "College of Law | كلية القانون", floor: "Second Floor", location: "Female Campus", image: "room3.png" }
        };
        saveRooms(defaultRooms);
        saveSchedule(defaultSchedule);
        saveAnnouncements(defaultAnnouncements);
        showAdminToast('🔄 Reset to default completed!');
        setTimeout(() => window.location.reload(), 1500);
    }
}

// ========== TAB SWITCHING ==========
function switchAdminTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    const targetTab = document.getElementById(`${tabId}Tab`);
    if (targetTab) targetTab.classList.add('active');
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const targetBtn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
    if (targetBtn) targetBtn.classList.add('active');
}

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication for admin pages
    if (window.location.pathname.includes('admin-panel.html')) {
        checkAdminAuth();
        
        // Initialize all data
        renderRoomsList();
        renderScheduleList();
        renderAnnouncementsList();
        loadAppearanceSettings();
        loadHomeText();
        loadProfileSettings();
        loadStatistics();
        
        // Tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                switchAdminTab(btn.dataset.tab);
            });
        });
        
        // Rooms buttons
        const addRoomBtn = document.getElementById('addRoomBtn');
        if (addRoomBtn) addRoomBtn.addEventListener('click', addRoom);
        
        // Schedule buttons
        const addScheduleFormBtn = document.getElementById('addScheduleFormBtn');
        if (addScheduleFormBtn) addScheduleFormBtn.addEventListener('click', addScheduleFromForm);
        
        // Announcements buttons
        const addAnnouncementFormBtn = document.getElementById('addAnnouncementFormBtn');
        if (addAnnouncementFormBtn) addAnnouncementFormBtn.addEventListener('click', addAnnouncementFromForm);
        
        // Appearance buttons
        const saveColorsBtn = document.getElementById('saveColorsBtn');
        if (saveColorsBtn) saveColorsBtn.addEventListener('click', saveColors);
        
        const saveHomeTextBtn = document.getElementById('saveHomeTextBtn');
        if (saveHomeTextBtn) saveHomeTextBtn.addEventListener('click', saveHomeText);
        
        // Profile buttons
        const saveProfileBtn = document.getElementById('saveProfileBtn');
        if (saveProfileBtn) saveProfileBtn.addEventListener('click', saveProfile);
        
        // Statistics buttons
        const saveStatsBtn = document.getElementById('saveStatsBtn');
        if (saveStatsBtn) saveStatsBtn.addEventListener('click', saveStatistics);
        
        // Data management buttons
        const exportBtn = document.getElementById('exportDataBtn');
        if (exportBtn) exportBtn.addEventListener('click', exportData);
        
        const importBtn = document.getElementById('importDataBtn');
        const importFile = document.getElementById('importFileInput');
        if (importBtn && importFile) {
            importBtn.addEventListener('click', () => importFile.click());
            importFile.addEventListener('change', (e) => {
                if (e.target.files[0]) importData(e.target.files[0]);
            });
        }
        
        const resetBtn = document.getElementById('resetDataBtn');
        if (resetBtn) resetBtn.addEventListener('click', resetToDefault);
        
        const logoutBtn = document.getElementById('adminLogoutBtn');
        if (logoutBtn) logoutBtn.addEventListener('click', adminLogout);
        
        const backBtn = document.getElementById('backToAppBtn');
        if (backBtn) backBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
    
    if (window.location.pathname.includes('admin-login.html')) {
        const form = document.getElementById('adminLoginForm');
        if (form) form.addEventListener('submit', handleAdminLogin);
    }
});

// Make functions global
window.deleteRoom = deleteRoom;
window.editRoom = editRoom;
window.editScheduleItem = editScheduleItem;
window.deleteScheduleItem = deleteScheduleItem;
window.editAnnouncement = editAnnouncement;
window.deleteAnnouncement = deleteAnnouncement;

// ========== UPDATE HOME PAGE IN REAL TIME ==========
function updateHomePageInRealTime() {
    // محاولة تحديث الصفحة الرئيسية إذا كانت مفتوحة في تبويب آخر
    // هذا الكود يخزن مؤشر بأن البيانات تغيرت
    localStorage.setItem('pmu_data_updated', Date.now().toString());
    
    // محاولة إرسال رسالة للتبويبات الأخرى
    if (window.opener) {
        try {
            window.opener.postMessage({ type: 'PMU_DATA_UPDATED', timestamp: Date.now() }, '*');
        } catch(e) { console.log('Cannot communicate with opener'); }
    }
}

// تعديل دوال الحفظ لتشمل تحديث الصفحة الرئيسية
// استبدل دوال saveSchedule, saveAnnouncements, saveRooms, saveColors, saveHomeText, saveProfile, saveStatistics

// نسخ احتياطي للدوال الأصلية
const originalSaveSchedule = saveSchedule;
const originalSaveAnnouncements = saveAnnouncements;
const originalSaveRooms = saveRooms;

// تعديل saveSchedule
window.saveSchedule = function(schedule) {
    originalSaveSchedule(schedule);
    updateHomePageInRealTime();
};

// تعديل saveAnnouncements
window.saveAnnouncements = function(announcements) {
    originalSaveAnnouncements(announcements);
    updateHomePageInRealTime();
};

// تعديل saveRooms
window.saveRooms = function(rooms) {
    originalSaveRooms(rooms);
    updateHomePageInRealTime();
};

// تعديل saveColors
const originalSaveColors = saveColors;
window.saveColors = function() {
    originalSaveColors();
    updateHomePageInRealTime();
};

// تعديل saveHomeText
const originalSaveHomeText = saveHomeText;
window.saveHomeText = function() {
    originalSaveHomeText();
    updateHomePageInRealTime();
};

// تعديل saveProfile
const originalSaveProfile = saveProfile;
window.saveProfile = function() {
    originalSaveProfile();
    updateHomePageInRealTime();
};

// تعديل saveStatistics
const originalSaveStatistics = saveStatistics;
window.saveStatistics = function() {
    originalSaveStatistics();
    updateHomePageInRealTime();
};