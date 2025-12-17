'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { PlayerState } from '@/game/types';
import { loadGame, saveGame, resetSave, defaultPlayerState } from '@/game/systems/SaveSystem';
import { GameHUD } from '@/game/ui/GameHUD';
import { EscapeMenu } from '@/game/ui/EscapeMenu';
import { AIAssistant } from '@/game/ui/AIAssistant';
import { LoginModal } from '@/game/ui/LoginModal';
import { HolderModeButton } from '@/game/ui/HolderModeButton';
import { HolderModal } from '@/game/ui/HolderModal';
import { SaveSlotsPanel } from '@/game/ui/SaveSlotsPanel';
import { MainSceneInstance } from '@/game/scenes/MainScene';
import { HolderSaveData, defaultHolderSaveData, HolderCosmetics } from '@/holder/types';
import { getHolderProvider } from '@/holder/HolderProvider';
import { HOLDER_CONFIG } from '@/config/holder';
import { VersionedTransaction } from '@solana/web3.js';
import GameModal from '@/components/game/GameModal';
import MarketPanel from '@/components/game/MarketPanel';

// Bags pre-launch config
const TOKEN_LIVE = process.env.NEXT_PUBLIC_TOKEN_LIVE === "true";
const TOKEN_MINT = process.env.NEXT_PUBLIC_TOKEN_MINT || "";
const BASE_MINT = process.env.NEXT_PUBLIC_BASE_MINT || "So11111111111111111111111111111111111111112";

function base64ToBytes(b64: string) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

type PanelType = 'none' | 'inventory' | 'bank' | 'quests' | 'settings';

