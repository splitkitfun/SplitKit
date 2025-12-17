"use client";

type Props = {
  tokenLive: boolean;
  walletAddress: string | null;
  onConnect: () => Promise<void> | void;
  onDisconnect: () => Promise<void> | void;
  onBuy: () => Promise<void> | void;
};

export default function MarketPanel({
  tokenLive,
  walletAddress,
  onConnect,
  onDisconnect,
  onBuy,
}: Props) {
  const short = walletAddress
    ? `${walletAddress.slice(0, 4)}…${walletAddress.slice(-4)}`
    : null;

  return (
    <div className="space-y-3 text-sm" style={{ fontFamily: 'monospace' }}>
      <div className="opacity-80 text-xs text-[#6a6a5a]">
        Market Stall — wallet optional. Connect only if you want Holder Mode perks or to buy.
      </div>

      {/* Wallet row */}
      <div className="rounded-lg border border-[#2a2a20] bg-[#0a0a08] p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="font-semibold text-[#c9aa71]">Wallet</div>
          <div className="text-xs">
            {walletAddress ? (
              <span className="text-[#6a9a6a]">Connected: {short}</span>
            ) : (
              <span className="text-[#9a6a6a]">Not connected</span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          {!walletAddress ? (
            <button
              onClick={onConnect}
              className="rounded-lg border border-[#4a6a4a] bg-[#2a4a2a] px-3 py-2 text-sm text-[#aaffaa] hover:bg-[#3a5a3a] transition-colors"
              style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '9px' }}
            >
              Connect Wallet
            </button>
          ) : (
            <button
              onClick={onDisconnect}
              className="rounded-lg border border-[#6a4a4a] bg-[#4a2a2a] px-3 py-2 text-sm text-[#ffaaaa] hover:bg-[#5a3a3a] transition-colors"
              style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '9px' }}
            >
              Disconnect
            </button>
          )}
        </div>

        <div className="text-xs text-[#6a6a5a]">
          Connecting unlocks Holder Mode preview (zones/cosmetics/daily claim/save slots). No purchase required.
        </div>
      </div>

      {/* Buy box */}
      <div className="rounded-lg border border-[#2a2a20] bg-[#0a0a08] p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="font-semibold text-[#c9aa71]">Buy Token (via Bags)</div>
          <div className="text-xs">
            {tokenLive ? (
              <span className="text-[#6a9a6a]">● Live</span>
            ) : (
              <span className="text-[#9a6a6a]">○ Coming soon</span>
            )}
          </div>
        </div>

        <button
          onClick={onBuy}
          disabled={!tokenLive}
          className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors ${
            tokenLive
              ? 'border-[#4a6a4a] bg-[#2a4a2a] text-[#aaffaa] hover:bg-[#3a5a3a]'
              : 'border-[#3a3a30] bg-[#2a2a20] text-[#5a5a5a] cursor-not-allowed'
          }`}
          style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '9px' }}
        >
          {tokenLive ? "🛒 BUY NOW" : "🔒 BUY (COMING SOON)"}
        </button>

        {!tokenLive && (
          <div className="text-xs text-[#6a6a5a]">
            Pre-launch mode: buying is disabled until launch.
          </div>
        )}
      </div>

      {/* Holder info */}
      <div className="rounded-lg border border-[#2a2a20] bg-[#0a0a08] p-3 space-y-1">
        <div className="font-semibold text-[#c9aa71]">Holder Mode</div>
        <div className="text-xs text-[#6a6a5a]">
          Zones, cosmetics, daily claim, and save slots are gated. Connect wallet to preview/unlock.
        </div>
      </div>
    </div>
  );
}
