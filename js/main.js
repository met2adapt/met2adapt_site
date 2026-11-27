document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const navList = document.querySelector(".main-nav ul");

  // Header shrink on scroll
  const handleScroll = () => {
    if (window.scrollY > 20) header.classList.add("shrink");
    else header.classList.remove("shrink");
  };
  document.addEventListener("scroll", handleScroll);

  // Mobile nav toggle
  if (navToggle && navList) {
    navToggle.addEventListener("click", () => {
      navList.classList.toggle("open");
      navToggle.classList.toggle("active");
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", (!expanded).toString());
    });
  }

  // Close mobile menu when clicking outside
  document.addEventListener("click", (event) => {
    if (navList && navList.classList.contains("open") && !navList.contains(event.target) && !navToggle.contains(event.target)) {
      navList.classList.remove("open");
      navToggle.classList.remove("active");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });

  // Close mobile menu on ESC
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navList && navList.classList.contains("open")) {
      navList.classList.remove("open");
      navToggle.classList.remove("active");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });

  // Scroll reveal
  const revealElements = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealElements.forEach((el) => observer.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add("visible"));
  }

  // Initialize DC accordions (grouped by WP)
  (function initDCAccordions() {
	function initAccordion(containerId, singleOpen) {
	  const container = document.getElementById(containerId);
	  if (!container) return;
	  const items = Array.from(container.querySelectorAll(".dc-item"));

	  function closeAll() {
		items.forEach(item => {
		  const header = item.querySelector(".dc-header");
		  const body = item.querySelector(".dc-body");
		  const btn = item.querySelector(".dc-toggle") || header;
		  if (body) body.classList.remove("open"), body.setAttribute("aria-hidden", "true"), body.setAttribute("hidden", "");
		  if (header) header.setAttribute("aria-expanded", "false");
		  if (btn) btn.setAttribute("aria-expanded", "false");
		});
	  }

	  items.forEach(item => {
		const header = item.querySelector(".dc-header");
		const body = item.querySelector(".dc-body");
		// prefer explicit .dc-toggle element, otherwise use header itself
		const btn = item.querySelector(".dc-toggle") || header;
		if (!header || !body || !btn) return;

		function toggle(e) {
		  const isOpen = body.classList.contains("open");
		  if (singleOpen) closeAll();
		  if (isOpen) {
			body.classList.remove("open");
			body.setAttribute("aria-hidden", "true");
			body.setAttribute("hidden", "");
			header.setAttribute("aria-expanded", "false");
			btn.setAttribute("aria-expanded", "false");
		  } else {
			body.classList.add("open");
			body.setAttribute("aria-hidden", "false");
			body.removeAttribute("hidden");
			header.setAttribute("aria-expanded", "true");
			btn.setAttribute("aria-expanded", "true");
		  }
		}

		// attach listeners (avoid duplicate handlers if btn === header)
		header.addEventListener("click", toggle);
		if (btn !== header) {
		  btn.addEventListener("click", function (e) { e.stopPropagation(); toggle(e); });
		}
		header.addEventListener("keydown", function (e) {
		  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(e); }
		});
	  });
	}


    const accordions = document.querySelectorAll("[id$='-accordion']");
    accordions.forEach(a => {
      const single = a.getAttribute("data-single-open") === "true";
      initAccordion(a.id, single);
    });
  })();

  // News expand/collapse
  (function initNews() {
    const openButtons = document.querySelectorAll(".news-open");
    const closeButtons = document.querySelectorAll(".news-close");

    openButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-news-id");
        const detail = document.getElementById(id + "-detail");
        if (!detail) return;
        detail.classList.add("open");
        detail.setAttribute("aria-hidden", "false");
        detail.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    closeButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-news-id");
        const detail = document.getElementById(id + "-detail");
        if (!detail) return;
        detail.classList.remove("open");
        detail.setAttribute("aria-hidden", "true");
        const openBtn = document.querySelector(".news-open[data-news-id=\"" + id + "\"]");
        if (openBtn) openBtn.focus();
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        const openDetails = document.querySelectorAll(".news-detail.open");
        openDetails.forEach(d => { d.classList.remove("open"); d.setAttribute("aria-hidden", "true"); });
      }
    });
  })();
});

