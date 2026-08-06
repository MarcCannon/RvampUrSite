// ============================================================================
// Admin auth gate — Supabase Auth (email + password).
// Requires supabase-client.js to be loaded first.
//
// This gate controls what the BROWSER shows. It is not what keeps your data
// safe: a determined visitor can always bypass client-side JS. Security comes
// from Row Level Security on the database, which refuses reads and writes that
// do not carry a valid signed-in token. See supabase/schema.sql.
// ============================================================================

(function () {
    const LOGIN_MARKUP = `
        <div class="login-shell">
            <form class="login-card" id="adminLoginForm">
                <div class="login-mark">BS</div>
                <h1>Admin sign in</h1>
                <p class="login-sub">Business Site Studio</p>

                <div class="form-group">
                    <label for="adminEmail">Email</label>
                    <input type="email" id="adminEmail" autocomplete="username" required autofocus>
                </div>
                <div class="form-group">
                    <label for="adminPassword">Password</label>
                    <input type="password" id="adminPassword" autocomplete="current-password" required>
                </div>

                <p class="login-error" id="adminLoginError" role="alert" hidden></p>

                <button type="submit" class="btn btn--primary btn--block" id="adminLoginBtn">Sign in</button>
            </form>
        </div>
    `;

    const LOGIN_STYLES = `
        .login-shell {
            min-height: 100vh;
            display: grid;
            place-items: center;
            padding: var(--space-md);
            background: var(--gradient-primary);
        }
        .login-card {
            width: 100%;
            max-width: 380px;
            background: #fff;
            border-radius: var(--radius-lg);
            padding: var(--space-lg);
            box-shadow: var(--shadow-xl);
            text-align: left;
        }
        .login-mark {
            width: 44px; height: 44px;
            border-radius: 12px;
            background: var(--gradient-accent);
            color: #fff;
            display: grid;
            place-items: center;
            font-weight: 800;
            margin-bottom: var(--space-md);
        }
        .login-card h1 { font-size: var(--text-2xl); margin-bottom: 0.15rem; }
        .login-sub { color: var(--text-secondary); font-size: var(--text-sm); margin-bottom: var(--space-lg); }
        .login-card .form-group { margin-bottom: var(--space-md); }
        .login-error {
            background: #fef2f2;
            color: #b91c1c;
            border: 1px solid #fecaca;
            border-radius: var(--radius-md);
            padding: 0.7rem 0.9rem;
            font-size: var(--text-sm);
            margin-bottom: var(--space-md);
        }
    `;

    function showLogin() {
        document.title = 'Sign in — Business Site Studio';

        const style = document.createElement('style');
        style.textContent = LOGIN_STYLES;
        document.head.appendChild(style);

        document.body.innerHTML = LOGIN_MARKUP;

        const form = document.getElementById('adminLoginForm');
        const errorEl = document.getElementById('adminLoginError');
        const btn = document.getElementById('adminLoginBtn');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            errorEl.hidden = true;
            btn.disabled = true;
            btn.textContent = 'Signing in…';

            const { ok, error } = await sbSignIn(
                document.getElementById('adminEmail').value.trim(),
                document.getElementById('adminPassword').value
            );

            if (ok) {
                window.location.reload();
                return;
            }

            errorEl.textContent = error;
            errorEl.hidden = false;
            btn.disabled = false;
            btn.textContent = 'Sign in';
        });
    }

    function wireLogout() {
        const logoutBtn = document.getElementById('logoutBtn');
        if (!logoutBtn) return;

        logoutBtn.addEventListener('click', async () => {
            logoutBtn.disabled = true;
            await sbSignOut();
            window.location.reload();
        });
    }

    // Hide the page until we know whether to show it, so admin content never
    // flashes on screen before the gate runs.
    const hide = document.createElement('style');
    hide.id = 'adminAuthHide';
    hide.textContent = 'body { visibility: hidden; }';
    document.head.appendChild(hide);

    document.addEventListener('DOMContentLoaded', () => {
        if (sbIsSignedIn()) {
            wireLogout();
        } else {
            showLogin();
        }
        document.getElementById('adminAuthHide')?.remove();
    });
})();
