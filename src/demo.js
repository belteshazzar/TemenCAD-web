/**
 * Hero demo: a script on the left, the model it builds on the right, built by the real engine in a
 * worker and shown with the app's own viewer (slowly rotating).
 */
import { Viewer } from 'temencad/src/viewer.js';
import { EXAMPLES } from './examples.js';

const APP_URL = 'https://belteshazzar.github.io/TemenCAD/';

/** Minimal JavaScript highlighter for the read-only code panel. */
function highlight(code) {
  const esc = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  return esc(code)
    .replace(/(\/\/.*)$/gm, '<span class="c">$1</span>')
    .replace(/('(?:[^'\\]|\\.)*')/g, '<span class="s">$1</span>')
    .replace(/\b(const|let|return|import|from|export|function|new)\b/g, '<span class="k">$1</span>')
    .replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="n">$1</span>')
    .replace(/\b([a-zA-Z_]\w*)(?=\()/g, '<span class="f">$1</span>');
}

export function initDemo(root) {
  const tabs = root.querySelector('.demo-tabs');
  const code = root.querySelector('.demo-code');
  const canvas = root.querySelector('.demo-canvas');
  const status = root.querySelector('.demo-status');
  const open = root.querySelector('.demo-open');

  let viewer = null, worker = null, runId = 0, current = null;
  const ensure = () => {
    if (viewer) return;
    viewer = new Viewer(canvas);
    viewer.controls.autoRotate = true;
    viewer.controls.autoRotateSpeed = 1.2;
    viewer.controls.enableZoom = false;
    worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });
    worker.onmessage = (e) => {
      const msg = e.data;
      if (msg.type === 'ready') { status.textContent = ''; return; }
      if (msg.id !== runId) return;
      if (msg.type === 'result') {
        viewer.setMeshes(msg.meshes);
        const b = viewer.visibleBounds();
        if (b) viewer.frame(b, 1.15); else viewer.resetView();
        status.textContent = `${msg.meshes.length} part${msg.meshes.length === 1 ? '' : 's'} · ${msg.tris.toLocaleString()} triangles · built in ${msg.ms.toFixed(0)} ms`;
      } else {
        status.textContent = `Error: ${msg.message}`;
      }
    };
    worker.onerror = (e) => { status.textContent = `The live demo could not start (${e.message}).`; };
    status.textContent = 'Loading the geometry engine…';
  };

  function show(example) {
    current = example;
    code.innerHTML = highlight(example.code);
    for (const b of tabs.querySelectorAll('button')) b.classList.toggle('on', b.dataset.id === example.id);
    open.href = `${APP_URL}#script=${encodeURIComponent(example.code)}`;
    ensure();
    runId++;
    status.textContent = 'Building…';
    worker.postMessage({ type: 'run', id: runId, files: { 'main.js': example.code } });
  }

  for (const ex of EXAMPLES) {
    const b = document.createElement('button');
    b.type = 'button'; b.textContent = ex.label; b.dataset.id = ex.id;
    b.addEventListener('click', () => show(ex));
    tabs.appendChild(b);
  }
  // Start the engine only when the demo scrolls into view (it is 1 MB of wasm).
  const io = new IntersectionObserver((entries) => { if (entries.some((e) => e.isIntersecting)) { io.disconnect(); show(EXAMPLES[0]); } }, { rootMargin: '200px' });
  io.observe(root);
  code.innerHTML = highlight(EXAMPLES[0].code);
  tabs.querySelector('button').classList.add('on');
}
