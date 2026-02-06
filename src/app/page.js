"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Settings2, BarChart3, Code2, Database, Award, Rocket, Brain, ChevronRight } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { BG, BG_CARD, ACCENT1, ACCENT2, TITLES, TEXT, BORDER, NAV_HEIGHT } from "@/lib/constants";
import PageWrapper from "@/components/PageWrapper";
import SectionDivider from "@/components/SectionDivider";

const serviceIcons = [
  <Settings2 key="cpq" size={22} />,
  <BarChart3 key="analytics" size={22} />,
  <Code2 key="apex" size={22} />,
  <Database key="data" size={22} />,
];

const whyMeIcons = { Award, Rocket, Brain };

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <PageWrapper>
      {/* HERO */}
      <section
        className="w-full flex flex-col items-center justify-center px-6 md:px-8 relative"
        style={{ minHeight: `calc(100vh - ${NAV_HEIGHT}px)` }}
      >
        {/* Hero glow */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, rgba(122, 165, 149, 0.1) 0%, transparent 65%)`,
          }}
        />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
            style={{
              background: `rgba(122, 165, 149, 0.1)`,
              border: `1px solid rgba(122, 165, 149, 0.2)`,
            }}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: ACCENT1, animation: "pulse-glow 2s infinite" }}
            />
            <span className="font-tech text-sm" style={{ color: ACCENT1 }}>
              {t.hero.greeting}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading text-balance"
            style={{
              fontSize: "clamp(2.2rem, 5.5vw, 3.8rem)",
              color: TITLES,
              lineHeight: 1.1,
              marginBottom: 0,
            }}
          >
            {t.hero.title.split(t.hero.titleHighlight)[0]}
            <span style={{ color: ACCENT1 }}>{t.hero.titleHighlight}</span>
            {t.hero.title.split(t.hero.titleHighlight)[1]}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-center leading-relaxed"
            style={{
              color: TEXT,
              marginTop: 28,
              marginBottom: 40,
              fontSize: "clamp(1rem, 2vw, 1.2rem)",
              fontWeight: 400,
              maxWidth: 600,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            {t.hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/contact"
              className="btn-primary inline-flex items-center gap-2 px-8 py-4 rounded-full font-tech-upper text-sm"
              style={{ minWidth: 220, justifyContent: "center" }}
            >
              {t.hero.startProject}
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/services"
              className="btn-outline inline-flex items-center gap-2 px-8 py-4 rounded-full font-tech-upper text-sm"
            >
              {t.hero.seeServices}
              <ChevronRight size={16} />
            </Link>
          </motion.div>
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="w-full max-w-4xl mx-auto mt-20 md:mt-28"
        >
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl overflow-hidden"
            style={{ background: BORDER }}
          >
            {t.stats.map((stat, i) => (
              <div
                key={i}
                className="flex flex-col items-center py-8 px-4"
                style={{ background: BG_CARD }}
              >
                <span
                  className="font-heading text-3xl md:text-4xl"
                  style={{ color: ACCENT1 }}
                >
                  {stat.value}
                </span>
                <span
                  className="font-tech text-xs mt-2"
                  style={{ color: TEXT }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <SectionDivider />

      {/* SERVICES PREVIEW */}
      <section className="py-20 md:py-28 px-6 md:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2
              className="font-heading text-3xl md:text-4xl mb-4"
              style={{ color: TITLES }}
            >
              {t.expertise.title}
            </h2>
            <p style={{ color: TEXT, maxWidth: 500, margin: "0 auto" }}>
              {t.expertise.subtitle}
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {t.expertise.items.map((service, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative rounded-xl p-6 transition-all duration-300 hover:border-opacity-100"
                style={{
                  background: BG_CARD,
                  border: `1px solid ${BORDER}`,
                }}
                whileHover={{
                  borderColor: ACCENT1,
                  y: -2,
                }}
              >
                {service.tag && (
                  <span
                    className="absolute top-4 right-4 font-tech text-[10px] px-2 py-1 rounded-full"
                    style={{
                      background: `rgba(122, 165, 149, 0.1)`,
                      color: ACCENT1,
                      border: `1px solid rgba(122, 165, 149, 0.2)`,
                    }}
                  >
                    {service.tag}
                  </span>
                )}
                <div
                  className="flex items-center justify-center rounded-lg w-10 h-10 mb-4"
                  style={{
                    background: `rgba(122, 165, 149, 0.1)`,
                    color: ACCENT1,
                  }}
                >
                  {serviceIcons[index]}
                </div>
                <h3
                  className="font-tech-upper text-base mb-2"
                  style={{ color: TITLES }}
                >
                  {service.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: TEXT }}
                >
                  {service.description}
                </p>
                {service.demoBtn && (
                  <a
                    href={service.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-tech text-sm mt-4 transition-colors duration-200"
                    style={{ color: ACCENT1 }}
                  >
                    {service.demoBtn}
                    <ArrowRight size={14} />
                  </a>
                )}
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="text-center mt-10"
          >
            <Link
              href="/services"
              className="inline-flex items-center gap-2 font-tech text-sm transition-all duration-200"
              style={{ color: ACCENT1 }}
            >
              {t.nav.services}
              <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>

      <SectionDivider />

      {/* WHY ME */}
      <section className="py-20 md:py-28 px-6 md:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2
              className="font-heading text-3xl md:text-4xl mb-4"
              style={{ color: TITLES }}
            >
              {t.whyme.title}
            </h2>
            <p style={{ color: TEXT, maxWidth: 500, margin: "0 auto" }}>
              {t.whyme.subtitle}
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {t.whyme.steps.map((step, i) => {
              const Icon = whyMeIcons[step.iconName];
              return (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="relative rounded-xl p-6 text-center transition-all duration-300"
                  style={{
                    background: BG_CARD,
                    border: `1px solid ${BORDER}`,
                  }}
                  whileHover={{ borderColor: ACCENT1, y: -2 }}
                >
                  <div
                    className="inline-flex items-center justify-center rounded-full w-12 h-12 mb-4"
                    style={{
                      background: `rgba(122, 165, 149, 0.1)`,
                      border: `1px solid rgba(122, 165, 149, 0.2)`,
                    }}
                  >
                    {Icon && <Icon size={22} style={{ color: ACCENT1 }} />}
                  </div>
                  <h3
                    className="font-tech-upper text-sm mb-3"
                    style={{ color: TITLES }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: TEXT }}
                  >
                    {step.text}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <SectionDivider />

      {/* CTA SECTION */}
      <section className="py-20 md:py-28 px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center rounded-2xl p-10 md:p-16 relative overflow-hidden"
          style={{
            background: BG_CARD,
            border: `1px solid ${BORDER}`,
          }}
        >
          {/* Ambient glow inside CTA */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at center, rgba(122, 165, 149, 0.05) 0%, transparent 70%)`,
            }}
          />
          <div className="relative z-10">
            <h2
              className="font-heading text-2xl md:text-3xl mb-4"
              style={{ color: TITLES }}
            >
              {t.cta.title}
            </h2>
            <p className="mb-8" style={{ color: TEXT }}>
              {t.cta.subtitle}
            </p>
            <Link
              href="/contact"
              className="btn-primary inline-flex items-center gap-2 px-8 py-4 rounded-full font-tech-upper text-sm"
            >
              {t.cta.btn}
              <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </section>
    </PageWrapper>
  );
}
