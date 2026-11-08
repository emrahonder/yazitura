(function () {
  const IMAGES = {
    head: 'images/head.jpg',
    tail: 'images/tail.jpg'
  };
  const FLIP_MS = 900;
  const LANG_KEY = 'yazitura-lang';
  const STORAGE_KEY = 'yazitura-history';
  const MAX_ENTRIES = 200;

  const timesSelect = document.getElementById('times');
  const form = document.getElementById('controls');
  const button = document.getElementById('throw-btn');
  const coin = document.getElementById('coin');
  const coinImg = document.getElementById('coin-img');
  const resultEl = document.getElementById('result');
  const historyList = document.getElementById('history-list');
  const clearBtn = document.getElementById('clear-btn');
  const langButtons = document.querySelectorAll('.lang-btn');

  // ---- Language ----
  function detectLang() {
    try {
      const saved = localStorage.getItem(LANG_KEY);
      if (saved && STRINGS[saved]) return saved;
    } catch (e) { /* ignore */ }
    return (navigator.language || 'en').toLowerCase().startsWith('tr') ? 'tr' : 'en';
  }

  let lang = detectLang();
  let lastResult = null; // { heads, tails, count } of the last toss shown
  let currentSide = 'head';

  function t(key) {
    return STRINGS[lang][key];
  }

  function applyLang() {
    document.documentElement.lang = lang;
    document.title = t('pageTitle');
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      el.textContent = t(el.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      el.setAttribute('aria-label', t(el.dataset.i18nAria));
    });
    langButtons.forEach(function (b) {
      const active = b.dataset.lang === lang;
      b.classList.toggle('active', active);
      b.setAttribute('aria-pressed', String(active));
    });
    coinImg.alt = t(currentSide);
    renderResult();
    renderHistory();
  }

  langButtons.forEach(function (b) {
    b.addEventListener('click', function () {
      lang = b.dataset.lang;
      try { localStorage.setItem(LANG_KEY, lang); } catch (e) { /* ignore */ }
      applyLang();
    });
  });

  // ---- Coin ----
  for (let i = 1; i <= 99; i += 2) {
    timesSelect.add(new Option(i, i));
  }

  // Fair coin flip from the browser's cryptographically secure RNG.
  // Uses one random bit, so there is no modulo bias.
  function secureFlip() {
    const buf = new Uint8Array(1);
    crypto.getRandomValues(buf);
    return buf[0] & 1;
  }

  function play(count) {
    let heads = 0;
    let tails = 0;
    for (let i = 0; i < count; i++) {
      if (secureFlip()) heads++; else tails++;
    }
    return { heads, tails, count };
  }

  function showFace(side) {
    currentSide = side;
    coinImg.src = IMAGES[side];
    coinImg.alt = t(side);
  }

  function renderResult() {
    resultEl.textContent = '';
    if (!lastResult) {
      resultEl.textContent = t('ready');
      return;
    }
    const { heads, tails, count } = lastResult;
    const side = heads > tails ? 'head' : 'tail';

    const strong = document.createElement('span');
    strong.className = 'winner';
    strong.textContent = t(side);
    resultEl.append(strong, ' ' + t('wins'));

    if (count > 1) {
      const score = document.createElement('span');
      score.className = 'score';
      score.textContent = `(${Math.max(heads, tails)} - ${Math.min(heads, tails)})`;
      resultEl.append(score);
    }
  }

  // ---- History (localStorage) ----
  function loadHistory() {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Array.isArray(data) ? data : [];
    } catch (e) {
      return [];
    }
  }

  function saveHistory(entries) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (e) { /* storage full or disabled: ignore */ }
  }

  function renderHistory() {
    const entries = loadHistory();
    const dateFormat = new Intl.DateTimeFormat(t('locale'), {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
    historyList.textContent = '';
    if (!entries.length) {
      const li = document.createElement('li');
      li.className = 'empty';
      li.textContent = t('empty');
      historyList.append(li);
      return;
    }
    for (const entry of entries) {
      const li = document.createElement('li');
      const text = document.createElement('span');
      text.className = 'entry-main';
      const headsWon = entry.heads > entry.tails;

      const badge = document.createElement('span');
      badge.className = 'badge ' + (headsWon ? 'badge-head' : 'badge-tail');
      badge.textContent = t(headsWon ? 'head' : 'tail');
      text.append(badge);

      if (entry.count > 1) {
        const detail = document.createElement('span');
        detail.className = 'entry-detail';
        detail.textContent = `${Math.max(entry.heads, entry.tails)} - ${Math.min(entry.heads, entry.tails)} · ${entry.count} ${t('throwsUnit')}`;
        text.append(detail);
      }
      const time = document.createElement('time');
      time.dateTime = new Date(entry.ts).toISOString();
      time.textContent = dateFormat.format(new Date(entry.ts));
      li.append(text, time);
      historyList.append(li);
    }
  }

  function addHistory(outcome) {
    const entries = loadHistory();
    entries.unshift({ ts: Date.now(), count: outcome.count, heads: outcome.heads, tails: outcome.tails });
    saveHistory(entries.slice(0, MAX_ENTRIES));
    renderHistory();
  }

  clearBtn.addEventListener('click', function () {
    saveHistory([]);
    renderHistory();
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const outcome = play(parseInt(timesSelect.value, 10));

    button.disabled = true;
    coin.classList.remove('flipping');
    void coin.offsetWidth; // restart animation
    coin.classList.add('flipping');

    setTimeout(function () {
      lastResult = outcome;
      showFace(outcome.heads > outcome.tails ? 'head' : 'tail');
      renderResult();
      addHistory(outcome);
      coin.classList.remove('flipping');
      button.disabled = false;
    }, FLIP_MS);
  });

  applyLang();
})();
