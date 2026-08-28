/* Shared settings shape, defaults and helpers. Loaded by both the popup and
   the content script, so the two can never disagree about what a setting means.

   Stored shape:
     {
       enabled: true,                       // master switch
       preset:  'system',                   // which starter set is selected
       fonts:   { text, headings, code },   // '' means: leave the site alone
       sites:   { 'example.com': { off: true, fonts: {...} } },
       lang:    'auto'                      // popup language; 'auto' follows the browser
     }
*/
const FS = (() => {
  const api = globalThis.browser ?? globalThis.chrome;

  // The starter sets. "Default font set" in the UI is just picking one of these;
  // editing any field afterwards moves the selection to 'custom'.
  const PRESETS = {
    system:  { text: 'system-ui',   headings: '',            code: 'ui-monospace' },
    reading: { text: 'Georgia',     headings: 'Georgia',     code: 'Menlo' },
    modern:  { text: 'Inter',       headings: 'Inter',       code: 'JetBrains Mono' },
    clear:   { text: 'Verdana',     headings: 'Tahoma',      code: 'Consolas' },
  };

  const DEFAULTS = {
    enabled: true,
    preset: 'system',
    fonts: { ...PRESETS.system },
    sites: {},
    lang: 'auto',
  };

  function merge(stored) {
    const s = { ...DEFAULTS, ...(stored || {}) };
    s.fonts = { ...DEFAULTS.fonts, ...(stored?.fonts || {}) };
    s.sites = { ...(stored?.sites || {}) };
    return s;
  }

  async function load() {
    // storage.sync follows the browser profile between machines; if the user
    // has sync turned off it still works, it just stays local.
    try {
      const got = await api.storage.sync.get('settings');
      if (got && got.settings) return merge(got.settings);
    } catch (e) { /* fall through to local */ }
    const got = await api.storage.local.get('settings');
    return merge(got && got.settings);
  }

  async function save(settings) {
    try {
      await api.storage.sync.set({ settings });
    } catch (e) {
      await api.storage.local.set({ settings });
    }
  }

  /* What should actually be applied on this hostname: the site's own fonts if
     it has any, otherwise the defaults -- and nothing at all if either switch
     is off. */
  function effective(settings, host) {
    if (!settings.enabled) return null;
    const site = settings.sites[host];
    if (site && site.off) return null;
    if (site && site.fonts) return { ...settings.fonts, ...site.fonts };
    return settings.fonts;
  }

  // Generic families must stay unquoted or the browser reads them as the name
  // of a font nobody has; anything the user typed with commas is their own
  // stack and goes through untouched.
  const GENERIC = /^(system-ui|ui-monospace|ui-serif|ui-sans-serif|serif|sans-serif|monospace|cursive|fantasy)$/i;

  function quote(name) {
    if (GENERIC.test(name)) return name;
    if (name.includes(',')) return name;
    return `"${name.replace(/"/g, '')}"`;
  }

  const stack = (name, fallback) => `${quote(name)}, ${fallback}`;

  return { api, PRESETS, DEFAULTS, GENERIC, merge, load, save, effective, quote, stack };
})();

if (typeof module !== 'undefined') module.exports = FS;
