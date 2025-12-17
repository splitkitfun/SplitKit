import { PlayerState, SkillData } from '../types';

const SAVE_KEY_PREFIX = 'splitkit_save';

const getSaveKey = (username: string | null, slot: number = 0): string => {
  if (username) {
    return `${SAVE_KEY_PREFIX}_${username.toLowerCase()}_slot${slot}`;
  }
  return `${SAVE_KEY_PREFIX}_guest_slot${slot}`;
};

export const defaultPlayerState = (): PlayerState => ({
  x: 320,
  y: 300,
  currentArea: 0,
  energy: 100,
  coins: 0,
  skills: {
    woodcutting: { xp: 0, level: 1 },
    fishing: { xp: 0, level: 1 },
  },
  inventory: [],
  bank: [],
  quests: {
    tutorial: {
      id: 'tutorial',
      name: 'Getting Started',
      description: 'Chop 5 logs for the Woodcutting Tutor',
      goal: 5,
      progress: 0,
      completed: false,
      reward: { xp: { woodcutting: 100 }, coins: 50 },
    },
    first_catch: {
      id: 'first_catch',
      name: 'First Catch',
      description: 'Catch 3 shrimp at the riverbank',
      goal: 3,
      progress: 0,
      completed: false,
      reward: { xp: { fishing: 75 }, coins: 25, unlocks: ['faster_chop'] },
    },
    supply_run: {
      id: 'supply_run',
      name: 'Supply Run',
      description: 'Deposit 10 logs in the bank',
      goal: 10,
      progress: 0,
      completed: false,
      reward: { coins: 100, unlocks: ['willow_hint'] },
    },
  },
  settings: {
    muted: false,
  },
});

export const saveGame = (state: PlayerState, username: string | null = null, slot: number = 0): void => {
  try {
    const key = getSaveKey(username, slot);
    localStorage.setItem(key, JSON.stringify(state));
    
    // Update slot metadata
    const metaKey = `${key}_meta`;
    const existingMeta = localStorage.getItem(metaKey);
    const meta = existingMeta ? JSON.parse(existingMeta) : { name: `Slot ${slot + 1}` };
    localStorage.setItem(metaKey, JSON.stringify({ ...meta, lastPlayed: Date.now() }));
  } catch (e) {
    console.warn('Failed to save game:', e);
  }
};

export const loadGame = (username: string | null = null, slot: number = 0): PlayerState | null => {
  try {
    const key = getSaveKey(username, slot);
    const data = localStorage.getItem(key);
    if (data) {
      const parsed = JSON.parse(data) as Partial<PlayerState>;
      // Merge with defaults to handle missing fields
      const defaults = defaultPlayerState();
      return {
        ...defaults,
        ...parsed,
        skills: {
          ...defaults.skills,
          ...parsed.skills,
        },
        quests: {
          ...defaults.quests,
          ...parsed.quests,
        },
        settings: {
          ...defaults.settings,
          ...parsed.settings,
        },
      };
    }
  } catch (e) {
    console.warn('Failed to load game:', e);
  }
  return null;
};

export const resetSave = (username: string | null = null, slot: number = 0): void => {
  const key = getSaveKey(username, slot);
  localStorage.removeItem(key);
  localStorage.removeItem(`${key}_meta`);
};

export const addXpToSkill = (skill: SkillData, amount: number): { leveledUp: boolean; newLevel: number } => {
  skill.xp += amount;
  const xpForNext = Math.floor(50 * Math.pow(skill.level, 1.5));
  let leveledUp = false;
  while (skill.xp >= xpForNext && skill.level < 99) {
    skill.xp -= xpForNext;
    skill.level++;
    leveledUp = true;
  }
  return { leveledUp, newLevel: skill.level };
};
