"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Linkedin, Code, Cloud, BarChart, Calendar } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import { Analytics } from '@vercel/analytics/react';

const MINT = "#7EBDA3";
const YELLOW = "#FECF56";
const GRAY = "#B0B9BB";

const translations = {
  fr: {
    name: "Lucas Massoni",
    nav: { home: "Accueil", expertise: "Expertise", contact: "Contact" },
    hero: {
      title: "Expert Salesforce",
      subtitle: "Plus de cinq ans d'expertise en développement et intégration Salesforce.\nSpécialisé en Sales Cloud, CPQ et CRM Analytics",
      startProject: "Démarrer un projet",
      exploreServices: "Explorer mes services",
    },
    expertise: {
      title: "Expertise",
      items: [
        {
          title: "Salesforce Sales & CPQ",
          description: "Configuration avancée et optimisation de processus de vente complexes. Implémentation de règles tarifaires et de workflows adaptés à votre modèle d'affaires.",
        },
        {
          title: "Analytics & Tableau",
          description: "Transformation des données en insights actionnables pour votre business. Création de tableaux de bord personnalisés et d'analyses prédictives.",
        },
        {
          title: "Développement Apex",
          description: "Solutions sur mesure avec les dernières technologies Salesforce. Intégrations complexes et automatisations avancées pour optimiser vos processus.",
        },
      ],
    },
    techStack: { title: "Stack Technique" },
    contact: { title: "Contact", subtitle: "Transformons vos idées en réalité" },
    footer: "© {year} Lucas Massoni. Expert Salesforce Freelance",
    workExample: "Voir un projet interactif"
  },
  en: {
    name: "Lucas Massoni",
    nav: { home: "Home", expertise: "Expertise", contact: "Contact" },
    hero: {
      title: "Salesforce Expert",
      subtitle: "Over five years of expertise in Salesforce development and integration.\nSpecialized in Sales Cloud, CPQ, and CRM Analytics",
      startProject: "Start a Project",
      exploreServices: "Explore My Services",
    },
    expertise: {
      title: "Expertise",
      items: [
        {
          title: "Salesforce Sales & CPQ",
          description: "Advanced configuration and optimization of complex sales processes. Implementation of pricing rules and workflows tailored to your business model.",
        },
        {
          title: "Analytics & Tableau",
          description: "Transforming data into actionable business insights. Creating custom dashboards and predictive analytics.",
        },
        {
          title: "Apex Development",
          description: "Custom solutions using the latest Salesforce technologies. Complex integrations and advanced automations to optimize your processes.",
        },
      ],
    },
    techStack: { title: "Tech Stack" },
    contact: { title: "Contact", subtitle: "Let's turn your ideas into reality" },
    footer: "© {year} Lucas Massoni. Freelance Salesforce Expert",
    workExample: "See Interactive Project"
  },
};

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [language, setLanguage] = useState('fr');
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.4]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.9]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const t = translations[language];

  const StaticHeaderLogo = () => {
    const { RiveComponent } = useRive({
      src: '/logo.riv',
      stateMachines: 'SMLogoStatic',
      autoplay: true,
      layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
      backgroundColor: 'transparent',
    });
    return (
      <div className="w-10 h-10 mr-3 transform transition-transform duration-500 hover:scale-110">
        <RiveComponent className="w-full h-full" />
      </div>
    );
  };

  const RiveLogo = () => {
    const containerRef = useRef(null);
    const [riveInstance, setRiveInstance] = useState(null);
    const { RiveComponent, rive } = useRive({
      src: '/logo.riv',
      stateMachines: 'SM',
      autoplay: true,
      layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
      backgroundColor: 'transparent',
      onLoad: () => { if (rive) setRiveInstance(rive); }
    });

    useEffect(() => {
      const currentContainer = containerRef.current;
      const stopPropagation = (e) => e.stopPropagation();
      const handleScroll = () => {
        if (currentContainer) {
          currentContainer.style.willChange = 'transform';
          if (riveInstance && riveInstance.isPaused) riveInstance.play();
        }
      };
      if (currentContainer) {
        currentContainer.addEventListener('mousemove', stopPropagation);
        currentContainer.addEventListener('mouseenter', stopPropagation);
        currentContainer.addEventListener('mouseleave', stopPropagation);
      }
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        if (currentContainer) {
          currentContainer.removeEventListener('mousemove', stopPropagation);
          currentContainer.removeEventListener('mouseenter', stopPropagation);
          currentContainer.removeEventListener('mouseleave', stopPropagation);
        }
        window.removeEventListener('scroll', handleScroll);
      };
    }, [riveInstance]);

    return (
      <div ref={containerRef} className="w-60 h-60 mx-auto mb-6 relative z-10 mt-16 will-change-transform transform transition-transform duration-700 hover:scale-105">
        <RiveComponent className="w-full h-full" />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#1a2327] text-white relative overflow-hidden font-tech tracking-tight text-[0.75em]">
      <Analytics />
      <div
        className="absolute inset-0 opacity-10 transition-all duration-1000"
        style={{
          background: `linear-gradient(rgba(26,35,39,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(26,35,39,0.7) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          animation: 'grid 12s linear infinite',
        }}
      ></div>
      <nav className={`fixed w-full z-50 transition-all duration-700 ${scrolled ? 'bg-[#1a2327]/95 backdrop-blur-xl shadow-2xl' : 'bg-[#1a2327]/80'}`}>
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <StaticHeaderLogo />
              <span className="text-2xl font-bold font-tech-upper bg-clip-text text-transparent bg-gradient-to-r from-[#b9e2d8] to-[#7ebda3] tracking-tighter">
                {t.name}
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-[#EAD7D7] hover:text-[#7EBDA3] transition-all duration-500 font-tech-upper relative group text-base font-medium">
                {t.nav.home}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#7EBDA3] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center"></span>
              </a>
              <a href="#expertise" className="text-[#EAD7D7] hover:text-[#7EBDA3] transition-all duration-500 font-tech-upper relative group text-base font-medium">
                {t.nav.expertise}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#7EBDA3] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center"></span>
              </a>
              <a
                href="#contact"
                className="px-5 py-2 bg-gradient-to-r from-[#7ebda3] to-[#b9e2d8] rounded-full text-black font-bold font-tech-upper hover:shadow-2xl hover:shadow-[#b9e2d8]/40 transition-all duration-500 relative overflow-hidden group animate-gradient-x text-base"
              >
                <span className="relative z-10">{t.nav.contact}</span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
              </a>
              <button
                onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
                className="text-[#EAD7D7] hover:text-[#7EBDA3] transition-all duration-500 font-tech-upper text-base font-medium"
              >
                {language === 'fr' ? 'EN' : 'FR'}
              </button>
            </div>
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-[#EAD7D7] hover:text-[#7EBDA3] transition-colors duration-500">
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
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="md:hidden bg-[#1a2327]/95 backdrop-blur-xl shadow-xl"
        >
          <div className="px-6 py-8 space-y-4">
            <a href="#" className="block px-4 py-3 text-[#EAD7D7] hover:text-[#7EBDA3] transition-colors duration-500 font-tech-upper text-base font-medium">
              {t.nav.home}
            </a>
            <a href="#expertise" className="block px-4 py-3 text-[#EAD7D7] hover:text-[#7EBDA3] transition-colors duration-500 font-tech-upper text-base font-medium">
              {t.nav.expertise}
            </a>
            <a href="#contact" className="block px-4 py-3 text-[#EAD7D7] hover:text-[#7EBDA3] transition-colors duration-500 font-tech-upper text-base font-medium">
              {t.nav.contact}
            </a>
            <button
              onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
              className="block px-4 py-3 text-[#EAD7D7] hover:text-[#7EBDA3] transition-colors duration-500 font-tech-upper text-base font-medium"
            >
              {language === 'fr' ? 'EN' : 'FR'}
            </button>
          </div>
        </motion.div>
      )}

      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen flex items-center justify-center px-6 pt-16 pb-32"
      >
        <div className="absolute inset-0 bg-gradient-radial from-[#243238]/60 to-transparent opacity-70 transition-colors duration-1000"></div>
        <div className="relative z-10 text-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          >
            <RiveLogo />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-[#7ebda3] via-[#b9e2d8] to-[#7ebda3] animate-gradient-x font-tech-upper"
          >
            {t.hero.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.6, ease: 'easeOut' }}
            className="text-base md:text-lg text-[#B0B9BB] mb-12 leading-relaxed whitespace-pre-line max-w-3xl mx-auto font-tech"
          >
            {t.hero.subtitle}
          </motion.p>
          <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-6">
            <motion.a
              whileHover={{ scale: 1.03, boxShadow: '0 8px 20px rgba(185,226,216,0.2)' }}
              href="#contact"
              className="inline-block px-8 py-4 bg-gradient-to-r from-[#7ebda3] to-[#b9e2d8] rounded-full text-black font-bold font-tech-upper hover:shadow-2xl transition-all duration-500 relative overflow-hidden group animate-gradient-x text-base"
            >
              <span className="relative z-10">{t.hero.startProject}</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.03, boxShadow: '0 8px 20px rgba(185, 248, 191, 0.2)' }}
              href="#expertise"
              className="inline-block px-8 py-4 border-2 border-[#7EBDA3] text-[#7EBDA3] rounded-full hover:bg-[#7EBDA3]/10 transition-all duration-500 font-bold group font-tech-upper text-base"
            >
              <span className="relative z-10">{t.hero.exploreServices}</span>
            </motion.a>
          </div>
        </div>
      </motion.section>

      <section id="expertise" className="py-32 relative bg-[#1a2327] transition-colors duration-1000">
        <div className="max-w-[1800px] mx-auto px-4 relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            viewport={{ once: true }}
            className="font-tech-upper text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-[#7EBDA3] to-[#7EBDA3] tracking-tighter"
          >
            {t.expertise.title}
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-0 md:px-4 lg:px-10">
            {t.expertise.items.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: index * 0.2, ease: 'easeOut' }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: '0 8px 20px rgba(126,189,163,0.09)',
                  borderColor: "#b9e2d8"
                }}
                className="group p-8 rounded-3xl border border-[#7EBDA3] transition-all duration-500 flex flex-col justify-between min-h-[320px] md:min-w-[280px] lg:min-w-[320px] bg-[#141a1d]/96"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-6">
                    {index === 0 && <Cloud className="w-12 h-12 text-[#7EBDA3]" />}
                    {index === 1 && <BarChart className="w-12 h-12 text-[#7EBDA3]" />}
                    {index === 2 && <Code className="w-12 h-12 text-[#7EBDA3]" />}
                  </div>
                  <h3 className="font-tech-upper text-xl mb-5 text-[#7EBDA3]">
                    {exp.title}
                  </h3>
                  <p className="font-tech text-[#B0B9BB] text-xs group-hover:text-white transition-colors duration-300 leading-relaxed">
                    {exp.description}
                  </p>
                </div>
                {index === 1 && (
                  <a
                    href="https://www.economytimelapse.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 border-2 rounded-full transition-all duration-500 font-tech-upper text-base text-center mt-6 see-project-btn"
                    style={{
                      borderColor: YELLOW,
                      color: YELLOW,
                    }}
                  >
                    <span className="relative z-10">{t.workExample}</span>
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 relative bg-gradient-to-br from-[#121c22] via-[#0d161d] to-[#1a2327] transition-colors duration-1000 overflow-hidden">
        <div className="absolute top-1/3 left-1/5 w-80 h-80 bg-gradient-to-br from-[#7EBDA3]/40 to-transparent rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob"></div>
        <div className="absolute bottom-1/3 right-1/5 w-80 h-80 bg-gradient-to-tl from-[#7EBDA3]/20 to-transparent rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            viewport={{ once: true }}
            className="font-tech-upper text-4xl font-bold text-center mb-10 bg-clip-text text-transparent bg-gradient-to-r from-[#7EBDA3] to-[#7EBDA3] tracking-tighter"
          >
            {t.techStack.title}
          </motion.h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {['Salesforce', 'CPQ', 'Apex', 'Flow', 'LWC', 'SQL', 'Tableau', 'CRM Analytics', 'JSON', 'JavaScript'].map((tech, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.07, boxShadow: '0 8px 22px rgba(126,189,163,0.18)' }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.06, ease: 'easeOut' }}
                viewport={{ once: true }}
                className="flex items-center justify-center h-16 px-4 py-2 rounded-3xl bg-[#141a1d]/80 backdrop-blur-xl border border-[#7EBDA3]/30 hover:bg-[#7EBDA3]/7 transition-all duration-500 text-white text-sm font-tech-upper"
              >
                <span className="relative z-10 text-[#7EBDA3]">{tech}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-32 relative bg-[#1a2327] transition-colors duration-1000">
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            viewport={{ once: true }}
            className="font-tech-upper text-4xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#7EBDA3] to-[#7EBDA3] tracking-tighter"
          >
            {t.contact.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
            viewport={{ once: true }}
            className="font-tech text-base text-center text-[#B0B9BB] mb-12"
          >
            {t.contact.subtitle}
          </motion.p>
          <div className="flex justify-center space-x-8">
            <motion.a
              whileHover={{ scale: 1.09, boxShadow: '0 10px 20px rgba(126,189,163,0.19)' }}
              href="https://calendly.com/lucas-massoni-contact"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-full bg-[#141a1d]/90 backdrop-blur-xl border border-[#7EBDA3]/40 hover:border-[#7EBDA3]/80 transition-all duration-500 group"
            >
              <Calendar size={24} className="text-[#7EBDA3] group-hover:text-[#b9e2d8] transition-colors duration-500" />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.09, boxShadow: '0 10px 20px rgba(126,189,163,0.19)' }}
              href="https://www.linkedin.com/in/lucas-massoni/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-full bg-[#141a1d]/90 backdrop-blur-xl border border-[#7EBDA3]/40 hover:border-[#7EBDA3]/80 transition-all duration-500 group"
            >
              <Linkedin size={24} className="text-[#7EBDA3] group-hover:text-[#b9e2d8] transition-colors duration-500" />
            </motion.a>
          </div>
        </div>
      </section>

      <footer className="py-8 relative bg-[#1a2327] border-t border-[#7EBDA3]/20 transition-colors duration-1000">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#7EBDA3]/30 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center text-[#B0B9BB] group transition-colors duration-500">
            <p className="transition-all duration-500 group-hover:text-[#7EBDA3] font-tech text-base">
              {t.footer.replace('{year}', new Date().getFullYear())}
            </p>
          </div>
        </div>
      </footer>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
        html { scroll-behavior: smooth; }
        body {
          background: linear-gradient(180deg, #1a2327 0%, #0d161d 100%);
          font-family: 'Share Tech Mono', Menlo, monospace !important;
          font-size: 75% !important;
        }
        .font-tech { font-family: 'Share Tech Mono', Menlo, monospace; letter-spacing: 0.11em; font-size: 0.75em; text-transform: none; }
        .font-tech-upper { font-family: 'Share Tech Mono', Menlo, monospace; text-transform: uppercase; letter-spacing: 0.13em; font-size: 0.75em; }
        .see-project-btn:hover { background: rgba(254,207,86,0.09) !important; color: #FECF56 !important; border-color: #FECF56 !important; }
        .animate-gradient-x { background-size: 200% 200%; animation: gradient-x 12s ease infinite; }
        @keyframes gradient-x { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes grid { 0% { transform: translateY(0); } 100% { transform: translateY(-60px); } }
        @keyframes blob { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(40px, -60px) scale(1.2); } 66% { transform: translate(-30px, 30px) scale(0.8); } 100% { transform: translate(0px, 0px) scale(1); } }
        .animate-blob { animation: blob 8s infinite cubic-bezier(0.6, 0.4, 0.4, 0.9); }
        .animation-delay-2000 { animation-delay: 2s; }
        section { scroll-margin-top: 80px; }
      `}</style>
    </div>
  );
};

export default HomePage;
