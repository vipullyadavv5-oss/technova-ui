const fs = require('fs');

const extraCSS = `
/* --- User Requested Animations --- */
.card:hover {
  transform: translateY(-10px) !important;
  transition: transform 0.3s ease !important;
}

.typing {
  overflow: hidden;
  white-space: nowrap;
  border-right: 3px solid;
  width: 0;
  animation: typing-anim 2s steps(30, end) forwards;
}

@keyframes typing-anim {
  to { width: 100%; }
}

body {
  background: linear-gradient(-45deg, #2F80ED, #56CCF2, #6a11cb, #2575fc) !important;
  background-size: 400% 400% !important;
  animation: gradientMove 10s ease infinite !important;
}

@keyframes gradientMove {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
`;

fs.appendFileSync('style.css', extraCSS);

// Update HTML to use the new .typing class instead of .typing-text
let html = fs.readFileSync('index.html', 'utf-8');
html = html.replace(/class="typing-text"/g, 'class="typing"');
fs.writeFileSync('index.html', html);

console.log("Appended user styles successfully.");
