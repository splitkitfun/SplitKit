'use client';

import React from 'react';

interface EscapeMenuProps {
  muted: boolean;
  onResume: () => void;
  onToggleMute: () => void;
  onResetSave: () => void;
  onExitToHome: () => void;
  onOpenSaveSlots?: () => void;
}

export const EscapeMenu: React.FC<EscapeMenuProps> = ({
  muted,
  onResume,
  onToggleMute,
  onResetSave,
  onExitToHome,
  onOpenSaveSlots,
}) => {
  return (
    <div className="fixed inset-0 bg-[#0a0a0f]/95 flex items-center justify-center z-50">
      <div className="bg-[#151510] border-2 border-[#2a2a20] rounded-lg p-6 w-80 shadow-2xl">
        <h2 
          className="text-[#c9aa71] text-center mb-6"
          style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '14px' }}
        >
          PAUSED
        </h2>

        <div className="space-y-3">
          <button
            onClick={onResume}
            className="w-full py-3 bg-[#2a3a2a] hover:bg-[#3a4a3a] border border-[#4a5a4a] rounded text-[#8aaa8a] transition-colors"
            style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '10px' }}
          >
            RESUME
          </button>

          <button
            onClick={onToggleMute}
            className="w-full py-3 bg-[#2a2a3a] hover:bg-[#3a3a4a] border border-[#4a4a5a] rounded text-[#8a8aaa] transition-colors"
            style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '10px' }}
          >
            {muted ? '🔇 UNMUTE SOUND' : '🔊 MUTE SOUND'}
          </button>

          {onOpenSaveSlots && (
            <button
              onClick={onOpenSaveSlots}
              className="w-full py-3 bg-[#2a2a2a] hover:bg-[#3a3a3a] border border-[#4a4a4a] rounded text-[#8a8a8a] transition-colors"
              style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '10px' }}
            >
              💾 SAVE SLOTS
            </button>
          )}

          <div className="border-t border-[#2a2a20] my-4" />

          <button
            onClick={onResetSave}
            className="w-full py-3 bg-[#3a2a2a] hover:bg-[#4a3a3a] border border-[#5a4a4a] rounded text-[#aa8a8a] transition-colors"
            style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '10px' }}
          >
            RESET SAVE
          </button>

          <button
            onClick={onExitToHome}
            className="w-full py-3 bg-[#2a2a2a] hover:bg-[#3a3a3a] border border-[#4a4a4a] rounded text-[#8a8a8a] transition-colors"
            style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '10px' }}
          >
            EXIT TO HOME
          </button>
        </div>

        <p className="text-[#4a4a3a] text-center text-xs mt-6" style={{ fontFamily: 'monospace' }}>
          Press ESC to resume
        </p>
      </div>
    </div>
  );
};

