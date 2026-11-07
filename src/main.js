import './style.css';
import { initDemo } from './demo.js';

const CATALOG_URL = 'https://belteshazzar.github.io/TemenCAD-catalog/';

initDemo(document.getElementById('demo'));

// Live catalogue cards
(async () => {
  const grid = document.getElementById('catalog-grid');
  try {
    const res = await fetch(`${CATALOG_URL}index.json`);
    const { packages } = await res.json();
    grid.textContent = '';
    for (const p of packages.slice(0, 6)) {
      const a = document.createElement('a');
      a.className = 'card shape';
      a.href = `${CATALOG_URL}${p.package}`;
      a.title = `Download ${p.name}.temen`;
      const img = document.createElement('img'); img.src = CATALOG_URL + p.thumb; img.alt = ''; img.loading = 'lazy';
      const h = document.createElement('h3'); h.textContent = p.title;
      const d = document.createElement('p'); d.textContent = p.description;
      const m = document.createElement('small'); m.textContent = `${p.author} · ${p.license}`;
      a.append(img, h, d, m);
      grid.appendChild(a);
    }
  } catch {
    grid.innerHTML = '<p class="muted">The catalogue is not reachable right now.</p>';
  }
})();

// Reveal-on-scroll for sections
const io = new IntersectionObserver((entries) => { for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }, { threshold: 0.12 });
for (const el of document.querySelectorAll('.reveal')) io.observe(el);

document.getElementById('year').textContent = new Date().getFullYear();
