import Link from "next/link";
import { site } from "@/config/site";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1
          className="text-3xl text-[#c9aa71] mb-4"
          style={{ fontFamily: '"Press Start 2P", monospace' }}
        >
          Documentation
        </h1>
        <p className="text-[#6a6a5a] text-sm mb-8" style={{ fontFamily: 'monospace' }}>
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <section className="mb-12">
          <h2 className="text-xl text-[#c9aa71] mb-4" style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '14px' }}>
            Getting Started
          </h2>
          <div className="bg-[#151510] border border-[#2a2a20] rounded-lg p-6 text-[#9a9a8a]" style={{ fontFamily: 'monospace' }}>
            <p className="mb-4">
              SplitKit Arena is an Old School RuneScape-inspired browser RPG. Explore the world, 
              gather resources, train your skills, and complete quests.
            </p>
            <p>
              Your progress is automatically saved to your browser. Create an account to have 
              separate save files, or play as a guest.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl text-[#c9aa71] mb-4" style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '14px' }}>
            Controls
          </h2>
          <div className="bg-[#151510] border border-[#2a2a20] rounded-lg overflow-hidden">
            <table className="w-full text-sm" style={{ fontFamily: 'monospace' }}>
              <tbody>
                {[
                  ['W / A / S / D', 'Move character'],
                  ['SHIFT (hold)', 'Sprint (uses energy)'],
                  ['Click', 'Interact with objects/NPCs'],
                  ['ESC', 'Open pause menu / Close panels'],
                  ['F1', 'Toggle AI Assistant'],
                  ['I', 'Toggle Inventory (legacy)'],
                  ['Q', 'Toggle Quests (legacy)'],
                ].map(([key, desc], i) => (
                  <tr key={key} className={i % 2 === 0 ? 'bg-[#1a1a15]' : ''}>
                    <td className="px-4 py-3 text-[#c9aa71] font-bold w-40">{key}</td>
                    <td className="px-4 py-3 text-[#8a8a7a]">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl text-[#c9aa71] mb-4" style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '14px' }}>
            Skills
          </h2>
          <div className="space-y-4">
            {/* Woodcutting */}
            <div className="bg-[#151510] border border-[#2a2a20] rounded-lg p-6">
              <h3 className="text-[#c9aa71] mb-3 flex items-center gap-2" style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '11px' }}>
                🪓 Woodcutting
              </h3>
              <p className="text-[#8a8a7a] text-sm mb-4" style={{ fontFamily: 'monospace' }}>
                Chop trees to gather logs and gain XP. Higher levels unlock better trees with more XP.
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm" style={{ fontFamily: 'monospace' }}>
                <div className="bg-[#1a1a15] p-2 rounded">
                  <span className="text-[#6a8a6a]">Lvl 1</span>
                  <span className="text-[#8a8a7a]"> - Tree (25 XP)</span>
                </div>
                <div className="bg-[#1a1a15] p-2 rounded">
                  <span className="text-[#6a8a6a]">Lvl 5</span>
                  <span className="text-[#8a8a7a]"> - Oak (50 XP)</span>
                </div>
                <div className="bg-[#1a1a15] p-2 rounded">
                  <span className="text-[#6a8a6a]">Lvl 10</span>
                  <span className="text-[#8a8a7a]"> - Willow (80 XP)</span>
                </div>
                <div className="bg-[#1a1a15] p-2 rounded">
                  <span className="text-[#6a8a6a]">Lvl 15</span>
                  <span className="text-[#8a8a7a]"> - Maple (120 XP)</span>
                </div>
              </div>
            </div>

            {/* Fishing */}
            <div className="bg-[#151510] border border-[#2a2a20] rounded-lg p-6">
              <h3 className="text-[#4488cc] mb-3 flex items-center gap-2" style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '11px' }}>
                🎣 Fishing
              </h3>
              <p className="text-[#8a8a7a] text-sm mb-4" style={{ fontFamily: 'monospace' }}>
                Fish at fishing spots in the Riverbank area. Cook fish at campfires to restore energy.
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm" style={{ fontFamily: 'monospace' }}>
                <div className="bg-[#1a1a15] p-2 rounded">
                  <span className="text-[#6a8aaa]">Lvl 1</span>
                  <span className="text-[#8a8a7a]"> - Shrimp (20 XP)</span>
                </div>
                <div className="bg-[#1a1a15] p-2 rounded">
                  <span className="text-[#6a8aaa]">Lvl 5</span>
                  <span className="text-[#8a8a7a]"> - Trout (50 XP)</span>
                </div>
              </div>
            </div>

            {/* Cooking */}
            <div className="bg-[#151510] border border-[#2a2a20] rounded-lg p-6">
              <h3 className="text-[#ff8844] mb-3 flex items-center gap-2" style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '11px' }}>
                🔥 Cooking
              </h3>
              <p className="text-[#8a8a7a] text-sm" style={{ fontFamily: 'monospace' }}>
                Use campfires to cook raw fish. Cooked Shrimp restores 20 energy, Cooked Trout restores 40 energy.
                Click on cooked food in your inventory to eat it.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl text-[#c9aa71] mb-4" style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '14px' }}>
            The World
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { name: 'Lumbridge Woods', desc: 'Starting area with basic trees, bank chest, and Woodcutting Tutor', color: '#3b7a1a' },
              { name: 'Draynor Swamp', desc: 'Murky swamp with Willow and Oak trees', color: '#2a5a2a' },
              { name: 'Riverbank', desc: 'Fishing spots, campfire for cooking', color: '#4a8844' },
              { name: 'Forest Edge', desc: 'Dense forest with Maple trees (highest level)', color: '#2d6620' },
            ].map((area) => (
              <div key={area.name} className="bg-[#151510] border border-[#2a2a20] rounded-lg p-4 flex gap-4">
                <div 
                  className="w-12 h-12 rounded flex-shrink-0"
                  style={{ backgroundColor: area.color }}
                />
                <div>
                  <h3 className="text-[#c9aa71] text-sm" style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '9px' }}>
                    {area.name}
                  </h3>
                  <p className="text-[#7a7a6a] text-sm mt-1" style={{ fontFamily: 'monospace' }}>
                    {area.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl text-[#c9aa71] mb-4" style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '14px' }}>
            Quests
          </h2>
          <div className="space-y-3">
            {[
              { name: 'Getting Started', desc: 'Chop 5 logs', reward: '+100 WC XP, +50 coins' },
              { name: 'First Catch', desc: 'Catch 3 shrimp', reward: '+75 Fishing XP, +25 coins, faster chopping' },
              { name: 'Supply Run', desc: 'Deposit 10 logs in bank', reward: '+100 coins' },
            ].map((quest) => (
              <div key={quest.name} className="bg-[#151510] border border-[#2a2a20] rounded-lg p-4">
                <h3 className="text-[#c9aa71] text-sm mb-1" style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '10px' }}>
                  {quest.name}
                </h3>
                <p className="text-[#7a7a6a] text-sm" style={{ fontFamily: 'monospace' }}>
                  {quest.desc}
                </p>
                <p className="text-[#6a8a6a] text-xs mt-2" style={{ fontFamily: 'monospace' }}>
                  Reward: {quest.reward}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl text-[#c9aa71] mb-4" style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '14px' }}>
            AI Assistant
          </h2>
          <div className="bg-[#151510] border border-[#2a2a20] rounded-lg p-6 text-[#9a9a8a]" style={{ fontFamily: 'monospace' }}>
            <p className="mb-4">
              Press <span className="text-[#c9aa71]">F1</span> in-game to open the AI Assistant. 
              It can help you with:
            </p>
            <ul className="space-y-2 text-sm">
              <li>• Understanding your current skill levels and what to do next</li>
              <li>• Quest progress and objectives</li>
              <li>• How to level up skills faster</li>
              <li>• Where to find specific resources</li>
              <li>• Game mechanics explanations</li>
            </ul>
            <p className="mt-4 text-[#6a6a5a] text-xs">
              Note: The AI assistant runs locally and does not require an internet connection.
            </p>
          </div>
        </section>

        <section id="overview" className="mb-12">
          <h2 className="text-xl text-[#c9aa71] mb-4" style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '14px' }}>
            Overview
          </h2>
          <div className="bg-[#151510] border border-[#2a2a20] rounded-lg p-6 text-[#9a9a8a]" style={{ fontFamily: 'monospace' }}>
            <p className="mb-4">
              SplitKit is an Old School RuneScape-inspired browser RPG built with Next.js and Phaser 3. 
              The game is <strong className="text-[#6a8a6a]">completely free to play</strong> without any wallet connection required.
            </p>
            <p className="mb-4">
              <strong className="text-[#c9aa71]">Holder Mode</strong> is an optional feature that unlocks exclusive in-game perks 
              for token holders. Wallet connection is only required if you want to enable Holder Mode.
            </p>
            <p>
              The game features skills (Woodcutting, Fishing, Cooking), quests, multiple explorable areas, 
              an inventory system, banking, and an AI assistant to help guide your journey.
            </p>
          </div>
        </section>

        <section id="wallet-optional" className="mb-12">
          <h2 className="text-xl text-[#c9aa71] mb-4" style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '14px' }}>
            Wallet Optional
          </h2>
          <div className="bg-[#151510] border border-[#2a2a20] rounded-lg p-6 text-[#9a9a8a]" style={{ fontFamily: 'monospace' }}>
            <p className="mb-4">
              <strong className="text-[#6a8a6a]">You can play the entire game without connecting a wallet.</strong> 
              All core gameplay features are available to everyone:
            </p>
            <ul className="space-y-2 text-sm mb-4">
              <li>• All skills and leveling systems</li>
              <li>• All quests and world exploration</li>
              <li>• Inventory, banking, and save system</li>
              <li>• AI Assistant and all game mechanics</li>
            </ul>
            <p className="text-sm">
              Wallet connection is <strong className="text-[#c9aa71]">only required</strong> if you want to:
            </p>
            <ul className="space-y-2 text-sm mt-2">
              <li>• Enable Holder Mode perks</li>
              <li>• Buy tokens (when token is live)</li>
              <li>• Claim epoch rewards (post-launch)</li>
            </ul>
          </div>
        </section>

        <section id="holder-mode" className="mb-12">
          <h2 className="text-xl text-[#c9aa71] mb-4" style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '14px' }}>
            👑 Holder Mode
          </h2>
          <div className="bg-gradient-to-r from-[#1a1510] to-[#151510] border border-[#3a3020] rounded-lg p-6" style={{ fontFamily: 'monospace' }}>
            <p className="text-[#9a9a8a] mb-4">
              The game is <span className="text-[#6a8a6a]">completely free to play</span> without any wallet connection. 
              Holder Mode is an <span className="text-[#c9aa71]">optional feature</span> for token holders that unlocks exclusive perks.
            </p>
            
            <div className="space-y-4 mt-6">
              <div className="bg-[#0a0a0f]/50 rounded p-4">
                <h3 className="text-[#c9aa71] text-sm mb-2" style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '10px' }}>
                  🏰 Founder&apos;s Grove
                </h3>
                <p className="text-[#8a8a7a] text-sm">
                  An exclusive area with Ancient Trees (200 XP each) and Golden Fish ponds. 
                  Higher XP rates for dedicated holders.
                </p>
              </div>

              <div className="bg-[#0a0a0f]/50 rounded p-4">
                <h3 className="text-[#c9aa71] text-sm mb-2" style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '10px' }}>
                  👑 Cosmetics & Title
                </h3>
                <p className="text-[#8a8a7a] text-sm">
                  Unlock holder titles (Holder, Founder, Supporter), cape colors (Gold, Purple, Emerald), 
                  and nameplate styles to show off your status.
                </p>
              </div>

              <div className="bg-[#0a0a0f]/50 rounded p-4">
                <h3 className="text-[#c9aa71] text-sm mb-2" style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '10px' }}>
                  🎁 Daily Claim
                </h3>
                <p className="text-[#8a8a7a] text-sm">
                  Claim daily rewards: Essence (cosmetic currency) and Rations (energy food). 
                  Available once every 24 hours.
                </p>
              </div>

              <div className="bg-[#0a0a0f]/50 rounded p-4">
                <h3 className="text-[#c9aa71] text-sm mb-2" style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '10px' }}>
                  💾 Extra Save Slots
                </h3>
                <p className="text-[#8a8a7a] text-sm">
                  Holders get 3 save slots instead of 1. Create multiple characters or experiment 
                  with different playstyles.
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-[#1a2a1a]/50 border border-[#2a4a2a] rounded">
              <p className="text-[#6a8a6a] text-sm">
                <strong>How to enable:</strong> Click the &quot;Holder Mode&quot; button in-game (top-right), 
                connect your Solana wallet, and verify your token balance.
              </p>
            </div>
          </div>
        </section>

        <section id="rewards-option-c" className="mb-12">
          <h2 className="text-xl text-[#c9aa71] mb-4" style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '14px' }}>
            ⏰ Rewards Option C (Epoch-Based)
          </h2>
          <div className="bg-[#151510] border border-[#2a2a20] rounded-lg p-6" style={{ fontFamily: 'monospace' }}>
            <p className="text-[#9a9a8a] mb-4">
              Rewards per epoch are calculated using a formula that rewards both token holding and in-game activity:
            </p>
            
            <div className="bg-[#1a1a15] border border-[#2a2a20] rounded p-4 mb-4">
              <div className="text-[#c9aa71] text-lg font-bold mb-2" style={{ fontFamily: 'monospace' }}>
                Holding Weight × In-game Renown
              </div>
              <p className="text-[#8a8a7a] text-sm">
                Your reward share is proportional to both how many tokens you hold (Holding Weight) 
                and how much you&apos;ve played and progressed in-game (Renown).
              </p>
            </div>

            <div className="space-y-3 text-sm text-[#8a8a7a]">
              <div>
                <strong className="text-[#c9aa71]">Holding Weight:</strong> Based on your token balance at epoch snapshot.
              </div>
              <div>
                <strong className="text-[#c9aa71]">In-game Renown:</strong> Earned through quests, skill levels, achievements, and exploration.
              </div>
              <div>
                <strong className="text-[#c9aa71">Epochs:</strong> Discrete time windows (e.g., weekly or monthly). 
                Claims become available after each epoch ends.
              </div>
            </div>

            <div className="mt-6 p-4 bg-[#2a2a1a]/50 border border-[#4a4a2a] rounded">
              <p className="text-[#aa9a6a] text-xs">
                ⚠️ <strong>Pre-launch:</strong> Epoch rewards system will activate after token launch. 
                Until then, you can still earn Renown in-game, but claims will show &quot;Coming soon&quot;.
              </p>
            </div>
          </div>
        </section>

        <section id="bags-integration" className="mb-12">
          <h2 className="text-xl text-[#c9aa71] mb-4" style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '14px' }}>
            🛒 Bags Integration
          </h2>
          <div className="bg-[#151510] border border-[#2a2a20] rounded-lg p-6" style={{ fontFamily: 'monospace' }}>
            <p className="text-[#9a9a8a] mb-4">
              SplitKit uses <strong className="text-[#6a9aca]">Bags</strong> for token swapping functionality. 
              The integration is designed with pre-launch safety in mind.
            </p>

            <div className="space-y-4">
              <div className="bg-[#1a1a15] border border-[#2a2a20] rounded p-4">
                <h3 className="text-[#c9aa71] text-sm mb-2" style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '10px' }}>
                  Pre-Launch Mode
                </h3>
                <p className="text-[#8a8a7a] text-sm">
                  When <code className="text-[#6a9aca]">NEXT_PUBLIC_TOKEN_LIVE !== "true"</code>, 
                  the &quot;Buy Token&quot; button is <strong className="text-[#aa6a4a]">disabled</strong> and shows &quot;Coming Soon&quot;. 
                  All Bags API routes return 403 to prevent accidental transactions.
                </p>
              </div>

              <div className="bg-[#1a1a15] border border-[#2a2a20] rounded p-4">
                <h3 className="text-[#c9aa71] text-sm mb-2" style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '10px' }}>
                  Post-Launch Flow
                </h3>
                <p className="text-[#8a8a7a] text-sm mb-2">
                  Once token is live:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-sm text-[#7a7a6a]">
                  <li>User clicks &quot;Buy Token&quot; in Market Stall</li>
                  <li>Phantom wallet prompts for connection (if not connected)</li>
                  <li>User selects SOL amount to swap</li>
                  <li>System gets quote from Bags API</li>
                  <li>System builds swap transaction</li>
                  <li>Phantom signs and sends transaction</li>
                  <li>User receives tokens in wallet</li>
                </ol>
              </div>

              <div className="bg-[#1a2a1a]/50 border border-[#2a4a2a] rounded p-4">
                <p className="text-[#6a8a6a] text-xs">
                  <strong>Security:</strong> Bags API key is stored server-side only. 
                  Client never sees the API key. All sensitive operations happen via proxy routes.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="launch-checklist" className="mb-12">
          <h2 className="text-xl text-[#c9aa71] mb-4" style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '14px' }}>
            🚀 Launch Checklist
          </h2>
          <div className="bg-[#151510] border border-[#2a2a20] rounded-lg p-6" style={{ fontFamily: 'monospace' }}>
            <p className="text-[#9a9a8a] mb-4">
              For project administrators: steps to enable token functionality.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3 bg-[#1a1a15] border border-[#2a2a20] rounded p-3">
                <span className="text-[#c9aa71]">1.</span>
                <div>
                  <code className="text-[#6a9aca] text-sm">NEXT_PUBLIC_TOKEN_LIVE=true</code>
                  <p className="text-[#6a6a5a] text-xs mt-1">
                    Set to &quot;true&quot; when token is launched and tradeable
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-[#1a1a15] border border-[#2a2a20] rounded p-3">
                <span className="text-[#c9aa71]">2.</span>
                <div>
                  <code className="text-[#6a9aca] text-sm">NEXT_PUBLIC_TOKEN_MINT=&lt;mint_address&gt;</code>
                  <p className="text-[#6a6a5a] text-xs mt-1">
                    Replace with your SPL token mint address
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-[#1a1a15] border border-[#2a2a20] rounded p-3">
                <span className="text-[#c9aa71]">3.</span>
                <div>
                  <code className="text-[#6a9aca] text-sm">HOLDER_MIN_BALANCE=1</code>
                  <p className="text-[#6a6a5a] text-xs mt-1">
                    (Optional) Minimum tokens required for holder status
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-[#1a1a15] border border-[#2a2a20] rounded p-3">
                <span className="text-[#c9aa71]">4.</span>
                <div>
                  <code className="text-[#6a9aca] text-sm">BAGS_API_KEY=&lt;your_key&gt;</code>
                  <p className="text-[#6a6a5a] text-xs mt-1">
                    Server-side only - never exposed to client
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-[#2a2a1a]/50 border border-[#4a4a2a] rounded">
              <p className="text-[#aa9a6a] text-xs">
                ⚠️ Until <code>NEXT_PUBLIC_TOKEN_LIVE=true</code>, the &quot;Buy Token&quot; button will be disabled 
                and show &quot;Token not live yet&quot;.
              </p>
            </div>
          </div>
        </section>

        <section id="faq" className="mb-12">
          <h2 className="text-xl text-[#c9aa71] mb-4" style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '14px' }}>
            FAQ
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Is my wallet safe?",
                a: "Yes. We never request private keys. We only use Phantom's standard connect and sign methods. Your wallet remains in your control. We only read your public address to check token balance for Holder Mode verification."
              },
              {
                q: "Do I need to buy tokens to play?",
                a: "No. The game is completely free to play. Wallet connection and token purchase are optional. You can enjoy all core gameplay features without any crypto interaction."
              },
              {
                q: "When can I claim epoch rewards?",
                a: "Epoch rewards will activate after token launch. Until then, you can still play and earn Renown in-game. Once epochs begin, you'll be able to claim rewards proportional to your Holding Weight × Renown at the end of each epoch."
              },
              {
                q: "What happens if I disconnect my wallet?",
                a: "Your game progress is saved separately from wallet connection. Disconnecting your wallet will disable Holder Mode perks (zones, cosmetics, daily claims, extra slots), but all your gameplay progress remains intact."
              },
              {
                q: "Can I transfer my save between devices?",
                a: "Currently, saves are stored in your browser's localStorage. To transfer saves, you would need to export/import the save data manually. Future updates may add cloud save functionality."
              },
              {
                q: "What is Renown and how do I earn it?",
                a: "Renown is an in-game metric that tracks your overall progress and achievements. You earn Renown by completing quests, leveling skills, exploring areas, and achieving milestones. Higher Renown increases your epoch reward share."
              }
            ].map((item, i) => (
              <div key={i} className="bg-[#151510] border border-[#2a2a20] rounded-lg p-4">
                <h3 className="text-[#c9aa71] text-sm mb-2" style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '10px' }}>
                  {item.q}
                </h3>
                <p className="text-[#8a8a7a] text-sm" style={{ fontFamily: 'monospace' }}>
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="text-center pt-8 border-t border-[#1a1a15]">
          <Link
            href="/play"
            className="inline-block px-8 py-4 bg-[#c9aa71] text-[#1a1a0f] font-bold hover:bg-[#d9ba81] transition-colors border-b-4 border-[#8b7355]"
            style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '12px' }}
          >
            START PLAYING
          </Link>
        </div>
      </main>
    </div>
  );
}
