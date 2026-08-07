if (!window.ENV || !window.ENV.SUPABASE_URL || !window.ENV.SUPABASE_ANON_KEY) {

    console.error(
        'Supabase config missing. Copy site/assets/js/env.example.js to env.js ' +
        'and fill it in, or set the SUPABASE_URL / SUPABASE_ANON_KEY repository secrets.'
    );
}

const SUPABASE_URL = (window.ENV && window.ENV.SUPABASE_URL) || '';
const SUPABASE_ANON_KEY = (window.ENV && window.ENV.SUPABASE_ANON_KEY) || '';

const SB_SESSION_KEY = 'sb.session';

function sbGetSession() {
    try {
        return JSON.parse(localStorage.getItem(SB_SESSION_KEY));
    } catch {
        return null;
    }
}

function sbSetSession(session) {
    if (session) localStorage.setItem(SB_SESSION_KEY, JSON.stringify(session));
    else localStorage.removeItem(SB_SESSION_KEY);
}

function sbAccessToken() {
    const session = sbGetSession();
    return (session && session.access_token) || SUPABASE_ANON_KEY;
}

async function sbFetch(path, options = {}) {
    return fetch(`${SUPABASE_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${sbAccessToken()}`,
            ...(options.headers || {})
        }
    });
}

async function sbSignIn(email, password) {
    try {
        const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_ANON_KEY },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            return { ok: false, error: data.error_description || data.msg || 'Sign in failed.' };
        }

        sbSetSession(data);
        return { ok: true };
    } catch {
        return { ok: false, error: 'Could not reach the server. Check your connection.' };
    }
}

async function sbSignOut() {
    const session = sbGetSession();
    if (session && session.access_token) {

        try {
            await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
                method: 'POST',
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${session.access_token}`
                }
            });
        } catch {  }
    }
    sbSetSession(null);
}

function sbIsSignedIn() {
    const session = sbGetSession();
    if (!session || !session.access_token) return false;

    if (session.expires_at && Date.now() / 1000 > session.expires_at) {
        sbSetSession(null);
        return false;
    }
    return true;
}
