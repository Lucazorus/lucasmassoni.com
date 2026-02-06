"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Linkedin, Mail, Copy, Check } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { BG, BG_CARD, ACCENT1, TITLES, TEXT, BORDER } from "@/lib/constants";
import PageWrapper from "@/components/PageWrapper";

const EMAIL = "lucas.massoni.contact@gmail.com";

export default function ContactPage() {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = EMAIL;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <PageWrapper>
      <section className="py-20 md:py-28 px-6 md:px-8 flex items-center justify-center min-h-[calc(100vh-72px)]">
        <div className="max-w-2xl mx-auto w-full relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1
              className="font-heading text-4xl md:text-5xl mb-4"
              style={{ color: TITLES }}
            >
              {t.contact.title}
            </h1>
            <p
              className="text-lg leading-relaxed"
              style={{ color: TEXT, maxWidth: 500, margin: "0 auto" }}
            >
              {t.contact.subtitle}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col gap-4"
          >
            {/* Calendly */}
            <a
              href="https://calendly.com/lucas-massoni-contact"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 w-full px-6 py-5 rounded-xl transition-all duration-300"
              style={{
                background: BG_CARD,
                border: `1px solid ${BORDER}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = ACCENT1;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = BORDER;
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                className="flex items-center justify-center rounded-lg w-10 h-10 shrink-0"
                style={{
                  background: `rgba(122, 165, 149, 0.1)`,
                  border: `1px solid rgba(122, 165, 149, 0.15)`,
                }}
              >
                <Calendar size={20} style={{ color: ACCENT1 }} />
              </div>
              <div className="flex-1">
                <span className="font-tech-upper text-sm" style={{ color: TITLES }}>
                  {t.contact.calendly}
                </span>
                <p className="text-xs mt-1" style={{ color: TEXT }}>
                  calendly.com/lucas-massoni-contact
                </p>
              </div>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/lucas-massoni/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 w-full px-6 py-5 rounded-xl transition-all duration-300"
              style={{
                background: BG_CARD,
                border: `1px solid ${BORDER}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = ACCENT1;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = BORDER;
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                className="flex items-center justify-center rounded-lg w-10 h-10 shrink-0"
                style={{
                  background: `rgba(122, 165, 149, 0.1)`,
                  border: `1px solid rgba(122, 165, 149, 0.15)`,
                }}
              >
                <Linkedin size={20} style={{ color: ACCENT1 }} />
              </div>
              <div className="flex-1">
                <span className="font-tech-upper text-sm" style={{ color: TITLES }}>
                  {t.contact.linkedin}
                </span>
                <p className="text-xs mt-1" style={{ color: TEXT }}>
                  linkedin.com/in/lucas-massoni
                </p>
              </div>
            </a>

            {/* Email - Copy to clipboard */}
            <button
              onClick={handleCopyEmail}
              className="flex items-center gap-4 w-full px-6 py-5 rounded-xl transition-all duration-300 text-left relative overflow-hidden"
              style={{
                background: copied ? `rgba(122, 165, 149, 0.1)` : BG_CARD,
                border: `1px solid ${copied ? ACCENT1 : BORDER}`,
              }}
              onMouseEnter={(e) => {
                if (!copied) {
                  e.currentTarget.style.borderColor = ACCENT1;
                  e.currentTarget.style.transform = "translateY(-2px)";
                }
              }}
              onMouseLeave={(e) => {
                if (!copied) {
                  e.currentTarget.style.borderColor = BORDER;
                  e.currentTarget.style.transform = "translateY(0)";
                }
              }}
            >
              <div
                className="flex items-center justify-center rounded-lg w-10 h-10 shrink-0"
                style={{
                  background: copied ? ACCENT1 : `rgba(122, 165, 149, 0.1)`,
                  border: `1px solid ${copied ? ACCENT1 : "rgba(122, 165, 149, 0.15)"}`,
                }}
              >
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Check size={20} style={{ color: BG }} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="mail"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Mail size={20} style={{ color: ACCENT1 }} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="flex-1 min-w-0">
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.div
                      key="copied"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="font-tech text-sm" style={{ color: ACCENT1 }}>
                        {t.contact.emailCopied}
                      </span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="default"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="font-tech-upper text-sm" style={{ color: TITLES }}>
                        {t.contact.email}
                      </span>
                      <p className="text-xs mt-1 truncate" style={{ color: TEXT }}>
                        {EMAIL}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="shrink-0">
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.div
                      key="check-icon"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Check size={16} style={{ color: ACCENT1 }} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="copy-icon"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Copy size={16} style={{ color: TEXT }} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </button>
          </motion.div>
        </div>
      </section>
    </PageWrapper>
  );
}
