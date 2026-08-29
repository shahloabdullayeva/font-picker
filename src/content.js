(() => {
  const STYLE_ID = 'font-picker-style';

  const KEEP = [
    '[class*="icon" i]', '[class*="fa-" i]', '[class*="glyphicon" i]',
    '[class*="material" i]', '[class*="symbol" i]', '[class*="emoji" i]',
    'i[class]',
  ].map((s) => `:not(${s})`).join('');

  const CODE = 'code, pre, kbd, samp, tt, [class*="code" i], [class*="highlight" i]';

  const stack = FS.stack;

  function css(fonts) {
    const out = [];
    if (fonts.text) {
      out.push(`*:where(${KEEP}) { font-family: ${stack(fonts.text, 'sans-serif')} !important; }`);
      out.push(`input, textarea, select, button { font-family: ${stack(fonts.text, 'sans-serif')} !important; }`);
    }
    if (fonts.headings) {
      out.push(`h1, h2, h3, h4, h5, h6 { font-family: ${stack(fonts.headings, 'sans-serif')} !important; }`);
    }
    if (fonts.code) {
      out.push(`${CODE} { font-family: ${stack(fonts.code, 'monospace')} !important; }`);
    }
    return out.join('\n');
  }

  function host() {
    try {
      return new URL(window.top.location.href).hostname;
    } catch (e) {
      return location.hostname;
    }
  }

  function apply(text) {
    let el = document.getElementById(STYLE_ID);
    if (!text) {
      if (el) el.remove();
      return;
    }
    if (!el) {
      el = document.createElement('style');
      el.id = STYLE_ID;
      (document.head || document.documentElement).appendChild(el);
    }
    el.textContent = text;
  }

  async function refresh() {
    const settings = await FS.load();
    const fonts = FS.effective(settings, host());
    apply(fonts ? css(fonts) : '');
  }

  refresh();

  document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById(STYLE_ID)) refresh();
  });

  FS.api.storage.onChanged.addListener((changes, area) => {
    if (changes.settings && (area === 'sync' || area === 'local')) refresh();
  });
})();
