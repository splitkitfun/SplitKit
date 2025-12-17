// Holder Provider Interface and Implementation
// Handles wallet connection and holder status verification

import { HolderStatus, HolderCheckResponse } from './types';
import { HOLDER_CONFIG } from '@/config/holder';

export interface IHolderProvider {
  getWalletAddress(): string | null;
  connectWallet(): Promise<string | null>;
  disconnectWallet(): Promise<void>;
  checkHolderStatus(address: string): Promise<HolderCheckResponse>;
  signMessage?(message: string): Promise<string | null>;
}

// Cache for holder status
const holderCache: Map<string, { status: HolderStatus; expires: number }> = new Map();

// Default provider using Phantom/Solana wallet
export class SolanaHolderProvider implements IHolderProvider {
  private walletAddress: string | null = null;

  getWalletAddress(): string | null {
    return this.walletAddress;
  }

  async connectWallet(): Promise<string | null> {
    try {
      // Check if Phantom is installed
      const phantom = (window as any).phantom?.solana;
      
      if (!phantom) {
        // Try Solflare
        const solflare = (window as any).solflare;
        if (solflare?.isSolflare) {
          const response = await solflare.connect();
          this.walletAddress = response.publicKey.toString();
          return this.walletAddress;
        }
        
        throw new Error('No Solana wallet found. Please install Phantom or Solflare.');
      }

      if (phantom.isPhantom) {
        const response = await phantom.connect();
        this.walletAddress = response.publicKey.toString();
        return this.walletAddress;
      }

      throw new Error('Wallet not supported');
    } catch (error: any) {
      console.error('Wallet connection failed:', error);
      return null;
    }
  }

  async disconnectWallet(): Promise<void> {
    try {
      const phantom = (window as any).phantom?.solana;
      if (phantom) {
        await phantom.disconnect();
      }
      
      const solflare = (window as any).solflare;
      if (solflare?.isSolflare) {
        await solflare.disconnect();
      }
      
      this.walletAddress = null;
    } catch (error) {
      console.error('Wallet disconnect failed:', error);
      this.walletAddress = null;
    }
  }

  async checkHolderStatus(address: string): Promise<HolderCheckResponse> {
    // Check cache first
    const cached = holderCache.get(address);
    if (cached && cached.expires > Date.now()) {
      return {
        isHolder: cached.status.isHolder,
        balance: cached.status.balance,
      };
    }

    try {
      // Call server endpoint to check holder status
      const response = await fetch('/api/holder/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      });

      if (!response.ok) {
        const error = await response.json();
        return { isHolder: false, balance: 0, error: error.message || 'Check failed' };
      }

      const result: HolderCheckResponse = await response.json();

      // Cache the result
      holderCache.set(address, {
        status: {
          isHolder: result.isHolder,
          balance: result.balance,
          checkedAt: Date.now(),
        },
        expires: Date.now() + HOLDER_CONFIG.HOLDER_CACHE_TTL_MS,
      });

      return result;
    } catch (error: any) {
      console.error('Holder check failed:', error);
      return { isHolder: false, balance: 0, error: error.message };
    }
  }

  async signMessage(message: string): Promise<string | null> {
    try {
      const phantom = (window as any).phantom?.solana;
      if (phantom) {
        const encodedMessage = new TextEncoder().encode(message);
        const signedMessage = await phantom.signMessage(encodedMessage, 'utf8');
        return Buffer.from(signedMessage.signature).toString('base64');
      }
      return null;
    } catch (error) {
      console.error('Message signing failed:', error);
      return null;
    }
  }
}

// Singleton instance
let providerInstance: IHolderProvider | null = null;

export const getHolderProvider = (): IHolderProvider => {
  if (!providerInstance) {
    providerInstance = new SolanaHolderProvider();
  }
  return providerInstance;
};

// Clear holder cache (useful for testing)
export const clearHolderCache = () => {
  holderCache.clear();
};


