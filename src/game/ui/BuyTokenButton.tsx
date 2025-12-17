'use client';

import React, { useState } from 'react';
import { TOKEN_LIVE, TOKEN_MINT, SOL_MINT, DEFAULT_SWAP_AMOUNT_SOL } from '@/config/bags';
import { getHolderProvider } from '@/holder/HolderProvider';

interface BuyTokenButtonProps {
  onPurchaseComplete?: () => void;
  className?: string;
}

export const BuyTokenButton: React.FC<BuyTokenButtonProps> = ({
  onPurchaseComplete,
  className = '',
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const isLive = TOKEN_LIVE;

  const handleBuyToken = async () => {
    if (!isLive) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // Get wallet provider and connect
      const provider = getHolderProvider();
      let address = provider.getWalletAddress();
      
      if (!address) {
        address = await provider.connectWallet();
        if (!address) {
          setError('Failed to connect wallet');
          setIsLoading(false);
          return;
        }
      }

      // Call our API to create swap transaction
      const response = await fetch('/api/bags/swap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPubkey: address,
          inputMint: SOL_MINT,
          outputMint: TOKEN_MINT,
          amount: Math.floor(DEFAULT_SWAP_AMOUNT_SOL * 1e9), // Convert SOL to lamports
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.code === 'TOKEN_NOT_LIVE') {
          setError('Token not live yet');
        } else {
          setError(data.error || 'Failed to create swap');
        }
        setIsLoading(false);
        return;
      }

      // Sign and send the transaction
      const txBase64 = data.txBase64;
      if (!txBase64) {
        setError('Invalid transaction received');
        setIsLoading(false);
        return;
      }

      // Get Phantom to sign and send
      const phantom = (window as any).phantom?.solana;
      if (!phantom) {
        setError('Wallet not found');
        setIsLoading(false);
        return;
      }

      try {
        // Decode and sign transaction
        const txBuffer = Uint8Array.from(atob(txBase64), c => c.charCodeAt(0));
        const signedTx = await phantom.signTransaction({ 
          serialize: () => txBuffer 
        });
        
        // Send transaction
        const signature = await phantom.request({
          method: 'sendTransaction',
          params: {
            transaction: signedTx,
          },
        });

        console.log('Transaction sent:', signature);
        
        // Wait a moment for confirmation
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Notify parent to re-check holder status
        onPurchaseComplete?.();
        
      } catch (signError: any) {
        if (signError.code === 4001) {
          setError('Transaction cancelled');
        } else {
          setError('Transaction failed');
          console.error('Sign error:', signError);
        }
      }

    } catch (err: any) {
      console.error('Buy token error:', err);
      setError(err.message || 'Failed to buy token');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={handleBuyToken}
        disabled={!isLive || isLoading}
        onMouseEnter={() => !isLive && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`w-full py-3 rounded border transition-all ${
          isLive
            ? 'bg-gradient-to-r from-[#9966ff] to-[#cc66ff] text-white border-[#aa77ff] hover:from-[#aa77ff] hover:to-[#dd77ff] cursor-pointer'
            : 'bg-[#2a2a2a] text-[#6a6a6a] border-[#3a3a3a] cursor-not-allowed'
        }`}
        style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '9px' }}
      >
        {isLoading ? (
          'PROCESSING...'
        ) : isLive ? (
          '🛒 BUY TOKEN (VIA BAGS)'
        ) : (
          '🔒 TOKEN NOT LIVE YET'
        )}
      </button>

      {/* Tooltip for disabled state */}
      {showTooltip && !isLive && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[#1a1a15] border border-[#3a3a30] rounded text-[#9a9a8a] text-xs whitespace-nowrap z-50"
          style={{ fontFamily: 'monospace' }}
        >
          Token launch coming soon!
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#3a3a30]" />
        </div>
      )}

      {/* Error message */}
      {error && (
        <p className="mt-2 text-[#aa6666] text-xs text-center" style={{ fontFamily: 'monospace' }}>
          {error}
        </p>
      )}
    </div>
  );
};

