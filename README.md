# Font Picker

A browser extension that redraws any website in a font you choose. Set your
defaults once; override them for a single site when that site's own font is
unreadable. English, Tajik and Uzbek.

Works in Chrome, Edge and Firefox from the same folder.

---

## How a browser extension is put together

An extension is a folder of ordinary web files plus one JSON file that tells the
browser what they are for. There is no build step, no framework and no compiler
— the browser loads the folder as it is. Five pieces do all the work:

| Piece | What it is | Here |
|---|---|---|
| **manifest.json** | The only required file. Declares the name, version, permissions, and which script goes where. | `manifest.json` |
| **Content script** | JavaScript the browser injects *into web pages*. It sees the page's DOM but not the page's own JavaScript variables. This is the only piece that can touch a site. | `src/content.js` |
| **Popup** | A small HTML page shown when the toolbar button is clicked. A normal page: HTML, CSS, JS. It cannot touch the page directly — it saves settings, and the content script reacts. | `src/popup.*` |
| **Storage** | `storage.sync` follows the browser profile between machines, `storage.local` stays put. Both fire a `storage.onChanged` event, which is how the popup and the content script talk to each other. | `src/settings.js` |
| **`_locales/`** | One `messages.json` per language. The browser picks the folder matching its own UI language for the extension's name and description. | `_locales/*/` |

No browser ships a Tajik or Uzbek interface, so `_locales` alone would show
both readers an English panel. That is why the popup carries its own
translations and its own language picker, and `_locales` only supplies the name
and description in the extensions list. If some Chrome build ever refuses the
`_locales/tg` or `_locales/uz` folder, deleting it costs nothing but that line
in the extensions list — the panel keeps all three languages.

Two things surprise people coming from ordinary web work:

- **Manifest V3** is what stores accept now. The old background page became a
  service worker that the browser stops whenever it is idle, so nothing may be
  kept in a variable between events. This extension needs no background script
  at all: the content script reads storage itself.
- **Permissions are the whole review**. Ask for less and the extension installs
  with a milder warning and gets reviewed faster. Font Picker asks for `storage`
  and `activeTab` — a content script declared with `matches` does not need
  `host_permissions` on top.

### Loading it while you work on it

| Browser | Steps | Survives a restart? |
|---|---|---|
| **Chrome** | `chrome://extensions` → Developer mode → **Load unpacked** → pick this folder | yes |
| **Edge** | `edge://extensions` → Developer mode → **Load unpacked** | yes |
| **Firefox** | `about:debugging#/runtime/this-firefox` → **Load Temporary Add-on** → pick `manifest.json` | no — reload it each session |

After editing a file, press the reload arrow on the extension's card, then
reload the web page you are testing.

Chrome and Edge log a harmless warning about the `browser_specific_settings`
key — that key is Firefox's, and they ignore it. The extension still loads.

Firefox keeps site access opt-in for Manifest V3. If nothing changes there,
open the extensions menu → **Font Picker** → allow it on all sites. A permanent
Firefox install needs the add-on signed at addons.mozilla.org; the `gecko.id`
in the manifest is what identifies it there.

---

## Using it

Click the toolbar button.

- **Font set** — four starter sets (System, Reading, Modern, High legibility).
  Pick one and the three fields below fill in; edit any field and the set
  becomes *Custom*.
- **Text / Headings / Code** — type any font name, or choose from the list. The
  list is measured against your machine, so fonts you actually have are shown
  first, and a name you type that is not installed is marked. Leave a field
  empty to let the site keep its own font there.
- **Apply to** — *All sites* edits your defaults; switching to the site's name
  saves fonts for that site alone.
- **Turn off on this site** — for sites whose layout depends on their font.

Changes apply immediately to open tabs; nothing needs reloading.

### What it deliberately does not touch

Icon fonts. Font Awesome, Material Icons and their relatives draw pictures from
private character slots, so forcing a text font on them turns every icon into
an empty box. Elements whose class names look like icons keep the site's own
font, as do `::before` / `::after` pseudo-elements, which is where most icon
libraries put their glyphs.

---

## The files

```
manifest.json         what the browser reads first
src/settings.js       the settings shape, defaults, and the four font sets
src/content.js        injects the CSS into every page, at document_start
src/popup.html/css/js the panel behind the toolbar button
src/fonts.js          the font list, measured against this computer
src/i18n.js           popup translations: en, tg, uz
_locales/*/           extension name and description, per language
test/check.js         checks that run without a browser
package.py            zips the folder for a store upload
```

## Adding a language

1. Add a block to `src/i18n.js` with the same keys as `en`, and its code to `langs`.
2. Add `_locales/<code>/messages.json` with `extName` and `extDesc`.
3. `node test/check.js` — it fails if any string is missing from any language.

## Tests

```
node test/check.js
```

Twenty checks with no browser involved: the manifest names only files that
exist and only permissions the code uses, no language is missing a string the
popup asks for, and the content script produces the right CSS — including that
the icon-exclusion list sits inside `:where()`, without which the headings rule
would lose to it on specificity.

## Publishing

`./package.py` writes `font-picker-<version>.zip` with the manifest at the root,
which is the shape all three stores expect.

- Chrome Web Store — one-time developer fee, review in days.
- Edge Add-ons — free, accepts the same zip.
- Firefox (addons.mozilla.org) — free, signs the add-on; this is also the only
  way to install it permanently in release Firefox.
