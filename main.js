(function () {
  'use strict';

  var C = typeof window !== 'undefined' && window.__SITE__ ? window.__SITE__ : {};
  var WA = C.whatsappUrl || 'https://wa.me/923309089380';

  /* Hero: word-by-word headline (premium entrance) */
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var heroHeading = document.getElementById('hero-heading');
    if (heroHeading && !heroHeading.classList.contains('hero-h1--split')) {
      var headingText = heroHeading.textContent.trim();
      var words = headingText.split(/\s+/).filter(Boolean);
      if (words.length) {
        heroHeading.textContent = '';
        for (var wi = 0; wi < words.length; wi++) {
          var wSpan = document.createElement('span');
          wSpan.className = 'h1-word';
          wSpan.style.setProperty('--word-index', String(wi));
          wSpan.textContent = words[wi];
          heroHeading.appendChild(wSpan);
          if (wi < words.length - 1) {
            heroHeading.appendChild(document.createTextNode(' '));
          }
        }
        heroHeading.classList.add('hero-h1--split');
      }
    }
  }

  /* Scroll reading progress */
  var progressEl = document.querySelector('.scroll-progress');
  if (progressEl) {
    function updateScrollProgress() {
      var docEl = document.documentElement;
      var scrollable = docEl.scrollHeight - window.innerHeight;
      var pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      progressEl.style.width = Math.min(100, Math.max(0, pct)) + '%';
    }
    updateScrollProgress();
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    window.addEventListener('resize', updateScrollProgress, { passive: true });
  }

  /* Header shadow on scroll */
  var header = document.querySelector('.site-header');
  if (header) {
    function onScroll() {
      if (window.scrollY > 20) header.classList.add('is-scrolled');
      else header.classList.remove('is-scrolled');
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* Mobile menu */
  var toggle = document.querySelector('.menu-toggle');
  var panel = document.getElementById('mobile-nav');
  var backdrop = document.querySelector('.mobile-backdrop');

  function scrollToSection(id, afterLayout) {
    function run() {
      var el = document.getElementById(id);
      if (!el) {
        return;
      }
      var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    }
    if (afterLayout) {
      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(run);
      });
    } else {
      run();
    }
  }

  function setMenuOpen(open) {
    if (!toggle || !panel) return;
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    panel.classList.toggle('is-open', open);
    panel.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (open) {
      panel.removeAttribute('inert');
    } else {
      panel.setAttribute('inert', '');
    }
    document.body.classList.toggle('nav-open', open);
    if (backdrop) backdrop.classList.toggle('is-visible', open);
  }

  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      setMenuOpen(!open);
    });
    panel.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        setMenuOpen(false);
      });
    });
    if (backdrop) {
      backdrop.addEventListener('click', function () {
        setMenuOpen(false);
      });
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenuOpen(false);
    });
  }

  /* Same-page #fragment links: use capture so we read `nav-open` before the mobile menu’s
     bubble listener closes the menu. After `overflow: hidden` is removed, double-rAF scroll
     avoids a jump to the top (common on iOS). */
  document.addEventListener(
    'click',
    function (e) {
      var a = e.target && e.target.closest ? e.target.closest('a[href*="#"]') : null;
      if (!a) {
        return;
      }
      if (a.getAttribute('download') != null) {
        return;
      }
      var t = a.getAttribute('target');
      if (t && t !== '' && t !== '_self') {
        return;
      }
      var hrefAttr = a.getAttribute('href');
      if (!hrefAttr || hrefAttr === '#') {
        return;
      }
      var url;
      try {
        url = new URL(a.href, window.location.href);
      } catch (err) {
        return;
      }
      if (url.origin !== window.location.origin) {
        return;
      }
      if (url.pathname !== window.location.pathname) {
        return;
      }
      if (!url.hash || url.hash === '#') {
        return;
      }
      var id = url.hash.slice(1);
      if (!id) {
        return;
      }
      var targetEl = document.getElementById(id);
      if (!targetEl) {
        return;
      }
      var wasNavOpen = document.body.classList.contains('nav-open');
      e.preventDefault();
      setMenuOpen(false);
      try {
        history.replaceState(null, '', url.pathname + url.search + url.hash);
      } catch (err2) {
        window.location.hash = id;
      }
      scrollToSection(id, wasNavOpen);
    },
    true
  );

  /* Footer year */
  var footerYear = document.getElementById('footer-year');
  if (footerYear) {
    footerYear.textContent = String(new Date().getFullYear());
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* Contact block: multiple tappable phone lines from __SITE__.phones */
  var phoneList = C.phones && C.phones.length
    ? C.phones
    : [
        {
          label: 'Phone / WhatsApp',
          phoneDisplay: C.phoneDisplay,
          phoneTel: C.phoneTel,
          whatsappE164: C.whatsappE164
        }
      ];
  var contactPhonesEl = document.getElementById('contact-phones');
  if (contactPhonesEl) {
    var parts = [];
    for (var pi = 0; pi < phoneList.length; pi++) {
      var p = phoneList[pi] || {};
      var lab = (p.label || 'Phone').trim();
      var tel = (p.phoneTel || '').replace(/\s/g, '');
      var disp = (p.phoneDisplay || '').trim();
      if (!tel || !disp) {
        continue;
      }
      var extra = pi > 0 ? ' contact-phone--extra' : '';
      parts.push(
        '<p class="contact-phone' +
          extra +
          '"><span class="muted">' +
          escapeHtml(lab) +
          '</span><br><a href="tel:' +
          escapeHtml(tel) +
          '">' +
          escapeHtml(disp) +
          '</a></p>'
      );
    }
    if (parts.length) {
      contactPhonesEl.innerHTML = parts.join('');
      contactPhonesEl.removeAttribute('hidden');
    }
  }

  var seenWa = Object.create(null);
  var uniqueDisp = [];
  for (var w = 0; w < phoneList.length; w++) {
    var row = phoneList[w] || {};
    var e = row.whatsappE164;
    if (e && !seenWa[e]) {
      seenWa[e] = true;
      if (row.phoneDisplay) {
        uniqueDisp.push(row.phoneDisplay);
      }
    }
  }
  var whatsappHintEl = document.getElementById('whatsapp-hint');
  if (whatsappHintEl && uniqueDisp.length) {
    if (uniqueDisp.length === 1) {
      whatsappHintEl.innerHTML = 'Opens WhatsApp to <strong>' + uniqueDisp[0] + '</strong>';
    } else {
      whatsappHintEl.innerHTML =
        'Opens WhatsApp to <strong>' + uniqueDisp.join('</strong> or <strong>') + '</strong>';
    }
  }

  /* Unit type filter (homepage) */
  var UNIT_FILTER_KEY = 'cc_unit_filter';
  var unitGrid = document.getElementById('unit-grid');

  function getUnitFilterCards() {
    return document.querySelectorAll('#unit-grid .unit-card[data-unit-category]');
  }

  function applyUnitFilter(filter) {
    var f = (filter || 'all').toString().toLowerCase();
    if (f !== 'all' && f !== 'shop' && f !== 'flat' && f !== 'office') {
      f = 'all';
    }
    var cards = getUnitFilterCards();
    if (!cards.length) {
      return;
    }
    var n = 0;
    for (var ui = 0; ui < cards.length; ui++) {
      var card = cards[ui];
      var cat = (card.getAttribute('data-unit-category') || '').toLowerCase();
      var show = f === 'all' || (f === 'flat' && cat === 'flat') || (f === 'shop' && cat === 'shop') || (f === 'office' && cat === 'office');
      if (show) {
        card.classList.remove('is-filtered-out');
        n++;
      } else {
        card.classList.add('is-filtered-out');
      }
    }
    var emptyEl = document.getElementById('unit-filter-empty');
    if (emptyEl) {
      if (n === 0) {
        emptyEl.classList.add('is-visible');
      } else {
        emptyEl.classList.remove('is-visible');
      }
    }
    var status = document.getElementById('unit-filter-status');
    if (status) {
      if (f === 'all') {
        status.textContent = 'Showing all unit types.';
      } else if (f === 'shop') {
        status.textContent = n ? 'Showing retail shops (' + n + '). ' : 'No shops in this list.';
      } else if (f === 'flat') {
        status.textContent = n
          ? 'Showing flats: ' + n + ' type' + (n === 1 ? '' : 's') + ' (1–3 bed).'
          : 'No flats in this list.';
      } else if (f === 'office') {
        status.textContent = n ? 'Showing office space.' : 'No offices in this list.';
      }
    }
    document.querySelectorAll('.unit-filter-btn').forEach(function (btn) {
      var bf = (btn.getAttribute('data-filter') || 'all').toLowerCase();
      var isAct = bf === f;
      btn.classList.toggle('is-active', isAct);
      btn.setAttribute('aria-pressed', isAct ? 'true' : 'false');
    });
  }

  if (unitGrid) {
    var sp = new URLSearchParams(window.location.search);
    var qFilter = (sp.get('unit') || sp.get('filter') || '').toLowerCase();
    if (qFilter && ['all', 'shop', 'flat', 'office'].indexOf(qFilter) >= 0) {
      try {
        sessionStorage.setItem(UNIT_FILTER_KEY, qFilter);
      } catch (e) {}
    }
    var fromStore = null;
    try {
      fromStore = sessionStorage.getItem(UNIT_FILTER_KEY);
    } catch (e) {}
    var hadIncomingFilter = false;
    if (fromStore && ['all', 'shop', 'flat', 'office'].indexOf(fromStore) >= 0) {
      applyUnitFilter(fromStore);
      hadIncomingFilter = fromStore !== 'all';
      try {
        sessionStorage.removeItem(UNIT_FILTER_KEY);
      } catch (e) {}
    } else {
      applyUnitFilter('all');
    }
    if (location.hash === '#units' || hadIncomingFilter) {
      window.requestAnimationFrame(function () {
        scrollToSection('units');
      });
    }
    document.querySelectorAll('.unit-filter-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var nf = (btn.getAttribute('data-filter') || 'all').toLowerCase();
        applyUnitFilter(nf);
      });
    });
    document.querySelectorAll('[data-apply-filter]').forEach(function (pathBtn) {
      pathBtn.addEventListener('click', function (ev) {
        var nf2 = (pathBtn.getAttribute('data-apply-filter') || '').toLowerCase();
        if (['shop', 'flat', 'office'].indexOf(nf2) < 0) {
          return;
        }
        if (pathBtn.tagName && pathBtn.tagName.toLowerCase() === 'a') {
          ev.preventDefault();
        }
        applyUnitFilter(nf2);
        scrollToSection('units');
      });
    });
  }

  /* Inquiry form → WhatsApp */
  var form = document.getElementById('inquiry-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = (form.querySelector('[name="name"]') || {}).value || '';
      var phone = (form.querySelector('[name="phone"]') || {}).value || '';
      var unit = (form.querySelector('[name="unit"]') || {}).value || '';
      var viewing = (form.querySelector('[name="viewing"]') || {}).value || '';
      var budget = (form.querySelector('[name="budget"]') || {}).value || '';
      var message = (form.querySelector('[name="message"]') || {}).value || '';
      var lines = [
        'City Center — website inquiry (C1 Markaz B-17)',
        'Name: ' + name.trim(),
        'Phone / WhatsApp: ' + phone.trim(),
        'Unit type: ' + unit.trim(),
        'Viewing preference: ' + viewing.trim()
      ];
      if (budget.trim()) {
        lines.push('Monthly budget (PKR): ' + budget.trim());
      }
      if (message.trim()) {
        lines.push('Notes: ' + message.trim());
      }
      lines.push('---');
      lines.push('Please confirm: (1) what is available now, (2) exact rent + deposit, (3) best viewing slots 9 AM–9 PM.');
      var url = WA + '?text=' + encodeURIComponent(lines.join('\n'));
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }

  /* Unit image galleries */
  document.querySelectorAll('[data-gallery]').forEach(function (gallery) {
    var images = Array.from(gallery.querySelectorAll('.unit-media-image'));
    if (images.length < 2) return;

    var prevButton = gallery.querySelector('[data-gallery-prev]');
    var nextButton = gallery.querySelector('[data-gallery-next]');
    var count = gallery.querySelector('.unit-media-count');
    var index = 0;
    var timerId = null;
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function render(nextIndex) {
      index = (nextIndex + images.length) % images.length;
      images.forEach(function (image, imageIndex) {
        image.classList.toggle('is-active', imageIndex === index);
      });
      if (count) {
        count.textContent = String(index + 1) + ' / ' + String(images.length);
      }
    }

    function stopAutoPlay() {
      if (timerId) {
        window.clearInterval(timerId);
        timerId = null;
      }
    }

    function startAutoPlay() {
      if (reducedMotion) return;
      stopAutoPlay();
      timerId = window.setInterval(function () {
        render(index + 1);
      }, 3500);
    }

    if (prevButton) {
      prevButton.addEventListener('click', function () {
        render(index - 1);
        startAutoPlay();
      });
    }

    if (nextButton) {
      nextButton.addEventListener('click', function () {
        render(index + 1);
        startAutoPlay();
      });
    }

    gallery.addEventListener('mouseenter', stopAutoPlay);
    gallery.addEventListener('mouseleave', startAutoPlay);
    gallery.addEventListener('focusin', stopAutoPlay);
    gallery.addEventListener('focusout', function (event) {
      if (!gallery.contains(event.relatedTarget)) {
        startAutoPlay();
      }
    });

    render(0);
    if (!reducedMotion) {
      window.addEventListener(
        'load',
        function () {
          var ric = window.requestIdleCallback;
          if (typeof ric === 'function') {
            ric(
              function () {
                startAutoPlay();
              },
              { timeout: 3000 }
            );
          } else {
            window.setTimeout(startAutoPlay, 200);
          }
        },
        { once: true }
      );
    }
  });

  /* Hero stats: PKR band count-up */
  function easeOutExpo(t) {
    return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function formatPkr(n) {
    return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function animateHeroStatsBlock(dl) {
    var dds = dl.querySelectorAll('dd');
    for (var si = 0; si < dds.length; si++) {
      (function (dd) {
        var original = dd.textContent.trim();
        var m = original.match(/^PKR\s*([\d,\s]+)\s*[\u2013\u2014-]\s*([\d,\s]+)\s*$/);
        if (!m) {
          return;
        }
        var lo = parseInt(m[1].replace(/[\s,]/g, ''), 10);
        var hi = parseInt(m[2].replace(/[\s,]/g, ''), 10);
        if (isNaN(lo) || isNaN(hi)) {
          return;
        }
        var startTs = null;
        var duration = 1800;
        function tickFrame(now) {
          if (startTs === null) {
            startTs = now;
          }
          var p = Math.min(1, (now - startTs) / duration);
          var e = easeOutExpo(p);
          dd.textContent = 'PKR ' + formatPkr(lo * e) + ' – ' + formatPkr(hi * e);
          if (p < 1) {
            window.requestAnimationFrame(tickFrame);
          } else {
            dd.textContent = original;
          }
        }
        window.requestAnimationFrame(tickFrame);
      })(dds[si]);
    }
  }

  var heroStatsEl = document.querySelector('.hero-stats');
  if (heroStatsEl && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var statsDone = false;
    var statsIo = new IntersectionObserver(
      function (statsEntries) {
        statsEntries.forEach(function (se) {
          if (!se.isIntersecting || statsDone) {
            return;
          }
          statsDone = true;
          statsIo.disconnect();
          animateHeroStatsBlock(heroStatsEl);
        });
      },
      { threshold: 0.25, rootMargin: '0px' }
    );
    statsIo.observe(heroStatsEl);
  }

  /* Scroll reveal */
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              io.unobserve(entry.target);
            }
          });
        },
        { rootMargin: '0px 0px -40px 0px', threshold: 0.08 }
      );
      revealEls.forEach(function (el) {
        io.observe(el);
      });
    }
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('is-visible');
    });
  }
})();
