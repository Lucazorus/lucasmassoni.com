"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  MotionConfig,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Analytics } from "@vercel/analytics/react";
import { Calendar, Linkedin, ArrowUpRight, Check } from "lucide-react";

import PipelineViz from "./PipelineViz";
import RiveLogo from "./RiveLogo";
import SiteNav from "./SiteNav";
import SiteFooter from "./SiteFooter";
import { ChainViz, VIZ } from "./ServiceViz";
import { translations } from "./translations";

const EASE = [0.22, 1, 0.36, 1];
const LOADER_MS = 1200;

function AppStoreGlyph({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Briques de mouvement : sobres, une seule fois, courtes
// ---------------------------------------------------------------------------
function Reveal({ children, className, delay = 0, as = "div" }) {
  const Tag = motion[as] || motion.div;
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.6, ease: EASE, delay }}
    >
      {children}
    </Tag>
  );
}

function useCountUp(target, start, duration = 1200) {
  const [v, setV] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!start) return;
    if (reduced) { setV(target); return; }
    let raf = 0;
    const t0 = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - t0) / duration);
      const e = 1 - Math.pow(1 - p, 3);
      setV(Math.round(target * e));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, start, duration, reduced]);
  return v;
}

function Fact({ value, suffix, label, start }) {
  const n = useCountUp(value, start);
  return (
    <li className="fact">
      <span className="fact-value">{n}<em>{suffix}</em></span>
      <span className="fact-label">{label}</span>
    </li>
  );
}

// Inclinaison 3D discrète qui suit le curseur
function Tilt({ children, className }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const sx = useSpring(rx, { stiffness: 110, damping: 20, mass: 0.6 });
  const sy = useSpring(ry, { stiffness: 110, damping: 20, mass: 0.6 });

  const onMove = (e) => {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * 6);
    rx.set(-py * 5);
  };
  const onLeave = () => { rx.set(0); ry.set(0); };

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: sx, rotateY: sy, transformStyle: "preserve-3d" }}
    >
      {children}
    </motion.div>
  );
}

