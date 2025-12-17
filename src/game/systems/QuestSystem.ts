import { PlayerState, QuestData } from '../types';
import { addXpToSkill } from './SaveSystem';
import { addToInventory } from './InventorySystem';

export const updateQuestProgress = (
  state: PlayerState,
  questId: string,
  progress: number
): { state: PlayerState; completed: boolean; rewards?: QuestData['reward'] } => {
  const quest = state.quests[questId];
  if (!quest || quest.completed) return { state, completed: false };

  const newState = { ...state };
  const newQuest = { ...quest, progress: Math.min(progress, quest.goal) };
  newState.quests = { ...newState.quests, [questId]: newQuest };

  if (newQuest.progress >= newQuest.goal && !newQuest.completed) {
    newQuest.completed = true;
    
    // Apply rewards
    if (newQuest.reward.xp) {
      for (const [skill, amount] of Object.entries(newQuest.reward.xp)) {
        if (skill in newState.skills) {
          addXpToSkill(newState.skills[skill as keyof typeof newState.skills], amount);
        }
      }
    }
    
    if (newQuest.reward.coins) {
      newState.coins += newQuest.reward.coins;
      const result = addToInventory(newState.inventory, 'coins', newQuest.reward.coins);
      newState.inventory = result.inventory;
    }

    return { state: newState, completed: true, rewards: newQuest.reward };
  }

  return { state: newState, completed: false };
};

export const getActiveQuests = (state: PlayerState): QuestData[] => {
  return Object.values(state.quests).filter(q => !q.completed);
};

export const getCompletedQuests = (state: PlayerState): QuestData[] => {
  return Object.values(state.quests).filter(q => q.completed);
};

export const hasUnlock = (state: PlayerState, unlock: string): boolean => {
  for (const quest of Object.values(state.quests)) {
    if (quest.completed && quest.reward.unlocks?.includes(unlock)) {
      return true;
    }
  }
  return false;
};

