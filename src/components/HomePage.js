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
  useTransform,
  useReducedMotion,
  animate,
} from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Analytics } from "@vercel/analytics/react";
import { Linkedin, Instagram, ArrowUpRight, ArrowDown, ArrowLeft, ArrowRight, Check, Database, Clapperboard } from "lucide-react";

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
const IG_URL = "https://www.instagram.com/ca_compte_/";

// Vidéo Ça compte hébergée dans /public, lue en boucle sans le son.
const INSTA_REEL = { src: "/instagram/reel.mp4", poster: "/instagram/reel-poster.jpg" };

// Patchwork des projets : la vidéo Ça compte, les deux applis et Spokedia.
const COLLAGE_KEYS = ["fredon", "anima", "spokedia"];

// `interactive` : chaque vignette est un lien (le site, ou le compte Instagram pour la vidéo)
// et grandit au survol. Sans, le patchwork n'est qu'un décor (écran d'entrée).
function Collage({ t, className = "", interactive = false }) {
  const reduced = useReducedMotion();
  const byKey = Object.fromEntries(t.products.items.map((p) => [p.key, p]));
  const Tile = interactive ? "a" : "div";
  const link = (href, label) => (interactive ? { href, target: "_blank", rel: "noopener noreferrer", "aria-label": label, draggable: false } : {});
  const label = (text, Icon) =>
    interactive && (
      <span className="collage-label" aria-hidden="true">
        {Icon && <Icon size={13} />}{text}<ArrowUpRight size={13} />
      </span>
    );

  return (
    <div className={`collage${interactive ? " is-interactive" : ""} ${className}`} aria-hidden={interactive ? undefined : "true"}>
      <Tile className="collage-tile tile-video" {...link(IG_URL, t.creation.ctaSecondary)}>
        <video src={INSTA_REEL.src} poster={INSTA_REEL.poster} autoPlay={!reduced} muted loop playsInline preload="auto" />
        {label("Ça compte", Instagram)}
      </Tile>
      {COLLAGE_KEYS.filter((k) => byKey[k]).map((k) => {
        const p = byKey[k];
        return (
          <Tile key={k} className={`collage-tile tile-${k}`} {...link(p.url, `${p.name}, ${p.host}`)}>
            <Image src={p.image} alt="" fill sizes="(min-width: 720px) 30vw, 50vw" draggable={false} />
            {label(p.name)}
          </Tile>
        );
      })}
    </div>
  );
}

// Patchwork du côté systèmes d'information : les schémas déjà présents sur le site,
// le pipeline de données en grand, trois visuels des cartes de services à côté.
const SCHEMA_KEYS = ["migration", "analytics", "cpq"];

function SchemaCollage({ t, lang }) {
  return (
    <div className="collage gate-collage gate-schemas" aria-hidden="true">
      <div className="collage-tile schema-tile tile-video">
        <PipelineViz active lang={lang} L={t.pipe} />
      </div>
      {SCHEMA_KEYS.map((k, i) => {
        const Viz = VIZ[k];
        return (
          <div key={k} className={`collage-tile schema-tile tile-s${i}`}>
            <Viz L={t.viz} />
          </div>
        );
      })}
    </div>
  );
}

// Sélecteur des deux activités : systèmes d'information ou création.
const MODES = [
  { key: "si", Icon: Database },
  { key: "creation", Icon: Clapperboard },
];

