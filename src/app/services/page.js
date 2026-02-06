"use client";
import { motion } from "framer-motion";
import { BarChart3, Code2, Database, Settings2 } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { BG, ACCENT1, ACCENT2, TITLES, TEXT, CARD_TEXT } from "@/lib/constants";
import PageWrapper from "@/components/PageWrapper";
import SectionDivider from "@/components/SectionDivider";

const serviceIcons = [
  <Settings2 key="cpq" size={32} style={{ color: "#7aa595" }} />,
  <BarChart3 key="analytics" size={32} style={{ color: "#7aa595" }} />,
  <Code2 key="apex" size={32} style={{ color: "#7aa595" }} />,
  <Database key="data" size={32} style={{ color: "#7aa595" }} />,
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function ServicesPage() {
  const { t } = useLanguage();

  return (
    <PageWrapper>
      <section className="py-20 px-6 md:px-0" style={{ background: BG }}>
        <div className="max-w-5xl mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-tech-upper text-4xl md:text-5xl font-bold text-center mb-6 tracking-tight"
            style={{ color: TITLES }}
          >
            {t.expertise.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="font-tech text-lg text-center mb-16 leading-relaxed"
            style={{ color: TEXT, maxWidth: 700, margin: "0 auto 4rem" }}
          >
            {t.hero.subtitle}
          </motion.p>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-8"
          >
            {t.expertise.items.map((service, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.23, ease: [0.28, 1.15, 0.5, 1] }}
                className="flex flex-col md:flex-row items-start gap-6 bg-white rounded-2xl px-8 py-8 transition-all duration-300"
                style={{
                  boxShadow: "0 2px 20px 0 rgba(122, 165, 149, 0.08)",
                }}
              >
                <div
                  className="flex items-center justify-center rounded-xl p-4 shrink-0"
                  style={{ background: `${ACCENT1}12` }}
                >
                  {serviceIcons[index]}
                </div>
                <div className="flex flex-col gap-3 flex-1">
                  <h2
                    className="font-tech-upper text-xl md:text-2xl"
                    style={{ color: ACCENT1, letterSpacing: "0.10em" }}
                  >
                    {service.title}
                  </h2>
                  <p
                    className="font-tech text-base leading-relaxed"
                    style={{ color: CARD_TEXT }}
                  >
                    {service.description}
                  </p>
                  {service.demoBtn && (
                    <div className="pt-2">
                      <a
                        href={service.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-5 py-2 rounded-full font-tech-upper font-bold transition-all duration-200 text-sm btn-hover"
                        style={{
                          background: ACCENT2,
                          color: "#fff",
                          border: `1.5px solid ${ACCENT2}`,
                          letterSpacing: ".11em",
                        }}
                      >
                        {service.demoBtn}
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <SectionDivider />

      {/* Agile methodology section */}
      <section className="py-20 px-6 md:px-0" style={{ background: BG }}>
        <div className="max-w-6xl mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-tech-upper text-3xl md:text-4xl font-bold tracking-tight mb-8"
            style={{ color: TITLES }}
          >
            {t.agile.title}
          </motion.h2>
          <p
            className="font-tech text-lg md:text-xl leading-relaxed"
            style={{
              color: TEXT,
              maxWidth: 880,
              margin: "0 auto 3.5rem",
            }}
          >
            {t.agile.desc}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
            {t.agile.items.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                whileHover={{
                  y: -6,
                  boxShadow: "0 12px 28px rgba(0,0,0,0.08)",
                }}
                className="relative bg-white rounded-xl p-6 border transition-all duration-300"
                style={{ borderColor: ACCENT1 }}
              >
                <div
                  className="absolute top-0 left-0 w-full h-[10px] rounded-t-xl"
                  style={{ background: ACCENT1 }}
                />
                <div className="pt-5">
                  <h3
                    className="font-tech-upper text-xl font-bold tracking-wide mb-2"
                    style={{ color: TITLES }}
                  >
                    {item.title}
                  </h3>
                  <p className="font-tech text-base" style={{ color: TEXT }}>
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
