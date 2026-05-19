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
          title: "Développement d'application mobile",
          desc: "Conception et développement d'applications iOS/Android, de l'idée au déploiement sur l'App Store.",
          cta: { label: "Anima Apnea", url: "https://www.animaapnea.com/" },
          cta2: { label: "App Store", sublabel: "Télécharger sur l'App Store", url: "https://apps.apple.com/fr/app/anima-apnea/id6760680506", appStore: true },
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
          title: "Mobile App Development",
          desc: "Design and development of iOS/Android apps, from concept to App Store deployment.",
          cta: { label: "Anima Apnea", url: "https://www.animaapnea.com/" },
          cta2: { label: "App Store", sublabel: "Download on the App Store", url: "https://apps.apple.com/fr/app/anima-apnea/id6760680506", appStore: true },
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

// ================= DATA FLOW ANIMATION =================
// 3 phases en boucle (9s) : chaos → table structurée → combo bar+line
function DataFlowAnimation({ active }) {
  const dotsRef = useRef([]);
  const barsRef = useRef([]);
  const donutRefs = useRef([]);
  const treemapRefs = useRef([]);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const gridRef = useRef(null);
  const chartLayerRef = useRef(null);
  const rafRef = useRef(null);
  const tRef = useRef(0);

  const N = 36;
  // Dot index ranges per chart in the final chart phase
  const LINE_DOTS = 8;        // 0-7  (2 series of 4)
  const BAR_DOTS = 6;         // 8-13
  const DONUT_DOTS = 6;       // 14-19
  const SCATTER_DOTS = 8;     // 20-27
  const TREEMAP_DOTS = 8;     // 28-35

  const DOT_COLORS = ["#7aa595", "#fecf56", "#6fafac", "#5e8a7a", "#a8c5b8", "#6f9caf"];
  const LINE_COLOR_1 = "#fecf56"; // jaune
  const LINE_COLOR_2 = "#5e8a7a"; // vert profond

  // Generate layouts once
  const layouts = useMemo(() => {
    let s = 1234;
    const rng = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };

    // Phase 1: chaos
    const chaos = Array.from({ length: N }, () => ({
      x: 80 + rng() * 640, y: 60 + rng() * 380, r: 5 + rng() * 4, alpha: 1,
    }));

    // Phase 2: structured table
    const COLS = 6, ROWS = 6;
    const colW = (680 - 120) / (COLS - 1);
    const rowH = (440 - 120) / (ROWS - 1);
    const structured = Array.from({ length: N }, (_, i) => {
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      return { x: 140 + col * colW, y: 120 + row * rowH, r: 5, alpha: 1 };
    });

    // Phase 3: 5 mini-charts in a 3-cell top row + 2-cell bottom row
    const stages = {
      line:    { x: 50,  y: 50,  w: 210, h: 180 },
      bar:     { x: 290, y: 50,  w: 210, h: 180 },
      donut:   { x: 530, y: 50,  w: 210, h: 180 },
      scatter: { x: 50,  y: 275, w: 270, h: 190 },
      treemap: { x: 350, y: 275, w: 400, h: 190 },
    };

    // --- LINE (8 dots: 2 series × 4 points)
    const linePts = [];
    for (let series = 0; series < 2; series++) {
      for (let i = 0; i < 4; i++) {
        const t = i / 3;
        const baseY = stages.line.y + stages.line.h * (series === 0 ? 0.72 : 0.45);
        const wobble = Math.sin(t * Math.PI * 1.8 + series * 1.4) * 28;
        linePts.push({
          x: stages.line.x + 10 + t * (stages.line.w - 20),
          y: baseY + wobble - t * 35,
        });
      }
    }

    // --- BAR (6 dots → 6 bars)
    const barPts = [];
    const barSlot = stages.bar.w / BAR_DOTS;
    const barW = barSlot * 0.6;
    for (let i = 0; i < BAR_DOTS; i++) {
      const t = i / (BAR_DOTS - 1);
      const barH = 30 + t * 110 + Math.sin(i * 1.5) * 16;
      const cx = stages.bar.x + (i + 0.5) * barSlot;
      barPts.push({ x: cx, y: stages.bar.y + stages.bar.h - barH, barH });
    }
    const barTargets = barPts.map(p => ({
      x: p.x - barW / 2,
      y: p.y,
      w: barW,
      h: p.barH,
    }));

    // --- DONUT (6 dots → 6 sectors)
    const dCx = stages.donut.x + stages.donut.w / 2;
    const dCy = stages.donut.y + stages.donut.h / 2;
    const dR = Math.min(stages.donut.w, stages.donut.h) / 2 * 0.78;
    const dRi = dR * 0.56;
    const dRmid = (dR + dRi) / 2;
    const sectorSweeps = [1.2, 0.85, 1.15, 0.95, 1.05, 0.8]; // relative sizes
    const sweepSum = sectorSweeps.reduce((a, b) => a + b, 0);
    const sectorAngles = []; // [{ a1, a2, mid }]
    let curA = -Math.PI / 2;
    for (let i = 0; i < 6; i++) {
      const sweep = (sectorSweeps[i] / sweepSum) * Math.PI * 2;
      const a1 = curA;
      const a2 = curA + sweep;
      sectorAngles.push({ a1, a2, mid: (a1 + a2) / 2 });
      curA = a2;
    }
    const donutPts = sectorAngles.map(({ mid }) => ({
      x: dCx + Math.cos(mid) * dRmid,
      y: dCy + Math.sin(mid) * dRmid,
    }));
    // Sector paths
    const arcPath = (cx, cy, rOut, rIn, a1, a2) => {
      const x1 = cx + Math.cos(a1) * rOut, y1 = cy + Math.sin(a1) * rOut;
      const x2 = cx + Math.cos(a2) * rOut, y2 = cy + Math.sin(a2) * rOut;
      const x3 = cx + Math.cos(a2) * rIn,  y3 = cy + Math.sin(a2) * rIn;
      const x4 = cx + Math.cos(a1) * rIn,  y4 = cy + Math.sin(a1) * rIn;
      const large = a2 - a1 > Math.PI ? 1 : 0;
      return `M${x1.toFixed(2)},${y1.toFixed(2)} A${rOut},${rOut} 0 ${large} 1 ${x2.toFixed(2)},${y2.toFixed(2)} L${x3.toFixed(2)},${y3.toFixed(2)} A${rIn},${rIn} 0 ${large} 0 ${x4.toFixed(2)},${y4.toFixed(2)} Z`;
    };
    const donutTargets = sectorAngles.map(({ a1, a2 }) => arcPath(dCx, dCy, dR, dRi, a1, a2));

    // --- SCATTER (8 dots pseudo-random)
    const scatterPts = [];
    for (let i = 0; i < SCATTER_DOTS; i++) {
      scatterPts.push({
        x: stages.scatter.x + 18 + rng() * (stages.scatter.w - 36),
        y: stages.scatter.y + 18 + rng() * (stages.scatter.h - 36),
      });
    }

    // --- TREEMAP (8 tiles, non-uniform sizes)
    // Custom layout: 3 tiles on top row + 2 tiles middle + 3 tiles bottom
    // Simpler: column-pack approach for visual interest
    const tmTiles = [
      // 2 large tiles on the left taking 50% width
      { gx: 0,    gy: 0,    gw: 0.42, gh: 0.55 },
      { gx: 0,    gy: 0.55, gw: 0.42, gh: 0.45 },
      // 4 tiles middle column
      { gx: 0.42, gy: 0,    gw: 0.28, gh: 0.42 },
      { gx: 0.42, gy: 0.42, gw: 0.28, gh: 0.32 },
      { gx: 0.42, gy: 0.74, gw: 0.28, gh: 0.26 },
      // 2 tiles right column
      { gx: 0.70, gy: 0,    gw: 0.30, gh: 0.48 },
      { gx: 0.70, gy: 0.48, gw: 0.30, gh: 0.30 },
      { gx: 0.70, gy: 0.78, gw: 0.30, gh: 0.22 },
    ];
    const TM_PAD = 3;
    const treemapTargets = tmTiles.map((t) => ({
      x: stages.treemap.x + t.gx * stages.treemap.w + TM_PAD,
      y: stages.treemap.y + t.gy * stages.treemap.h + TM_PAD,
      w: t.gw * stages.treemap.w - TM_PAD * 2,
      h: t.gh * stages.treemap.h - TM_PAD * 2,
    }));
    const treemapPts = treemapTargets.map(t => ({
      x: t.x + t.w / 2,
      y: t.y + t.h / 2,
    }));

    // --- Combined chart layout (36 dots)
    const chart = [
      ...linePts.map(p => ({ x: p.x, y: p.y, r: 4, alpha: 1 })),       // 0-7 line nodes (visible)
      ...barPts.map(p => ({ x: p.x, y: p.y, r: 3, alpha: 0 })),        // 8-13 bar tops (hidden, bars draw)
      ...donutPts.map(p => ({ x: p.x, y: p.y, r: 3, alpha: 0 })),      // 14-19 donut centroids (hidden, arcs draw)
      ...scatterPts.map(p => ({ x: p.x, y: p.y, r: 4, alpha: 1 })),    // 20-27 scatter (visible as dots)
      ...treemapPts.map(p => ({ x: p.x, y: p.y, r: 3, alpha: 0 })),    // 28-35 treemap centers (hidden, tiles draw)
    ];

    const KFS = [
      { t: 0,    layout: chaos,      kind: "chaos", grid: 0, chart: 0 },
      { t: 1.0,  layout: chaos,      kind: "chaos", grid: 0, chart: 0 },
      { t: 3.0,  layout: chaos,      kind: "chaos", grid: 0, chart: 0 },
      { t: 4.2,  layout: structured, kind: "table", grid: 1, chart: 0 },
      { t: 5.8,  layout: structured, kind: "table", grid: 1, chart: 0 },
      { t: 7.2,  layout: chart,      kind: "chart", grid: 0, chart: 1 },
      { t: 8.7,  layout: chart,      kind: "chart", grid: 0, chart: 1 },
      { t: 9.0,  layout: chaos,      kind: "chaos", grid: 0, chart: 0 },
    ];

    return { chaos, structured, chart, barTargets, donutTargets, treemapTargets, stages, KFS, TOTAL: 9 };
  }, []);

  useEffect(() => {
    if (!active) return;
    const lerp = (a, b, t) => a + (b - a) * t;
    const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
    const hexToRgb = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
    const toHex = (n) => Math.round(n).toString(16).padStart(2, "0");
    const lerpColor = (c1, c2, t) => {
      const a = hexToRgb(c1), b = hexToRgb(c2);
      return "#" + toHex(lerp(a[0], b[0], t)) + toHex(lerp(a[1], b[1], t)) + toHex(lerp(a[2], b[2], t));
    };
    const { KFS, TOTAL, barTargets, donutTargets, treemapTargets } = layouts;

    const step = (ts) => {
      if (tRef.current === 0) tRef.current = ts;
      const time = (ts - tRef.current) / 1000;
      const T = time % TOTAL;

      let a = KFS[0], b = KFS[1];
      for (let i = 0; i < KFS.length - 1; i++) {
        if (T >= KFS[i].t && T < KFS[i + 1].t) { a = KFS[i]; b = KFS[i + 1]; break; }
      }
      const span = b.t - a.t;
      const k = ease(span > 0 ? (T - a.t) / span : 0);

      const chaosA = a.kind === "chaos" ? 1 : 0;
      const chaosB = b.kind === "chaos" ? 1 : 0;
      const chaosWeight = lerp(chaosA, chaosB, k);

      for (let i = 0; i < N; i++) {
        const A = a.layout[i], B = b.layout[i];
        const dot = dotsRef.current[i];
        if (!dot) continue;
        let x = lerp(A.x, B.x, k);
        let y = lerp(A.y, B.y, k);
        if (chaosWeight > 0.01) {
          const sx = 0.35 + (i % 7) * 0.08;
          const sy = 0.28 + (i % 5) * 0.09;
          const ampX = 9 + (i % 4) * 2;
          const ampY = 7 + (i % 3) * 2;
          x += Math.sin(time * sx + i * 0.73) * ampX * chaosWeight;
          y += Math.cos(time * sy + i * 0.97) * ampY * chaosWeight;
        }
        dot.setAttribute("cx", x.toFixed(2));
        dot.setAttribute("cy", y.toFixed(2));
        dot.setAttribute("r", lerp(A.r ?? 5, B.r ?? 5, k).toFixed(2));
        dot.setAttribute("opacity", lerp(A.alpha ?? 1, B.alpha ?? 1, k).toFixed(3));

        // Line-node dots adopt the line color in chart phase
        if (i < LINE_DOTS) {
          const baseColor = DOT_COLORS[i % DOT_COLORS.length];
          const seriesColor = i < 4 ? LINE_COLOR_1 : LINE_COLOR_2;
          const colorTo = b.kind === "chart" ? seriesColor : baseColor;
          const colorFrom = a.kind === "chart" ? seriesColor : baseColor;
          dot.setAttribute("fill", lerpColor(colorFrom, colorTo, k));
        }
      }

      if (gridRef.current) gridRef.current.setAttribute("opacity", lerp(a.grid, b.grid, k).toFixed(3));

      const chartOp = lerp(a.chart, b.chart, k);
      if (chartLayerRef.current) chartLayerRef.current.setAttribute("opacity", chartOp.toFixed(3));

      if (chartOp > 0.02) {
        // Line paths follow current dot positions (series 1: dots 0-3, series 2: dots 4-7)
        const buildPath = (start, end) => {
          let d = "";
          for (let i = start; i < end; i++) {
            const dot = dotsRef.current[i];
            const cx = parseFloat(dot.getAttribute("cx"));
            const cy = parseFloat(dot.getAttribute("cy"));
            d += (i === start ? "M" : "L") + cx.toFixed(1) + "," + cy.toFixed(1) + " ";
          }
          return d.trim();
        };
        if (line1Ref.current) line1Ref.current.setAttribute("d", buildPath(0, 4));
        if (line2Ref.current) line2Ref.current.setAttribute("d", buildPath(4, 8));

        // Bars grow from baseline with stagger
        barsRef.current.forEach((rect, i) => {
          if (!rect) return;
          const stagger = (i / (BAR_DOTS - 1)) * 0.3;
          const localK = Math.max(0, Math.min(1, (chartOp - stagger) / (1 - stagger)));
          const target = barTargets[i];
          const baseline = layouts.stages.bar.y + layouts.stages.bar.h;
          rect.setAttribute("y", (baseline - target.h * localK).toFixed(2));
          rect.setAttribute("height", (target.h * localK).toFixed(2));
          rect.setAttribute("opacity", localK.toFixed(3));
        });

        // Donut sectors fade in with stagger
        donutRefs.current.forEach((path, i) => {
          if (!path) return;
          const stagger = (i / (DONUT_DOTS - 1)) * 0.3;
          const localK = Math.max(0, Math.min(1, (chartOp - stagger) / (1 - stagger)));
          if (chartOp > stagger) {
            path.setAttribute("d", donutTargets[i]);
          }
          path.setAttribute("opacity", localK.toFixed(3));
        });

        // Treemap tiles grow in with stagger
        treemapRefs.current.forEach((rect, i) => {
          if (!rect) return;
          const stagger = (i / (TREEMAP_DOTS - 1)) * 0.35;
          const localK = Math.max(0, Math.min(1, (chartOp - stagger) / (1 - stagger)));
          rect.setAttribute("opacity", localK.toFixed(3));
        });
      } else {
        barsRef.current.forEach((rect) => {
          if (rect) { rect.setAttribute("opacity", 0); rect.setAttribute("height", 0); }
        });
        donutRefs.current.forEach((path) => { if (path) path.setAttribute("opacity", 0); });
        treemapRefs.current.forEach((rect) => { if (rect) rect.setAttribute("opacity", 0); });
      }

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      tRef.current = 0;
    };
  }, [active, layouts]);

  const DONUT_COLORS = ["#7aa595", "#fecf56", "#6fafac", "#a8c5b8", "#5e8a7a", "#cbe2d4"];
  const TREEMAP_COLORS = ["#7aa595", "#a8c5b8", "#fecf56", "#6fafac", "#cbe2d4", "#5e8a7a", "#bdd7c8", "#f0d98a"];

  return (
    <div className="data-flow-wrap">
      <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid meet" className="data-flow-svg">
        {/* Background table grid (visible only in structured phase) */}
        <g ref={gridRef} opacity="0">
          <g stroke="#cbc7be" strokeWidth="0.6" strokeDasharray="2 3" opacity="0.6">
            {[90, 160, 230, 300, 370, 440].map((y) => (
              <line key={`h${y}`} x1="120" y1={y} x2="680" y2={y} />
            ))}
            {[200, 320, 440, 560, 680].map((x) => (
              <line key={`v${x}`} x1={x} y1="60" x2={x} y2="450" />
            ))}
          </g>
          <g fontFamily="Share Tech Mono, monospace" fontSize="11" letterSpacing="1.5" fill="#9ca0a3">
            <text x="140" y="78">ID</text>
            <text x="240" y="78">AMOUNT</text>
            <text x="360" y="78">DATE</text>
            <text x="480" y="78">REGION</text>
            <text x="600" y="78">SCORE</text>
          </g>
        </g>

        {/* Chart layer: 5 mini-charts */}
        <g ref={chartLayerRef} opacity="0">
          {/* Bars (rendered behind dots) */}
          {Array.from({ length: BAR_DOTS }).map((_, i) => {
            const t = layouts.barTargets[i];
            return (
              <rect
                key={`bar${i}`}
                ref={(el) => { barsRef.current[i] = el; }}
                x={t.x}
                y={t.y + t.h}
                width={t.w}
                height={0}
                rx={3}
                fill={i % 2 === 0 ? "#a8c5b8" : "#cbe2d4"}
                opacity={0}
              />
            );
          })}

          {/* Donut sectors */}
          {Array.from({ length: DONUT_DOTS }).map((_, i) => (
            <path
              key={`donut${i}`}
              ref={(el) => { donutRefs.current[i] = el; }}
              d=""
              fill={DONUT_COLORS[i % DONUT_COLORS.length]}
              opacity={0}
            />
          ))}

          {/* Treemap tiles */}
          {Array.from({ length: TREEMAP_DOTS }).map((_, i) => {
            const t = layouts.treemapTargets[i];
            return (
              <rect
                key={`tm${i}`}
                ref={(el) => { treemapRefs.current[i] = el; }}
                x={t.x}
                y={t.y}
                width={t.w}
                height={t.h}
                rx={4}
                fill={TREEMAP_COLORS[i % TREEMAP_COLORS.length]}
                opacity={0}
              />
            );
          })}

          {/* Line paths (above dots so they connect through them) */}
          <path ref={line1Ref} d="" fill="none" stroke={LINE_COLOR_1} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          <path ref={line2Ref} d="" fill="none" stroke={LINE_COLOR_2} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* Dots */}
        <g>
          {Array.from({ length: N }).map((_, i) => (
            <circle
              key={`dot${i}`}
              ref={(el) => { dotsRef.current[i] = el; }}
              cx={400}
              cy={250}
              r={6}
              fill={DOT_COLORS[i % DOT_COLORS.length]}
            />
          ))}
        </g>
      </svg>
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
                  <DataFlowAnimation active={currentSlide === 0} />
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

                          {(s.cta?.url || s.cta2?.url) && (
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
          flex: 1;
          width: 100%;
          height: calc(100vh - ${NAV_HEIGHT}px - 40px);
          background: ${BG};
          border-radius: 24px;
          box-shadow: ${SHADOW_IN};
          padding: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .data-flow-svg {
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
