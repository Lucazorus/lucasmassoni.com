"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Settings2, BarChart3, Code2, Database } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { BG, ACCENT1, ACCENT2, TITLES, TEXT, NAV_HEIGHT } from "@/lib/constants";
import PageWrapper from "@/components/PageWrapper";
import SectionDivider from "@/components/SectionDivider";

const serviceIcons = [
  <Settings2 key="cpq" size={24} />,
  <BarChart3 key="analytics" size={24} />,
  <Code2 key="apex" size={24} />,
  <Database key="data" size={24} />,
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export default function HomePage() {
  console.log("[v0] HomePage rendering");
  const { t } = useLanguage();
  console.log("[v0] Language context loaded, t:", typeof t, t ? "exists" : "missing");

  return (
    <PageWrapper>
      {/* HERO */}
      <section
        className="w-full flex flex-col items-center justify-center px-6 md:px-8"
        style={{
          minHeight: `calc(100vh - ${NAV_HEIGHT}px)`,
          background: BG,
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-tech-upper font-bold text-center"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4rem)",
              color: TITLES,
              letterSpacing: "0.13em",
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
            className="font-tech text-center leading-relaxed"
            style={{
              color: TEXT,
              marginTop: 32,
              marginBottom: 40,
              fontSize: "clamp(1.1rem, 2.2vw, 1.35rem)",
              fontWeight: 300,
              maxWidth: 650,
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
              className="inline-block px-8 py-4 rounded-full font-bold font-tech-upper transition-all duration-200 text-base btn-hover"
              style={{
                background: ACCENT1,
                color: BG,
                border: `1.5px solid ${ACCENT1}`,
                letterSpacing: ".12em",
                minWidth: 220,
                textAlign: "center",
                boxShadow: "0 2px 16px 0 #7aa59518",
              }}
            >
              {t.hero.startProject}
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold font-tech-upper transition-all duration-200 text-base btn-hover"
              style={{
                background: "transparent",
                color: ACCENT1,
                border: `1.5px solid ${ACCENT1}`,
                letterSpacing: ".12em",
              }}
            >
              {t.nav.services}
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      <SectionDivider />

      {/* SERVICES PREVIEW */}
      <section className="py-20 px-6 md:px-0" style={{ background: BG }}>
        <div className="max-w-5xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-tech-upper text-3xl md:text-4xl font-bold text-center mb-14 tracking-tight"
            style={{ color: TITLES }}
          >
            {t.expertise.title}
          </motion.h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {t.expertise.items.map((service, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.025 }}
                className="flex items-start gap-4 bg-white rounded-2xl px-6 py-6 transition-all duration-300"
                style={{
                  boxShadow: "0 2px 16px 0 rgba(122, 165, 149, 0.08)",
                }}
              >
                <div
                  className="flex items-center justify-center rounded-lg p-3 shrink-0"
                  style={{ background: `${ACCENT1}12`, color: ACCENT1 }}
                >
                  {serviceIcons[index]}
                </div>
                <div>
                  <h3
                    className="font-tech-upper text-lg mb-1"
                    style={{ color: ACCENT1, letterSpacing: "0.10em" }}
                  >
                    {service.title}
                  </h3>
                  <p
                    className="font-tech text-sm leading-relaxed"
                    style={{ color: TEXT, opacity: 0.85 }}
                  >
                    {service.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="text-center mt-10"
          >
            <Link
              href="/services"
              className="inline-flex items-center gap-2 font-tech-upper text-base font-bold transition-all duration-200 btn-hover"
              style={{ color: ACCENT1 }}
            >
              {t.nav.services}
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      <SectionDivider />

      {/* WHY ME PREVIEW */}
      <section className="py-20 px-6 md:px-0" style={{ background: BG }}>
        <div className="max-w-5xl mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-tech-upper text-3xl md:text-4xl font-bold mb-14 tracking-tight"
            style={{ color: TITLES }}
          >
            {t.whyme.title}
          </motion.h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {t.whyme.steps.map((step, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="flex flex-col items-center gap-3"
              >
                <div
                  className="font-tech-upper text-lg font-bold tracking-widest"
                  style={{ color: ACCENT1 }}
                >
                  {step.title}
                </div>
                <p
                  className="font-tech text-sm leading-relaxed"
                  style={{ color: TEXT, maxWidth: 320 }}
                >
                  {step.text}
                </p>
              </motion.div>
            ))}
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="mt-10"
          >
            <Link
              href="/about"
              className="inline-flex items-center gap-2 font-tech-upper text-base font-bold transition-all duration-200 btn-hover"
              style={{ color: ACCENT1 }}
            >
              {t.nav.about}
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
    </PageWrapper>
  );
}
