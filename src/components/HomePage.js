"use client";

import React, { useEffect, useState } from "react";
import {
  Menu,
  X,
  Linkedin,
  Calendar,
  Rocket,
  Brain,
  Database,
  Wrench,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";
import { Analytics } from "@vercel/analytics/react";

// ================= COLORS =================
const BG = "#FAF9F5";
const ACCENT1 = "#7aa595ff";
const ACCENT2 = "#FECF56";
const TITLES = "#393E41";
const TEXT = "#393E41";
const CARD_BG = "#FFFFFF";

const NAV_HEIGHT = 88;

// ================= CONTENT (FR only for now) =================
const t = {
  name: "Lucas Massoni",
  nav: { home: "Accueil", services: "Services", stack: "Stack", contact: "Contact" },
  hero: {
    kicker: "Freelance Salesforce",
    title: (
      <>
        EXPERT <span className="salesforce-word">SALESFORCE</span>
      </>
    ),
    subtitle:
      "Sales, CPQ, Analytics et Data Migration. De la stratégie au delivery, avec une exécution rapide, documentée et orientée résultats.",
    ctaPrimary: "DÉMARRER UN PROJET",
    ctaSecondary: "VOIR MES SERVICES",
    badges: ["CPQ", "Analytics", "Apex / Flow / LWC", "Data Migration"],
  },
  services: {
    title: "MES SERVICES",
    items: [
      {
        icon: <Rocket size={22} />,
        title: "Salesforce Sales & CPQ",
        desc: "Configuration avancée, pricing, bundles, règles CPQ et industrialisation du quote-to-cash.",
      },
      {
        icon: <Brain size={22} />,
        title: "Analytics & Tableau",
        desc: "Dashboards décisionnels, KPI fiables, data storytelling direction.",
        cta: { label: "DÉMO INTERACTIVE", url: "https://www.economytimelapse.com/" },
      },
      {
        icon: <Wrench size={22} />,
        title: "Développement Apex / Flow / LWC",
        desc: "Automatisations robustes, intégrations API, logique métier complexe et UX sur-mesure.",
      },
      {
        icon: <Database size={22} />,
        title: "Data Migration Salesforce",
        desc: "Audit, mapping, staging SQL, dédoublonnage, chargements batchés et cut-over maîtrisé.",
      },
    ],
  },
  stack: {
    title: "STACK TECHNIQUE",
    items: [
      "Salesforce",
      "CPQ",
      "Data Migration",
      "Apex",
      "Flow",
      "LWC",
      "SQL",
      "Tableau",
      "CRM Analytics",
      "API / JSON",
    ],
  },
  contact: {
    title: "Travaillons ensemble",
    subtitle: "Explique ton besoin. Réponse sous 24h.",
    calendly: "Planifier un appel",
    linkedin: "LinkedIn",
  },
  footer: "© {year} Lucas Massoni. Expert Salesforce Freelance",
};

const Container = ({ children }) => (
  <div className="max-w-7xl mx-auto px-6 md:px-10">{children}</div>
);

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Force line break for "SALESFORCE" on mobile like your original
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @media (max-width: 620px) { .salesforce-word { display:block !important; } }
      @media (min-width: 621px) { .salesforce-word { display:inline !important; } }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const NavLogo = () => {
    const { RiveComponent } = useRive({
      src: "/logo.riv",
      stateMachines: "SM",
      autoplay: true,
      layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
      backgroundColor: "transparent",
    });
    return (
      <div className="w-10 h-10 mr-3 flex items-center justify-center">
        <RiveComponent className="w-full h-full" />
      </div>
    );
  };

  const navItems = [
    { label: t.nav.home, href: "#top" },
    { label: t.nav.services, href: "#services" },
    { label: t.nav.stack, href: "#stack" },
    { label: t.nav.contact, href: "#contact" },
  ];

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="min-h-screen relative" style={{ background: BG, color: TEXT }}>
      <Analytics />

      {/* NAV */}
      <nav
        className="fixed w-full z-50 transition-all duration-500"
        style={{
          height: NAV_HEIGHT,
          background: scrolled ? `${BG}f2` : `${BG}cc`,
          borderBottom: `1px solid ${ACCENT1}33`,
          backdropFilter: "blur(14px)",
        }}
      >
        <Container>
          <div className="flex justify-between items-center h-[88px]">
            <a href="#top" className="flex items-center">
              <NavLogo />
              <span className="font-tech-upper text-xl font-bold" style={{ color: TITLES }}>
                {t.name}
              </span>
            </a>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.slice(0, 3).map((item) => (
                <a key={item.href} href={item.href} className="nav-link font-tech-upper" style={{ color: TITLES }}>
                  {item.label}
                </a>
              ))}
              <a
                href="#contact"
                className="btn-primary btn-hover"
                style={{ padding: "12px 18px", fontSize: "0.8rem" }}
              >
                {t.nav.contact}
              </a>
            </div>

            {/* Mobile */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen((v) => !v)}
              aria-label="Open menu"
              style={{ color: TITLES }}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </Container>

        {/* Mobile menu panel */}
        {isMenuOpen && (
          <div
            className="md:hidden"
            style={{
              background: `${BG}f6`,
              borderTop: `1px solid ${ACCENT1}33`,
              backdropFilter: "blur(14px)",
            }}
          >
            <Container>
              <div className="py-5 flex flex-col gap-2">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className="font-tech-upper px-3 py-3 rounded-xl"
                    style={{
                      color: TITLES,
                      letterSpacing: "0.14em",
                      background: `${ACCENT1}0c`,
                      border: `1px solid ${ACCENT1}22`,
                    }}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </Container>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="top" style={{ paddingTop: NAV_HEIGHT }} className="pt-14 pb-20">
        <Container>
          <div className="max-w-3xl">
            <div className="flex gap-2 mb-4 flex-wrap">
              {t.hero.badges.map((b) => (
                <span key={b} className="badge">
                  {b}
                </span>
              ))}
            </div>

            <div className="font-tech-upper text-sm mb-3 opacity-70">{t.hero.kicker}</div>

            <h1 className="hero-title font-tech-upper font-bold">{t.hero.title}</h1>

            <p className="font-tech mt-6 text-lg leading-relaxed">{t.hero.subtitle}</p>

            <div className="flex gap-4 mt-8 flex-wrap">
              <a href="#contact" className="btn-primary btn-hover">
                {t.hero.ctaPrimary}
                <ArrowRight size={18} />
              </a>
              <a href="#services" className="btn-secondary btn-hover">
                {t.hero.ctaSecondary}
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-20">
        <Container>
          <h2 className="section-title">{t.services.title}</h2>

          <div className="grid md:grid-cols-2 gap-6 mt-10">
            {t.services.items.map((s) => (
              <motion.div
                key={s.title}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="service-card card-hover"
              >
                <div className="icon">{s.icon}</div>
                <div className="min-w-0">
                  <div className="service-title">{s.title}</div>
                  <p className="service-text">{s.desc}</p>

                  {s.cta?.url && (
                    <div className="mt-4">
                      <a
                        href={s.cta.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary btn-hover"
                        style={{ padding: "10px 14px", fontSize: "0.78rem" }}
                      >
                        {s.cta.label}
                        <ArrowRight size={16} />
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* STACK */}
      <section id="stack" className="py-20">
        <Container>
          <h2 className="section-title">{t.stack.title}</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-10">
            {t.stack.items.map((item) => (
              <div key={item} className="stack-card card-hover">
                {item}
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-24">
        <Container>
          <div className="contact-box card-hover">
            <h2 className="section-title">{t.contact.title}</h2>
            <p className="font-tech mt-4">{t.contact.subtitle}</p>

            <div className="flex gap-4 mt-6 flex-wrap">
              <a
                href="https://calendly.com/lucas-massoni-contact"
                className="btn-primary btn-hover"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Calendar size={18} />
                {t.contact.calendly}
              </a>

              <a
                href="https://www.linkedin.com/in/lucas-massoni/"
                className="btn-secondary btn-hover"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin size={18} />
                {t.contact.linkedin}
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* FOOTER */}
      <footer className="py-8 border-t text-center" style={{ borderColor: `${ACCENT1}22` }}>
        <div className="font-tech text-sm opacity-70">
          {t.footer.replace("{year}", new Date().getFullYear())}
        </div>
      </footer>

      {/* STYLES */}
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }

        /* Titles */
        .hero-title {
          font-size: clamp(2.4rem, 5vw, 3.2rem);
          letter-spacing: 0.13em;
          color: ${TITLES};
          line-height: 1.05;
        }

        .section-title {
          font-family: var(--font-share-tech-mono);
          letter-spacing: 0.14em;
          font-weight: 700;
          color: ${TITLES};
          font-size: clamp(1.8rem, 4vw, 2.35rem);
        }

        /* Badges */
        .badge {
          padding: 6px 12px;
          border-radius: 999px;
          border: 1px solid ${ACCENT1}44;
          background: ${ACCENT1}14;
          font-family: var(--font-share-tech-mono);
          font-size: 0.72rem;
          letter-spacing: 0.12em;
          color: ${TITLES};
        }

        /* Buttons */
        .btn-primary,
        .btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 16px 28px;
          border-radius: 999px;
          font-family: var(--font-share-tech-mono);
          letter-spacing: 0.12em;
          font-weight: 700;
          text-decoration: none;
          user-select: none;
        }

        .btn-primary {
          background: ${ACCENT1};
          color: ${BG};
          box-shadow: 0 10px 28px rgba(122, 165, 149, 0.25);
          border: 1px solid ${ACCENT1};
        }

        .btn-secondary {
          border: 1px solid ${ACCENT1};
          color: ${TITLES};
          background: ${CARD_BG};
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
        }

        /* Hover like your old one + extra polish */
        .btn-hover {
          transition: transform 0.16s cubic-bezier(0.4, 2, 0.6, 1),
            box-shadow 0.18s cubic-bezier(0.4, 2, 0.6, 1),
            filter 0.18s cubic-bezier(0.4, 2, 0.6, 1);
          will-change: transform, box-shadow, filter;
        }

        .btn-hover:hover {
          transform: scale(1.045);
          box-shadow: 0 16px 42px rgba(122, 165, 149, 0.32);
          filter: saturate(1.06);
        }

        .btn-hover:active {
          transform: scale(1.01);
          box-shadow: 0 12px 34px rgba(122, 165, 149, 0.22);
        }

        .btn-hover:focus-visible {
          outline: 2px solid ${ACCENT2};
          outline-offset: 3px;
        }

        /* Cards */
        .service-card {
          background: ${CARD_BG};
          border-radius: 20px;
          padding: 24px;
          display: flex;
          gap: 16px;
          border: 1px solid ${ACCENT1}33;
          box-shadow: 0 14px 45px rgba(0, 0, 0, 0.06);
        }

        .stack-card {
          padding: 18px;
          text-align: center;
          border-radius: 16px;
          background: ${CARD_BG};
          border: 1px solid ${ACCENT1}33;
          font-family: var(--font-share-tech-mono);
          letter-spacing: 0.12em;
          color: ${TITLES};
          box-shadow: 0 14px 45px rgba(0, 0, 0, 0.06);
        }

        .contact-box {
          background: ${CARD_BG};
          border-radius: 24px;
          padding: 48px;
          border: 1px solid ${ACCENT1}33;
          box-shadow: 0 18px 60px rgba(0, 0, 0, 0.07);
        }

        .card-hover {
          transition: transform 0.22s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.22s cubic-bezier(0.22, 1, 0.36, 1),
            border-color 0.22s ease;
          will-change: transform, box-shadow;
        }

        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 22px 70px rgba(0, 0, 0, 0.10);
          border-color: ${ACCENT1}66;
        }

        /* Icons */
        .icon {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${ACCENT1}14;
          border: 1px solid ${ACCENT1}2a;
          color: ${ACCENT1};
          flex: 0 0 auto;
        }

        .service-title {
          font-family: var(--font-share-tech-mono);
          letter-spacing: 0.12em;
          font-weight: 700;
          color: ${ACCENT1};
          line-height: 1.2;
        }

        .service-text {
          margin-top: 6px;
          line-height: 1.6;
          color: ${TEXT};
          opacity: 0.92;
        }

        /* Nav underline effect */
        .nav-link {
          position: relative;
          letter-spacing: 0.14em;
          text-decoration: none;
          padding: 6px 2px;
        }

        .nav-link::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -2px;
          width: 0;
          height: 2px;
          background: ${ACCENT1};
          transition: width 0.22s ease;
        }

        .nav-link:hover::after {
          width: 100%;
        }

        @media (max-width: 640px) {
          .contact-box {
            padding: 28px;
          }
          .btn-primary,
          .btn-secondary {
            padding: 14px 18px;
          }
        }
      `}</style>
    </div>
  );
}
