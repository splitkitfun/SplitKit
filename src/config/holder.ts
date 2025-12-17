// Holder Mode Configuration
// These values control the holder verification and perks system

export const HOLDER_CONFIG = {
  // Token mint address for holder verification (Solana SPL token)
  // Replace with your actual token mint address
  TOKEN_MINT: process.env.NEXT_PUBLIC_HOLDER_TOKEN_MINT || 'YOUR_TOKEN_MINT_ADDRESS_HERE',
  
  // Minimum token balance required to be considered a holder
  MIN_BALANCE: Number(process.env.NEXT_PUBLIC_HOLDER_MIN_BALANCE) || 1,
  
  // Enable/disable holder zone access
  ZONE_ENABLED: true,
  
  // Daily claim cooldown in hours
  DAILY_CLAIM_COOLDOWN_HOURS: 24,
  
  // Cache TTL for holder status (in milliseconds)
  HOLDER_CACHE_TTL_MS: 10 * 60 * 1000, // 10 minutes
  
  // Save slots configuration
  GUEST_SAVE_SLOTS: 1,
  HOLDER_SAVE_SLOTS: 3,
};

// Check strategy for holder verification
export type HolderCheckStrategy = 'mock' | 'rpc';

export const getHolderCheckStrategy = (): HolderCheckStrategy => {
  const strategy = process.env.NEXT_PUBLIC_HOLDER_CHECK_STRATEGY || 'mock';
  return strategy as HolderCheckStrategy;
};

// Holder zone definition
export const HOLDER_ZONE = {
  id: 4, // New area ID
  name: "Founder's Grove",
  description: 'An exclusive sanctuary for token holders',
};

// Daily claim rewards
export const DAILY_CLAIM_REWARDS = {
  essence: 1,
  ration: 1,
};

// Holder cosmetics
export const HOLDER_COSMETICS = {
  titles: ['Holder', 'Founder', 'Supporter'],
  capeColors: ['gold', 'purple', 'emerald'],
  nameplateStyles: ['gold_outline', 'diamond', 'flame'],
};


