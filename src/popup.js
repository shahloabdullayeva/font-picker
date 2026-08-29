(async () => {
  const api = FS.api;
  const $ = (id) => document.getElementById(id);
  const FIELDS = ['text', 'headings', 'code'];

  let settings = await FS.load();
  let lang = I18N.resolve(settings.lang);
  let host = null;

  try {
    const [tab] = await api.tabs.query({ active: true, currentWindow: true });
    if (tab && /^https?:/.test(tab.url || '')) host = new URL(tab.url).hostname;
  } catch (e) {}

  const siteScope = () => host && $('scope').value === 'site';

  function currentFonts() {
    if (siteScope()) {
      const site = settings.sites[host];
      return { ...settings.fonts, ...((site && site.fonts) || {}) };
    }
    return settings.fonts;
  }

  function paintText() {
    const t = (k, v) => I18N.t(lang, k, v);
    for (const el of document.querySelectorAll('[data-t]')) {
      el.textContent = t(el.dataset.t);
    }
    $('scope').options[0].textContent = t('allSites');
    $('scope').options[1].textContent = host || '—';
    $('scope').options[1].disabled = !host;
    for (const [i, key] of ['p_system', 'p_reading', 'p_modern', 'p_clear', 'p_custom'].entries()) {
      $('preset').options[i].textContent = t(key);
    }
    $('scopeNote').textContent = siteScope()
      ? t('scopeSite', { site: host })
      : t('scopeAll');
    $('preview').textContent = t('preview');
    $('lang').title = t('language');
    const autoOpt = [...$('lang').options].find((o) => o.value === 'auto');
    if (autoOpt) autoOpt.textContent = t('auto');
  }

  function paintValues() {
    const fonts = currentFonts();
    $('enabled').checked = settings.enabled;
    $('preset').value = settings.preset;
    $('lang').value = settings.lang || 'auto';
    $('offHere').checked = Boolean(host && settings.sites[host] && settings.sites[host].off);
    $('offHere').disabled = !host;
    for (const f of FIELDS) {
      $(`f-${f}`).value = fonts[f] || '';
      const missing = fonts[f] && !FONTS.installed(fonts[f]);
      $(`w-${f}`).hidden = !missing;
      $(`w-${f}`).textContent = missing ? `“${fonts[f]}” — ${I18N.t(lang, 'missing')}` : '';
    }
    $('preview').style.fontFamily = fonts.text ? FS.stack(fonts.text, 'sans-serif') : '';
    document.body.style.opacity = settings.enabled ? '1' : '0.55';
  }

  async function commit() {
    await FS.save(settings);
    paintValues();
  }

  function setFonts(next) {
    if (siteScope()) {
      const site = settings.sites[host] || {};
      settings.sites[host] = { ...site, fonts: { ...((site.fonts) || {}), ...next } };
    } else {
      settings.fonts = { ...settings.fonts, ...next };
    }
  }

  for (const [code, label] of I18N.langs) {
    const opt = document.createElement('option');
    opt.value = code;
    opt.textContent = label;
    $('lang').append(opt);
  }

  const list = $('fontlist');
  for (const { name, installed } of FONTS.available()) {
    const opt = document.createElement('option');
    opt.value = name;
    if (!installed) opt.label = `${name} — ${I18N.t(lang, 'missing')}`;
    list.append(opt);
  }

  $('lang').addEventListener('change', async () => {
    settings.lang = $('lang').value;
    lang = I18N.resolve(settings.lang);
    await commit();
    paintText();
  });

  $('enabled').addEventListener('change', async () => {
    settings.enabled = $('enabled').checked;
    await commit();
  });

  $('scope').addEventListener('change', () => {
    paintText();
    paintValues();
  });

  $('preset').addEventListener('change', async () => {
    const preset = $('preset').value;
    if (preset !== 'custom') {
      setFonts(FS.PRESETS[preset]);
      if (!siteScope()) settings.preset = preset;
    }
    await commit();
  });

  for (const f of FIELDS) {
    $(`f-${f}`).addEventListener('change', async () => {
      setFonts({ [f]: $(`f-${f}`).value.trim() });
      if (!siteScope()) settings.preset = 'custom';
      $('preset').value = settings.preset;
      await commit();
    });
  }

  $('offHere').addEventListener('change', async () => {
    if (!host) return;
    const site = settings.sites[host] || {};
    if ($('offHere').checked) {
      settings.sites[host] = { ...site, off: true };
    } else {
      delete site.off;
      if (Object.keys(site).length) settings.sites[host] = site;
      else delete settings.sites[host];
    }
    await commit();
  });

  $('reset').addEventListener('click', async () => {
    const keep = settings.lang;
    settings = FS.merge({ lang: keep });
    await commit();
    paintText();
  });

  paintText();
  paintValues();
})();
