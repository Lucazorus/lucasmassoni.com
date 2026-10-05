"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  LineChart, Line, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar,
  ComposedChart, Area,
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
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
  ChevronDown,
  Smartphone,
  Layers,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";
import { Analytics } from "@vercel/analytics/react";

// ================= COLORS =================
const BG = "#FAF9F5";
const ACCENT1 = "#7aa595";
const ACCENT1_DEEP = "#5e8a7a";
const ACCENT2 = "#FECF56";
const TITLES = "#393E41";
const TEXT = "#393E41";
const CARD_BG = "#FAF9F5";

// Neumorphism shadow tokens — same hue as BG, just lighter/darker variants
const SHADOW_DARK = "#d8d4ca";
const SHADOW_LIGHT = "#ffffff";
const SHADOW_OUT = `9px 9px 22px ${SHADOW_DARK}, -9px -9px 22px ${SHADOW_LIGHT}`;
const SHADOW_OUT_LG = `14px 14px 32px ${SHADOW_DARK}, -14px -14px 32px ${SHADOW_LIGHT}`;
const SHADOW_OUT_SM = `5px 5px 12px ${SHADOW_DARK}, -5px -5px 12px ${SHADOW_LIGHT}`;
const SHADOW_IN = `inset 6px 6px 14px ${SHADOW_DARK}, inset -6px -6px 14px ${SHADOW_LIGHT}`;
const SHADOW_IN_SM = `inset 3px 3px 7px ${SHADOW_DARK}, inset -3px -3px 7px ${SHADOW_LIGHT}`;

const NAV_HEIGHT = 88;

// ================= TRANSLATIONS =================
const translations = {
  fr: {
    name: "Lucas Massoni",
    nav: { home: "Accueil", services: "Services", stack: "Stack", contact: "Contact" },
    hero: {
      kicker: "Freelance Salesforce & SAP",
      titleLine1: "EXPERT SALESFORCE",
      titleLine2: "SAP & ANALYTICS",
      subtitle:
        "Salesforce (Sales, CPQ, Apex/Flow/LWC), SAP (S/4HANA, Fiori, ABAP) et Analytics avancé. De la stratégie au delivery, avec une exécution rapide, documentée et orientée résultats.",
      ctaPrimary: "DÉMARRER UN PROJET",
      ctaSecondary: "VOIR MES SERVICES",
      badges: ["CPQ", "Analytics", "Apex / Flow / LWC", "Data Migration", "SAP"],
    },
    services: {
      title: "MES SERVICES",
      items: [
        {
          key: "cpq",
          title: "Salesforce Sales & CPQ",
          desc: "Configuration avancée des objets, règles de pricing et bundles produits. Personnalisation complète du cycle quote-to-cash : de la qualification jusqu'à la signature, avec des processus automatisés et documentés.",
        },
        {
          key: "analytics",
          title: "Analytics & Tableau",
          desc: "Dashboards décisionnels, KPIs fiables, data storytelling orienté direction et opérations.",
          cta: { label: "Global Economy Timelapse", url: "https://www.economytimelapse.com/", preview: "/Capture.png", previewLabel: "economytimelapse.com" },
          cta2: { label: "Open Mandats", url: "https://www.openmandats.com/", preview: "/open-mandats.png", previewLabel: "openmandats.com" },
        },
        {
          key: "dev",
          title: "Développement Apex / Flow / LWC",
          desc: "Automatisations robustes via Flow et Apex, intégrations REST/SOAP avec des systèmes tiers, logique métier complexe côté serveur et composants Lightning sur-mesure pour des expériences utilisateurs optimisées.",
        },
        {
          key: "migration",
          title: "Data Migration Salesforce",
          desc: "Audit complet des données sources, mapping de champs, staging SQL, règles de dédoublonnage, chargements batchés via Data Loader ou scripts Python, et bascule finale maîtrisée avec plan de retour arrière.",
        },
        {
          key: "sap",
          title: "Intégration SAP & ERP",
          desc: "Customisation et intégrations sur SAP (S/4HANA, Fiori, SAP BTP, ABAP). Connecteurs entre SAP et autres systèmes d'information, analyse des process métier, automatisations data et migrations cross-ERP.",
        },
        {
          key: "mobile",
          title: "Applications mobiles et produits web",
          desc: "Conception et développement d'applications iOS/Android et de produits web, de l'idée à la mise en ligne. Par exemple Anima Apnea sur l'App Store, et Spokedex, l'index des standards vélo en 7 langues.",
          cta: { label: "Anima Apnea", url: "https://www.animaapnea.com/" },
          cta2: { label: "App Store", sublabel: "Télécharger sur l'App Store", url: "https://apps.apple.com/fr/app/anima-apnea/id6760680506", appStore: true },
          cta3: { label: "Spokedex", url: "https://spokedex.com/fr", preview: "/spokedex-preview.png", previewLabel: "spokedex.com" },
        },
      ],
    },
    stack: {
      title: "STACK TECHNIQUE",
      columns: [
        {
          title: "Salesforce",
          items: [
            { name: "Salesforce", desc: "CRM leader mondial. Configuration, administration et personnalisation de la plateforme." },
            { name: "CPQ", desc: "Configure, Price, Quote. Industrialisation du cycle de vente et des devis complexes." },
            { name: "Apex", desc: "Langage back-end natif Salesforce pour la logique métier et les intégrations serveur." },
            { name: "Flow", desc: "Automatisation no-code/low-code : workflows, écrans guidés et processus métier." },
            { name: "LWC", desc: "Lightning Web Components : composants UI modernes et performants sur Salesforce." },
            { name: "API / JSON", desc: "Intégrations REST/SOAP entre Salesforce et systèmes tiers via échanges JSON." },
          ],
        },
        {
          title: "SAP",
          items: [
            { name: "SAP", desc: "ERP leader mondial. Customisation, intégrations et automatisation des process métier." },
            { name: "S/4HANA", desc: "Dernière génération SAP ERP : finance, logistique et chaîne d'approvisionnement." },
            { name: "ABAP", desc: "Langage natif SAP pour le développement back-end et la customisation ERP." },
            { name: "Fiori", desc: "Interface utilisateur moderne SAP en HTML5/UI5, cohérente sur tous les modules." },
            { name: "SAP BTP", desc: "Business Technology Platform : intégrations cloud, extensions et data services SAP." },
          ],
        },
        {
          title: "Analytics & Data",
          items: [
            { name: "Tableau", desc: "Visualisation de données avancée et dashboards décisionnels interactifs." },
            { name: "CRM Analytics", desc: "Analytics natif Salesforce : exploration de données et rapports embarqués." },
            { name: "SQL", desc: "Requêtes et transformations de données pour le staging, l'audit et la migration." },
            { name: "Data Migration", desc: "Transfert et transformation de données entre systèmes avec qualité garantie." },
          ],
        },
      ],
    },
    metrics: [
      { value: "6+", label: "Années d'expérience" },
      { value: "12+", label: "Projets livrés" },
      { value: "24h", label: "Temps de réponse" },
    ],
    contact: {
      title: "Travaillons ensemble",
      subtitle: "Décrivez votre besoin. Réponse sous 24h.",
      calendly: "Planifier un appel",
      linkedin: "LinkedIn",
      availability: "Disponible pour de nouveaux projets",
    },
    footer: "© {year} Lucas Massoni · Expert Salesforce, SAP & Analytics Freelance",
  },
  en: {
    name: "Lucas Massoni",
    nav: { home: "Home", services: "Services", stack: "Stack", contact: "Contact" },
    hero: {
      kicker: "Freelance Salesforce & SAP Consultant",
      titleLine1: "SALESFORCE EXPERT",
      titleLine2: "SAP & ANALYTICS",
      subtitle:
        "Salesforce (Sales, CPQ, Apex/Flow/LWC), SAP (S/4HANA, Fiori, ABAP) and advanced Analytics. From strategy to delivery — fast, documented, and results-driven.",
      ctaPrimary: "START A PROJECT",
      ctaSecondary: "VIEW MY SERVICES",
      badges: ["CPQ", "Analytics", "Apex / Flow / LWC", "Data Migration", "SAP"],
    },
    services: {
      title: "MY SERVICES",
      items: [
        {
          key: "cpq",
          title: "Salesforce Sales & CPQ",
          desc: "Advanced object configuration, pricing rules and product bundles. Full quote-to-cash industrialisation — from qualification to signature, with automated, documented and scalable processes.",
        },
        {
          key: "analytics",
          title: "Analytics & Tableau",
          desc: "Executive dashboards, reliable KPIs, and data storytelling designed for leadership and operations teams.",
          cta: { label: "Global Economy Timelapse", url: "https://www.economytimelapse.com/", preview: "/Capture.png", previewLabel: "economytimelapse.com" },
          cta2: { label: "Open Mandats", url: "https://www.openmandats.com/", preview: "/open-mandats.png", previewLabel: "openmandats.com" },
        },
        {
          key: "dev",
          title: "Apex / Flow / LWC Development",
          desc: "Robust Flow and Apex automations, REST/SOAP integrations with third-party systems, complex server-side business logic and custom Lightning components for optimised user experiences.",
        },
        {
          key: "migration",
          title: "Salesforce Data Migration",
          desc: "Full source data audit, field mapping, SQL staging, deduplication rules, batch loading via Data Loader or Python scripts, and planned cut-over with rollback strategy.",
        },
        {
          key: "sap",
          title: "SAP & ERP Integration",
          desc: "Customisation and integrations on SAP (S/4HANA, Fiori, SAP BTP, ABAP). Connectors between SAP and other enterprise systems, business process analysis, data automations and cross-ERP migrations.",
        },
        {
          key: "mobile",
          title: "Mobile Apps and Web Products",
          desc: "Design and development of iOS/Android apps and web products, from idea to launch. For example Anima Apnea on the App Store, and Spokedex, the bike standards index in 7 languages.",
          cta: { label: "Anima Apnea", url: "https://www.animaapnea.com/" },
          cta2: { label: "App Store", sublabel: "Download on the App Store", url: "https://apps.apple.com/fr/app/anima-apnea/id6760680506", appStore: true },
          cta3: { label: "Spokedex", url: "https://spokedex.com/en", preview: "/spokedex-preview.png", previewLabel: "spokedex.com" },
        },
      ],
    },
    stack: {
      title: "TECH STACK",
      columns: [
        {
          title: "Salesforce",
          items: [
            { name: "Salesforce", desc: "World-leading CRM. Platform configuration, administration and customisation." },
            { name: "CPQ", desc: "Configure, Price, Quote. Streamlining complex sales cycles and quoting processes." },
            { name: "Apex", desc: "Salesforce native back-end language for business logic and server-side integrations." },
            { name: "Flow", desc: "No-code/low-code automation: workflows, guided screens, and business processes." },
            { name: "LWC", desc: "Lightning Web Components: modern, high-performance UI components on Salesforce." },
            { name: "API / JSON", desc: "REST/SOAP integrations between Salesforce and third-party systems via JSON." },
          ],
        },
        {
          title: "SAP",
          items: [
            { name: "SAP", desc: "World-leading ERP. Platform customisation, integrations and business process automation." },
            { name: "S/4HANA", desc: "Latest-generation SAP ERP: finance, logistics and supply chain." },
            { name: "ABAP", desc: "SAP native language for back-end development and ERP customisation." },
            { name: "Fiori", desc: "Modern SAP user interface in HTML5/UI5, consistent across all modules." },
            { name: "SAP BTP", desc: "Business Technology Platform: cloud integrations, extensions and SAP data services." },
          ],
        },
        {
          title: "Analytics & Data",
          items: [
            { name: "Tableau", desc: "Advanced data visualisation and interactive executive dashboards." },
            { name: "CRM Analytics", desc: "Native Salesforce analytics: embedded data exploration and reporting." },
            { name: "SQL", desc: "Data querying and transformation for staging, auditing, and migration pipelines." },
            { name: "Data Migration", desc: "Reliable data transfer and transformation between systems with quality assurance." },
          ],
        },
      ],
    },
    metrics: [
      { value: "6+", label: "Years of experience" },
      { value: "12+", label: "Projects delivered" },
      { value: "24h", label: "Response time" },
    ],
    contact: {
      title: "Let's work together",
      subtitle: "Tell me about your project. I'll get back to you within 24 hours.",
      calendly: "Schedule a call",
      linkedin: "LinkedIn",
      availability: "Available for new projects",
    },
    footer: "© {year} Lucas Massoni · Freelance Salesforce, SAP & Analytics Expert",
  },
};

// Icons are outside translations to avoid re-creating JSX on every render
const SERVICE_ICONS = {
  cpq: <Rocket size={22} />,
  analytics: <Brain size={22} />,
  dev: <Wrench size={22} />,
  migration: <Database size={22} />,
  sap: <Layers size={22} />,
  mobile: <Smartphone size={22} />,
};

const Container = ({ children }) => (
  <div className="max-w-7xl mx-auto px-6 md:px-10" style={{ width: "100%" }}>{children}</div>
);

// ================= LOADER LOGO =================
function LoaderLogo() {
  const { rive, RiveComponent } = useRive({
    src: "/logo.riv",
    stateMachines: "SM",
    autoplay: true,
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
    backgroundColor: "transparent",
  });

  useEffect(() => {
    if (!rive) return;
    const inputs = rive.stateMachineInputs("SM");
    if (!inputs) return;

    // Trigger LogoHover on mount
    const hoverInput = inputs.find((i) => i.name === "LogoHover");
    if (hoverInput) hoverInput.value = true;

    // Trigger Click at 3s (before loader exits at 4s)
    const clickTimer = setTimeout(() => {
      const clickInput = rive.stateMachineInputs("SM")?.find((i) => i.name === "Click");
      if (clickInput) clickInput.fire();
    }, 1800);

    return () => clearTimeout(clickTimer);
  }, [rive]);

  return <RiveComponent className="w-full h-full" />;
}

// ================= NAV LOGO =================
// Must be defined OUTSIDE HomePage to avoid re-mounting on every re-render
function NavLogo() {
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
}

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

const TOTAL_SLIDES = 4;

// ================= MAGNETIC BUTTON =================
function MagneticButton({ children, className, style, ...props }) {
  const ref = useRef(null);
  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    ref.current.style.transform = `translate(${dx * 0.08}px, ${dy * 0.08}px)`;
  };
  const handleMouseLeave = () => {
    ref.current.style.transform = "translate(0, 0)";
  };
  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{ ...style, transition: "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)", display: "inline-block" }}
      {...props}
    >
      {children}
    </div>
  );
}

// ================= DATA PIPELINE ANIMATION =================
// Canvas cinématique en 6 actes, bouclés sur 16 s :
// INGEST → CLEANSE → STRUCTURE → MODEL → VISUALIZE → IMPACT.
// Moteur : système de particules à ressort. Chaque acte se contente de
// fournir une cible (position / rayon / couleur / opacité) par particule ;
// le ressort fait tout le morphing et absorbe les transitions d'acte.

