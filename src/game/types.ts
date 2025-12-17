// Core game types

export interface ItemDef {
  id: string;
  name: string;
  stackable: boolean;
  color: number;
  icon?: string;
}

export interface InventorySlot {
  itemId: string;
  quantity: number;
}

export interface SkillData {
  xp: number;
  level: number;
}

export interface QuestData {
  id: string;
  name: string;
  description: string;
  goal: number;
  progress: number;
  completed: boolean;
  reward: { xp?: Record<string, number>; coins?: number; unlocks?: string[] };
}

export interface PlayerState {
  x: number;
  y: number;
  currentArea: number;
  energy: number;
  coins: number;
  skills: {
    woodcutting: SkillData;
    fishing: SkillData;
  };
  inventory: InventorySlot[];
  bank: InventorySlot[];
  quests: Record<string, QuestData>;
  settings: {
    muted: boolean;
  };
}

export interface TreeType {
  id: string;
  name: string;
  lvl: number;
  xp: number;
  itemId: string;
  trunkColor: number;
  canopyColor: number;
}

export interface FishType {
  id: string;
  name: string;
  lvl: number;
  xp: number;
  itemId: string;
  cookedItemId: string;
}

export interface TreeObj {
  x: number;
  y: number;
  type: TreeType;
  trunk: Phaser.GameObjects.Rectangle;
  canopy: Phaser.GameObjects.Ellipse;
  depleted: boolean;
}

export interface FishSpot {
  x: number;
  y: number;
  type: FishType;
  sprite: Phaser.GameObjects.Ellipse;
  depleted: boolean;
}

export interface AreaDef {
  id: number;
  name: string;
  grassColors: number[];
  borderColor: number;
  trees: { x: number; y: number; type: string }[];
  fishSpots: { x: number; y: number; type: string }[];
  landmarks: LandmarkDef[];
  connections: { left?: number; right?: number; up?: number; down?: number };
}

export interface LandmarkDef {
  type: 'sign' | 'bank' | 'campfire' | 'fence' | 'dock' | 'hut' | 'npc';
  x: number;
  y: number;
  props?: Record<string, unknown>;
}

export const ITEMS: Record<string, ItemDef> = {
  logs: { id: 'logs', name: 'Logs', stackable: true, color: 0x5c3d2e, icon: '🪵' },
  oak_logs: { id: 'oak_logs', name: 'Oak Logs', stackable: true, color: 0x4a3728, icon: '🪵' },
  willow_logs: { id: 'willow_logs', name: 'Willow Logs', stackable: true, color: 0x4a4a3a, icon: '🪵' },
  maple_logs: { id: 'maple_logs', name: 'Maple Logs', stackable: true, color: 0x6a4a3a, icon: '🪵' },
  ancient_logs: { id: 'ancient_logs', name: 'Ancient Logs', stackable: true, color: 0x8b6914, icon: '✨' },
  raw_shrimp: { id: 'raw_shrimp', name: 'Raw Shrimp', stackable: true, color: 0xffaa88, icon: '🦐' },
  raw_trout: { id: 'raw_trout', name: 'Raw Trout', stackable: true, color: 0x88aaff, icon: '🐟' },
  raw_golden_fish: { id: 'raw_golden_fish', name: 'Golden Fish', stackable: true, color: 0xffd700, icon: '🐠' },
  cooked_shrimp: { id: 'cooked_shrimp', name: 'Cooked Shrimp', stackable: true, color: 0xff8866, icon: '🍤' },
  cooked_trout: { id: 'cooked_trout', name: 'Cooked Trout', stackable: true, color: 0xffcc88, icon: '🐟' },
  cooked_golden_fish: { id: 'cooked_golden_fish', name: 'Cooked Golden Fish', stackable: true, color: 0xffdd44, icon: '🐠' },
  coins: { id: 'coins', name: 'Coins', stackable: true, color: 0xffd700, icon: '🪙' },
  // Holder-only items (non-tradeable)
  essence: { id: 'essence', name: 'Essence', stackable: true, color: 0xaa66ff, icon: '💎' },
  ration: { id: 'ration', name: 'Ration', stackable: true, color: 0x88cc88, icon: '🍖' },
};

export const TREE_TYPES: Record<string, TreeType> = {
  tree: { id: 'tree', name: 'Tree', lvl: 1, xp: 25, itemId: 'logs', trunkColor: 0x5c3d2e, canopyColor: 0x2e8b2e },
  oak: { id: 'oak', name: 'Oak', lvl: 5, xp: 50, itemId: 'oak_logs', trunkColor: 0x4a3728, canopyColor: 0x1e6b1e },
  willow: { id: 'willow', name: 'Willow', lvl: 10, xp: 80, itemId: 'willow_logs', trunkColor: 0x4a4a3a, canopyColor: 0x5a8a4a },
  maple: { id: 'maple', name: 'Maple', lvl: 15, xp: 120, itemId: 'maple_logs', trunkColor: 0x6a4a3a, canopyColor: 0xcc6633 },
  // Holder-only tree
  ancient: { id: 'ancient', name: 'Ancient Tree', lvl: 1, xp: 200, itemId: 'ancient_logs', trunkColor: 0x8b6914, canopyColor: 0xdaa520 },
};

export const FISH_TYPES: Record<string, FishType> = {
  shrimp: { id: 'shrimp', name: 'Shrimp', lvl: 1, xp: 20, itemId: 'raw_shrimp', cookedItemId: 'cooked_shrimp' },
  trout: { id: 'trout', name: 'Trout', lvl: 5, xp: 50, itemId: 'raw_trout', cookedItemId: 'cooked_trout' },
  // Holder-only fish
  golden_fish: { id: 'golden_fish', name: 'Golden Fish', lvl: 1, xp: 100, itemId: 'raw_golden_fish', cookedItemId: 'cooked_golden_fish' },
};

export const xpForLevel = (lvl: number): number => Math.floor(50 * Math.pow(lvl, 1.5));

export const levelFromXp = (xp: number): number => {
  let level = 1;
  let totalXp = 0;
  while (totalXp + xpForLevel(level) <= xp && level < 99) {
    totalXp += xpForLevel(level);
    level++;
  }
  return level;
};

