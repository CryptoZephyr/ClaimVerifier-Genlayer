"use client";

import { useState, useEffect } from "react";
import { AccountPanel } from "./AccountPanel";
import { useClaimVerifier } from "@/lib/hooks/useClaimVerifier";
import { LogoVerifier } from "./Logo";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { history } = useClaimVerifier();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const threshold = 80;

      setIsScrolled(scrollY > 20);

      // Calculate progress from 0 to 1 for smoother animations
      const progress = Math.min(Math.max((scrollY - 10) / threshold, 0), 1);
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Minimal variant with scroll animations
  const paddingTop = Math.round(scrollProgress * 16); // 0-16px padding
  const headerHeight = 64 - Math.round(scrollProgress * 8); // 64px to 56px

  const getBorderRadius = () => {
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      return Math.round(scrollProgress * 9999); // Fully rounded when scrolled on desktop
    }
    return 0; // No rounding on mobile
  };
  const borderRadius = getBorderRadius();

  // Updated stats for Forensic verification
  const totalClaims = history?.data?.length || 0;
  const verifiedClaims = history?.data?.filter(entry => entry.verdict && entry.verdict !== "uncertain").length || 0;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out"
      style={{ paddingTop: `${paddingTop}px` }}
    >
      <div
        className="transition-all duration-500 ease-out"
        style={{
          width: '100%',
          maxWidth: isScrolled ? '80rem' : '100%',
          margin: '0 auto',
          borderRadius: `${borderRadius}px`,
        }}
      >
        <div
          className="backdrop-blur-xl border transition-all duration-500 ease-out md:rounded-none"
          style={{
            borderColor: `oklch(0.3 0.02 265 / ${0.4 + scrollProgress * 0.4})`,
            background: `linear-gradient(135deg, oklch(0.18 0.01 265 / ${0.1 + scrollProgress * 0.3}) 0%, oklch(0.15 0.01 265 / ${0.05 + scrollProgress * 0.25}) 50%, oklch(0.16 0.01 265 / ${0.08 + scrollProgress * 0.27}) 100%)`,
            borderRadius: `${borderRadius}px`,
            borderWidth: '1px',
            borderLeftWidth: isScrolled ? '1px' : '0px',
            borderRightWidth: isScrolled ? '1px' : '0px',
            borderTopWidth: isScrolled ? '1px' : '0px',
            boxShadow: isScrolled
              ? '0 32px 64px 0 rgba(0, 0, 0, 0.4), inset 0 1px 0 0 oklch(0.3 0.02 265 / 0.3)'
              : 'none',
          }}
        >
          <div
            className="px-6 transition-all duration-500 mx-auto"
            style={{
              maxWidth: isScrolled ? '80rem' : '112rem',
            }}
          >
            <div
              className="flex items-center justify-between transition-all duration-500"
              style={{ height: `${headerHeight}px` }}
            >
              {/* Left: Branding */}
              <div className="flex items-center gap-3">
                <LogoVerifier size="md" className="flex md:hidden" />
                <LogoVerifier size="md" className="hidden md:flex" />
              </div>

              {/* Center: Live Protocol Stats */}
              <div className="hidden lg:flex items-center gap-8 text-[10px] font-bold uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Global Claims:</span>
                  <span className="text-primary">{totalClaims}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Consensuses Reached:</span>
                  <span className="text-primary">{verifiedClaims}</span>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-3">
                <AccountPanel />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}