"use client";
import React, { useState, useEffect, useRef } from "react";
import { Menu, X, Linkedin, Calendar, Award, Rocket, Brain } from "lucide-react";
import { motion } from "framer-motion";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";
import { Analytics } from "@vercel/analytics/react";

// ==== COULEURS ====
const BG = "#FAF9F5";
const ACCENT1 = "#7aa595ff";
const ACCENT2 = "#FECF56";
const TITLES = "#393E41";
const TEXT = "#393E41";
const CARD_BG = "#FFFFFF";
const CARD_TEXT = "#393E41";

// ==== TRADUCTIONS ====
const translations = {
  fr: {
    name: "Lucas Massoni",
    nav: { home: "Accueil", contact: "Contact" },
    hero: {
      title: "EXPERT SALESFORCE",
      subtitle: "Accompagnement complet de la stratégie à l’intégration Salesforce, spécialisé en mission à fort enjeu.",
      startProject: "DÉMARRER UN PROJET",
    },
    expertise: {
      title: "MES EXPERTISES",
      items: [
        {
          title: "SALESFORCE SALES & CPQ",
          description: "Configuration avancée et optimisation de processus de vente complexes. Automatisation de vos cycles de devis, prix, workflows adaptés à votre business.",
        },
        {
          title: "ANALYTICS & TABLEAU",
          description: "Transformation de vos données en insights concrets. Dashboards, analytics, mais aussi développement custom 100% sur-mesure, même sans Tableau ou CRM Analytics.",
          demoBtn: "EXPLORER UNE DÉMO INTERACTIVE",
          demoUrl: "https://www.economytimelapse.com/",
        },
        {
          title: "DÉVELOPPEMENT APEX",
          description: "Intégrations avancées et automatisations robustes sur Salesforce. Développements sur mesure (Apex, Flow, LWC, API…).",
        },
      ],
    },
    whyme: {
      title: "Pourquoi me choisir ?",
      steps: [
        {
          icon: <Award size={40} style={{ color: ACCENT1 }} />,
          title: "Expertise reconnue",
          text: "+5 ans d’expérience Salesforce, CPQ & Analytics. Missions complexes, clients exigeants, résultats concrets.",
        },
        {
          icon: <Rocket size={40} style={{ color: ACCENT1 }} />,
          title: "Méthodo startup",
          text: "Agilité, transparence, vitesse d’exécution. Priorité à l'efficacité : focus impact, pas de blabla.",
        },
        {
          icon: <Brain size={40} style={{ color: ACCENT1 }} />,
          title: "Profil hybride rare",
          text: "Double culture business (finance, stratégie) & dev (autodidacte Salesforce, fullstack). Vision globale : métier, tech, et enjeux financiers.",
        },
      ],
    },
    techStack: { title: "Stack technique" },
    contact: {
      title: "Travaillons ensemble",
      subtitle: "Expliquez-moi votre besoin en deux phrases (ou plus), je vous réponds sous 24h.",
      calendly: "Planifier un appel",
      linkedin: "Connectons-nous",
    },
    footer: "© {year} Lucas Massoni. Expert Salesforce Freelance",
  },
  en: {
    name: "Lucas Massoni",
    nav: { home: "Home", contact: "Contact" },
    hero: {
      title: "SALESFORCE EXPERT",
      subtitle: "Complete support from strategy to Salesforce integration, specializing in high-stakes projects.",
      startProject: "START A PROJECT",
    },
    expertise: {
      title: "MY EXPERTISE",
      items: [
        {
          title: "SALESFORCE SALES & CPQ",
          description: "Advanced configuration and optimization of complex sales processes. Automation of your quote, pricing, and workflow cycles tailored to your business.",
        },
        {
          title: "ANALYTICS & TABLEAU",
          description: "Transform your data into concrete insights. Dashboards, analytics, and fully custom development, even without Tableau or CRM Analytics.",
          demoBtn: "EXPLORE AN INTERACTIVE DEMO",
          demoUrl: "https://www.economytimelapse.com/",
        },
        {
          title: "APEX DEVELOPMENT",
          description: "Advanced integrations and robust automation on Salesforce. Custom developments (Apex, Flow, LWC, API…).",
        },
      ],
    },
    whyme: {
      title: "Why work with me?",
      steps: [
        {
          icon: <Award size={40} style={{ color: ACCENT1 }} />,
          title: "Recognized expertise",
          text: "5+ years Salesforce, CPQ & Analytics. Complex projects, demanding clients, concrete results.",
        },
        {
          icon: <Rocket size={40} style={{ color: ACCENT1 }} />,
          title: "Startup methodology",
          text: "Agility, transparency, execution speed. Focus on impact: no fluff.",
        },
        {
          icon: <Brain size={40} style={{ color: ACCENT1 }} />,
          title: "Rare hybrid profile",
          text: "Double background in business (finance, strategy) & dev (self-taught Salesforce, fullstack). Global vision: business, tech, financial issues.",
        },
      ],
    },
    techStack: { title: "Tech stack" },
    contact: {
      title: "Let's work together",
      subtitle: "Describe your need in two sentences (or more), I'll reply within 24 hours.",
      calendly: "Book a call",
      linkedin: "Let's connect",
    },
    footer: "© {year} Lucas Massoni. Salesforce Expert Freelance",
  }
};