const SCENE_W = 620;                    // largeur logique (la hauteur suit le conteneur)
const PIPE_N = 62;                      // particules totales
const PIPE_BAD = 12;                    // lignes rejetées au nettoyage
const PIPE_CLEAN = PIPE_N - PIPE_BAD;   // 50 = 5 colonnes × 10 lignes

const ACTS = [
  { key: "ingest",    t0: 0.0,  t1: 2.6 },
  { key: "cleanse",   t0: 2.6,  t1: 5.2 },
  { key: "structure", t0: 5.2,  t1: 7.8 },
  { key: "model",     t0: 7.8,  t1: 10.4 },
  { key: "visualize", t0: 10.4, t1: 13.4 },
  { key: "impact",    t0: 13.4, t1: 16.2 },
];
const ACT_TOTAL = 16.2;

// Palette dérivée de la charte neumorphism crème / vert sauge
const P_SAGE = "#7aa595";
const P_DEEP = "#5e8a7a";
const P_MINT = "#6fafac";
const P_PALE = "#a8c5b8";
const P_BLUE = "#6f9caf";
const P_YELL = "#fecf56";
const P_MUTE = "#c6c2b9";
const P_INK = "#393E41";
const P_SUB = "#9ca0a3";
const P_RULE = "#d8d4ca";
const DOT_PALETTE = [P_SAGE, P_MINT, P_BLUE, P_PALE, P_DEEP, P_YELL];

const PIPE_TXT = {
  fr: {
    kicker: "DATA PIPELINE",
    rows: "LIGNES",
    titles: ["INGESTION", "NETTOYAGE", "STRUCTURATION", "MODÉLISATION", "VISUALISATION", "IMPACT"],
    subs: [
      "Extraction de toutes vos sources",
      "Doublons, nulls, normalisation",
      "Mise en table & typage",
      "Schéma en étoile",
      "Dashboard temps réel",
      "Ce que ça change",
    ],
    rail: ["INGEST", "CLEAN", "STRUCT", "MODEL", "VIZ", "IMPACT"],
    sources: ["CRM", "ERP", "FICHIERS · API"],
    cols: ["ID", "COMPTE", "MONTANT", "DATE", "SCORE"],
    dims: ["COMPTE", "PRODUIT", "TEMPS", "RÉGION", "CANAL"],
    fact: "FAITS",
    charts: ["REVENU / MOIS", "VOLUME", "MIX", "CORRÉLATION"],
    scan: "CONTRÔLE QUALITÉ",
    nulls: "NULLS",
    dupes: "DOUBLONS",
    ok: "VALIDES",
    kpiLabel: "IMPACT MESURÉ",
    kpiSub: "de marge pilotée en temps réel",
    chips: ["-62% DE DÉLAI", "0 PERTE", "12 SOURCES"],
  },
  en: {
    kicker: "DATA PIPELINE",
    rows: "ROWS",
    titles: ["INGEST", "CLEANSE", "STRUCTURE", "MODEL", "VISUALIZE", "IMPACT"],
    subs: [
      "Extract from every source",
      "Duplicates, nulls, normalisation",
      "Typed, tabular, trusted",
      "Star schema",
      "Live dashboard",
      "What it changes",
    ],
    rail: ["INGEST", "CLEAN", "STRUCT", "MODEL", "VIZ", "IMPACT"],
    sources: ["CRM", "ERP", "FILES · API"],
    cols: ["ID", "ACCOUNT", "AMOUNT", "DATE", "SCORE"],
    dims: ["ACCOUNT", "PRODUCT", "TIME", "REGION", "CHANNEL"],
    fact: "FACTS",
    charts: ["REVENUE / MONTH", "VOLUME", "MIX", "CORRELATION"],
    scan: "QUALITY SCAN",
    nulls: "NULLS",
    dupes: "DUPES",
    ok: "CLEAN",
    kpiLabel: "MEASURED IMPACT",
    kpiSub: "of margin steered in real time",
    chips: ["-62% LEAD TIME", "ZERO LOSS", "12 SOURCES"],
  },
};

// Séries de démo du dashboard (acte 5)
const VIZ_LINE = [0.22, 0.34, 0.28, 0.46, 0.4, 0.58, 0.52, 0.68, 0.62, 0.8, 0.88, 1.0];
const VIZ_BARS = [0.36, 0.54, 0.45, 0.7, 0.58, 0.84, 0.72, 0.96];
const VIZ_PIE = [1.3, 0.95, 1.1, 0.8, 1.0, 0.72];
const VIZ_SPARK = [0.18, 0.3, 0.24, 0.38, 0.33, 0.47, 0.44, 0.58, 0.63, 0.57, 0.74, 0.82, 0.9, 1.0];

