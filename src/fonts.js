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
