const fs = require('fs');
const tag = '\n  <script src="ai-assistant.js"></script>';
['dashboard.html','transactions.html','cards.html'].forEach(f => {
  let html = fs.readFileSync(f,'utf-8');
  if (!html.includes('ai-assistant.js')) {
    html = html.replace('</body>', tag + '\n</body>');
    fs.writeFileSync(f, html);
    console.log('Injected into', f);
  } else {
    console.log('Already injected in', f);
  }
});
