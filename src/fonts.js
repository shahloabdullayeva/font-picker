/* The font list the popup offers.

   No browser will hand an extension the real list of installed fonts in a way
   that works everywhere (chrome.fontSettings is Chrome/Edge only, and the
   Local Font Access API needs a permission prompt), so this is a curated list
   measured against the machine: draw a test string in the candidate font and
   see whether its width differs from the generic fallback. If it does, the
   font exists here. The user can always type a name that is not on the list.
*/
const FONTS = {
  groups: [
    ['sans', ['system-ui', 'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial',
              'Open Sans', 'Lato', 'Noto Sans', 'Source Sans Pro', 'Fira Sans',
              'PT Sans', 'Ubuntu', 'Verdana', 'Tahoma', 'Trebuchet MS',
              'Atkinson Hyperlegible', 'OpenDyslexic']],
    ['serif', ['Georgia', 'Times New Roman', 'Cambria', 'Charter', 'Palatino Linotype',
               'Book Antiqua', 'Garamond', 'Baskerville', 'Merriweather',
               'Noto Serif', 'PT Serif', 'Source Serif Pro', 'Literata']],
    ['mono', ['ui-monospace', 'JetBrains Mono', 'Cascadia Code', 'Fira Code',
              'Source Code Pro', 'IBM Plex Mono', 'Consolas', 'Menlo', 'Monaco',
              'SF Mono', 'DejaVu Sans Mono', 'Ubuntu Mono', 'Courier New']],
    ['other', ['Comic Sans MS', 'Impact', 'Futura', 'Optima', 'Rockwell']],
  ],

  installed(name) {
    // Generic names always resolve to something, so never mark them missing.
    if (FS.GENERIC.test(name)) return true;
    const probe = 'mmmmmmmmmmlliWWWQ@#';
    const ctx = document.createElement('canvas').getContext('2d');
    return ['monospace', 'serif', 'sans-serif'].some((base) => {
      ctx.font = `72px ${base}`;
      const plain = ctx.measureText(probe).width;
      ctx.font = `72px "${name}", ${base}`;
      return ctx.measureText(probe).width !== plain;
    });
  },

  all() {
    return this.groups.flatMap(([, names]) => names);
  },

  /* Everything the list knows about, each marked present or not, installed
     ones first so the useful half of the list is at the top. */
  available() {
    const seen = new Set();
    const out = [];
    for (const name of this.all()) {
      if (seen.has(name)) continue;
      seen.add(name);
      out.push({ name, installed: this.installed(name) });
    }
    return out.sort((a, b) => Number(b.installed) - Number(a.installed));
  },
};
