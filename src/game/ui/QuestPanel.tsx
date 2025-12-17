'use client';

import React from 'react';
import { QuestData } from '../types';

interface QuestPanelProps {
  quests: Record<string, QuestData>;
  onClose: () => void;
}

export const QuestPanel: React.FC<QuestPanelProps> = ({ quests, onClose }) => {
  const activeQuests = Object.values(quests).filter(q => !q.completed);
  const completedQuests = Object.values(quests).filter(q => q.completed);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div
        className="bg-[#1a1a1a] border-2 border-[#444] p-3 w-64"
        style={{ fontFamily: 'monospace' }}
      >
        <div className="flex justify-between items-center mb-2">
          <span className="text-[#ffcc00] text-sm">Quests</span>
          <button
            onClick={onClose}
            className="text-[#f66] hover:text-[#f88] text-lg px-1"
          >
            ×
          </button>
        </div>

        {/* Active Quests */}
        <div className="mb-3">
          <div className="text-[#888] text-xs mb-1 border-b border-[#333] pb-1">
            Active ({activeQuests.length})
          </div>
          {activeQuests.length === 0 ? (
            <div className="text-[#555] text-xs">No active quests</div>
          ) : (
            activeQuests.map(quest => (
              <div key={quest.id} className="mb-2 p-1 bg-[#222] border border-[#333]">
                <div className="text-[#ffcc00] text-xs">{quest.name}</div>
                <div className="text-[#aaa] text-[10px]">{quest.description}</div>
                <div className="mt-1">
                  <div className="h-1.5 bg-[#333] rounded overflow-hidden">
                    <div
                      className="h-full bg-[#00ff88]"
                      style={{ width: `${(quest.progress / quest.goal) * 100}%` }}
                    />
                  </div>
                  <div className="text-[#888] text-[8px] mt-0.5">
                    {quest.progress} / {quest.goal}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Completed Quests */}
        <div>
          <div className="text-[#888] text-xs mb-1 border-b border-[#333] pb-1">
            Completed ({completedQuests.length})
          </div>
          {completedQuests.map(quest => (
            <div key={quest.id} className="mb-1 p-1 bg-[#1a2a1a] border border-[#2a3a2a]">
              <div className="text-[#4a8a4a] text-xs flex items-center gap-1">
                <span>✓</span>
                <span>{quest.name}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-2 text-[#888] text-xs">
          Press Q to toggle • ESC to close
        </div>
      </div>
    </div>
  );
};

