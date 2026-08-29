# Submitting Font Picker to addons.mozilla.org

Upload `font-picker-1.0.0.zip`, built by `./package.py`. The manifest sits at
the root of that zip, which is the shape AMO expects. This folder is not
included in it.

## Steps

1. Sign in at [addons.mozilla.org](https://addons.mozilla.org/) with a Mozilla
   account (free, no fee at any point).
2. [Submit a New Add-on](https://addons.mozilla.org/developers/addon/submit/distribution).
3. Choose **On this site**. That is the listed option — it puts Font Picker in
   the AMO search and in the browser's own "Find more add-ons". The other
   option, *On your own*, only signs a file for private installs and stays out
   of search.
4. Upload the zip. The validator runs on the spot; it may warn but should not
   fail.
5. Compatible applications: **Firefox** only. The panel is 320px and built for
   a desktop toolbar, so leave Firefox for Android unticked.
6. Fill in the listing from the text below.
7. Submit. A listed add-on is signed straight away and reviewed after; once it
   passes, it installs permanently and survives closing Firefox — which the
   temporary add-on in `about:debugging` does not.

A version number can never be reused. Anything after this goes out as 1.0.1,
set in `manifest.json`.

## Listing fields

**Name:** Font Picker

**Category:** Appearance

**Support site:** https://github.com/shahloabdullayeva/font-picker/issues

**Homepage:** https://github.com/shahloabdullayeva/font-picker

**License:** MIT is the usual choice for a repo like this and lets anyone reuse
it. AMO also offers *All Rights Reserved* if you would rather it not be reused.
Nothing has to be added to the repo either way — it is a dropdown.

**Screenshots:** at least one. Open the panel on a real page in Firefox and
capture it; the panel with a site behind it reads better than the panel alone.

### Summary

English (250 characters allowed):

> Read any website in a font you choose. Set your fonts once for every site, or
> pick different fonts for a single site. Four ready sets, or any font installed
> on your computer. Nothing is collected and nothing is sent anywhere.

Тоҷикӣ:

> Ҳар сайтро бо шрифти дилхоҳатон хонед. Шрифтҳоро як бор барои ҳамаи сайтҳо
> танзим кунед ё барои сайти алоҳида дигарашро интихоб кунед. Чор маҷмӯи тайёр
> ё ҳар шрифти дар компютери шумо насбшуда.

O‘zbekcha:

> Istalgan saytni o‘zingiz tanlagan shriftda o‘qing. Shriftlarni bir marta
> barcha saytlar uchun belgilang yoki alohida sayt uchun boshqasini tanlang.
> To‘rtta tayyor to‘plam yoki kompyuteringizdagi istalgan shrift.

### Description

English:

> Font Picker changes the font on any website.
>
> Choose fonts for text, headings and code once, and every page you open uses
> them. When one site needs something else — or falls apart in your font — give
> that site its own fonts, or switch the extension off there and leave the rest
> alone.
>
> • Four ready sets: System, Reading (serif), Modern (sans) and High legibility
> • Or type the name of any font installed on your computer; the list marks the
>   ones you actually have
> • Fonts for a single site, and an off switch for a single site
> • Changes reach open tabs immediately — nothing to save, nothing to reload
> • Panel in English, Tajik and Uzbek
> • Icons are left alone on purpose, so they never turn into empty boxes
>
> Font Picker collects nothing, sends nothing anywhere, and has no account.
> Your settings stay in your browser.

Тоҷикӣ:

> Font Picker шрифти ҳар сайтро иваз мекунад.
>
> Шрифтҳоро барои матн, сарлавҳаҳо ва код як бор интихоб кунед — ҳар саҳифае, ки
> мекушоед, ҳамонҳоро истифода мебарад. Агар сайте шрифти дигарро талаб кунад,
> ба он сайт шрифти алоҳида диҳед ё танҳо дар ҳамон сайт хомӯш кунед.
>
> • Чор маҷмӯи тайёр: Системавӣ, Барои хониш (серифдор), Муосир (бе сериф),
>   Хониши осон
> • Ё номи ҳар шрифти насбшударо нависед; рӯйхат нишон медиҳад, ки кадомаш дар
>   компютери шумо ҳаст
> • Шрифт барои сайти алоҳида ва хомӯшкунӣ барои сайти алоҳида
> • Тағйирот фавран дар ҳамаи ҷадвалҳои кушода татбиқ мешавад
> • Панел бо забонҳои англисӣ, тоҷикӣ ва ӯзбекӣ
> • Нишонаҳо (icon) дасткорӣ намешаванд, то ба чоркунҷаҳои холӣ табдил наёбанд
>
> Font Picker ҳеҷ маълумотро ҷамъ намекунад ва ба ҷое намефиристад. Танзимоти
> шумо дар браузери худатон мемонад.

O‘zbekcha:

> Font Picker istalgan saytning shriftini o‘zgartiradi.
>
> Matn, sarlavhalar va kod uchun shriftlarni bir marta tanlang — ochgan har bir
> sahifangiz o‘shalarni ishlatadi. Biror sayt boshqacha shrift talab qilsa, o‘sha
> saytga alohida shrift bering yoki faqat o‘sha yerda o‘chirib qo‘ying.
>
> • To‘rtta tayyor to‘plam: Tizim, O‘qish uchun (serif), Zamonaviy (sans),
>   Yaxshi o‘qiladigan
> • Yoki o‘rnatilgan istalgan shrift nomini yozing; ro‘yxat qaysi biri
>   kompyuteringizda borligini ko‘rsatadi
> • Alohida sayt uchun shrift va alohida sayt uchun o‘chirish
> • O‘zgarishlar ochiq varaqlarga darhol yetadi — saqlash ham, qayta yuklash ham
>   shart emas
> • Panel ingliz, tojik va o‘zbek tillarida
> • Belgilar (icon) ataylab tegilmaydi, shuning uchun ular bo‘sh kvadratga
>   aylanmaydi
>
> Font Picker hech qanday ma'lumot yig‘maydi va hech qayerga yubormaydi.
> Sozlamalaringiz brauzeringizda qoladi.

## Data collection

Answer **no** to every collection question, and no privacy policy is required.
Nothing leaves the browser: the settings live in `storage.sync`, which is
Firefox's own sync, and there is no server, no analytics and no network request
anywhere in the code.

## If a reviewer asks about permissions

- **storage** — saves the chosen fonts and the per-site list. Nothing else is
  written.
- **activeTab** — the panel reads the hostname of the tab that is open, so it
  can offer "fonts for this site". No page content is read.
- **content script on `<all_urls>`** — the extension's whole purpose is to
  restyle whichever site you are on. It writes one `<style>` element and reads
  nothing from the page. No `host_permissions` are requested on top.

The source is not minified or generated, so no source upload is needed.
