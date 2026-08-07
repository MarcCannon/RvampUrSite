(() => {
    'use strict';

    const script = document.currentScript;

    const SITE_ROOT = new URL('../../', script.src).href;

    const slug = script.dataset.slug || (() => {
        const parts = window.location.pathname.split('/').filter(p => p && !p.endsWith('.html'));
        return parts[parts.length - 1] || '';
    })();

    const BAR_ID = 'demoLiveBar';

    function build(demo) {
        const bar = document.createElement('aside');
        bar.id = BAR_ID;
        bar.setAttribute('role', 'region');
        bar.setAttribute('aria-label', 'This demo is a live website');
        bar.style.cssText = [
            'position:fixed', 'top:0', 'left:0', 'right:0', 'z-index:2147483000',
            'display:flex', 'align-items:center', 'justify-content:center',
            'flex-wrap:wrap', 'gap:0.5rem 1rem',
            'padding:0.7rem 1rem',
            'background:#0b1220',
            'border-bottom:1px solid rgba(255,255,255,0.14)',
            'box-shadow:0 6px 24px -8px rgba(0,0,0,0.7)',
            "font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif",
            'font-size:0.9rem', 'line-height:1.4', 'color:#f5f7fa'
        ].join(';');

        bar.innerHTML = `
            <span style="display:inline-flex;align-items:center;gap:0.5rem;font-weight:600">
                <svg width="17" height="17" viewBox="0 0 20 20" fill="#34d399" aria-hidden="true" style="flex:none">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.7-9.3a1 1 0 00-1.4-1.4L9 10.6 7.7 9.3a1 1 0 00-1.4 1.4l2 2a1 1 0 001.4 0l4-4z" clip-rule="evenodd"/>
                </svg>
                This website is live
            </span>
            <span style="color:#9aa6b6">
                ${escapeHtml(demo.name || 'This business')} bought this design &mdash; it&rsquo;s their real site now.
            </span>
            <a href="${escapeAttr(demo.live_url)}" target="_blank" rel="noopener"
               style="display:inline-flex;align-items:center;gap:0.4rem;padding:0.5rem 1rem;
                      border-radius:999px;background:#34d399;color:#06251a;
                      font-weight:700;text-decoration:none;white-space:nowrap">
                Visit the real site
                <span aria-hidden="true">&rarr;</span>
            </a>
        `;
        return bar;
    }

    function escapeHtml(s) {
        return String(s ?? '').replace(/[&<>"']/g, c => (
            { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
        ));
    }

    function escapeAttr(url) {
        const raw = String(url ?? '').trim();
        const safe = /^https?:\/\//i.test(raw) ? raw : 'https://' + raw.replace(/^\/+/, '');
        return escapeHtml(safe);
    }

    function makeRoom(bar) {
        const basePad = parseFloat(getComputedStyle(document.body).paddingTop) || 0;
        const pinned = [];

        document.querySelectorAll('body *').forEach(el => {
            if (el === bar || bar.contains(el)) return;
            const cs = getComputedStyle(el);
            if ((cs.position === 'fixed' || cs.position === 'sticky') && cs.top === '0px') {
                pinned.push({ el, base: 0 });
            }
        });

        function apply() {
            const h = bar.offsetHeight;
            document.body.style.paddingTop = (basePad + h) + 'px';
            document.documentElement.style.scrollPaddingTop = h + 'px';
            pinned.forEach(({ el, base }) => { el.style.top = (base + h) + 'px'; });
        }

        apply();

        window.addEventListener('resize', apply);
        if ('ResizeObserver' in window) new ResizeObserver(apply).observe(bar);
    }

    document.addEventListener('DOMContentLoaded', async () => {
        if (!slug || document.getElementById(BAR_ID)) return;
        if (typeof getDemoRegistry !== 'function') {
            console.error('demo-live-badge.js needs demo-registry.js loaded first.');
            return;
        }

        const demos = await getDemoRegistry(SITE_ROOT);
        const demo = demos.find(d => d && d.slug === slug);

        if (!demoIsLive(demo)) return;

        const bar = build(demo);
        document.body.insertAdjacentElement('afterbegin', bar);
        makeRoom(bar);
    });
})();