(function () {
  if (typeof window === 'undefined') return;

  // Respect reduced motion
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const stencils = Array.from(document.querySelectorAll('.wp-stencil__visual'));
  if (!stencils.length) return;

  // Attach mask references and initial styles
  stencils.forEach(el => {
    const maskId = el.dataset.maskId || el.querySelector('mask')?.id;
    const maskUrl = maskId ? `url(#${maskId})` : null;
    const maskEl = el.querySelector('.wp-stencil__mask');
    if (maskUrl && maskEl) {
      maskEl.style.webkitMask = `${maskUrl} center/80% no-repeat`;
      maskEl.style.mask = `${maskUrl} center/80% no-repeat`;
    }
    // ensure photo element exists
    const photo = el.querySelector('.wp-stencil__photo');
    if (photo) {
      // ensure background-position is centered initially
      photo.style.backgroundPosition = 'center';
      photo.style.transform = 'translate3d(0,0,0)';
    }
  });

  // IntersectionObserver to track visible elements
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      e.target.__visible = e.isIntersecting;
    });
  }, { root: null, threshold: 0.05 });

  stencils.forEach(el => io.observe(el));

  // RAF loop
  let ticking = false;
  function update() {
    ticking = false;
    const vh = window.innerHeight;
    stencils.forEach(el => {
      if (!el.__visible) return;
      const rect = el.getBoundingClientRect();
      const photo = el.querySelector('.wp-stencil__photo');
      if (!photo) return;

      // speed factor from data attribute (default 0.12)
      const speed = parseFloat(el.dataset.speed) || 0.12;

      // compute progress relative to viewport center (-1 .. 1)
      const centerOffset = (rect.top + rect.height / 2) - (vh / 2);
      const norm = centerOffset / (vh / 2); // -inf..inf, but typically -1..1 when near center
      // clamp to -1..1
      const clamped = Math.max(-1, Math.min(1, norm));

      // translate range: multiply by a pixel range (e.g., 40% of rect.height)
      const maxShift = rect.height * 0.35; // tweakable
      const translateY = -clamped * maxShift * speed;

      // apply transform (use translate3d for GPU)
      photo.style.transform = `translate3d(0, ${translateY.toFixed(2)}px, 0)`;
    });
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  // initial update and listeners
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  // run once to set initial positions
  onScroll();
})();

document.addEventListener('DOMContentLoaded', function () {
  // Delegate clicks for DC toggles
  document.body.addEventListener('click', function (e) {
    const btn = e.target.closest && e.target.closest('.dc-toggle');
    if (!btn) return;
    const listId = btn.getAttribute('aria-controls');
    const list = listId ? document.getElementById(listId) : null;
    if (!list) return;
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    if (expanded) {
      list.setAttribute('hidden', '');
    } else {
      list.removeAttribute('hidden');
    }
  }, { passive: true });

  // Keyboard support: Enter/Space toggles when focused
  document.body.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const btn = e.target.closest && e.target.closest('.dc-toggle');
    if (!btn) return;
    e.preventDefault();
    btn.click();
  });
});

(function () {
  const carousel = document.querySelector('.hero-carousel');
  if (!carousel) return;
  const track = carousel.querySelector('.hc-track');
  const slides = Array.from(carousel.querySelectorAll('.hc-slide'));
  const prev = carousel.querySelector('.hc-prev');
  const next = carousel.querySelector('.hc-next');
  const indicators = Array.from(carousel.querySelectorAll('.hc-indicators button'));
  let idx = 0;
  let interval = null;
  const AUTOPLAY_MS = 5000;

  function goTo(n, userTriggered = false) {
    idx = (n + slides.length) % slides.length;
    track.style.transform = `translateX(-${idx * 100}%)`;
    slides.forEach((s,i) => {
      s.setAttribute('aria-hidden', i === idx ? 'false' : 'true');
    });
    indicators.forEach((b,i) => {
      b.setAttribute('aria-selected', i === idx ? 'true' : 'false');
    });
    if (userTriggered) restartAutoplay();
  }

  function nextSlide() { goTo(idx + 1); }
  function prevSlide() { goTo(idx - 1); }

  function startAutoplay() {
    stopAutoplay();
    if (slides.length < 2) return;
    interval = setInterval(nextSlide, AUTOPLAY_MS);
  }
  function stopAutoplay() { if (interval) { clearInterval(interval); interval = null; } }
  function restartAutoplay() { stopAutoplay(); startAutoplay(); }

  prev.addEventListener('click', () => goTo(idx - 1, true));
  next.addEventListener('click', () => goTo(idx + 1, true));
  indicators.forEach(btn => btn.addEventListener('click', (e) => {
    const to = Number(btn.dataset.to);
    goTo(to, true);
  }));

  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });

  // pause only while a mouse pointer rests on the slider (touch taps do not stop it)
  carousel.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') stopAutoplay(); });
  carousel.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') startAutoplay(); });
  document.addEventListener('visibilitychange', () => document.hidden ? stopAutoplay() : startAutoplay());
  // swipe left/right on touch screens
  let touchX = null, touchY = null;
  carousel.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; touchY = e.touches[0].clientY; }, { passive: true });
  carousel.addEventListener('touchend', (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX, dy = e.changedTouches[0].clientY - touchY;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) goTo(idx + (dx < 0 ? 1 : -1), true);
    touchX = touchY = null;
  }, { passive: true });
  carousel.setAttribute('tabindex', '0'); // make carousel focusable for keyboard nav

  // init
  goTo(0);
  startAutoplay();
})();

