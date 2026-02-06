"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { BarChart3, Code2, Database, Settings2, ArrowRight, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { BG, BG_CARD, ACCENT1, ACCENT2, TITLES, TEXT, BORDER } from "@/lib/constants";
import PageWrapper from "@/components/PageWrapper";
import SectionDivider from "@/components/SectionDivider";

const serviceIcons = [
  <Settings2 key="cpq" size={28} />,
  <BarChart3 key="analytics" size={28} />,
  <Code2 key="apex" size={28} />,
  <Database key="data" size={28} />,
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function ServicesPage() {
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
            {t.expertise.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-lg leading-relaxed"
            style={{ color: TEXT, maxWidth: 600, margin: "0 auto" }}
          >
            {t.expertise.subtitle}
          </motion.p>
        </div>
      </section>

      {/* Services */}
      <section className="py-12 md:py-16 px-6 md:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto flex flex-col gap-5"
        >
          {t.expertise.items.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative flex flex-col md:flex-row items-start gap-6 rounded-xl p-8 transition-all duration-300"
              style={{
                background: BG_CARD,
                border: `1px solid ${BORDER}`,
              }}
              whileHover={{ borderColor: ACCENT1 }}
            >
              {/* Number */}
              <div
                className="font-heading text-5xl md:text-6xl opacity-20 absolute top-4 right-6 select-none"
                style={{ color: ACCENT1 }}
              >
                {String(index + 1).padStart(2, "0")}
              </div>

              <div
                className="flex items-center justify-center rounded-xl w-14 h-14 shrink-0"
                style={{
                  background: `rgba(122, 165, 149, 0.1)`,
                  border: `1px solid rgba(122, 165, 149, 0.15)`,
                  color: ACCENT1,
                }}
              >
                {serviceIcons[index]}
              </div>

              <div className="flex flex-col gap-3 flex-1">
                <div className="flex items-center gap-3">
                  <h2
                    className="font-tech-upper text-lg md:text-xl"
                    style={{ color: TITLES }}
                  >
                    {service.title}
                  </h2>
                  {service.tag && (
                    <span
                      className="font-tech text-[10px] px-2 py-1 rounded-full hidden sm:inline-block"
                      style={{
                        background: `rgba(122, 165, 149, 0.1)`,
                        color: ACCENT1,
                        border: `1px solid rgba(122, 165, 149, 0.2)`,
                      }}
                    >
                      {service.tag}
                    </span>
                  )}
                </div>
                <p
                  className="text-base leading-relaxed max-w-2xl"
                  style={{ color: TEXT }}
                >
                  {service.description}
                </p>
                {service.demoBtn && (
                  <a
                    href={service.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-tech text-sm mt-2 transition-colors duration-200"
                    style={{ color: ACCENT1 }}
                  >
                    {service.demoBtn}
                    <ArrowUpRight size={14} />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <SectionDivider />

      {/* Methodology */}
      <section className="py-16 md:py-24 px-6 md:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <h2
              className="font-heading text-3xl md:text-4xl mb-4"
              style={{ color: TITLES }}
            >
              {t.agile.title}
            </h2>
            <p
              className="text-base leading-relaxed"
              style={{ color: TEXT, maxWidth: 700, margin: "0 auto" }}
            >
              {t.agile.desc}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {t.agile.items.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="relative rounded-xl p-6 transition-all duration-300"
                style={{
                  background: BG_CARD,
                  border: `1px solid ${BORDER}`,
                }}
                whileHover={{ borderColor: ACCENT1, y: -2 }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl"
                  style={{ background: ACCENT1 }}
                />
                <h3
                  className="font-tech-upper text-sm mb-3 mt-2"
                  style={{ color: ACCENT1 }}
                >
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: TEXT }}>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="text-center mt-16"
          >
            <Link
              href="/contact"
              className="btn-primary inline-flex items-center gap-2 px-8 py-4 rounded-full font-tech-upper text-sm"
            >
              {t.hero.startProject}
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
    </PageWrapper>
  );
}
