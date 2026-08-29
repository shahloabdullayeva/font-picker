/* Applies the chosen fonts to the page.

   Runs at document_start, before the site has painted, so text does not flash
   in the site's own font first. The rules go into one <style> element that is
   rewritten whenever the settings change -- no page reload needed.
*/
(() => {
  const STYLE_ID = 'font-picker-style';

  /* Elements that must keep the site's own font. Icon fonts draw their glyphs
     from private code points, so forcing a text font onto them turns every
     icon into a box or a stray letter. There is no reliable way to ask "is
     this an icon font", so go by the naming every icon library uses. */
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
      // :where() keeps the exclusion list at zero specificity, so the more
      // specific rules below (headings, code) can still win.
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

  /* Per-site settings belong to the page the reader is looking at, not to the
     ad frame inside it -- so a frame asks the top document for its hostname and
     only falls back to its own when the browser refuses (cross-origin). */
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
      // documentElement exists at document_start; <head> does not yet.
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

  // Some sites rebuild <head> as they boot and take our style with it.
  document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById(STYLE_ID)) refresh();
  });

  FS.api.storage.onChanged.addListener((changes, area) => {
    if (changes.settings && (area === 'sync' || area === 'local')) refresh();
  });
})();
