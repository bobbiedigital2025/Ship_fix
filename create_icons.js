const fs = require('fs');
const path = require('path');

// Simple PNG header for a blue square icon
function createSimplePNG(size, color = '#3B82F6') {
  // This creates a very basic PNG data URL that browsers can display
  // For production, you'd want to use a proper image generation library
  const canvas = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
    <defs>
      <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#1E40AF;stop-opacity:1" />
      </linearGradient>
    </defs>
    <circle cx="256" cy="256" r="240" fill="url(#bgGradient)" stroke="#1E3A8A" stroke-width="8"/>
    <path d="M150 320 Q150 340 170 345 L340 345 Q360 340 360 320 L350 300 L160 300 Z" fill="#FFFFFF" stroke="#6B7280" stroke-width="3"/>
    <rect x="160" y="280" width="190" height="20" rx="10" fill="#F3F4F6" stroke="#9CA3AF" stroke-width="2"/>
    <rect x="180" y="240" width="30" height="40" rx="4" fill="#10B981" stroke="#047857" stroke-width="2"/>
    <rect x="220" y="230" width="30" height="50" rx="4" fill="#EF4444" stroke="#DC2626" stroke-width="2"/>
    <rect x="260" y="235" width="30" height="45" rx="4" fill="#F59E0B" stroke="#D97706" stroke-width="2"/>
    <text x="256" y="400" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="#FFFFFF">SF</text>
  </svg>`;
  
  return canvas;
}

// Create icons for all required sizes
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const publicDir = '/workspaces/Ship_fix/public';

sizes.forEach(size => {
  const svgContent = createSimplePNG(size);
  const filename = `icon-${size}.svg`;
  const filepath = path.join(publicDir, filename);
  
  fs.writeFileSync(filepath, svgContent);
  console.log(`Created ${filename}`);
});

console.log('All icon files created! Note: These are SVG files that browsers will render as needed.');
console.log('For production, consider converting to PNG using online tools or proper image libraries.');
