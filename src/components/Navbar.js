"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/language-context";
import { BG, ACCENT1, TITLES, NAV_HEIGHT } from "@/lib/constants";

export default function Navbar() {
  console.log("[v0] Navbar rendering");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const pathname = usePathname();
  console.log("[v0] Navbar pathname:", pathname);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
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
        className={`fixed w-full z-50 transition-all duration-700 ${scrolled ? "backdrop-blur-xl shadow-2xl" : ""}`}
        style={{
          background: scrolled ? `${BG}e6` : `${BG}cc`,
          borderBottom: `1px solid ${ACCENT1}33`,
          height: `${NAV_HEIGHT}px`,
        }}
      >
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex justify-between items-center h-[88px]">
            <Link href="/" className="flex items-center">
              <div className="w-10 h-10 mr-2 flex items-center justify-center">
                <span
                  className="font-tech-upper text-lg font-bold"
                  style={{ color: ACCENT1 }}
                >
                  LM
                </span>
              </div>
              <span
                className="text-2xl font-bold font-tech-upper tracking-tighter ml-2"
                style={{ color: TITLES }}
              >
                {t.name}
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="transition-all duration-300 font-tech-upper relative text-base font-medium"
                  style={{
                    color: isActive(link.href) ? ACCENT1 : TITLES,
                  }}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full"
                      style={{ background: ACCENT1 }}
                    />
                  )}
                </Link>
              ))}
              <button
                onClick={() =>
                  setLanguage(language === "fr" ? "en" : "fr")
                }
                className="transition-all duration-500 font-tech-upper text-base font-medium px-3 py-1 rounded-full border"
                style={{
                  color: TITLES,
                  borderColor: `${ACCENT1}44`,
                }}
              >
                {language === "fr" ? "EN" : "FR"}
              </button>
            </div>
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="transition-colors duration-500"
                style={{ color: TITLES }}
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="md:hidden fixed w-full z-40 backdrop-blur-xl shadow-xl"
            style={{ background: `${BG}f0`, top: `${NAV_HEIGHT}px` }}
          >
            <div className="px-6 py-8 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-3 font-tech-upper text-base font-medium rounded-lg transition-colors duration-200"
                  style={{
                    color: isActive(link.href) ? ACCENT1 : TITLES,
                    background: isActive(link.href)
                      ? `${ACCENT1}11`
                      : "transparent",
                  }}
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={() =>
                  setLanguage(language === "fr" ? "en" : "fr")
                }
                className="block px-4 py-3 font-tech-upper text-base font-medium text-left"
                style={{ color: TITLES }}
              >
                {language === "fr" ? "EN" : "FR"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
