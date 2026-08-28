/* Checks that can run without a browser: the manifest points at files that
   exist, every popup string is translated into every language, and the content
   script builds the CSS it is supposed to. Run with: node test/check.js
*/
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
let failures = 0;

function check(name, fn) {
  try {
    fn();
    console.log(`  ok    ${name}`);
  } catch (e) {
    failures++;
    console.log(`  FAIL  ${name}\n        ${e.message}`);
  }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

// ---------------------------------------------------------------- manifest
console.log('manifest');
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'manifest.json'), 'utf8'));

check('manifest version 3', () => assert(manifest.manifest_version === 3, 'not MV3'));

check('every file it names exists', () => {
  const files = [
    manifest.action.default_popup,
    ...Object.values(manifest.icons),
    ...Object.values(manifest.action.default_icon),
    ...manifest.content_scripts.flatMap((c) => c.js),
  ];
  for (const f of files) {
    assert(fs.existsSync(path.join(ROOT, f)), `missing ${f}`);
  }
});

check('firefox needs an add-on id', () =>
  assert(manifest.browser_specific_settings?.gecko?.id, 'no gecko id'));

check('asks for no permission it does not use', () => {
  const src = manifest.content_scripts.flatMap((c) => c.js)
    .concat(['src/popup.js'])
    .map((f) => fs.readFileSync(path.join(ROOT, f), 'utf8')).join('\n');
  for (const p of manifest.permissions) {
    const used = p === 'activeTab' ? /tabs\.query/.test(src) : new RegExp(`\\.${p}\\.`).test(src);
    assert(used, `${p} is requested but never used`);
  }
});

// -------------------------------------------------------------------- i18n
console.log('\ntranslations');
// Browsers share one lexical scope across a page's scripts; node's vm gives
// each run its own, so hand the value out explicitly.
const ctx = { console, navigator: { language: 'en' }, chrome: {} };
ctx.globalThis = ctx;
vm.createContext(ctx);
vm.runInContext(
  fs.readFileSync(path.join(ROOT, 'src/i18n.js'), 'utf8') + '\nglobalThis.I18N = I18N;',
  ctx);
const I18N = ctx.I18N;
const CODES = I18N.langs.map(([c]) => c).filter((c) => c !== 'auto');

check(`${CODES.length} languages present`, () =>
  assert(CODES.length === 3, `expected 3, found ${CODES.join(', ')}`));

check('no language is missing a string', () => {
  const keys = Object.keys(I18N.en);
  for (const code of CODES) {
    const missing = keys.filter((k) => !I18N[code][k]);
    assert(!missing.length, `${code} is missing: ${missing.join(', ')}`);
  }
});

check('no language carries a string the others lack', () => {
  const keys = new Set(Object.keys(I18N.en));
  for (const code of CODES) {
    const extra = Object.keys(I18N[code]).filter((k) => !keys.has(k));
    assert(!extra.length, `${code} has untranslatable extras: ${extra.join(', ')}`);
  }
});