const NAV_HEIGHT = 88;

const SectionDivider = () => (
  <div className="flex justify-center my-7 md:my-12">
    <div
      style={{
        background: TITLES,
        opacity: 0.13,
        height: 1,
        borderRadius: 2,
        width: "46vw",
        maxWidth: 540,
      }}
    />
  </div>
);

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [language, setLanguage] = useState("fr");
  const [underlineIdx, setUnderlineIdx] = useState(-1);
  const underlineRefs = useRef([]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const t = translations[language];

  // Logo animé Rive à utiliser dans la navbar
  const NavLogo = () => {
    const { RiveComponent } = useRive({
      src: "/logo.riv",
      stateMachines: "SM",
      autoplay: true,
      layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
      backgroundColor: "transparent",
    });
    return (
      <div className="w-10 h-10 mr-2 flex items-center justify-center">
        <RiveComponent className="w-full h-full" />
      </div>
    );
  };

  // Ligne verticale fine (entre hero & expertises)
  const VerticalDivider = () => (
    <div
      className="hidden md:flex"
      style={{
        width: 1.2,
        minWidth: 1.2,
        maxWidth: 1.2,
        background: TITLES,
        opacity: 0.14,
        borderRadius: 2,
        alignSelf: "stretch",
        margin: "0 2vw",
      }}
    />
  );

  // HERO + EXPERTISES
  const HeroAndExpertise = () => (
    <section
      className="w-full max-w-[1600px] mx-auto flex flex-col md:flex-row items-stretch px-0 md:px-8"
      style={{
        minHeight: `calc(100vh - ${NAV_HEIGHT}px)`,
        height: `calc(100vh - ${NAV_HEIGHT}px)`,
        alignItems: "stretch",
      }}
    >
      {/* Col gauche : 33% */}
      <div className="flex flex-col justify-between w-full md:w-[33%] pl-6 md:pl-10 xl:pl-20 py-0 pt-10 pb-6">
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <h1
            className="font-tech-upper font-bold text-left"
            style={{
              fontSize: "clamp(2.1rem, 4vw, 2.7rem)",
              color: TITLES,
              letterSpacing: "0.13em",
              lineHeight: "1.07",
              marginBottom: 0,
              whiteSpace: "normal",
              wordBreak: "break-word",
            }}
          >
            {t.hero.title}
          </h1>
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center"
            }}
          >
            <p
              className="font-tech text-left"
              style={{
                color: TEXT,
                margin: "0",
                marginTop: 32,
                marginBottom: 32,
                fontSize: "clamp(1.18rem, 2.2vw, 1.55rem)",
                fontWeight: 600,
                lineHeight: 1.5,
                minHeight: 60,
                display: "flex",
                alignItems: "center"
              }}
            >
              {t.hero.subtitle}
            </p>
          </div>
        </div>
        <div className="flex items-end mt-6">
          <a
            href="#contact"
            className="inline-block px-8 py-4 rounded-full font-bold font-tech-upper transition-all duration-200 text-base btn-hover"
            style={{
              background: ACCENT1,
              color: BG,
              border: "none",
              letterSpacing: ".12em",
              minWidth: 220,
              transition: "transform .16s cubic-bezier(.4,2,.6,1)",
              boxShadow: "0 2px 16px 0 #7aa59518"
            }}
          >
            {t.hero.startProject}
          </a>
        </div>
      </div>
      <VerticalDivider />
      {/* Col droite : 67% */}
      <div className="w-full md:w-[67%] flex flex-col items-stretch justify-between pr-6 md:pr-10 xl:pr-20 py-0 pt-10 pb-6">
        <h2
          className="font-tech-upper font-bold text-left tracking-wider"
          style={{
            fontSize: "clamp(2.1rem, 4vw, 2.7rem)",
            color: TITLES,
            letterSpacing: "0.11em",
            lineHeight: "1.07",
            marginBottom: 20,
            whiteSpace: "normal",
            wordBreak: "break-word",
          }}
        >
          {t.expertise.title}
        </h2>
        <div className="flex flex-col gap-7 w-full justify-center" style={{ flex: 1 }}>
          {t.expertise.items.map((exp, index) => (
            <div
              key={index}
              className="flex flex-col bg-white rounded-2xl px-7 py-5 w-full relative group transition-all duration-300"
              style={{
                boxShadow: "none",
                border: "none",
                minHeight: 102,
                marginTop: index === 0 ? 0 : 0,
              }}
              onMouseEnter={() => setUnderlineIdx(index)}
              onMouseLeave={() => setUnderlineIdx(-1)}
            >
              {/* Titre souligné anim */}
              <div
                className="flex flex-col items-start w-full mb-2 relative"
                style={{ position: "relative" }}
              >
                <span
                  ref={el => (underlineRefs.current[index] = el)}
                  className="font-tech-upper text-lg md:text-xl mb-1"
                  style={{ color: ACCENT1, letterSpacing: "0.10em", zIndex: 1, position: "relative" }}
                >
                  {exp.title}
                </span>
                {/* Soulignement animé */}
                <span
                  className="underline-anim"
                  style={{
                    position: "absolute",
                    left: 0,
                    bottom: 1,
                    height: 3,
                    background: ACCENT1,
                    borderRadius: 2,
                    opacity: 1,
                    width:
                      underlineIdx === index
                        ? underlineRefs.current[index]
                          ? underlineRefs.current[index].offsetWidth + "px"
                          : "0px"
                        : "0px",
                    transition: underlineIdx === index
                      ? "width 0.43s cubic-bezier(.5,.09,.38,1.02)"
                      : "width 0.16s cubic-bezier(.68,-0.6,.32,1.6)",
                    zIndex: 0,
                  }}
                />
              </div>
              <div className="font-tech text-base text-left" style={{ color: CARD_TEXT, wordBreak: "break-word" }}>
                {exp.description}
              </div>
              {/* Demo button pour Analytics : sous le texte, aligné left */}
              {exp.demoBtn && (
                <div className="pt-4">
                  <a
                    href={exp.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2 rounded-full font-tech-upper font-bold transition-all duration-200 text-base whitespace-nowrap btn-hover"
                    style={{
                      background: ACCENT2,
                      color: "#fff",
                      border: "none",
                      letterSpacing: ".11em",
                      fontSize: "1rem",
                      minWidth: 180,
                      textAlign: "center",
                      transition: "transform .16s cubic-bezier(.4,2,.6,1)",
                      boxShadow: "0 2px 16px 0 #ffcf5614"
                    }}
                  >
                    {exp.demoBtn}
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  // Pourquoi me choisir
  const WhyMeSection = () => (
    <section className="py-20 relative transition-colors duration-1000" style={{ background: BG }}>
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <h2
          className="font-tech-upper text-3xl md:text-4xl font-bold text-center mb-14 tracking-tighter"
          style={{ color: TITLES }}
        >
          {t.whyme.title}
        </h2>
        <div className="hidden md:flex flex-row items-start justify-between gap-0 relative w-full">
          {t.whyme.steps.map((step, i) => (
            <div key={i} className="flex-1 flex flex-col items-center min-w-[250px]">
              <div className="mb-4">
                <div className="bg-white rounded-full shadow-lg p-4 flex items-center justify-center border-2" style={{ borderColor: ACCENT1 }}>
                  {step.icon}
                </div>
              </div>
              <div className="font-tech-upper text-md md:text-lg font-bold mb-1 tracking-widest" style={{ color: ACCENT1 }}>
                {step.title}
              </div>
            </div>
          ))}
        </div>
        {/* Barre verte pleine */}
        <div className="hidden md:block w-full my-2 px-4">
          <div className="w-full h-1 mx-auto bg-[#7aa595] rounded-full" style={{ maxWidth: "95%" }}></div>
        </div>
        <div className="hidden md:flex flex-row items-start justify-between gap-0 w-full mt-3">
          {t.whyme.steps.map((step, i) => (
            <div key={i} className="flex-1 min-w-[250px] max-w-[370px]">
              <div className="font-tech text-base text-left" style={{ color: TEXT }}>
                {step.text}
              </div>
            </div>
          ))}
        </div>
        {/* Mobile : colonne */}
        <div className="md:hidden flex flex-col items-center gap-14 relative mt-10">
          {t.whyme.steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center relative w-full">
              <div className="mb-4">
                <div className="bg-white rounded-full shadow-lg p-4 flex items-center justify-center border-2" style={{ borderColor: ACCENT1 }}>
                  {step.icon}
                </div>
              </div>
              <div className="font-tech-upper text-lg font-bold mb-2 tracking-widest" style={{ color: ACCENT1 }}>{step.title}</div>
              <div className="font-tech text-base text-left mb-2" style={{ color: TEXT, maxWidth: 380, margin: "0 auto" }}>{step.text}</div>
              {i < t.whyme.steps.length - 1 && (
                <div className="w-1 h-14 mx-auto bg-[#7aa595] rounded-full opacity-50" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  // Tech stack
  const StackSection = () => (
    <section className="py-20 relative transition-colors duration-1000 overflow-hidden" style={{ background: BG }}>
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <h2
          className="font-tech-upper text-3xl md:text-4xl font-bold text-center mb-10 tracking-tighter"
          style={{ color: TITLES }}
        >
          {t.techStack.title}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 max-w-5xl mx-auto">
          {["Salesforce", "CPQ", "Apex", "Flow", "LWC", "SQL", "Tableau", "CRM Analytics", "JSON", "JavaScript"].map(
            (tech, index) => (
              <div
                key={index}
                className="flex items-center justify-center h-14 px-4 py-2 rounded-3xl border transition-all duration-200 text-sm font-tech-upper btn-hover"
                style={{
                  borderColor: `${ACCENT1}`,
                  color: ACCENT1,
                  background: CARD_BG,
                  transition: "transform .16s cubic-bezier(.4,2,.6,1)",
                }}
              >
                <span className="relative z-10" style={{ color: CARD_TEXT }}>{tech}</span>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );

  // Contact
  const ContactSection = () => (
    <section id="contact" className="py-28 relative transition-colors duration-1000" style={{ background: BG }}>
      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <h2
          className="font-tech-upper text-3xl md:text-4xl font-bold text-center mb-5 tracking-tighter"
          style={{ color: TITLES }}
        >
          {t.contact.title}
        </h2>
        <p
          className="font-tech text-base text-center mb-10"
          style={{ color: TEXT }}
        >
          {t.contact.subtitle}
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
          <a
            href="https://calendly.com/lucas-massoni-contact"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-6 py-4 rounded-full border font-tech-upper font-bold text-base transition-all duration-200 btn-hover"
            style={{
              background: CARD_BG,
              borderColor: `${ACCENT1}`,
              color: ACCENT1,
              boxShadow: "0 2px 12px 0 #7aa59518",
              transition: "transform .16s cubic-bezier(.4,2,.6,1)"
            }}
          >
            <Calendar size={22} style={{ color: ACCENT1 }} />
            {t.contact.calendly}
          </a>
          <a
            href="https://www.linkedin.com/in/lucas-massoni/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-6 py-4 rounded-full border font-tech-upper font-bold text-base transition-all duration-200 btn-hover"
            style={{
              background: CARD_BG,
              borderColor: `${ACCENT1}`,
              color: ACCENT1,
              boxShadow: "0 2px 12px 0 #7aa59518",
              transition: "transform .16s cubic-bezier(.4,2,.6,1)"
            }}
          >
            <Linkedin size={22} style={{ color: ACCENT1 }} />
            {t.contact.linkedin}
          </a>
        </div>
      </div>
    </section>
  );

  // FOOTER
  const Footer = () => (
    <footer className="py-8 relative border-t transition-colors duration-1000" style={{ background: BG, borderColor: `${ACCENT1}33` }}>
      <div className="absolute inset-x-0 top-0 h-px" style={{ background: `${ACCENT1}55` }}></div>
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center group transition-colors duration-500">
          <p className="transition-all duration-500 font-tech text-base" style={{ color: TEXT }}>
            {t.footer.replace("{year}", new Date().getFullYear())}
          </p>
        </div>
      </div>
    </footer>
  );

  return (
    <div className="min-h-screen text-black relative overflow-hidden font-tech tracking-tight" style={{ background: BG }}>
      <Analytics />
      {/* Grille fond */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none z-0"
        style={{
          background: `linear-gradient(${BG} 1px, transparent 1px), linear-gradient(90deg, ${BG} 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          animation: "grid 12s linear infinite",
        }}
      />
      {/* NAV */}
      <nav
        className={`fixed w-full z-50 transition-all duration-700 ${scrolled ? "backdrop-blur-xl shadow-2xl" : ""}`}
        style={{
          background: scrolled ? `${BG}e6` : `${BG}cc`,
          borderBottom: `1px solid ${ACCENT1}33`,
          height: `${NAV_HEIGHT}px`,
        }}
      >
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex justify-between items-center h-[88px]">
            <div className="flex items-center">
              <NavLogo />
              <span className="text-2xl font-bold font-tech-upper tracking-tighter ml-2" style={{ color: TITLES }}>
                {t.name}
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="transition-all duration-500 font-tech-upper relative group text-base font-medium" style={{ color: TITLES }}>
                {t.nav.home}
              </a>
              <a href="#contact" className="px-5 py-2 rounded-full font-bold font-tech-upper transition-all duration-200 text-base btn-hover" style={{ background: ACCENT1, color: BG, border: "none" }}>
                {t.nav.contact}
              </a>
              <button
                onClick={() => setLanguage(language === "fr" ? "en" : "fr")}
                className="transition-all duration-500 font-tech-upper text-base font-medium"
                style={{ color: TITLES }}
              >
                {language === "fr" ? "EN" : "FR"}
              </button>
            </div>
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="transition-colors duration-500"
                style={{ color: TITLES }}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="md:hidden backdrop-blur-xl shadow-xl"
          style={{ background: `${BG}f0`, top: "5.5rem" }}
        >
          <div className="px-6 py-8 space-y-4">
            <a href="#" className="block px-4 py-3 font-tech-upper text-base font-medium" style={{ color: TITLES }}>{t.nav.home}</a>
            <a href="#contact" className="block px-4 py-3 font-tech-upper text-base font-medium" style={{ color: TITLES }}>{t.nav.contact}</a>
            <button onClick={() => setLanguage(language === "fr" ? "en" : "fr")} className="block px-4 py-3 font-tech-upper text-base font-medium" style={{ color: TITLES }}>
              {language === "fr" ? "EN" : "FR"}
            </button>
          </div>
        </motion.div>
      )}

      {/* HERO & EXPERTISES */}
      <div className="w-full" id="expertise" style={{ paddingTop: `${NAV_HEIGHT}px`, minHeight: `calc(100vh - ${NAV_HEIGHT}px)` }}>
        <HeroAndExpertise />
      </div>

      {/* DIVIDER + WHY ME */}
      <SectionDivider />
      <WhyMeSection />

      {/* DIVIDER + STACK */}
      <SectionDivider />
      <StackSection />

      {/* DIVIDER + CONTACT */}
      <SectionDivider />
      <ContactSection />

      {/* FOOTER */}
      <Footer />

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
        html { scroll-behavior: smooth; }
        body {
          background: ${BG};
          font-family: 'Share Tech Mono', Menlo, monospace !important;
          font-size: 50% !important;
        }
        .font-tech { font-family: 'Share Tech Mono', Menlo, monospace; letter-spacing: 0.11em; text-transform: none; }
        .font-tech-upper { font-family: 'Share Tech Mono', Menlo, monospace; text-transform: uppercase; letter-spacing: 0.13em; }
        @keyframes grid { 0% { transform: translateY(0); } 100% { transform: translateY(-60px); } }
        section { scroll-margin-top: 80px; }

        .btn-hover {
          transition: transform .16s cubic-bezier(.4,2,.6,1), box-shadow .18s cubic-bezier(.4,2,.6,1);
        }
        .btn-hover:hover {
          transform: scale(1.045);
          box-shadow: 0 6px 24px 0 #7aa59530;
          z-index: 3;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