function SectionHead({ label, title, lead, id }) {
  return (
    <Reveal className="section-head">
      <p className="section-label" id={id}>{label}</p>
      <h2 className="display display-lg">{title}</h2>
      {lead && <p className="lead">{lead}</p>}
    </Reveal>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function HomePage() {
  const [lang, setLang] = useState("fr");
  const [loaded, setLoaded] = useState(false);
  const [linked, setLinked] = useState(null);
  const { ref: stageRef, inView: stageInView } = useInView({ threshold: 0.15 });

  const t = translations[lang];

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), LOADER_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => { document.documentElement.lang = lang; }, [lang]);

  const toggleLang = () => setLang((l) => (l === "fr" ? "en" : "fr"));

  const rise = (delay) => ({
    initial: { y: "110%" },
    animate: loaded ? { y: 0 } : { y: "110%" },
    transition: { duration: 0.9, ease: EASE, delay },
  });
  const fade = (delay, y = 14) => ({
    initial: { opacity: 0, y },
    animate: loaded ? { opacity: 1, y: 0 } : { opacity: 0, y },
    transition: { duration: 0.7, ease: EASE, delay },
  });

  const navItems = [
    { href: "#services", label: t.nav.services },
    { href: "#approche", label: t.nav.approach },
    { href: "#stack", label: t.nav.stack },
    { href: "/guides", label: t.nav.guides },
  ];

  return (
    <MotionConfig reducedMotion="user">
      <Analytics />

      <AnimatePresence>
        {!loaded && (
          <motion.div
            key="loader"
            className="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            aria-hidden="true"
          >
            <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: EASE }}>
              <RiveLogo className="loader-logo" playIntro introMs={LOADER_MS} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <SiteNav t={t} lang={lang} onToggleLang={toggleLang} items={navItems} />

      <main id="top">
        {/* ── Hero ────────────────────────────────────────────────────────── */}
        <section className="hero">
          <div className="hero-bg" aria-hidden="true" />
          <div className="container hero-grid">
            <div className="hero-copy">
              <motion.p className="status" {...fade(0.05, 8)}>
                <i aria-hidden="true" />{t.hero.availability}
              </motion.p>

              <h1 className="display hero-title">
                {t.hero.title.map((line, i) => (
                  <span className="line-mask" key={line}>
                    <motion.span {...rise(0.1 + i * 0.1)}>{line}</motion.span>
                  </span>
                ))}
              </h1>

              <motion.p className="lead hero-sub" {...fade(0.4)}>{t.hero.subtitle}</motion.p>

              <motion.p className="meta" {...fade(0.48)}>{t.hero.meta}</motion.p>

              <motion.div className="hero-actions" {...fade(0.55)}>
                <a href="#contact" className="btn btn-primary btn-lg">{t.hero.ctaPrimary}</a>
                <a href="#services" className="btn btn-secondary btn-lg">{t.hero.ctaSecondary}</a>
              </motion.div>

              <motion.ul className="facts" {...fade(0.68)}>
                {t.hero.facts.map((f) => (
                  <Fact key={f.label} value={f.value} suffix={f.suffix} label={f.label} start={loaded} />
                ))}
              </motion.ul>
            </div>

            <motion.div className="hero-stage-wrap" ref={stageRef} {...fade(0.3, 24)}>
              <Tilt className="stage">
                <div className="stage-inner" role="img" aria-label={t.hero.stageCaption}>
                  <PipelineViz active={loaded && stageInView} lang={lang} L={t.pipe} />
                </div>
              </Tilt>
              <p className="hero-caption">{t.hero.stageCaption}</p>
            </motion.div>
          </div>
        </section>

        {/* ── Services ────────────────────────────────────────────────────── */}
        <section id="services" className="section" aria-labelledby="services-label">
          <div className="container">
            <SectionHead id="services-label" label={t.nav.services} title={t.services.title} lead={t.services.lead} />

            <Reveal>
              <ChainViz t={t} linked={linked} setLinked={setLinked} />
            </Reveal>

            <div className="bento">
              {t.services.items.map((s, i) => {
                const Viz = VIZ[s.key];
                const isMobile = s.key === "mobile";
                return (
                  <Reveal
                    key={s.key}
                    as="article"
                    className={`card card-${s.key}${linked === s.key ? " is-linked" : ""}`}
                    delay={(i % 3) * 0.06}
                  >
                    <div onMouseEnter={() => setLinked(s.key)} onMouseLeave={() => setLinked(null)} className="card-hit">
                      {!isMobile && <div className="card-viz"><Viz L={t.viz} /></div>}
                      <div className="card-body">
                        <h3 className="card-title">{s.title}</h3>
                        <p>{s.desc}</p>
                        {s.deliverables && (
                          <div className="deliverables">
                            <span className="deliverables-label">{t.approach.deliverablesLabel}</span>
                            <ul>
                              {s.deliverables.map((d) => (
                                <li key={d}><Check size={14} strokeWidth={2.25} aria-hidden="true" />{d}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {s.tag && <span className="tag">{s.tag}</span>}
                      </div>
                      {isMobile && (
                        <ul className="products">
                          {t.products.items.map((p) => (
                            <li className="product" key={p.key}>
                              <a href={p.url} target="_blank" rel="noopener noreferrer" className="product-link" aria-label={`${p.name}, ${p.host}`}>
                                <span className="product-shot">
                                  {p.image ? <Image src={p.image} alt="" fill sizes="(min-width: 1080px) 22vw, (min-width: 640px) 44vw, 92vw" /> : <AppStoreGlyph size={24} />}
                                </span>
                                <span className="product-meta">
                                  <span className="product-name">{p.name}</span>
                                  <span className="product-host">{p.host}</span>
                                </span>
                                <ArrowUpRight size={16} className="product-arrow" aria-hidden="true" />
                              </a>
                              {p.store && (
                                <a href={p.store} target="_blank" rel="noopener noreferrer" className="product-store" aria-label={p.storeLabel}>
                                  <AppStoreGlyph size={12} />{p.storeLabel}
                                </a>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Approche ────────────────────────────────────────────────────── */}
        <section id="approche" className="section section-rule" aria-labelledby="approche-label">
          <div className="container">
            <SectionHead id="approche-label" label={t.nav.approach} title={t.approach.title} lead={t.approach.lead} />
            <ol className="steps">
              {t.approach.steps.map((st, i) => (
                <Reveal as="li" key={st.title} className="step" delay={i * 0.08}>
                  <span className="step-n mono">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="step-title">{st.title}</h3>
                  <p>{st.desc}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* ── Stack ───────────────────────────────────────────────────────── */}
        <section id="stack" className="section section-rule" aria-labelledby="stack-label">
          <div className="container">
            <SectionHead id="stack-label" label={t.nav.stack} title={t.stack.title} lead={t.stack.lead} />
            <div className="stack">
              {t.stack.groups.map((g, gi) => (
                <Reveal key={g.title} className="stack-group" delay={gi * 0.05}>
                  <h3 className="stack-title">{g.title}</h3>
                  <ul className="tiles">
                    {g.items.map((item) => (
                      <li className="tile" key={item.name}>
                        <span className="tile-name mono">{item.name}</span>
                        <span className="tile-desc">{item.desc}</span>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Contact ─────────────────────────────────────────────────────── */}
        <section id="contact" className="section section-rule contact" aria-labelledby="contact-label">
          <div className="container contact-grid">
            <Reveal className="contact-copy">
              <p className="section-label" id="contact-label">{t.nav.contact}</p>
              <h2 className="display display-xl">{t.contact.title}</h2>
              <p className="lead">{t.contact.subtitle}</p>
            </Reveal>
            <Reveal className="contact-panel" delay={0.1}>
              <p className="status"><i aria-hidden="true" />{t.hero.availability}</p>
              <div className="contact-actions">
                <a href="https://calendly.com/lucas-massoni-contact" className="btn btn-primary btn-lg" target="_blank" rel="noopener noreferrer">
                  <Calendar size={16} />{t.contact.calendly}
                </a>
                <a href="https://www.linkedin.com/in/lucas-massoni/" className="btn btn-secondary btn-lg" target="_blank" rel="noopener noreferrer">
                  <Linkedin size={16} />{t.contact.linkedin}
                </a>
              </div>
              <p className="contact-note">{t.contact.note}</p>
            </Reveal>
          </div>
        </section>

        <SiteFooter t={t} items={navItems} />
      </main>
    </MotionConfig>
  );
}
