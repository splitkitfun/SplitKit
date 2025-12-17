'use client';

import React from 'react';

interface SettingsPanelProps {
  muted: boolean;
  onToggleMute: () => void;
  onResetSave: () => void;
  onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  muted,
  onToggleMute,
  onResetSave,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div
        className="bg-[#1a1a1a] border-2 border-[#444] p-3 w-48"
        style={{ fontFamily: 'monospace' }}
      >
        <div className="flex justify-between items-center mb-3">
          <span className="text-[#ffcc00] text-sm">Settings</span>
          <button
            onClick={onClose}
            className="text-[#f66] hover:text-[#f88] text-lg px-1"
          >
            ×
          </button>
        </div>

        <div className="space-y-2">
          <button
            onClick={onToggleMute}
            className="w-full text-left text-xs px-2 py-1.5 bg-[#222] text-[#aaa] border border-[#333] hover:bg-[#333]"
          >
            {muted ? '🔇 Sound: OFF' : '🔊 Sound: ON'}
          </button>

          <button
            onClick={() => {
              if (confirm('Reset all progress? This cannot be undone!')) {
                onResetSave();
              }
            }}
            className="w-full text-left text-xs px-2 py-1.5 bg-[#2a1a1a] text-[#f66] border border-[#433] hover:bg-[#3a2a2a]"
          >
            🗑️ Reset Save
          </button>
        </div>

        <div className="mt-3 text-[#666] text-[8px] border-t border-[#333] pt-2">
          <div>Hotkeys:</div>
          <div>I - Inventory</div>
          <div>B - Bank (when near)</div>
          <div>Q - Quests</div>
          <div>ESC - Close panels</div>
          <div>SHIFT - Sprint</div>
        </div>
      </div>
    </div>
  );
};

