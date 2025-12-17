import { AreaDef } from '../types';

export const AREAS: AreaDef[] = [
  {
    id: 0,
    name: 'Lumbridge Woods',
    grassColors: [0x3b7a1a, 0x4a8c24, 0x3d7d1c, 0x458520, 0x367016],
    borderColor: 0x6b5344,
    trees: [
      { x: 150, y: 150, type: 'tree' },
      { x: 300, y: 100, type: 'tree' },
      { x: 480, y: 180, type: 'tree' },
      { x: 120, y: 350, type: 'tree' },
      { x: 550, y: 320, type: 'tree' },
      { x: 400, y: 400, type: 'oak' },
      { x: 250, y: 250, type: 'oak' },
    ],
    fishSpots: [],
    landmarks: [
      { type: 'bank', x: 80, y: 120, props: {} },
      { type: 'npc', x: 200, y: 220, props: { name: 'Woodcutting Tutor', color: 0x44aa44 } },
      { type: 'sign', x: 580, y: 240, props: { text: 'SWAMP →' } },
    ],
    connections: { right: 1 },
  },
  {
    id: 1,
    name: 'Draynor Swamp',
    grassColors: [0x2a5a2a, 0x3a6a38, 0x2d5d2d, 0x3b6b3b, 0x285828],
    borderColor: 0x3a4a3a,
    trees: [
      { x: 100, y: 120, type: 'willow' },
      { x: 500, y: 150, type: 'willow' },
      { x: 300, y: 380, type: 'willow' },
      { x: 180, y: 280, type: 'oak' },
      { x: 450, y: 350, type: 'oak' },
      { x: 550, y: 250, type: 'tree' },
    ],
    fishSpots: [],
    landmarks: [
      { type: 'sign', x: 60, y: 240, props: { text: '← WOODS' } },
      { type: 'sign', x: 580, y: 240, props: { text: 'RIVER →' } },
    ],
    connections: { left: 0, right: 2 },
  },
  {
    id: 2,
    name: 'Riverbank',
    grassColors: [0x4a8844, 0x5a9954, 0x4d8b47, 0x559850, 0x478340],
    borderColor: 0x5a7a5a,
    trees: [
      { x: 120, y: 100, type: 'tree' },
      { x: 550, y: 120, type: 'tree' },
    ],
    fishSpots: [
      { x: 200, y: 400, type: 'shrimp' },
      { x: 350, y: 420, type: 'shrimp' },
      { x: 500, y: 390, type: 'trout' },
    ],
    landmarks: [
      { type: 'sign', x: 60, y: 200, props: { text: '← SWAMP' } },
      { type: 'sign', x: 580, y: 200, props: { text: 'FOREST →' } },
      { type: 'dock', x: 320, y: 440, props: {} },
      { type: 'campfire', x: 300, y: 300, props: {} },
      { type: 'npc', x: 400, y: 280, props: { name: 'Fishing Tutor', color: 0x4488aa } },
    ],
    connections: { left: 1, right: 3 },
  },
  {
    id: 3,
    name: 'Forest Edge',
    grassColors: [0x2d6620, 0x3a7730, 0x306925, 0x387428, 0x2a6118],
    borderColor: 0x4a5a4a,
    trees: [
      { x: 100, y: 100, type: 'oak' },
      { x: 200, y: 180, type: 'oak' },
      { x: 350, y: 120, type: 'willow' },
      { x: 480, y: 200, type: 'willow' },
      { x: 150, y: 350, type: 'maple' },
      { x: 400, y: 380, type: 'maple' },
      { x: 550, y: 300, type: 'maple' },
    ],
    fishSpots: [],
    landmarks: [
      { type: 'sign', x: 60, y: 240, props: { text: '← RIVER' } },
      { type: 'hut', x: 500, y: 420, props: {} },
      { type: 'fence', x: 580, y: 100, props: { length: 300 } },
    ],
    connections: { left: 2 },
  },
];

export const AREA_WIDTH = 640;
export const AREA_HEIGHT = 480;
export const TILE_SIZE = 32;


