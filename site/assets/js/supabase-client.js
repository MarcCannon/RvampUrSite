// ============================================================================
// Shared Supabase client.
//
// Credentials come from window.ENV, defined in env.js. That file is gitignored
// and generated at deploy time from GitHub repository secrets, so no key is
// committed to this repository.
//
// Be clear about what that does and does not buy you: the anon key still ships
// to every visitor's browser in the deployed bundle, because it has to. Keeping
// it out of git is hygiene, not a security boundary. The actual boundary is Row
// Level Security on the database (see supabase/schema.sql). Never put a
// service_role key here — that one bypasses RLS entirely.
// ============================================================================

if (!window.ENV || !window.ENV.SUPABASE_URL || !window.ENV.SUPABASE_ANON_KEY) {
    // Fail loudly rather than silently making unauthenticated requests.
    console.error(
        'Supabase config missing. Copy site/assets/js/env.example.js to env.js ' +
        'and fill it in, or set the SUPABASE_URL / SUPABASE_ANON_KEY repository secrets.'
    );
}

const SUPABASE_URL = (window.ENV && window.ENV.SUPABASE_URL) || '';
const SUPABASE_ANON_KEY = (window.ENV && window.ENV.SUPABASE_ANON_KEY) || '';

const SB_SESSION_KEY = 'sb.session';

/** The stored auth session, or null. */
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

/**
 * The bearer token to send. Falls back to the anon key when signed out, which
 * is what public reads use.
 */
function sbAccessToken() {
    const session = sbGetSession();
    return (session && session.access_token) || SUPABASE_ANON_KEY;
}

/** Fetch against the Supabase REST API with the right headers attached. */
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

/** Sign in with email + password. Returns { ok, error }. */
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
        // Best-effort server-side revoke; the local session is cleared regardless.
        try {
            await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
                method: 'POST',
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${session.access_token}`
                }
            });
        } catch { /* offline is fine — clearing locally still signs you out */ }
    }
    sbSetSession(null);
}

/**
 * True when a non-expired session is stored.
 *
 * This is a CONVENIENCE CHECK FOR THE UI ONLY — it decides whether to show the
 * login screen, nothing more. It is not a security boundary and must never be
 * treated as one: anyone can set localStorage by hand. The real enforcement is
 * RLS on the database, which rejects writes that lack a valid token.
 */
function sbIsSignedIn() {
    const session = sbGetSession();
    if (!session || !session.access_token) return false;

    if (session.expires_at && Date.now() / 1000 > session.expires_at) {
        sbSetSession(null);
        return false;
    }
    return true;
}
