const fs = require('fs');

// 1. HTML modifications
const htmlFiles = ['index.html', 'dashboard.html', 'cards.html', 'transactions.html'];
const stickersHtml = `
  <!-- Background Enhancements -->
  <div class="bg-stickers">
    <div class="sticker sticker-1">💳</div>
    <div class="sticker sticker-2">🪙</div>
    <div class="sticker sticker-3">📊</div>
    <div class="sticker sticker-4">🔒</div>
    <div class="sticker sticker-5">🚀</div>
  </div>
`;

htmlFiles.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf-8');
    content = content.replace(/\$/g, '₹');
    content = content.replace(/John Doe/g, 'Viraj Mane');
    content = content.replace(/John/g, 'Viraj');
    content = content.replace(/"avatar">JD</g, '"avatar">VM<');
    content = content.replace(/title="JD"/g, 'title="VM"');
    
    if (!content.includes('bg-stickers')) {
      content = content.replace(/<body>/, '<body>\n' + stickersHtml);
    }
    fs.writeFileSync(file, content);
  }
});

// App.js modifications for dynamic text (like charts)
if (fs.existsSync('app.js')) {
    let content = fs.readFileSync('app.js', 'utf-8');
    content = content.replace(/\$/g, '₹');
    fs.writeFileSync('app.js', content);
}

// 2. CSS modifications
let css = fs.readFileSync('style.css', 'utf-8');

// Replace Root Variables
css = css.replace(/--primary:\s*#2F80ED;/, '--primary: #4F46E5;');
css = css.replace(/--primary-dark:\s*#1A6CD9;/, '--primary-dark: #3730A3;');
css = css.replace(/--primary-light:\s*#EBF3FE;/, '--primary-light: rgba(79, 70, 229, 0.1);');
css = css.replace(/--purple:\s*#7C3AED;/, '--purple: #06B6D4;');
css = css.replace(/--gradient:\s*linear-gradient[^;]+;/, '--gradient: linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%);');
css = css.replace(/--gradient-card:\s*linear-gradient[^;]+;/, '--gradient-card: linear-gradient(135deg, #3730A3 0%, #4F46E5 60%, #06B6D4 100%);');
css = css.replace(/--bg:\s*#F9FAFB;/, '--bg: linear-gradient(135deg, #EEF2FF 0%, #F8FAFC 100%);');
css = css.replace(/--bg-card:\s*#FFFFFF;/, '--bg-card: rgba(255, 255, 255, 0.65);');
css = css.replace(/--text:\s*#111827;/, '--text: #0F172A;');
css = css.replace(/--border:\s*#E5E7EB;/, '--border: rgba(229, 231, 235, 0.6);');
css = css.replace(/--border-light:\s*#F3F4F6;/, '--border-light: rgba(243, 244, 246, 0.5);');

// Body background-attachment
if (!css.includes('background-attachment: fixed')) {
    css = css.replace(/body\s*{([^}]+)}/, 'body {$1  background-attachment: fixed;\n}');
}

const glassmorphismCSS = `

/* --- GenZ Fintech Enhancements --- */
.card, .feature-card, .step-card, .testi-card, .pricing-card, .summary-tile, .txn-card-full, .chart-card, .spending-card, .txn-card, .mini-stat-card, .topbar, .navbar, .mockup-window {
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}
.sidebar {
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

/* Background Stickers */
.bg-stickers {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  pointer-events: none; z-index: -1; overflow: hidden;
}
.sticker {
  position: absolute;
  font-size: 15rem;
  opacity: 0.05;
  filter: blur(3px) drop-shadow(0 20px 30px rgba(0,0,0,0.5));
  animation: float 20s ease-in-out infinite;
  transform: rotate(-15deg);
}
.sticker-1 { top: -5%; left: -5%; animation-delay: 0s; animation-name: float1; }
.sticker-2 { bottom: 5%; right: -5%; font-size: 20rem; transform: rotate(15deg); animation-delay: -5s; animation-name: float2; }
.sticker-3 { top: 30%; left: 75%; font-size: 12rem; transform: rotate(25deg); animation-delay: -10s; animation-name: float3; }
.sticker-4 { bottom: -10%; left: 15%; font-size: 18rem; transform: rotate(-30deg); animation-delay: -15s; animation-name: float4; }
.sticker-5 { top: 15%; right: 25%; font-size: 10rem; transform: rotate(10deg); animation-delay: -7s; animation-name: float5; }

@keyframes float1 { 0%, 100% { transform: translateY(0) rotate(-15deg); } 50% { transform: translateY(-40px) rotate(-10deg); } }
@keyframes float2 { 0%, 100% { transform: translateY(0) rotate(15deg); } 50% { transform: translateY(-50px) rotate(20deg); } }
@keyframes float3 { 0%, 100% { transform: translateY(0) rotate(25deg); } 50% { transform: translateY(-30px) rotate(30deg); } }
@keyframes float4 { 0%, 100% { transform: translateY(0) rotate(-30deg); } 50% { transform: translateY(-40px) rotate(-25deg); } }
@keyframes float5 { 0%, 100% { transform: translateY(0) rotate(10deg); } 50% { transform: translateY(-20px) rotate(5deg); } }
`;

if (!css.includes('GenZ Fintech Enhancements')) {
    css += glassmorphismCSS;
}

fs.writeFileSync('style.css', css);
console.log('Done redesigning!');
