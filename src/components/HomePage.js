"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  LineChart, Line, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar,
  AreaChart, Area,
  ScatterChart, Scatter, XAxis, YAxis,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from "recharts";
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
  const [scrollProgress, setScrollProgress] = useState(0);

  const t = translations[lang];

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docH > 0 ? Math.min(window.scrollY / docH, 1) : 0);
    };
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const CHART_COLORS = ["#6f9caf", "#70aaaf", "#6fafac", "#70af84", "#ffcf56", "#a8c5b8"];

  // ---- rAF-driven time for buttery smooth animation (like D3 project) ----
  const rafRef = useRef(null);
  const tRef   = useRef(0);
  const [chartFrame, setChartFrame] = useState(0);

  useEffect(() => {
    let last = null;
    let sinceTick = 0;
    const TICK = 1000 / 30; // cap at 30fps to avoid setState storm
    const step = (ts) => {
      if (last !== null) {
        const dt = ts - last;
        tRef.current += dt * 0.001; // seconds
        sinceTick += dt;
        if (sinceTick >= TICK) {
          sinceTick = 0;
          setChartFrame(f => f + 1); // trigger re-render at ~30fps
        }
      }
      last = ts;
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const T = tRef.current;
  const sin  = (freq, phase = 0) => Math.sin(T * freq + phase);
  const sin01 = (freq, phase = 0) => (sin(freq, phase) + 1) / 2;

  // 1. Line — 3 trending-up sales curves with slight natural wobble
  const lineData = Array.from({ length: 12 }, (_, i) => {
    const x = i / 11; // 0 → 1
    return {
      a: 10 + 75 * x + 6  * Math.sin(T * 0.18 + i * 0.4),
      b: 5  + 55 * x + 5  * Math.sin(T * 0.22 + i * 0.5 + 1.2),
      c: 2  + 35 * x + 4  * Math.sin(T * 0.15 + i * 0.35 + 2.5),
    };
  });

  // 2. Pie — 4 segments always summing to 100 (true full pie)
  const pieRaw = [
    20 + 14 * sin01(0.5,  0.0),
    20 + 14 * sin01(0.7,  1.8),
    20 + 14 * sin01(0.9,  3.5),
    20 + 14 * sin01(0.4,  5.2),
  ];
  const pieSum = pieRaw.reduce((a, b) => a + b, 0);
  const pieData = pieRaw.map((v, i) => ({ name: String(i), value: (v / pieSum) * 100 }));

  // 3. Bars — 8 bars
  const barData = Array.from({ length: 8 }, (_, i) => ({
    v: 15 + 75 * sin01(0.6 + i * 0.12, i * 0.7),
  }));

  // 4. Percent Area Chart — 3 stacked areas always summing to 100%
  const areaData = Array.from({ length: 10 }, (_, i) => {
    const r0 = 25 + 18 * sin01(0.4 + i * 0.05, i * 0.6);
    const r1 = 30 + 16 * sin01(0.5 + i * 0.06, i * 0.7 + 1.5);
    const r2 = 25 + 14 * sin01(0.35 + i * 0.04, i * 0.5 + 3.0);
    const total = r0 + r1 + r2;
    return {
      a: (r0 / total) * 100,
      b: (r1 / total) * 100,
      c: (r2 / total) * 100,
    };
  });

  // 5. Scatter — two clusters drifting around slowly
  const scatterData1 = Array.from({ length: 10 }, (_, i) => ({
    x: 20 + 30 * sin01(0.18 + i * 0.08, i * 0.9),
    y: 15 + 40 * sin01(0.22 + i * 0.07, i * 0.8 + 1.1),
  }));
  const scatterData2 = Array.from({ length: 10 }, (_, i) => ({
    x: 55 + 30 * sin01(0.15 + i * 0.09, i * 0.85 + 2.0),
    y: 50 + 35 * sin01(0.2  + i * 0.06, i * 0.75 + 0.5),
  }));

  // 6. Radar — 5 axes, values oscillate slowly
  const radarSubjects = ["A", "B", "C", "D", "E"];
  const radarData = radarSubjects.map((subject, i) => ({
    subject,
    v1: 30 + 60 * sin01(0.25 + i * 0.11, i * 1.1),
    v2: 25 + 55 * sin01(0.3  + i * 0.09, i * 1.0 + 2.0),
  }));

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
          style={{ paddingTop: NAV_HEIGHT + 48 }}
          className="pb-20"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <Container>
            <div className="hero-layout">
              {/* LEFT: text */}
              <div className="hero-left">
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

              {/* RIGHT: 4 charts grid */}
              <div className="hero-right">
                <div className="charts-grid">

                  {/* 1. Line — 3 trending sales curves */}
                  <div className="chart-bare">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={lineData} margin={{ top: 6, right: 6, left: 6, bottom: 6 }}>
                        <Line type="monotone" dataKey="a" stroke={CHART_COLORS[0]} strokeWidth={2} dot={false} isAnimationActive={false} strokeLinecap="round" />
                        <Line type="monotone" dataKey="b" stroke={CHART_COLORS[3]} strokeWidth={2} dot={false} isAnimationActive={false} strokeLinecap="round" />
                        <Line type="monotone" dataKey="c" stroke={CHART_COLORS[4]} strokeWidth={2} dot={false} isAnimationActive={false} strokeLinecap="round" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* 2. Pie — always 100% filled, slowly rotates */}
                  <div className="chart-bare chart-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData} dataKey="value"
                          cx="50%" cy="50%"
                          innerRadius="30%" outerRadius="48%"
                          paddingAngle={1.5}
                          startAngle={90 + T * 12}
                          endAngle={90 + T * 12 + 360}
                          isAnimationActive={false}
                        >
                          {pieData.map((_, i) => (
                            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* 3. Bar */}
                  <div className="chart-bare">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData} margin={{ top: 6, right: 6, left: 6, bottom: 6 }} barCategoryGap="18%">
                        <Bar dataKey="v" radius={[3, 3, 0, 0]} isAnimationActive={false}>
                          {barData.map((_, i) => (
                            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* 4. Percent Area Chart — 3 stacked areas = 100% */}
                  <div className="chart-bare">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={areaData} margin={{ top: 6, right: 6, left: 6, bottom: 6 }} stackOffset="expand">
                        <Area type="monotone" dataKey="a" stackId="1" stroke="none" fill={CHART_COLORS[0]} isAnimationActive={false} />
                        <Area type="monotone" dataKey="b" stackId="1" stroke="none" fill={CHART_COLORS[3]} isAnimationActive={false} />
                        <Area type="monotone" dataKey="c" stackId="1" stroke="none" fill={CHART_COLORS[4]} isAnimationActive={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* 5. Scatter — two drifting clusters */}
                  <div className="chart-bare">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart margin={{ top: 6, right: 6, left: 6, bottom: 6 }}>
                        <XAxis dataKey="x" type="number" domain={[0, 100]} hide={true} />
                        <YAxis dataKey="y" yAxisId="left" type="number" domain={[0, 100]} hide={true} />
                        <YAxis dataKey="y" yAxisId="right" orientation="right" type="number" domain={[0, 100]} hide={true} />
                        <Scatter yAxisId="left" data={scatterData1} fill={CHART_COLORS[0]} isAnimationActive={false} />
                        <Scatter yAxisId="right" data={scatterData2} fill={CHART_COLORS[4]} isAnimationActive={false} />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>

                  {/* 6. Radar — 5-axis specified domain */}
                  <div className="chart-bare chart-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData} margin={{ top: 6, right: 12, left: 12, bottom: 6 }}>
                        <PolarGrid stroke={`${ACCENT1}44`} />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: ACCENT1, fontSize: 10, fontFamily: "var(--font-share-tech-mono)" }} />
                        <Radar dataKey="v1" stroke={CHART_COLORS[0]} fill={CHART_COLORS[0]} fillOpacity={0.35} isAnimationActive={false} dot={false} />
                        <Radar dataKey="v2" stroke={CHART_COLORS[4]} fill={CHART_COLORS[4]} fillOpacity={0.28} isAnimationActive={false} dot={false} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>

                </div>
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

        /* Hero 2-col layout */
        .hero-layout {
          display: flex;
          align-items: stretch;
          gap: 80px;
          min-height: 380px;
        }

        .hero-left {
          flex: 1;
          min-width: 0;
          max-width: 560px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .hero-right {
          flex: 0 0 560px;
          display: flex;
          flex-direction: column;
        }

        .charts-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: 1fr 1fr;
          gap: 10px;
          flex: 1;
        }

        .chart-bare {
          background: transparent;
          overflow: hidden;
          min-height: 0;
        }

        .chart-center {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (max-width: 960px) {
          .hero-right {
            display: none;
          }
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
