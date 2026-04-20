/* ═══════════════════════════════════════════════════════════════
   STRONG BUILT · MINIMALIST DARK — shared behaviors
   One include handles: desktop nav dropdowns, mobile drawer,
   header scroll state, and the reveal-on-scroll observer.

   Markup contract (provided by theme.css + page HTML):
     .md-nav-item > .md-nav-link + .md-nav-dropdown
     #mainHeader, #menuToggle, #navDrawer, #drawerBackdrop,
     #drawerClose, [data-dropdown] + .md-drawer-sub
     .md-reveal
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  /* ── Desktop dropdowns: hover + keyboard + click-outside ── */
  function initDesktopDropdowns() {
    document.querySelectorAll('.md-nav-item').forEach(item => {
      const btn = item.querySelector('.md-nav-link');
      const panel = item.querySelector('.md-nav-dropdown');
      if (!btn || !panel) return;
      const open = () => btn.setAttribute('aria-expanded', 'true');
      const close = () => btn.setAttribute('aria-expanded', 'false');
      item.addEventListener('mouseenter', open);
      item.addEventListener('mouseleave', close);
      btn.addEventListener('focus', open);
      item.addEventListener('focusout', e => {
        if (!item.contains(e.relatedTarget)) close();
      });
      btn.addEventListener('click', e => {
        e.preventDefault();
        const isOpen = btn.getAttribute('aria-expanded') === 'true';
        document.querySelectorAll('.md-nav-link[aria-expanded="true"]').forEach(b => b.setAttribute('aria-expanded', 'false'));
        if (!isOpen) open();
      });
    });
    document.addEventListener('click', e => {
      if (!e.target.closest('.md-nav-item')) {
        document.querySelectorAll('.md-nav-link[aria-expanded="true"]').forEach(b => b.setAttribute('aria-expanded', 'false'));
      }
    });
  }

  /* ── Mobile drawer open/close ── */
  function initDrawer() {
    const toggle = document.getElementById('menuToggle');
    const drawer = document.getElementById('navDrawer');
    const backdrop = document.getElementById('drawerBackdrop');
    const close = document.getElementById('drawerClose');
    if (!toggle || !drawer) return;

    const open = () => {
      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    };
    const shut = () => {
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    toggle.addEventListener('click', open);
    close && close.addEventListener('click', shut);
    backdrop && backdrop.addEventListener('click', shut);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') shut(); });

    document.querySelectorAll('[data-dropdown]').forEach(btn => {
      btn.addEventListener('click', () => {
        const sub = btn.nextElementSibling;
        btn.classList.toggle('is-open');
        if (sub) sub.classList.toggle('is-open');
      });
    });
  }

  /* ── Header scroll state (adds .is-scrolled past 20px) ── */
  function initHeaderScroll() {
    const header = document.getElementById('mainHeader');
    if (!header) return;
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ── Reveal on scroll (IntersectionObserver + fallback) ── */
  function initReveal() {
    const targets = document.querySelectorAll('.md-reveal');
    if (!targets.length) return;

    if (!('IntersectionObserver' in window)) {
      targets.forEach(el => el.classList.add('is-visible'));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

    targets.forEach(el => io.observe(el));

    // Safety: ensure anything stuck hidden after 2.5s gets revealed
    setTimeout(() => {
      document.querySelectorAll('.md-reveal:not(.is-visible)').forEach(el => el.classList.add('is-visible'));
    }, 2500);
  }

  /* ── Optional: simple counter animation (for data-target elements) ── */
  function initCounters() {
    const els = document.querySelectorAll('[data-md-counter]');
    if (!els.length) return;

    const animate = (el, end, duration = 1600) => {
      const start = performance.now();
      const step = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.floor(eased * end);
        if (t < 1) requestAnimationFrame(step);
        else el.textContent = end;
      };
      requestAnimationFrame(step);
    };

    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const target = entry.target;
        animate(target, parseInt(target.dataset.mdCounter, 10) || 0);
        obs.unobserve(target);
      });
    }, { threshold: 0.5 });
    els.forEach(el => io.observe(el));
  }

  ready(() => {
    initDesktopDropdowns();
    initDrawer();
    initHeaderScroll();
    initReveal();
    initCounters();
  });
})();
