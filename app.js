/* ============================================
   NeoBank – Shared App JavaScript
   ============================================ */

// ---- Dark Mode Toggle ----
const THEME_KEY = 'neobank-theme';

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  // Update all toggle buttons on the page
  document.querySelectorAll('#themeToggle, .theme-toggle').forEach(btn => {
    btn.textContent = theme === 'dark' ? '☀️' : '🌙';
    btn.title = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
  });
  localStorage.setItem(THEME_KEY, theme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

// Apply saved theme on load
(function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) || 'light';
  applyTheme(saved);
})();

// Attach theme toggles once DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('#themeToggle, .theme-toggle').forEach(btn => {
    btn.addEventListener('click', toggleTheme);
  });

  // ---- Chart tab interactivity ----
  const tabs = document.querySelectorAll('.chart-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });

  // ---- Animate balance counter ----
  const balanceEl = document.querySelector('.balance-amount');
  if (balanceEl) {
    animateCounter(balanceEl, 0, 48920.5, 1400, '$', '.50');
  }

  // ---- Quick action ripple effect ----
  document.querySelectorAll('.quick-action').forEach(el => {
    el.addEventListener('click', function (e) {
      this.style.transform = 'scale(0.95)';
      setTimeout(() => (this.style.transform = ''), 150);
    });
  });

  // ---- Nav item active state in sidebar ----
  const currentPath = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav-item').forEach(item => {
    const href = item.getAttribute('href');
    if (href && href === currentPath) {
      document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    }
  });

  // ---- Smooth scroll for landing page anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---- Navbar scroll shadow (landing) ----
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        navbar.style.boxShadow = '0 4px 24px rgba(0,0,0,0.1)';
      } else {
        navbar.style.boxShadow = 'none';
      }
    }, { passive: true });
  }

  // ---- Spending bar animation ----
  const fills = document.querySelectorAll('.spending-fill, .progress-fill, .limit-fill');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const targetW = el.style.width;
          el.style.width = '0';
          requestAnimationFrame(() => {
            setTimeout(() => { el.style.transition = 'width 0.9s cubic-bezier(0.4, 0, 0.2, 1)'; el.style.width = targetW; }, 100);
          });
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.2 });
    fills.forEach(f => observer.observe(f));
  }

  // ---- Tooltip for card row ----
  document.querySelectorAll('.credit-card').forEach(card => {
    card.addEventListener('mouseenter', () => { card.style.zIndex = '10'; });
    card.addEventListener('mouseleave', () => { card.style.zIndex = ''; });
  });

  // ---- Animate chart path on load ----
  const chartPaths = document.querySelectorAll('.chart-svg path');
  chartPaths.forEach(path => {
    const length = path.getTotalLength ? path.getTotalLength() : 500;
    if (path.getTotalLength) {
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
      path.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
      requestAnimationFrame(() => {
        setTimeout(() => { path.style.strokeDashoffset = 0; }, 200);
      });
    }
  });

  // ---- Form input card number formatting ----
  const cardNumberInput = document.querySelector('input[placeholder="1234 5678 9012 3456"]');
  if (cardNumberInput) {
    cardNumberInput.addEventListener('input', function () {
      let val = this.value.replace(/\D/g, '').substring(0, 16);
      this.value = val.replace(/(.{4})/g, '$1 ').trim();
    });
  }

  const expiryInput = document.querySelector('input[placeholder="MM / YY"]');
  if (expiryInput) {
    expiryInput.addEventListener('input', function () {
      let val = this.value.replace(/\D/g, '').substring(0, 4);
      if (val.length >= 3) val = val.substring(0, 2) + ' / ' + val.substring(2);
      this.value = val;
    });
  }
});

// ---- Counter animation utility ----
function animateCounter(el, from, to, duration, prefix = '', suffix = '') {
  const originalHTML = el.innerHTML;
  const start = performance.now();
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const value = from + (to - from) * eased;
    const formatted = value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    if (suffix) {
      el.innerHTML = `${prefix}${formatted}<span style="font-size:1.6rem; opacity:0.85;">${suffix}</span>`;
    } else {
      el.textContent = `${prefix}${formatted}`;
    }
    if (progress < 1) requestAnimationFrame(update);
    else el.innerHTML = originalHTML;
  }
  requestAnimationFrame(update);
}
