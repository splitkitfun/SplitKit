"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isPlayPage = pathname === "/play";

  if (isPlayPage) {
    // Fullscreen game page - no header/footer
    return <>{children}</>;
  }

  // Regular pages with header and footer
  return (
    <>
      <Header />
      <div className="min-h-[70vh]">{children}</div>
      <Footer />
    </>
  );
}

