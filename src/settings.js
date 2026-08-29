const FS = (() => {
  const api = globalThis.browser ?? globalThis.chrome;

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
    try {
      const got = await api.storage.sync.get('settings');
      if (got && got.settings) return merge(got.settings);
    } catch (e) {}
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

  function effective(settings, host) {
    if (!settings.enabled) return null;
    const site = settings.sites[host];
    if (site && site.off) return null;
    if (site && site.fonts) return { ...settings.fonts, ...site.fonts };
    return settings.fonts;
  }

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
