# Oddform website

Local-only static creative solutions company website, built from the two supplied reference documents and revised with the identity board, actual Framepath screenshot, and logo pack. No production website, DNS, or logo laboratory was modified.

## Run / build
Requires Node.js 20+. No install step or runtime dependencies.

```sh
cd "/Users/Tyler/Desktop/Websites/Oddform/site"
npm run dev
# http://127.0.0.1:4180
npm run build
npm run preview
```
Stop the running dev server before preview, or use `PORT=4181 npm run preview`. Build output is `dist/`, ready for a static host once authorized.

## Files / editing
- `index.html`: homepage copy, six sections, navigation, metadata, links, contact fields.
- `styles.css`: color tokens, typography, responsive layouts, Framepath product feature.
- `app.js`: mobile navigation, header logo integration, mailto draft preparation, current year.
- `src/`: unchanged original logo morph component and geometry/rendering modules.
- `assets/reference-texture.png`: optimized 800px source artwork copy (338 KB). Original remains untouched.
- `assets/favicon.svg`: simplified small-size brand icon.
- `assets/social.png`: 1200 × 630 social image.
- `scripts/build.mjs`: clean static output; `scripts/serve.mjs`: loopback-only preview server.
- `robots.txt`, `sitemap.xml`: intended oddform.works production URLs.
- `preview.png`: browser full-page capture.
- `../!reference/BUILD_TODO.md`: progress and launch requirements.

## Contact
Contact address: tyler@oddform.works. The form validates required fields and email, then opens a populated email draft in the visitor's email app. It does not transmit, store, or claim to send anything. A direct email link also works without JavaScript. No API keys or backend are present.

## Validation
`npm run build` and `node --check app.js` passed. Browser checks covered desktop and narrow mobile layouts (no horizontal overflow at rendered 984px and 300px), menu open/close, anchor navigation, invalid-email detection, keyboard home navigation, desktop logo hover/reversal, and immediate reduced-motion state. No browser console errors were observed. The original logo source modules match the reference. Email sending was deliberately not performed; an installed mail client is needed to complete sending.

## Before production
No deployment performed. Hosting target is unknown; DNS steps depend on that target. Publish `dist/` only after production authorization, map oddform.works to the chosen host, enable HTTPS, and check live assets/canonical/social metadata. Framepath cross-link on its own site remains a separate change requiring its project context. Framepath feature now uses the supplied actual screenshot (browser chrome cropped) and original full-color logo. Confirm product claims, final legal status, and any needed legal/privacy content before public launch. No false legal status, testimonials, pricing, addresses, or partner ownership claims are included.

## Identity revision
Slate (#292e32), ivory, and orange with lightweight SVG grain. Header is fixed, hides after 12px accumulated downward travel, and returns on upward scroll. It stays visible at the top, while its menu is open, and during keyboard focus. Reduced motion disables its transition. Copy covers video, websites/digital tools, 3D printing, and creative problem-solving.

## Material / interaction refinement
Neutral charcoal (#181817), fire orange (#ff641e), layered background grain/vignette, grain-filled display lettering, and self-hosted Manrope. Homepage is now five sections; redundant future-direction section removed and copy tightened. Buttons use rounded outlines. Screenshot opens in a native dialog (Escape/close/backdrop dismiss). Footer is compact with a floating back-to-top control. Pointer effects respect reduced-motion and hover support. Manrope font source: Google Fonts / fonts.gstatic.com (SIL Open Font License); runtime font loading is local.
