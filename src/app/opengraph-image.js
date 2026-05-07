import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Lucas Massoni — Expert Salesforce, SAP & Analytics Freelance";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG = "#FAF9F5";
const ACCENT1 = "#7aa595";
const ACCENT2 = "#FECF56";
const TEAL = "#6f9caf";
const TITLES = "#393E41";

export default async function Image() {
  const fontData = await readFile(
    join(process.cwd(), "src/app/ShareTechMono-Regular.ttf")
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: BG,
          padding: "70px 80px",
          fontFamily: "Share Tech Mono",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* decorative concentric arcs (echo du logo) — bottom-right */}
        <div
          style={{
            position: "absolute",
            right: -180,
            bottom: -180,
            width: 540,
            height: 540,
            borderRadius: "50%",
            border: `3px solid ${TEAL}`,
            opacity: 0.35,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: -110,
            bottom: -110,
            width: 400,
            height: 400,
            borderRadius: "50%",
            border: `3px solid ${ACCENT1}`,
            opacity: 0.45,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: -30,
            bottom: -30,
            width: 240,
            height: 240,
            borderRadius: "50%",
            border: `4px solid ${ACCENT2}`,
            opacity: 0.85,
            display: "flex",
          }}
        />

        {/* TOP — eyebrow + name + headline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              color: ACCENT1,
              fontSize: 22,
              letterSpacing: 6,
              marginBottom: 18,
            }}
          >
            FREELANCE SALESFORCE · SAP · ANALYTICS
          </div>

          <div
            style={{
              display: "flex",
              color: TITLES,
              fontSize: 96,
              lineHeight: 1,
              letterSpacing: 2,
              marginBottom: 22,
            }}
          >
            LUCAS MASSONI
          </div>

          <div
            style={{
              display: "flex",
              color: TITLES,
              fontSize: 40,
              letterSpacing: 2,
              opacity: 0.85,
              marginBottom: 28,
            }}
          >
            EXPERT SALESFORCE, SAP &amp; ANALYTICS
          </div>

          {/* tags */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", maxWidth: 760 }}>
            {["CPQ", "ANALYTICS", "APEX / FLOW / LWC", "S/4HANA", "ABAP", "DATA MIGRATION"].map(
              (t) => (
                <div
                  key={t}
                  style={{
                    display: "flex",
                    border: `1px solid ${TITLES}33`,
                    borderRadius: 999,
                    padding: "8px 18px",
                    fontSize: 18,
                    color: TITLES,
                    letterSpacing: 3,
                    backgroundColor: "#ffffff80",
                  }}
                >
                  {t}
                </div>
              )
            )}
          </div>
        </div>

        {/* BOTTOM — divider + stats + url */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              width: "100%",
              height: 1,
              backgroundColor: `${TITLES}22`,
              marginBottom: 26,
              display: "flex",
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", gap: 70 }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", color: ACCENT1, fontSize: 60, lineHeight: 1 }}>
                  6+
                </div>
                <div
                  style={{
                    display: "flex",
                    color: TITLES,
                    fontSize: 16,
                    letterSpacing: 2,
                    marginTop: 6,
                    opacity: 0.7,
                  }}
                >
                  ANNÉES D'EXPÉRIENCE
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", color: ACCENT1, fontSize: 60, lineHeight: 1 }}>
                  12+
                </div>
                <div
                  style={{
                    display: "flex",
                    color: TITLES,
                    fontSize: 16,
                    letterSpacing: 2,
                    marginTop: 6,
                    opacity: 0.7,
                  }}
                >
                  PROJETS LIVRÉS
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", color: ACCENT1, fontSize: 60, lineHeight: 1 }}>
                  24h
                </div>
                <div
                  style={{
                    display: "flex",
                    color: TITLES,
                    fontSize: 16,
                    letterSpacing: 2,
                    marginTop: 6,
                    opacity: 0.7,
                  }}
                >
                  TEMPS DE RÉPONSE
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                color: TITLES,
                fontSize: 22,
                letterSpacing: 3,
                opacity: 0.6,
              }}
            >
              LUCASMASSONI.COM
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Share Tech Mono",
          data: fontData,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}
