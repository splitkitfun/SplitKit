'use client';

import React, { useState } from 'react';
import { InventorySlot, ITEMS } from '../types';

interface BankPanelProps {
  inventory: InventorySlot[];
  bank: InventorySlot[];
  onClose: () => void;
  onDeposit: (itemId: string, quantity: number) => void;
  onWithdraw: (itemId: string, quantity: number) => void;
}

export const BankPanel: React.FC<BankPanelProps> = ({
  inventory,
  bank,
  onClose,
  onDeposit,
  onWithdraw,
}) => {
  const [selectedInv, setSelectedInv] = useState<string | null>(null);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);

  const invSlots = Array(28).fill(null).map((_, i) => inventory[i] || null);
  const bankSlots = Array(48).fill(null).map((_, i) => bank[i] || null);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div
        className="bg-[#1a1a1a] border-2 border-[#444] p-3"
        style={{ fontFamily: 'monospace' }}
      >
        <div className="flex justify-between items-center mb-2">
          <span className="text-[#ffd700] text-sm">Bank</span>
          <button
            onClick={onClose}
            className="text-[#f66] hover:text-[#f88] text-lg px-1"
          >
            ×
          </button>
        </div>

        <div className="flex gap-4">
          {/* Bank storage */}
          <div>
            <div className="text-[#888] text-xs mb-1">Bank Storage</div>
            <div className="grid grid-cols-6 gap-1 bg-[#111] p-1 border border-[#333]">
              {bankSlots.map((slot, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 bg-[#222] border flex items-center justify-center relative cursor-pointer ${
                    selectedBank === slot?.itemId ? 'border-[#ffd700]' : 'border-[#333]'
                  } ${slot ? 'hover:bg-[#333]' : ''}`}
                  onClick={() => slot && setSelectedBank(slot.itemId)}
                  title={slot ? `${ITEMS[slot.itemId]?.name} (${slot.quantity})` : ''}
                >
                  {slot && (
                    <>
                      <span className="text-sm">{ITEMS[slot.itemId]?.icon || '?'}</span>
                      {slot.quantity > 1 && (
                        <span className="absolute bottom-0 right-0 text-[6px] text-[#0f0]">
                          {slot.quantity}
                        </span>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
            {selectedBank && (
              <div className="mt-1 flex gap-1">
                <button
                  onClick={() => { onWithdraw(selectedBank, 1); setSelectedBank(null); }}
                  className="text-[8px] px-2 py-0.5 bg-[#333] text-[#fff] border border-[#555] hover:bg-[#444]"
                >
                  Take 1
                </button>
                <button
                  onClick={() => { onWithdraw(selectedBank, 10); setSelectedBank(null); }}
                  className="text-[8px] px-2 py-0.5 bg-[#333] text-[#fff] border border-[#555] hover:bg-[#444]"
                >
                  Take 10
                </button>
                <button
                  onClick={() => { onWithdraw(selectedBank, 9999); setSelectedBank(null); }}
                  className="text-[8px] px-2 py-0.5 bg-[#333] text-[#fff] border border-[#555] hover:bg-[#444]"
                >
                  Take All
                </button>
              </div>
            )}
          </div>

          {/* Inventory */}
          <div>
            <div className="text-[#888] text-xs mb-1">Inventory</div>
            <div className="grid grid-cols-4 gap-1 bg-[#111] p-1 border border-[#333]">
              {invSlots.map((slot, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 bg-[#222] border flex items-center justify-center relative cursor-pointer ${
                    selectedInv === slot?.itemId ? 'border-[#00ff88]' : 'border-[#333]'
                  } ${slot ? 'hover:bg-[#333]' : ''}`}
                  onClick={() => slot && setSelectedInv(slot.itemId)}
                  title={slot ? `${ITEMS[slot.itemId]?.name} (${slot.quantity})` : ''}
                >
                  {slot && (
                    <>
                      <span className="text-sm">{ITEMS[slot.itemId]?.icon || '?'}</span>
                      {slot.quantity > 1 && (
                        <span className="absolute bottom-0 right-0 text-[6px] text-[#0f0]">
                          {slot.quantity}
                        </span>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
            {selectedInv && (
              <div className="mt-1 flex gap-1">
                <button
                  onClick={() => { onDeposit(selectedInv, 1); setSelectedInv(null); }}
                  className="text-[8px] px-2 py-0.5 bg-[#333] text-[#fff] border border-[#555] hover:bg-[#444]"
                >
                  Deposit 1
                </button>
                <button
                  onClick={() => { onDeposit(selectedInv, 10); setSelectedInv(null); }}
                  className="text-[8px] px-2 py-0.5 bg-[#333] text-[#fff] border border-[#555] hover:bg-[#444]"
                >
                  Deposit 10
                </button>
                <button
                  onClick={() => { onDeposit(selectedInv, 9999); setSelectedInv(null); }}
                  className="text-[8px] px-2 py-0.5 bg-[#333] text-[#fff] border border-[#555] hover:bg-[#444]"
                >
                  Deposit All
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-2 text-[#888] text-xs">
          Press B near bank to toggle • ESC to close
        </div>
      </div>
    </div>
  );
};

