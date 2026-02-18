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
  Globe,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";
import { Analytics } from "@vercel/analytics/react";

// ================= COLORS =================
const BG = "#FAF9F5";
const ACCENT1 = "#7aa595";
const ACCENT2 = "#FECF56";
const TITLES = "#393E41";
const TEXT = "#393E41";
const CARD_BG = "#FFFFFF";

const NAV_HEIGHT = 88;

// ================= TRANSLATIONS =================
const translations = {
  fr: {
    name: "Lucas Massoni",
    nav: { home: "Accueil", services: "Services", stack: "Stack", contact: "Contact" },
    hero: {
      kicker: "Freelance Salesforce",
      titleLine1: "EXPERT",
      titleLine2: "SALESFORCE",
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
          key: "cpq",
          title: "Salesforce Sales & CPQ",
          desc: "Configuration avancée, pricing, bundles, règles CPQ et industrialisation complète du cycle quote-to-cash.",
        },
        {
          key: "analytics",
          title: "Analytics & Tableau",
          desc: "Dashboards décisionnels, KPIs fiables, data storytelling orienté direction et opérations.",
          cta: { label: "DÉMO INTERACTIVE", url: "https://www.economytimelapse.com/" },
        },
        {
          key: "dev",
          title: "Développement Apex / Flow / LWC",
          desc: "Automatisations robustes, intégrations API, logique métier complexe et expériences utilisateurs sur-mesure.",
        },
        {
          key: "migration",
          title: "Data Migration Salesforce",
          desc: "Audit, mapping, staging SQL, dédoublonnage, chargements batchés et cut-over maîtrisé.",
        },
      ],
    },
    stack: {
      title: "STACK TECHNIQUE",
      items: [
        { name: "Salesforce", desc: "CRM leader mondial. Configuration, administration et personnalisation de la plateforme." },
        { name: "CPQ", desc: "Configure, Price, Quote. Industrialisation du cycle de vente et des devis complexes." },
        { name: "Data Migration", desc: "Transfert et transformation de données entre systèmes avec qualité garantie." },
        { name: "Apex", desc: "Langage back-end natif Salesforce pour la logique métier et les intégrations serveur." },
        { name: "Flow", desc: "Automatisation no-code/low-code : workflows, écrans guidés et processus métier." },
        { name: "LWC", desc: "Lightning Web Components : composants UI modernes et performants sur Salesforce." },
        { name: "SQL", desc: "Requêtes et transformations de données pour le staging, l'audit et la migration." },
        { name: "Tableau", desc: "Visualisation de données avancée et dashboards décisionnels interactifs." },
        { name: "CRM Analytics", desc: "Analytics natif Salesforce : exploration de données et rapports embarqués." },
        { name: "API / JSON", desc: "Intégrations REST/SOAP entre Salesforce et systèmes tiers via échanges JSON." },
      ],
    },
    contact: {
      title: "Travaillons ensemble",
      subtitle: "Décrivez votre besoin. Réponse sous 24h.",
      calendly: "Planifier un appel",
      linkedin: "LinkedIn",
    },
    footer: "© {year} Lucas Massoni · Expert Salesforce Freelance",
  },
  en: {
    name: "Lucas Massoni",
    nav: { home: "Home", services: "Services", stack: "Stack", contact: "Contact" },
    hero: {
      kicker: "Freelance Salesforce Consultant",
      titleLine1: "SALESFORCE",
      titleLine2: "EXPERT",
      subtitle:
        "Sales, CPQ, Analytics & Data Migration. From strategy to delivery — fast, documented, and results-driven.",
      ctaPrimary: "START A PROJECT",
      ctaSecondary: "VIEW MY SERVICES",
      badges: ["CPQ", "Analytics", "Apex / Flow / LWC", "Data Migration"],
    },
    services: {
      title: "MY SERVICES",
      items: [
        {
          key: "cpq",
          title: "Salesforce Sales & CPQ",
          desc: "Advanced configuration, pricing rules, product bundles, and full quote-to-cash process industrialisation.",
        },
        {
          key: "analytics",
          title: "Analytics & Tableau",
          desc: "Executive dashboards, reliable KPIs, and data storytelling designed for leadership and operations teams.",
          cta: { label: "INTERACTIVE DEMO", url: "https://www.economytimelapse.com/" },
        },
        {
          key: "dev",
          title: "Apex / Flow / LWC Development",
          desc: "Robust automations, API integrations, complex business logic, and custom user experiences.",
        },
        {
          key: "migration",
          title: "Salesforce Data Migration",
          desc: "Audit, field mapping, SQL staging, deduplication, batch loading, and controlled cut-over.",
        },
      ],
    },
    stack: {
      title: "TECH STACK",
      items: [
        { name: "Salesforce", desc: "World-leading CRM. Platform configuration, administration and customisation." },
        { name: "CPQ", desc: "Configure, Price, Quote. Streamlining complex sales cycles and quoting processes." },
        { name: "Data Migration", desc: "Reliable data transfer and transformation between systems with quality assurance." },
        { name: "Apex", desc: "Salesforce native back-end language for business logic and server-side integrations." },
        { name: "Flow", desc: "No-code/low-code automation: workflows, guided screens, and business processes." },
        { name: "LWC", desc: "Lightning Web Components: modern, high-performance UI components on Salesforce." },
        { name: "SQL", desc: "Data querying and transformation for staging, auditing, and migration pipelines." },
        { name: "Tableau", desc: "Advanced data visualisation and interactive executive dashboards." },
        { name: "CRM Analytics", desc: "Native Salesforce analytics: embedded data exploration and reporting." },
        { name: "API / JSON", desc: "REST/SOAP integrations between Salesforce and third-party systems via JSON." },
      ],
    },
    contact: {
      title: "Let's work together",
      subtitle: "Tell me about your project. I'll get back to you within 24 hours.",
      calendly: "Schedule a call",
      linkedin: "LinkedIn",
    },
    footer: "© {year} Lucas Massoni · Freelance Salesforce Expert",
  },
};

