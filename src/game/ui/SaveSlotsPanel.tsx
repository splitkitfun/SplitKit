'use client';

import React, { useState, useEffect } from 'react';
import { HOLDER_CONFIG } from '@/config/holder';

interface SaveSlot {
  id: number;
  name: string;
  lastPlayed: number | null;
  exists: boolean;
}

interface SaveSlotsPanelProps {
  isHolder: boolean;
  currentSlot: number;
  username: string | null;
  onSelectSlot: (slotId: number) => void;
  onCreateSlot: (slotId: number, name: string) => void;
  onRenameSlot: (slotId: number, name: string) => void;
  onDeleteSlot: (slotId: number) => void;
  onClose: () => void;
}

export const SaveSlotsPanel: React.FC<SaveSlotsPanelProps> = ({
  isHolder,
  currentSlot,
  username,
  onSelectSlot,
  onCreateSlot,
  onRenameSlot,
  onDeleteSlot,
  onClose,
}) => {
  const [slots, setSlots] = useState<SaveSlot[]>([]);
  const [editingSlot, setEditingSlot] = useState<number | null>(null);
  const [newName, setNewName] = useState('');
  const [creatingSlot, setCreatingSlot] = useState<number | null>(null);

  const maxSlots = isHolder ? HOLDER_CONFIG.HOLDER_SAVE_SLOTS : HOLDER_CONFIG.GUEST_SAVE_SLOTS;

  useEffect(() => {
    // Load slot metadata from localStorage
    const loadedSlots: SaveSlot[] = [];
    for (let i = 0; i < maxSlots; i++) {
      const key = username 
        ? `splitkit_save_${username.toLowerCase()}_slot${i}`
        : `splitkit_save_guest_slot${i}`;
      const metaKey = `${key}_meta`;
      
      const saveData = localStorage.getItem(key);
      const metaData = localStorage.getItem(metaKey);
      
      let slotMeta = { name: `Slot ${i + 1}`, lastPlayed: null as number | null };
      if (metaData) {
        try {
          slotMeta = JSON.parse(metaData);
        } catch (e) {
          // Ignore parse errors
        }
      }

      loadedSlots.push({
        id: i,
        name: slotMeta.name,
        lastPlayed: slotMeta.lastPlayed,
        exists: !!saveData,
      });
    }
    setSlots(loadedSlots);
  }, [maxSlots, username]);

  const formatLastPlayed = (timestamp: number | null) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const handleRename = (slotId: number) => {
    if (newName.trim()) {
      onRenameSlot(slotId, newName.trim());
      setSlots(prev => prev.map(s => s.id === slotId ? { ...s, name: newName.trim() } : s));
    }
    setEditingSlot(null);
    setNewName('');
  };

  const handleCreate = (slotId: number) => {
    const name = newName.trim() || `Slot ${slotId + 1}`;
    onCreateSlot(slotId, name);
    setSlots(prev => prev.map(s => s.id === slotId ? { ...s, name, exists: true } : s));
    setCreatingSlot(null);
    setNewName('');
  };

  return (
    <div 
      className="fixed inset-0 bg-[#0a0a0f]/90 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-[#151510] border-2 border-[#2a2a20] rounded-lg w-[360px] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-[#2a2a20] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">💾</span>
            <h2 
              className="text-[#c9aa71]"
              style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '11px' }}
            >
              Save Slots
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#6a6a5a] hover:text-[#aa6a6a] transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Slots */}
        <div className="p-4 space-y-2">
          {slots.map((slot) => (
            <div
              key={slot.id}
              className={`border rounded p-3 transition-colors ${
                slot.id === currentSlot
                  ? 'bg-[#1a2a1a] border-[#3a5a3a]'
                  : slot.exists
                    ? 'bg-[#1a1a15] border-[#2a2a20] hover:border-[#4a4a3a]'
                    : 'bg-[#151510] border-[#1a1a15] border-dashed'
              }`}
            >
              {editingSlot === slot.id ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder={slot.name}
                    className="flex-1 bg-[#0a0a0f] border border-[#3a3a3a] rounded px-2 py-1 text-[#c9aa71] text-xs"
                    style={{ fontFamily: 'monospace' }}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRename(slot.id);
                      if (e.key === 'Escape') setEditingSlot(null);
                    }}
                  />
                  <button
                    onClick={() => handleRename(slot.id)}
                    className="text-[#6a8a6a] hover:text-[#8aaa8a] text-xs"
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => setEditingSlot(null)}
                    className="text-[#8a6a6a] hover:text-[#aa8a8a] text-xs"
                  >
                    ✕
                  </button>
                </div>
              ) : creatingSlot === slot.id ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder={`Slot ${slot.id + 1}`}
                    className="flex-1 bg-[#0a0a0f] border border-[#3a3a3a] rounded px-2 py-1 text-[#c9aa71] text-xs"
                    style={{ fontFamily: 'monospace' }}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCreate(slot.id);
                      if (e.key === 'Escape') setCreatingSlot(null);
                    }}
                  />
                  <button
                    onClick={() => handleCreate(slot.id)}
                    className="text-[#6a8a6a] hover:text-[#8aaa8a] text-xs"
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => setCreatingSlot(null)}
                    className="text-[#8a6a6a] hover:text-[#aa8a8a] text-xs"
                  >
                    ✕
                  </button>
                </div>
              ) : slot.exists ? (
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span 
                        className={`text-xs ${slot.id === currentSlot ? 'text-[#8aaa8a]' : 'text-[#c9aa71]'}`}
                        style={{ fontFamily: 'monospace' }}
                      >
                        {slot.name}
                      </span>
                      {slot.id === currentSlot && (
                        <span className="text-[#6a8a6a] text-[10px]">(current)</span>
                      )}
                    </div>
                    <p className="text-[#5a5a4a] text-[10px]" style={{ fontFamily: 'monospace' }}>
                      Last played: {formatLastPlayed(slot.lastPlayed)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {slot.id !== currentSlot && (
                      <button
                        onClick={() => onSelectSlot(slot.id)}
                        className="px-2 py-1 bg-[#2a3a2a] text-[#6a8a6a] text-[10px] rounded hover:bg-[#3a4a3a] transition-colors"
                        style={{ fontFamily: 'monospace' }}
                      >
                        Load
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setEditingSlot(slot.id);
                        setNewName(slot.name);
                      }}
                      className="px-2 py-1 bg-[#2a2a3a] text-[#6a6a8a] text-[10px] rounded hover:bg-[#3a3a4a] transition-colors"
                      style={{ fontFamily: 'monospace' }}
                    >
                      Rename
                    </button>
                    {slot.id !== currentSlot && (
                      <button
                        onClick={() => {
                          if (confirm('Delete this save? This cannot be undone.')) {
                            onDeleteSlot(slot.id);
                            setSlots(prev => prev.map(s => s.id === slot.id ? { ...s, exists: false, lastPlayed: null } : s));
                          }
                        }}
                        className="px-2 py-1 bg-[#3a2a2a] text-[#8a6a6a] text-[10px] rounded hover:bg-[#4a3a3a] transition-colors"
                        style={{ fontFamily: 'monospace' }}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setCreatingSlot(slot.id)}
                  className="w-full text-center text-[#5a5a4a] text-xs hover:text-[#8a8a7a] transition-colors py-1"
                  style={{ fontFamily: 'monospace' }}
                >
                  + Create New Save
                </button>
              )}
            </div>
          ))}

          {/* Locked slots for non-holders */}
          {!isHolder && (
            <div className="border border-[#2a2a20] border-dashed rounded p-3 opacity-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🔒</span>
                  <span className="text-[#6a6a5a] text-xs" style={{ fontFamily: 'monospace' }}>
                    +2 slots with Holder Mode
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-4 pb-4">
          <p className="text-[#4a4a3a] text-[10px] text-center" style={{ fontFamily: 'monospace' }}>
            {isHolder ? 'Holder: 3 save slots' : 'Guest: 1 save slot'}
          </p>
        </div>
      </div>
    </div>
  );
};


