"use client";
import { motion } from "framer-motion";
import { Calendar, Linkedin, Mail } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { BG, ACCENT1, TITLES, TEXT, CARD_BG } from "@/lib/constants";
import PageWrapper from "@/components/PageWrapper";

export default function ContactPage() {
  const { t } = useLanguage();

  return (
    <PageWrapper>
      <section className="py-28 px-6 md:px-0" style={{ background: BG }}>
        <div className="max-w-3xl mx-auto px-8 relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-tech-upper text-4xl md:text-5xl font-bold text-center mb-6 tracking-tight"
            style={{ color: TITLES }}
          >
            {t.contact.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="font-tech text-lg text-center mb-16 leading-relaxed"
            style={{ color: TEXT, maxWidth: 600, margin: "0 auto 4rem" }}
          >
            {t.contact.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col items-center gap-6"
          >
            <a
              href="https://calendly.com/lucas-massoni-contact"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 w-full max-w-md px-8 py-5 rounded-2xl border font-tech-upper font-bold text-base transition-all duration-200 btn-hover"
              style={{
                background: CARD_BG,
                borderColor: ACCENT1,
                color: ACCENT1,
                boxShadow: "0 2px 16px 0 #7aa59518",
              }}
            >
              <Calendar size={24} style={{ color: ACCENT1 }} />
              {t.contact.calendly}
            </a>
            <a
              href="https://www.linkedin.com/in/lucas-massoni/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 w-full max-w-md px-8 py-5 rounded-2xl border font-tech-upper font-bold text-base transition-all duration-200 btn-hover"
              style={{
                background: CARD_BG,
                borderColor: ACCENT1,
                color: ACCENT1,
                boxShadow: "0 2px 16px 0 #7aa59518",
              }}
            >
              <Linkedin size={24} style={{ color: ACCENT1 }} />
              {t.contact.linkedin}
            </a>
            <a
              href="mailto:lucas-massoni-contact@gmail.com"
              className="flex items-center gap-4 w-full max-w-md px-8 py-5 rounded-2xl border font-tech-upper font-bold text-base transition-all duration-200 btn-hover"
              style={{
                background: ACCENT1,
                borderColor: ACCENT1,
                color: CARD_BG,
                boxShadow: "0 2px 16px 0 #7aa59530",
              }}
            >
              <Mail size={24} style={{ color: CARD_BG }} />
              Email
            </a>
          </motion.div>
        </div>
      </section>
    </PageWrapper>
  );
}
