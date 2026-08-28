/* Popup translations.

   The browser picks the extension's own name and description from _locales/,
   following the browser's UI language -- and no browser ships a Tajik or Uzbek
   UI, so that alone would leave both readers in English. The popup therefore
   carries its own translations and its own picker; 'auto' follows the browser
   for anyone who does not care.

   To add a language: add a block here with the same keys, add its code to
   LANGS below, and add a _locales/<code>/messages.json for the store listing.
*/
const I18N = {
  langs: [
    ['auto', 'Automatic'],
    ['en', 'English'],
    ['tg', 'Тоҷикӣ'],
    ['uz', 'O‘zbekcha'],
  ],

  en: {
    enabled: 'Font swapping on',
    applyTo: 'Apply to',
    allSites: 'All sites',
    fontSet: 'Font set',
    p_system: 'System default',
    p_reading: 'Reading (serif)',
    p_modern: 'Modern (sans)',
    p_clear: 'High legibility',
    p_custom: 'Custom',
    f_text: 'Text',
    f_headings: 'Headings',
    f_code: 'Code',
    unchanged: 'Leave unchanged',
    offHere: 'Turn off on this site',
    reset: 'Reset to defaults',
    language: 'Language',
    auto: 'Automatic',
    hint: 'Type any font name, or pick one installed here.',
    missing: 'not installed here',
    scopeAll: 'Your defaults, used on every site.',
    scopeSite: 'These fonts apply to {site} only.',
    preview: 'The quick brown fox jumps over the lazy dog',
  },

  tg: {
    enabled: 'Ивази шрифт фаъол аст',
    applyTo: 'Татбиқ ба',
    allSites: 'Ҳамаи сайтҳо',
    fontSet: 'Маҷмӯи шрифтҳо',
    p_system: 'Системавӣ',
    p_reading: 'Барои хониш (серифдор)',
    p_modern: 'Муосир (бе сериф)',
    p_clear: 'Хониши осон',
    p_custom: 'Дилхоҳ',
    f_text: 'Матн',
    f_headings: 'Сарлавҳаҳо',
    f_code: 'Код',
    unchanged: 'Тағйир дода нашавад',
    offHere: 'Дар ин сайт хомӯш кардан',
    reset: 'Ба ҳолати аввала баргардонидан',
    language: 'Забон',
    auto: 'Худкор',
    hint: 'Номи ҳар шрифтро нависед ё аз рӯйхати насбшуда интихоб кунед.',
    missing: 'насб нашудааст',
    scopeAll: 'Танзимоти пешфарз — барои ҳамаи сайтҳо.',
    scopeSite: 'Ин шрифтҳо танҳо барои {site} татбиқ мешаванд.',
    preview: 'Дар шаҳри Душанбе китобфурӯшии нав кушода шуд',
  },

  uz: {
    enabled: 'Shrift almashtirish yoqilgan',
    applyTo: 'Qo‘llash',
    allSites: 'Barcha saytlarga',
    fontSet: 'Shriftlar to‘plami',
    p_system: 'Tizim shrifti',
    p_reading: 'O‘qish uchun (serif)',
    p_modern: 'Zamonaviy (sans)',
    p_clear: 'Yaxshi o‘qiladigan',
    p_custom: 'O‘zim tanlagan',
    f_text: 'Matn',
    f_headings: 'Sarlavhalar',
    f_code: 'Kod',
    unchanged: 'O‘zgartirilmasin',
    offHere: 'Bu saytda o‘chirish',
    reset: 'Standart holatga qaytarish',
    language: 'Til',
    auto: 'Avtomatik',
    hint: 'Istalgan shrift nomini yozing yoki o‘rnatilganidan tanlang.',
    missing: 'o‘rnatilmagan',
    scopeAll: 'Barcha saytlar uchun standart sozlamalar.',
    scopeSite: 'Bu shriftlar faqat {site} uchun qo‘llanadi.',
    preview: 'Toshkent shahrida yangi kitob do‘koni ochildi',
  },

  resolve(choice) {
    if (choice && choice !== 'auto' && this[choice]) return choice;
    const api = globalThis.browser ?? globalThis.chrome;
    const ui = (api.i18n?.getUILanguage?.() || navigator.language || 'en').slice(0, 2);
    return this[ui] ? ui : 'en';
  },

  t(lang, key, vars) {
    let s = (this[lang] || this.en)[key] ?? (this.en[key] ?? key);
    if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, v);
    return s;
  },
};
