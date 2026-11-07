/** Scripts for the hero demo. Each builds in well under a second and reads well in ten lines. */
export const EXAMPLES = [
  {
    id: 'bracket',
    label: 'Bracket',
    code: `// A mounting bracket with four countersunk M3 holes
const T = 5;
const plate = roundedBox(60, T, 30, 4, { edges: 'vertical' }).onPlate();
const holes = grid(screwHole('M3', T, { type: 'countersunk' }), [2, 2], [46, 18])
  .map((h) => h.translate(0, T, 0));
const boss = cylinder(8, 12).onPlate().subtract(heatInsert('M4').translate(0, 12, 0));
return plate.subtract(holes).add(boss).name('bracket').color('#8fb3ff');`,
  },
  {
    id: 'knob',
    label: 'Knob',
    code: `// A scalloped knob from a revolved profile
const r = 16, h = 14;
const profile = polygon2d([[0, 0], [r, 0], [r, h - 2], [r - 2, h], [0, h]]).fillet(1);
let knob = revolve(profile, { segments: 96 });
knob = knob.subtract(polarArray(cylinder(2.6, h + 2), 12, { radius: r + 0.5 }));
const shaft = cylinder(3.1, 10).intersect(box(12, 12, 12).translate(-3.5, 0, 0));
return knob.subtract(shaft.translate(0, 4.5, 0)).name('knob').color('#d3a6ff');`,
  },
  {
    id: 'tag',
    label: 'Name tag',
    code: `// Raised lettering on a rounded tag with a lanyard slot
const tag = roundedBox(64, 3, 22, 4, { edges: 'vertical' }).onPlate()
  .subtract(extrude(slot(6, 1.6).translate(-26, 0), 5).translate(0, -1, 0));
const letters = text3d('TEMEN', { size: 11, height: 1.5, align: 'center', font: 'Nunito Bold' })
  .translate(4, 3, -4);
return { tag: tag.color('#ffd27f'), letters: letters.color('#2b2b2b') };`,
  },
  {
    id: 'hook',
    label: 'Hook',
    code: `// A wall hook: a rounded profile swept along a smooth path, on a screw plate
const plate = roundedBox(24, 4, 30, 4, { edges: 'vertical' }).onPlate()
  .subtract(screwHole('M4', 4, { type: 'countersunk' }).translate(0, 4, -9));
const curve = path([[0, 2, 8], [0, 2, 24], [0, 8, 30], [0, 16, 26], [0, 18, 18]]).smooth();
const arm = sweep(roundedRect(8, 4, 1.5), curve, { frame: 'upright' });
return plate.add(arm).name('hook').color('#c2e86b');`,
  },
  {
    id: 'vase',
    label: 'Vase',
    code: `// A twisted vase: a hexagon extruded with twist and scale, hollowed by a smaller twin
const wall = 1.8;
const twist = (r, h) => extrude(regularPolygon(6, r).fillet(5), h, { twist: 90, scale: 0.6, slices: 60 });
const vase = twist(22, 70).subtract(twist(22 - wall, 70).translate(0, wall, 0));
return vase.name('vase').color('#7fe0e0');`,
  },
];
