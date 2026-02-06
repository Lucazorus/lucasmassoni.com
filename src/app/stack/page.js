"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/language-context";
import { BG, BG_CARD, ACCENT1, TITLES, TEXT, BORDER } from "@/lib/constants";
import PageWrapper from "@/components/PageWrapper";

export default function StackPage() {
  const { t } = useLanguage();
  const [activeCard, setActiveCard] = useState(null);
  const cards = t.techStack.cards;

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
            {t.techStack.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-lg leading-relaxed"
            style={{ color: TEXT, maxWidth: 500, margin: "0 auto" }}
          >
            {t.techStack.subtitle}
          </motion.p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12 md:py-16 px-6 md:px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-3">
          {cards.map((card, idx) => (
            <motion.button
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.04, duration: 0.3 }}
              onClick={() => setActiveCard(activeCard === idx ? null : idx)}
              className="relative rounded-xl p-5 text-center transition-all duration-300 cursor-pointer min-h-[100px] flex flex-col items-center justify-center"
              style={{
                background: activeCard === idx ? `rgba(122, 165, 149, 0.08)` : BG_CARD,
                border: `1px solid ${activeCard === idx ? ACCENT1 : BORDER}`,
              }}
              whileHover={{
                borderColor: ACCENT1,
                y: -2,
              }}
            >
              <span
                className="font-tech-upper text-sm md:text-base"
                style={{ color: activeCard === idx ? ACCENT1 : TITLES }}
              >
                {card.tech}
              </span>
              {/* Dot indicator */}
              <div
                className="w-1 h-1 rounded-full mt-3 transition-all duration-300"
                style={{
                  background: ACCENT1,
                  opacity: activeCard === idx ? 1 : 0.2,
                }}
              />
            </motion.button>
          ))}
        </div>

        {/* Detail panel */}
        <AnimatePresence mode="wait">
          {activeCard !== null && (
            <motion.div
              key={activeCard}
              initial={{ opacity: 0, y: 10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="max-w-5xl mx-auto mt-6 overflow-hidden"
            >
              <div
                className="rounded-xl p-8 relative"
                style={{
                  background: BG_CARD,
                  border: `1px solid rgba(122, 165, 149, 0.2)`,
                }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{ background: ACCENT1 }}
                />
                <div className="flex items-start gap-6">
                  <div
                    className="font-heading text-4xl shrink-0 hidden md:block"
                    style={{ color: ACCENT1 }}
                  >
                    {cards[activeCard].tech}
                  </div>
                  <p
                    className="text-base leading-relaxed"
                    style={{ color: TEXT }}
                  >
                    {cards[activeCard].back}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </PageWrapper>
  );
}
