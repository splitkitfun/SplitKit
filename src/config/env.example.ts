/**
 * Environment Variables for Holder Mode
 * =====================================
 * 
 * Copy these to your .env.local file and fill in the values:
 * 
 * # Check strategy: "mock" for development, "rpc" for production
 * NEXT_PUBLIC_HOLDER_CHECK_STRATEGY=mock
 * 
 * # Solana RPC URL for token balance checks (required for rpc strategy)
 * SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
 * 
 * # Your project's SPL token mint address
 * HOLDER_TOKEN_MINT=YOUR_TOKEN_MINT_ADDRESS_HERE
 * 
 * # Minimum token balance required to be a holder (in token units)
 * NEXT_PUBLIC_HOLDER_MIN_BALANCE=1
 * 
 * # Optional: Public token mint for client display
 * NEXT_PUBLIC_HOLDER_TOKEN_MINT=YOUR_TOKEN_MINT_ADDRESS_HERE
 */

export const ENV_VARS = {
  NEXT_PUBLIC_HOLDER_CHECK_STRATEGY: 'mock | rpc',
  SOLANA_RPC_URL: 'Solana RPC endpoint URL',
  HOLDER_TOKEN_MINT: 'SPL token mint address',
  NEXT_PUBLIC_HOLDER_MIN_BALANCE: 'Minimum balance (number)',
};


