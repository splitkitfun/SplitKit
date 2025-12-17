'use client';

import React from 'react';
import { PlayerState, xpForLevel } from '../types';

interface StatsPanelProps {
  state: PlayerState;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ state }) => {
  const wcXpNeeded = xpForLevel(state.skills.woodcutting.level);
  const wcProgress = (state.skills.woodcutting.xp / wcXpNeeded) * 100;
  
  const fishXpNeeded = xpForLevel(state.skills.fishing.level);
  const fishProgress = (state.skills.fishing.xp / fishXpNeeded) * 100;

  const nextWcUnlock = state.skills.woodcutting.level < 5 ? 'Oak (Lvl 5)' :
                       state.skills.woodcutting.level < 10 ? 'Willow (Lvl 10)' :
                       state.skills.woodcutting.level < 15 ? 'Maple (Lvl 15)' : 'Max!';

  const nextFishUnlock = state.skills.fishing.level < 5 ? 'Trout (Lvl 5)' : 'Max!';

  return (
    <div
      className="absolute left-1 top-1 bg-[#111]/80 border border-[#333] p-1.5 text-[8px]"
      style={{ fontFamily: 'monospace', width: '95px' }}
    >
      {/* Woodcutting */}
      <div className="mb-1.5">
        <div className="text-[#ffcc00] flex justify-between">
          <span>🪓 Woodcutting</span>
          <span>Lvl {state.skills.woodcutting.level}</span>
        </div>
        <div className="h-1 bg-[#333] mt-0.5">
          <div className="h-full bg-[#00ff88]" style={{ width: `${wcProgress}%` }} />
        </div>
        <div className="text-[#666] text-[6px]">Next: {nextWcUnlock}</div>
      </div>

      {/* Fishing */}
      <div className="mb-1.5">
        <div className="text-[#4488cc] flex justify-between">
          <span>🎣 Fishing</span>
          <span>Lvl {state.skills.fishing.level}</span>
        </div>
        <div className="h-1 bg-[#333] mt-0.5">
          <div className="h-full bg-[#4488cc]" style={{ width: `${fishProgress}%` }} />
        </div>
        <div className="text-[#666] text-[6px]">Next: {nextFishUnlock}</div>
      </div>

      {/* Coins */}
      <div className="text-[#ffd700] flex justify-between border-t border-[#333] pt-1">
        <span>🪙 Coins</span>
        <span>{state.coins}</span>
      </div>
    </div>
  );
};

