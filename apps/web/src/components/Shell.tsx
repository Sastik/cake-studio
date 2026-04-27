import type { ReactNode } from "react";
import TopNav from "./TopNav";
import StickyWhatsAppCTA from "./StickyWhatsAppCTA";
import BackgroundFX from "./fx/BackgroundFX";

export default function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh relative overflow-hidden">
      <BackgroundFX />
      <div className="relative z-10">
        <TopNav />
        <main className="mx-auto w-full max-w-[1100px] px-4 pb-28 pt-5">
          {children}
        </main>
        <StickyWhatsAppCTA />
      </div>
    </div>
  );
}