document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");
  const menu = document.getElementById("main-menu");

  if (!toggle || !nav || !menu) return;

  function openNav() {
    nav.classList.add("open");
    toggle.setAttribute("aria-expanded", "true");
    // optional: focus first link for keyboard users
    const firstLink = menu.querySelector("a");
    if (firstLink) firstLink.focus();
  }

  function closeNav() {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.focus();
  }

  toggle.addEventListener("click", function (e) {
    e.stopPropagation();
    if (nav.classList.contains("open")) closeNav();
    else openNav();
  });

  // Close on Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("open")) closeNav();
  });

  // Close when clicking outside the nav
  document.addEventListener("click", function (e) {
    if (!nav.contains(e.target) && nav.classList.contains("open")) closeNav();
  });

  // Prevent clicks inside menu from closing when they bubble
  menu.addEventListener("click", function (e) {
    e.stopPropagation();
  });
});


// Deep link from home-page DC cards: /research/#wp1-dc1 opens the WP list and the DC item
(function () {
  function openDcFromHash() {
    var id = decodeURIComponent((location.hash || '').slice(1));
    if (!id) return;
    var item = document.getElementById(id);
    if (!item || !item.classList.contains('dc-item')) return;

    var list = item.closest('.dc-list');
    if (list && list.hasAttribute('hidden')) {
      list.removeAttribute('hidden');
      var t = document.querySelector('.dc-toggle[aria-controls="' + list.id + '"]');
      if (t) t.setAttribute('aria-expanded', 'true');
    }
    var body = item.querySelector('.dc-body');
    var header = item.querySelector('.dc-header');
    if (body && !body.classList.contains('open') && header) header.click();

    item.classList.add('dc-item--target');
    setTimeout(function () { item.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50);
    setTimeout(function () { item.classList.remove('dc-item--target'); }, 2500);
  }
  window.addEventListener('load', openDcFromHash);
  window.addEventListener('hashchange', openDcFromHash);
})();


// News & Events: filters and full-story pop-up (each story has its own link: /news/#id)
(function () {
  const list = document.querySelector('.news-list');
  if (!list) return;
  const items = Array.from(list.querySelectorAll('.news-item'));
  const empty = document.querySelector('.news-empty');

  document.querySelectorAll('.news-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      const f = btn.dataset.filter;
      document.querySelectorAll('.news-filter').forEach(b => {
        const on = b === btn; b.classList.toggle('is-active', on); b.setAttribute('aria-pressed', on);
      });
      let shown = 0;
      items.forEach(it => { const ok = f === 'all' || it.dataset.type === f; it.hidden = !ok; if (ok) shown++; });
      if (empty) empty.hidden = shown > 0;
    });
  });

  const dlg = document.querySelector('.news-modal');
  if (!dlg || typeof dlg.showModal !== 'function') return;   // very old browsers: links fall back to #id
  const content = dlg.querySelector('.news-modal__content');
  let opener = null;

  function open(id, fromHash) {
    const tpl = document.getElementById('tpl-' + id);
    if (!tpl) return false;
    content.replaceChildren(tpl.content.cloneNode(true));
    content.scrollTop = 0;
    if (!dlg.open) dlg.showModal();
    if (!fromHash && location.hash !== '#' + id) history.pushState(null, '', '#' + id);
    return true;
  }
  function close() { if (dlg.open) dlg.close(); }

  list.addEventListener('click', e => {
    const a = e.target.closest('[data-news-open]');
    if (!a) return;
    e.preventDefault(); opener = a; open(a.dataset.newsOpen, false);
  });
  dlg.querySelector('.news-modal__close').addEventListener('click', close);
  dlg.addEventListener('click', e => { if (e.target === dlg) close(); });   // click on the dimmed backdrop
  dlg.addEventListener('close', () => {
    if (location.hash) history.replaceState(null, '', location.pathname + location.search);
    if (opener) opener.focus();
  });
  function fromHash() {
    const id = decodeURIComponent(location.hash.slice(1));
    if (id && document.getElementById('tpl-' + id)) open(id, true); else close();
  }
  window.addEventListener('popstate', fromHash);
  fromHash();
})();
