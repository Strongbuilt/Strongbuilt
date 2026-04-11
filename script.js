// Animations for headlines
const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-fade-in');
      obs.unobserve(entry.target);
    }
  });
});

document.querySelectorAll('h1, h2, h3').forEach(el => observer.observe(el));

// Lightbox for Projects
function openLightbox(imgSrc) {
  const lightbox = document.createElement('div');
  lightbox.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';

  const img = document.createElement('img');
  img.src = imgSrc;
  img.alt = 'Project image preview';
  img.className = 'max-w-full max-h-full';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'absolute top-4 right-4 text-white text-2xl';
  closeBtn.setAttribute('aria-label', 'Close lightbox');
  closeBtn.textContent = '\u00D7';
  closeBtn.addEventListener('click', function () { lightbox.remove(); });

  lightbox.addEventListener('click', function (e) { if (e.target === lightbox) lightbox.remove(); });

  lightbox.appendChild(img);
  lightbox.appendChild(closeBtn);
  document.body.appendChild(lightbox);
}



// Lead Gen CRM Form Modal
function openLeadForm() {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';

  const container = document.createElement('div');
  container.className = 'bg-white p-6 rounded shadow-lg w-96';

  const title = document.createElement('h3');
  title.className = 'text-xl mb-4';
  title.textContent = 'Get a Quote';

  const form = document.createElement('form');
  form.innerHTML = '<input type="text" name="name" placeholder="Name" class="w-full mb-2 p-2 border" required>' +
    '<input type="email" name="email" placeholder="Email" class="w-full mb-2 p-2 border" required>' +
    '<input type="tel" name="phone" placeholder="Phone" class="w-full mb-2 p-2 border" required>' +
    '<textarea name="message" placeholder="Message" class="w-full mb-2 p-2 border" required></textarea>' +
    '<button type="submit" class="bg-[#FFD700] text-black px-4 py-2">Submit</button>';
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    modal.remove();
  });

  const closeBtn = document.createElement('button');
  closeBtn.className = 'mt-4 text-gray-500';
  closeBtn.textContent = 'Close';
  closeBtn.addEventListener('click', function () { modal.remove(); });

  modal.addEventListener('click', function (e) { if (e.target === modal) modal.remove(); });

  container.appendChild(title);
  container.appendChild(form);
  container.appendChild(closeBtn);
  modal.appendChild(container);
  document.body.appendChild(modal);
}

// Progress bars animation
function animateProgressBars() {
  document.querySelectorAll('.progress-fill').forEach(fill => {
    fill.style.width = fill.dataset.width;
  });
}
window.addEventListener('load', animateProgressBars);

/* --- NAVIGATION MENU LOGIC --- */
const menuBtn = document.getElementById('menuToggle');
const navOverlay = document.getElementById('navOverlay');
const closeMenuBtn = document.getElementById('closeMenuBtn');
const navBackdrop = document.getElementById('navBackdrop');

function toggleMenu() {
  const isOpen = navOverlay.classList.contains('active');

  if (isOpen) {
    navOverlay.classList.remove('active');
    menuBtn.classList.remove('active');
    document.body.classList.remove('overflow-hidden');
  } else {
    navOverlay.classList.add('active');
    menuBtn.classList.add('active');
    document.body.classList.add('overflow-hidden');
  }
}

if (menuBtn) menuBtn.addEventListener('click', toggleMenu);
if (closeMenuBtn) closeMenuBtn.addEventListener('click', toggleMenu);
if (navBackdrop) navBackdrop.addEventListener('click', toggleMenu);

// Submenu Logic (Directly called from HTML)
// Submenu Logic (Event Delegation for robustness)
document.addEventListener('click', function (e) {
  const btn = e.target.closest('.sidebar-dropdown-btn');
  if (!btn) return;

  // Prevent default if it's a button (though type isn't submit)
  e.preventDefault();

  const submenu = btn.nextElementSibling;

  if (submenu && submenu.classList.contains('sidebar-submenu')) {
    // Toggle current
    submenu.classList.toggle('open');
    btn.classList.toggle('active');

    // Rotate icon
    const icon = btn.querySelector('i');
    // Rotation handled by CSS .active class on btn
  }
});

// Reveal Animations (Intersection Observer for better performance)
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal, .reveal-up").forEach(el => revealObserver.observe(el));

// Swiper Initialization (One robust instance)
if (typeof Swiper !== 'undefined') {
  const swiper = new Swiper('.swiper-container', {
    slidesPerView: 1,
    spaceBetween: 0,
    loop: true,
    effect: 'fade',
    fadeEffect: { crossFade: true },
    speed: 1500, // Cinematic slow transition
    autoplay: {
      delay: 6000,
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      renderBullet: function (index, className) {
        return '<span class="' + className + ' bg-brand-gold"></span>';
      },
    },
  });
}

// Stats Counter Animation
function animateValue(obj, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    obj.textContent = Math.floor(progress * (end - start) + start) + '+';
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = entry.target;
      const endValue = parseInt(target.getAttribute('data-target'));
      animateValue(target, 0, endValue, 2000);
      observer.unobserve(target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-counter').forEach(el => statsObserver.observe(el));

// Preloader Logic
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.style.opacity = '0';
    preloader.style.transition = 'opacity 0.5s ease';
    setTimeout(() => preloader.remove(), 500);
  }
});