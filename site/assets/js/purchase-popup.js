// ============================================================================
// Shared popup CTA for all demo pages.
//
// Drop it on a demo with:
//   <script src="../../../assets/js/purchase-popup.js"
//           data-ref="business-slug"   <- tags the lead with which demo it came from
//           data-niche="autobody"      <- preselects the trade in the request form
//           data-theme="dark"></script><- optional; omit for the default light card
//
// data-ref lands in tickets.reference and data-niche in tickets.niche, so a lead
// is attributable to the demo that produced it. See site/request/index.html.
// ============================================================================

// currentScript is only readable while the script is executing, so the element
// and everything derived from it has to be captured now, not inside the
// DOMContentLoaded callback.
const POPUP_SCRIPT = document.currentScript;

// Loaded from pages at varying depths, so resolve the site root from the
// script's own URL (assets/js/ -> up two levels). Keeps links working under a
// project page like /RvampUrSite/ as well as at a domain root.
const SITE_ROOT = new URL('../../', POPUP_SCRIPT.src).href;

const POPUP_REF   = POPUP_SCRIPT.dataset.ref   || '';
const POPUP_NICHE = POPUP_SCRIPT.dataset.niche || '';
const POPUP_DARK  = POPUP_SCRIPT.dataset.theme === 'dark';

// Once dismissed, stay dismissed for the rest of the visit. Re-popping on every
// scroll-triggered reload is the fastest way to make a demo feel cheap.
const POPUP_DISMISS_KEY = 'demoPopupDismissed';

function popupRequestUrl(type) {
    const params = new URLSearchParams({ type });
    if (POPUP_REF) params.set('ref', POPUP_REF);
    if (POPUP_NICHE) params.set('niche', POPUP_NICHE);
    return `${SITE_ROOT}request/?${params}`;
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        if (sessionStorage.getItem(POPUP_DISMISS_KEY)) return;
    } catch { /* private mode / storage disabled — just show it */ }

    const theme = POPUP_DARK
        ? {
            card:      'background:rgba(14,17,23,0.92);border:1px solid rgba(255,255,255,0.16);' +
                       'backdrop-filter:blur(14px);box-shadow:0 18px 50px -12px rgba(0,0,0,0.8);',
            heading:   'color:#F6F8FB;',
            body:      'color:#9EA9B8;',
            close:     'color:#9EA9B8;',
            primary:   'background:linear-gradient(180deg,#F2CE92,#E3B872);color:#1A1206;',
            secondary: 'background:rgba(255,255,255,0.06);color:#E7EDF5;border:1px solid rgba(255,255,255,0.2);'
        }
        : {
            card:      'background:#ffffff;border:1px solid #eaeaea;box-shadow:0 10px 25px rgba(0,0,0,0.2);',
            heading:   'color:#333;',
            body:      'color:#666;',
            close:     'color:#666;',
            primary:   'background:#2563eb;color:#ffffff;',
            secondary: 'background:#f1f5f9;color:#333;border:1px solid #cbd5e1;'
        };

    const btnBase = 'display:block;width:100%;padding:10px;border:none;border-radius:6px;' +
                    'font:inherit;font-size:0.92rem;font-weight:600;cursor:pointer;';

    const popupHtml = `
        <aside id="demoPurchasePopup"
               role="dialog"
               aria-label="Get a site like this"
               style="
            position:fixed;
            bottom:20px;
            right:20px;
            padding:20px;
            border-radius:12px;
            z-index:9999;
            width:300px;
            max-width:calc(100vw - 40px);
            font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;
            ${theme.card}
        ">
            <button id="closePopup" type="button" aria-label="Dismiss"
                    style="float:right;border:none;background:none;cursor:pointer;
                           font-size:1.3rem;line-height:1;padding:0 0 0 8px;${theme.close}">&times;</button>
            <h3 style="margin:0 0 6px;font-size:1.05rem;${theme.heading}">Like what you see?</h3>
            <p style="font-size:0.88rem;margin:0 0 15px;line-height:1.5;${theme.body}">
                Get a site like this for your business.
            </p>
            <button type="button" data-popup-type="claim"
                    style="${btnBase}margin-bottom:8px;${theme.primary}">This is my business</button>
            <button type="button" data-popup-type="inspired-by"
                    style="${btnBase}${theme.secondary}">I want something like this</button>
        </aside>
    `;

    // Delayed so it lands after the visitor has actually looked at the page.
    setTimeout(() => {
        document.body.insertAdjacentHTML('beforeend', popupHtml);

        const popup = document.getElementById('demoPurchasePopup');

        function dismiss() {
            popup.remove();
            try { sessionStorage.setItem(POPUP_DISMISS_KEY, '1'); } catch { /* not critical */ }
        }

        popup.querySelector('#closePopup').addEventListener('click', dismiss);

        popup.querySelectorAll('[data-popup-type]').forEach(btn => {
            btn.addEventListener('click', () => {
                window.location.href = popupRequestUrl(btn.dataset.popupType);
            });
        });

        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && document.getElementById('demoPurchasePopup')) dismiss();
        });
    }, 3000);
});
