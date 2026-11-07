/** Render public/og.png (1200×630, link previews) and public/hero.png (square, the hero card) from the demo examples. */
import { writeFileSync } from 'node:fs';
import { Project } from 'temencad/src/project.js';
import { buildProject } from 'temencad/src/headless.js';
import { colorHex } from 'temencad/src/export.js';
import { renderThumbnail } from './render.mjs';
import { EXAMPLES } from '../src/examples.js';

const code = EXAMPLES.map((e) => e.code);
// All four examples side by side
const script = `
const parts = [];
${code.map((c, i) => `{ const r = (() => { ${c.replace(/^\s*return\s+/m, 'return ')} })(); parts.push(...[r].flat().flatMap((x) => x instanceof Shape ? [x] : Object.values(x)).map((s) => s.translate(${[-48, 44, -40, 46][i]}, 0, ${[-32, -34, 34, 30][i]}))); }`).join('\n')}
return parts;
`;
const { meshes } = await buildProject(Project.fromScript(script));
writeFileSync(new URL('../public/og.png', import.meta.url), renderThumbnail(meshes, { width: 1200, height: 630, colorHex, supersample: 2 }));
writeFileSync(new URL('../public/hero.png', import.meta.url), renderThumbnail(meshes, { width: 900, height: 900, colorHex, supersample: 2 }));
console.log('wrote public/og.png and public/hero.png');
