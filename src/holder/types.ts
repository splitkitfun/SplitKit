// Holder system types

export interface HolderStatus {
  isHolder: boolean;
  balance: number;
  checkedAt: number; // timestamp
}

export interface HolderState {
  walletAddress: string | null;
  isConnected: boolean;
  holderStatus: HolderStatus | null;
  holderModeEnabled: boolean;
}

export interface HolderCosmetics {
  title: string | null;
  capeColor: string | null;
  nameplateStyle: string | null;
}

export interface DailyClaimState {
  lastClaimTimestamp: number | null;
  canClaim: boolean;
  nextClaimIn: number; // milliseconds until next claim
}

export interface HolderSaveData {
  holderModeEnabled: boolean;
  cosmetics: HolderCosmetics;
  lastDailyClaim: number | null;
  essence: number;
  rations: number;
}

export const defaultHolderSaveData = (): HolderSaveData => ({
  holderModeEnabled: false,
  cosmetics: {
    title: null,
    capeColor: null,
    nameplateStyle: null,
  },
  lastDailyClaim: null,
  essence: 0,
  rations: 0,
});

export interface HolderCheckResponse {
  isHolder: boolean;
  balance: number;
  error?: string;
}


