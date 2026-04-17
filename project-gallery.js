// project-gallery.js — Cinematic portfolio: filterable gallery + map toggle
(function () {
  'use strict';

  // ── State ──
  const activeFilters = { category: 'all', search: '', sort: 'az' };
  let currentView = 'grid'; // 'grid' | 'list'
  let totalProjects = 0;

  // Escape untrusted strings before interpolating into innerHTML templates.
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));
  }

  function hasData() {
    return typeof PROJECT_DATA !== 'undefined' && Array.isArray(PROJECT_DATA);
  }

  function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  // ── Filter Pills ──
  function initFilters() {
    if (!hasData()) return;
    totalProjects = PROJECT_DATA.length;
    buildFilterRow('categoryFilters', 'category');
    const total = document.getElementById('totalCount');
    if (total) total.textContent = totalProjects;
  }

  function buildFilterRow(containerId, field) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const values = ['all', ...getFilterOptions(field)];
    values.forEach(val => container.appendChild(createPill(val, field)));
  }

  function createPill(value, filterType) {
    const btn = document.createElement('button');
    const isActive = value === 'all';
    btn.className = pillClass(isActive);
    btn.textContent = value === 'all' ? 'All' : capitalize(value);
    btn.dataset.filter = filterType;
    btn.dataset.value = value;
    btn.addEventListener('click', () => {
      activeFilters[filterType] = value;
      btn.parentElement.querySelectorAll('button').forEach(b => b.className = pillClass(false));
      btn.className = pillClass(true);
      renderGallery();
    });
    return btn;
  }

  function pillClass(active) {
    const base = 'px-3 py-1 rounded-full text-[10px] font-heading font-bold uppercase tracking-[0.2em] transition-all duration-300 border cursor-pointer ';
    return base + (active
      ? 'bg-brand-gold text-black border-brand-gold'
      : 'text-gray-400 border-white/10 hover:border-brand-gold/40 hover:text-white');
  }

  // ── Filter + Sort ──
  function getFiltered() {
    if (!hasData()) return [];
    return PROJECT_DATA
      .filter(p => {
        if (activeFilters.category !== 'all' && p.category !== activeFilters.category) return false;
        if (activeFilters.search) {
          const q = activeFilters.search;
          if (!(p.title.toLowerCase().includes(q) || p.client.toLowerCase().includes(q) || p.location.toLowerCase().includes(q))) return false;
        }
        return true;
      })
      .sort((a, b) => {
        switch (activeFilters.sort) {
          case 'newest': return b.year - a.year;
          case 'oldest': return a.year - b.year;
          case 'az': return a.title.localeCompare(b.title);
          case 'za': return b.title.localeCompare(a.title);
          default: return 0;
        }
      });
  }

  // ── Render Gallery ──
  const FALLBACK_IMG = '';

  function renderGallery() {
    const grid = document.getElementById('project-grid');
    if (!grid) return;
    const filtered = getFiltered();
    grid.innerHTML = '';

    const rc = document.getElementById('resultCount');
    if (rc) rc.textContent = filtered.length;

    const noRes = document.getElementById('noResults');
    if (noRes) {
      noRes.classList.toggle('hidden', filtered.length > 0);
      grid.classList.toggle('hidden', filtered.length === 0);
    }

    if (currentView === 'list') {
      grid.className = 'flex flex-col gap-3';
    } else {
      grid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 auto-rows-[280px] sm:auto-rows-[340px] md:auto-rows-[380px] lg:auto-rows-[420px] grid-flow-dense';
    }

    filtered.forEach((p, i) => {
      const card = currentView === 'grid' ? gridCard(p, i) : listCard(p, i);
      grid.appendChild(card);
    });

    if (typeof gsap !== 'undefined') {
      gsap.from(grid.children, { y: 40, opacity: 0, duration: 0.7, stagger: 0.05, ease: 'power3.out', clearProps: 'all' });
    }
  }

  function numberLabel(i) {
    return String(i + 1).padStart(3, '0');
  }

  // ── Grid Card (cinematic, numbered) ──
  function gridCard(p, i) {
    const div = document.createElement('article');
    const imgSrc = p.img || FALLBACK_IMG;
    div.className = 'project-card group';
    div.dataset.category = p.category;

    div.innerHTML = `
      <span class="num">${numberLabel(i)} / ${String(totalProjects).padStart(3, '0')}</span>
      <div class="img-wrap"><img src="${esc(imgSrc)}" alt="${esc(p.title)}" loading="lazy"></div>
      <div class="shade"></div>
      <div class="meta">
        <h3>${esc(p.title)}</h3>
        <div class="row">
          <span><span class="dot"></span>${esc(capitalize(p.category))}</span>
          <span>${esc(p.client)}</span>
          <span>${esc(p.location)}</span>
        </div>
      </div>`;

    div.addEventListener('click', () => {
      if (typeof openLightbox === 'function') openLightbox(imgSrc, p.title + ' — ' + p.client);
    });
    return div;
  }

  // ── List Card (compact row) ──
  function listCard(p, i) {
    const div = document.createElement('article');
    const imgSrc = p.img || FALLBACK_IMG;
    div.className = 'project-card list-mode group';

    div.innerHTML = `
      <div class="img-wrap"><img src="${esc(imgSrc)}" alt="${esc(p.title)}" loading="lazy"></div>
      <div class="meta">
        <div class="flex items-center gap-6 min-w-0 flex-1">
          <span class="num">${numberLabel(i)}</span>
          <div class="min-w-0">
            <h3 class="truncate">${esc(p.title)}</h3>
            <div class="row"><span>${esc(capitalize(p.category))}</span><span>${esc(p.client)}</span></div>
          </div>
        </div>
        <div class="hidden md:flex items-center gap-8 text-right">
          <div class="reel-kv"><span class="k">Location</span><span class="v">${esc(p.location)}</span></div>
          <div class="reel-kv"><span class="k">Area</span><span class="v">${esc(p.area || '—')}</span></div>
          <i class="fas fa-arrow-right text-gray-500 group-hover:text-brand-gold transition-colors"></i>
        </div>
      </div>`;

    div.addEventListener('click', () => {
      if (typeof openLightbox === 'function') openLightbox(imgSrc, p.title + ' — ' + p.client);
    });
    return div;
  }

  // ── Reset ──
  window.resetFilters = function () {
    activeFilters.category = 'all';
    activeFilters.search = '';
    const si = document.getElementById('projectSearch');
    if (si) si.value = '';
    document.querySelectorAll('#categoryFilters button').forEach(b => {
      b.className = pillClass(b.dataset.value === 'all');
    });
    renderGallery();
  };

  // ── Events ──
  function initEvents() {
    const si = document.getElementById('projectSearch');
    if (si) si.addEventListener('input', e => { activeFilters.search = e.target.value.toLowerCase(); renderGallery(); });

    const ss = document.getElementById('sortSelect');
    if (ss) ss.addEventListener('change', e => { activeFilters.sort = e.target.value; renderGallery(); });

    document.querySelectorAll('.view-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        // Ensure gallery container is visible (switch away from map)
        const galleryCont = document.getElementById('galleryContainer');
        const mapCont = document.getElementById('mapContainer');
        if (galleryCont && mapCont) {
          galleryCont.classList.remove('hidden');
          mapCont.classList.add('hidden');
        }

        currentView = btn.dataset.view;
        // Visually update grid/list toggle buttons
        document.querySelectorAll('.view-toggle').forEach(b => {
          const isActive = b === btn;
          b.classList.toggle('bg-brand-gold', isActive);
          b.classList.toggle('text-black', isActive);
          b.classList.toggle('text-gray-500', !isActive);
        });
        // Reset map button visual
        const mapBtn = document.getElementById('mapViewBtn');
        if (mapBtn) {
          mapBtn.classList.remove('bg-brand-gold', 'text-black');
          mapBtn.classList.add('text-gray-500');
        }
        renderGallery();
      });
    });
  }

  // ── Map Integration ──
  let projectMap = null;
  let mapMarkers = [];

  function initProjectMap() {
    const container = document.getElementById('projectMapEmbed');
    if (!container || projectMap) return;
    projectMap = L.map('projectMapEmbed', {
      zoomControl: false,
      center: [19.1000, 72.9000],
      zoom: 11,
      attributionControl: false
    });
    L.control.zoom({ position: 'bottomright' }).addTo(projectMap);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd', maxZoom: 20
    }).addTo(projectMap);
    renderMapMarkers();
  }

  function getMarkerColor(category) {
    const colors = { residential: '#EFBF04', commercial: '#FF8C00', infrastructure: '#C0C0C0' };
    return colors[category] || '#EFBF04';
  }

  function renderMapMarkers() {
    if (!projectMap) return;
    mapMarkers.forEach(m => projectMap.removeLayer(m));
    mapMarkers = [];

    const filtered = getFiltered();
    const bounds = L.latLngBounds();

    filtered.forEach(p => {
      if (!p.coordinates) return;
      const color = getMarkerColor(p.category);
      const icon = L.divIcon({
        className: 'marker-icon',
        html: '<div style="background-color:' + color + ';width:14px;height:14px;border-radius:50%;border:2px solid white;box-shadow:0 0 10px ' + color + '80;transition:transform 0.3s ease;"></div>',
        iconSize: [14, 14], iconAnchor: [7, 7], popupAnchor: [0, -10]
      });

      const imgHtml = p.img
        ? '<img src="' + esc(p.img) + '" alt="' + esc(p.title) + '" style="width:100%;height:140px;object-fit:cover;border-bottom:1px solid rgba(255,255,255,0.1);">'
        : '<div style="width:100%;height:140px;background:#111;display:flex;align-items:center;justify-content:center;"><i class="fas fa-building" style="font-size:2rem;color:#333;"></i></div>';

      const marker = L.marker(p.coordinates, { icon })
        .addTo(projectMap)
        .bindPopup(
          '<div style="font-family:Oswald,sans-serif;">' +
          '<div style="overflow:hidden;">' + imgHtml + '</div>' +
          '<div style="padding:16px;">' +
          '<h3 style="color:#EFBF04;font-weight:bold;text-transform:uppercase;letter-spacing:0.1em;font-size:1rem;margin:0 0 4px;">' + esc(p.title) + '</h3>' +
          '<p style="font-size:0.75rem;color:#fff;margin:0 0 8px;"><span style="color:#9E9E9E;">Client:</span> ' + esc(p.client) + '</p>' +
          '<div style="display:flex;gap:6px;">' +
          '<span style="font-size:9px;background:#EFBF04;color:#000;padding:2px 8px;font-weight:bold;text-transform:uppercase;letter-spacing:0.05em;">' + esc(p.category) + '</span>' +
          '<span style="font-size:9px;color:#999;border:1px solid rgba(255,255,255,0.1);padding:2px 8px;text-transform:uppercase;letter-spacing:0.05em;">' + esc(p.location) + '</span>' +
          '</div></div></div>',
          { maxWidth: 280, className: '' }
        );

      mapMarkers.push(marker);
      bounds.extend(p.coordinates);
    });

    if (mapMarkers.length > 0) {
      projectMap.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
    }
  }

  // ── View Mode Toggle (Gallery vs Map) ──
  function initViewModeToggle() {
    const mapBtn = document.getElementById('mapViewBtn');
    const galleryCont = document.getElementById('galleryContainer');
    const mapCont = document.getElementById('mapContainer');
    if (!mapBtn || !galleryCont || !mapCont) return;

    mapBtn.addEventListener('click', () => {
      galleryCont.classList.add('hidden');
      mapCont.classList.remove('hidden');
      mapBtn.classList.add('bg-brand-gold', 'text-black');
      mapBtn.classList.remove('text-gray-500');
      document.querySelectorAll('.view-toggle').forEach(b => {
        b.classList.remove('bg-brand-gold', 'text-black');
        b.classList.add('text-gray-500');
      });

      if (!projectMap) initProjectMap();
      else { projectMap.invalidateSize(); renderMapMarkers(); }
    });
  }

  // ── Scroll reveal for .cine-up ──
  function initCineReveal() {
    const items = document.querySelectorAll('.cine-up');
    if (!items.length || !('IntersectionObserver' in window)) {
      items.forEach(el => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    items.forEach(el => io.observe(el));
  }

  // ── Cinematic Hero Reel ──
  function initHeroReel() {
    if (!hasData()) return;
    const slidesHost = document.getElementById('reelSlides');
    const dotsHost = document.getElementById('reelDots');
    const titleEl = document.getElementById('reelTitle');
    const catEl = document.getElementById('reelCategory');
    const clientEl = document.getElementById('reelClient');
    const locEl = document.getElementById('reelLocation');
    const areaEl = document.getElementById('reelArea');
    const yearEl = document.getElementById('reelYear');
    const indexEl = document.getElementById('reelIndex');
    if (!slidesHost || !dotsHost) return;

    const featured = PROJECT_DATA.filter(p => p.featured && p.img);
    const reel = featured.length >= 3 ? featured.slice(0, 6) : PROJECT_DATA.filter(p => p.img).slice(0, 6);
    if (reel.length === 0) return;

    // Build slides
    reel.forEach((p, i) => {
      const s = document.createElement('div');
      s.className = 'reel-slide' + (i === 0 ? ' active' : '');
      s.style.backgroundImage = `url("${p.img.replace(/"/g, '\\"')}")`;
      slidesHost.appendChild(s);

      const d = document.createElement('button');
      d.className = i === 0 ? 'active' : '';
      d.setAttribute('aria-label', 'Show project ' + (i + 1));
      d.addEventListener('click', () => go(i));
      dotsHost.appendChild(d);
    });

    let idx = 0;
    let timer = null;

    function apply(i) {
      const p = reel[i];
      titleEl.textContent = p.title;
      catEl.textContent = capitalize(p.category);
      clientEl.textContent = p.client || '—';
      locEl.textContent = p.location || '—';
      areaEl.textContent = p.area || '—';
      yearEl.textContent = p.year || '—';
      if (indexEl) indexEl.textContent = String(i + 1).padStart(2, '0') + ' / ' + String(reel.length).padStart(2, '0');
      slidesHost.querySelectorAll('.reel-slide').forEach((el, j) => el.classList.toggle('active', j === i));
      dotsHost.querySelectorAll('button').forEach((el, j) => el.classList.toggle('active', j === i));
    }

    function go(i) {
      idx = (i + reel.length) % reel.length;
      apply(idx);
      resetTimer();
    }

    function resetTimer() {
      clearInterval(timer);
      timer = setInterval(() => go(idx + 1), 6000);
    }

    apply(0);
    resetTimer();

    // Pause on tab hidden to save CPU
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) clearInterval(timer);
      else resetTimer();
    });
  }

  // ── Init ──
  document.addEventListener('DOMContentLoaded', () => {
    initHeroReel();
    initFilters();
    initEvents();
    initViewModeToggle();
    renderGallery();
    initCineReveal();
  });
})();
