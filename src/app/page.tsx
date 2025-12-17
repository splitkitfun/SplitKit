'use client';

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0d1a0d] to-[#0a0a0f]" />
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, #1a3a1a 0%, transparent 50%)`,
        }} />
        
        {/* Floating particles effect - using fixed positions to avoid hydration mismatch */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[
            { left: 10, top: 20, dur: 8, delay: 1 },
            { left: 25, top: 45, dur: 12, delay: 3 },
            { left: 40, top: 15, dur: 9, delay: 0 },
            { left: 55, top: 70, dur: 11, delay: 2 },
            { left: 70, top: 35, dur: 7, delay: 4 },
            { left: 85, top: 60, dur: 10, delay: 1.5 },
            { left: 15, top: 80, dur: 13, delay: 2.5 },
            { left: 30, top: 55, dur: 8, delay: 3.5 },
            { left: 60, top: 25, dur: 14, delay: 0.5 },
            { left: 80, top: 85, dur: 9, delay: 4.5 },
            { left: 5, top: 40, dur: 11, delay: 1.2 },
            { left: 45, top: 90, dur: 10, delay: 2.8 },
            { left: 75, top: 10, dur: 12, delay: 3.2 },
            { left: 90, top: 50, dur: 8, delay: 0.8 },
            { left: 20, top: 65, dur: 13, delay: 4.2 },
          ].map((p, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-[#2a5a2a] rounded-full opacity-40"
              style={{
                left: `${p.left}%`,
                top: `${p.top}%`,
                animation: `float ${p.dur}s ease-in-out infinite`,
                animationDelay: `${p.delay}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {/* Logo/Title */}
          <div className="mb-6">
            <h1 
              className="text-5xl md:text-7xl font-bold text-[#c9aa71] tracking-wide mb-2"
              style={{ 
                fontFamily: '"Press Start 2P", monospace',
                textShadow: '0 4px 0 #5a4a2a, 0 0 40px rgba(201, 170, 113, 0.3)',
                letterSpacing: '0.1em',
              }}
            >
              SPLITKIT
            </h1>
            <div 
              className="text-2xl md:text-3xl text-[#8b7355]"
              style={{ fontFamily: '"Press Start 2P", monospace' }}
            >
              ARENA
            </div>
          </div>

          {/* Tagline */}
          <p className="text-[#9a9a8a] text-lg md:text-xl mb-8 max-w-xl mx-auto" style={{ fontFamily: 'monospace' }}>
            An Old School RuneScape-inspired browser RPG. Train skills, explore the world, complete quests.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/play"
              className="px-10 py-4 bg-[#c9aa71] text-[#1a1a0f] font-bold text-lg hover:bg-[#d9ba81] transition-all duration-200 border-b-4 border-[#8b7355] hover:border-[#9b8365] active:border-b-0 active:mt-1"
              style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '14px' }}
            >
              PLAY NOW
            </Link>
            <Link
              href="/docs"
              className="px-10 py-4 bg-transparent text-[#8b8b7b] border-2 border-[#3a3a2a] hover:border-[#5a5a4a] hover:text-[#aaaa9a] transition-all duration-200"
              style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '12px' }}
            >
              LEARN MORE
            </Link>
          </div>

          {/* Screenshot placeholder */}
          <div className="relative mx-auto max-w-2xl">
            <div className="bg-[#1a1a15] border-4 border-[#2a2a20] rounded-lg overflow-hidden shadow-2xl">
              <div className="aspect-video bg-gradient-to-br from-[#2d5a27] to-[#1a3a1a] flex items-center justify-center relative">
                {/* Fake game screenshot */}
                <div className="absolute inset-0 opacity-60">
                  <div className="absolute w-8 h-8 bg-[#5c3d2e] rounded-sm" style={{ left: '20%', top: '30%' }} />
                  <div className="absolute w-12 h-10 bg-[#2e8b2e] rounded-full" style={{ left: '18%', top: '20%' }} />
                  <div className="absolute w-8 h-8 bg-[#5c3d2e] rounded-sm" style={{ left: '60%', top: '50%' }} />
                  <div className="absolute w-12 h-10 bg-[#1e6b1e] rounded-full" style={{ left: '58%', top: '40%' }} />
                  <div className="absolute w-4 h-5 bg-[#ffcc99] rounded-sm" style={{ left: '45%', top: '55%' }} />
                  <div className="absolute w-4 h-6 bg-[#2255aa] rounded-sm" style={{ left: '45%', top: '58%' }} />
                </div>
                <div className="relative z-10 text-[#5a8a5a] text-sm" style={{ fontFamily: 'monospace' }}>
                  Explore • Gather • Level Up
                </div>
              </div>
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[#4a4a3a] text-xs" style={{ fontFamily: 'monospace' }}>
              No download required • Play in browser
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#4a4a3a] animate-bounce">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-[#0d0d0a]">
        <div className="max-w-5xl mx-auto">
          <h2 
            className="text-2xl md:text-3xl text-[#c9aa71] text-center mb-16"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            SKILLS
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Woodcutting */}
            <div className="bg-[#151510] border border-[#2a2a20] p-6 rounded-lg">
              <div className="text-4xl mb-4">🪓</div>
              <h3 className="text-[#c9aa71] text-lg mb-2" style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '12px' }}>
                Woodcutting
              </h3>
              <p className="text-[#8a8a7a] text-sm" style={{ fontFamily: 'monospace' }}>
                Chop trees across multiple regions. Progress from basic trees to Oak, Willow, and Maple. Each tree type requires higher levels.
              </p>
              <div className="mt-4 flex gap-2">
                <span className="px-2 py-1 bg-[#2a3a2a] text-[#6a8a6a] text-xs rounded">Lvl 1-15</span>
                <span className="px-2 py-1 bg-[#2a3a2a] text-[#6a8a6a] text-xs rounded">4 Tree Types</span>
              </div>
            </div>

            {/* Fishing */}
            <div className="bg-[#151510] border border-[#2a2a20] p-6 rounded-lg">
              <div className="text-4xl mb-4">🎣</div>
              <h3 className="text-[#4488cc] text-lg mb-2" style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '12px' }}>
                Fishing
              </h3>
              <p className="text-[#8a8a7a] text-sm" style={{ fontFamily: 'monospace' }}>
                Cast your line at fishing spots along the riverbank. Catch shrimp and trout, then cook them for food that restores energy.
              </p>
              <div className="mt-4 flex gap-2">
                <span className="px-2 py-1 bg-[#2a3a4a] text-[#6a8aaa] text-xs rounded">Lvl 1-10</span>
                <span className="px-2 py-1 bg-[#2a3a4a] text-[#6a8aaa] text-xs rounded">2 Fish Types</span>
              </div>
            </div>

            {/* Cooking */}
            <div className="bg-[#151510] border border-[#2a2a20] p-6 rounded-lg">
              <div className="text-4xl mb-4">🔥</div>
              <h3 className="text-[#ff8844] text-lg mb-2" style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '12px' }}>
                Cooking
              </h3>
              <p className="text-[#8a8a7a] text-sm" style={{ fontFamily: 'monospace' }}>
                Use campfires to cook raw fish into food. Cooked fish restores energy, allowing you to sprint longer and explore further.
              </p>
              <div className="mt-4 flex gap-2">
                <span className="px-2 py-1 bg-[#3a2a2a] text-[#aa6a4a] text-xs rounded">Campfires</span>
                <span className="px-2 py-1 bg-[#3a2a2a] text-[#aa6a4a] text-xs rounded">Energy Food</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* World Section */}
      <section className="py-24 px-4 bg-[#0a0a08]">
        <div className="max-w-5xl mx-auto">
          <h2 
            className="text-2xl md:text-3xl text-[#c9aa71] text-center mb-16"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            THE WORLD
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { name: 'Lumbridge Woods', desc: 'Your starting area. Basic trees, a bank, and the Woodcutting Tutor.', color: '#3b7a1a' },
              { name: 'Draynor Swamp', desc: 'A murky swamp with Willow trees and darker atmosphere.', color: '#2a5a2a' },
              { name: 'Riverbank', desc: 'Fishing spots, a campfire for cooking, and the Fishing Tutor.', color: '#4a8844' },
              { name: 'Forest Edge', desc: 'Dense forest with the highest-level Maple trees.', color: '#2d6620' },
            ].map((area) => (
              <div key={area.name} className="flex gap-4 items-start bg-[#151510] border border-[#2a2a20] p-4 rounded-lg">
                <div 
                  className="w-16 h-16 rounded-lg flex-shrink-0"
                  style={{ backgroundColor: area.color }}
                />
                <div>
                  <h3 className="text-[#b9a971] mb-1" style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '10px' }}>
                    {area.name}
                  </h3>
                  <p className="text-[#7a7a6a] text-sm" style={{ fontFamily: 'monospace' }}>
                    {area.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Progression Section */}
      <section className="py-24 px-4 bg-[#0d0d0a]">
        <div className="max-w-5xl mx-auto">
          <h2 
            className="text-2xl md:text-3xl text-[#c9aa71] text-center mb-16"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            PROGRESSION
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl text-[#c9aa71] mb-4" style={{ fontFamily: '"Press Start 2P", monospace' }}>15+</div>
              <div className="text-[#8a8a7a]" style={{ fontFamily: 'monospace' }}>Skill Levels</div>
            </div>
            <div>
              <div className="text-5xl text-[#c9aa71] mb-4" style={{ fontFamily: '"Press Start 2P", monospace' }}>4</div>
              <div className="text-[#8a8a7a]" style={{ fontFamily: 'monospace' }}>Explorable Regions</div>
            </div>
            <div>
              <div className="text-5xl text-[#c9aa71] mb-4" style={{ fontFamily: '"Press Start 2P", monospace' }}>3</div>
              <div className="text-[#8a8a7a]" style={{ fontFamily: 'monospace' }}>Quests to Complete</div>
            </div>
          </div>

          <div className="mt-16 bg-[#151510] border border-[#2a2a20] p-6 rounded-lg max-w-2xl mx-auto">
            <h3 className="text-[#ffaa44] mb-4" style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '12px' }}>
              QUESTS
            </h3>
            <ul className="space-y-3 text-[#8a8a7a]" style={{ fontFamily: 'monospace' }}>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-[#c9aa71] rounded-full" />
                <span>Getting Started - Learn the basics of woodcutting</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-[#4488cc] rounded-full" />
                <span>First Catch - Try your hand at fishing</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-[#ffd700] rounded-full" />
                <span>Supply Run - Use the banking system</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-[#0a0a08] to-[#0d1a0d]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 
            className="text-2xl md:text-3xl text-[#c9aa71] mb-6"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            READY TO BEGIN?
          </h2>
          <p className="text-[#8a8a7a] mb-8" style={{ fontFamily: 'monospace' }}>
            Your adventure awaits. No account required to start playing.
          </p>
          <Link
            href="/play"
            className="inline-block px-12 py-5 bg-[#c9aa71] text-[#1a1a0f] font-bold text-lg hover:bg-[#d9ba81] transition-all duration-200 border-b-4 border-[#8b7355] hover:border-[#9b8365]"
            style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '14px' }}
          >
            ENTER THE ARENA
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-[#0a0a08] border-t border-[#1a1a15]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-[#4a4a3a] text-sm" style={{ fontFamily: 'monospace' }}>
            SplitKit Arena © 2024
          </div>
          <div className="flex gap-6">
            <Link href="/docs" className="text-[#6a6a5a] hover:text-[#9a9a8a] text-sm" style={{ fontFamily: 'monospace' }}>
              Documentation
            </Link>
            <Link href="/play" className="text-[#6a6a5a] hover:text-[#9a9a8a] text-sm" style={{ fontFamily: 'monospace' }}>
              Play Game
            </Link>
          </div>
        </div>
      </footer>

      {/* Global styles for animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.4; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 0.2; }
        }
      `}</style>
    </div>
  );
}
