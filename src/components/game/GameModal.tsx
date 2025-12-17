"use client";

import React, { useEffect } from "react";

type Props = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
};

export default function GameModal({ open, title, onClose, children }: Props) {
  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* panel */}
      <div 
        className="relative w-[520px] max-w-[92vw] rounded-xl border border-[#3a3a30] bg-[#1a1a15]/95 p-4 shadow-xl"
        style={{ fontFamily: 'monospace' }}
      >
        <div className="flex items-center justify-between gap-3">
          <div 
            className="text-sm font-bold tracking-wide text-[#c9aa71]"
            style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '11px' }}
          >
            {title}
          </div>
          <button
            onClick={onClose}
            className="rounded-md border border-[#3a3a30] px-2 py-1 text-xs text-[#9a9a8a] hover:bg-[#2a2a20]"
          >
            Esc
          </button>
        </div>

        <div className="mt-3 border-t border-[#2a2a20] pt-3 text-[#9a9a8a]">{children}</div>
      </div>
    </div>
  );
}


