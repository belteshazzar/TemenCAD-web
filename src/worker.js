/**
 * The real TemenCAD engine, for the live demo: Manifold wasm + the runner from the app package.
 * Same protocol as the app's worker: { type: 'run', id, files } -> { type: 'result' | 'error' }.
 */
import wasmUrl from 'manifold-3d/manifold.wasm?url';
import interUrl from 'temencad/src/assets/Inter-Regular-subset.ttf?url';
import nunitoUrl from 'temencad/src/assets/Nunito-Bold-subset.ttf?url';
import { init } from 'temencad/src/engine.js';
import { registerFont } from 'temencad/src/fonts.js';
import { runScript } from 'temencad/src/runner.js';

const loadFont = (name, url) => fetch(url).then((r) => r.arrayBuffer()).then((buf) => registerFont(name, buf)).catch(() => {});
const env = {
  makeUrl: (source) => URL.createObjectURL(new Blob([source], { type: 'text/javascript' })),
  revokeUrl: (url) => URL.revokeObjectURL(url),
};

const queue = [];
let ready = false;
self.onmessage = (e) => { if (ready) handle(e.data); else queue.push(e.data); };

Promise.all([init({ locateFile: () => wasmUrl }), loadFont('Inter', interUrl), loadFont('Nunito Bold', nunitoUrl)])
  .then(() => { ready = true; self.postMessage({ type: 'ready' }); for (const m of queue.splice(0)) handle(m); })
  .catch((err) => self.postMessage({ type: 'error', id: null, message: `Engine failed to load: ${err?.message ?? err}` }));

async function handle({ type, id, files }) {
  if (type !== 'run') return;
  try {
    const { meshes, tris, ms } = await runScript(files, () => {}, env);
    self.postMessage({ type: 'result', id, meshes, tris, ms }, meshes.flatMap((m) => [m.positions.buffer, m.indices.buffer]));
  } catch (err) {
    self.postMessage({ type: 'error', id, message: err.message ?? String(err) });
  }
}
