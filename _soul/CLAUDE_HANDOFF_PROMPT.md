# Claude Agent Handoff Prompt

**Purpose:** This prompt is used to hand off the actual demo creation task to a Claude coding agent. Claude will do its own research and scraping of the prospect's live site, using the reference patterns we've stored.

---

## Handoff Prompt Template

**To: Claude Agent**

**Task:** Build a high-converting, 2026-standard demo website for a prospective client.

**Prospect Details:**
- **Business Name:** [Insert Business Name]
- **Current Website:** [Insert Current URL]
- **Niche:** [Insert Niche, e.g., Autobody, Salon]

**Instructions for Claude:**
1. **Scrape & Study:** Visit the Prospect's Current Website. Extract their REAL images, text, service lists, and reviews. 
2. **Rebuild:** Design a new, premium landing page using vanilla HTML/CSS/JS (no heavy frameworks unless specified). It must load instantly and look incredible on mobile.
3. **Use Real Assets:** You MUST use the images and text you scraped from their current site to populate the demo. It needs to look like *their* business, just upgraded.
4. **Design Patterns:** Follow the conversion standards for this niche. Specifically: [Insert key findings from our reference-library pattern notes for this niche].
5. **Disclaimer:** You MUST include the following disclaimer in the footer: *"Disclaimer: We do not own the rights to the materials and images on this page. They are used strictly for demonstration purposes to show what our web design product looks like."*
6. **No Fake Proof:** Do not invent testimonials. Use the ones you find on their site or Google.
7. **Output:** Provide the fully functional, single-page HTML, CSS, and JS. Do not include any server-side code.