function ModeSwitch({ t, mode, onChange }) {
  return (
    <div className="mode-switch" role="group" aria-label={t.modes.label}>
      {MODES.map(({ key, Icon }) => {
        const on = mode === key;
        return (
          <button key={key} type="button" className={`mode-opt${on ? " is-on" : ""}`} aria-pressed={on} onClick={() => onChange(key)}>
            {on && <motion.span layoutId="mode-pill" className="mode-pill" transition={{ type: "spring", stiffness: 420, damping: 36 }} />}
            <span className="mode-title"><Icon size={15} aria-hidden="true" />{t.modes[key].title}</span>
            <span className="mode-sub">{t.modes[key].sub}</span>
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Écran d'entrée : la page coupée en deux, un univers de chaque côté.
// Survol : le côté visé passe à 60/40. Clic : il prend tout l'écran, puis le site s'ouvre.
// ---------------------------------------------------------------------------
const GATE_OPEN_MS = 700;

function Gate({ t, lang, onToggleLang, onChoose }) {
  const reduced = useReducedMotion();
  const [hover, setHover] = useState(null);
  const [chosen, setChosen] = useState(null);
  const active = chosen || hover;

  const grow = (k) => (chosen ? (chosen === k ? 1 : 0) : active ? (active === k ? 3 : 2) : 1);

  const choose = (k) => {
    if (chosen) return;
    setChosen(k);
    setTimeout(() => onChoose(k), reduced ? 0 : GATE_OPEN_MS);
  };

  const sides = [
    { key: "si", Icon: Database, title: t.hero.title, desc: t.gate.si },
    { key: "creation", Icon: Clapperboard, title: t.creation.title, desc: t.gate.creation },
  ];

  return (
    <motion.div
      className="gate"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: EASE }}
    >
      <div className="gate-top">
        <span className="gate-brand">
          <RiveLogo className="brand-logo" />
          <span className="brand-name">{t.name}</span>
        </span>
        <span className="gate-hint">{t.gate.hint}</span>
        <button type="button" className="lang-toggle" onClick={onToggleLang} title={t.nav.switchLang} aria-label={t.nav.switchLang}>
          <span className={lang === "fr" ? "is-current" : ""}>FR</span>
          <span className="lang-sep" aria-hidden="true" />
          <span className={lang === "en" ? "is-current" : ""}>EN</span>
        </button>
      </div>

      {sides.map(({ key, Icon, title, desc }) => (
        <motion.button
          key={key}
          type="button"
          className={`gate-side gate-${key}${active === key ? " is-active" : ""}${active && active !== key ? " is-dim" : ""}`}
          initial={false}
          animate={{ flexGrow: grow(key) }}
          transition={{ duration: reduced ? 0 : 0.7, ease: EASE }}
          onMouseEnter={() => setHover(key)}
          onMouseLeave={() => setHover(null)}
          onFocus={() => setHover(key)}
          onBlur={() => setHover(null)}
          onClick={() => choose(key)}
          aria-label={`${t.modes[key].title} : ${t.modes[key].sub}`}
        >
          {key === "creation" ? <Collage t={t} className="gate-collage" /> : <SchemaCollage t={t} lang={lang} />}
          <span className="gate-shade" aria-hidden="true" />
          <span className="gate-content">
            <span className="gate-kicker"><Icon size={16} aria-hidden="true" />{t.modes[key].title}</span>
            <span className="display gate-title">
              {title.map((line) => <span key={line}>{line}</span>)}
            </span>
            <span className="gate-desc">{desc}</span>
            <span className="gate-cta">{t.gate.enter}<ArrowRight size={18} aria-hidden="true" /></span>
          </span>
        </motion.button>
      ))}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Roue des produits : le site courant au centre, les autres en cartes derrière.
// Elle tourne sans fin dans les deux sens : après le dernier site, on revient
// au premier en continuant le tour. Flèches, clavier, glisser, clic sur une carte.
// ---------------------------------------------------------------------------
const pad2 = (n) => String(n).padStart(2, "0");
const mod = (a, n) => ((a % n) + n) % n;

function WheelCard({ p, i, step, rot, active, onSelect, movedRef, openLabel }) {
  const angle = useTransform(rot, (r) => ((i * step + r) * Math.PI) / 180);
  // 0 derrière, 1 devant
  const depth = useTransform(angle, (a) => (Math.cos(a) + 1) / 2);
  const x = useTransform(angle, (a) => `${Math.sin(a) * 58}%`);
  const y = useTransform(depth, (d) => `${(1 - d) * -16}%`);
  const scale = useTransform(depth, (d) => 0.5 + 0.5 * Math.pow(d, 1.4));
  const zIndex = useTransform(depth, (d) => Math.round(d * 100));
  const shade = useTransform(depth, (d) => Math.min(0.8, (1 - d) * 1.1));

  const onClick = (e) => {
    if (movedRef.current) { e.preventDefault(); return; }
    if (!active) { e.preventDefault(); onSelect(i); }
  };

  return (
    <motion.a
      href={p.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`wheel-card${active ? " is-active" : ""}`}
      style={{ x, y, scale, zIndex }}
      onClick={onClick}
      tabIndex={active ? 0 : -1}
      aria-hidden={active ? undefined : "true"}
      aria-label={active ? `${openLabel} ${p.host}` : undefined}
      draggable={false}
    >
      <span className="wheel-bar" aria-hidden="true">
        <i /><i /><i />
        <span className="wheel-url">{p.host}</span>
      </span>
      <span className="wheel-shot">
        <Image src={p.image} alt="" fill sizes="(min-width: 720px) 64vw, 86vw" draggable={false} priority={i === 0} />
      </span>
      <motion.span className="wheel-shade" style={{ opacity: shade }} aria-hidden="true" />
    </motion.a>
  );
}

function ProductWheel({ t }) {
  const items = t.products.items;
  const n = items.length;
  const step = 360 / n;
  const reduced = useReducedMotion();
  const [pos, setPos] = useState(0);
  const rot = useMotionValue(0);
  const stageRef = useRef(null);
  const drag = useRef(null);
  const movedRef = useRef(false);
  const index = mod(pos, n);
  const p = items[index];

  const settle = (next) => {
    setPos(next);
    if (reduced) rot.set(-next * step);
    else animate(rot, -next * step, { type: "spring", stiffness: 120, damping: 22, mass: 0.9 });
  };

  // Vers une carte précise : par le chemin le plus court.
  const select = (i) => {
    let d = mod(i - index, n);
    if (d > n / 2) d -= n;
    settle(pos + d);
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); settle(pos + 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); settle(pos - 1); }
  };

  // Glisser : une demi-largeur de scène fait tourner d'un cran.
  const degPerPx = () => step / Math.max(200, (stageRef.current?.clientWidth || 800) * 0.45);
  const onPanStart = () => { drag.current = rot.get(); };
  const onPan = (_, info) => {
    if (drag.current === null) return;
    if (Math.abs(info.offset.x) > 6) movedRef.current = true;
    rot.set(drag.current + info.offset.x * degPerPx());
  };
  const onPanEnd = (_, info) => {
    const v = Math.max(-900, Math.min(900, info.velocity.x));
    const projected = rot.get() + v * degPerPx() * 0.08;
    drag.current = null;
    settle(Math.round(-projected / step));
    setTimeout(() => { movedRef.current = false; }, 0);
  };

  return (
    <div className="wheel" role="region" aria-roledescription={t.products.carousel} aria-label={t.products.title} tabIndex={0} onKeyDown={onKeyDown}>
      <motion.div
        ref={stageRef}
        className="wheel-stage"
        onPanStart={onPanStart}
        onPan={onPan}
        onPanEnd={onPanEnd}
        onPointerDown={() => { movedRef.current = false; }}
        style={{ touchAction: "pan-y" }}
      >
        {items.map((it, i) => (
          <WheelCard key={it.key} p={it} i={i} step={step} rot={rot} active={i === index} onSelect={select} movedRef={movedRef} openLabel={t.products.open} />
        ))}
      </motion.div>

      <div className="wheel-info">
        <button type="button" className="wheel-arrow" onClick={() => settle(pos - 1)} aria-label={t.products.prev}>
          <ArrowLeft size={20} aria-hidden="true" />
        </button>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={p.key}
            className="wheel-text"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: EASE }}
            aria-live="polite"
          >
            <span className="wheel-count mono">{pad2(index + 1)} / {pad2(n)}</span>
            <h3 className="wheel-name">{p.name}</h3>
            <p>{p.desc}</p>
            <div className="wheel-actions">
              <a href={p.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                {t.products.open}<ArrowUpRight size={14} aria-hidden="true" />
              </a>
              {p.store && (
                <a href={p.store} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                  <AppStoreGlyph size={13} />{p.storeLabel}
                </a>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        <button type="button" className="wheel-arrow" onClick={() => settle(pos + 1)} aria-label={t.products.next}>
          <ArrowRight size={20} aria-hidden="true" />
        </button>
      </div>

      <div className="wheel-dots">
        {items.map((it, i) => (
          <button
            key={it.key}
            type="button"
            className={`wheel-dot${i === index ? " is-on" : ""}`}
            onClick={() => select(i)}
            aria-label={it.name}
            aria-current={i === index ? "true" : undefined}
          />
        ))}
      </div>
    </div>
  );
}

const MODE_PARAM = "vue";
const readMode = () => {
  const v = new URLSearchParams(window.location.search).get(MODE_PARAM);
  return v === "si" || v === "creation" ? v : null;
};

export default function HomePage() {
  const [lang, setLang] = useState("fr");
  // boot : chargement · gate : écran d'entrée · site : le site
  const [phase, setPhase] = useState("boot");
  const [linked, setLinked] = useState(null);
  const [mode, setMode] = useState("si");
  const { ref: stageRef, inView: stageInView } = useInView({ threshold: 0.15 });

  const t = translations[lang];
  const isCreation = mode === "creation";
  const loaded = phase === "site";

  // Avec ?vue=si ou ?vue=creation on entre directement dans le site, sinon écran d'entrée.
  useEffect(() => {
    const m = readMode();
    if (!m) { setPhase("gate"); return; }
    setMode(m);
    const timer = setTimeout(() => setPhase("site"), LOADER_MS);
    return () => clearTimeout(timer);
  }, []);

  // Bouton retour du navigateur : revient à l'écran d'entrée, ou à l'univers choisi.
  useEffect(() => {
    const onPop = () => {
      const m = readMode();
      if (m) { setMode(m); setPhase("site"); } else setPhase("gate");
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (phase !== "gate") return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [phase]);

  useEffect(() => { document.documentElement.lang = lang; }, [lang]);

  const toggleLang = () => setLang((l) => (l === "fr" ? "en" : "fr"));

  const enterSite = (next) => {
    setMode(next);
    window.history.pushState(null, "", `/?${MODE_PARAM}=${next}`);
    window.scrollTo(0, 0);
    setPhase("site");
    window.gtag?.("event", "select_activity", { activity: next, source: "gate" });
  };

  const backToGate = () => {
    window.history.pushState(null, "", "/");
    window.scrollTo(0, 0);
    setPhase("gate");
  };

  const changeMode = (next) => {
    if (next === mode) return;
    setMode(next);
    window.history.replaceState(null, "", `/?${MODE_PARAM}=${next}`);
    window.gtag?.("event", "select_activity", { activity: next, source: "switch" });
  };

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
  const swap = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.25, ease: EASE },
  };

  const navItems = isCreation
    ? [
        { href: "#creer", label: t.creation.navCreate },
        { href: "#produits", label: t.nav.products },
      ]
    : [
        { href: "#services", label: t.nav.services },
        { href: "#approche", label: t.nav.approach },
        { href: "#stack", label: t.nav.stack },
        { href: "/guides", label: t.nav.guides },
      ];

  const services = t.services.items.filter((s) => s.key !== "mobile" && s.key !== "content");
  const hero = isCreation ? t.creation : t.hero;

  return (
    <MotionConfig reducedMotion="user">
      <Analytics />

      <AnimatePresence>
        {phase === "gate" && <Gate key="gate" t={t} lang={lang} onToggleLang={toggleLang} onChoose={enterSite} />}
      </AnimatePresence>

      <AnimatePresence>
        {phase === "boot" && (
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

      <SiteNav t={t} lang={lang} onToggleLang={toggleLang} items={navItems} onHome={backToGate} />

      <main id="top">
        {/* ── Hero ────────────────────────────────────────────────────────── */}
        <section className="hero">
          <motion.div className="container mode-bar" {...fade(0, 8)}>
            <ModeSwitch t={t} mode={mode} onChange={changeMode} />
          </motion.div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={mode} className="container hero-grid" {...swap}>
              <div className="hero-copy">
                {isCreation ? (
                  <motion.p className="status" {...fade(0.05, 8)}>
                    <i aria-hidden="true" />{t.creation.kicker}
                  </motion.p>
                ) : (
                  <motion.p className="status" {...fade(0.05, 8)}>
                    <i aria-hidden="true" />{t.hero.availability}
                  </motion.p>
                )}

                <h1 className="display hero-title">
                  {hero.title.map((line, i) => (
                    <span className="line-mask" key={line}>
                      <motion.span {...rise(0.1 + i * 0.1)}>{line}</motion.span>
                    </span>
                  ))}
                </h1>

                <motion.p className="lead hero-sub" {...fade(0.4)}>{hero.subtitle}</motion.p>

                {!isCreation && <motion.p className="meta" {...fade(0.48)}>{t.hero.meta}</motion.p>}

                <motion.div className="hero-actions" {...fade(0.55)}>
                  {isCreation ? (
                    <>
                      <a href="#produits" className="btn btn-primary btn-lg">{t.creation.ctaPrimary}</a>
                      <a href={IG_URL} className="btn btn-secondary btn-lg" target="_blank" rel="noopener noreferrer">
                        <Instagram size={16} aria-hidden="true" />{t.creation.ctaSecondary}
                      </a>
                    </>
                  ) : (
                    <>
                      <a href="#contact" className="btn btn-primary btn-lg">{t.hero.ctaPrimary}</a>
                      <a href="#services" className="btn btn-secondary btn-lg">{t.hero.ctaSecondary}</a>
                    </>
                  )}
                </motion.div>

                <motion.ul className="facts" {...fade(0.68)}>
                  {hero.facts.map((f) => (
                    <Fact key={f.label} value={f.value} suffix={f.suffix} label={f.label} start={loaded} />
                  ))}
                </motion.ul>
              </div>

              {isCreation ? (
                <motion.div className="hero-stage-wrap" {...fade(0.3, 24)}>
                  <div className="collage-stage">
                    <Collage t={t} interactive />
                  </div>
                </motion.div>
              ) : (
                <motion.div className="hero-stage-wrap" ref={stageRef} {...fade(0.3, 24)}>
                  <Tilt className="stage">
                    <div className="stage-inner" role="img" aria-label={t.hero.stageCaption}>
                      <PipelineViz active={loaded && stageInView} lang={lang} L={t.pipe} />
                    </div>
                  </Tilt>
                  <p className="hero-caption">{t.hero.stageCaption}</p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </section>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={mode} {...swap}>
            {isCreation ? (
              <>
                {/* ── Création ─────────────────────────────────────────────── */}
                <section id="creer" className="section" aria-labelledby="creer-label">
                  <div className="container">
                    <SectionHead id="creer-label" label={t.creation.navCreate} title={t.creation.sectionTitle} lead={t.creation.sectionLead} />
                    <div className="bento">
                      {t.creation.items.map((c, i) => (
                        <Reveal key={c.key} as="article" className={`card card-create card-create-${c.key}`} delay={i * 0.06}>
                          <div className="card-hit">
                            <div className="card-body">
                              <h3 className="card-title">{c.title}</h3>
                              <p>{c.desc}</p>
                            </div>
                            {c.key === "video" ? (
                              <a href={IG_URL} target="_blank" rel="noopener noreferrer" className="card-more">
                                {t.creation.igLink}<ArrowUpRight size={14} aria-hidden="true" />
                              </a>
                            ) : (
                              <a href="#produits" className="card-more">{t.products.see}<ArrowDown size={14} aria-hidden="true" /></a>
                            )}
                          </div>
                        </Reveal>
                      ))}
                    </div>
                  </div>
                </section>

                {/* ── Produits : la roue ───────────────────────────────────── */}
                <section id="produits" className="section section-rule section-carousel" aria-labelledby="produits-label">
                  <div className="container">
                    <SectionHead id="produits-label" label={t.nav.products} title={t.products.title} lead={t.products.lead} />
                  </div>
                  <Reveal>
                    <ProductWheel t={t} />
                  </Reveal>
                </section>
              </>
            ) : (
              <>
                {/* ── Services ─────────────────────────────────────────────── */}
                <section id="services" className="section" aria-labelledby="services-label">
                  <div className="container">
                    <SectionHead id="services-label" label={t.nav.services} title={t.services.title} lead={t.services.lead} />

                    <Reveal>
                      <ChainViz t={t} linked={linked} setLinked={setLinked} />
                    </Reveal>

                    <div className="bento">
                      {services.map((s, i) => {
                        const Viz = VIZ[s.key];
                        return (
                          <Reveal
                            key={s.key}
                            as="article"
                            className={`card card-${s.key}${linked === s.key ? " is-linked" : ""}`}
                            delay={(i % 3) * 0.06}
                          >
                            <div onMouseEnter={() => setLinked(s.key)} onMouseLeave={() => setLinked(null)} className="card-hit">
                              {Viz && <div className="card-viz"><Viz L={t.viz} /></div>}
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
                            </div>
                          </Reveal>
                        );
                      })}
                    </div>
                  </div>
                </section>

                {/* ── Approche ─────────────────────────────────────────────── */}
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

                {/* ── Stack ────────────────────────────────────────────────── */}
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
              </>
            )}

            {/* ── Contact ──────────────────────────────────────────────────── */}
            <section id="contact" className="section section-rule contact" aria-labelledby="contact-label">
              <div className="container contact-grid">
                <Reveal className="contact-copy">
                  <p className="section-label" id="contact-label">{t.nav.contact}</p>
                  <h2 className="display display-xl">{isCreation ? t.creation.contactTitle : t.contact.title}</h2>
                  <p className="lead">{isCreation ? t.creation.contactSubtitle : t.contact.subtitle}</p>
                </Reveal>
                <Reveal className="contact-panel" delay={0.1}>
                  <p className="status"><i aria-hidden="true" />{t.hero.availability}</p>
                  <div className="contact-actions">
                    <a href="https://www.linkedin.com/in/lucas-massoni/" className="btn btn-primary btn-lg" target="_blank" rel="noopener noreferrer">
                      <Linkedin size={16} />{t.contact.linkedin}
                    </a>
                    <a href={IG_URL} className="btn btn-secondary btn-lg" target="_blank" rel="noopener noreferrer">
                      <Instagram size={16} />{t.contact.instagram}
                    </a>
                  </div>
                  <p className="contact-note">{isCreation ? t.creation.contactNote : t.contact.note}</p>
                </Reveal>
              </div>
            </section>
          </motion.div>
        </AnimatePresence>

        <SiteFooter t={t} items={navItems} />
      </main>
    </MotionConfig>
  );
}
