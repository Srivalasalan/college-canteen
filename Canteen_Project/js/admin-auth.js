// Admin authentication logic

function checkAdminLogin() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'admin-login.html'; // Redirect if not logged in
    }
}

function adminLogin(event) {
    event.preventDefault(); // Prevent form submission reload

    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;

    // Simple authentication (change credentials here if needed)
    if (username === 'admin' && password === 'admin123') {
        localStorage.setItem('adminLoggedIn', 'true');
        window.location.href = 'admin.html';
    } else {
        alert('Invalid credentials!');
    }
}

function adminLogout() {
    localStorage.removeItem('adminLoggedIn');
    window.location.href = 'admin-login.html';
}

// Ensure admin is logged in before accessing the admin panel
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('admin.html')) {
        checkAdminLogin();
    }
});