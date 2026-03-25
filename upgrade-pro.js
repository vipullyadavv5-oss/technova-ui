const fs = require('fs');

// 1. UPDATE STYLE.CSS
let css = fs.readFileSync('style.css', 'utf-8');

// The new premium blue gradients
css = css.replace(/--primary:\s*#[a-fA-F0-9]{3,6};/, '--primary: #2F80ED;');
css = css.replace(/--purple:\s*#[a-fA-F0-9]{3,6};/, '--purple: #56CCF2;');
css = css.replace(/--gradient:\s*linear-gradient[^;]+;/, '--gradient: linear-gradient(135deg, #2F80ED 0%, #56CCF2 100%);');
css = css.replace(/--gradient-card:\s*linear-gradient[^;]+;/, '--gradient-card: linear-gradient(135deg, #1A6CD9 0%, #2F80ED 60%, #56CCF2 100%);');

// Pro upgrage CSS additions
const proCSS = `
/* ============================================
   PRO UI UPGRADES (Animations, 3D, Wow Features)
   ============================================ */
   
.relative { position: relative; }

/* Observers & Scroll Animations */
.fade-in-up {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
  will-change: opacity, transform;
}
.fade-in-up.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Bank Card 3D Tilt */
.tilt-card {
  transform-style: preserve-3d;
  transform: perspective(1000px);
  transition: transform 0.1s ease, box-shadow 0.3s ease;
  will-change: transform;
}
.tilt-card:hover {
  box-shadow: 0 30px 60px rgba(47, 128, 237, 0.3), 0 10px 20px rgba(0, 0, 0, 0.1);
}

/* Balance Toggle Eye */
.eye-toggle {
  cursor: pointer;
  opacity: 0.7;
  font-size: 1.2rem;
  transition: all 0.2s ease;
  margin-left: 10px;
}
.eye-toggle:hover { opacity: 1; transform: scale(1.1); }
.balance-hidden { filter: blur(6px); user-select: none; }

/* AI Insight Box */
.ai-insight-box {
  position: absolute;
  top: -10%; right: 0%;
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  padding: 12px 20px;
  border-radius: 12px;
  border: 1.5px solid rgba(47,128,237,0.3);
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  font-size: 12px; font-weight: 600; color: var(--primary-dark);
  animation: float-insight 6s ease-in-out infinite;
  z-index: 10;
  max-width: 200px; line-height: 1.5;
}

@keyframes float-insight {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.pulse-lock {
  animation: pulse-glow 2s infinite;
  border-radius: 50%;
}
@keyframes pulse-glow {
  0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
  70% { box-shadow: 0 0 0 15px rgba(34, 197, 94, 0); }
  100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
}

.typing-text {
  border-right: 3px solid var(--primary);
  white-space: nowrap;
  overflow: hidden;
  animation: typing 2.5s steps(40, end), blink-caret .75s step-end infinite;
}
@keyframes typing { from { max-width: 0 } to { max-width: 100% } }
@keyframes blink-caret { from, to { border-color: transparent } 50% { border-color: var(--primary) } }

.btn-glow { transition: all 0.3s ease; position: relative; overflow: hidden; }
.btn-glow:hover { transform: scale(1.05) translateY(-2px); box-shadow: 0 15px 30px rgba(47, 128, 237, 0.4); }

/* Sticky Navbar Blur Enhancement */
.navbar {
  background: rgba(255, 255, 255, 0.7) !important;
  backdrop-filter: blur(24px) saturate(180%) !important;
  -webkit-backdrop-filter: blur(24px) saturate(180%) !important;
  border-bottom: 1px solid rgba(0,0,0,0.05);
}
[data-theme="dark"] .navbar {
  background: rgba(15, 23, 42, 0.7) !important;
}
`;

if(!css.includes('PRO UI UPGRADES')) css += proCSS;
fs.writeFileSync('style.css', css);


// 2. UPDATE HTML FILES
const addChartJs = '<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>';

let dbHtml = fs.readFileSync('dashboard.html', 'utf-8');
if(!dbHtml.includes('eye-toggle')) {
  dbHtml = dbHtml.replace(/<div class="balance-amount">([^<]+)<\/div>/, '<div class="balance-amount" style="display:flex;align-items:center;"><span id="live-balance">$1</span> <span class="eye-toggle" id="toggle-balance" title="Show/Hide">👁️</span></div>');
}
if(dbHtml.includes('<svg class="chart-svg"')) {
  const chartReplacement = `
  <div style="position: relative; height: 180px; width: 100%;">
    <canvas id="expenseChartCanvas"></canvas>
    <div class="ai-insight-box">✨ <strong>AI Insight:</strong> You saved 15% on dining bills this month compared to average users!</div>
  </div>`;
  dbHtml = dbHtml.replace(/<div class="chart-area">[\s\S]*?<\/div>\s*<\/div>\s*<!-- Spending Card/, '<div class="chart-area">' + chartReplacement + '</div></div>\n        <!-- Spending Card');
}
if(!dbHtml.includes('chart.js')) {
  dbHtml = dbHtml.replace('</body>', '  ' + addChartJs + '\n</body>');
}
// Add tilt effect to the balance card
dbHtml = dbHtml.replace(/class="card balance-card"/, 'class="card balance-card tilt-card"');
fs.writeFileSync('dashboard.html', dbHtml);


let indexHtml = fs.readFileSync('index.html', 'utf-8');
indexHtml = indexHtml.replace(/<h1 class="hero-title heading-xl">([^<]+)<\/h1>/, '<h1 class="hero-title heading-xl"><span class="typing-text" style="display:inline-block">$1</span></h1>');
indexHtml = indexHtml.replace(/class="btn btn-primary([^"]*)"/g, 'class="btn btn-primary btn-glow$1"');
indexHtml = indexHtml.replace(/class="feature-card([^"]*)"/g, 'class="feature-card fade-in-up$1"');
indexHtml = indexHtml.replace(/class="stat-item([^"]*)"/g, 'class="stat-item fade-in-up$1"');
indexHtml = indexHtml.replace(/class="feature-icon icon-box-green"/g, 'class="feature-icon icon-box-green pulse-lock"');
fs.writeFileSync('index.html', indexHtml);


let cardsHtml = fs.readFileSync('cards.html', 'utf-8');
cardsHtml = cardsHtml.replace(/class="credit-card"/g, 'class="credit-card tilt-card"');
cardsHtml = cardsHtml.replace(/class="card-balance">([^<]+)<\/div>/g, `class="card-balance"><span class="blur-target">$1</span> <span class="eye-toggle" onclick="this.previousElementSibling.classList.toggle('balance-hidden')">👁️</span></div>`);
fs.writeFileSync('cards.html', cardsHtml);


// 3. REWRITE APP.JS
const appJsContent = `
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
      
      card.style.transform = \`perspective(1000px) rotateX(\${rotateX}deg) rotateY(\${rotateY}deg) scale(1.02)\`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = \`perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)\`;
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
// Call old drawChart if path exists
if(document.querySelector('.chart-svg path')) setTimeout(drawChart, 100);
`;

fs.writeFileSync('app.js', appJsContent);
console.log("Competition UI script completed seamlessly.");
