"use client";

import SiteNav from "./SiteNav";
import SiteFooter from "./SiteFooter";
import { translations } from "./translations";

// Enveloppe des pages Guides : navigation et pied de page du site, en français.
export default function GuideShell({ children, current = "guides" }) {
  const t = translations.fr;
  const items = [
    { href: "/#services", label: t.nav.services },
    { href: "/#approche", label: t.nav.approach },
    { href: "/#stack", label: t.nav.stack },
    { href: "/guides", label: t.nav.guides, current: current === "guides" },
  ];
  return (
    <>
      <SiteNav t={t} items={items} contactHref="/#contact" />
      <main>{children}</main>
      <SiteFooter t={t} items={items} contactHref="/#contact" />
    </>
  );
}
