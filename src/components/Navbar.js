"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/language-context";
import { BG, ACCENT1, TITLES, TEXT, BORDER, NAV_HEIGHT } from "@/lib/constants";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: t.nav.home, href: "/" },
    { label: t.nav.services, href: "/services" },
    { label: t.nav.about, href: "/about" },
    { label: t.nav.stack, href: "/stack" },
    { label: t.nav.contact, href: "/contact" },
  ];

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav
        className="fixed w-full z-50 transition-all duration-500"
        style={{
          background: scrolled ? `rgba(15, 17, 20, 0.9)` : `rgba(15, 17, 20, 0.6)`,
          backdropFilter: scrolled ? "blur(20px) saturate(1.2)" : "blur(12px)",
          borderBottom: scrolled ? `1px solid ${BORDER}` : "1px solid transparent",
          height: `${NAV_HEIGHT}px`,
        }}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="flex justify-between items-center" style={{ height: `${NAV_HEIGHT}px` }}>
            <Link href="/" className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: `rgba(122, 165, 149, 0.1)`,
                  border: `1px solid rgba(122, 165, 149, 0.2)`,
                }}
              >
                <span className="font-tech-upper text-xs font-bold" style={{ color: ACCENT1 }}>
                  LM
                </span>
              </div>
              <span
                className="text-base font-medium hidden sm:inline-block"
                style={{ color: TITLES, letterSpacing: "-0.01em" }}
              >
                {t.name}
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-2 rounded-lg font-tech text-xs transition-all duration-300"
                  style={{
                    color: isActive(link.href) ? ACCENT1 : TEXT,
                    background: isActive(link.href) ? `rgba(122, 165, 149, 0.08)` : "transparent",
                  }}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ background: ACCENT1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
              <div
                className="w-px h-5 mx-2"
                style={{ background: BORDER }}
              />
              <button
                onClick={() => setLanguage(language === "fr" ? "en" : "fr")}
                className="font-tech text-xs px-3 py-1.5 rounded-lg transition-all duration-300"
                style={{
                  color: TEXT,
                  background: `rgba(122, 165, 149, 0.05)`,
                  border: `1px solid ${BORDER}`,
                }}
              >
                {language === "fr" ? "EN" : "FR"}
              </button>
            </div>

            {/* Mobile burger */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{ color: TITLES }}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="md:hidden fixed w-full z-40"
            style={{
              background: `rgba(15, 17, 20, 0.95)`,
              backdropFilter: "blur(20px)",
              top: `${NAV_HEIGHT}px`,
              borderBottom: `1px solid ${BORDER}`,
            }}
          >
            <div className="px-6 py-6 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-3 rounded-lg font-tech text-sm transition-colors duration-200"
                  style={{
                    color: isActive(link.href) ? ACCENT1 : TEXT,
                    background: isActive(link.href) ? `rgba(122, 165, 149, 0.08)` : "transparent",
                  }}
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={() => setLanguage(language === "fr" ? "en" : "fr")}
                className="px-4 py-3 font-tech text-sm text-left rounded-lg"
                style={{ color: TEXT }}
              >
                {language === "fr" ? "Switch to English" : "Passer en Francais"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
