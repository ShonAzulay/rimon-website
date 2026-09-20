/* ============================================================
   רימון יזמות ובנייה – מודול הסכמה לעוגיות + נגישות
   קובץ אחד שמחליף את כל הבלוקים הכפולים בכל הדפים.
   ============================================================ */
(function () {
  'use strict';

  var CONSENT_KEY = 'rimonCookieConsent';
  var A11Y_KEY = 'rimonA11y';

  /* ---------- CSS ---------- */
  var css = ''
  /* דילוג לתוכן */
  + '.skip-link{position:absolute;right:-9999px;top:0;z-index:4000;background:#0d1f33;color:#fff;padding:.8rem 1.4rem;font-family:inherit;font-size:.95rem;font-weight:700;border-radius:0 0 8px 8px;text-decoration:none}'
  + '.skip-link:focus{right:1rem}'
  /* מסגרת מיקוד גלויה לכל רכיב אינטראקטיבי */
  + 'a:focus-visible,button:focus-visible,input:focus-visible,textarea:focus-visible,select:focus-visible,[tabindex]:focus-visible{outline:3px solid #0d1f33;outline-offset:3px;border-radius:4px}'
  /* באנר עוגיות */
  + '.cookie-banner{position:fixed;bottom:0;right:0;left:0;background:#0d1f33;color:#fff;padding:1.1rem 6vw;display:flex;align-items:center;justify-content:space-between;gap:1.5rem;flex-wrap:wrap;z-index:2000;transform:translateY(110%);transition:transform .45s ease;box-shadow:0 -4px 20px rgba(0,0,0,.25)}'
  + '.cookie-banner.show{transform:translateY(0)}'
  + '.cookie-text{flex:1;min-width:250px}'
  + '.cookie-text strong{display:block;margin-bottom:.3rem;font-size:1rem}'
  + '.cookie-text p{margin:0;font-size:.85rem;color:rgba(255,255,255,.82);line-height:1.65}'
  + '.cookie-text a{color:#f0d894;text-decoration:underline}'
  + '.cookie-actions{display:flex;gap:.7rem;flex-shrink:0}'
  + '.cookie-decline,.cookie-accept{padding:.7rem 1.5rem;border-radius:6px;font-family:inherit;font-size:.9rem;font-weight:700;cursor:pointer;border:none}'
  + '.cookie-decline{background:transparent;border:1px solid rgba(255,255,255,.45);color:#fff}'
  + '.cookie-decline:hover{background:rgba(255,255,255,.12)}'
  + '.cookie-accept{background:#c9a84c;color:#0d1f33}'
  + '.cookie-accept:hover{background:#dbbb63}'
  + '@media(max-width:640px){.cookie-banner{flex-direction:column;align-items:stretch;text-align:center;padding:1rem 1.2rem}.cookie-actions{justify-content:center}.cookie-decline,.cookie-accept{flex:1}}'
  /* תוכן חסום עד הסכמה */
  + '.consent-embed{position:relative;width:100%;aspect-ratio:16/9;background:#12283f;border-radius:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1rem;padding:1.5rem;text-align:center;color:#fff}'
  + '.consent-embed p{margin:0;font-size:.95rem;line-height:1.7;max-width:46ch;color:rgba(255,255,255,.85)}'
  + '.consent-embed button{background:#c9a84c;color:#0d1f33;border:none;padding:.75rem 1.7rem;border-radius:6px;font-family:inherit;font-weight:700;font-size:.95rem;cursor:pointer}'
  + '.consent-embed iframe{position:absolute;inset:0;width:100%;height:100%;border:0;border-radius:10px}'
  /* כפתור נגישות – גדול וברור */
  + '#a11yBtn{position:fixed;bottom:22px;left:22px;z-index:2100;width:62px;height:62px;border-radius:50%;background:#0d1f33;color:#fff;border:3px solid #fff;box-shadow:0 4px 18px rgba(0,0,0,.35);cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;transition:bottom .45s ease,transform .2s ease}'
  + '#a11yBtn:hover{transform:scale(1.07)}'
  + '#a11yBtn svg{width:36px;height:36px;fill:#fff}'
  + 'body.cookie-open #a11yBtn{bottom:calc(22px + var(--cookieH,120px))}'
  + '@media(max-width:640px){#a11yBtn{width:56px;height:56px;bottom:16px;left:16px}#a11yBtn svg{width:32px;height:32px}}'
  /* פאנל נגישות */
  + '#a11yPanel{position:fixed;bottom:96px;left:22px;z-index:2100;width:272px;max-width:calc(100vw - 32px);background:#fff;border:2px solid #0d1f33;border-radius:12px;box-shadow:0 10px 40px rgba(0,0,0,.3);padding:1rem;display:none;transition:bottom .45s ease}'
  + '#a11yPanel.open{display:block}'
  + 'body.cookie-open #a11yPanel{bottom:calc(96px + var(--cookieH,120px))}'
  + '#a11yPanel h4{margin:0 0 .7rem;font-size:1.05rem;color:#0d1f33}'
  + '#a11yPanel .a11y-opt{display:block;width:100%;text-align:right;background:#f4f6f8;border:1px solid #d8dee5;color:#12283f;border-radius:7px;padding:.6rem .8rem;margin-bottom:.45rem;font-family:inherit;font-size:.92rem;font-weight:500;cursor:pointer}'
  + '#a11yPanel .a11y-opt:hover{background:#e7ecf1}'
  + '#a11yPanel .a11y-opt[aria-pressed="true"]{background:#0d1f33;color:#fff;border-color:#0d1f33}'
  + '#a11yPanel .a11y-reset{background:#fff;border:1px solid #0d1f33;font-weight:700}'
  + '#a11yPanel .a11y-note{margin:.6rem 0 0;font-size:.78rem;line-height:1.6;color:#54616e}'
  + '#a11yPanel .a11y-note a{color:#0d1f33}'
  /* מצבי נגישות */
  + 'html.a11y-gray{filter:grayscale(1)}'
  + 'html.a11y-contrast{filter:contrast(1.45)}'
  + 'html.a11y-gray.a11y-contrast{filter:grayscale(1) contrast(1.45)}'
  + 'html.a11y-links a{text-decoration:underline!important;font-weight:700!important}'
  + 'html.a11y-nomotion *,html.a11y-nomotion *::before,html.a11y-nomotion *::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}'
  /* התאמת כרטיסים ותמונות לניווט מקלדת */
  + '[data-kbd]{cursor:pointer}'
  + '[data-kbd]:focus-visible{outline:3px solid #0d1f33;outline-offset:4px}';

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  /* ---------- קריאה/כתיבה בטוחה ל-localStorage ---------- */
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  /* ---------- עוגיות ---------- */
  function buildBanner() {
    if (get(CONSENT_KEY)) return;

    var b = document.createElement('div');
    b.className = 'cookie-banner';
    b.id = 'cookieBanner';
    b.setAttribute('role', 'dialog');
    b.setAttribute('aria-live', 'polite');
    b.setAttribute('aria-label', 'הודעה על שימוש בעוגיות');
    b.innerHTML =
      '<div class="cookie-text">' +
        '<strong>שימוש בעוגיות (Cookies)</strong>' +
        '<p>האתר משתמש בעוגיות חיוניות בלבד. תוכן מוטמע של צד שלישי (סרטון YouTube) ייטען רק לאחר אישורכם. ' +
        'פרטים מלאים ב<a href="privacy.html">מדיניות הפרטיות</a> וב<a href="terms.html">תנאי השימוש</a>.</p>' +
      '</div>' +
      '<div class="cookie-actions">' +
        '<button type="button" class="cookie-decline" id="ckNo">דחייה</button>' +
        '<button type="button" class="cookie-accept" id="ckYes">אישור</button>' +
      '</div>';
    document.body.appendChild(b);

    function measure() {
      document.documentElement.style.setProperty('--cookieH', b.offsetHeight + 'px');
    }

    setTimeout(function () {
      b.classList.add('show');
      document.body.classList.add('cookie-open');
      measure();
    }, 900);
    window.addEventListener('resize', measure);

    function choose(ok) {
      set(CONSENT_KEY, ok ? 'accepted' : 'declined');
      b.classList.remove('show');
      document.body.classList.remove('cookie-open');
      if (ok) loadEmbeds();
      var btn = document.getElementById('a11yBtn');
      if (btn) btn.focus();
    }
    document.getElementById('ckYes').onclick = function () { choose(true); };
    document.getElementById('ckNo').onclick = function () { choose(false); };
  }

  /* ---------- תוכן מוטמע בהסכמה ---------- */
  function loadEmbeds() {
    var boxes = document.querySelectorAll('.consent-embed[data-embed-src]');
    for (var i = 0; i < boxes.length; i++) {
      var box = boxes[i];
      var f = document.createElement('iframe');
      f.src = box.getAttribute('data-embed-src');
      f.title = box.getAttribute('data-embed-title') || 'תוכן מוטמע';
      f.setAttribute('allow', 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
      f.setAttribute('allowfullscreen', '');
      box.innerHTML = '';
      box.appendChild(f);
    }
  }

  function initEmbeds() {
    var accepted = get(CONSENT_KEY) === 'accepted';
    if (accepted) { loadEmbeds(); return; }
    var boxes = document.querySelectorAll('.consent-embed[data-embed-src]');
    for (var i = 0; i < boxes.length; i++) {
      (function (box) {
        var btn = box.querySelector('.consent-allow');
        if (btn) btn.onclick = function () {
          set(CONSENT_KEY, 'accepted');
          var banner = document.getElementById('cookieBanner');
          if (banner) { banner.classList.remove('show'); document.body.classList.remove('cookie-open'); }
          loadEmbeds();
        };
      })(boxes[i]);
    }
  }

  /* ---------- נגישות ---------- */
  var prefs = { font: 0, gray: false, contrast: false, links: false, nomotion: false };
  try { prefs = Object.assign(prefs, JSON.parse(get(A11Y_KEY) || '{}')); } catch (e) {}

  function apply() {
    var h = document.documentElement;
    h.style.fontSize = prefs.font ? (100 + prefs.font * 12) + '%' : '';
    h.classList.toggle('a11y-gray', !!prefs.gray);
    h.classList.toggle('a11y-contrast', !!prefs.contrast);
    h.classList.toggle('a11y-links', !!prefs.links);
    h.classList.toggle('a11y-nomotion', !!prefs.nomotion);
    set(A11Y_KEY, JSON.stringify(prefs));
    var p = document.getElementById('a11yPanel');
    if (!p) return;
    p.querySelector('[data-a="gray"]').setAttribute('aria-pressed', !!prefs.gray);
    p.querySelector('[data-a="contrast"]').setAttribute('aria-pressed', !!prefs.contrast);
    p.querySelector('[data-a="links"]').setAttribute('aria-pressed', !!prefs.links);
    p.querySelector('[data-a="nomotion"]').setAttribute('aria-pressed', !!prefs.nomotion);
  }

  function buildA11y() {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'a11yBtn';
    btn.setAttribute('aria-label', 'פתיחת תפריט נגישות');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', 'a11yPanel');
    btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 2a2 2 0 100 4 2 2 0 000-4zm8 5h-5.2l-1.3 1.3a2 2 0 01-3 0L9.2 7H4a1 1 0 100 2h4.5l-1.4 4.2-2 5.5a1 1 0 001.9.7l2-5.4h3.9l2 5.4a1 1 0 001.9-.7l-2-5.5L15.5 9H20a1 1 0 100-2z"/></svg>';

    var panel = document.createElement('div');
    panel.id = 'a11yPanel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'תפריט נגישות');
    panel.innerHTML =
      '<h4>תפריט נגישות</h4>' +
      '<button type="button" class="a11y-opt" data-a="bigger">הגדלת טקסט</button>' +
      '<button type="button" class="a11y-opt" data-a="smaller">הקטנת טקסט</button>' +
      '<button type="button" class="a11y-opt" data-a="contrast" aria-pressed="false">ניגודיות גבוהה</button>' +
      '<button type="button" class="a11y-opt" data-a="gray" aria-pressed="false">גווני אפור</button>' +
      '<button type="button" class="a11y-opt" data-a="links" aria-pressed="false">הדגשת קישורים</button>' +
      '<button type="button" class="a11y-opt" data-a="nomotion" aria-pressed="false">עצירת אנימציות</button>' +
      '<button type="button" class="a11y-opt a11y-reset" data-a="reset">איפוס הגדרות</button>' +
      '<p class="a11y-note"><a href="accessibility.html">הצהרת הנגישות המלאה</a></p>';

    document.body.appendChild(btn);
    document.body.appendChild(panel);

    function toggle(open) {
      panel.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
      if (open) panel.querySelector('.a11y-opt').focus();
    }
    btn.onclick = function () { toggle(!panel.classList.contains('open')); };

    panel.addEventListener('click', function (e) {
      var t = e.target.closest('.a11y-opt');
      if (!t) return;
      var a = t.getAttribute('data-a');
      if (a === 'bigger') prefs.font = Math.min(prefs.font + 1, 3);
      else if (a === 'smaller') prefs.font = Math.max(prefs.font - 1, -1);
      else if (a === 'reset') prefs = { font: 0, gray: false, contrast: false, links: false, nomotion: false };
      else prefs[a] = !prefs[a];
      apply();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel.classList.contains('open')) { toggle(false); btn.focus(); }
    });
    document.addEventListener('click', function (e) {
      if (!panel.classList.contains('open')) return;
      if (!panel.contains(e.target) && !btn.contains(e.target)) toggle(false);
    });

    apply();
  }

  /* ---------- דילוג לתוכן ---------- */
  function buildSkip() {
    var target = document.querySelector('main, .hero, .page-hero, section');
    if (!target) return;
    if (!target.id) target.id = 'mainContent';
    target.setAttribute('tabindex', '-1');
    var a = document.createElement('a');
    a.className = 'skip-link';
    a.href = '#' + target.id;
    a.textContent = 'דילוג לתוכן המרכזי';
    document.body.insertBefore(a, document.body.firstChild);
  }

  /* ---------- הנגשת אלמנטים שנפתחים בלחיצה בלבד ---------- */
  function enhanceClickables() {
    var els = document.querySelectorAll('.pcard, .g-img');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (el.hasAttribute('data-kbd')) continue;
      el.setAttribute('data-kbd', '1');
      el.setAttribute('tabindex', '0');
      el.setAttribute('role', 'button');
      var label = el.querySelector('h3');
      var img = el.querySelector('img');
      el.setAttribute('aria-label',
        label ? ('מעבר לעמוד הפרויקט ' + label.textContent.trim())
              : (img && img.alt ? ('הגדלת התמונה: ' + img.alt) : 'הגדלת תמונה'));
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.click(); }
      });
    }
  }

  /* ---------- הפעלה ---------- */
  function init() {
    buildSkip();
    buildA11y();
    buildBanner();
    initEmbeds();
    enhanceClickables();
    // כרטיסים שנוצרים דינמית
    var mo = new MutationObserver(enhanceClickables);
    mo.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
