// Mock Auth Gate for Admin CMS
// Real implementation should use Supabase Auth (email/password) checking the active session.

document.addEventListener("DOMContentLoaded", () => {
    const isLoggedIn = sessionStorage.getItem("adminAuthToken");
    
    // Simplistic mock gate
    if (!isLoggedIn) {
        // In a real app, you'd show a login form or redirect to /admin/login.html
        // For this demo, we'll prompt.
        const password = prompt("Admin Password (type 'admin'):");
        if (password === 'admin') {
            sessionStorage.setItem("adminAuthToken", "true");
        } else {
            document.body.innerHTML = "<h1>Unauthorized</h1><p>You must be an admin to view this page.</p>";
            throw new Error("Unauthorized");
        }
    }

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            sessionStorage.removeItem("adminAuthToken");
            window.location.reload();
        });
    }
});
