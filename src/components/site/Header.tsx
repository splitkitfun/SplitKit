"use client";

import Link from "next/link";
import { site } from "@/config/site";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg border border-white/15 bg-white/5" />
          <div className="text-sm font-semibold tracking-wide">{site.name}</div>
        </Link>

        <nav className="flex items-center gap-2 text-sm">
          <Link href="/play" className="rounded-lg px-3 py-2 hover:bg-white/10">
            Play
          </Link>
          <Link href="/docs" className="rounded-lg px-3 py-2 hover:bg-white/10">
            Docs
          </Link>

          <a
            href={site.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-white/15 px-3 py-2 hover:bg-white/10"
          >
            GitHub
          </a>
          <a
            href={site.xUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-white/15 px-3 py-2 hover:bg-white/10"
          >
            X
          </a>

          <Link
            href="/play"
            className="rounded-lg bg-white/10 px-3 py-2 font-medium hover:bg-white/15"
          >
            Enter Arena
          </Link>
        </nav>
      </div>
    </header>
  );
}

