'use client';

import React from 'react';
import { PlayerState, ITEMS, xpForLevel } from '../types';
import { HolderSaveData } from '@/holder/types';

type PanelType = 'none' | 'inventory' | 'bank' | 'quests' | 'settings';

interface GameHUDProps {
  state: PlayerState;
  activePanel: PanelType;
  username: string | null;
  onPanelChange: (panel: PanelType) => void;
  onDeposit: (itemId: string, quantity: number) => void;
  onWithdraw: (itemId: string, quantity: number) => void;
  onItemClick: (itemId: string) => void;
  onClosePanel: () => void;
  onOpenAssistant: () => void;
  onOpenLogin: () => void;
  isHolder?: boolean;
  holderModeEnabled?: boolean;
  holderData?: HolderSaveData;
  onOpenSaveSlots?: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  state,
  activePanel,
  username,
  onPanelChange,
  onDeposit,
  onWithdraw,
  onItemClick,
  onClosePanel,
  onOpenAssistant,
  onOpenLogin,
  isHolder = false,
  holderModeEnabled = false,
  holderData,
  onOpenSaveSlots,
}) => {
  const wcLevel = state.skills.woodcutting.level;
  const wcXp = state.skills.woodcutting.xp;
  const wcNext = xpForLevel(wcLevel);
  const wcProgress = Math.min((wcXp / wcNext) * 100, 100);

  const fishLevel = state.skills.fishing.level;
  const fishXp = state.skills.fishing.xp;
  const fishNext = xpForLevel(fishLevel);
  const fishProgress = Math.min((fishXp / fishNext) * 100, 100);

  return (
    <>
      {/* Left Panel - Skills/Stats */}
      <div className="absolute left-0 top-0 bottom-12 w-48 bg-[#0a0a0f]/90 border-r border-[#2a2a20] flex flex-col">
        {/* Profile section */}
        <div 
          className="p-3 border-b border-[#2a2a20] cursor-pointer hover:bg-[#1a1a15]"
          onClick={onOpenLogin}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#2a3a2a] rounded flex items-center justify-center text-lg">
              👤
            </div>
            <div>
              <div className="text-[#c9aa71] text-xs" style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '8px' }}>
                {username || 'Guest'}
              </div>
              <div className="text-[#6a6a5a] text-[10px]" style={{ fontFamily: 'monospace' }}>
                {state.coins} coins
              </div>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="flex-1 p-3 space-y-4 overflow-y-auto">
          <div className="text-[#8a8a7a] text-[10px] uppercase tracking-wider" style={{ fontFamily: 'monospace' }}>
            Skills
          </div>

          {/* Woodcutting */}
          <div className="bg-[#151510] border border-[#2a2a20] p-2 rounded">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[#c9aa71] text-xs" style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '8px' }}>
                🪓 Woodcutting
              </span>
              <span className="text-[#8a8a7a] text-[10px]" style={{ fontFamily: 'monospace' }}>
                Lvl {wcLevel}
              </span>
            </div>
            <div className="h-2 bg-[#1a1a15] rounded overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#5a8a4a] to-[#7aaa6a] transition-all duration-300"
                style={{ width: `${wcProgress}%` }}
              />
            </div>
            <div className="text-[#5a5a4a] text-[9px] mt-1" style={{ fontFamily: 'monospace' }}>
              {wcXp} / {wcNext} XP
            </div>
          </div>

          {/* Fishing */}
          <div className="bg-[#151510] border border-[#2a2a20] p-2 rounded">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[#4488cc] text-xs" style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '8px' }}>
                🎣 Fishing
              </span>
              <span className="text-[#8a8a7a] text-[10px]" style={{ fontFamily: 'monospace' }}>
                Lvl {fishLevel}
              </span>
            </div>
            <div className="h-2 bg-[#1a1a15] rounded overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#4a7aaa] to-[#6a9aca] transition-all duration-300"
                style={{ width: `${fishProgress}%` }}
              />
            </div>
            <div className="text-[#5a5a4a] text-[9px] mt-1" style={{ fontFamily: 'monospace' }}>
              {fishXp} / {fishNext} XP
            </div>
          </div>

          {/* Energy */}
          <div className="bg-[#151510] border border-[#2a2a20] p-2 rounded">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[#ffaa44] text-xs" style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '8px' }}>
                ⚡ Energy
              </span>
              <span className="text-[#8a8a7a] text-[10px]" style={{ fontFamily: 'monospace' }}>
                {Math.floor(state.energy)}%
              </span>
            </div>
            <div className="h-2 bg-[#1a1a15] rounded overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#aa8844] to-[#ccaa66] transition-all duration-300"
                style={{ width: `${state.energy}%` }}
              />
            </div>
          </div>
        </div>

        {/* Holder Resources (if holder mode enabled) */}
        {holderModeEnabled && isHolder && holderData && (
          <div className="p-3 border-t border-[#2a2a20]">
            <div className="text-[#8a8a7a] text-[10px] mb-2" style={{ fontFamily: 'monospace' }}>
              Holder Resources
            </div>
            <div className="flex gap-2">
              <div className="flex-1 bg-[#1a1a20] border border-[#2a2a30] rounded p-1.5 text-center">
                <span className="text-sm">💎</span>
                <p className="text-[#aa66ff] text-[10px]">{holderData.essence}</p>
              </div>
              <div className="flex-1 bg-[#1a201a] border border-[#2a302a] rounded p-1.5 text-center">
                <span className="text-sm">🍖</span>
                <p className="text-[#88cc88] text-[10px]">{holderData.rations}</p>
              </div>
            </div>
          </div>
        )}

        {/* AI Assistant button */}
        <div className="p-3 border-t border-[#2a2a20] space-y-2">
          <button
            onClick={onOpenAssistant}
            className="w-full py-2 bg-[#2a3a4a] hover:bg-[#3a4a5a] border border-[#4a5a6a] rounded text-[#8aaacc] text-xs transition-colors"
            style={{ fontFamily: 'monospace' }}
          >
            🤖 AI Assistant [F1]
          </button>
          {onOpenSaveSlots && (
            <button
              onClick={onOpenSaveSlots}
              className="w-full py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] border border-[#3a3a3a] rounded text-[#8a8a8a] text-xs transition-colors"
              style={{ fontFamily: 'monospace' }}
            >
              💾 Save Slots
            </button>
          )}
        </div>
      </div>

      {/* Right Panel - Inventory/Bank/Quests tabs */}
      <div className="absolute right-0 top-0 bottom-12 w-56 bg-[#0a0a0f]/90 border-l border-[#2a2a20] flex flex-col">
        {/* Tab buttons */}
        <div className="flex border-b border-[#2a2a20]">
          <button
            onClick={() => onPanelChange(activePanel === 'inventory' ? 'none' : 'inventory')}
            className={`flex-1 py-2 text-xs transition-colors ${
              activePanel === 'inventory' 
                ? 'bg-[#1a1a15] text-[#c9aa71] border-b-2 border-[#c9aa71]' 
                : 'text-[#6a6a5a] hover:text-[#9a9a8a]'
            }`}
            style={{ fontFamily: 'monospace' }}
          >
            📦 Inv
          </button>
          <button
            onClick={() => onPanelChange(activePanel === 'bank' ? 'none' : 'bank')}
            className={`flex-1 py-2 text-xs transition-colors ${
              activePanel === 'bank' 
                ? 'bg-[#1a1a15] text-[#c9aa71] border-b-2 border-[#c9aa71]' 
                : 'text-[#6a6a5a] hover:text-[#9a9a8a]'
            }`}
            style={{ fontFamily: 'monospace' }}
          >
            🏦 Bank
          </button>
          <button
            onClick={() => onPanelChange(activePanel === 'quests' ? 'none' : 'quests')}
            className={`flex-1 py-2 text-xs transition-colors ${
              activePanel === 'quests' 
                ? 'bg-[#1a1a15] text-[#c9aa71] border-b-2 border-[#c9aa71]' 
                : 'text-[#6a6a5a] hover:text-[#9a9a8a]'
            }`}
            style={{ fontFamily: 'monospace' }}
          >
            📜 Quest
          </button>
        </div>

        {/* Panel content */}
        <div className="flex-1 overflow-y-auto">
          {activePanel === 'inventory' && (
            <InventoryPanelInline
              inventory={state.inventory}
              onItemClick={onItemClick}
            />
          )}
          {activePanel === 'bank' && (
            <BankPanelInline
              inventory={state.inventory}
              bank={state.bank}
              onDeposit={onDeposit}
              onWithdraw={onWithdraw}
            />
          )}
          {activePanel === 'quests' && (
            <QuestPanelInline quests={state.quests} />
          )}
          {activePanel === 'none' && (
            <div className="p-4 text-center text-[#4a4a3a] text-xs" style={{ fontFamily: 'monospace' }}>
              Select a tab above
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// Inline versions for the docked panels
const InventoryPanelInline: React.FC<{
  inventory: PlayerState['inventory'];
  onItemClick: (itemId: string) => void;
}> = ({ inventory, onItemClick }) => {
  return (
    <div className="p-2">
      <div className="grid grid-cols-4 gap-1">
        {Array.from({ length: 28 }).map((_, i) => {
          const slot = inventory[i];
          return (
            <div
              key={i}
              className="aspect-square bg-[#151510] border border-[#2a2a20] rounded flex items-center justify-center relative cursor-pointer hover:border-[#4a4a3a] transition-colors"
              onClick={() => slot && onItemClick(slot.itemId)}
              title={slot ? `${ITEMS[slot.itemId]?.name || slot.itemId} x${slot.quantity}` : 'Empty'}
            >
              {slot && (
                <>
                  <span className="text-lg">{ITEMS[slot.itemId]?.icon || '?'}</span>
                  {slot.quantity > 1 && (
                    <span className="absolute bottom-0 right-0 text-[8px] text-[#c9aa71] bg-[#0a0a0f]/80 px-0.5 rounded-tl">
                      {slot.quantity}
                    </span>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const BankPanelInline: React.FC<{
  inventory: PlayerState['inventory'];
  bank: PlayerState['bank'];
  onDeposit: (itemId: string, quantity: number) => void;
  onWithdraw: (itemId: string, quantity: number) => void;
}> = ({ inventory, bank, onDeposit, onWithdraw }) => {
  return (
    <div className="p-2 space-y-3">
      <div>
        <div className="text-[#8a8a7a] text-[10px] mb-1" style={{ fontFamily: 'monospace' }}>
          Bank ({bank.length} items)
        </div>
        <div className="grid grid-cols-4 gap-1">
          {Array.from({ length: 16 }).map((_, i) => {
            const slot = bank[i];
            return (
              <div
                key={i}
                className="aspect-square bg-[#1a1a15] border border-[#2a2a20] rounded flex items-center justify-center relative cursor-pointer hover:border-[#4a4a3a] transition-colors"
                onClick={() => slot && onWithdraw(slot.itemId, 1)}
                title={slot ? `${ITEMS[slot.itemId]?.name || slot.itemId} x${slot.quantity} (click to withdraw)` : 'Empty'}
              >
                {slot && (
                  <>
                    <span className="text-sm">{ITEMS[slot.itemId]?.icon || '?'}</span>
                    {slot.quantity > 1 && (
                      <span className="absolute bottom-0 right-0 text-[7px] text-[#c9aa71] bg-[#0a0a0f]/80 px-0.5 rounded-tl">
                        {slot.quantity}
                      </span>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <div className="text-[#8a8a7a] text-[10px] mb-1" style={{ fontFamily: 'monospace' }}>
          Inventory (click to deposit)
        </div>
        <div className="grid grid-cols-4 gap-1">
          {Array.from({ length: 8 }).map((_, i) => {
            const slot = inventory[i];
            return (
              <div
                key={i}
                className="aspect-square bg-[#151510] border border-[#2a2a20] rounded flex items-center justify-center relative cursor-pointer hover:border-[#4a4a3a] transition-colors"
                onClick={() => slot && onDeposit(slot.itemId, 1)}
                title={slot ? `${ITEMS[slot.itemId]?.name || slot.itemId} x${slot.quantity} (click to deposit)` : 'Empty'}
              >
                {slot && (
                  <>
                    <span className="text-sm">{ITEMS[slot.itemId]?.icon || '?'}</span>
                    {slot.quantity > 1 && (
                      <span className="absolute bottom-0 right-0 text-[7px] text-[#c9aa71] bg-[#0a0a0f]/80 px-0.5 rounded-tl">
                        {slot.quantity}
                      </span>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const QuestPanelInline: React.FC<{
  quests: PlayerState['quests'];
}> = ({ quests }) => {
  const questList = Object.values(quests);
  
  return (
    <div className="p-2 space-y-2">
      {questList.map((quest) => (
        <div
          key={quest.id}
          className={`p-2 rounded border ${
            quest.completed 
              ? 'bg-[#1a2a1a] border-[#2a4a2a]' 
              : 'bg-[#151510] border-[#2a2a20]'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className={quest.completed ? 'text-[#6a8a6a]' : 'text-[#c9aa71]'}>
              {quest.completed ? '✓' : '○'}
            </span>
            <span 
              className={`text-xs ${quest.completed ? 'text-[#6a8a6a]' : 'text-[#c9aa71]'}`}
              style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '8px' }}
            >
              {quest.name}
            </span>
          </div>
          <p className="text-[#6a6a5a] text-[10px] mb-1" style={{ fontFamily: 'monospace' }}>
            {quest.description}
          </p>
          {!quest.completed && (
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-[#1a1a15] rounded overflow-hidden">
                <div 
                  className="h-full bg-[#c9aa71]"
                  style={{ width: `${(quest.progress / quest.goal) * 100}%` }}
                />
              </div>
              <span className="text-[#8a8a7a] text-[9px]" style={{ fontFamily: 'monospace' }}>
                {quest.progress}/{quest.goal}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