// Icons are outside translations to avoid re-creating JSX on every render
const SERVICE_ICONS = {
  cpq: <Rocket size={22} />,
  analytics: <Brain size={22} />,
  dev: <Wrench size={22} />,
  migration: <Database size={22} />,
};

const Container = ({ children }) => (
  <div className="max-w-7xl mx-auto px-6 md:px-10">{children}</div>
);

// ================= LANG TOGGLE =================
function LangToggle({ lang, setLang }) {
  return (
    <button
      onClick={() => setLang((l) => (l === "fr" ? "en" : "fr"))}
      aria-label="Switch language"
      className="lang-toggle btn-hover"
      title={lang === "fr" ? "Switch to English" : "Passer en français"}
    >
      <Globe size={14} />
      <span>{lang === "fr" ? "EN" : "FR"}</span>
    </button>
  );
}

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lang, setLang] = useState("fr");

  const t = translations[lang];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Force line break for the second title word on mobile
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @media (max-width: 620px) { .hero-title-line2 { display:block !important; } }
      @media (min-width: 621px) { .hero-title-line2 { display:inline !important; } }
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
                <a
                  key={item.href}
                  href={item.href}
                  className="nav-link font-tech-upper"
                  style={{ color: TITLES }}
                >
                  {item.label}
                </a>
              ))}
              <LangToggle lang={lang} setLang={setLang} />
              <a
                href="#contact"
                className="btn-primary btn-hover"
                style={{ padding: "12px 18px", fontSize: "0.8rem" }}
              >
                {t.nav.contact}
              </a>
            </div>

            {/* Mobile: lang toggle + hamburger */}
            <div className="md:hidden flex items-center gap-3">
              <LangToggle lang={lang} setLang={setLang} />
              <button
                onClick={() => setIsMenuOpen((v) => !v)}
                aria-label="Open menu"
                style={{ color: TITLES }}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
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
      <AnimatePresence mode="wait">
        <motion.section
          key={lang + "-hero"}
          id="top"
          style={{ paddingTop: NAV_HEIGHT }}
          className="pt-14 pb-20"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
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

              <h1 className="hero-title font-tech-upper font-bold">
                {t.hero.titleLine1}{" "}
                <span className="hero-title-line2">{t.hero.titleLine2}</span>
              </h1>

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
        </motion.section>
      </AnimatePresence>

      {/* SERVICES */}
      <AnimatePresence mode="wait">
        <motion.section
          key={lang + "-services"}
          id="services"
          className="py-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          <Container>
            <h2 className="section-title">{t.services.title}</h2>

            <div className="grid md:grid-cols-2 gap-6 mt-10">
              {t.services.items.map((s) => (
                <motion.div
                  key={s.key}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="service-card card-hover"
                >
                  <div className="icon">{SERVICE_ICONS[s.key]}</div>
                  <div className="min-w-0">
                    <div className="service-title">{s.title}</div>
                    <p className="service-text">{s.desc}</p>

                    {s.cta?.url && (
                      <div className="mt-4">
                        <div className="preview-wrapper">
                          <a
                            href={s.cta.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-secondary btn-hover preview-trigger"
                            style={{ padding: "10px 14px", fontSize: "0.78rem" }}
                          >
                            {s.cta.label}
                            <ArrowRight size={16} />
                          </a>
                          <div className="preview-tooltip">
                            <img
                              src="/Capture.png"
                              alt="Aperçu du site"
                              className="preview-img"
                            />
                            <div className="preview-label">economytimelapse.com</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </Container>
        </motion.section>
      </AnimatePresence>

      {/* STACK */}
      <section id="stack" className="py-20">
        <Container>
          <h2 className="section-title">{t.stack.title}</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-10">
            {t.stack.items.map((item) => (
              <div key={item.name} className="flip-card">
                <div className="flip-inner">
                  <div className="flip-front">
                    {item.name}
                  </div>
                  <div className="flip-back">
                    <span className="flip-back-name">{item.name}</span>
                    <p className="flip-back-desc">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CONTACT */}
      <AnimatePresence mode="wait">
        <motion.section
          key={lang + "-contact"}
          id="contact"
          className="py-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
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
        </motion.section>
      </AnimatePresence>

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

        /* Lang toggle */
        .lang-toggle {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 13px;
          border-radius: 999px;
          font-family: var(--font-share-tech-mono);
          font-size: 0.72rem;
          letter-spacing: 0.12em;
          font-weight: 700;
          color: ${TITLES};
          background: ${CARD_BG};
          border: 1px solid ${ACCENT1}44;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          transition: transform 0.16s cubic-bezier(0.4, 2, 0.6, 1),
            box-shadow 0.18s ease,
            border-color 0.18s ease;
        }
        .lang-toggle:hover {
          border-color: ${ACCENT1}99;
          box-shadow: 0 8px 22px rgba(122, 165, 149, 0.2);
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

        /* Preview tooltip */
        .preview-wrapper {
          position: relative;
          display: inline-block;
        }

        .preview-tooltip {
          position: absolute;
          bottom: calc(100% + 12px);
          left: 50%;
          transform: translateX(-50%) translateY(6px);
          width: 280px;
          background: ${CARD_BG};
          border-radius: 14px;
          border: 1px solid ${ACCENT1}33;
          box-shadow: 0 20px 60px rgba(0,0,0,0.18);
          overflow: hidden;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.22s ease, transform 0.22s cubic-bezier(0.22,1,0.36,1);
          z-index: 100;
        }

        .preview-wrapper:hover .preview-tooltip {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
          pointer-events: auto;
        }

        .preview-img {
          width: 100%;
          height: 160px;
          object-fit: cover;
          object-position: top;
          display: block;
        }

        .preview-label {
          padding: 8px 12px;
          font-family: var(--font-share-tech-mono);
          font-size: 0.68rem;
          letter-spacing: 0.1em;
          color: ${TITLES};
          opacity: 0.6;
          border-top: 1px solid ${ACCENT1}22;
        }

        /* Flip cards */
        .flip-card {
          height: 100px;
          perspective: 900px;
        }

        .flip-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .flip-card:hover .flip-inner {
          transform: rotateY(180deg);
        }

        .flip-front,
        .flip-back {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          border-radius: 16px;
          border: 1px solid ${ACCENT1}33;
          box-shadow: 0 14px 45px rgba(0, 0, 0, 0.06);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 14px;
        }

        .flip-front {
          background: ${CARD_BG};
          font-family: var(--font-share-tech-mono);
          letter-spacing: 0.12em;
          color: ${TITLES};
          text-align: center;
          font-size: 0.85rem;
        }

        .flip-back {
          background: ${ACCENT1};
          transform: rotateY(180deg);
          flex-direction: column;
          gap: 6px;
          text-align: center;
        }

        .flip-back-name {
          font-family: var(--font-share-tech-mono);
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          color: ${BG};
          opacity: 0.8;
          text-transform: uppercase;
        }

        .flip-back-desc {
          font-size: 0.68rem;
          line-height: 1.5;
          color: ${BG};
          opacity: 0.95;
          margin: 0;
        }

        @media (hover: none) {
          /* Touch devices: tap to flip */
          .flip-card:active .flip-inner {
            transform: rotateY(180deg);
          }
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
          box-shadow: 0 22px 70px rgba(0, 0, 0, 0.1);
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

        /* Nav underline effect (dark bg) */
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

        /* Nav underline effect (white on green) */
        .nav-link-white {
          position: relative;
          letter-spacing: 0.14em;
          text-decoration: none;
          padding: 6px 2px;
          opacity: 0.9;
          transition: opacity 0.18s ease;
        }

        .nav-link-white::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -2px;
          width: 0;
          height: 2px;
          background: ${BG};
          transition: width 0.22s ease;
        }

        .nav-link-white:hover {
          opacity: 1;
        }

        .nav-link-white:hover::after {
          width: 100%;
        }

        /* Contact button in nav (white outline on green) */
        .btn-nav-contact {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          border-radius: 999px;
          font-family: var(--font-share-tech-mono);
          letter-spacing: 0.12em;
          font-weight: 700;
          text-decoration: none;
          user-select: none;
          background: rgba(255,255,255,0.18);
          color: ${BG};
          border: 1px solid rgba(255,255,255,0.5);
          box-shadow: 0 4px 14px rgba(0,0,0,0.1);
        }

        .btn-nav-contact:hover {
          background: rgba(255,255,255,0.28);
          box-shadow: 0 8px 22px rgba(0,0,0,0.15);
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
