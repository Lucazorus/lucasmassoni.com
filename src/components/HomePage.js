"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Mail, Github, Linkedin, Code, Cloud, BarChart, Calendar1 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";
import { Analytics } from "@vercel/analytics/react";

const translations = {
  fr: {
    name: "Lucas Massoni",
    nav: {
      home: "Accueil",
      expertise: "Expertise",
      contact: "Contact",
    },
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
    techStack: {
      title: "Stack Technique",
    },
    contact: {
      title: "Contact",
      subtitle: "Transformons vos idées en réalité",
    },
    footer: "© {year} Lucas Massoni. Expert Salesforce Freelance",
  },
  en: {
    name: "Lucas Massoni",
    nav: {
      home: "Home",
      expertise: "Expertise",
      contact: "Contact",
    },
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
    techStack: {
      title: "Tech Stack",
    },
    contact: {
      title: "Contact",
      subtitle: "Let's turn your ideas into reality",
    },
    footer: "© {year} Lucas Massoni. Freelance Salesforce Expert",
  },
};

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [language, setLanguage] = useState('fr');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const t = translations[language];
  const colors = {
    background: '#1a2327',
    backgroundSecondary: '#141a1d',
    text: '#EAD7D7',
    textHighlight: '#D5FFD9',
    accent: '#70A0AF',
    accentSecondary: '#D5FFD9',
    gridColor: 'rgba(26,35,39,0.9)',
    subtleAccentColor: '#ffcf56',
  };

  const theme = {
    navBg: 'bg-[#1a2327]/70',
    textColor: 'text-[#EAD7D7]',
    textHighlightColor: 'text-[#D5FFD9]',
    accentColor: 'text-[#70A0AF]',
    accentSecondaryColor: 'text-[#D5FFD9]',
    border: 'border-[#70A0AF]/20',
    borderHover: 'hover:border-[#D5FFD9]/50',
    bgPrimary: 'bg-[#1a2327]',
    bgSecondary: 'bg-[#141a1d]',
    gradientFrom: 'from-[#70A0AF]',
    gradientTo: 'to-[#D5FFD9]',
    fromAccent: 'from-[#679aa9]',
    viaAccent: 'via-[#67a99a]',
    toAccent: 'to-[#b9f8bf]',
    hoverShadow: 'hover:shadow-[#b9f8bf]/20'
  };

  const expertiseIcons = [
    <Cloud className="w-16 h-16 mb-4 text-[#70A0AF] group-hover:text-[#D5FFD9] transition-colors duration-300" />,
    <BarChart className="w-16 h-16 mb-4 text-[#70A0AF] group-hover:text-[#D5FFD9] transition-colors duration-300" />,
    <Code className="w-16 h-16 mb-4 text-[#70A0AF] group-hover:text-[#D5FFD9] transition-colors duration-300" />
  ];

  const StaticHeaderLogo = () => {
    const { RiveComponent } = useRive({
      src: '/logo.riv',
      stateMachines: 'SMLogoStatic',
      autoplay: true,
      layout: new Layout({
        fit: Fit.Contain,
        alignment: Alignment.Center,
      }),
      backgroundColor: 'transparent',
    });

    return (
      <div className="w-8 h-8 mr-2">
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
      layout: new Layout({
        fit: Fit.Contain,
        alignment: Alignment.Center,
      }),
      backgroundColor: 'transparent',
      onLoad: () => {
        if (rive) {
          setRiveInstance(rive);
        }
      }
    });

    useEffect(() => {
      const currentContainer = containerRef.current;
      const stopPropagation = (e) => {
        e.stopPropagation();
      };

      const handleScroll = () => {
        if (currentContainer) {
          currentContainer.style.willChange = 'transform';
          if (riveInstance && riveInstance.isPaused) {
            riveInstance.play();
          }
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
      <div ref={containerRef} className="w-64 h-64 mx-auto mb-6 relative z-10 mt-24 will-change-transform">
        <RiveComponent className="w-full h-full" />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#1a2327] text-white relative overflow-hidden transition-colors duration-500">
      <Analytics />
      <div className="absolute inset-0 opacity-20 transition-all duration-500" style={{ background: `linear-gradient(${colors.gridColor} 2px,transparent 2px), linear-gradient(90deg, ${colors.gridColor} 2px,transparent 2px)`, backgroundSize: '40px 40px', animation: 'grid 7s linear infinite' }}></div>

      <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-[#1a2327] shadow-lg' : 'bg-[#1a2327]'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <StaticHeaderLogo />
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#c3dee6] to-[#d7f3d9] [text-shadow:0_0_20px_rgba(213,255,217,0.5)]">
                {t.name}
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#accueil" className="text-[#EAD7D7] hover:text-[#D5FFD9] transition-all duration-300 relative group">
                {t.nav.home}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#70A0AF] to-[#D5FFD9] transition-all duration-300 group-hover:w-full"></span>
                <span className="absolute inset-0 bg-gradient-to-r from-[#70A0AF]/5 to-[#D5FFD9]/5 opacity-0 rounded group-hover:opacity-100 -z-10 transition-all duration-300 transform scale-110 group-hover:scale-100"></span>
              </a>
              <a href="#expertise" className="text-[#EAD7D7] hover:text-[#D5FFD9] transition-all duration-300 relative group">
                {t.nav.expertise}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#70A0AF] to-[#D5FFD9] transition-all duration-300 group-hover:w-full"></span>
                <span className="absolute inset-0 bg-gradient-to-r from-[#70A0AF]/5 to-[#D5FFD9]/5 opacity-0 rounded group-hover:opacity-100 -z-10 transition-all duration-300 transform scale-110 group-hover:scale-100"></span>
              </a>
              <a href="#contact" className="px-5 py-2 bg-gradient-to-r from-[#679aa9] via-[#67a99a] to-[#b9f8bf] rounded-lg text-black hover:shadow-lg hover:shadow-[#b9f8bf]/20 transition-all duration-300 relative overflow-hidden group animate-gradient-x">
                <span className="relative z-10">{t.nav.contact}</span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </a>
              <button onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')} className="text-[#EAD7D7] hover:text-[#ffcf56] transition-colors duration-300">
                {language === 'fr' ? 'EN' : 'FR'}
              </button>
            </div>
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-[#EAD7D7]">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="md:hidden bg-[#1a2327] transition-colors duration-500">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a href="#accueil" className="block px-3 py-2 text-[#EAD7D7] hover:text-[#D5FFD9] transition-colors duration-300">{t.nav.home}</a>
            <a href="#expertise" className="block px-3 py-2 text-[#EAD7D7] hover:text-[#D5FFD9] transition-colors duration-300">{t.nav.expertise}</a>
            <a href="#contact" className="block px-3 py-2 text-[#EAD7D7] hover:text-[#D5FFD9] transition-colors duration-300">{t.nav.contact}</a>
            <button onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')} className="block px-3 py-2 text-[#EAD7D7] hover:text-[#ffcf56] transition-colors duration-300">
              {language === 'fr' ? 'EN' : 'FR'}
            </button>
          </div>
        </div>
      )}

      <div className="relative min-h-[100vh] flex items-center justify-center px-4 pb-32 pt-0">
        <div className="absolute inset-0 bg-gradient-radial from-[#243238] to-transparent opacity-50 transition-colors duration-500"></div>
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mt-0"
          >
            <RiveLogo />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-6xl md:text-8xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#679aa9] via-[#67a99a] to-[#b9f8bf] [text-shadow:0_0_30px_rgba(213,255,217,0.3)] animate-gradient-x transition-all duration-500"
          >
            {t.hero.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-xl md:text-2xl text-[#EAD7D7] mb-12 leading-relaxed opacity-0 animate-fade-in transition-colors duration-500 whitespace-pre-line"
          >
            {t.hero.subtitle}
          </motion.p>
          <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-6">
            <motion.a
              whileHover={{ scale: 1.05 }}
              href="#contact"
              className="inline-block px-8 py-4 bg-gradient-to-r from-[#679aa9] via-[#67a99a] to-[#b9f8bf] rounded-lg text-black hover:shadow-lg hover:shadow-[#b9f8bf]/20 transition-all duration-300 transform font-medium relative overflow-hidden group animate-gradient-x"
            >
              <span className="relative z-10">{t.hero.startProject}</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              href="#expertise"
              className="inline-block px-8 py-4 border border-[#ffcf56] text-[#ffcf56] rounded-lg hover:bg-[#ffcf56]/10 transition-all duration-300 transform font-medium group"
            >
              <span className="relative z-10">{t.hero.exploreServices}</span>
            </motion.a>
          </div>
        </div>
      </div>

      <div id="expertise" className="pt-32 pb-32 relative bg-white transition-colors duration-500">
        <div className="absolute inset-0 bg-[#1a2327] pointer-events-none h-0 top-0"></div>
        <div className="max-w-full px-6 relative z-10">
          <h2 className="text-5xl font-bold text-center mb-20 bg-clip-text text-transparent bg-gradient-to-r from-[#70A0AF] to-[#3CB371] [text-shadow:0_0_20px_rgba(60,179,113,0.3)] transition-all duration-500">{t.expertise.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-12 lg:px-24">
            {t.expertise.items.map((exp, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                className="group p-10 md:p-12 min-h-[320px] md:min-h-[380px] rounded-2xl bg-white shadow-lg border border-gray-200 hover:border-[#3CB371]/50 transition-all duration-500 backdrop-blur-sm hover:shadow-lg hover:shadow-[#3CB371]/10 flex flex-col justify-center"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-6 transform transition-all duration-300 group-hover:scale-110">
                    {index === 0 && <Cloud className="w-16 h-16 mb-4 text-[#70A0AF] group-hover:text-[#3CB371] transition-colors duration-300" />}
                    {index === 1 && <BarChart className="w-16 h-16 mb-4 text-[#70A0AF] group-hover:text-[#3CB371] transition-colors duration-300" />}
                    {index === 2 && <Code className="w-16 h-16 mb-4 text-[#70A0AF] group-hover:text-[#3CB371] transition-colors duration-300" />}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-6 text-[#70A0AF] group-hover:text-[#3CB371] transition-colors duration-300">{exp.title}</h3>
                  <p className="text-gray-700 text-lg md:text-xl group-hover:text-gray-900 transition-colors duration-300 max-w-md mx-auto">{exp.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-32 relative bg-gradient-to-br from-[#121c22] via-[#0d161d] to-[#1a2327] transition-colors duration-500 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-br from-[#4f3d7a] to-transparent rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gradient-to-tl from-[#2d6187] to-transparent rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <h2 className="text-5xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-[#ffcf56] to-[#ffcf56] [text-shadow:0_0_20px_rgba(255,207,86,0.3)] transition-all duration-500">
            {t.techStack.title}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 max-w-5xl mx-auto">
            {['Salesforce', 'CPQ', 'Apex', 'Flow', 'LWC', 'SQL', 'Tableau', 'CRM Analytics', 'JSON', 'JavaScript'].map((tech, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(0,0,0,0.3), 0 5px 10px rgba(0,0,0,0.2)' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
                className={`
                  macos-widget-badge flex items-center justify-center h-20 px-4 py-3 rounded-2xl
                  bg-white/10 border border-[#ffcf56]/20 backdrop-blur-xl
                  text-white text-lg font-medium shadow-xl
                  transition-all duration-300 hover:bg-white/20
                  relative overflow-hidden group cursor-pointer
                `}
              >
                <div className={`
                  absolute inset-0 rounded-2xl pointer-events-none
                  shadow-[inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-1px_0_rgba(0,0,0,0.1)]
                `}></div>
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-200 group-hover:from-[#ffcf56] group-hover:to-[#ffcf56] transition-colors duration-300">
                  {tech}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div id="contact" className="py-32 relative bg-white transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <h2 className="text-5xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-[#70A0AF] to-[#3CB371] mb-6 [text-shadow:0_0_20px_rgba(60,179,113,0.3)] transition-all duration-500">{t.contact.title}</h2>
          <p className="text-xl text-center text-gray-700 mb-16 transition-colors duration-500">{t.contact.subtitle}</p>
          <div className="flex justify-center space-x-8">
            <motion.a whileHover={{ scale: 1.1 }} href="https://calendly.com/lucas-massoni-contact" target="_blank" rel="noopener noreferrer" className="p-4 rounded-full bg-white shadow-md border border-gray-200 hover:border-[#ffcf56]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#ffcf56]/10 group">
              <Calendar1 size={28} className="text-[#70A0AF] group-hover:text-[#ffcf56] transition-colors duration-300" />
            </motion.a>
            <motion.a whileHover={{ scale: 1.1 }} href="https://www.linkedin.com/in/lucas-massoni/" target="_blank" rel="noopener noreferrer" className="p-4 rounded-full bg-white shadow-md border border-gray-200 hover:border-[#ffcf56]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#ffcf56]/10 group">
              <Linkedin size={28} className="text-[#70A0AF] group-hover:text-[#ffcf56] transition-colors duration-300" />
            </motion.a>
          </div>
        </div>
      </div>

      <footer className="py-8 relative bg-white border-t border-gray-200 transition-colors duration-500">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ffcf56]/30 to-transparent transition-colors duration-500"></div>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center text-gray-400 relative group transition-colors duration-500">
            <p className="transition-all duration-300 group-hover:text-gray-600">
              {t.footer.replace('{year}', new Date().getFullYear())}
            </p>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-10px) scale(1.05); }
        }
        @keyframes grid { 0% { transform: translateY(0); } 100% { transform: translateY(-40px); } }
        @keyframes gradient-x { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes fade-in { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
        .animate-gradient-x { background-size: 200% 200%; animation: gradient-x 15s ease infinite; }
        .animate-fade-in { animation: fade-in 1s ease-out forwards; }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite cubic-bezier(0.6, 0.4, 0.4, 0.9);
        }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </div>
  );
};

export default HomePage;
