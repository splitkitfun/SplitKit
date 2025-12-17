// Bags Integration Configuration
// ===============================

// Token launch status - set to true when token is live
export const TOKEN_LIVE = process.env.NEXT_PUBLIC_TOKEN_LIVE === 'true';

// Token mint address - replace with real mint when launched
export const TOKEN_MINT = process.env.NEXT_PUBLIC_TOKEN_MINT || '';

// SOL mint (native wrapped SOL)
export const SOL_MINT = 'So11111111111111111111111111111111111111112';

// Bags API base URL
export const BAGS_API_BASE = 'https://public-api-v2.bags.fm/api/v1';

// Default swap amount in SOL (lamports)
export const DEFAULT_SWAP_AMOUNT_SOL = 0.1; // 0.1 SOL

// Check if token configuration is valid
export const isTokenConfigValid = (): boolean => {
  return TOKEN_LIVE && TOKEN_MINT.length >= 32 && TOKEN_MINT.length <= 44;
};
