import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Image de partage (LinkedIn, X, messageries), dans la direction artistique
// du site : fond vert-noir, Archivo semi-étendue, sauge et ambre.

export const alt = "Lucas Massoni, Expert Salesforce, Revenue Cloud & Tableau";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const C = {
  bg: "#0b1412",
  panel: "#111c19",
  line: "rgba(255,255,255,0.10)",
  lineStrong: "rgba(255,255,255,0.20)",
  ink: "#f2f4f1",
  body: "#b3bdb7",
  muted: "#7d8a84",
  sage: "#7aa595",
  sageBright: "#9ccab8",
  blue: "#6f9caf",
  amber: "#f2a516",
};

const TREND = [21.6, 22.4, 22.1, 23.5, 24.2, 24.0, 25.1, 26.3, 26.0, 27.4, 28.2, 29.1];
const BARS = [38, 52, 46, 64, 58, 76, 70, 88];

export default async function Image() {
  const dir = join(process.cwd(), "src/app");
  const [display, medium, regular, mono, logo] = await Promise.all([
    readFile(join(dir, "fonts/Archivo-SemiExpanded-SemiBold.ttf")),
    readFile(join(dir, "fonts/Archivo-Medium.ttf")),
    readFile(join(dir, "fonts/Archivo-Regular.ttf")),
    readFile(join(dir, "ShareTechMono-Regular.ttf")),
    readFile(join(process.cwd(), "public/logo.png")),
  ]);
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  // Courbe de la carte de droite
  const cw = 300, ch = 110, tMin = 20, tMax = 30;
  const px = (i) => (i / (TREND.length - 1)) * cw;
  const py = (v) => ch - ((v - tMin) / (tMax - tMin)) * ch;
  const line = TREND.map((v, i) => `${i ? "L" : "M"}${px(i).toFixed(1)} ${py(v).toFixed(1)}`).join(" ");
  const area = `${line} L${cw} ${ch} L0 ${ch} Z`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: C.bg,
          position: "relative",
          fontFamily: "Archivo",
          color: C.ink,
        }}
      >
        {/* trame discrète */}
        {Array.from({ length: 11 }, (_, i) => (
          <div key={`v${i}`} style={{ position: "absolute", top: 0, bottom: 0, left: 660 + i * 54, width: 1, backgroundColor: "rgba(255,255,255,0.035)", display: "flex" }} />
        ))}
        {Array.from({ length: 12 }, (_, i) => (
          <div key={`h${i}`} style={{ position: "absolute", left: 660, right: 0, top: i * 54, height: 1, backgroundColor: "rgba(255,255,255,0.035)", display: "flex" }} />
        ))}

        {/* colonne texte */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "60px 0 56px 68px", width: 690 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <img src={logoSrc} width={40} height={44} alt="" />
            <div style={{ display: "flex", fontFamily: "Archivo Display", fontSize: 28, letterSpacing: -0.4 }}>Lucas Massoni</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontFamily: "Archivo", fontWeight: 500, fontSize: 22, color: C.sageBright, marginBottom: 20 }}>
              Consultant indépendant
            </div>
            {["Expert Salesforce,", "Revenue Cloud", "& Tableau."].map((t) => (
              <div key={t} style={{ display: "flex", fontFamily: "Archivo Display", fontSize: 58, lineHeight: 1.04, letterSpacing: -1.6, color: C.ink }}>
                {t}
              </div>
            ))}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 30, maxWidth: 600 }}>
              {["Revenue Cloud", "CPQ", "Tableau", "Data Migration"].map((t) => (
                <div
                  key={t}
                  style={{
                    display: "flex",
                    fontFamily: "Share Tech Mono",
                    fontSize: 18,
                    letterSpacing: 0.5,
                    color: C.body,
                    padding: "7px 14px",
                    borderRadius: 6,
                    border: `1px solid ${C.lineStrong}`,
                  }}
                >
                  {t}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 20, color: C.body }}>
            <div style={{ display: "flex", width: 10, height: 10, borderRadius: 5, backgroundColor: C.amber }} />
            <div style={{ display: "flex" }}>Disponible pour de nouveaux projets</div>
          </div>
        </div>

        {/* carte dashboard */}
        <div
          style={{
            position: "absolute",
            right: 56,
            top: 92,
            width: 400,
            display: "flex",
            flexDirection: "column",
            padding: "22px 24px 24px",
            borderRadius: 16,
            backgroundColor: C.panel,
            border: `1px solid ${C.lineStrong}`,
            boxShadow: "0 40px 80px -30px rgba(0,0,0,0.8)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, color: C.muted }}>
            <div style={{ display: "flex" }}>Revue de performance</div>
            <div style={{ display: "flex", fontFamily: "Share Tech Mono" }}>T3</div>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
            {[
              ["Marge brute", "31,4\u00a0%", "+2,3\u00a0pts"],
              ["Transformation", "27\u00a0%", "+4\u00a0pts"],
            ].map(([l, v, d]) => (
              <div key={l} style={{ display: "flex", flexDirection: "column", flex: 1, padding: "12px 14px", borderRadius: 10, border: `1px solid ${C.line}`, backgroundColor: "rgba(255,255,255,0.03)" }}>
                <div style={{ display: "flex", fontSize: 14, color: C.muted }}>{l}</div>
                <div style={{ display: "flex", fontFamily: "Archivo Display", fontSize: 30, letterSpacing: -0.8, marginTop: 6, whiteSpace: "nowrap" }}>{v}</div>
                <div style={{ display: "flex", fontSize: 14, color: C.sageBright, marginTop: 2, whiteSpace: "nowrap" }}>{d}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", marginTop: 14, padding: "14px 16px 12px", borderRadius: 10, border: `1px solid ${C.line}`, backgroundColor: "rgba(255,255,255,0.03)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: C.muted, marginBottom: 10 }}>
              <div style={{ display: "flex" }}>Marge mensuelle</div>
              <div style={{ display: "flex", color: C.amber }}>objectif 26 %</div>
            </div>
            <svg width={cw + 20} height={ch + 8} viewBox={`-4 -4 ${cw + 8} ${ch + 8}`}>
              <line x1="0" x2={cw} y1={py(26)} y2={py(26)} stroke={C.amber} strokeWidth="1.5" strokeDasharray="5 5" />
              <path d={area} fill={C.sage} fillOpacity="0.14" />
              <path d={line} fill="none" stroke={C.sageBright} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx={px(TREND.length - 1)} cy={py(TREND[TREND.length - 1])} r="5" fill={C.sageBright} />
            </svg>
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 70, marginTop: 14, padding: "0 4px" }}>
            {BARS.map((h, i) => (
              <div key={i} style={{ display: "flex", flex: 1, height: `${h}%`, borderRadius: 3, backgroundColor: i === BARS.length - 1 ? C.amber : C.sage, opacity: i === BARS.length - 1 ? 1 : 0.85 }} />
            ))}
          </div>
        </div>

        <div style={{ position: "absolute", right: 56, bottom: 52, display: "flex", fontFamily: "Share Tech Mono", fontSize: 20, letterSpacing: 1, color: C.muted }}>
          lucasmassoni.com
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Archivo Display", data: display, weight: 600, style: "normal" },
        { name: "Archivo", data: regular, weight: 400, style: "normal" },
        { name: "Archivo", data: medium, weight: 500, style: "normal" },
        { name: "Share Tech Mono", data: mono, weight: 400, style: "normal" },
      ],
    }
  );
}
