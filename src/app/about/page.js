"use client";
import { motion } from "framer-motion";
import { Award, Rocket, Brain } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { BG, ACCENT1, TITLES, TEXT } from "@/lib/constants";
import PageWrapper from "@/components/PageWrapper";

const iconMap = {
  Award: Award,
  Rocket: Rocket,
  Brain: Brain,
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <PageWrapper>
      <section className="py-20 px-6 md:px-0" style={{ background: BG }}>
        <div className="max-w-5xl mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-tech-upper text-4xl md:text-5xl font-bold text-center mb-16 tracking-tight"
            style={{ color: TITLES }}
          >
            {t.whyme.title}
          </motion.h1>

          {/* Desktop layout */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="hidden md:flex flex-col gap-0"
          >
            {/* Icons row */}
            <div className="flex flex-row items-start justify-between gap-0 relative w-full">
              {t.whyme.steps.map((step, i) => {
                const IconComponent = iconMap[step.iconName];
                return (
                  <motion.div
                    key={i}
                    variants={itemVariants}
                    className="flex-1 flex flex-col items-center min-w-[250px]"
                  >
                    <motion.div
                      whileHover={{ scale: 1.21 }}
                      transition={{
                        duration: 0.48,
                        ease: [0.28, 1.15, 0.5, 1],
                      }}
                      className="mb-4"
                    >
                      <div
                        className="bg-white rounded-full shadow-lg p-4 flex items-center justify-center border-2"
                        style={{ borderColor: ACCENT1 }}
                      >
                        {IconComponent && (
                          <IconComponent
                            size={40}
                            style={{ color: ACCENT1 }}
                          />
                        )}
                      </div>
                    </motion.div>
                    <div
                      className="font-tech-upper text-md md:text-lg font-bold mb-1 tracking-widest"
                      style={{ color: ACCENT1 }}
                    >
                      {step.title}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Connecting line */}
            <div className="w-full" style={{ margin: "32px 0 28px 0" }}>
              <div
                className="w-full h-1 mx-auto rounded-full"
                style={{ background: ACCENT1, maxWidth: "95%" }}
              />
            </div>

            {/* Text row */}
            <div className="flex flex-row items-start justify-between gap-0 w-full mt-3">
              {t.whyme.steps.map((step, i) => (
                <div key={i} className="flex-1 min-w-[250px] max-w-[370px]">
                  <div
                    className="font-tech text-base text-left leading-relaxed"
                    style={{ color: TEXT }}
                  >
                    {step.text}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Mobile layout */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="md:hidden flex flex-col items-center gap-14 relative mt-10"
          >
            {t.whyme.steps.map((step, i) => {
              const IconComponent = iconMap[step.iconName];
              return (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="flex flex-col items-center relative w-full"
                >
                  <motion.div
                    whileHover={{ scale: 1.21 }}
                    transition={{
                      duration: 0.48,
                      ease: [0.28, 1.15, 0.5, 1],
                    }}
                    className="mb-4"
                  >
                    <div
                      className="bg-white rounded-full shadow-lg p-4 flex items-center justify-center border-2"
                      style={{ borderColor: ACCENT1 }}
                    >
                      {IconComponent && (
                        <IconComponent
                          size={40}
                          style={{ color: ACCENT1 }}
                        />
                      )}
                    </div>
                  </motion.div>
                  <div
                    className="font-tech-upper text-lg font-bold mb-2 tracking-widest"
                    style={{ color: ACCENT1 }}
                  >
                    {step.title}
                  </div>
                  <div
                    className="font-tech text-base text-left mb-2 leading-relaxed"
                    style={{
                      color: TEXT,
                      maxWidth: 380,
                      margin: "0 auto",
                    }}
                  >
                    {step.text}
                  </div>
                  {i < t.whyme.steps.length - 1 && (
                    <div
                      className="w-1 h-14 mx-auto rounded-full opacity-50"
                      style={{ background: ACCENT1 }}
                    />
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>
    </PageWrapper>
  );
}
