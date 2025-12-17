import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <h1
          className="text-6xl md:text-8xl text-[#c9aa71] mb-4"
          style={{ fontFamily: '"Press Start 2P", monospace' }}
        >
          404
        </h1>
        <h2
          className="text-2xl md:text-3xl text-[#8b7355] mb-6"
          style={{ fontFamily: '"Press Start 2P", monospace' }}
        >
          PAGE NOT FOUND
        </h2>
        <p className="text-[#8a8a7a] mb-8 text-lg" style={{ fontFamily: 'monospace' }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-block px-8 py-4 bg-[#c9aa71] text-[#1a1a0f] font-bold hover:bg-[#d9ba81] transition-all duration-200 border-b-4 border-[#8b7355] hover:border-[#9b8365]"
            style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '12px' }}
          >
            GO HOME
          </Link>
          <Link
            href="/play"
            className="inline-block px-8 py-4 bg-transparent text-[#8b8b7b] border-2 border-[#3a3a2a] hover:border-[#5a5a4a] hover:text-[#aaaa9a] transition-all duration-200"
            style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '12px' }}
          >
            PLAY GAME
          </Link>
        </div>
      </div>
    </div>
  );
}