function DataFlowAnimation({ active, lang = "fr" }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const langRef = useRef(lang);
  langRef.current = lang;
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ---- helpers ----------------------------------------------------------
    const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
    const lerp = (a, b, t) => a + (b - a) * t;
    const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);
    const TAU = Math.PI * 2;

    const rgbCache = new Map();
    const hexRgb = (h) => {
      let v = rgbCache.get(h);
      if (!v) {
        v = [
          parseInt(h.slice(1, 3), 16),
          parseInt(h.slice(3, 5), 16),
          parseInt(h.slice(5, 7), 16),
        ];
        rgbCache.set(h, v);
      }
      return v;
    };
    const rgba = (c, a) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;

    const rrect = (x, y, w, h, r) => {
      const rr = Math.min(r, w / 2, h / 2);
      ctx.beginPath();
      ctx.moveTo(x + rr, y);
      ctx.arcTo(x + w, y, x + w, y + h, rr);
      ctx.arcTo(x + w, y + h, x, y + h, rr);
      ctx.arcTo(x, y + h, x, y, rr);
      ctx.arcTo(x, y, x + w, y, rr);
      ctx.closePath();
    };

    // Police mono : next/font renomme la famille, on la lit sur le body
    let MONO = "'Share Tech Mono', Menlo, monospace";
    try {
      const v = getComputedStyle(document.body)
        .getPropertyValue("--font-share-tech-mono")
        .trim();
      if (v) MONO = `${v}, Menlo, monospace`;
    } catch (e) { /* valeur par défaut */ }

    // Texte mono avec interlettrage manuel (letterSpacing canvas peu portable)
    const txt = (s, x, y, o = {}) => {
      const { size = 12, sp = 1.8, color = P_SUB, align = "left", alpha = 1 } = o;
      if (alpha <= 0.004) return;
      const chars = String(s).split("");
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.font = `${size}px ${MONO}`;
      let total = 0;
      const ws = chars.map((c) => {
        const w = ctx.measureText(c).width;
        total += w + sp;
        return w;
      });
      total -= sp;
      let cx = align === "center" ? x - total / 2 : align === "right" ? x - total : x;
      for (let i = 0; i < chars.length; i++) {
        ctx.fillText(chars[i], cx, y);
        cx += ws[i] + sp;
      }
      ctx.restore();
    };

    // ---- géométrie (recalculée à chaque resize, la hauteur est variable) ---
    let L = null;
    const buildLayout = (H) => {
      const W = SCENE_W;
      let seed = 20260920;
      const rng = () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
      };

      const ST = { x: 26, y: 118, w: W - 52 };
      ST.h = Math.max(320, H - ST.y - 104);
      ST.x2 = ST.x + ST.w;
      ST.y2 = ST.y + ST.h;
      ST.cx = ST.x + ST.w / 2;

      // -- acte 1 : sources en haut
      const srcY = ST.y + 34;
      const sources = [0.17, 0.5, 0.83].map((f, i) => ({
        x: ST.x + ST.w * f,
        y: srcY,
        w: 164,
        h: 44,
        color: [P_SAGE, P_BLUE, P_YELL][i],
      }));

      // -- acte 1/2 : nuage chaotique
      const cloudTop = ST.y + 118;
      const cloudH = ST.h - 150;
      const chaos = Array.from({ length: PIPE_N }, () => ({
        x: ST.x + 26 + rng() * (ST.w - 52),
        y: cloudTop + rng() * cloudH,
      }));

      // -- acte 3 : table 5 colonnes × 10 lignes
      const tb = { x: ST.x + 18, y: ST.y + 74, w: ST.w - 36 };
      tb.h = ST.h - 110;
      const COLS = 5;
      const ROWS = 10;
      const colW = tb.w / COLS;
      const headY = tb.y + 22;
      const bodyY = tb.y + 44;
      const rowH = (tb.h - 54) / ROWS;
      const cells = [];
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          cells.push({ x: tb.x + (c + 0.5) * colW, y: bodyY + (r + 0.5) * rowH });
        }
      }

      // -- acte 4 : schéma en étoile
      const star = { cx: ST.cx, cy: ST.y + ST.h * 0.5 };
      const starR = Math.min(ST.w * 0.42, ST.h * 0.33);
      const dims = Array.from({ length: 5 }, (_, i) => {
        const a = -Math.PI / 2 + (i * TAU) / 5;
        return { x: star.cx + Math.cos(a) * starR, y: star.cy + Math.sin(a) * starR, a };
      });

      // -- acte 5 : dashboard 3 bandes
      const gap = 16;
      const dashH = ST.h - 2 * gap;
      const h1 = dashH * 0.32;
      const h2 = dashH * 0.36;
      const h3 = dashH * 0.32;
      const cardA = { x: ST.x, y: ST.y, w: ST.w, h: h1 };
      const halfW = (ST.w - gap) / 2;
      const cardB = { x: ST.x, y: ST.y + h1 + gap, w: halfW, h: h2 };
      const cardC = { x: ST.x + halfW + gap, y: cardB.y, w: halfW, h: h2 };
      const cardD = { x: ST.x, y: cardB.y + h2 + gap, w: ST.w, h: h3 };
      const plotOf = (c, padT = 38, padB = 20, padX = 20) => ({
        x: c.x + padX,
        y: c.y + padT,
        w: c.w - padX * 2,
        h: c.h - padT - padB,
      });
      const pA = plotOf(cardA);
      const pB = plotOf(cardB);
      const pD = plotOf(cardD);

      const linePts = VIZ_LINE.map((v, i) => ({
        x: pA.x + (i / (VIZ_LINE.length - 1)) * pA.w,
        y: pA.y + pA.h * (1 - v) * 0.9 + pA.h * 0.05,
      }));
      const barSlot = pB.w / VIZ_BARS.length;
      const barW = Math.min(20, barSlot * 0.56);
      const barBase = pB.y + pB.h;
      const barPts = VIZ_BARS.map((v, i) => ({
        x: pB.x + (i + 0.5) * barSlot,
        y: barBase - pB.h * v * 0.92,
      }));

      const donut = {
        cx: cardC.x + cardC.w / 2,
        cy: cardC.y + 38 + (cardC.h - 58) / 2,
      };
      donut.r = Math.min(cardC.w * 0.34, (cardC.h - 58) * 0.46);
      donut.ri = donut.r * 0.56;
      const pieSum = VIZ_PIE.reduce((a, b) => a + b, 0);
      let ang = -Math.PI / 2;
      const sectors = VIZ_PIE.map((v) => {
        const a0 = ang;
        const a1 = ang + (v / pieSum) * TAU;
        ang = a1;
        return { a0, a1, mid: (a0 + a1) / 2 };
      });
      const piePts = sectors.map((s) => ({
        x: donut.cx + Math.cos(s.mid) * ((donut.r + donut.ri) / 2),
        y: donut.cy + Math.sin(s.mid) * ((donut.r + donut.ri) / 2),
      }));

      const scatterPts = Array.from({ length: 20 }, (_, i) => {
        const t = i / 19;
        return {
          x: pD.x + 10 + (t * 0.78 + rng() * 0.2) * (pD.w - 20),
          y: pD.y + pD.h - 8 - (t * 0.62 + rng() * 0.34) * (pD.h - 18),
        };
      });

      // -- acte 6 : carte KPI
      const kpiW = Math.min(ST.w, 430);
      const kpiH = Math.min(ST.h * 0.72, 380);
      const kpi = {
        x: ST.cx - kpiW / 2,
        y: ST.y + (ST.h - kpiH) / 2,
        w: kpiW,
        h: kpiH,
      };
      const spark = { x: kpi.x + 40, y: kpi.y + kpi.h * 0.56, w: kpi.w - 80, h: kpi.h * 0.2 };
      const sparkPts = VIZ_SPARK.map((v, i) => ({
        x: spark.x + (i / (VIZ_SPARK.length - 1)) * spark.w,
        y: spark.y + spark.h * (1 - v),
      }));

      return {
        W, H, ST, sources, chaos, tb, COLS, ROWS, colW, headY, bodyY, rowH, cells,
        star, starR, dims, cardA, cardB, cardC, cardD, pA, pB, pD,
        linePts, barPts, barW, barBase, donut, sectors, piePts, scatterPts,
        kpi, spark, sparkPts,
      };
    };

    // ---- particules -------------------------------------------------------
    const badSet = new Set();
    for (let i = 0; i < PIPE_BAD; i++) badSet.add(Math.floor((i * PIPE_N) / PIPE_BAD) + 2);
    const parts = [];
    let cleanCursor = 0;
    for (let i = 0; i < PIPE_N; i++) {
      const bad = badSet.has(i);
      parts.push({
        i,
        bad,
        ci: bad ? -1 : cleanCursor++,          // index parmi les lignes propres
        src: i % 3,
        x: 0, y: 0, vx: 0, vy: 0,
        r: 4, tr: 4,
        a: 0, ta: 0,
        c: hexRgb(DOT_PALETTE[i % DOT_PALETTE.length]),
        tc: hexRgb(DOT_PALETTE[i % DOT_PALETTE.length]),
        base: DOT_PALETTE[i % DOT_PALETTE.length],
        kj: 0.82 + ((i * 37) % 100) / 260,     // jitter de raideur → stagger naturel
        dep: 0.1 + (i % 22) * 0.052,           // départ échelonné à l'ingestion
        okT: -9, rejT: -9,
      });
    }

    // Accès direct par index de ligne propre (évite filter+sort à chaque frame)
    const byCi = [];
    for (const p of parts) if (!p.bad) byCi[p.ci] = p;

    // ---- état du run ------------------------------------------------------
    let dpr = 1;
    let cw = 0;
    let ch = 0;
    let scale = 1;
    let offX = 0;
    let offY = 0;
    let raf = 0;
    let last = 0;
    let elapsed = reduced ? 12.2 : 0;   // mouvement réduit → on fige sur le dashboard
    let prevT = -1;
    let settle = 0;
    const pointer = { x: -999, y: -999, on: false };

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cw = rect.width;
      ch = rect.height;
      canvas.width = Math.round(cw * dpr);
      canvas.height = Math.round(ch * dpr);
      scale = cw / SCENE_W;
      offX = 0;
      offY = 0;
      const first = !L;
      L = buildLayout(ch / scale);
      if (first) resetParticles();
    };

    function resetParticles() {
      if (!L) return;
      for (const p of parts) {
        const s = L.sources[p.src];
        p.x = s.x + (Math.random() - 0.5) * 40;
        p.y = s.y;
        p.vx = 0;
        p.vy = 0;
        p.a = 0;
        p.okT = -9;
        p.rejT = -9;
      }
    }

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();

    const onMove = (e) => {
      const rect = wrap.getBoundingClientRect();
      pointer.x = (e.clientX - rect.left - offX) / scale;
      pointer.y = (e.clientY - rect.top - offY) / scale;
      pointer.on = true;
    };
    const onLeave = () => {
      pointer.on = false;
      pointer.x = -999;
      pointer.y = -999;
    };
    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);

    // ---- cibles par acte --------------------------------------------------
    const target = { x: 0, y: 0, r: 4, a: 1, c: P_SAGE, k: 70 };

    const setTarget = (p, actKey, lp, T) => {
      const S = L;
      target.c = p.base;
      target.a = 1;
      target.k = 70;

      if (actKey === "ingest") {
        const s = S.sources[p.src];
        if (T < p.dep) {
          target.x = s.x;
          target.y = s.y;
          target.r = 2.6;
          target.a = 0;
          target.k = 240;
        } else {
          target.x = S.chaos[p.i].x;
          target.y = S.chaos[p.i].y;
          target.r = 4.4;
          target.k = 46;
        }
        return;
      }

      if (actKey === "cleanse") {
        const beamY = lerp(S.ST.y + 10, S.ST.y2 - 4, easeInOut(clamp01(lp / 0.82)));
        const crossed = p.y < beamY;
        if (crossed && p.bad) {
          if (p.rejT < 0) p.rejT = T;
          target.x = p.x < S.ST.cx ? S.ST.x - 90 : S.ST.x2 + 90;
          target.y = p.y + 60;
          target.r = 2;
          target.a = 0;
          target.c = P_MUTE;
          target.k = 34;
        } else {
          if (crossed && p.okT < 0) p.okT = T;
          target.x = S.chaos[p.i].x;
          target.y = S.chaos[p.i].y;
          target.r = crossed ? 4.6 : 4.2;
          target.c = crossed ? P_SAGE : p.base;
          target.k = 58;
        }
        return;
      }

      if (p.bad) {
        target.x = p.x;
        target.y = p.y;
        target.r = 1.5;
        target.a = 0;
        target.k = 20;
        return;
      }

      if (actKey === "structure") {
        const cell = S.cells[p.ci];
        target.x = cell.x;
        target.y = cell.y;
        target.r = 3.6;
        target.c = p.ci % 5 === 2 ? P_YELL : p.base;
        target.k = 128;
        return;
      }

      if (actKey === "model") {
        const edge = p.ci % 5;
        const slot = Math.floor(p.ci / 5);
        const d = S.dims[edge];
        const u = ((slot / 10 + T * 0.3) % 1);
        const f = 0.16 + u * 0.8;
        const nx = -(d.y - S.star.cy);
        const ny = d.x - S.star.cx;
        const nl = Math.hypot(nx, ny) || 1;
        const wob = Math.sin(u * Math.PI) * 9 * (edge % 2 ? 1 : -1);
        target.x = lerp(S.star.cx, d.x, f) + (nx / nl) * wob;
        target.y = lerp(S.star.cy, d.y, f) + (ny / nl) * wob;
        target.r = 3.2;
        target.c = [P_SAGE, P_MINT, P_BLUE, P_PALE, P_YELL][edge];
        target.k = 190;
        return;
      }

      if (actKey === "visualize") {
        const c = p.ci;
        if (c < 12) {                                  // 0-11 : courbe
          const pt = S.linePts[c];
          target.x = pt.x; target.y = pt.y; target.r = 3.6; target.c = P_DEEP; target.k = 96;
        } else if (c < 20) {                           // 12-19 : sommets des barres
          const pt = S.barPts[c - 12];
          target.x = pt.x; target.y = pt.y; target.r = 2.6; target.a = 0; target.k = 84;
        } else if (c < 26) {                           // 20-25 : secteurs du donut
          const pt = S.piePts[c - 20];
          target.x = pt.x; target.y = pt.y; target.r = 2.4; target.a = 0; target.k = 84;
        } else if (c < 46) {                           // 26-45 : nuage de points
          const pt = S.scatterPts[c - 26];
          target.x = pt.x; target.y = pt.y; target.r = 3.8;
          target.c = c % 3 === 0 ? P_YELL : P_MINT; target.k = 90;
        } else {                                       // reliquat : hors champ
          target.x = S.donut.cx; target.y = S.donut.cy; target.r = 1.5; target.a = 0; target.k = 40;
        }
        return;
      }

      // impact
      const c = p.ci;
      if (c < VIZ_SPARK.length) {
        const pt = S.sparkPts[c];
        target.x = pt.x; target.y = pt.y; target.r = 3; target.c = P_SAGE; target.k = 110;
      } else {
        target.x = S.kpi.x + S.kpi.w / 2;
        target.y = S.kpi.y + S.kpi.h / 2;
        target.r = 1.4;
        target.a = 0;
        target.k = 46;
      }
    };

    // ---- chrome des actes -------------------------------------------------
    const softShadow = (x, y, w, h, r, alpha) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = "rgba(216,212,202,0.55)";
      rrect(x + 3, y + 4, w, h, r);
      ctx.fill();
      ctx.restore();
    };

    const card = (x, y, w, h, r, alpha, label, t) => {
      softShadow(x, y, w, h, r, alpha * 0.7);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = "#FAF9F5";
      rrect(x, y, w, h, r);
      ctx.fill();
      ctx.strokeStyle = "rgba(216,212,202,0.85)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
      if (label) txt(label, x + 18, y + 25, { size: 11, sp: 1.9, color: P_SUB, alpha });
      if (t !== undefined) txt(t, x + w - 18, y + 25, { size: 11, sp: 1.6, color: P_SAGE, align: "right", alpha });
    };

    const drawIngest = (pres, T) => {
      if (pres <= 0.01) return;
      const S = L;
      const tx = PIPE_TXT[langRef.current] || PIPE_TXT.fr;
      S.sources.forEach((s, i) => {
        const x = s.x - s.w / 2;
        const y = s.y - s.h / 2;
        card(x, y, s.w, s.h, 12, pres);
        ctx.save();
        ctx.globalAlpha = pres;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(x + 18, s.y, 4.5, 0, TAU);
        ctx.fill();
        ctx.restore();
        txt(tx.sources[i], x + 30, s.y + 4, { size: 11, sp: 1.4, color: P_INK, alpha: pres });

        // conduite pointillée vers le nuage
        ctx.save();
        ctx.globalAlpha = pres * 0.5;
        ctx.strokeStyle = P_RULE;
        ctx.lineWidth = 1.2;
        ctx.setLineDash([3, 5]);
        ctx.lineDashOffset = -T * 42;
        ctx.beginPath();
        ctx.moveTo(s.x, y + s.h);
        ctx.lineTo(s.x, y + s.h + 46);
        ctx.stroke();
        ctx.restore();
      });
    };

    const drawCleanse = (pres, lp, T) => {
      if (pres <= 0.01) return;
      const S = L;
      const tx = PIPE_TXT[langRef.current] || PIPE_TXT.fr;
      const prog = easeInOut(clamp01(lp / 0.82));
      const beamY = lerp(S.ST.y + 10, S.ST.y2 - 4, prog);

      // bande scannée
      ctx.save();
      ctx.globalAlpha = pres;
      const g = ctx.createLinearGradient(0, beamY - 64, 0, beamY + 8);
      g.addColorStop(0, "rgba(122,165,149,0)");
      g.addColorStop(1, "rgba(122,165,149,0.16)");
      ctx.fillStyle = g;
      ctx.fillRect(S.ST.x, beamY - 64, S.ST.w, 72);
      ctx.strokeStyle = rgba(hexRgb(P_SAGE), 0.75);
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(S.ST.x, beamY);
      ctx.lineTo(S.ST.x2, beamY);
      ctx.stroke();
      ctx.restore();
      txt(tx.scan, S.ST.x, beamY - 10, { size: 10, sp: 2, color: P_SAGE, alpha: pres * 0.9 });

      // compteurs de rejets
      const done = clamp01(lp / 0.82);
      const nulls = Math.round(7 * done);
      const dupes = Math.round(5 * done);
      const ok = Math.round(PIPE_CLEAN * done);
      const bx = S.ST.x2 - 150;
      const by = S.ST.y + 2;
      card(bx, by, 150, 74, 12, pres * 0.95);
      txt(`${tx.nulls} ${String(nulls).padStart(2, "0")}`, bx + 14, by + 26, { size: 10, sp: 1.6, color: P_SUB, alpha: pres });
      txt(`${tx.dupes} ${String(dupes).padStart(2, "0")}`, bx + 14, by + 45, { size: 10, sp: 1.6, color: P_SUB, alpha: pres });
      txt(`${tx.ok} ${String(ok).padStart(2, "0")}`, bx + 14, by + 64, { size: 10, sp: 1.6, color: P_SAGE, alpha: pres });

      // croix des lignes rejetées
      ctx.save();
      ctx.lineWidth = 1.6;
      for (const p of parts) {
        if (!p.bad || p.rejT < 0) continue;
        const age = T - p.rejT;
        if (age < 0 || age > 0.7) continue;
        const a = (1 - age / 0.7) * pres;
        const s = 5 + age * 6;
        ctx.globalAlpha = a;
        ctx.strokeStyle = "#c98f7a";
        ctx.beginPath();
        ctx.moveTo(p.x - s, p.y - s); ctx.lineTo(p.x + s, p.y + s);
        ctx.moveTo(p.x + s, p.y - s); ctx.lineTo(p.x - s, p.y + s);
        ctx.stroke();
      }
      ctx.restore();

      // anneaux de validation
      ctx.save();
      ctx.lineWidth = 1.2;
      for (const p of parts) {
        if (p.bad || p.okT < 0) continue;
        const age = T - p.okT;
        if (age < 0 || age > 0.6) continue;
        const a = (1 - age / 0.6) * pres * 0.8;
        ctx.globalAlpha = a;
        ctx.strokeStyle = P_SAGE;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5 + age * 22, 0, TAU);
        ctx.stroke();
      }
      ctx.restore();
    };

    const drawStructure = (pres, lp) => {
      if (pres <= 0.01) return;
      const S = L;
      const tx = PIPE_TXT[langRef.current] || PIPE_TXT.fr;
      const rev = easeOut(clamp01(lp / 0.45));
      card(S.tb.x - 8, S.tb.y - 8, S.tb.w + 16, S.tb.h + 16, 16, pres);

      ctx.save();
      ctx.globalAlpha = pres * 0.75;
      ctx.strokeStyle = P_RULE;
      ctx.lineWidth = 0.8;
      ctx.setLineDash([2, 4]);
      for (let c = 1; c < S.COLS; c++) {
        const x = S.tb.x + c * S.colW;
        ctx.beginPath();
        ctx.moveTo(x, S.bodyY - 8);
        ctx.lineTo(x, S.bodyY - 8 + (S.tb.h - 46) * rev);
        ctx.stroke();
      }
      ctx.setLineDash([]);
      for (let r = 1; r < S.ROWS; r++) {
        const y = S.bodyY + r * S.rowH;
        ctx.beginPath();
        ctx.moveTo(S.tb.x, y);
        ctx.lineTo(S.tb.x + S.tb.w * rev, y);
        ctx.stroke();
      }
      ctx.restore();

      // en-têtes
      ctx.save();
      ctx.globalAlpha = pres;
      ctx.strokeStyle = rgba(hexRgb(P_SAGE), 0.6);
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(S.tb.x, S.bodyY - 8);
      ctx.lineTo(S.tb.x + S.tb.w * rev, S.bodyY - 8);
      ctx.stroke();
      ctx.restore();
      tx.cols.forEach((c, i) => {
        const a = pres * clamp01((rev - i * 0.14) / 0.2);
        txt(c, S.tb.x + (i + 0.5) * S.colW, S.headY, { size: 10, sp: 1.6, color: P_SUB, align: "center", alpha: a });
      });

      // bande de lecture qui balaie les lignes
      const band = (lp * 1.5) % 1;
      const by = S.bodyY + band * (S.tb.h - 54);
      ctx.save();
      ctx.globalAlpha = pres * 0.5;
      ctx.fillStyle = rgba(hexRgb(P_SAGE), 0.12);
      ctx.fillRect(S.tb.x, by, S.tb.w, S.rowH);
      ctx.restore();
    };

    const drawModel = (pres, lp, T) => {
      if (pres <= 0.01) return;
      const S = L;
      const tx = PIPE_TXT[langRef.current] || PIPE_TXT.fr;
      const rev = easeOut(clamp01(lp / 0.4));

      // arêtes
      ctx.save();
      ctx.globalAlpha = pres * 0.8;
      ctx.strokeStyle = P_RULE;
      ctx.lineWidth = 1.3;
      S.dims.forEach((d) => {
        ctx.beginPath();
        ctx.moveTo(S.star.cx, S.star.cy);
        ctx.lineTo(lerp(S.star.cx, d.x, rev), lerp(S.star.cy, d.y, rev));
        ctx.stroke();
      });
      ctx.restore();

      // onde depuis la table de faits
      const pulse = (T * 0.7) % 1;
      ctx.save();
      ctx.globalAlpha = pres * (1 - pulse) * 0.5;
      ctx.strokeStyle = P_SAGE;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(S.star.cx, S.star.cy, 30 + pulse * S.starR, 0, TAU);
      ctx.stroke();
      ctx.restore();

      // dimensions
      S.dims.forEach((d, i) => {
        const a = pres * clamp01((rev - i * 0.1) / 0.3);
        const w = 104;
        const h = 32;
        card(d.x - w / 2, d.y - h / 2, w, h, 10, a);
        txt(tx.dims[i], d.x, d.y + 4, { size: 10, sp: 1.4, color: P_INK, align: "center", alpha: a });
      });

      // table de faits
      const fw = 116;
      const fh = 56;
      softShadow(S.star.cx - fw / 2, S.star.cy - fh / 2, fw, fh, 14, pres * 0.8);
      ctx.save();
      ctx.globalAlpha = pres;
      ctx.fillStyle = P_SAGE;
      rrect(S.star.cx - fw / 2, S.star.cy - fh / 2, fw, fh, 14);
      ctx.fill();
      ctx.restore();
      txt(tx.fact, S.star.cx, S.star.cy - 2, { size: 12, sp: 2, color: "#FAF9F5", align: "center", alpha: pres });
      txt(`${PIPE_CLEAN} × 5`, S.star.cx, S.star.cy + 16, { size: 10, sp: 1.6, color: "rgba(250,249,245,0.75)", align: "center", alpha: pres });
    };

    const drawVizBack = (pres, lp) => {
      if (pres <= 0.01) return;
      const S = L;
      const tx = PIPE_TXT[langRef.current] || PIPE_TXT.fr;
      const rev = easeOut(clamp01(lp / 0.5));

      card(S.cardA.x, S.cardA.y, S.cardA.w, S.cardA.h, 16, pres, tx.charts[0], "+38%");
      card(S.cardB.x, S.cardB.y, S.cardB.w, S.cardB.h, 16, pres, tx.charts[1]);
      card(S.cardC.x, S.cardC.y, S.cardC.w, S.cardC.h, 16, pres, tx.charts[2]);
      card(S.cardD.x, S.cardD.y, S.cardD.w, S.cardD.h, 16, pres, tx.charts[3]);

      // lignes de repère
      ctx.save();
      ctx.globalAlpha = pres * 0.55;
      ctx.strokeStyle = P_RULE;
      ctx.lineWidth = 0.8;
      ctx.setLineDash([2, 4]);
      [0.25, 0.5, 0.75].forEach((f) => {
        [S.pA, S.pB, S.pD].forEach((pl) => {
          const y = pl.y + pl.h * f;
          ctx.beginPath();
          ctx.moveTo(pl.x, y);
          ctx.lineTo(pl.x + pl.w, y);
          ctx.stroke();
        });
      });
      ctx.restore();

      // aire sous la courbe (suit les particules en direct)
      const lp0 = byCi.slice(0, 12);
      if (rev > 0.05) {
        ctx.save();
        ctx.globalAlpha = pres * rev;
        const g = ctx.createLinearGradient(0, S.pA.y, 0, S.pA.y + S.pA.h);
        g.addColorStop(0, "rgba(122,165,149,0.3)");
        g.addColorStop(1, "rgba(122,165,149,0.02)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(lp0[0].x, S.pA.y + S.pA.h);
        lp0.forEach((p) => ctx.lineTo(p.x, p.y));
        ctx.lineTo(lp0[11].x, S.pA.y + S.pA.h);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // barres (hauteur pilotée par les particules cachées)
      const bp = byCi.slice(12, 20);
      ctx.save();
      bp.forEach((p, i) => {
        const st = clamp01((rev - i * 0.07) / 0.5);
        if (st <= 0) return;
        ctx.globalAlpha = pres * st;
        ctx.fillStyle = i % 2 ? P_PALE : P_SAGE;
        const top = lerp(S.barBase, p.y, st);
        rrect(p.x - S.barW / 2, top, S.barW, Math.max(1, S.barBase - top), 4);
        ctx.fill();
      });
      ctx.restore();

      // donut
      ctx.save();
      const dcol = [P_SAGE, P_YELL, P_MINT, P_PALE, P_DEEP, P_BLUE];
      S.sectors.forEach((s, i) => {
        const st = clamp01((rev - i * 0.08) / 0.5);
        if (st <= 0) return;
        ctx.globalAlpha = pres * st;
        ctx.fillStyle = dcol[i];
        ctx.beginPath();
        ctx.arc(S.donut.cx, S.donut.cy, S.donut.r, s.a0, lerp(s.a0, s.a1, st));
        ctx.arc(S.donut.cx, S.donut.cy, S.donut.ri, lerp(s.a0, s.a1, st), s.a0, true);
        ctx.closePath();
        ctx.fill();
      });
      ctx.restore();
      txt("6", S.donut.cx, S.donut.cy + 2, { size: 16, sp: 0, color: P_INK, align: "center", alpha: pres * rev });
      txt("SEG", S.donut.cx, S.donut.cy + 18, { size: 9, sp: 1.6, color: P_SUB, align: "center", alpha: pres * rev });

      // tendance du nuage de points
      ctx.save();
      ctx.globalAlpha = pres * rev * 0.8;
      ctx.strokeStyle = P_YELL;
      ctx.lineWidth = 1.6;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.moveTo(S.pD.x + 8, S.pD.y + S.pD.h - 6);
      ctx.lineTo(S.pD.x + S.pD.w - 8, S.pD.y + 12);
      ctx.stroke();
      ctx.restore();
    };

    const drawVizFront = (pres, lp) => {
      if (pres <= 0.01) return;
      const rev = easeOut(clamp01(lp / 0.5));
      const lp0 = byCi.slice(0, 12);
      ctx.save();
      ctx.globalAlpha = pres * rev;
      ctx.strokeStyle = P_DEEP;
      ctx.lineWidth = 2.2;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.beginPath();
      lp0.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
      ctx.stroke();
      ctx.restore();
    };

    const drawImpact = (pres, lp) => {
      if (pres <= 0.01) return;
      const S = L;
      const tx = PIPE_TXT[langRef.current] || PIPE_TXT.fr;
      const rev = easeOut(clamp01(lp / 0.45));
      card(S.kpi.x, S.kpi.y, S.kpi.w, S.kpi.h, 20, pres);

      txt(tx.kpiLabel, S.kpi.x + S.kpi.w / 2, S.kpi.y + 46, { size: 11, sp: 2.2, color: P_SUB, align: "center", alpha: pres });

      const val = 38 * easeOut(clamp01(lp / 0.55));
      ctx.save();
      ctx.globalAlpha = pres;
      ctx.fillStyle = P_INK;
      ctx.font = `${Math.round(S.kpi.h * 0.24)}px ${MONO}`;
      ctx.textAlign = "center";
      ctx.fillText(`+${val.toFixed(0)}%`, S.kpi.x + S.kpi.w / 2, S.kpi.y + S.kpi.h * 0.36);
      ctx.restore();
      txt(tx.kpiSub, S.kpi.x + S.kpi.w / 2, S.kpi.y + S.kpi.h * 0.42, { size: 10, sp: 1.5, color: P_SUB, align: "center", alpha: pres });

      // sparkline sur les particules
      const sp = byCi.slice(0, VIZ_SPARK.length);
      {
        ctx.save();
        ctx.globalAlpha = pres * rev;
        const g = ctx.createLinearGradient(0, S.spark.y, 0, S.spark.y + S.spark.h);
        g.addColorStop(0, "rgba(122,165,149,0.28)");
        g.addColorStop(1, "rgba(122,165,149,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(sp[0].x, S.spark.y + S.spark.h);
        sp.forEach((p) => ctx.lineTo(p.x, p.y));
        ctx.lineTo(sp[sp.length - 1].x, S.spark.y + S.spark.h);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = P_SAGE;
        ctx.lineWidth = 2;
        ctx.lineJoin = "round";
        ctx.beginPath();
        sp.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
        ctx.stroke();
        ctx.restore();
      }

      // puces de résultat
      const cy = S.kpi.y + S.kpi.h - 34;
      const cw2 = (S.kpi.w - 60) / 3;
      tx.chips.forEach((c, i) => {
        const a = pres * clamp01((rev - 0.3 - i * 0.12) / 0.3);
        const x = S.kpi.x + 30 + i * cw2;
        ctx.save();
        ctx.globalAlpha = a;
        ctx.fillStyle = "rgba(122,165,149,0.12)";
        rrect(x, cy - 13, cw2 - 8, 26, 13);
        ctx.fill();
        ctx.restore();
        txt(c, x + (cw2 - 8) / 2, cy + 4, { size: 9, sp: 1.2, color: P_DEEP, align: "center", alpha: a });
      });
    };

    // ---- HUD --------------------------------------------------------------
    const drawHud = (T, idx, lp) => {
      const S = L;
      const tx = PIPE_TXT[langRef.current] || PIPE_TXT.fr;

      txt(tx.kicker, S.ST.x, 30, { size: 10, sp: 2.6, color: P_SUB });
      txt(`${String(idx + 1).padStart(2, "0")} / 06`, S.ST.x2, 30, { size: 10, sp: 2.2, color: P_SAGE, align: "right" });

      // titre de l'acte, révélé caractère par caractère
      const title = tx.titles[idx];
      const shown = Math.max(1, Math.round(title.length * clamp01(lp / 0.22)));
      txt(title.slice(0, shown), S.ST.x, 62, { size: 20, sp: 2.4, color: P_INK });
      txt(tx.subs[idx], S.ST.x, 84, { size: 10, sp: 1.4, color: P_SUB, alpha: clamp01((lp - 0.12) / 0.2) });

      // compteur de lignes
      let rows = 1248;
      if (idx === 0) rows = Math.round(1248 * easeOut(clamp01(lp)));
      else if (idx === 1) rows = 1248 - Math.round(12 * clamp01(lp / 0.82));
      else rows = 1236;
      txt(`${tx.rows} ${rows.toLocaleString("fr-FR").replace(/ |,/g, " ")}`, S.ST.x2, 62, {
        size: 12, sp: 1.6, color: P_INK, align: "right",
      });

      // rail des 6 étapes
      const railY = S.H - 52;
      const segW = (S.ST.w - 5 * 6) / 6;
      for (let i = 0; i < 6; i++) {
        const x = S.ST.x + i * (segW + 6);
        const done = i < idx;
        const cur = i === idx;
        ctx.save();
        ctx.globalAlpha = 1;
        ctx.fillStyle = done ? rgba(hexRgb(P_SAGE), 0.4) : "rgba(216,212,202,0.55)";
        rrect(x, railY, segW, 3, 1.5);
        ctx.fill();
        if (cur) {
          ctx.fillStyle = P_SAGE;
          rrect(x, railY, segW * clamp01(lp), 3, 1.5);
          ctx.fill();
        }
        ctx.restore();
        txt(tx.rail[i], x + segW / 2, railY + 20, {
          size: 8.5, sp: 1.2,
          color: cur ? P_INK : P_SUB,
          align: "center",
          alpha: cur ? 1 : 0.5,
        });
      }
    };

    const drawBackdrop = (T) => {
      const S = L;
      // halos lents
      ctx.save();
      const blobs = [
        { x: S.W * 0.25 + Math.sin(T * 0.11) * 60, y: S.H * 0.3 + Math.cos(T * 0.09) * 70, c: "122,165,149" },
        { x: S.W * 0.75 + Math.cos(T * 0.13) * 60, y: S.H * 0.68 + Math.sin(T * 0.1) * 80, c: "254,207,86" },
      ];
      blobs.forEach((b) => {
        const r = Math.min(S.W, S.H) * 0.5;
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, r);
        g.addColorStop(0, `rgba(${b.c},0.07)`);
        g.addColorStop(1, `rgba(${b.c},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, S.W, S.H);
      });
      ctx.restore();

      // trame de points
      ctx.save();
      ctx.fillStyle = "rgba(216,212,202,0.5)";
      const step = 26;
      for (let x = S.ST.x; x <= S.ST.x2; x += step) {
        for (let y = S.ST.y; y <= S.ST.y2; y += step) {
          ctx.fillRect(x, y, 1.2, 1.2);
        }
      }
      ctx.restore();
    };

    // ---- boucle -----------------------------------------------------------
    const frame = (ts) => {
      // Hors du slide hero : on gèle le temps et on garde la dernière image
      if (!L || !activeRef.current) {
        last = 0;
        raf = requestAnimationFrame(frame);
        return;
      }
      if (!last) last = ts;
      const raw = (ts - last) / 1000;
      last = ts;
      // Temps narratif : suit l'horloge réelle (le scénario ne dérive pas si
      // des frames sautent). Pas de physique : borné pour rester stable.
      if (!reduced) elapsed += Math.min(raw, 0.5);
      const dt = Math.min(raw, 1 / 20);

      const T = reduced ? elapsed : elapsed % ACT_TOTAL;
      if (T < prevT) {
        for (const p of parts) { p.okT = -9; p.rejT = -9; }
      }
      prevT = T;

      let idx = 0;
      for (let i = 0; i < ACTS.length; i++) if (T >= ACTS[i].t0) idx = i;
      const act = ACTS[idx];
      const lp = clamp01((T - act.t0) / (act.t1 - act.t0));
      const presOf = (a, fi = 0.45, fo = 0.45) =>
        clamp01((T - a.t0) / fi) * clamp01((a.t1 - T) / fo);

      // Physique : pas fixe de 1/60 s, sous-échantillonné. À 60 fps c'est un
      // seul pas ; si des frames sautent on en enchaîne plusieurs (plafonné,
      // pour ne pas partir en vrille après un onglet en arrière-plan).
      const FIXED = 1 / 60;
      let steps = Math.min(8, Math.max(1, Math.round(dt / FIXED)));
      while (steps--) {
        for (const p of parts) {
          setTarget(p, act.key, lp, T);
          const k = target.k * p.kj;
          const d = 2 * Math.sqrt(k) * 0.92;
          let ax = (target.x - p.x) * k - p.vx * d;
          let ay = (target.y - p.y) * k - p.vy * d;

          if (pointer.on && target.a > 0.1) {
            const dx = p.x - pointer.x;
            const dy = p.y - pointer.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < 15000 && d2 > 0.01) {
              const f = (1 - d2 / 15000) * 2600;
              const inv = 1 / Math.sqrt(d2);
              ax += dx * inv * f;
              ay += dy * inv * f;
            }
          }

          p.vx += ax * FIXED;
          p.vy += ay * FIXED;
          p.x += p.vx * FIXED;
          p.y += p.vy * FIXED;

          p.r += (target.r - p.r) * (FIXED * 9);
          p.a += (target.a - p.a) * (FIXED * 7);
          const tc = hexRgb(target.c);
          const cr = FIXED * 6;
          p.c[0] += (tc[0] - p.c[0]) * cr;
          p.c[1] += (tc[1] - p.c[1]) * cr;
          p.c[2] += (tc[2] - p.c[2]) * cr;
        }
      }

      // rendu
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * offX, dpr * offY);

      drawBackdrop(T);
      drawStructure(presOf(ACTS[2]), lp);
      drawModel(presOf(ACTS[3]), lp, T);
      drawVizBack(presOf(ACTS[4]), lp);
      drawImpact(presOf(ACTS[5], 0.45, 0.35), lp);
      drawIngest(presOf(ACTS[0], 0.35, 0.6), T);

      // particules : halo + traînée + noyau
      for (const p of parts) {
        if (p.a <= 0.01) continue;
        const col = p.c;
        const sp = Math.hypot(p.vx, p.vy);
        if (sp > 40) {
          ctx.save();
          ctx.globalAlpha = Math.min(0.45, sp / 900) * p.a;
          ctx.strokeStyle = rgba(col, 1);
          ctx.lineWidth = p.r * 1.3;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(p.x - p.vx * 0.032, p.y - p.vy * 0.032);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
          ctx.restore();
        }
        ctx.save();
        ctx.globalAlpha = p.a * 0.14;
        ctx.fillStyle = rgba(col, 1);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 2.9, 0, TAU);
        ctx.fill();
        ctx.globalAlpha = p.a;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, TAU);
        ctx.fill();
        ctx.restore();
      }

      drawVizFront(presOf(ACTS[4]), lp);
      drawCleanse(presOf(ACTS[1], 0.3, 0.45), lp, T);
      drawHud(T, idx, lp);

      if (reduced) {
        settle += dt;
        if (settle > 3) return;
      }
      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={wrapRef} className="data-flow-wrap">
      <canvas ref={canvasRef} className="data-flow-canvas" />
    </div>
  );
}


// ================= CHART GRID (isolated animation) =================
const CHART_COLORS = ["#6f9caf", "#70aaaf", "#6fafac", "#70af84", "#ffcf56", "#a8c5b8"];
const CYCLE = 10;

// Catmull-Rom cubic spline — C¹ continuous, organic motion
const spline = (p0, p1, p2, p3, t) => {
  const t2 = t * t;
  const t3 = t2 * t;
  return 0.5 * (
    2 * p1 +
    (-p0 + p2) * t +
    (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
    (-p0 + 3 * p1 - 3 * p2 + p3) * t3
  );
};
const splineArr = (k0, k1, k2, k3, t) => k0.map((_, i) => spline(k0[i], k1[i], k2[i], k3[i], t));
// Explicit loop closure: duplicates the first keyframe at the end of the array.
const loop = (arr) => [...arr, arr[0]];

const LINE_KF = loop([
  { a:[10,14,18,22,26,30,34,38,41,44,46,48], b:[22,24,25,26,26,25,24,23,22,21,20,19], c:[ 5, 7,10,14,18,23,28,33,37,40,43,45] },
  { a:[12,16,20,24,27,29,30,30,29,28,26,24], b:[20,21,21,20,19,18,17,16,16,16,17,18], c:[ 8,12,17,22,28,33,37,40,42,43,43,42] },
  { a:[14,16,17,17,16,15,14,13,13,14,16,18], b:[18,20,23,27,31,34,36,37,37,36,34,32], c:[20,25,30,35,39,42,44,45,44,43,41,39] },
  { a:[16,18,20,21,22,22,21,20,19,18,18,19], b:[15,20,27,34,39,43,46,47,47,46,44,42], c:[22,24,25,25,24,23,22,22,22,23,25,27] },
  { a:[24,26,28,29,29,28,27,25,23,21,19,18], b:[28,27,26,25,24,24,24,25,26,27,28,29], c:[20,22,24,26,28,29,29,28,27,26,25,24] },
  { a:[ 8,12,17,22,27,32,36,40,43,45,47,48], b:[26,25,24,23,22,21,20,20,20,21,22,23], c:[18,20,22,23,23,22,21,20,20,21,22,24] },
]);
const PIE_KF = loop([
  [34, 28, 22, 16],
  [30, 32, 24, 14],
  [28, 26, 30, 16],
  [32, 24, 26, 18],
  [36, 22, 24, 18],
  [30, 30, 22, 18],
]);
const BAR_KF = loop([
  [72, 45, 88, 33, 61, 79, 52, 40],
  [68, 50, 82, 38, 65, 74, 58, 44],
  [75, 42, 91, 30, 58, 83, 49, 37],
  [70, 48, 85, 35, 63, 77, 55, 42],
  [65, 55, 78, 42, 70, 71, 62, 48],
  [73, 44, 89, 32, 60, 81, 51, 39],
]);
const COMP_AREA_KF = loop([
  [420, 580, 750, 620, 890, 740, 960, 830, 710, 950, 1100, 880],
  [510, 640, 700, 780, 830, 950, 880, 760, 920, 1050, 990, 850],
  [390, 620, 810, 700, 870, 720, 1010, 880, 750, 900, 1080, 920],
  [460, 590, 730, 810, 860, 980, 910, 790, 960, 1020, 970, 840],
]);
const COMP_BAR_KF = loop([
  [180, 260, 340, 290, 410, 320, 450, 380, 300, 430, 510, 400],
  [210, 290, 310, 360, 380, 440, 400, 340, 420, 490, 460, 390],
  [160, 280, 370, 320, 400, 300, 470, 400, 330, 410, 500, 420],
  [200, 270, 330, 380, 400, 460, 420, 360, 440, 480, 450, 380],
]);
const COMP_LINE_KF = loop([
  [300, 400, 500, 450, 600, 520, 650, 580, 490, 660, 750, 620],
  [350, 440, 480, 530, 570, 640, 600, 520, 610, 700, 680, 580],
  [280, 430, 560, 490, 590, 490, 690, 600, 520, 620, 730, 640],
  [320, 410, 490, 560, 580, 660, 620, 540, 640, 680, 660, 560],
]);
const COMP_SCAT_KF = loop([
  [80, 140, 200, 170, 240, 190, 280, 230, 180, 260, 320, 250],
  [110, 160, 180, 210, 230, 280, 250, 200, 260, 310, 290, 240],
  [70, 150, 220, 190, 250, 170, 300, 240, 200, 250, 310, 260],
  [100, 155, 195, 230, 240, 290, 260, 215, 270, 300, 280, 230],
]);
const SC1_KF = loop([
  [{x:10,y:80},{x:18,y:68},{x:5,y:90},{x:22,y:75},{x:14,y:55},{x:8,y:85},{x:25,y:62},{x:3,y:72}],
  [{x:20,y:60},{x:8,y:88},{x:15,y:45},{x:30,y:70},{x:5,y:78},{x:18,y:92},{x:12,y:50},{x:25,y:80}],
  [{x:5,y:70},{x:25,y:50},{x:10,y:95},{x:18,y:40},{x:28,y:85},{x:2,y:60},{x:20,y:75},{x:15,y:30}],
  [{x:15,y:85},{x:3,y:55},{x:22,y:40},{x:8,y:92},{x:28,y:65},{x:12,y:78},{x:5,y:35},{x:20,y:90}],
]);
const SC2_KF = loop([
  [{x:45,y:45},{x:55,y:60},{x:40,y:30},{x:60,y:50},{x:48,y:70},{x:52,y:25},{x:42,y:55},{x:58,y:40}],
  [{x:55,y:35},{x:42,y:65},{x:58,y:20},{x:48,y:55},{x:38,y:45},{x:62,y:70},{x:50,y:30},{x:44,y:80}],
  [{x:40,y:55},{x:60,y:40},{x:45,y:75},{x:55,y:20},{x:50,y:65},{x:38,y:30},{x:58,y:80},{x:48,y:42}],
  [{x:52,y:25},{x:44,y:70},{x:62,y:55},{x:40,y:42},{x:56,y:80},{x:46,y:18},{x:38,y:60},{x:60,y:35}],
]);
const SC3_KF = loop([
  [{x:72,y:20},{x:85,y:40},{x:78,y:10},{x:92,y:55},{x:68,y:35},{x:88,y:15},{x:75,y:60},{x:95,y:28}],
  [{x:80,y:35},{x:70,y:15},{x:90,y:50},{x:75,y:25},{x:95,y:40},{x:68,y:60},{x:85,y:8},{x:78,y:45}],
  [{x:65,y:45},{x:90,y:20},{x:72,y:55},{x:88,y:35},{x:78,y:5},{x:95,y:50},{x:70,y:30},{x:82,y:65}],
  [{x:88,y:10},{x:75,y:50},{x:92,y:38},{x:68,y:22},{x:82,y:60},{x:72,y:42},{x:95,y:18},{x:78,y:70}],
]);
const RAD_KF = loop([
  { v1:[80,65,72,88,55], v2:[60,78,50,65,82] },
  { v1:[75,70,68,85,60], v2:[65,72,55,70,78] },
  { v1:[82,60,75,90,52], v2:[58,80,48,62,85] },
  { v1:[78,68,70,87,58], v2:[62,75,52,68,80] },
  { v1:[72,74,65,83,63], v2:[68,70,58,74,75] },
]);
const RADAR_SUBJECTS = ["A", "B", "C", "D", "E"];

function ChartGrid({ active }) {
  const rafRef = useRef(null);
  const tRef = useRef(0);
  const [, setFrame] = useState(0);
  const [selected, setSelected] = useState(null);

  const animationPaused = !!selected;

  useEffect(() => {
    if (!active || animationPaused) return;
    let last = null;
    const step = (ts) => {
      if (last !== null) {
        tRef.current += (ts - last) * 0.001;
        setFrame((f) => f + 1);
      }
      last = ts;
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [active, animationPaused]);

  const T = tRef.current;

  const toggleColor = (color) => setSelected((prev) => (prev === color ? null : color));
  const fillAlpha = (color, base = 1) => (!selected || selected === color ? base : base * 0.14);
  const strokeAlpha = (color) => (!selected || selected === color ? 1 : 0.14);
  const handlePick = (color) => ({
    onClick: () => toggleColor(color),
    style: { cursor: "pointer" },
  });

  const getFrame = (keyframes) => {
    const n = keyframes.length - 1;
    const pos = ((T % CYCLE) / CYCLE) * n;
    const i = Math.floor(pos);
    const t = pos - i;
    return {
      k0: keyframes[(i - 1 + n) % n],
      k1: keyframes[i % n],
      k2: keyframes[(i + 1) % n],
      k3: keyframes[(i + 2) % n],
      t,
    };
  };

  const lf = getFrame(LINE_KF);
  const lineData = splineArr(lf.k0.a, lf.k1.a, lf.k2.a, lf.k3.a, lf.t).map((a, i) => {
    const b = spline(lf.k0.b[i], lf.k1.b[i], lf.k2.b[i], lf.k3.b[i], lf.t);
    const c = spline(lf.k0.c[i], lf.k1.c[i], lf.k2.c[i], lf.k3.c[i], lf.t);
    return {
      a,
      b,
      c,
      d: 10 + 32 * (0.5 + 0.5 * Math.sin(T * 0.55 + i * 0.5)),
      e: 8 + 34 * (0.5 + 0.5 * Math.cos(T * 0.65 + i * 0.42 + 1)),
      f: 12 + 28 * (0.5 + 0.5 * Math.sin(T * 0.48 + i * 0.34 + 2.2)),
    };
  });

  const pf = getFrame(PIE_KF);
  const pieBase = splineArr(pf.k0, pf.k1, pf.k2, pf.k3, pf.t);
  const pieExpanded = [
    pieBase[0] * 0.58,
    pieBase[0] * 0.42,
    pieBase[1] * 0.55,
    pieBase[1] * 0.45,
    pieBase[2],
    pieBase[3],
  ];
  const pieSum = pieExpanded.reduce((a, b) => a + b, 0);
  const pieData = pieExpanded.map((v, i) => ({ name: String(i), value: (v / pieSum) * 100 }));

  const bf = getFrame(BAR_KF);
  const barData = splineArr(bf.k0, bf.k1, bf.k2, bf.k3, bf.t).map((v) => ({ v }));

  const cf = getFrame(COMP_AREA_KF);
  const cf2 = getFrame(COMP_BAR_KF);
  const cf3 = getFrame(COMP_LINE_KF);
  const cf4 = getFrame(COMP_SCAT_KF);
  const composedData = splineArr(cf.k0, cf.k1, cf.k2, cf.k3, cf.t).map((area, i) => ({
    i,
    area,
    bar:  spline(cf2.k0[i], cf2.k1[i], cf2.k2[i], cf2.k3[i], cf2.t),
    bar2: 120 + 160 * (0.5 + 0.5 * Math.sin(T * 0.6 + i * 0.35)),
    line: spline(cf3.k0[i], cf3.k1[i], cf3.k2[i], cf3.k3[i], cf3.t),
    line2: 280 + 240 * (0.5 + 0.5 * Math.cos(T * 0.5 + i * 0.3 + 1)),
    dot:  spline(cf4.k0[i], cf4.k1[i], cf4.k2[i], cf4.k3[i], cf4.t),
  }));

  const sf1 = getFrame(SC1_KF);
  const sf2 = getFrame(SC2_KF);
  const sf3 = getFrame(SC3_KF);
  const scatterData1 = sf1.k1.map((_, i) => ({
    x: spline(sf1.k0[i].x, sf1.k1[i].x, sf1.k2[i].x, sf1.k3[i].x, sf1.t),
    y: spline(sf1.k0[i].y, sf1.k1[i].y, sf1.k2[i].y, sf1.k3[i].y, sf1.t),
  }));
  const scatterData2 = sf2.k1.map((_, i) => ({
    x: spline(sf2.k0[i].x, sf2.k1[i].x, sf2.k2[i].x, sf2.k3[i].x, sf2.t),
    y: spline(sf2.k0[i].y, sf2.k1[i].y, sf2.k2[i].y, sf2.k3[i].y, sf2.t),
  }));
  const scatterData3 = sf3.k1.map((_, i) => ({
    x: spline(sf3.k0[i].x, sf3.k1[i].x, sf3.k2[i].x, sf3.k3[i].x, sf3.t),
    y: spline(sf3.k0[i].y, sf3.k1[i].y, sf3.k2[i].y, sf3.k3[i].y, sf3.t),
  }));
  const scatterData4 = Array.from({ length: 8 }, (_, i) => ({
    x: 34 + 28 * Math.sin(T * 0.35 + i * 0.78),
    y: 48 + 26 * Math.cos(T * 0.42 + i * 0.6 + 1.1),
  }));
  const scatterData5 = Array.from({ length: 8 }, (_, i) => ({
    x: 50 + 24 * Math.cos(T * 0.4 + i * 0.52 + 0.8),
    y: 38 + 22 * Math.sin(T * 0.48 + i * 0.7 + 2),
  }));
  const scatterData6 = Array.from({ length: 8 }, (_, i) => ({
    x: 18 + 68 * (0.5 + 0.5 * Math.sin(T * 0.3 + i * 0.42)),
    y: 22 + 60 * (0.5 + 0.5 * Math.cos(T * 0.37 + i * 0.35 + 1.5)),
  }));

  const rf = getFrame(RAD_KF);
  const radarData = RADAR_SUBJECTS.map((subject, i) => ({
    subject,
    v1: spline(rf.k0.v1[i], rf.k1.v1[i], rf.k2.v1[i], rf.k3.v1[i], rf.t),
    v2: spline(rf.k0.v2[i], rf.k1.v2[i], rf.k2.v2[i], rf.k3.v2[i], rf.t),
    v3: 40 + 28 * (0.5 + 0.5 * Math.sin(T * 0.4 + i * 0.9)),
    v4: 45 + 24 * (0.5 + 0.5 * Math.cos(T * 0.5 + i * 0.7 + 1)),
    v5: 38 + 26 * (0.5 + 0.5 * Math.sin(T * 0.35 + i * 0.6 + 2)),
    v6: 42 + 22 * (0.5 + 0.5 * Math.cos(T * 0.45 + i * 0.8 + 0.6)),
  }));

  return (
    <div className="charts-grid">
      {selected && (
        <button className="chart-reset-pill" onPointerDown={(e) => { e.stopPropagation(); setSelected(null); }} aria-label="Réinitialiser la sélection">
          <span className="chart-reset-dot" style={{ background: selected }} />
          <span className="chart-reset-label">Reset</span>
          <X size={12} />
        </button>
      )}

      {/* 1. Line */}
      <div className="chart-bare">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={lineData} margin={{ top: 6, right: 6, left: 6, bottom: 6 }}>
            <YAxis domain={[0, 50]} hide={true} />
            <Line type="monotone" dataKey="a" stroke={CHART_COLORS[0]} strokeWidth={2} strokeOpacity={strokeAlpha(CHART_COLORS[0])} dot={false} isAnimationActive={false} strokeLinecap="round" {...handlePick(CHART_COLORS[0])} />
            <Line type="monotone" dataKey="d" stroke={CHART_COLORS[1]} strokeWidth={2} strokeOpacity={strokeAlpha(CHART_COLORS[1])} dot={false} isAnimationActive={false} strokeLinecap="round" {...handlePick(CHART_COLORS[1])} />
            <Line type="monotone" dataKey="e" stroke={CHART_COLORS[2]} strokeWidth={2} strokeOpacity={strokeAlpha(CHART_COLORS[2])} dot={false} isAnimationActive={false} strokeLinecap="round" {...handlePick(CHART_COLORS[2])} />
            <Line type="monotone" dataKey="b" stroke={CHART_COLORS[3]} strokeWidth={2} strokeOpacity={strokeAlpha(CHART_COLORS[3])} dot={false} isAnimationActive={false} strokeLinecap="round" {...handlePick(CHART_COLORS[3])} />
            <Line type="monotone" dataKey="c" stroke={CHART_COLORS[4]} strokeWidth={2} strokeOpacity={strokeAlpha(CHART_COLORS[4])} dot={false} isAnimationActive={false} strokeLinecap="round" {...handlePick(CHART_COLORS[4])} />
            <Line type="monotone" dataKey="f" stroke={CHART_COLORS[5]} strokeWidth={2} strokeOpacity={strokeAlpha(CHART_COLORS[5])} dot={false} isAnimationActive={false} strokeLinecap="round" {...handlePick(CHART_COLORS[5])} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 2. Pie */}
      <div className="chart-bare chart-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData} dataKey="value"
              cx="50%" cy="50%"
              innerRadius="32%" outerRadius="56%"
              paddingAngle={1.5}
              startAngle={90 + T * 12}
              endAngle={90 + T * 12 + 360}
              isAnimationActive={false}
            >
              {pieData.map((_, i) => {
                const c = CHART_COLORS[i % CHART_COLORS.length];
                return (
                  <Cell
                    key={i}
                    fill={c}
                    fillOpacity={fillAlpha(c)}
                    onClick={() => toggleColor(c)}
                    style={{ cursor: "pointer" }}
                  />
                );
              })}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* 3. Bar */}
      <div className="chart-bare">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData} margin={{ top: 6, right: 6, left: 6, bottom: 6 }} barCategoryGap="18%">
            <Bar dataKey="v" radius={[3, 3, 0, 0]} isAnimationActive={false}>
              {barData.map((_, i) => {
                const c = CHART_COLORS[i % CHART_COLORS.length];
                return (
                  <Cell
                    key={i}
                    fill={c}
                    fillOpacity={fillAlpha(c)}
                    onClick={() => toggleColor(c)}
                    style={{ cursor: "pointer" }}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 4. Scatter */}
      <div className="chart-bare">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
            <XAxis dataKey="x" type="number" domain={[0, 100]} hide={true} />
            <YAxis dataKey="y" yAxisId="a" type="number" domain={[0, 100]} hide={true} />
            <YAxis dataKey="y" yAxisId="b" orientation="right" type="number" domain={[0, 100]} hide={true} />
            <YAxis dataKey="y" yAxisId="c" orientation="right" type="number" domain={[0, 100]} hide={true} />
            <YAxis dataKey="y" yAxisId="d" orientation="right" type="number" domain={[0, 100]} hide={true} />
            <YAxis dataKey="y" yAxisId="e" orientation="right" type="number" domain={[0, 100]} hide={true} />
            <YAxis dataKey="y" yAxisId="f" orientation="right" type="number" domain={[0, 100]} hide={true} />
            <Scatter yAxisId="a" data={scatterData1} fill={CHART_COLORS[0]} fillOpacity={fillAlpha(CHART_COLORS[0])} isAnimationActive={false} {...handlePick(CHART_COLORS[0])} />
            <Scatter yAxisId="d" data={scatterData4} fill={CHART_COLORS[1]} fillOpacity={fillAlpha(CHART_COLORS[1])} isAnimationActive={false} {...handlePick(CHART_COLORS[1])} />
            <Scatter yAxisId="e" data={scatterData5} fill={CHART_COLORS[2]} fillOpacity={fillAlpha(CHART_COLORS[2])} isAnimationActive={false} {...handlePick(CHART_COLORS[2])} />
            <Scatter yAxisId="b" data={scatterData2} fill={CHART_COLORS[3]} fillOpacity={fillAlpha(CHART_COLORS[3])} isAnimationActive={false} {...handlePick(CHART_COLORS[3])} />
            <Scatter yAxisId="c" data={scatterData3} fill={CHART_COLORS[4]} fillOpacity={fillAlpha(CHART_COLORS[4])} isAnimationActive={false} {...handlePick(CHART_COLORS[4])} />
            <Scatter yAxisId="f" data={scatterData6} fill={CHART_COLORS[5]} fillOpacity={fillAlpha(CHART_COLORS[5])} isAnimationActive={false} {...handlePick(CHART_COLORS[5])} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* 5. Composed */}
      <div className="chart-bare">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={composedData} margin={{ top: 6, right: 6, left: 6, bottom: 6 }}>
            <defs>
              <linearGradient id="compAreaGrad0" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={CHART_COLORS[0]} stopOpacity={0.55} />
                <stop offset="100%" stopColor={CHART_COLORS[0]} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <XAxis dataKey="i" hide={true} />
            <YAxis domain={[0, 1300]} hide={true} />
            <Area type="monotone" dataKey="area" fill="url(#compAreaGrad0)" fillOpacity={fillAlpha(CHART_COLORS[0])} stroke={CHART_COLORS[0]} strokeOpacity={strokeAlpha(CHART_COLORS[0])} strokeWidth={1.5} dot={false} isAnimationActive={false} {...handlePick(CHART_COLORS[0])} />
            <Bar dataKey="bar" barSize={7} fill={CHART_COLORS[1]} fillOpacity={fillAlpha(CHART_COLORS[1])} radius={[2, 2, 0, 0]} isAnimationActive={false} {...handlePick(CHART_COLORS[1])} />
            <Bar dataKey="bar2" barSize={7} fill={CHART_COLORS[2]} fillOpacity={fillAlpha(CHART_COLORS[2])} radius={[2, 2, 0, 0]} isAnimationActive={false} {...handlePick(CHART_COLORS[2])} />
            <Line type="monotone" dataKey="line" stroke={CHART_COLORS[3]} strokeOpacity={strokeAlpha(CHART_COLORS[3])} strokeWidth={2} dot={false} isAnimationActive={false} {...handlePick(CHART_COLORS[3])} />
            <Line type="monotone" dataKey="line2" stroke={CHART_COLORS[4]} strokeOpacity={strokeAlpha(CHART_COLORS[4])} strokeWidth={2} dot={false} isAnimationActive={false} {...handlePick(CHART_COLORS[4])} />
            <Scatter dataKey="dot" fill={CHART_COLORS[5]} fillOpacity={fillAlpha(CHART_COLORS[5])} isAnimationActive={false} {...handlePick(CHART_COLORS[5])} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* 6. Radar */}
      <div className="chart-bare chart-center">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData} outerRadius="54%" margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
            <PolarGrid stroke={`${ACCENT1}44`} />
            <PolarAngleAxis dataKey="subject" tick={false} />
            <Radar dataKey="v1" stroke={CHART_COLORS[0]} strokeOpacity={strokeAlpha(CHART_COLORS[0])} fill={CHART_COLORS[0]} fillOpacity={fillAlpha(CHART_COLORS[0], 0.35)} isAnimationActive={false} dot={false} {...handlePick(CHART_COLORS[0])} />
            <Radar dataKey="v3" stroke={CHART_COLORS[1]} strokeOpacity={strokeAlpha(CHART_COLORS[1])} fill={CHART_COLORS[1]} fillOpacity={fillAlpha(CHART_COLORS[1], 0.25)} isAnimationActive={false} dot={false} {...handlePick(CHART_COLORS[1])} />
            <Radar dataKey="v4" stroke={CHART_COLORS[2]} strokeOpacity={strokeAlpha(CHART_COLORS[2])} fill={CHART_COLORS[2]} fillOpacity={fillAlpha(CHART_COLORS[2], 0.22)} isAnimationActive={false} dot={false} {...handlePick(CHART_COLORS[2])} />
            <Radar dataKey="v5" stroke={CHART_COLORS[3]} strokeOpacity={strokeAlpha(CHART_COLORS[3])} fill={CHART_COLORS[3]} fillOpacity={fillAlpha(CHART_COLORS[3], 0.22)} isAnimationActive={false} dot={false} {...handlePick(CHART_COLORS[3])} />
            <Radar dataKey="v2" stroke={CHART_COLORS[4]} strokeOpacity={strokeAlpha(CHART_COLORS[4])} fill={CHART_COLORS[4]} fillOpacity={fillAlpha(CHART_COLORS[4], 0.3)} isAnimationActive={false} dot={false} {...handlePick(CHART_COLORS[4])} />
            <Radar dataKey="v6" stroke={CHART_COLORS[5]} strokeOpacity={strokeAlpha(CHART_COLORS[5])} fill={CHART_COLORS[5]} fillOpacity={fillAlpha(CHART_COLORS[5], 0.22)} isAnimationActive={false} dot={false} {...handlePick(CHART_COLORS[5])} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lang, setLang] = useState("fr");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const trackRef = useRef(null);

  const t = translations[lang];

  // ── Slide navigation ──────────────────────────────────────────────────────
  const goToSlide = (n) => {
    const idx = Math.max(0, Math.min(TOTAL_SLIDES - 1, n));
    setCurrentSlide(idx);
    if (trackRef.current) {
      trackRef.current.style.transform = `translateY(-${idx * 100}vh)`;
    }
  };

  useEffect(() => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translateY(-${currentSlide * 100}vh)`;
    }
  }, [currentSlide]);

  // ── Wheel → vertical snap ─────────────────────────────────────────────────
  useEffect(() => {
    const THROTTLE = 1100;
    let lastWheel = 0;
    const findScrollable = (el) => {
      while (el && el.nodeType === 1 && el !== document.body) {
        const cs = getComputedStyle(el);
        if ((cs.overflowY === "auto" || cs.overflowY === "scroll") && el.scrollHeight > el.clientHeight + 1) return el;
        el = el.parentElement;
      }
      return null;
    };
    const onWheel = (e) => {
      const delta = e.deltaY || e.deltaX;
      const scrollable = findScrollable(e.target);
      if (scrollable) {
        const max = scrollable.scrollHeight - scrollable.clientHeight;
        const cur = scrollable.scrollTop;
        const atEdge = (delta > 0 && cur >= max - 1) || (delta < 0 && cur <= 1);
        if (!atEdge) return;
      }
      e.preventDefault();
      const now = Date.now();
      if (now - lastWheel < THROTTLE) return;
      lastWheel = now;
      setCurrentSlide((prev) => {
        const next = delta > 0 ? Math.min(TOTAL_SLIDES - 1, prev + 1) : Math.max(0, prev - 1);
        if (trackRef.current) {
          trackRef.current.style.transform = `translateY(-${next * 100}vh)`;
        }
        return next;
      });
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  // ── Touch swipe ───────────────────────────────────────────────────────────
  useEffect(() => {
    let touchStartY = 0;
    let touchStartX = 0;
    let scrollableEl = null;
    let scrollTopAtStart = 0;
    const findScrollable = (el) => {
      while (el && el.nodeType === 1 && el !== document.body) {
        const cs = getComputedStyle(el);
        if ((cs.overflowY === "auto" || cs.overflowY === "scroll") && el.scrollHeight > el.clientHeight + 1) return el;
        el = el.parentElement;
      }
      return null;
    };
    const onTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
      scrollableEl = findScrollable(e.target);
      scrollTopAtStart = scrollableEl ? scrollableEl.scrollTop : 0;
    };
    const onTouchMove = (e) => {
      if (e.touches.length !== 1) return;
      const dx = Math.abs(e.touches[0].clientX - touchStartX);
      const dy = Math.abs(e.touches[0].clientY - touchStartY);
      if (dx > dy && dx > 8 && e.cancelable) e.preventDefault();
    };
    const onTouchEnd = (e) => {
      const dy = touchStartY - e.changedTouches[0].clientY;
      const dx = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(dy) <= Math.abs(dx) || Math.abs(dy) <= 40) return;
      if (scrollableEl) {
        const max = scrollableEl.scrollHeight - scrollableEl.clientHeight;
        const atEdgeAtStart = (dy > 0 && scrollTopAtStart >= max - 1) || (dy < 0 && scrollTopAtStart <= 1);
        if (!atEdgeAtStart) return;
      }
      setCurrentSlide((prev) => {
        const next = dy > 0 ? Math.min(TOTAL_SLIDES - 1, prev + 1) : Math.max(0, prev - 1);
        if (trackRef.current) {
          trackRef.current.style.transform = `translateY(-${next * 100}vh)`;
        }
        return next;
      });
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  // ── Keyboard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        setCurrentSlide((prev) => {
          const next = Math.min(TOTAL_SLIDES - 1, prev + 1);
          if (trackRef.current) trackRef.current.style.transform = `translateY(-${next * 100}vh)`;
          return next;
        });
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        setCurrentSlide((prev) => {
          const next = Math.max(0, prev - 1);
          if (trackRef.current) trackRef.current.style.transform = `translateY(-${next * 100}vh)`;
          return next;
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ── Page entrance ─────────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 4000);
    return () => clearTimeout(timer);
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

  const NAV_SLIDES = [
    { label: t.nav.home,     idx: 0 },
    { label: t.nav.services, idx: 1 },
    { label: t.nav.stack,    idx: 2 },
    { label: t.nav.contact,  idx: 3 },
  ];

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", background: BG, color: TEXT, position: "relative", touchAction: "pan-y" }}>
      <Analytics />

      {/* Page entrance overlay */}
      <AnimatePresence>
        {!loaded && (
          <motion.div
            key="loader"
            className="page-loader"
            initial={{ opacity: 1 }}
            exit={{ y: "-100vh" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="page-loader-content"
            >
              <div className="page-loader-rive">
                <LoaderLogo />
              </div>
              <motion.span
                className="page-loader-name"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                Lucas Massoni
              </motion.span>
              <motion.span
                className="page-loader-title"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                Salesforce · SAP · Analytics
              </motion.span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* NAV */}
      <nav
        className="fixed w-full z-50 transition-all duration-500"
        style={{
          height: NAV_HEIGHT,
          background: BG,
          boxShadow: currentSlide > 0
            ? `0 6px 18px ${SHADOW_DARK}, 0 -1px 0 ${SHADOW_LIGHT}`
            : `0 3px 12px ${SHADOW_DARK}`,
          transition: "box-shadow 0.5s ease, opacity 0.3s ease",
          opacity: loaded ? 1 : 0,
        }}
      >
        <Container>
          <div className="flex justify-between items-center h-[88px]">
            <div className="flex items-center" style={{ cursor: "default" }}>
              <NavLogo />
              <span className="font-tech-upper text-xl font-bold" style={{ color: TITLES }}>
                {t.name}
              </span>
            </div>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              {NAV_SLIDES.slice(0, 3).map((item) => (
                <button
                  key={item.idx}
                  onClick={() => goToSlide(item.idx)}
                  className="nav-link font-tech-upper"
                  style={{
                    color: TITLES,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    opacity: currentSlide === item.idx ? 1 : 0.7,
                    fontWeight: currentSlide === item.idx ? "700" : undefined,
                  }}
                >
                  {item.label}
                </button>
              ))}
              <LangToggle lang={lang} setLang={setLang} />
              <button
                onClick={() => goToSlide(3)}
                className="btn-primary btn-hover"
                style={{ padding: "12px 18px", fontSize: "0.8rem", border: "none", cursor: "pointer" }}
              >
                {t.nav.contact}
              </button>
            </div>

            {/* Mobile: lang toggle + hamburger */}
            <div className="md:hidden flex items-center gap-3">
              <LangToggle lang={lang} setLang={setLang} />
              <button
                onClick={() => setIsMenuOpen((v) => !v)}
                aria-label="Open menu"
                style={{ color: TITLES, background: "none", border: "none", cursor: "pointer" }}
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
            style={{ background: BG, boxShadow: `0 8px 22px ${SHADOW_DARK}` }}
          >
            <Container>
              <div className="py-5 flex flex-col gap-3">
                {NAV_SLIDES.map((item) => (
                  <button
                    key={item.idx}
                    onClick={() => { goToSlide(item.idx); closeMenu(); }}
                    className="font-tech-upper px-4 py-3 text-left"
                    style={{
                      color: currentSlide === item.idx ? ACCENT1_DEEP : TITLES,
                      letterSpacing: "0.14em",
                      background: BG,
                      border: "none",
                      borderRadius: 14,
                      cursor: "pointer",
                      width: "100%",
                      boxShadow: currentSlide === item.idx ? SHADOW_IN_SM : SHADOW_OUT_SM,
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </Container>
          </div>
        )}

      </nav>

      {/* Slide indicator dots — fixés à gauche, centrés verticalement */}
      <div className="slide-dots" style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.3s ease" }}>
        <div className="slide-dots-line" />
        {NAV_SLIDES.map((item) => (
          <button
            key={item.idx}
            onClick={() => goToSlide(item.idx)}
            className={`slide-dot ${currentSlide === item.idx ? "slide-dot-active" : ""}`}
            aria-label={item.label}
          >
            {currentSlide === item.idx && (
              <span className="slide-dot-label hidden md:block">{item.label}</span>
            )}
          </button>
        ))}
      </div>

      {/* SLIDES TRACK — vertical */}
      <div
        ref={trackRef}
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100vw",
          height: `${TOTAL_SLIDES * 100}vh`,
          willChange: "transform",
          transition: "transform 0.9s cubic-bezier(0.65, 0, 0.35, 1)",
          transform: `translateY(-${currentSlide * 100}vh)`,
          touchAction: "pan-y",
        }}
      >

        {/* ── SLIDE 1: HERO ─────────────────────────────────────────────────── */}
        <section
          id="top"
          style={{ width: "100vw", height: "100vh", flexShrink: 0, overflow: "hidden", paddingTop: NAV_HEIGHT, position: "relative" }}
        >
          {/* Dot grid background */}
          <div className="hero-dot-grid" />

          <div style={{ height: `calc(100vh - ${NAV_HEIGHT}px)`, display: "flex", alignItems: "center", position: "relative", zIndex: 1 }}>
            <Container>
              <div className="hero-layout">
                {/* LEFT: text */}
                <div className="hero-left">
                  <motion.div
                    className="flex gap-2 mb-4 flex-wrap"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {t.hero.badges.map((b, i) => (
                      <motion.span
                        key={b}
                        className="badge"
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.15 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                      >
                        {b}
                      </motion.span>
                    ))}
                  </motion.div>
                  <motion.div
                    className="font-tech-upper text-sm mb-3 opacity-70"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 0.7, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {t.hero.kicker}
                  </motion.div>
                  <motion.h1
                    className="hero-title font-tech-upper font-bold"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {t.hero.titleLine1}{" "}
                    <motion.span
                      className="hero-title-line2"
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {t.hero.titleLine2}
                    </motion.span>
                  </motion.h1>
                  <motion.p
                    className="font-tech mt-6 text-lg leading-relaxed"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {t.hero.subtitle}
                  </motion.p>
                  <motion.div
                    className="flex gap-4 mt-8 flex-wrap"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <button onClick={() => goToSlide(3)} className="btn-primary btn-hover" style={{ border: "none", cursor: "pointer" }}>
                      {t.hero.ctaPrimary}
                      <ArrowRight size={18} />
                    </button>
                    <button onClick={() => goToSlide(1)} className="btn-secondary btn-hover" style={{ cursor: "pointer" }}>
                      {t.hero.ctaSecondary}
                    </button>
                  </motion.div>

                  {/* Metrics bar */}
                  <motion.div
                    className="metrics-bar"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {t.metrics.map((m, i) => (
                      <motion.div
                        key={m.label}
                        className="metric-item"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.95 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <span className="metric-value">{m.value}</span>
                        <span className="metric-label">{m.label}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>

                {/* RIGHT: 6 charts grid */}
                <motion.div
                  className="hero-right"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{
                    opacity: currentSlide === 0 ? 1 : 0.3,
                    scale: 1,
                    y: currentSlide * -40,
                  }}
                  transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
                >
                  <DataFlowAnimation active={currentSlide === 0} lang={lang} />
                </motion.div>
              </div>
            </Container>
          </div>

          {/* Scroll down indicator */}
          <motion.div
            className="scroll-indicator"
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            style={{ opacity: currentSlide === 0 ? 0.4 : 0 }}
            onClick={() => goToSlide(1)}
          >
            <ChevronDown size={20} color={TITLES} />
          </motion.div>
        </section>

        {/* ── SLIDE 2: SERVICES ─────────────────────────────────────────────── */}
        <section
          id="services"
          style={{
            width: "100vw", height: "100vh", flexShrink: 0, overflow: "hidden", paddingTop: NAV_HEIGHT,
            position: "relative",
            backgroundImage: `radial-gradient(circle at 20% 50%, ${ACCENT1}08 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${ACCENT2}06 0%, transparent 40%)`,
          }}
        >
          <div style={{ height: `calc(100vh - ${NAV_HEIGHT}px)`, overflowY: "auto", overflowX: "hidden", WebkitOverflowScrolling: "touch", touchAction: "pan-y" }}>
            <div style={{ minHeight: "100%", display: "flex", alignItems: "center", padding: "24px 0" }}>
            <Container>
              <AnimatePresence mode="wait">
                <motion.div
                  key={lang + "-services"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22 }}
                >
                  <h2 className="section-title">{t.services.title}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-3 md:gap-4 mt-4 md:mt-10">
                    {t.services.items.map((s, idx) => (
                      <motion.div
                        key={s.key}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: idx * 1, ease: [0.22, 1, 0.36, 1] }}
                        whileHover={{ y: -6 }}
                        className="service-card card-hover md:col-span-2"
                      >
                        <span className="service-number">{`0${idx + 1}`}</span>
                        <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 0 }}>
                          <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                            <div className="icon">{SERVICE_ICONS[s.key]}</div>
                            <div className="min-w-0">
                              <div className="service-title">{s.title}</div>
                              <p className="service-text">{s.desc}</p>
                            </div>
                          </div>

                          {(s.cta?.url || s.cta2?.url || s.cta3?.url) && (
                            <div style={{ display: "flex", gap: "8px", justifyContent: "center", alignItems: "center", marginTop: "auto", paddingTop: "16px" }}>
                              {s.cta?.url && (
                                <div className="preview-wrapper">
                                  <a
                                    href={s.cta.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-secondary btn-hover preview-trigger"
                                    style={{ padding: "8px 12px", fontSize: "0.72rem" }}
                                  >
                                    {s.cta.label}
                                  </a>
                                  {s.cta.preview && (
                                    <div className="preview-tooltip">
                                      <img src={s.cta.preview} alt="Aperçu du site" className="preview-img" />
                                      <div className="preview-label">{s.cta.previewLabel}</div>
                                    </div>
                                  )}
                                </div>
                              )}
                              {s.cta2?.url && (
                                s.cta2.appStore ? (
                                  <a
                                    href={s.cta2.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-secondary btn-hover"
                                    style={{ background: ACCENT1, color: "#fff", borderColor: ACCENT1, padding: "8px 14px" }}
                                  >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                                    </svg>
                                  </a>
                                ) : (
                                  <div className="preview-wrapper">
                                    <a
                                      href={s.cta2.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="btn-secondary btn-hover preview-trigger"
                                      style={{ padding: "8px 12px", fontSize: "0.72rem" }}
                                    >
                                      {s.cta2.label}
                                    </a>
                                    {s.cta2.preview && (
                                      <div className="preview-tooltip">
                                        <img src={s.cta2.preview} alt="Aperçu du site" className="preview-img" />
                                        <div className="preview-label">{s.cta2.previewLabel}</div>
                                      </div>
                                    )}
                                  </div>
                                )
                              )}
                              {s.cta3?.url && (
                                <div className="preview-wrapper">
                                  <a
                                    href={s.cta3.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-secondary btn-hover preview-trigger"
                                    style={{ padding: "8px 12px", fontSize: "0.72rem" }}
                                  >
                                    {s.cta3.label}
                                  </a>
                                  {s.cta3.preview && (
                                    <div className="preview-tooltip">
                                      <img src={s.cta3.preview} alt="Aperçu du site" className="preview-img" />
                                      <div className="preview-label">{s.cta3.previewLabel}</div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </Container>
            </div>
          </div>
        </section>

        {/* ── SLIDE 3: STACK ────────────────────────────────────────────────── */}
        <section
          id="stack"
          style={{ width: "100vw", height: "100vh", flexShrink: 0, overflow: "hidden", paddingTop: NAV_HEIGHT }}
        >
          <div style={{ height: `calc(100vh - ${NAV_HEIGHT}px)`, overflowY: "auto", overflowX: "hidden", WebkitOverflowScrolling: "touch", touchAction: "pan-y" }}>
            <div style={{ minHeight: "100%", display: "flex", alignItems: "center", padding: "24px 0" }}>
            <Container>
              <AnimatePresence mode="wait">
                <motion.div
                  key={lang + "-stack"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22 }}
                >
                  <h2 className="section-title mb-6">{t.stack.title}</h2>
                  <div className="stack-columns">
                    {t.stack.columns.map((col, colIdx) => {
                      let globalIdx = 0;
                      for (let i = 0; i < colIdx; i++) globalIdx += t.stack.columns[i].items.length;
                      return (
                        <div key={col.title} className="stack-column">
                          <h3 className="stack-column-title">{col.title}</h3>
                          <div className="stack-column-cards">
                            {col.items.map((item, idx) => (
                              <motion.div
                                key={item.name}
                                className="stack-card"
                                initial={{ opacity: 0, y: 30, scale: 0.92 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.5, delay: (globalIdx + idx) * 0.05, ease: [0.22, 1, 0.36, 1] }}
                              >
                                <span className="stack-card-name">{item.name}</span>
                                <p className="stack-card-desc">{item.desc}</p>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>
            </Container>
            </div>
          </div>
        </section>

        {/* ── SLIDE 4: CONTACT ──────────────────────────────────────────────── */}
        <section
          id="contact"
          style={{ width: "100vw", height: "100vh", flexShrink: 0, overflow: "hidden", paddingTop: NAV_HEIGHT, position: "relative" }}
        >
          {/* Gradient orbs */}
          <motion.div
            className="contact-orb contact-orb-1"
            animate={{ x: [0, 30, -20, 0], y: [0, -40, 20, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="contact-orb contact-orb-2"
            animate={{ x: [0, -25, 15, 0], y: [0, 30, -35, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />

          <div style={{ height: `calc(100vh - ${NAV_HEIGHT}px)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1 }}>
            <Container>
              <AnimatePresence mode="wait">
                <motion.div
                  key={lang + "-contact"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22 }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 32 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="contact-box card-hover">
                      <h2 className="section-title">{t.contact.title}</h2>

                      {/* Availability indicator */}
                      <div className="availability-badge">
                        <span className="availability-dot" />
                        {t.contact.availability}
                      </div>

                      <p className="font-tech mt-4">{t.contact.subtitle}</p>

                      <div className="flex gap-4 mt-6 flex-wrap">
                        <a
                          href="https://calendly.com/lucas-massoni-contact"
                          className="btn-primary btn-hover btn-glow"
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
                  </motion.div>

                  {/* Footer integrated into contact slide */}
                  <div className="font-tech text-sm opacity-50 text-center mt-8">
                    {t.footer.replace("{year}", new Date().getFullYear())}
                  </div>
                </motion.div>
              </AnimatePresence>
            </Container>
          </div>
        </section>

      </div>{/* end slides track */}

      {/* STYLES */}
      <style jsx global>{`
        html, body {
          overflow: hidden;
          height: 100%;
          touch-action: pan-y;
          overscroll-behavior: none;
        }

        /* Hero 2-col layout */
        .hero-layout {
          display: flex;
          align-items: stretch;
          gap: 80px;
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
          min-width: 0;
          max-width: 560px;
          /* Ne pas s'étirer sur la hauteur de la colonne de gauche : sur écran
             court le panneau débordait vers le haut et se faisait rogner. */
          align-self: center;
          max-height: calc(100vh - ${NAV_HEIGHT}px - 40px);
          display: flex;
          flex-direction: column;
        }

        .charts-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: 1fr 1fr;
          gap: 18px;
          flex: 1;
          height: calc(100vh - ${NAV_HEIGHT}px - 40px);
          position: relative;
        }

        .chart-bare {
          background: ${BG};
          border-radius: 18px;
          box-shadow: ${SHADOW_IN_SM};
          padding: 14px;
          overflow: hidden;
          min-height: 0;
        }

        /* DataFlowAnimation — replaces the chart grid in the hero */
        .data-flow-wrap {
          flex: 0 0 auto;
          width: 100%;
          min-width: 0;
          height: calc(100vh - ${NAV_HEIGHT}px - 40px);
          background: ${BG};
          border-radius: 24px;
          box-shadow: ${SHADOW_IN};
          display: block;
          position: relative;
          overflow: hidden;
          contain: strict;
        }

        /* Absolu : le canvas ne doit jamais peser sur la largeur du flex parent
           (sinon boucle resize ↔ layout). */
        .data-flow-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: block;
        }

        .chart-bare :global(path),
        .chart-bare :global(.recharts-rectangle),
        .chart-bare :global(.recharts-symbols),
        .chart-bare :global(.recharts-sector) {
          transition: fill-opacity 0.22s ease, stroke-opacity 0.22s ease;
        }

        .chart-reset-pill {
          position: absolute;
          top: 6px;
          right: 10px;
          z-index: 10;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 13px;
          border-radius: 999px;
          border: none;
          background: ${BG};
          color: ${TITLES};
          font-family: var(--font-share-tech-mono);
          font-size: 0.62rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          box-shadow: ${SHADOW_OUT_SM};
          transition: box-shadow 0.2s ease, color 0.2s ease;
        }

        .chart-reset-pill:hover {
          box-shadow: ${SHADOW_IN_SM};
          color: ${ACCENT1_DEEP};
        }

        .chart-reset-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          box-shadow: 0 0 0 2px ${BG};
        }

        .chart-reset-label {
          opacity: 0.75;
        }

        .chart-center {
          display: flex;
          align-items: stretch;
          justify-content: center;
        }

        .chart-center > * {
          width: 100%;
          height: 100%;
        }

        @media (max-width: 960px) {
          .hero-right {
            display: none;
          }
        }

        /* Titles */
        .hero-title {
          font-size: clamp(1.9rem, 4vw, 2.6rem);
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
          padding: 8px 14px;
          border-radius: 999px;
          border: none;
          background: ${BG};
          box-shadow: ${SHADOW_IN_SM};
          font-family: var(--font-share-tech-mono);
          font-size: 0.7rem;
          letter-spacing: 0.13em;
          color: ${ACCENT1_DEEP};
        }

        /* Lang toggle */
        .lang-toggle {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 999px;
          font-family: var(--font-share-tech-mono);
          font-size: 0.72rem;
          letter-spacing: 0.12em;
          font-weight: 700;
          color: ${TITLES};
          background: ${BG};
          border: none;
          cursor: pointer;
          box-shadow: ${SHADOW_OUT_SM};
          transition: box-shadow 0.2s ease, color 0.2s ease;
        }
        .lang-toggle:hover {
          box-shadow: ${SHADOW_IN_SM};
          color: ${ACCENT1_DEEP};
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
          color: #fff;
          border: none;
          box-shadow:
            8px 8px 20px ${SHADOW_DARK},
            -8px -8px 20px ${SHADOW_LIGHT},
            inset 1px 1px 2px rgba(255,255,255,0.35),
            inset -1px -1px 2px rgba(0,0,0,0.12);
        }

        .btn-secondary {
          border: none;
          color: ${TITLES};
          background: ${BG};
          box-shadow: ${SHADOW_OUT};
        }

        .btn-hover {
          transition: box-shadow 0.22s ease, color 0.22s ease;
          will-change: box-shadow;
        }

        .btn-hover:hover {
          box-shadow: ${SHADOW_IN};
          color: ${ACCENT1_DEEP};
        }

        .btn-primary.btn-hover:hover {
          color: #fff;
          box-shadow:
            inset 4px 4px 10px ${ACCENT1_DEEP},
            inset -4px -4px 10px #95c2b1;
        }

        .btn-hover:active {
          box-shadow: ${SHADOW_IN};
        }

        .btn-hover:focus-visible {
          outline: 2px solid ${ACCENT2};
          outline-offset: 3px;
        }

        /* Cards */
        .service-card {
          background: ${BG};
          border-radius: 22px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 0;
          border: none;
          box-shadow: ${SHADOW_OUT};
          position: relative;
          overflow: visible;
          z-index: 1;
        }

        .service-card:has(.preview-wrapper:hover) {
          z-index: 100;
        }

        .service-accent-bar {
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: ${ACCENT1};
          border-radius: 20px 0 0 20px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .service-card:hover .service-accent-bar {
          opacity: 1;
        }

        .service-number {
          position: absolute;
          top: 12px;
          right: 16px;
          font-family: var(--font-share-tech-mono);
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          opacity: 0.2;
          color: ${TITLES};
        }

        .service-card:hover .icon {
          color: ${ACCENT1_DEEP};
          transform: scale(1.08);
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
          width: 420px;
          background: ${BG};
          border-radius: 18px;
          border: none;
          box-shadow: ${SHADOW_OUT_LG};
          overflow: hidden;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.22s ease, transform 0.22s cubic-bezier(0.22,1,0.36,1);
          z-index: 200;
        }

        .preview-wrapper:hover .preview-tooltip {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
          pointer-events: auto;
        }

        .preview-img {
          width: 100%;
          height: auto;
          object-fit: contain;
          display: block;
        }

        .preview-label {
          padding: 10px 14px;
          font-family: var(--font-share-tech-mono);
          font-size: 0.68rem;
          letter-spacing: 0.1em;
          color: ${TITLES};
          opacity: 0.7;
          background: ${BG};
          box-shadow: inset 0 2px 6px ${SHADOW_DARK};
        }

        /* Stack slide wrapper — même marge gauche que Services */
        .stack-slide-inner {
          width: 100%;
          height: calc(100vh - ${NAV_HEIGHT}px);
          display: flex;
          align-items: center;
          padding: 0 40px;
          box-sizing: border-box;
          overflow-y: auto;
        }

        /* Stack grid */
        .stack-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(160px, 1fr));
          grid-template-rows: repeat(3, 130px);
          gap: 12px;
          width: 100%;
        }

        /* Stack columns */
        .stack-columns {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
          width: 100%;
        }

        .stack-column {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .stack-column-title {
          font-family: var(--font-share-tech-mono);
          font-size: 0.72rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: ${TITLES};
          opacity: 0.65;
          margin: 0 0 4px 0;
          padding-bottom: 14px;
          border-bottom: none;
          box-shadow: 0 1px 0 ${SHADOW_DARK}, 0 2px 0 ${SHADOW_LIGHT};
        }

        .stack-column-cards {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        /* Stack cards — pressed + text morph */
        .stack-card {
          position: relative;
          overflow: hidden;
          border-radius: 18px;
          background: ${BG};
          border: none;
          box-shadow: ${SHADOW_OUT_SM};
          height: 130px;
          cursor: default;
          transition: box-shadow 0.35s ease;
        }

        .stack-card:hover {
          box-shadow: ${SHADOW_IN};
        }

        .stack-card-name,
        .stack-card-desc {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 14px;
          margin: 0;
          text-align: center;
          transition: opacity 0.35s ease, transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), letter-spacing 0.35s ease;
        }

        .stack-card-name {
          font-family: var(--font-share-tech-mono);
          letter-spacing: 0.12em;
          color: ${TITLES};
          font-size: 1.05rem;
          text-transform: uppercase;
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .stack-card-desc {
          font-family: var(--font-body, 'Inter', sans-serif);
          font-size: 0.78rem;
          line-height: 1.45;
          color: ${TEXT};
          opacity: 0;
          transform: translateY(6px) scale(0.96);
          letter-spacing: 0;
        }

        .stack-card:hover .stack-card-name {
          opacity: 0;
          transform: translateY(-6px) scale(0.96);
          letter-spacing: 0.22em;
        }

        .stack-card:hover .stack-card-desc {
          opacity: 0.85;
          transform: translateY(0) scale(1);
        }

        @media (hover: none) {
          .stack-card:active {
            box-shadow: ${SHADOW_IN};
          }
          .stack-card:active .stack-card-name {
            opacity: 0;
          }
          .stack-card:active .stack-card-desc {
            opacity: 0.85;
            transform: translateY(0) scale(1);
          }
        }

        .contact-box {
          background: ${BG};
          border-radius: 28px;
          padding: 48px;
          border: none;
          box-shadow: ${SHADOW_OUT_LG};
          position: relative;
          overflow: hidden;
        }

        /* Contact gradient orbs */
        .contact-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
        }

        .contact-orb-1 {
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, ${ACCENT1}15, transparent);
          top: 20%;
          left: 15%;
        }

        .contact-orb-2 {
          width: 250px;
          height: 250px;
          background: radial-gradient(circle, ${ACCENT2}12, transparent);
          bottom: 15%;
          right: 20%;
        }

        /* Availability indicator */
        .availability-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-share-tech-mono);
          font-size: 0.74rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: ${TEXT};
          margin-top: 12px;
          padding: 10px 20px;
          border-radius: 999px;
          background: ${BG};
          box-shadow: ${SHADOW_IN_SM};
        }

        .availability-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #4ade80;
          display: inline-block;
          box-shadow: 0 0 0 1px ${SHADOW_DARK};
          animation: pulse-dot 2s ease-in-out infinite;
        }

        @keyframes pulse-dot {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.4);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(74, 222, 128, 0);
          }
        }

        /* CTA glow */
        .btn-glow {
          background-size: 200% 200%;
          background-image: linear-gradient(135deg, ${ACCENT1}, ${ACCENT1_DEEP}, ${ACCENT1});
          animation: gradient-x 4s ease infinite;
        }

        .btn-glow:hover {
          color: #fff;
          box-shadow:
            inset 4px 4px 10px ${ACCENT1_DEEP},
            inset -4px -4px 10px #95c2b1,
            0 0 0 6px ${ACCENT1}22;
        }

        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .card-hover {
          transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          will-change: transform, box-shadow;
        }

        .card-hover:hover {
          transform: translateY(-3px);
          box-shadow: ${SHADOW_OUT_LG};
        }

        /* Icons */
        .icon {
          width: 48px;
          height: 48px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${BG};
          border: none;
          box-shadow: ${SHADOW_IN_SM};
          color: ${ACCENT1_DEEP};
          flex: 0 0 auto;
          transition: transform 0.25s ease, color 0.25s ease;
        }

        .service-title {
          font-family: var(--font-share-tech-mono);
          letter-spacing: 0.12em;
          font-weight: 700;
          color: ${ACCENT1_DEEP};
          line-height: 1.2;
        }

        .service-text {
          margin-top: 8px;
          line-height: 1.6;
          color: ${TEXT};
          opacity: 0.78;
        }

        /* Nav links — neumorphism */
        .nav-link {
          position: relative;
          letter-spacing: 0.14em;
          text-decoration: none;
          padding: 8px 18px;
          border-radius: 999px;
          background: transparent;
          font-size: 0.78rem;
          transition: box-shadow 0.22s ease, color 0.22s ease;
        }

        .nav-link:hover {
          box-shadow: ${SHADOW_IN_SM};
          color: ${ACCENT1_DEEP};
        }

        /* Slide dots — vertical, côté gauche de l'écran */
        .slide-dots {
          position: fixed;
          left: 24px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          gap: 10px;
          align-items: center;
          z-index: 100;
        }

        .slide-dots-line {
          display: none;
        }

        .slide-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: ${BG};
          border: none;
          cursor: pointer;
          padding: 0;
          box-shadow: ${SHADOW_OUT_SM};
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          position: relative;
          display: flex;
          align-items: center;
        }

        .slide-dot-active {
          width: 10px;
          height: 26px;
          border-radius: 6px;
          box-shadow: ${SHADOW_IN_SM};
          background: ${ACCENT1};
        }

        .slide-dot-label {
          position: absolute;
          left: 16px;
          white-space: nowrap;
          font-family: var(--font-share-tech-mono);
          font-size: 0.55rem;
          letter-spacing: 0.14em;
          color: ${ACCENT1};
          opacity: 0.7;
          text-transform: uppercase;
        }

        /* Page loader */
        .page-loader {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: ${BG};
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .page-loader-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 28px;
        }

        .page-loader-rive {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background: ${BG};
          box-shadow: ${SHADOW_OUT_LG};
          padding: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .page-loader-name {
          font-family: var(--font-share-tech-mono);
          font-size: 1.1rem;
          letter-spacing: 0.22em;
          font-weight: 700;
          color: ${TITLES};
          text-transform: uppercase;
          margin-top: 4px;
        }

        .page-loader-title {
          font-family: var(--font-share-tech-mono);
          font-size: 0.7rem;
          letter-spacing: 0.26em;
          color: ${ACCENT1_DEEP};
          text-transform: uppercase;
          padding: 9px 22px;
          border-radius: 999px;
          background: ${BG};
          box-shadow: ${SHADOW_IN_SM};
          margin-top: -8px;
        }

        /* Dot grid background */
        .hero-dot-grid {
          position: absolute;
          inset: 0;
          z-index: 0;
          opacity: 0.35;
          background-image: radial-gradient(circle, ${SHADOW_DARK} 1px, transparent 1px);
          background-size: 40px 40px;
          animation: dotGridDrift 20s linear infinite;
        }

        @keyframes dotGridDrift {
          0% { background-position: 0 0; }
          100% { background-position: 40px 40px; }
        }

        /* Metrics bar */
        .metrics-bar {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-top: 40px;
          padding: 22px 28px;
          border-radius: 24px;
          background: ${BG};
          box-shadow: ${SHADOW_IN};
          max-width: 560px;
        }

        .metric-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
          text-align: center;
        }

        .metric-value {
          font-family: var(--font-share-tech-mono);
          font-size: 1.5rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: ${ACCENT1_DEEP};
        }

        .metric-label {
          font-family: var(--font-share-tech-mono);
          font-size: 0.65rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: ${TITLES};
          opacity: 0.65;
        }

        /* Scroll indicator */
        .scroll-indicator {
          position: absolute;
          bottom: 28px;
          left: 50%;
          transform: translateX(-50%);
          cursor: pointer;
          z-index: 2;
          transition: opacity 0.4s ease;
        }

        /* ── MOBILE ─────────────────────────────────────────────────────────── */
        @media (max-width: 768px) {

          /* Hero */
          .hero-layout {
            flex-direction: column;
            gap: 12px;
            justify-content: center;
          }
          .hero-left {
            max-width: 100%;
          }
          .hero-title {
            font-size: clamp(1.3rem, 6vw, 1.7rem);
          }
          .hero-left p {
            font-size: 0.82rem;
            margin-top: 8px !important;
          }

          /* Section titles */
          .section-title {
            font-size: clamp(1.1rem, 5vw, 1.4rem);
            margin-bottom: 8px !important;
          }

          /* Services — 4 cards ultra compactes */
          .service-card {
            padding: 10px 12px;
            gap: 10px;
            border-radius: 12px;
          }
          .service-title {
            font-size: 0.74rem;
          }
          .service-text {
            font-size: 0.7rem;
            line-height: 1.35;
            margin-top: 2px;
          }
          .icon {
            width: 32px;
            height: 32px;
            border-radius: 8px;
            flex: 0 0 32px;
          }

          /* Stack */
          .stack-grid {
            grid-template-columns: repeat(3, 1fr);
            grid-template-rows: repeat(5, 1fr);
            gap: 6px;
          }
          .stack-columns {
            grid-template-columns: 1fr;
            gap: 18px;
          }
          .stack-column-cards {
            grid-template-columns: repeat(3, 1fr);
            gap: 6px;
          }
          .stack-column-title {
            font-size: 0.62rem;
            padding-bottom: 6px;
          }
          .stack-card {
            height: auto;
            min-height: 55px;
          }
          .stack-card-name {
            font-size: 0.72rem;
          }
          .stack-card-desc {
            font-size: 0.58rem;
            padding: 8px 10px;
          }

          /* Contact */
          .contact-box {
            padding: 22px 18px;
          }

          /* Buttons */
          .btn-primary,
          .btn-secondary {
            padding: 10px 14px;
            font-size: 0.72rem;
          }

          /* Metrics */
          .metrics-bar {
            gap: 20px;
            margin-top: 20px;
            padding-top: 16px;
          }
          .metric-value {
            font-size: 1.1rem;
          }
          .metric-label {
            font-size: 0.6rem;
          }

          /* Scroll indicator */
          .scroll-indicator {
            bottom: 16px;
          }

          /* Dots */
          .slide-dots {
            left: 10px;
            gap: 8px;
          }
          .slide-dot {
            width: 6px;
            height: 6px;
          }
        }
      `}</style>
    </div>
  );
}
