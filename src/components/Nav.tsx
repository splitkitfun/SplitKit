"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/game", label: "Play" },
  { href: "/docs", label: "Docs" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-[#0f0f1a]/90 border-b border-[#00ff88]/30 z-50">
      <div className="max-w-4xl mx-auto px-4 py-3 flex gap-6">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm transition-colors ${
              pathname === link.href ? "text-[#00ff88]" : "text-[#888] hover:text-[#00ff88]"
            }`}
            style={{ fontFamily: '"Press Start 2P", monospace', fontSize: "10px" }}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

