# Scraping Protocol

## 1. Rule: Distinguish Targets
There are two entirely separate types of scraping targets. NEVER confuse them.

### Target A: Reference Sites (Pattern Study ONLY)
- **Purpose:** To understand why top-tier sites in a niche convert well.
- **Action:** Extract layout structure, spacing rhythm, color palettes (hex codes), typography, CTA placement, and form friction patterns.
- **Output:** Save notes to `reference-library/{niche}/{site}/`.
- **CRITICAL RESTRICTION:** NEVER reproduce their copyrighted text verbatim. NEVER download and reuse their photography or logos. Do NOT ship any reference data.

### Target B: Prospect Sites (Demo Source of Truth)
- **Purpose:** To gather the real business data needed to build their personalized demo.
- **Action:** Scrape their actual business name, address, phone number, service list, current copy, rights-cleared photos (from their site, Google Business Profile, or public social media), and real reviews.
- **Output:** Save raw assets to `prospects/{niche}/{business-slug}/`.
- **CRITICAL RESTRICTION:** Do not misrepresent scraped reviews as testimonials for the *new* design. Keep a log of where assets were sourced for licensing compliance if the deal closes.

## 2. Technical Scraping Guidelines
- Use headless browsers or simple DOM parsing depending on the site's complexity.
- Respect `robots.txt` where applicable.
- Do not overload prospect servers; use deliberate delays if scraping multiple pages.
- When capturing screenshots of reference sites, ensure both desktop and mobile viewports are captured for comprehensive layout analysis.
