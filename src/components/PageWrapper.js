"use client";
import { BG, NAV_HEIGHT } from "@/lib/constants";

export default function PageWrapper({ children }) {
  return (
    <div
      className="min-h-screen relative overflow-hidden font-tech tracking-tight"
      style={{ background: BG, paddingTop: `${NAV_HEIGHT}px` }}
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none z-0"
        style={{
          background: `linear-gradient(${BG} 1px, transparent 1px), linear-gradient(90deg, ${BG} 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          animation: "grid 12s linear infinite",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
