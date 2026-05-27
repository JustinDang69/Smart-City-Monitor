// ============================================
// SMART CITY MONITORING SYSTEM - MAIN JAVASCRIPT
// ============================================
// NOTE: This is a frontend-only prototype
// Comments indicate where backend APIs should be integrated
// ============================================

// ============================================
// NAVBAR & RESPONSIVE MENU
// ============================================

const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });
}

// ============================================
// LOGIN & AUTHENTICATION SYSTEM
// ============================================
// FRONTEND ONLY - No real backend authentication
// In a real system, this would:
// 1. Send credentials to: POST /api/auth/login
// 2. Receive JWT token from server
// 3. Store token in localStorage (securely, using httpOnly in production)
// 4. Include token in all subsequent API requests
// 5. Validate token expiry and refresh if needed
// ============================================

// Demo credentials (hardcoded for frontend demo only)
const DEMO_CREDENTIALS = {
    email: 'admin@braybrook.gov.au',
    password: 'admin123'
};

// Session key for localStorage
const SESSION_KEY = 'smart_city_session';

// Get login modal and button
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const loginModal = document.getElementById('loginModal');
const loginForm = document.getElementById('loginForm');
const closeBtn = document.querySelector('.close');

// Check if user is already logged in on page load
window.addEventListener('load', function() {
    checkLoginStatus();
});

function checkLoginStatus() {
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
        showLogoutButton();
    } else {
        showLoginButton();
    }
}

function showLoginButton() {
    if (loginBtn) loginBtn.style.display = 'block';
    if (logoutBtn) logoutBtn.style.display = 'none';
}

function showLogoutButton() {
    if (loginBtn) loginBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'block';
}

// Open login modal
if (loginBtn) {
    loginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        loginModal.style.display = 'block';
    });
}

// Close login modal
if (closeBtn) {
    closeBtn.addEventListener('click', function() {
        loginModal.style.display = 'none';
        clearLoginForm();
    });
}

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    if (e.target === loginModal) {
        loginModal.style.display = 'none';
        clearLoginForm();
    }
});

// Handle login form submission
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleLogin();
    });
}

function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');

    // Frontend validation only
    if (!email || !password) {
        showLoginError('Please enter email and password');
        return;
    }

    // Hardcoded demo authentication (frontend only)
    if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
        // Simulate successful login
        // In real system, this would receive JWT from backend
        const session = {
            email: email,
            loginTime: new Date().toISOString(),
            // In production: add JWT token: token: jwtToken
        };

        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        
        // Clear form
        clearLoginForm();
        
        // Close modal
        loginModal.style.display = 'none';
        
        // Update button display
        showLogoutButton();
        
        // Show success message
        alert('Login successful! You are now logged in as ' + email);
        
        // Redirect to dashboard if on home page
        if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        }
    } else {
        showLoginError('Invalid email or password. Demo: admin@braybrook.gov.au / admin123');
    }
}

function showLoginError(message) {
    const errorDiv = document.getElementById('loginError');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function clearLoginForm() {
    if (loginForm) {
        loginForm.reset();
        const errorDiv = document.getElementById('loginError');
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
    }
}

// Handle logout
if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        handleLogout();
    });
}

function handleLogout() {
    // In real system, would also:
    // 1. Send logout request to: POST /api/auth/logout
    // 2. Server would invalidate JWT token
    // 3. Clear any server-side sessions
    
    localStorage.removeItem(SESSION_KEY);
    showLoginButton();
    alert('You have been logged out');
    window.location.href = 'index.html';
}



// Populate dashboard data on page load
if (window.location.pathname.includes('dashboard.html')) {
    window.addEventListener('load', function() {
        populateDashboardData();
    });
}

