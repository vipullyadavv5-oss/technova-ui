const fs = require('fs');

let css = fs.readFileSync('style.css', 'utf-8');

// 1. Update text colors to white/light for readable contrast against the vibrant background
css = css.replace(/--text:\s*#[a-fA-F0-9]{3,6};/, '--text: #FFFFFF;');
css = css.replace(/--text:\s*rgba\([^)]+\);/, '--text: #FFFFFF;');

// Muted text should be translucent white
css = css.replace(/--text-muted:\s*#[a-fA-F0-9]{3,6};/, '--text-muted: rgba(255, 255, 255, 0.75);');
css = css.replace(/--text-muted:\s*rgba\([^)]+\);/, '--text-muted: rgba(255, 255, 255, 0.75);');

// 2. Change Cards to "Dark Glass" to prevent white backgrounds from washing out the white text
css = css.replace(/--bg-card:\s*#[a-fA-F0-9]{3,6};/, '--bg-card: rgba(15, 23, 42, 0.4);');
css = css.replace(/--bg-card:\s*rgba\([^)]+\);/, '--bg-card: rgba(15, 23, 42, 0.4);');

// 3. Update borders to be subtle white translucence
css = css.replace(/--border:\s*#[a-fA-F0-9]{3,6};/, '--border: rgba(255, 255, 255, 0.15);');
css = css.replace(/--border:\s*rgba\([^)]+\);/, '--border: rgba(255, 255, 255, 0.15);');

// 4. Update the navbar to match the dark glass setup
css = css.replace(/background:\s*rgba\(255,\s*255,\s*255,\s*0\.7\)\s*!important;/g, 'background: rgba(15, 23, 42, 0.5) !important;');

fs.writeFileSync('style.css', css);
console.log('Colors successfully swapped to Dark Glass mode for legibility.');
