# Yazı Tura At / Flip a Coin

[Türkçe](#türkçe) · [English](#english)

---

## Türkçe

İnternette çok sayıda yazı tura projesi var. Bu site onlardan biri olmak için değil, kendim için yapıldı: çok basit olsun ve **daha önce attıklarımı hatırlayabileyim** istedim.

### Özellikler

- Tek, üç, beş… 99'a kadar tek sayıda atış. Tek sayı seçildiği için beraberlik olmaz.
- Her atış tarih ve saat damgasıyla tarayıcıda (`localStorage`) saklanır ve listelenir. Kazanan rozetle gösterilir.
- Atışlar tarayıcının güvenli rastgele sayı üretecini (`crypto.getRandomValues`) kullanır.
- Türkçe ve İngilizce arayüz (TR / EN).
- Yazı turanın neden atıldığı, kısa tarihçesi ve neden yalnızca tek sayılar seçilebildiği sayfada anlatılır.
- Sunucu, hesap ya da bağımlılık yok. Veriler yalnızca kendi tarayıcında kalır.

### Çalıştırma

Derleme gerekmez. `index.html` dosyasını tarayıcıda aç. İstersen GitHub Pages ile de yayınlayabilirsin.

### Yapı

```
index.html      sayfa
css/style.css   tasarım
js/app.js       atış, geçmiş ve dil mantığı
js/i18n.js      Türkçe ve İngilizce metinler
images/         para görselleri
```

### Not

Geçmiş yalnızca bu tarayıcıda ve bu cihazda saklanır. Tarayıcı verilerini silersen ya da başka bir cihaza geçersen kayıtlar görünmez. Bu sitenin verdiği kararlardan site sorumlu değildir.

---

## English

There are plenty of coin flip projects online. This one was not built to compete with them. I made it for myself: I wanted something very simple that lets me **remember the tosses I made before**.

### Features

- 1, 3, 5… up to 99 tosses, odd numbers only. An odd count means a tie is impossible.
- Every toss is stored in the browser (`localStorage`) with a date and time stamp and shown in a list. The winner is highlighted with a badge.
- Tosses use the browser's secure random number generator (`crypto.getRandomValues`).
- Turkish and English interface (TR / EN).
- The page explains why people flip coins, a short history, and why only odd numbers can be chosen.
- No server, accounts or dependencies. Your data stays in your own browser.

### Running it

No build step. Open `index.html` in a browser. You can also publish it with GitHub Pages.

### Structure

```
index.html      page
css/style.css   styling
js/app.js       toss, history and language logic
js/i18n.js      Turkish and English texts
images/         coin images
```

### Note

History is stored only in this browser on this device. If you clear browser data or switch devices, the records will not appear. This site is not responsible for any decision you make with it.