function populateDashboardData() {
    // Check if user is logged in (optional - could allow read-only access)
    // const session = localStorage.getItem(SESSION_KEY);
    // if (!session) {
    //     alert('Please login to view the dashboard');
    //     window.location.href = 'index.html';
    //     return;
    // }

    // Generate mock measurements table data
    const mockMeasurements = [
        {
            site: 'North Braybrook',
            timestamp: '2025-05-20 14:30',
            pm25: '28',
            no2: '42',
            noise: '68',
            temp: '22°C',
            status: 'Good'
        },
        {
            site: 'Central Braybrook',
            timestamp: '2025-05-20 14:25',
            pm25: '35',
            no2: '48',
            noise: '75',
            temp: '21°C',
            status: 'Moderate'
        },
        {
            site: 'South Braybrook',
            timestamp: '2025-05-20 14:20',
            pm25: '42',
            no2: '52',
            noise: '78',
            temp: '23°C',
            status: 'High'
        },
        {
            site: 'East Braybrook',
            timestamp: '2025-05-20 14:15',
            pm25: '30',
            no2: '45',
            noise: '70',
            temp: '20°C',
            status: 'Good'
        },
        {
            site: 'West Braybrook',
            timestamp: '2025-05-20 14:10',
            pm25: '38',
            no2: '50',
            noise: '72',
            temp: '22°C',
            status: 'Moderate'
        }
    ];

    const tableBody = document.getElementById('dataTableBody');
    if (tableBody) {
        tableBody.innerHTML = mockMeasurements.map(m => `
            <tr>
                <td>${m.site}</td>
                <td>${m.timestamp}</td>
                <td>${m.pm25}</td>
                <td>${m.no2}</td>
                <td>${m.noise}</td>
                <td>${m.temp}</td>
                <td><span class="status-badge status-${m.status.toLowerCase()}">${m.status}</span></td>
            </tr>
        `).join('');
    }

    // Add notifications
    const notificationsContainer = document.getElementById('notificationsContainer');
    if (notificationsContainer) {
        notificationsContainer.innerHTML = `
            <div class="notification warning">
                <div class="notification-icon"><i class="fas fa-exclamation-triangle"></i></div>
                <div>
                    <div class="notification-title">High Air Quality Alert</div>
                    <div>South Braybrook site detected PM2.5 at 42 μg/m³ (High level) at 14:20</div>
                </div>
            </div>
            <div class="notification warning">
                <div class="notification-icon"><i class="fas fa-wifi"></i></div>
                <div>
                    <div class="notification-title">Sensor Offline</div>
                    <div>West Braybrook noise sensor has not reported data for 2 hours</div>
                </div>
            </div>
        `;
    }

    // Set default date range
    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 7);

    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');

    if (startDateInput && endDateInput) {
        startDateInput.valueAsDate = startDate;
        endDateInput.valueAsDate = endDate;
    }
}

// ============================================
// BACKEND API INTEGRATION NOTES
// ============================================
// Future backend endpoints needed:
//
// Authentication:
// - POST /api/auth/login - User authentication
// - POST /api/auth/logout - Logout user
// - POST /api/auth/refresh - Refresh JWT token
//
// Measurements/Dashboard:
// - GET /api/measurements - Get all measurements
// - GET /api/measurements?site={site}&startDate={}&endDate={} - Filter measurements
// - GET /api/measurements/latest - Get latest readings
// - GET /api/measurements/statistics - Get summary statistics
//
// Reports:
// - POST /api/reports/generate - Generate report
// - GET /api/reports/export/pdf - Export as PDF
// - GET /api/reports/export/csv - Export as CSV
//
// Admin:
// - POST /api/datasets/validate - Validate CSV/JSON file
// - POST /api/datasets/upload - Upload validated dataset
// - GET /api/datasets/history - Get upload history
//
// Each endpoint should:
// 1. Require authentication token in Authorization header
// 2. Validate user permissions
// 3. Return appropriate HTTP status codes
// 4. Include error messages for debugging
// 5. Log all API calls for audit trail
// ============================================
