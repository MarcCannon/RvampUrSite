// ============================================================================
// TEMPLATE — copy this file to env.js and fill in your values.
//
//     cp site/assets/js/env.example.js site/assets/js/env.js
//
// env.js is gitignored and never committed. In production, GitHub Actions
// generates it from repository secrets during the Pages deploy.
//
// Find these two values in: Supabase dashboard -> Project Settings -> API
// Use the "anon / public" key. NEVER the "service_role" key — that one
// bypasses Row Level Security and must never reach a browser.
// ============================================================================

window.ENV = {
    SUPABASE_URL: 'https://YOUR-PROJECT-REF.supabase.co',
    SUPABASE_ANON_KEY: 'YOUR-ANON-KEY'
};
