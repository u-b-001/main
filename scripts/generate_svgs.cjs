const fs = require('fs');
const path = require('path');
const outDir = path.join(process.cwd(), 'public', 'assets', 'svg');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const svgs = {
  'mosai-logo.svg': `<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 10 c 0,25 0,25 15,25 c 10,0 15,-10 15,-20 M48 10 c 0,25 0,25 15,25 c 10,0 15,-10 15,-20 M78 10 c 0,25 0,25 15,25 c 10,0 15,-10 15,-20" fill="none" stroke="#a92a34" stroke-width="3" stroke-linecap="round"/>
    <path d="M10 10 h 90" stroke="#a92a34" stroke-width="3" stroke-linecap="round"/>
    <text x="55" y="52" font-family="sans-serif" font-weight="bold" font-size="18" fill="#a92a34" text-anchor="middle" letter-spacing="1">MOSAI</text>
  </svg>`,
  
  'icon-fostering-friendship.svg': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>`,
  
  'icon-promoting-education.svg': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
  </svg>`,
  
  'icon-building-connections.svg': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    <path d="M2 12h20"/>
  </svg>`,
  
  'icon-stronger-together.svg': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.91 3.514C11.531 2.13 9.292 2.13 7.913 3.514L2.83 8.601a4.296 4.296 0 0 0 0 6.079l2.793 2.793a4.296 4.296 0 0 0 6.079 0l2.607-2.607.72.72c1.383 1.383 3.623 1.383 5.006 0l2.793-2.793a4.296 4.296 0 0 0 0-6.079l-4.912-4.913a4.296 4.296 0 0 0-6.079 0l-.927.927Z"/>
    <path d="M8 13l4-4"/><path d="M11.5 16.5l4-4"/><path d="M5 21v-3"/><path d="M20 21v-3"/>
  </svg>`,
  
  'flag-india.svg': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="48" fill="#fff" stroke="#e5e7eb" stroke-width="4"/>
    <path d="M2 50 A 48 48 0 0 1 98 50 Z" fill="#ff9933"/>
    <path d="M2 50 A 48 48 0 0 0 98 50 Z" fill="#138808"/>
    <rect x="2" y="33.3" width="96" height="33.3" fill="#fff"/>
    <circle cx="50" cy="50" r="14" fill="none" stroke="#000080" stroke-width="1.5"/>
    <circle cx="50" cy="50" r="2" fill="#000080"/>
    <path d="M50 36 L50 64 M36 50 L64 50 M40 40 L60 60 M40 60 L60 40" stroke="#000080" stroke-width="1"/>
  </svg>`,
  
  'flag-japan.svg': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="48" fill="#fff" stroke="#e5e7eb" stroke-width="4"/>
    <circle cx="50" cy="50" r="22" fill="#bc002d"/>
  </svg>`,
  
  'icon-knot.svg': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="48" fill="#fff" stroke="#e5e7eb" stroke-width="4"/>
    <path d="M35 35 Q 50 20 65 35 T 65 65 T 35 65 T 35 35" fill="none" stroke="#8b222d" stroke-width="5"/>
    <path d="M35 65 Q 50 50 65 35 M 35 35 Q 50 50 65 65" fill="none" stroke="#8b222d" stroke-width="5"/>
  </svg>`
};

for (const [name, content] of Object.entries(svgs)) {
  fs.writeFileSync(path.join(outDir, name), content);
  console.log('Created ' + name);
}
