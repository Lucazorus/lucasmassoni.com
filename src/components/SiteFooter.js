"use client";

import Link from "next/link";
import RiveLogo from "./RiveLogo";

// Pied de page partagé (accueil et guides).
export default function SiteFooter({ t, items, contactHref = "#contact" }) {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link href="/" className="brand">
            <RiveLogo className="brand-logo" />
            <span className="brand-name">{t.name}</span>
          </Link>
          <p>{t.footer.tagline}</p>
        </div>
        <nav className="footer-col" aria-label={t.footer.navLabel}>
          <span className="footer-label">{t.footer.navLabel}</span>
          {items.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
          <a href={contactHref}>{t.nav.contact}</a>
        </nav>
        <div className="footer-col">
          <span className="footer-label">{t.footer.contactLabel}</span>
          {t.footer.links.map((l) => (
            <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer">{l.label}</a>
          ))}
        </div>
      </div>
      <div className="container footer-legal">
        <span>{t.footer.rights.replace("{year}", year)}</span>
        <span>lucasmassoni.com</span>
      </div>
    </footer>
  );
}
