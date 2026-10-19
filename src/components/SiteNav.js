"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Calendar } from "lucide-react";
import RiveLogo from "./RiveLogo";

const EASE = [0.22, 1, 0.36, 1];

// Barre de navigation partagée (accueil et guides).
// `items` : [{ href, label }]. `onToggleLang` absent = pas de sélecteur de langue.
export default function SiteNav({ t, lang = "fr", onToggleLang, items, contactHref = "#contact" }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className={`nav${scrolled ? " is-scrolled" : ""}`}>
        <div className="container nav-inner">
          <Link href="/" className="brand" onClick={closeMenu}>
            <RiveLogo className="brand-logo" />
            <span className="brand-name">{t.name}</span>
            <span className="brand-sep" aria-hidden="true" />
            <span className="brand-role">{t.footer.tagline}</span>
          </Link>
          <nav className="nav-links" aria-label="Sections">
            {items.map((item) => (
              <a key={item.href} href={item.href} className={`nav-link${item.current ? " is-current" : ""}`} aria-current={item.current ? "page" : undefined}>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="nav-actions">
            {onToggleLang && (
              <button type="button" className="lang-toggle" onClick={onToggleLang} title={t.nav.switchLang} aria-label={t.nav.switchLang}>
                <span className={lang === "fr" ? "is-current" : ""}>FR</span>
                <span className="lang-sep" aria-hidden="true" />
                <span className={lang === "en" ? "is-current" : ""}>EN</span>
              </button>
            )}
            <a href={contactHref} className="btn btn-primary btn-sm nav-contact">{t.nav.contact}</a>
            <button
              type="button"
              className="menu-btn"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? t.nav.close : t.nav.menu}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-menu"
            className="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: EASE }}
            aria-label="Menu"
          >
            <div className="container">
              {items.map((item) => (
                <a key={item.href} href={item.href} className="mobile-link" onClick={closeMenu}>{item.label}</a>
              ))}
              <a href={contactHref} className="mobile-link" onClick={closeMenu}>{t.nav.contact}</a>
              <a href="https://calendly.com/lucas-massoni-contact" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                <Calendar size={16} />
                {t.contact.calendly}
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
