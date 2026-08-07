// ============================================================================
// Demo registry reader.
//
// One job: hand back the list of demos, wherever it can be found.
//   1. the site_settings row 'demos' — the live one, edited at /admin/demos.html
//   2. site/data/demos.json         — committed fallback, used if (1) is missing
//
// Deliberately standalone. It talks to the REST endpoint directly off window.ENV
// instead of requiring supabase-client.js + settings-client.js, because this
// also loads on prospect demo pages, where every extra request costs LCP.
//
// Reading site_settings needs no session: RLS grants anon SELECT on that table
// (see supabase/schema.sql). Nothing here writes.
// ============================================================================

/**
 * Fetch the demo registry.
 *
 * @param {string} siteRoot Absolute or relative URL of the site root, with a
 *                          trailing slash. Paths in the registry are stored
 *                          relative to it.
 * @returns {Promise<Array>} the demos array, or [] if nothing could be read.
 */
async function getDemoRegistry(siteRoot) {
    const env = window.ENV || {};

    if (env.SUPABASE_URL && env.SUPABASE_ANON_KEY) {
        try {
            const res = await fetch(
                `${env.SUPABASE_URL}/rest/v1/site_settings?key=eq.demos&select=value`,
                {
                    headers: {
                        'apikey': env.SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${env.SUPABASE_ANON_KEY}`
                    }
                }
            );

            if (res.ok) {
                const rows = await res.json();
                const value = rows && rows.length ? rows[0].value : null;
                if (value && Array.isArray(value.demos)) return value.demos;
            }
        } catch { /* fall through to the committed copy */ }
    }

    try {
        const res = await fetch(`${siteRoot}data/demos.json`);
        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data.demos) ? data.demos : [];
    } catch {
        return [];
    }
}

/** Where a demo lives, relative to the site root. */
function demoPath(demo) {
    return `demos/${demo.niche}/${demo.slug}/`;
}

/**
 * True when a demo should advertise itself as a real, live client site: they
 * paid for it AND we have somewhere to send people. Without the URL the badge
 * would be a dead end, so both are required.
 */
function demoIsLive(demo) {
    return Boolean(demo && demo.purchased && demo.live_url);
}
