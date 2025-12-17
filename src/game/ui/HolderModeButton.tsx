'use client';

import React from 'react';

interface HolderModeButtonProps {
  isHolder: boolean;
  holderModeEnabled: boolean;
  onClick: () => void;
}

export const HolderModeButton: React.FC<HolderModeButtonProps> = ({
  isHolder,
  holderModeEnabled,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded border transition-all duration-200 ${
        holderModeEnabled && isHolder
          ? 'bg-gradient-to-r from-[#c9aa71] to-[#daa520] text-[#1a1a0f] border-[#ffd700] shadow-lg shadow-[#c9aa71]/30'
          : 'bg-[#1a1a15] text-[#8a8a7a] border-[#2a2a20] hover:border-[#4a4a3a] hover:text-[#aaaa9a]'
      }`}
      style={{ fontFamily: 'monospace', fontSize: '11px' }}
    >
      {holderModeEnabled && isHolder ? (
        <span className="flex items-center gap-1.5">
          <span>👑</span>
          <span>Holder Mode</span>
          <span className="text-[#1a1a0f]">✓</span>
        </span>
      ) : (
        <span className="flex items-center gap-1.5">
          <span>🔒</span>
          <span>Holder Mode</span>
        </span>
      )}
    </button>
  );
};


