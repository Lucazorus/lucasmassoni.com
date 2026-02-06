"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/language-context";
import { BG, ACCENT1, TITLES, CARD_TEXT } from "@/lib/constants";
import PageWrapper from "@/components/PageWrapper";

const CARD_MIN_W = 95;
const CARD_MIN_H = 62;
const CARD_MAX_W = 220;
const CARD_MAX_H = 165;
const FLIP_BREAKPOINT = 600;

export default function StackPage() {
  const { t } = useLanguage();
  const [canFlip, setCanFlip] = useState(true);
  const [colCount, setColCount] = useState(5);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setCanFlip(w >= FLIP_BREAKPOINT);
      if (w < 600) setColCount(2);
      else if (w < 900) setColCount(3);
      else setColCount(5);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const cards = t.techStack.cards;

  function getFontSize(text, w, h) {
    if (!text) return "0.83rem";
    const charCount = text.length;
    let fs = Math.max(
      Math.min(w * 0.105 + h * 0.09 - charCount * 0.013, 0.83),
      0.54
    );
    return `${fs}rem`;
  }

  return (
    <PageWrapper>
      <section
        className="py-20 relative overflow-hidden px-6 md:px-0"
        style={{ background: BG }}
      >
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-tech-upper text-4xl md:text-5xl font-bold text-center mb-16 tracking-tight"
            style={{ color: TITLES }}
          >
            {t.techStack.title}
          </motion.h1>
          <div
            className="grid stack-tech-grid"
            style={{
              gridTemplateColumns: `repeat(${colCount}, minmax(${CARD_MIN_W}px, ${CARD_MAX_W}px))`,
              gap: "14px",
              placeItems: "center",
              transition: "gap .25s",
            }}
          >
            {cards.map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05, duration: 0.3 }}
                className="relative stack-card"
                style={{
                  width: CARD_MAX_W,
                  height: CARD_MAX_H,
                  minWidth: CARD_MIN_W,
                  minHeight: CARD_MIN_H,
                  maxWidth: CARD_MAX_W,
                  maxHeight: CARD_MAX_H,
                  padding: 0,
                }}
              >
                <div
                  className={
                    canFlip
                      ? "flip-card w-full h-full"
                      : "no-flip-card w-full h-full"
                  }
                >
                  <div className="flip-card-inner group w-full h-full">
                    {/* Front */}
                    <div
                      className="flip-card-front bg-white rounded-2xl w-full h-full flex flex-col justify-center items-center shadow-xl border"
                      style={{ borderColor: ACCENT1 }}
                    >
                      <span
                        className="font-tech-upper text-[1.03rem] md:text-lg"
                        style={{ color: ACCENT1 }}
                      >
                        {card.tech}
                      </span>
                    </div>
                    {/* Back */}
                    <div
                      className="flip-card-back bg-[#f7faf9] rounded-2xl w-full h-full flex flex-col justify-start items-start shadow-xl border"
                      style={{
                        borderColor: ACCENT1,
                        padding: "14px 14px 11px 15px",
                        display: canFlip ? "flex" : "none",
                      }}
                    >
                      <span
                        className="font-tech text-[0.95rem] md:text-[1.04rem] text-left"
                        style={{
                          color: CARD_TEXT,
                          fontWeight: 500,
                          lineHeight: 1.34,
                          wordBreak: "break-word",
                          maxWidth: 174,
                          textAlign: "left",
                          fontSize: getFontSize(
                            card.back,
                            CARD_MAX_W,
                            CARD_MAX_H
                          ),
                        }}
                      >
                        {card.back}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <style jsx>{`
          .flip-card {
            perspective: 900px;
            width: 100%;
            height: 100%;
          }
          .no-flip-card {
            width: 100%;
            height: 100%;
          }
          .flip-card-inner {
            width: 100%;
            height: 100%;
            transition: transform 0.65s cubic-bezier(0.37, 1.6, 0.24, 0.99);
            transform-style: preserve-3d;
            cursor: pointer;
          }
          .flip-card:hover .flip-card-inner,
          .flip-card:focus-within .flip-card-inner {
            transform: rotateY(180deg);
          }
          .no-flip-card .flip-card-inner {
            transform: none !important;
            cursor: default;
          }
          .flip-card-front,
          .flip-card-back {
            position: absolute;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 28px 0 #7aa59509, 0 1.5px 12px 0 #7aa59518;
            border-radius: 18px;
            padding: 0 8px;
          }
          .flip-card-back {
            transform: rotateY(180deg);
            background: #f7faf9;
            justify-content: flex-start !important;
            align-items: flex-start !important;
            padding-top: 14px;
            padding-left: 15px;
            padding-right: 14px;
            text-align: left;
          }
          @media (max-width: 1200px) {
            .stack-card {
              width: 150px !important;
              height: 105px !important;
              min-width: ${CARD_MIN_W}px !important;
              min-height: ${CARD_MIN_H}px !important;
            }
          }
          @media (max-width: 900px) {
            .stack-tech-grid {
              grid-template-columns: repeat(3, 1fr) !important;
            }
            .stack-card {
              width: 110px !important;
              height: 70px !important;
              min-width: ${CARD_MIN_W}px !important;
              min-height: ${CARD_MIN_H}px !important;
            }
          }
          @media (max-width: 600px) {
            .stack-tech-grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }
            .stack-card {
              width: 95px !important;
              height: 62px !important;
              min-width: ${CARD_MIN_W}px !important;
              min-height: ${CARD_MIN_H}px !important;
            }
          }
        `}</style>
      </section>
    </PageWrapper>
  );
}
