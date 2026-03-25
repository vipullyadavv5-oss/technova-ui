const fs = require('fs');

const extraCSS = `
/* --- User Requested Feature (Fade Left & Float) --- */
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-12px); }
  100% { transform: translateY(0px); }
}

.floating {
  animation: float 4s ease-in-out infinite;
}

.fade-left {
  opacity: 0;
  transform: translateX(-40px);
  animation: fadeLeft 1s ease forwards;
}

@keyframes fadeLeft {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
`;

fs.appendFileSync('style.css', extraCSS);

// Update HTML to use the new .fade-left class on the left-side hero text container
let html = fs.readFileSync('index.html', 'utf-8');
html = html.replace(/<div class="hero-content">/g, '<div class="hero-content fade-left">');
fs.writeFileSync('index.html', html);

console.log("Appended user fade styles successfully.");
