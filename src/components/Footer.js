"use client";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { BG, BG_CARD, ACCENT1, TEXT, BORDER } from "@/lib/constants";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer
      className="py-10 px-6 md:px-8"
      style={{
        background: BG,
        borderTop: `1px solid ${BORDER}`,
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p
            className="font-tech text-xs"
            style={{ color: TEXT, opacity: 0.5 }}
          >
            {t.footer.replace("{year}", new Date().getFullYear())}
          </p>
          <div className="flex items-center gap-6">
            {[
              { label: t.nav.services, href: "/services" },
              { label: t.nav.about, href: "/about" },
              { label: t.nav.stack, href: "/stack" },
              { label: t.nav.contact, href: "/contact" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-tech text-xs transition-colors duration-200"
                style={{ color: TEXT, opacity: 0.4 }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = ACCENT1;
                  e.currentTarget.style.opacity = "1";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = TEXT;
                  e.currentTarget.style.opacity = "0.4";
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
