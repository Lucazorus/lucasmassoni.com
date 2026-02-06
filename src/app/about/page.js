"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Award, Rocket, Brain, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { BG, BG_CARD, ACCENT1, TITLES, TEXT, BORDER } from "@/lib/constants";
import PageWrapper from "@/components/PageWrapper";
import SectionDivider from "@/components/SectionDivider";

const iconMap = { Award, Rocket, Brain };

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <PageWrapper>
      {/* Header */}
      <section className="pt-16 pb-8 px-6 md:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-heading text-4xl md:text-5xl mb-4"
            style={{ color: TITLES }}
          >
            {t.whyme.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-lg leading-relaxed"
            style={{ color: TEXT, maxWidth: 600, margin: "0 auto" }}
          >
            {t.whyme.subtitle}
          </motion.p>
        </div>
      </section>

      {/* Cards */}
      <section className="py-12 md:py-16 px-6 md:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {t.whyme.steps.map((step, i) => {
            const IconComponent = iconMap[step.iconName];
            return (
              <motion.div
                key={i}
                variants={itemVariants}
                className="relative rounded-xl p-8 text-center transition-all duration-300"
                style={{
                  background: BG_CARD,
                  border: `1px solid ${BORDER}`,
                }}
                whileHover={{ borderColor: ACCENT1, y: -4 }}
              >
                <div
                  className="inline-flex items-center justify-center rounded-full w-16 h-16 mb-6"
                  style={{
                    background: `rgba(122, 165, 149, 0.08)`,
                    border: `1px solid rgba(122, 165, 149, 0.2)`,
                  }}
                >
                  {IconComponent && (
                    <IconComponent size={28} style={{ color: ACCENT1 }} />
                  )}
                </div>
                <h3
                  className="font-tech-upper text-sm mb-3"
                  style={{ color: ACCENT1 }}
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
      </section>

      <SectionDivider />

      {/* Stats */}
      <section className="py-12 md:py-16 px-6 md:px-8">
        <div className="max-w-4xl mx-auto">
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl overflow-hidden"
            style={{ background: BORDER }}
          >
            {t.stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="flex flex-col items-center py-10 px-4"
                style={{ background: BG_CARD }}
              >
                <span
                  className="font-heading text-3xl md:text-4xl"
                  style={{ color: ACCENT1 }}
                >
                  {stat.value}
                </span>
                <span
                  className="font-tech text-xs mt-2 text-center"
                  style={{ color: TEXT }}
                >
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* CTA */}
      <section className="py-16 md:py-24 px-6 md:px-8">
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
