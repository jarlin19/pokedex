
const fs = require('fs');

const file = process.argv[2] || 'dist/pokedex-angular/index.html';
const original = fs.readFileSync(file, 'utf8');
let html = original;

// (1) Hoja de estilos sin el truco media="print" + onload
html = html.replace(/\s+media="print"\s+onload="this\.media='all'"/g, '');

// (2) Script inline de GitHub Pages (bloque completo, incluidos sus comentarios)
html = html.replace(
  /\s*<!-- Start Single Page Apps for GitHub Pages -->[\s\S]*?<!-- End Single Page Apps for GitHub Pages -->/,
  ''
);

if (html === original) {
  console.warn(`[fix-index] Aviso: no se encontró nada que ajustar en ${file}`);
} else {
  fs.writeFileSync(file, html);
  console.log(`[fix-index] index.html ajustado para CSP estricta: ${file}`);
}

// Verificación final: no debe quedar ningún <script> inline ni atributo onload
const hasInlineScript = /<script(?![^>]*\bsrc=)[^>]*>/i.test(html);
const hasOnload = /\sonload=/i.test(html);
if (hasInlineScript || hasOnload) {
  console.error(`[fix-index] ERROR: todavía hay script inline u onload en ${file}`);
  process.exit(1);
}
