// project-gallery.js — Filterable gallery + map toggle logic
(function () {
  'use strict';

  // ── State ──
  const activeFilters = { category: 'all', location: 'all', status: 'all', search: '', sort: 'newest' };
  let currentView = 'grid';

  // ── Initialize Filter Buttons ──
  function initFilters() {
    buildFilterRow('categoryFilters', 'category');
    buildFilterRow('locationFilters', 'location');
    buildFilterRow('statusFilters', 'status');
    document.getElementById('totalCount').textContent = PROJECT_DATA.length;
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
    const base = 'px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border cursor-pointer ';
    return base + (active
      ? 'bg-brand-gold text-black border-brand-gold shadow-[0_0_15px_rgba(191,149,63,0.3)]'
      : 'text-gray-400 border-white/10 hover:border-brand-gold/30 hover:text-white');
  }

  function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  // ── Filter + Sort ──
  function getFiltered() {
    return PROJECT_DATA
      .filter(p => {
        if (activeFilters.category !== 'all' && p.category !== activeFilters.category) return false;
        if (activeFilters.location !== 'all' && p.location !== activeFilters.location) return false;
        if (activeFilters.status !== 'all' && p.status !== activeFilters.status) return false;
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
  function renderGallery() {
    const grid = document.getElementById('project-grid');
    if (!grid) return;
    const filtered = getFiltered();
    grid.innerHTML = '';

    document.getElementById('resultCount').textContent = filtered.length;

    const noRes = document.getElementById('noResults');
    if (noRes) {
      noRes.classList.toggle('hidden', filtered.length > 0);
      grid.classList.toggle('hidden', filtered.length === 0);
    }

    if (currentView === 'list') {
      grid.className = 'flex flex-col gap-4';
    } else {
      grid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-[400px] grid-flow-dense';
    }

    filtered.forEach(p => grid.appendChild(currentView === 'grid' ? gridCard(p) : listCard(p)));

    if (typeof gsap !== 'undefined') {
      gsap.from(grid.children, { y: 30, opacity: 0, duration: 0.5, stagger: 0.04, ease: 'power2.out', clearProps: 'all' });
    }
  }

  // ── Grid Card ──
  function gridCard(p) {
    const div = document.createElement('div');
    const imgSrc = p.img || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80';
    div.className = 'project-item group relative h-full w-full overflow-hidden rounded-sm cursor-pointer border border-white/5 hover:border-brand-gold/30 transition-colors duration-500' + (p.featured ? ' md:col-span-2' : '');
    div.dataset.category = p.category;

    const statusBadge = p.status === 'ongoing'
      ? '<span class="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full border border-green-500/30"><span class="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span><span class="text-[9px] text-green-300 font-heading uppercase tracking-wider">Ongoing</span></span>'
      : '';

    const pad = p.featured ? '10' : '8';
    const ptFrom = p.featured ? '40' : '32';
    const ptTo = p.featured ? '36' : '28';
    const headSize = p.featured ? '4xl' : '2xl';

    div.innerHTML = `
      ${statusBadge}
      <img src="${imgSrc}" alt="${p.title}" class="w-full h-full object-cover transition duration-[1.5s] group-hover:scale-110 grayscale group-hover:grayscale-0" loading="lazy">
      <div class="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition duration-500"></div>
      <div class="absolute bottom-0 left-0 w-full p-${pad} bg-gradient-to-t from-black via-black/90 to-transparent pt-${ptFrom} group-hover:pt-${ptTo} transition-all duration-500">
        <span class="text-brand-gold text-xs font-bold uppercase tracking-widest block font-heading mb-2">${p.category}</span>
        <h3 class="text-${headSize} font-bold text-white uppercase font-heading group-hover:pl-2 transition-all duration-300">${p.title}</h3>
        <p class="text-gray-400 text-sm mt-1 font-body opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">Client: ${p.client}</p>
        <div class="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 delay-200">
          <div><span class="block text-[10px] text-brand-gold uppercase tracking-wider font-body" data-i18n="common.location">Loc</span><span class="block text-xs text-white font-heading">${p.location}</span></div>
          <div><span class="block text-[10px] text-brand-gold uppercase tracking-wider font-body" data-i18n="common.area">Area</span><span class="block text-xs text-white font-heading">${p.area}</span></div>
          <div><span class="block text-[10px] text-brand-gold uppercase tracking-wider font-body" data-i18n="common.year">Year</span><span class="block text-xs text-white font-heading">${p.year}</span></div>
          <div><span class="block text-[10px] text-brand-gold uppercase tracking-wider font-body" data-i18n="common.status">Status</span><span class="block text-xs text-white font-heading">${capitalize(p.status)}</span></div>
        </div>
      </div>`;

    div.addEventListener('click', () => {
      if (typeof openLightbox === 'function') openLightbox(imgSrc, p.title + ' | ' + p.client);
    });
    return div;
  }

  // ── List Card ──
  function listCard(p) {
    const div = document.createElement('div');
    div.className = 'group flex items-center gap-6 p-4 border border-white/5 hover:border-brand-gold/30 rounded-sm cursor-pointer transition-all duration-300 hover:bg-white/5';

    const thumb = p.img
      ? `<img src="${p.img}" class="w-20 h-20 object-cover rounded-sm grayscale group-hover:grayscale-0 transition-all duration-500 shrink-0" loading="lazy">`
      : '<div class="w-20 h-20 bg-white/5 rounded-sm flex items-center justify-center shrink-0"><i class="fas fa-building text-gray-600 text-xl"></i></div>';

    const statusCls = p.status === 'ongoing'
      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
      : 'bg-brand-gold/10 text-brand-gold border border-brand-gold/20';

    div.innerHTML = `
      ${thumb}
      <div class="flex-grow min-w-0">
        <div class="flex items-center gap-3 mb-1 flex-wrap">
          <h3 class="text-lg font-bold text-white uppercase font-heading group-hover:text-brand-gold transition-colors">${p.title}</h3>
          <span class="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${statusCls}">${p.status}</span>
        </div>
        <p class="text-gray-400 text-sm font-body">Client: ${p.client}</p>
      </div>
      <div class="hidden md:flex items-center gap-8 shrink-0 text-center">
        <div><span class="block text-[10px] text-gray-500 uppercase tracking-wider font-heading">Location</span><span class="block text-sm text-white font-heading">${p.location}</span></div>
        <div><span class="block text-[10px] text-gray-500 uppercase tracking-wider font-heading">Area</span><span class="block text-sm text-white font-heading">${p.area}</span></div>
        <div><span class="block text-[10px] text-gray-500 uppercase tracking-wider font-heading">Year</span><span class="block text-sm text-white font-heading">${p.year}</span></div>
      </div>
      <i class="fas fa-arrow-right text-gray-600 group-hover:text-brand-gold transition-colors shrink-0"></i>`;

    div.addEventListener('click', () => {
      const imgSrc = p.img || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80';
      if (typeof openLightbox === 'function') openLightbox(imgSrc, p.title + ' | ' + p.client);
    });
    return div;
  }

  // ── Reset ──
  window.resetFilters = function () {
    activeFilters.category = 'all';
    activeFilters.location = 'all';
    activeFilters.status = 'all';
    activeFilters.search = '';
    const si = document.getElementById('projectSearch');
    if (si) si.value = '';
    document.querySelectorAll('#categoryFilters button, #locationFilters button, #statusFilters button').forEach(b => {
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
        currentView = btn.dataset.view;
        document.querySelectorAll('.view-toggle').forEach(b => {
          const isActive = b === btn;
          b.classList.toggle('bg-brand-gold', isActive);
          b.classList.toggle('text-black', isActive);
          b.classList.toggle('text-gray-500', !isActive);
        });
        renderGallery();
      });
    });
  }

  // ── Map Integration (embedded in projects page) ──
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
    const colors = { residential: '#FFD700', commercial: '#FF8C00', infrastructure: '#C0C0C0' };
    return colors[category] || '#FFD700';
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
        ? '<img src="' + p.img + '" alt="' + p.title + '" style="width:100%;height:140px;object-fit:cover;border-bottom:1px solid rgba(255,255,255,0.1);">'
        : '<div style="width:100%;height:140px;background:#111;display:flex;align-items:center;justify-content:center;"><i class="fas fa-building" style="font-size:2rem;color:#333;"></i></div>';

      const marker = L.marker(p.coordinates, { icon })
        .addTo(projectMap)
        .bindPopup(
          '<div style="font-family:Oswald,sans-serif;">' +
          '<div style="overflow:hidden;">' + imgHtml + '</div>' +
          '<div style="padding:16px;">' +
          '<h3 style="color:#FFD700;font-weight:bold;text-transform:uppercase;letter-spacing:0.1em;font-size:1rem;margin:0 0 4px;">' + p.title + '</h3>' +
          '<p style="font-size:0.75rem;color:#fff;margin:0 0 8px;"><span style="color:#666;">Client:</span> ' + p.client + '</p>' +
          '<div style="display:flex;gap:6px;">' +
          '<span style="font-size:9px;background:#FFD700;color:#000;padding:2px 8px;font-weight:bold;text-transform:uppercase;letter-spacing:0.05em;">' + p.category + '</span>' +
          '<span style="font-size:9px;color:#999;border:1px solid rgba(255,255,255,0.1);padding:2px 8px;text-transform:uppercase;letter-spacing:0.05em;">' + p.location + '</span>' +
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
    const galleryBtn = document.getElementById('galleryViewBtn');
    const mapBtn = document.getElementById('mapViewBtn');
    const galleryCont = document.getElementById('galleryContainer');
    const mapCont = document.getElementById('mapContainer');

    if (!galleryBtn || !mapBtn) return;

    galleryBtn.addEventListener('click', () => {
      galleryCont.classList.remove('hidden');
      mapCont.classList.add('hidden');
      galleryBtn.classList.add('bg-brand-gold', 'text-black');
      galleryBtn.classList.remove('text-gray-400');
      mapBtn.classList.remove('bg-brand-gold', 'text-black');
      mapBtn.classList.add('text-gray-400');
    });

    mapBtn.addEventListener('click', () => {
      galleryCont.classList.add('hidden');
      mapCont.classList.remove('hidden');
      mapBtn.classList.add('bg-brand-gold', 'text-black');
      mapBtn.classList.remove('text-gray-400');
      galleryBtn.classList.remove('bg-brand-gold', 'text-black');
      galleryBtn.classList.add('text-gray-400');

      if (!projectMap) {
        initProjectMap();
      } else {
        projectMap.invalidateSize();
        renderMapMarkers();
      }
    });
  }

  // ── Init ──
  document.addEventListener('DOMContentLoaded', () => {
    initFilters();
    initEvents();
    initViewModeToggle();
    renderGallery();
  });
})();
