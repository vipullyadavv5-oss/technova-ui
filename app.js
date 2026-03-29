
/* ============================================
   NEOBANK PRO INTERACTIVE JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initIntersectionObservers();
  initBalanceToggle();
  initTiltCards();
  
  if (document.getElementById('expenseChartCanvas')) {
    initChartJS();
  }
});

// 1. Theme persistence
function initTheme() {
  const toggleBtn = document.getElementById('themeToggle');
  if(!toggleBtn) return;
  const currentTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  toggleBtn.innerHTML = currentTheme === 'dark' ? '☀️' : '🌙';

  toggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    toggleBtn.innerHTML = newTheme === 'dark' ? '☀️' : '🌙';
  });
}

// 2. Intersection Observer (Scroll Fade-ins)
function initIntersectionObservers() {
  const elements = document.querySelectorAll('.fade-in-up');
  if(elements.length === 0) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, (index % 3) * 100);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  elements.forEach(el => observer.observe(el));
}

// 3. Balance Show/Hide Toggle
function initBalanceToggle() {
  const toggleBtn = document.getElementById('toggle-balance');
  const balanceEl = document.getElementById('live-balance');
  if(toggleBtn && balanceEl) {
    toggleBtn.addEventListener('click', () => {
      balanceEl.classList.toggle('balance-hidden');
    });
  }
}

// 4. Vanilla 3D Tilt Effect for Cards
function initTiltCards() {
  const tiltCards = document.querySelectorAll('.tilt-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
    });
  });
}

// 5. WOW Feature: Chart.js Animated Graph
function initChartJS() {
  const ctx = document.getElementById('expenseChartCanvas').getContext('2d');
  
  // Creates a beautiful gradient fill under the line graph
  const gradient = ctx.createLinearGradient(0, 0, 0, 200);
  gradient.addColorStop(0, 'rgba(47, 128, 237, 0.5)'); 
  gradient.addColorStop(1, 'rgba(86, 204, 242, 0)'); 
  
  setTimeout(() => {
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Expenses',
          data: [120, 190, 80, 250, 160, 310, 210],
          borderColor: '#2F80ED',
          backgroundColor: gradient,
          borderWidth: 3,
          pointBackgroundColor: '#FFFFFF',
          pointBorderColor: '#2F80ED',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 2500,
          easing: 'easeOutQuart'
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0F172A',
            padding: 12,
            titleFont: { family: 'Inter', size: 13 },
            bodyFont: { family: 'Inter', size: 14, weight: 'bold' },
            displayColors: false,
            callbacks: { label: (ctx) => '₹' + ctx.raw }
          }
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#6B7280', font: { family: 'Inter', size: 11 } } },
          y: { 
            grid: { color: '#E5E7EB', borderDash: [5, 5] }, 
            ticks: { color: '#6B7280', font: { family: 'Inter', size: 11 }, callback: (val) => '₹'+val },
            border: { display: false },
            beginAtZero: true
          }
        }
      }
    });
  }, 200); // 200ms delay to let UI render before heavy chart calculation
}

// Handle SVG Drawing logic for previous pages if Chart.js isn't used
function drawChart() {
  const path = document.querySelector('.chart-svg path');
  if(path) {
    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
    path.getBoundingClientRect(); // trigger reflow
    path.style.transition = path.style.WebkitTransition = 'stroke-dashoffset 2s ease-in-out';
    path.style.strokeDashoffset = '0';
  }
}
if(document.querySelector('.chart-svg path')) setTimeout(drawChart, 100);

// ============================================
// SEND MONEY MODAL LOGIC
// ============================================
const sendMoneyModal = document.getElementById('sendMoneyModal');
if (sendMoneyModal) {
  const headerBtn = document.getElementById('headerSendMoneyBtn');
  const balanceBtn = document.getElementById('balanceSendMoneyBtn');
  const closeBtn = document.getElementById('closeSendMoneyBtn');
  
  const tabBank = document.getElementById('tabBank');
  const tabUpi = document.getElementById('tabUpi');
  const bankForm = document.getElementById('bankForm');
  const upiForm = document.getElementById('upiForm');

  const openModal = () => {
    sendMoneyModal.classList.add('show');
  };

  if (headerBtn) headerBtn.addEventListener('click', openModal);
  if (balanceBtn) balanceBtn.addEventListener('click', openModal);

  closeBtn.addEventListener('click', () => {
    sendMoneyModal.classList.remove('show');
  });

  window.addEventListener('click', (e) => {
    if (e.target === sendMoneyModal) {
      sendMoneyModal.classList.remove('show');
    }
  });

  tabBank.addEventListener('click', () => {
    tabBank.classList.add('active');
    tabUpi.classList.remove('active');
    bankForm.classList.add('active');
    upiForm.classList.remove('active');
  });

  tabUpi.addEventListener('click', () => {
    tabUpi.classList.add('active');
    tabBank.classList.remove('active');
    upiForm.classList.add('active');
    bankForm.classList.remove('active');
  });

  const handleSendSubmit = (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const originalText = btn.innerText;
    
    btn.innerText = 'Sending...';
    btn.disabled = true;
    btn.style.opacity = '0.7';
    
    // Simulate API call
    setTimeout(() => {
      alert('Money sent successfully! 🎉');
      sendMoneyModal.classList.remove('show');
      btn.innerText = originalText;
      btn.disabled = false;
      btn.style.opacity = '1';
      e.target.reset();
      
      // Optionally update balance
      const balanceAmountEl = document.querySelector('.balance-amount');
      if (balanceAmountEl) {
        // Just a mock update
        balanceAmountEl.innerHTML = `₹48,820.<span style="font-size:1.6rem; opacity:0.85;">50</span>`;
      }
    }, 1500);
  };

  bankForm.addEventListener('submit', handleSendSubmit);
  upiForm.addEventListener('submit', handleSendSubmit);
}

