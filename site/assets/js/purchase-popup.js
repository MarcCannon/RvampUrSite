const POPUP_SCRIPT = document.currentScript;

const SITE_ROOT = new URL('../../', POPUP_SCRIPT.src).href;

const POPUP_REF   = POPUP_SCRIPT.dataset.ref   || '';
const POPUP_NICHE = POPUP_SCRIPT.dataset.niche || '';
const POPUP_DARK  = POPUP_SCRIPT.dataset.theme === 'dark';

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
    } catch {  }

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

    setTimeout(() => {
        document.body.insertAdjacentHTML('beforeend', popupHtml);

        const popup = document.getElementById('demoPurchasePopup');

        function dismiss() {
            popup.remove();
            try { sessionStorage.setItem(POPUP_DISMISS_KEY, '1'); } catch {  }
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
