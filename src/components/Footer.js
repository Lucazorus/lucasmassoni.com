"use client";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { BG, ACCENT1, TEXT } from "@/lib/constants";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer
      className="py-8 relative border-t transition-colors duration-1000 px-6 md:px-0"
      style={{ background: BG, borderColor: `${ACCENT1}33` }}
    >
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: `${ACCENT1}55` }}
      />
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p
            className="font-tech text-xs"
            style={{ color: TEXT, fontSize: "0.89rem", opacity: 0.69 }}
          >
            {t.footer.replace("{year}", new Date().getFullYear())}
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/services"
              className="font-tech text-xs transition-colors duration-200 hover:opacity-100"
              style={{ color: TEXT, fontSize: "0.85rem", opacity: 0.55 }}
            >
              {t.nav.services}
            </Link>
            <Link
              href="/about"
              className="font-tech text-xs transition-colors duration-200 hover:opacity-100"
              style={{ color: TEXT, fontSize: "0.85rem", opacity: 0.55 }}
            >
              {t.nav.about}
            </Link>
            <Link
              href="/stack"
              className="font-tech text-xs transition-colors duration-200 hover:opacity-100"
              style={{ color: TEXT, fontSize: "0.85rem", opacity: 0.55 }}
            >
              {t.nav.stack}
            </Link>
            <Link
              href="/contact"
              className="font-tech text-xs transition-colors duration-200 hover:opacity-100"
              style={{ color: TEXT, fontSize: "0.85rem", opacity: 0.55 }}
            >
              {t.nav.contact}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
