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
        } catch {  }
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

function demoPath(demo) {
    return `demos/${demo.niche}/${demo.slug}/`;
}

function demoIsLive(demo) {
    return Boolean(demo && demo.purchased && demo.live_url);
}
