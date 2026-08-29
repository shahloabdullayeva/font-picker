# Font Picker

Change the font on any website. Pick your fonts once and every page you open
uses them, or set different fonts for one site that needs it. Works in Chrome,
Edge and Firefox. Panel in English, Tajik and Uzbek.

**[⬇ Download Font Picker](https://github.com/shahloabdullayeva/font-picker/archive/refs/heads/main.zip)** — then follow [Install](#install) below.

## Why this exists

The IT team where I work built us a CRM called Mytrion. Customer service lives
in it eight hours a day. It was written with Claude from start to finish, and as
far as I can tell nobody ever looked at what came back — which shows, mostly in
how it looks.

This is not a complaint about building with AI. I almost certainly use it more
than they do. I cannot code. Every project under this account is AI-written,
this extension included. The difference is that I read what it hands me, and I
care how it looks to the person who has to sit in front of it.

So I asked for one thing: change the font. They said they could make it bigger
if I wanted, and laughed.

A font is not something I need permission for. This changes the font on any
website — Mytrion included.

## Install

It is not in the Chrome Web Store or on addons.mozilla.org yet, so it goes in by
hand. About a minute, and nothing needs to be built or compiled.

**1. Download and unzip**

[Download the extension](https://github.com/shahloabdullayeva/font-picker/archive/refs/heads/main.zip)
and unzip it. You get a folder named `font-picker-main`. Put it somewhere you
will not tidy away — your browser loads the extension from that folder every
time it starts, so deleting or moving the folder removes the extension.

**2. Add it to your browser**

Browsers do not allow a page to link to their settings, so copy the address into
the address bar yourself.

| Chrome | Edge | Firefox |
|---|---|---|
| Go to `chrome://extensions` | Go to `edge://extensions` | Go to `about:debugging#/runtime/this-firefox` |
| Turn on **Developer mode**, top right | Turn on **Developer mode**, bottom left | — |
| **Load unpacked** → pick the `font-picker-main` folder | **Load unpacked** → pick the `font-picker-main` folder | **Load Temporary Add-on** → pick `manifest.json` inside the folder |
| Stays after a restart | Stays after a restart | Gone when Firefox closes — load it again, or see the note below |

**3. Pin the button**

Click the puzzle-piece icon in the toolbar and pin Font Picker, so its button is
always there.

Chrome and Edge print a small warning about a `browser_specific_settings` key.
That key is Firefox's and they ignore it — the extension is fine.

Firefox extras: it keeps site access opt-in, so if nothing changes on a page,
open the extensions menu → **Font Picker** → allow it on all sites. For an
install that survives closing Firefox, the add-on has to be signed at
[addons.mozilla.org](https://addons.mozilla.org/developers/) — not done yet.

## Using it

Click the toolbar button.

- **Font set** — four ready sets: System, Reading (serif), Modern (sans) and
  High legibility. Pick one and the three fields below fill in; change any
  field and the set becomes *Custom*.
- **Text / Headings / Code** — type any font name, or pick from the list. The
  list is measured against your own computer, so the fonts you actually have
  come first, and a name you type that is not installed is marked. Leave a
  field empty to let the site keep its own font there.
- **Apply to** — *All sites* changes your defaults. Switch it to the site's
  name and the fonts you set apply to that site alone.
- **Turn off on this site** — for a site whose layout falls apart in another
  font.
- **Reset to defaults** — puts everything back, keeps your language.

Changes show up straight away in every open tab. Nothing to save, nothing to
reload.

## Language

The panel is in English, Tajik and Uzbek. The selector sits in the top right of
the panel; *Automatic* follows your browser's own language.

## If a website looks wrong

- Icons are left alone on purpose. Font Awesome, Material Icons and the rest
  draw little pictures out of a font, so putting a normal font on them turns
  every icon into an empty box. Anything that looks like an icon keeps the
  site's own font.
- If a site still breaks, tick **Turn off on this site**. Everywhere else keeps
  your fonts.
- Something else wrong? [Open an issue](https://github.com/shahloabdullayeva/font-picker/issues).

## Updating it

Download the zip again, replace the old folder with the new one, then press the
reload arrow on the extension's card in `chrome://extensions`. Your fonts and
per-site settings are kept.

## Uninstalling

`chrome://extensions` → **Remove**. In Firefox it disappears on its own when
you close the browser.

## For anyone reading the code

```
manifest.json         what the browser reads first
src/settings.js       the settings shape, defaults, and the four font sets
src/content.js        injects the CSS into every page, at document_start
src/popup.html/css/js the panel behind the toolbar button
src/fonts.js          the font list, measured against this computer
src/i18n.js           panel translations: en, tg, uz
_locales/*/           extension name and description, per language
test/check.js         checks that run without a browser
package.py            zips the folder for a store upload
```

`node test/check.js` runs twenty checks with no browser involved. `./package.py`
writes `font-picker-<version>.zip` with the manifest at the root, which is the
shape the Chrome, Edge and Firefox stores expect.

To add a language: copy a block in `src/i18n.js`, keep the same keys, add its
code to `langs`, and add `_locales/<code>/messages.json` with `extName` and
`extDesc`. The checks fail if any string is missing anywhere.
