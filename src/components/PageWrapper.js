"use client";
import { BG, NAV_HEIGHT, ACCENT1 } from "@/lib/constants";

export default function PageWrapper({ children }) {
  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: BG, paddingTop: `${NAV_HEIGHT}px` }}
    >
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(122, 165, 149, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(122, 165, 149, 0.03) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />
      {/* Top ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] pointer-events-none z-0"
        style={{
          background: `radial-gradient(ellipse at center, rgba(122, 165, 149, 0.06) 0%, transparent 70%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
