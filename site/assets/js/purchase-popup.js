// Shared popup CTA for all demo pages

// This script is loaded from pages at varying depths, so resolve the site root
// from the script's own URL (assets/js/ -> up two levels). Keeps links working
// under a project page like /RvampUrSite/ as well as at a domain root.
const SITE_ROOT = new URL('../../', document.currentScript.src).href;

document.addEventListener("DOMContentLoaded", () => {
    const popupHtml = `
        <div id="demoPurchasePopup" style="
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            z-index: 9999;
            width: 300px;
            font-family: sans-serif;
            border: 1px solid #eaeaea;
        ">
            <button id="closePopup" style="float: right; border: none; background: none; cursor: pointer; font-size: 1.2rem;">&times;</button>
            <h3 style="margin-top: 0; color: #333;">Like what you see?</h3>
            <p style="font-size: 0.9rem; color: #666; margin-bottom: 15px;">Get a site like this for your business.</p>
            <button onclick="window.location.href='${SITE_ROOT}request/?type=claim'" style="
                display: block; width: 100%; padding: 10px; margin-bottom: 10px;
                background: #2563eb; color: white; border: none; border-radius: 4px; cursor: pointer;
            ">This is my business</button>
            <button onclick="window.location.href='${SITE_ROOT}request/?type=inspired-by'" style="
                display: block; width: 100%; padding: 10px;
                background: #f1f5f9; color: #333; border: 1px solid #cbd5e1; border-radius: 4px; cursor: pointer;
            ">I want something like this</button>
        </div>
    `;

    // Only show after a slight delay
    setTimeout(() => {
        document.body.insertAdjacentHTML('beforeend', popupHtml);
        document.getElementById('closePopup').addEventListener('click', (e) => {
            e.target.parentElement.style.display = 'none';
        });
    }, 3000);
});