check('every string the popup asks for is defined', () => {
  const html = fs.readFileSync(path.join(ROOT, 'src/popup.html'), 'utf8');
  const used = [...html.matchAll(/data-t="([^"]+)"/g)].map((m) => m[1]);
  const fromJs = [...fs.readFileSync(path.join(ROOT, 'src/popup.js'), 'utf8')
    .matchAll(/\bt\('([a-zA-Z_]+)'/g)].map((m) => m[1]);
  for (const key of new Set([...used, ...fromJs])) {
    assert(I18N.en[key], `popup uses "${key}", which no language defines`);
  }
});

check('_locales matches the popup languages', () => {
  for (const code of CODES) {
    const f = path.join(ROOT, '_locales', code, 'messages.json');
    assert(fs.existsSync(f), `no _locales/${code}/messages.json`);
    const m = JSON.parse(fs.readFileSync(f, 'utf8'));
    assert(m.extName?.message && m.extDesc?.message, `${code}: extName/extDesc missing`);
  }
});

// ---------------------------------------------------- the content script CSS
console.log('\nfont rules');

function runContentScript(settings, url = 'https://example.com/page', topUrl = url) {
  const style = { id: '', textContent: '', remove() { this.removed = true; } };
  const listeners = {};
  const sandbox = {
    console,
    URL,
    DOMException: class DOMException extends Error {},
    navigator: { language: 'en' },
    location: new URL(url),
    document: {
      getElementById: (id) => (style.id === id && !style.removed ? style : null),
      createElement: () => style,
      documentElement: { appendChild() {} },
      head: null,
      addEventListener() {},
    },
    // A cross-origin frame cannot read the top document's URL: the getter
    // throws, exactly as the browser does.
    window: {
      top: {
        location: {
          get href() {
            if (topUrl === null) throw new DOMException('cross-origin');
            return topUrl;
          },
        },
      },
    },
    chrome: {
      i18n: { getUILanguage: () => 'en' },
      storage: {
        sync: { get: async () => ({ settings }) },
        local: { get: async () => ({ settings }), set: async () => {} },
        onChanged: { addListener: (fn) => { listeners.changed = fn; } },
      },
    },
  };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  // One script, the way the browser loads a content script's files: they share
  // a scope, so content.js can see the FS that settings.js declared.
  vm.runInContext([
    fs.readFileSync(path.join(ROOT, 'src/settings.js'), 'utf8'),
    fs.readFileSync(path.join(ROOT, 'src/content.js'), 'utf8'),
  ].join('\n'), sandbox);
  return new Promise((res) => setImmediate(() => res(style)));
}

const base = {
  enabled: true,
  preset: 'custom',
  fonts: { text: 'Inter', headings: 'Georgia', code: 'Fira Code' },
  sites: {},
};

(async () => {
  const on = await runContentScript(base);
  check('applies the chosen text font', () =>
    assert(on.textContent.includes('"Inter", sans-serif'), on.textContent));
  check('headings and code get their own rule', () => {
    assert(/h1, h2, h3, h4, h5, h6 \{ font-family: "Georgia"/.test(on.textContent), 'no heading rule');
    assert(/code, pre, kbd[^\n]*"Fira Code"/.test(on.textContent), 'no code rule');
  });
  check('icon elements are left alone', () =>
    assert(on.textContent.includes(':not([class*="icon" i])'), 'icons not excluded'));
  check('the exclusion list stays at zero specificity', () =>
    assert(/\*:where\(:not/.test(on.textContent),
      'exclusions must sit inside :where() or the heading rule loses'));
  check('form controls are included', () =>
    assert(/input, textarea, select, button/.test(on.textContent), 'form controls skipped'));

  const generic = await runContentScript({ ...base, fonts: { text: 'system-ui', headings: '', code: '' } });
  check('generic families are not quoted', () =>
    assert(generic.textContent.includes('system-ui, sans-serif')
      && !generic.textContent.includes('"system-ui"'), generic.textContent));
  check('an empty field leaves that part of the page alone', () =>
    assert(!/h1, h2/.test(generic.textContent), 'wrote a heading rule for an empty setting'));

  const off = await runContentScript({ ...base, enabled: false });
  check('master switch off writes nothing', () =>
    assert(!off.textContent, off.textContent));

  const siteOff = await runContentScript({ ...base, sites: { 'example.com': { off: true } } });
  check('a site turned off writes nothing', () =>
    assert(!siteOff.textContent, siteOff.textContent));

  const siteFont = await runContentScript({
    ...base, sites: { 'example.com': { fonts: { text: 'Verdana' } } },
  });
  check('per-site font beats the default', () =>
    assert(siteFont.textContent.includes('"Verdana"'), siteFont.textContent));
  check('per-site override keeps the other defaults', () =>
    assert(siteFont.textContent.includes('"Georgia"'), 'headings default was lost'));

  const framed = await runContentScript(
    { ...base, sites: { 'example.com': { off: true } } },
    'https://widget.example.com/frame', 'https://example.com/page');
  check('a frame follows the page it sits in', () =>
    assert(!framed.textContent, 'frame ignored the top document site rule'));

  const walled = await runContentScript(
    { ...base, sites: { 'ads.example.net': { off: true } } },
    'https://ads.example.net/frame', null);
  check('a cross-origin frame falls back to its own site', () =>
    assert(!walled.textContent, 'frame did not fall back when top was unreadable'));

  console.log(failures ? `\n${failures} failure(s)` : '\nall checks passed');
  process.exit(failures ? 1 : 0);
})();
