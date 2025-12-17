'use client';

import React from 'react';
import { InventorySlot, ITEMS } from '../types';

interface InventoryPanelProps {
  inventory: InventorySlot[];
  onClose: () => void;
  onItemClick?: (itemId: string) => void;
}

export const InventoryPanel: React.FC<InventoryPanelProps> = ({
  inventory,
  onClose,
  onItemClick,
}) => {
  const slots = Array(28).fill(null).map((_, i) => inventory[i] || null);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div
        className="bg-[#1a1a1a] border-2 border-[#444] p-3"
        style={{ fontFamily: 'monospace' }}
      >
        <div className="flex justify-between items-center mb-2">
          <span className="text-[#ffcc00] text-sm">Inventory</span>
          <button
            onClick={onClose}
            className="text-[#f66] hover:text-[#f88] text-lg px-1"
          >
            ×
          </button>
        </div>
        
        <div className="grid grid-cols-4 gap-1">
          {slots.map((slot, i) => (
            <div
              key={i}
              className={`w-10 h-10 bg-[#222] border border-[#333] flex items-center justify-center relative ${
                slot ? 'cursor-pointer hover:bg-[#333]' : ''
              }`}
              onClick={() => slot && onItemClick?.(slot.itemId)}
              title={slot ? `${ITEMS[slot.itemId]?.name || slot.itemId} (${slot.quantity})` : ''}
            >
              {slot && (
                <>
                  <span className="text-lg">{ITEMS[slot.itemId]?.icon || '?'}</span>
                  {slot.quantity > 1 && (
                    <span className="absolute bottom-0 right-0.5 text-[8px] text-[#0f0]">
                      {slot.quantity}
                    </span>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        <div className="mt-2 text-[#888] text-xs">
          Press I to toggle • Click item to use
        </div>
      </div>
    </div>
  );
};