export default function PlayPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const sceneRef = useRef<MainSceneInstance | null>(null);
  
  const [gameState, setGameState] = useState<PlayerState | null>(null);
  const [activePanel, setActivePanel] = useState<PanelType>('none');
  const [muted, setMuted] = useState(false);
  const [showEscMenu, setShowEscMenu] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showHolderModal, setShowHolderModal] = useState(false);
  const [showSaveSlots, setShowSaveSlots] = useState(false);
  const [marketOpen, setMarketOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [usernameLoaded, setUsernameLoaded] = useState(false);
  const [currentSlot, setCurrentSlot] = useState(0);
  const mutedRef = useRef(false);

  // Holder state
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isHolder, setIsHolder] = useState(false);
  const [holderBalance, setHolderBalance] = useState(0);
  const [holderModeEnabled, setHolderModeEnabled] = useState(false);
  const [holderData, setHolderData] = useState<HolderSaveData>(defaultHolderSaveData());
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  // Load username and holder data from localStorage
  useEffect(() => {
    const savedUsername = localStorage.getItem('splitkit_username');
    setUsername(savedUsername);
    
    // Load holder data
    const holderKey = savedUsername 
      ? `splitkit_holder_${savedUsername.toLowerCase()}`
      : 'splitkit_holder_guest';
    const savedHolder = localStorage.getItem(holderKey);
    if (savedHolder) {
      try {
        const parsed = JSON.parse(savedHolder);
        setHolderData({ ...defaultHolderSaveData(), ...parsed });
        if (parsed.holderModeEnabled) {
          setHolderModeEnabled(true);
        }
      } catch (e) {
        // Ignore
      }
    }
    
    setUsernameLoaded(true);
  }, []);

  // Wallet event listeners (only attach once)
  useEffect(() => {
    const provider = (window as any).solana;
    if (!provider?.isPhantom) return;

    const onConnect = () => {
      const pk = provider.publicKey?.toString?.();
      if (pk) setWalletAddress(pk);
    };
    const onDisconnect = () => setWalletAddress(null);
    const onAccountChanged = (pubKey: any) => {
      const pk = pubKey?.toString?.();
      setWalletAddress(pk ?? null);
    };

    provider.on?.("connect", onConnect);
    provider.on?.("disconnect", onDisconnect);
    provider.on?.("accountChanged", onAccountChanged);

    return () => {
      provider.removeListener?.("connect", onConnect);
      provider.removeListener?.("disconnect", onDisconnect);
      provider.removeListener?.("accountChanged", onAccountChanged);
    };
  }, []);

  // Save holder data
  const saveHolderData = useCallback((data: HolderSaveData) => {
    const key = username 
      ? `splitkit_holder_${username.toLowerCase()}`
      : 'splitkit_holder_guest';
    localStorage.setItem(key, JSON.stringify(data));
    setHolderData(data);
  }, [username]);

  const handleStateChange = useCallback((state: PlayerState) => {
    setGameState({ ...state });
  }, []);

  const closePanel = useCallback(() => {
    setActivePanel('none');
  }, []);

  // Handle escape key for menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showHolderModal) {
          setShowHolderModal(false);
        } else if (showSaveSlots) {
          setShowSaveSlots(false);
        } else if (showAssistant) {
          setShowAssistant(false);
        } else if (activePanel !== 'none') {
          setActivePanel('none');
        } else {
          setShowEscMenu(prev => !prev);
        }
      }
      if (e.key === 'F1') {
        e.preventDefault();
        setShowAssistant(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePanel, showAssistant, showHolderModal, showSaveSlots]);

  // Initialize Phaser game
  useEffect(() => {
    if (!usernameLoaded || gameRef.current || !containerRef.current) return;

    // Load saved state (with username prefix if logged in)
    const savedState = loadGame(username, currentSlot) || defaultPlayerState();
    setGameState(savedState);
    setMuted(savedState.settings.muted);

    // Dynamic import Phaser and scenes
    Promise.all([
      import('phaser'),
      import('@/game/scenes/BootScene'),
      import('@/game/scenes/MainScene'),
    ]).then(([Phaser, { createBootScene }, { createMainScene }]) => {
      const callbacks = {
        onStateChange: handleStateChange,
        onOpenInventory: () => setActivePanel(p => p === 'inventory' ? 'none' : 'inventory'),
        onOpenBank: () => setActivePanel(p => p === 'bank' ? 'none' : 'bank'),
        onOpenQuests: () => setActivePanel(p => p === 'quests' ? 'none' : 'quests'),
        onClosePanel: closePanel,
        getMuted: () => mutedRef.current,
        canAccessHolderZone: () => holderModeEnabled && isHolder,
        onHolderZoneBlocked: () => {
          // Show message that holder zone requires holder mode
          alert("Founder's Grove requires Holder Mode. Connect your wallet to access!");
        },
      };

      const BootScene = createBootScene(Phaser);
      const MainScene = createMainScene(Phaser);

      gameRef.current = new Phaser.Game({
        type: Phaser.AUTO,
        width: 640,
        height: 360,
        parent: containerRef.current!,
        backgroundColor: '#2d5a27',
        physics: { default: 'arcade' },
        scene: [BootScene, MainScene],
        pixelArt: true,
        scale: { 
          mode: Phaser.Scale.FIT, 
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
      });

      gameRef.current.events.once('ready', () => {
        gameRef.current!.scene.start('BootScene');
        
        setTimeout(() => {
          if (gameRef.current) {
            gameRef.current.scene.start('MainScene', { state: savedState, callbacks });
            const scene = gameRef.current.scene.getScene('MainScene');
            if (scene) {
              sceneRef.current = scene as MainSceneInstance;
            }
          }
        }, 100);
      });
    });

    return () => {
      if (gameState) {
        saveGame(gameState, username, currentSlot);
      }
      gameRef.current?.destroy(true);
      gameRef.current = null;
      sceneRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usernameLoaded, currentSlot]);

  // Save on state change
  useEffect(() => {
    if (gameState) {
      saveGame(gameState, username, currentSlot);
    }
  }, [gameState, username, currentSlot]);

  // Wallet connection handlers
  const handleConnectWallet = async () => {
    setIsConnecting(true);
    try {
      const provider = getHolderProvider();
      const address = await provider.connectWallet();
      
      if (address) {
        setWalletAddress(address);
        setIsWalletConnected(true);
        
        // Check holder status
        const status = await provider.checkHolderStatus(address);
        setIsHolder(status.isHolder);
        setHolderBalance(status.balance);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnectWallet = async () => {
    try {
      const provider = getHolderProvider();
      await provider.disconnectWallet();
      
      setWalletAddress(null);
      setIsWalletConnected(false);
      setIsHolder(false);
      setHolderBalance(0);
      setHolderModeEnabled(false);
      
      const newData = { ...defaultHolderSaveData(), cosmetics: holderData.cosmetics };
      saveHolderData(newData);
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  const handleEnableHolderMode = () => {
    if (isHolder) {
      setHolderModeEnabled(true);
      const newData = { ...holderData, holderModeEnabled: true };
      saveHolderData(newData);
    }
  };

  const handleDailyClaim = () => {
    if (!isHolder || !holderModeEnabled) return;

    const cooldownMs = HOLDER_CONFIG.DAILY_CLAIM_COOLDOWN_HOURS * 60 * 60 * 1000;
    if (holderData.lastDailyClaim && Date.now() - holderData.lastDailyClaim < cooldownMs) {
      return;
    }

    const newData = {
      ...holderData,
      lastDailyClaim: Date.now(),
      essence: holderData.essence + 1,
      rations: holderData.rations + 1,
    };
    saveHolderData(newData);
    
    // Add ration to game inventory
    if (sceneRef.current && gameState) {
      // The ration will be added via the holder data, could also add to inventory
    }
  };

  const handleUpdateCosmetics = (cosmetics: HolderCosmetics) => {
    const newData = { ...holderData, cosmetics };
    saveHolderData(newData);
  };

  // Connect wallet (only on user click)
  const connectWallet = async () => {
    const provider = (window as any).solana;
    if (!provider?.isPhantom) {
      alert("Phantom wallet not found.");
      return;
    }
    const res = await provider.connect();
    const pk = res?.publicKey?.toString?.() ?? provider.publicKey?.toString?.();
    if (pk) setWalletAddress(pk);
  };

  // Disconnect wallet
  const disconnectWallet = async () => {
    const provider = (window as any).solana;
    try {
      if (provider?.isPhantom && provider.isConnected) {
        await provider.disconnect();
      }
    } finally {
      setWalletAddress(null);
    }
  };

  // Buy token via Bags API
  const handleBuyToken = async () => {
    try {
      // PRE-LAUNCH gate
      if (!TOKEN_LIVE) {
        alert("Pre-launch: Buy is disabled until token is live.");
        return;
      }
      if (!TOKEN_MINT) {
        alert("Token mint not set yet.");
        return;
      }

      const provider = (window as any).solana;
      if (!provider?.isPhantom) {
        alert("Phantom wallet not found.");
        return;
      }

      // Use existing walletAddress if connected, otherwise connect
      let userPublicKey = walletAddress;
      if (!userPublicKey) {
        if (!provider.isConnected) await provider.connect();
        userPublicKey = provider.publicKey?.toString();
        if (userPublicKey) setWalletAddress(userPublicKey);
      }
      
      if (!userPublicKey) {
        alert("Wallet not connected.");
        return;
      }

      const buySolUi = 0.1;
      const amountLamports = Math.floor(buySolUi * 1_000_000_000);

      // 1) Quote
      const qs = new URLSearchParams({
        inputMint: BASE_MINT,
        outputMint: TOKEN_MINT,
        amount: String(amountLamports),
        slippageMode: "auto",
      });

      const quoteRes = await fetch(`/api/bags/quote?${qs.toString()}`, { cache: "no-store" });
      const quoteJson = await quoteRes.json();
      if (!quoteJson?.success) throw new Error(quoteJson?.error || "Quote failed");

      // 2) Swap build
      const swapRes = await fetch("/api/bags/swap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteResponse: quoteJson.response,
          userPublicKey,
        }),
      });

      const swapJson = await swapRes.json();
      if (!swapJson?.success) throw new Error(swapJson?.error || "Swap build failed");

      // 3) Deserialize tx → Phantom sign+send
      const b64 = swapJson.response.swapTransaction as string;
      if (!b64) throw new Error("Missing swapTransaction from Bags response.");

      const tx = VersionedTransaction.deserialize(base64ToBytes(b64));
      const result = await provider.signAndSendTransaction(tx);

      alert(`Swap sent: ${result.signature}`);
    } catch (e: any) {
      console.error(e);
      alert(e?.message ?? "Buy failed");
    }
  };

  // Refresh holder status
  const handleRefreshHolderStatus = async () => {
    if (!walletAddress) return;
    
    const provider = getHolderProvider();
    const status = await provider.checkHolderStatus(walletAddress);
    setIsHolder(status.isHolder);
    setHolderBalance(status.balance);
    
    if (status.isHolder && !holderModeEnabled) {
      // Auto-enable holder mode after successful purchase
      setHolderModeEnabled(true);
      const newData = { ...holderData, holderModeEnabled: true };
      saveHolderData(newData);
    }
  };

  const handleToggleMute = () => {
    setMuted(!muted);
    if (gameState) {
      setGameState({ ...gameState, settings: { ...gameState.settings, muted: !muted } });
    }
  };

  const handleResetSave = () => {
    resetSave(username, currentSlot);
    window.location.reload();
  };

  const handleDeposit = (itemId: string, quantity: number) => {
    sceneRef.current?.depositItem(itemId, quantity);
  };

  const handleWithdraw = (itemId: string, quantity: number) => {
    sceneRef.current?.withdrawItem(itemId, quantity);
  };

  const handleItemClick = (itemId: string) => {
    if (['cooked_shrimp', 'cooked_trout', 'cooked_golden_fish', 'ration'].includes(itemId)) {
      sceneRef.current?.eatFood(itemId);
    }
  };

  const handleExitToHome = () => {
    if (gameState) {
      saveGame(gameState, username, currentSlot);
    }
    router.push('/');
  };

  const handleLogin = (name: string) => {
    localStorage.setItem('splitkit_username', name);
    setUsername(name);
    setShowLogin(false);
    window.location.reload();
  };

  const handleLogout = () => {
    localStorage.removeItem('splitkit_username');
    setUsername(null);
    window.location.reload();
  };

  // Save slot handlers
  const handleSelectSlot = (slotId: number) => {
    if (gameState) {
      saveGame(gameState, username, currentSlot);
    }
    setCurrentSlot(slotId);
    window.location.reload();
  };

  const handleCreateSlot = (slotId: number, name: string) => {
    const key = username 
      ? `splitkit_save_${username.toLowerCase()}_slot${slotId}`
      : `splitkit_save_guest_slot${slotId}`;
    const metaKey = `${key}_meta`;
    
    localStorage.setItem(key, JSON.stringify(defaultPlayerState()));
    localStorage.setItem(metaKey, JSON.stringify({ name, lastPlayed: Date.now() }));
  };

  const handleRenameSlot = (slotId: number, name: string) => {
    const key = username 
      ? `splitkit_save_${username.toLowerCase()}_slot${slotId}`
      : `splitkit_save_guest_slot${slotId}`;
    const metaKey = `${key}_meta`;
    
    const existingMeta = localStorage.getItem(metaKey);
    const meta = existingMeta ? JSON.parse(existingMeta) : { lastPlayed: null };
    localStorage.setItem(metaKey, JSON.stringify({ ...meta, name }));
  };

  const handleDeleteSlot = (slotId: number) => {
    const key = username 
      ? `splitkit_save_${username.toLowerCase()}_slot${slotId}`
      : `splitkit_save_guest_slot${slotId}`;
    const metaKey = `${key}_meta`;
    
    localStorage.removeItem(key);
    localStorage.removeItem(metaKey);
  };

  if (!usernameLoaded) {
    return (
      <div className="fixed inset-0 bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-[#c9aa71] text-lg" style={{ fontFamily: '"Press Start 2P", monospace' }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#0a0a0f] overflow-hidden">
      {/* Fullscreen game container */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          ref={containerRef}
          className="w-full h-full"
          style={{ imageRendering: 'pixelated' }}
        />
      </div>

      {/* Top-right buttons */}
      {!showEscMenu && (
        <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
          <button
            onClick={() => setMarketOpen(true)}
            className="px-3 py-1.5 rounded border border-[#4a4a3a] bg-[#1a1a15]/90 text-[#c9aa71] text-xs hover:bg-[#2a2a20] transition-colors"
            style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '8px' }}
          >
            🏪 Market
          </button>
          <HolderModeButton
            isHolder={isHolder}
            holderModeEnabled={holderModeEnabled}
            onClick={() => setShowHolderModal(true)}
          />
        </div>
      )}

      {/* Holder badge next to username (if holder mode enabled) */}
      {holderModeEnabled && isHolder && holderData.cosmetics.title && !showEscMenu && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30">
          <div 
            className="px-3 py-1 bg-gradient-to-r from-[#c9aa71]/20 to-[#daa520]/20 border border-[#c9aa71]/50 rounded"
            style={{ fontFamily: 'monospace', fontSize: '10px' }}
          >
            <span className="text-[#c9aa71]">👑 {holderData.cosmetics.title}</span>
          </div>
        </div>
      )}

      {/* Game HUD overlay */}
      {gameState && !showEscMenu && containerRef.current && (
        <GameHUD
          state={gameState}
          activePanel={activePanel}
          username={username}
          onPanelChange={setActivePanel}
          onDeposit={handleDeposit}
          onWithdraw={handleWithdraw}
          onItemClick={handleItemClick}
          onClosePanel={closePanel}
          onOpenAssistant={() => setShowAssistant(true)}
          onOpenLogin={() => setShowLogin(true)}
          isHolder={isHolder}
          holderModeEnabled={holderModeEnabled}
          holderData={holderData}
          onOpenSaveSlots={() => setShowSaveSlots(true)}
        />
      )}

      {/* Escape Menu */}
      {showEscMenu && (
        <EscapeMenu
          muted={muted}
          onResume={() => setShowEscMenu(false)}
          onToggleMute={handleToggleMute}
          onResetSave={handleResetSave}
          onExitToHome={handleExitToHome}
          onOpenSaveSlots={() => {
            setShowEscMenu(false);
            setShowSaveSlots(true);
          }}
        />
      )}

      {/* Holder Modal */}
      {showHolderModal && (
        <HolderModal
          isConnected={isWalletConnected}
          isHolder={isHolder}
          holderModeEnabled={holderModeEnabled}
          walletAddress={walletAddress}
          balance={holderBalance}
          holderData={holderData}
          isConnecting={isConnecting}
          onConnect={handleConnectWallet}
          onDisconnect={handleDisconnectWallet}
          onEnableHolderMode={handleEnableHolderMode}
          onClose={() => setShowHolderModal(false)}
          onDailyClaim={handleDailyClaim}
          onUpdateCosmetics={handleUpdateCosmetics}
          onBuyToken={handleBuyToken}
          onRefreshHolderStatus={handleRefreshHolderStatus}
        />
      )}

      {/* Save Slots Panel */}
      {showSaveSlots && (
        <SaveSlotsPanel
          isHolder={isHolder && holderModeEnabled}
          currentSlot={currentSlot}
          username={username}
          onSelectSlot={handleSelectSlot}
          onCreateSlot={handleCreateSlot}
          onRenameSlot={handleRenameSlot}
          onDeleteSlot={handleDeleteSlot}
          onClose={() => setShowSaveSlots(false)}
        />
      )}

      {/* AI Assistant Panel */}
      {showAssistant && gameState && (
        <AIAssistant
          state={gameState}
          onClose={() => setShowAssistant(false)}
        />
      )}

      {/* Login Modal */}
      {showLogin && (
        <LoginModal
          currentUsername={username}
          onLogin={handleLogin}
          onLogout={handleLogout}
          onClose={() => setShowLogin(false)}
        />
      )}

      {/* Market Modal */}
      <GameModal
        open={marketOpen}
        title="Market Stall"
        onClose={() => setMarketOpen(false)}
      >
        <MarketPanel
          tokenLive={TOKEN_LIVE}
          walletAddress={walletAddress}
          onConnect={connectWallet}
          onDisconnect={disconnectWallet}
          onBuy={handleBuyToken}
        />
      </GameModal>

      {/* Bottom hint bar */}
      {!showEscMenu && (
        <div className="absolute bottom-0 left-0 right-0 bg-[#0a0a0f]/90 border-t border-[#2a2a20] px-4 py-2 z-40">
          <div className="flex items-center justify-between gap-4 max-w-6xl mx-auto">
            <div className="text-[#6a6a5a] text-xs flex-shrink-0" style={{ fontFamily: 'monospace' }}>
              WASD move • SHIFT sprint • Click to interact • ESC menu • F1 assistant
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {holderModeEnabled && isHolder && (
                <span className="text-[#c9aa71] text-xs whitespace-nowrap" style={{ fontFamily: 'monospace' }}>
                  👑 Holder
                </span>
              )}
              <span className="text-[#4a4a3a] text-xs whitespace-nowrap" style={{ fontFamily: 'monospace' }}>
                {username ? `Playing as ${username}` : 'Guest Mode'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
