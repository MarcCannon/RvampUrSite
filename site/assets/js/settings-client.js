// ============================================================================
// Editable site settings (pricing, etc.) backed by the site_settings table.
// Requires supabase-client.js to be loaded first.
// ============================================================================

/**
 * Read a settings row. Returns `fallback` if the row is missing or the request
 * fails — the public site must never render a broken pricing table because the
 * database had a bad moment.
 */
async function getSetting(key, fallback = null) {
    try {
        const res = await sbFetch(
            `/rest/v1/site_settings?key=eq.${encodeURIComponent(key)}&select=value`
        );
        if (!res.ok) return fallback;

        const rows = await res.json();
        return (rows && rows.length) ? rows[0].value : fallback;
    } catch {
        return fallback;
    }
}

/**
 * Write a settings row (upsert). Requires a signed-in session; RLS rejects it
 * otherwise. Returns { ok, error }.
 */
async function saveSetting(key, value) {
    try {
        const res = await sbFetch('/rest/v1/site_settings', {
            method: 'POST',
            headers: {
                'Prefer': 'resolution=merge-duplicates,return=representation'
            },
            body: JSON.stringify({ key, value })
        });

        if (!res.ok) {
            const body = await res.text();

            if (res.status === 401 || res.status === 403) {
                return { ok: false, error: 'Your session expired or you are not signed in. Sign in again and retry.' };
            }
            return { ok: false, error: `Save failed (${res.status}). ${body}` };
        }

        return { ok: true };
    } catch {
        return { ok: false, error: 'Could not reach the server. Your changes were not saved.' };
    }
}
