'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { HolderState, HolderSaveData, defaultHolderSaveData, HolderCosmetics } from './types';
import { getHolderProvider } from './HolderProvider';
import { HOLDER_CONFIG, DAILY_CLAIM_REWARDS } from '@/config/holder';

interface HolderContextValue {
  state: HolderState;
  holderData: HolderSaveData;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  enableHolderMode: () => void;
  disableHolderMode: () => void;
  claimDaily: () => boolean;
  updateCosmetics: (cosmetics: HolderCosmetics) => void;
  canAccessHolderZone: () => boolean;
}

const HolderContext = createContext<HolderContextValue | null>(null);

export const useHolder = () => {
  const context = useContext(HolderContext);
  if (!context) {
    throw new Error('useHolder must be used within a HolderProvider');
  }
  return context;
};

interface HolderProviderProps {
  children: React.ReactNode;
  username: string | null;
}

export const HolderContextProvider: React.FC<HolderProviderProps> = ({ children, username }) => {
  const [state, setState] = useState<HolderState>({
    walletAddress: null,
    isConnected: false,
    holderStatus: null,
    holderModeEnabled: false,
  });
  
  const [holderData, setHolderData] = useState<HolderSaveData>(defaultHolderSaveData());
  const [isConnecting, setIsConnecting] = useState(false);

  // Load holder data from localStorage
  useEffect(() => {
    const key = username 
      ? `splitkit_holder_${username.toLowerCase()}`
      : 'splitkit_holder_guest';
    
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setHolderData({ ...defaultHolderSaveData(), ...parsed });
        if (parsed.holderModeEnabled) {
          setState(prev => ({ ...prev, holderModeEnabled: true }));
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
  }, [username]);

  // Save holder data to localStorage
  const saveHolderData = useCallback((data: HolderSaveData) => {
    const key = username 
      ? `splitkit_holder_${username.toLowerCase()}`
      : 'splitkit_holder_guest';
    
    localStorage.setItem(key, JSON.stringify(data));
  }, [username]);

  const connectWallet = useCallback(async () => {
    setIsConnecting(true);
    try {
      const provider = getHolderProvider();
      const address = await provider.connectWallet();
      
      if (address) {
        setState(prev => ({ ...prev, walletAddress: address, isConnected: true }));
        
        // Check holder status
        const status = await provider.checkHolderStatus(address);
        setState(prev => ({
          ...prev,
          holderStatus: {
            isHolder: status.isHolder,
            balance: status.balance,
            checkedAt: Date.now(),
          },
        }));
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnectWallet = useCallback(async () => {
    try {
      const provider = getHolderProvider();
      await provider.disconnectWallet();
      
      setState({
        walletAddress: null,
        isConnected: false,
        holderStatus: null,
        holderModeEnabled: false,
      });
      
      // Reset holder data but keep cosmetics preferences
      const newData = { ...defaultHolderSaveData(), cosmetics: holderData.cosmetics };
      setHolderData(newData);
      saveHolderData(newData);
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  }, [holderData.cosmetics, saveHolderData]);

  const enableHolderMode = useCallback(() => {
    if (state.holderStatus?.isHolder) {
      setState(prev => ({ ...prev, holderModeEnabled: true }));
      const newData = { ...holderData, holderModeEnabled: true };
      setHolderData(newData);
      saveHolderData(newData);
    }
  }, [state.holderStatus?.isHolder, holderData, saveHolderData]);

  const disableHolderMode = useCallback(() => {
    setState(prev => ({ ...prev, holderModeEnabled: false }));
    const newData = { ...holderData, holderModeEnabled: false };
    setHolderData(newData);
    saveHolderData(newData);
  }, [holderData, saveHolderData]);

  const claimDaily = useCallback((): boolean => {
    if (!state.holderStatus?.isHolder || !state.holderModeEnabled) {
      return false;
    }

    const cooldownMs = HOLDER_CONFIG.DAILY_CLAIM_COOLDOWN_HOURS * 60 * 60 * 1000;
    if (holderData.lastDailyClaim && Date.now() - holderData.lastDailyClaim < cooldownMs) {
      return false;
    }

    const newData = {
      ...holderData,
      lastDailyClaim: Date.now(),
      essence: holderData.essence + DAILY_CLAIM_REWARDS.essence,
      rations: holderData.rations + DAILY_CLAIM_REWARDS.ration,
    };
    setHolderData(newData);
    saveHolderData(newData);
    return true;
  }, [state.holderStatus?.isHolder, state.holderModeEnabled, holderData, saveHolderData]);

  const updateCosmetics = useCallback((cosmetics: HolderCosmetics) => {
    const newData = { ...holderData, cosmetics };
    setHolderData(newData);
    saveHolderData(newData);
  }, [holderData, saveHolderData]);

  const canAccessHolderZone = useCallback((): boolean => {
    return state.holderModeEnabled && (state.holderStatus?.isHolder ?? false);
  }, [state.holderModeEnabled, state.holderStatus?.isHolder]);

  const value: HolderContextValue = {
    state,
    holderData,
    isConnecting,
    connectWallet,
    disconnectWallet,
    enableHolderMode,
    disableHolderMode,
    claimDaily,
    updateCosmetics,
    canAccessHolderZone,
  };

  return (
    <HolderContext.Provider value={value}>
      {children}
    </HolderContext.Provider>
  );
};

