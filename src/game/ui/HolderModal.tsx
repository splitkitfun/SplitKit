'use client';

import React, { useState } from 'react';
import { HolderSaveData } from '@/holder/types';
import { HOLDER_CONFIG, DAILY_CLAIM_REWARDS } from '@/config/holder';
import { TOKEN_LIVE, TOKEN_MINT, SOL_MINT } from '@/config/bags';

interface HolderModalProps {
  isConnected: boolean;
  isHolder: boolean;
  holderModeEnabled: boolean;
  walletAddress: string | null;
  balance: number;
  holderData: HolderSaveData;
  isConnecting: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  onEnableHolderMode: () => void;
  onClose: () => void;
  onDailyClaim: () => void;
  onUpdateCosmetics: (cosmetics: HolderSaveData['cosmetics']) => void;
  onBuyToken?: () => Promise<void>;
  onRefreshHolderStatus?: () => Promise<void>;
}

type Tab = 'overview' | 'cosmetics' | 'claim';

export const HolderModal: React.FC<HolderModalProps> = ({
  isConnected,
  isHolder,
  holderModeEnabled,
  walletAddress,
  balance,
  holderData,
  isConnecting,
  onConnect,
  onDisconnect,
  onEnableHolderMode,
  onClose,
  onDailyClaim,
  onUpdateCosmetics,
  onBuyToken,
  onRefreshHolderStatus,
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [isBuying, setIsBuying] = useState(false);
  const [buyError, setBuyError] = useState<string | null>(null);
  const [buySuccess, setBuySuccess] = useState(false);

  const handleBuyToken = async () => {
    if (!TOKEN_LIVE || !onBuyToken) return;
    
    setIsBuying(true);
    setBuyError(null);
    setBuySuccess(false);
    
    try {
      await onBuyToken();
      setBuySuccess(true);
      
      // Refresh holder status after purchase
      if (onRefreshHolderStatus) {
        setTimeout(async () => {
          await onRefreshHolderStatus();
        }, 2000);
      }
    } catch (error: any) {
      setBuyError(error.message || 'Failed to complete purchase');
    } finally {
      setIsBuying(false);
    }
  };

  const canClaim = () => {
    if (!holderData.lastDailyClaim) return true;
    const cooldownMs = HOLDER_CONFIG.DAILY_CLAIM_COOLDOWN_HOURS * 60 * 60 * 1000;
    return Date.now() - holderData.lastDailyClaim >= cooldownMs;
  };

  const getNextClaimTime = () => {
    if (!holderData.lastDailyClaim) return null;
    const cooldownMs = HOLDER_CONFIG.DAILY_CLAIM_COOLDOWN_HOURS * 60 * 60 * 1000;
    const nextClaim = holderData.lastDailyClaim + cooldownMs;
    const remaining = nextClaim - Date.now();
    if (remaining <= 0) return null;
    
    const hours = Math.floor(remaining / (60 * 60 * 1000));
    const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
    return `${hours}h ${minutes}m`;
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  return (
    <div 
      className="fixed inset-0 bg-[#0a0a0f]/90 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-[#151510] border-2 border-[#2a2a20] rounded-lg w-[420px] max-h-[80vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2a2a20] to-[#1a1a15] px-4 py-3 border-b border-[#2a2a20] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">👑</span>
            <h2 
              className="text-[#c9aa71]"
              style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '12px' }}
            >
              Holder Mode
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#6a6a5a] hover:text-[#aa6a6a] transition-colors text-lg"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        {isHolder && holderModeEnabled && (
          <div className="flex border-b border-[#2a2a20]">
            {(['overview', 'cosmetics', 'claim'] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 text-xs capitalize transition-colors ${
                  activeTab === tab
                    ? 'bg-[#1a1a15] text-[#c9aa71] border-b-2 border-[#c9aa71]'
                    : 'text-[#6a6a5a] hover:text-[#9a9a8a]'
                }`}
                style={{ fontFamily: 'monospace' }}
              >
                {tab === 'claim' ? 'Daily Claim' : tab}
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {/* Not connected state */}
          {!isConnected && (
            <div className="space-y-4">
              <p className="text-[#9a9a8a] text-sm" style={{ fontFamily: 'monospace' }}>
                Connect your wallet to unlock exclusive holder benefits:
              </p>
              
              <div className="space-y-2">
                {[
                  { icon: '🏰', text: "Access to Founder's Grove (exclusive zone)" },
                  { icon: '👑', text: 'Holder title & golden nameplate' },
                  { icon: '🎁', text: 'Daily claim rewards (Essence + Rations)' },
                  { icon: '💾', text: 'Extra save slots (3 instead of 1)' },
                  { icon: '🌳', text: 'Ancient Trees & Golden Fish (higher XP)' },
                ].map((perk, i) => (
                  <div key={i} className="flex items-center gap-3 bg-[#1a1a15] border border-[#2a2a20] rounded p-2">
                    <span className="text-lg">{perk.icon}</span>
                    <span className="text-[#8a8a7a] text-xs" style={{ fontFamily: 'monospace' }}>
                      {perk.text}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 space-y-2">
                <button
                  onClick={onConnect}
                  disabled={isConnecting}
                  className="w-full py-3 bg-gradient-to-r from-[#c9aa71] to-[#daa520] text-[#1a1a0f] font-bold rounded border border-[#ffd700] hover:from-[#d9ba81] hover:to-[#eab530] transition-all disabled:opacity-50"
                  style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '10px' }}
                >
                  {isConnecting ? 'CONNECTING...' : 'CONNECT WALLET'}
                </button>
                
                <button
                  onClick={onClose}
                  className="w-full py-2 bg-[#1a1a15] text-[#6a6a5a] rounded border border-[#2a2a20] hover:border-[#4a4a3a] hover:text-[#8a8a7a] transition-all"
                  style={{ fontFamily: 'monospace', fontSize: '11px' }}
                >
                  Continue as Guest
                </button>
              </div>

              <p className="text-[#4a4a3a] text-[10px] text-center" style={{ fontFamily: 'monospace' }}>
                Requires {HOLDER_CONFIG.MIN_BALANCE}+ tokens to unlock holder perks
              </p>
            </div>
          )}

          {/* Connected but not holder */}
          {isConnected && !isHolder && (
            <div className="space-y-4 text-center">
              <div className="text-4xl mb-2">😔</div>
              <p className="text-[#aa8a8a] text-sm" style={{ fontFamily: 'monospace' }}>
                Wallet connected but no tokens found
              </p>
              <div className="bg-[#1a1a15] border border-[#2a2a20] rounded p-3">
                <p className="text-[#6a6a5a] text-xs" style={{ fontFamily: 'monospace' }}>
                  {formatAddress(walletAddress || '')}
                </p>
                <p className="text-[#8a8a7a] text-xs mt-1" style={{ fontFamily: 'monospace' }}>
                  Balance: {balance} tokens
                </p>
              </div>
              <p className="text-[#6a6a5a] text-xs" style={{ fontFamily: 'monospace' }}>
                You need at least {HOLDER_CONFIG.MIN_BALANCE} tokens to unlock Holder Mode
              </p>

              {/* Buy Token Button */}
              <div className="pt-2">
                <div className="relative group">
                  <button
                    onClick={handleBuyToken}
                    disabled={!TOKEN_LIVE || isBuying}
                    className={`w-full py-3 rounded border font-bold transition-all ${
                      TOKEN_LIVE
                        ? 'bg-gradient-to-r from-[#4a7aaa] to-[#6a9aca] text-white border-[#6a9aca] hover:from-[#5a8aba] hover:to-[#7aaada]'
                        : 'bg-[#2a2a2a] text-[#5a5a5a] border-[#3a3a3a] cursor-not-allowed'
                    }`}
                    style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '9px' }}
                  >
                    {isBuying ? (
                      'PROCESSING...'
                    ) : TOKEN_LIVE ? (
                      '🛒 BUY TOKEN (via Bags)'
                    ) : (
                      '🔒 TOKEN NOT LIVE YET'
                    )}
                  </button>
                  {!TOKEN_LIVE && (
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1a1a15] border border-[#3a3a3a] rounded px-2 py-1 text-[#8a8a7a] text-[9px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      Token launching soon!
                    </div>
                  )}
                </div>
                
                {buyError && (
                  <p className="text-[#aa6666] text-[10px] mt-2" style={{ fontFamily: 'monospace' }}>
                    {buyError}
                  </p>
                )}
                
                {buySuccess && (
                  <p className="text-[#66aa66] text-[10px] mt-2" style={{ fontFamily: 'monospace' }}>
                    Purchase successful! Refreshing status...
                  </p>
                )}
              </div>

              <div className="pt-2 space-y-2">
                <button
                  onClick={onDisconnect}
                  className="w-full py-2 bg-[#2a2a2a] text-[#8a8a8a] rounded border border-[#3a3a3a] hover:bg-[#3a3a3a] transition-all"
                  style={{ fontFamily: 'monospace', fontSize: '11px' }}
                >
                  Disconnect Wallet
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-2 text-[#6a6a5a] hover:text-[#8a8a7a] transition-all"
                  style={{ fontFamily: 'monospace', fontSize: '11px' }}
                >
                  Continue as Guest
                </button>
              </div>
            </div>
          )}

          {/* Connected and is holder but not enabled */}
          {isConnected && isHolder && !holderModeEnabled && (
            <div className="space-y-4 text-center">
              <div className="text-4xl mb-2">🎉</div>
              <p className="text-[#c9aa71] text-sm" style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '10px' }}>
                Token Holder Verified!
              </p>
              <div className="bg-[#1a2a1a] border border-[#2a4a2a] rounded p-3">
                <p className="text-[#6a8a6a] text-xs" style={{ fontFamily: 'monospace' }}>
                  {formatAddress(walletAddress || '')}
                </p>
                <p className="text-[#8aaa8a] text-xs mt-1" style={{ fontFamily: 'monospace' }}>
                  Balance: {balance} tokens ✓
                </p>
              </div>
              <button
                onClick={onEnableHolderMode}
                className="w-full py-3 bg-gradient-to-r from-[#c9aa71] to-[#daa520] text-[#1a1a0f] font-bold rounded border border-[#ffd700] hover:from-[#d9ba81] hover:to-[#eab530] transition-all"
                style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '10px' }}
              >
                ENABLE HOLDER MODE
              </button>
            </div>
          )}

          {/* Holder mode enabled - Overview tab */}
          {isConnected && isHolder && holderModeEnabled && activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-[#2a3a2a] to-[#1a2a1a] border border-[#3a5a3a] rounded p-3 text-center">
                <p className="text-[#8aaa8a] text-xs" style={{ fontFamily: 'monospace' }}>
                  Holder Mode Active
                </p>
                <p className="text-[#c9aa71] text-lg mt-1">👑 {formatAddress(walletAddress || '')}</p>
                <p className="text-[#6a8a6a] text-xs mt-1" style={{ fontFamily: 'monospace' }}>
                  {balance} tokens
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-[#8a8a7a] text-xs" style={{ fontFamily: 'monospace' }}>
                  Your Holder Resources:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#1a1a15] border border-[#2a2a20] rounded p-2 text-center">
                    <span className="text-lg">💎</span>
                    <p className="text-[#aa66ff] text-sm" style={{ fontFamily: 'monospace' }}>
                      {holderData.essence} Essence
                    </p>
                  </div>
                  <div className="bg-[#1a1a15] border border-[#2a2a20] rounded p-2 text-center">
                    <span className="text-lg">🍖</span>
                    <p className="text-[#88cc88] text-sm" style={{ fontFamily: 'monospace' }}>
                      {holderData.rations} Rations
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={onDisconnect}
                className="w-full py-2 bg-[#2a2a2a] text-[#8a8a8a] rounded border border-[#3a3a3a] hover:bg-[#3a3a3a] transition-all"
                style={{ fontFamily: 'monospace', fontSize: '11px' }}
              >
                Disconnect Wallet
              </button>
            </div>
          )}

          {/* Holder mode enabled - Cosmetics tab */}
          {isConnected && isHolder && holderModeEnabled && activeTab === 'cosmetics' && (
            <div className="space-y-4">
              <p className="text-[#8a8a7a] text-xs" style={{ fontFamily: 'monospace' }}>
                Customize your holder appearance:
              </p>

              {/* Title */}
              <div className="bg-[#1a1a15] border border-[#2a2a20] rounded p-3">
                <p className="text-[#c9aa71] text-xs mb-2" style={{ fontFamily: 'monospace' }}>
                  Title
                </p>
                <div className="flex flex-wrap gap-2">
                  {[null, 'Holder', 'Founder', 'Supporter'].map((title) => (
                    <button
                      key={title || 'none'}
                      onClick={() => onUpdateCosmetics({ ...holderData.cosmetics, title })}
                      className={`px-3 py-1 rounded text-xs transition-colors ${
                        holderData.cosmetics.title === title
                          ? 'bg-[#c9aa71] text-[#1a1a0f]'
                          : 'bg-[#2a2a20] text-[#8a8a7a] hover:bg-[#3a3a30]'
                      }`}
                      style={{ fontFamily: 'monospace' }}
                    >
                      {title || 'None'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cape Color */}
              <div className="bg-[#1a1a15] border border-[#2a2a20] rounded p-3">
                <p className="text-[#c9aa71] text-xs mb-2" style={{ fontFamily: 'monospace' }}>
                  Cape Color
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: null, name: 'None', color: '#4a4a4a' },
                    { id: 'gold', name: 'Gold', color: '#ffd700' },
                    { id: 'purple', name: 'Purple', color: '#9966ff' },
                    { id: 'emerald', name: 'Emerald', color: '#50c878' },
                  ].map((cape) => (
                    <button
                      key={cape.id || 'none'}
                      onClick={() => onUpdateCosmetics({ ...holderData.cosmetics, capeColor: cape.id })}
                      className={`px-3 py-1 rounded text-xs transition-colors flex items-center gap-2 ${
                        holderData.cosmetics.capeColor === cape.id
                          ? 'bg-[#2a3a2a] border border-[#4a6a4a]'
                          : 'bg-[#2a2a20] hover:bg-[#3a3a30]'
                      }`}
                      style={{ fontFamily: 'monospace' }}
                    >
                      <span 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: cape.color }}
                      />
                      <span className="text-[#8a8a7a]">{cape.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Nameplate */}
              <div className="bg-[#1a1a15] border border-[#2a2a20] rounded p-3">
                <p className="text-[#c9aa71] text-xs mb-2" style={{ fontFamily: 'monospace' }}>
                  Nameplate Style
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: null, name: 'Default' },
                    { id: 'gold_outline', name: 'Gold' },
                    { id: 'diamond', name: 'Diamond' },
                    { id: 'flame', name: 'Flame' },
                  ].map((style) => (
                    <button
                      key={style.id || 'none'}
                      onClick={() => onUpdateCosmetics({ ...holderData.cosmetics, nameplateStyle: style.id })}
                      className={`px-3 py-1 rounded text-xs transition-colors ${
                        holderData.cosmetics.nameplateStyle === style.id
                          ? 'bg-[#c9aa71] text-[#1a1a0f]'
                          : 'bg-[#2a2a20] text-[#8a8a7a] hover:bg-[#3a3a30]'
                      }`}
                      style={{ fontFamily: 'monospace' }}
                    >
                      {style.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Holder mode enabled - Daily Claim tab */}
          {isConnected && isHolder && holderModeEnabled && activeTab === 'claim' && (
            <div className="space-y-4 text-center">
              <div className="text-4xl mb-2">🎁</div>
              <p className="text-[#c9aa71] text-sm" style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '10px' }}>
                Daily Holder Claim
              </p>
              
              <div className="bg-[#1a1a15] border border-[#2a2a20] rounded p-4">
                <p className="text-[#8a8a7a] text-xs mb-3" style={{ fontFamily: 'monospace' }}>
                  Today's rewards:
                </p>
                <div className="flex justify-center gap-4">
                  <div className="text-center">
                    <span className="text-2xl">💎</span>
                    <p className="text-[#aa66ff] text-sm" style={{ fontFamily: 'monospace' }}>
                      +{DAILY_CLAIM_REWARDS.essence} Essence
                    </p>
                  </div>
                  <div className="text-center">
                    <span className="text-2xl">🍖</span>
                    <p className="text-[#88cc88] text-sm" style={{ fontFamily: 'monospace' }}>
                      +{DAILY_CLAIM_REWARDS.ration} Ration
                    </p>
                  </div>
                </div>
              </div>

              {canClaim() ? (
                <button
                  onClick={onDailyClaim}
                  className="w-full py-3 bg-gradient-to-r from-[#c9aa71] to-[#daa520] text-[#1a1a0f] font-bold rounded border border-[#ffd700] hover:from-[#d9ba81] hover:to-[#eab530] transition-all"
                  style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '10px' }}
                >
                  CLAIM NOW
                </button>
              ) : (
                <div className="space-y-2">
                  <button
                    disabled
                    className="w-full py-3 bg-[#2a2a2a] text-[#6a6a6a] rounded border border-[#3a3a3a] cursor-not-allowed"
                    style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '10px' }}
                  >
                    ALREADY CLAIMED
                  </button>
                  <p className="text-[#6a6a5a] text-xs" style={{ fontFamily: 'monospace' }}>
                    Next claim in: {getNextClaimTime()}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

