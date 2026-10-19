"use client";

// Visuels animés de la section Services : une chaîne qui montre comment tout
// s'enchaîne, puis un mini-scénario par carte. SVG + SMIL + CSS, aucune
// dépendance ; les animations respectent prefers-reduced-motion via CSS.

const SAGE = "#7aa595";
const SAGEB = "#9ccab8";
const TEAL = "#6fafac";
const BLUE = "#6f9caf";
const AMBER = "#f2a516";
const INKTXT = "#f3f5f2";
const MUTED = "#7f8d87";
const LINE = "rgba(255,255,255,0.14)";
const PANEL = "rgba(255,255,255,0.05)";

// Paquet qui circule le long d'un chemin
function Packet({ path, dur = 3, begin = "0s", color = SAGEB, r = 4 }) {
  return (
    <circle r={r} fill={color} className="pk">
      <animateMotion dur={`${dur}s`} begin={begin} repeatCount="indefinite" calcMode="spline" keyTimes="0;1" keySplines="0.45 0 0.25 1">
        <mpath href={`#${path}`} />
      </animateMotion>
      <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.85;1" dur={`${dur}s`} begin={begin} repeatCount="indefinite" />
    </circle>
  );
}

// ---------------------------------------------------------------------------
// La chaîne : sources → migration → Salesforce (CPQ, Apex/Flow) ↔ SAP → analytics → décision
// ---------------------------------------------------------------------------
export function ChainViz({ t, linked, setLinked }) {
  const on = (k) => (linked === k ? " is-on" : "");
  const hover = (k) => ({ onMouseEnter: () => setLinked(k), onMouseLeave: () => setLinked(null) });
  const L = t.chain;

  return (
    <div className="chain-wrap" aria-hidden="true">
      <svg className="chain" viewBox="0 0 1200 250" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="cg-sage" x1="0" x2="1">
            <stop offset="0" stopColor={SAGE} stopOpacity="0.2" />
            <stop offset="1" stopColor={SAGEB} stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* chemins (invisibles) suivis par les paquets, et leurs tracés visibles */}
        <g className="chain-paths">
          <path id="c-src1" d="M118 70 C 190 70, 200 125, 262 125" />
          <path id="c-src2" d="M118 125 L 262 125" />
          <path id="c-src3" d="M118 180 C 190 180, 200 125, 262 125" />
          <path id="c-mig" d="M398 125 L 486 125" />
          <path id="c-sap" d="M624 198 L 624 174" />
          <path id="c-sap2" d="M644 174 L 644 198" />
          <path id="c-ana" d="M762 125 L 850 125" />
          <path id="c-dec" d="M990 125 L 1060 125" />
        </g>

        <g className="chain-packets">
          <Packet path="c-src1" dur={2.6} begin="0s" color={SAGE} />
          <Packet path="c-src2" dur={2.2} begin="0.7s" color={BLUE} />
          <Packet path="c-src3" dur={2.8} begin="1.3s" color={AMBER} />
          <Packet path="c-src1" dur={2.6} begin="1.6s" color={SAGE} r={3} />
          <Packet path="c-mig" dur={1.6} begin="0.4s" color={SAGEB} />
          <Packet path="c-mig" dur={1.6} begin="1.2s" color={SAGEB} r={3} />
          <Packet path="c-sap" dur={1.4} begin="0s" color={TEAL} r={3} />
          <Packet path="c-sap2" dur={1.4} begin="0.7s" color={TEAL} r={3} />
          <Packet path="c-ana" dur={1.6} begin="0.9s" color={SAGEB} />
          <Packet path="c-ana" dur={1.6} begin="1.7s" color={BLUE} r={3} />
          <Packet path="c-dec" dur={1.4} begin="0.2s" color={AMBER} />
        </g>

        {/* sources */}
        <g className={`chain-node chain-src${on("migration")}`} {...hover("migration")}>
          {[["CRM", 70], ["ERP", 125], [L.files, 180]].map(([lab, y]) => (
            <g key={lab} transform={`translate(20 ${y - 20})`}>
              <rect width="98" height="40" rx="12" fill={PANEL} stroke={LINE} />
              <circle cx="18" cy="20" r="4" fill={lab === "CRM" ? SAGE : lab === "ERP" ? BLUE : AMBER} />
              <text x="32" y="25" className="chain-lab">{lab}</text>
            </g>
          ))}
        </g>

        {/* migration */}
        <g className={`chain-node${on("migration")}`} {...hover("migration")} transform="translate(262 95)">
          <rect width="136" height="60" rx="16" className="chain-box" />
          <text x="68" y="27" textAnchor="middle" className="chain-title">{L.migration}</text>
          <text x="68" y="45" textAnchor="middle" className="chain-sub">{L.migrationSub}</text>
        </g>

        {/* Salesforce : conteneur + deux pilules liées à CPQ et Apex/Flow/LWC */}
        <g transform="translate(486 60)">
          <rect width="276" height="114" rx="22" className="chain-box chain-box--big" />
          <text x="138" y="30" textAnchor="middle" className="chain-title chain-title--big">Salesforce</text>
          <g className={`chain-pill${on("cpq")}`} {...hover("cpq")} transform="translate(22 50)">
            <rect width="104" height="40" rx="20" className="chain-pill-bg" />
            <text x="52" y="25" textAnchor="middle" className="chain-lab">Revenue Cloud</text>
          </g>
          <g className={`chain-pill${on("dev")}`} {...hover("dev")} transform="translate(134 50)">
            <rect width="120" height="40" rx="20" className="chain-pill-bg" />
            <text x="60" y="25" textAnchor="middle" className="chain-lab">Apex · Flow · LWC</text>
          </g>
        </g>

        {/* SAP sous Salesforce, lien bidirectionnel */}
        <g className={`chain-node${on("sap")}`} {...hover("sap")} transform="translate(566 198)">
          <rect width="136" height="44" rx="14" className="chain-box" />
          <text x="68" y="22" textAnchor="middle" className="chain-title">SAP</text>
          <text x="68" y="36" textAnchor="middle" className="chain-sub">{L.sapSub}</text>
        </g>

        {/* analytics */}
        <g className={`chain-node${on("analytics")}`} {...hover("analytics")} transform="translate(850 95)">
          <rect width="140" height="60" rx="16" className="chain-box" />
          <text x="70" y="27" textAnchor="middle" className="chain-title">{L.analytics}</text>
          <text x="70" y="45" textAnchor="middle" className="chain-sub">{L.analyticsSub}</text>
        </g>

        {/* décision */}
        <g className="chain-node chain-end" transform="translate(1060 95)">
          <rect width="120" height="60" rx="16" className="chain-box chain-box--end" />
          <g transform="translate(16 18)" className="chain-bars">
            <rect x="0" y="14" width="5" height="10" rx="1.5" />
            <rect x="8" y="8" width="5" height="16" rx="1.5" />
            <rect x="16" y="2" width="5" height="22" rx="1.5" />
          </g>
          <text x="48" y="27" className="chain-title">{L.decision}</text>
          <text x="48" y="45" className="chain-sub">{L.decisionSub}</text>
        </g>
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Visuels de cartes
// ---------------------------------------------------------------------------

// Migration : table source → dédoublonnage → chargement batché dans Salesforce
function MigrationViz({ L }) {
  const rows = [0, 1, 2, 3, 4, 5];
  const dupes = [1, 4];
  return (
    <svg className="viz" viewBox="0 0 420 160" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <defs>
        <linearGradient id="mv-fill" x1="0" x2="1"><stop offset="0" stopColor={SAGE} /><stop offset="1" stopColor={SAGEB} /></linearGradient>
      </defs>
      {/* source */}
      <g transform="translate(14 16)">
        <text x="0" y="-4" className="viz-lab">{L.source}</text>
        <rect width="128" height="104" rx="10" fill={PANEL} stroke={LINE} />
        {rows.map((i) => {
          const dup = dupes.includes(i);
          return (
            <g key={i} transform={`translate(10 ${10 + i * 15})`} className={dup ? "mv-dup" : ""}>
              <rect width="108" height="8" rx="4" fill={dup ? AMBER : "rgba(255,255,255,0.16)"} opacity={dup ? 0.9 : 1} />
              {dup && <line x1="-2" y1="4" x2="110" y2="4" stroke="#0c1513" strokeWidth="2" className="mv-strike" />}
            </g>
          );
        })}
      </g>
      {/* lanes */}
      <g className="mv-lanes">
        <path id="mv-l1" d="M150 48 C 190 48, 200 70, 246 70" />
        <path id="mv-l2" d="M150 70 L 246 70" />
        <path id="mv-l3" d="M150 92 C 190 92, 200 70, 246 70" />
        <path id="mv-l4" d="M246 70 L 300 70" />
      </g>
      <Packet path="mv-l1" dur={2.4} begin="0s" color={SAGEB} r={3.5} />
      <Packet path="mv-l2" dur={2} begin="0.8s" color={BLUE} r={3.5} />
      <Packet path="mv-l3" dur={2.6} begin="1.5s" color={SAGE} r={3.5} />
      <Packet path="mv-l4" dur={1.2} begin="0.3s" color={SAGEB} r={3.5} />
      <Packet path="mv-l4" dur={1.2} begin="0.9s" color={SAGEB} r={3} />
      {/* filtre qualité */}
      <g transform="translate(222 50)">
        <rect width="48" height="40" rx="12" fill="rgba(242,165,22,0.14)" stroke="rgba(242,165,22,0.5)" />
        <text x="24" y="17" textAnchor="middle" className="viz-lab viz-lab--amber">{L.dedupe}</text>
        <text x="24" y="31" textAnchor="middle" className="viz-num">-2</text>
      </g>
      {/* cible */}
      <g transform="translate(304 16)">
        <text x="0" y="-4" className="viz-lab">Salesforce</text>
        <rect width="102" height="104" rx="10" fill="rgba(122,165,149,0.1)" stroke="rgba(122,165,149,0.45)" />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x="10" y={12 + i * 15} width="82" height="8" rx="4" fill="url(#mv-fill)" className="mv-land" style={{ animationDelay: `${0.6 + i * 0.5}s` }} />
        ))}
        <text x="51" y="92" textAnchor="middle" className="viz-num viz-num--sage">11 902</text>
      </g>
      {/* progression */}
      <g transform="translate(14 138)">
        <rect width="392" height="6" rx="3" fill="rgba(255,255,255,0.1)" />
        <rect width="392" height="6" rx="3" fill="url(#mv-fill)" className="mv-progress" />
        <text x="0" y="18" className="viz-lab">{L.batch}</text>
        <text x="392" y="18" textAnchor="end" className="viz-lab viz-lab--sage">{L.rollback}</text>
      </g>
    </svg>
  );
}

// Analytics : KPIs, courbe qui se trace, barres, donut
function AnalyticsViz({ L }) {
  const pts = [[0, 60], [30, 48], [60, 54], [90, 36], [120, 42], [150, 22], [180, 28], [210, 10]];
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");
  const area = `${line} L210 70 L0 70 Z`;
  const bars = [30, 48, 40, 62, 52, 72, 66];
  return (
    <svg className="viz" viewBox="0 0 420 160" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <defs>
        <linearGradient id="an-area" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={SAGEB} stopOpacity="0.5" /><stop offset="1" stopColor={SAGEB} stopOpacity="0" /></linearGradient>
      </defs>
      {/* KPI */}
      {[[L.kpi1, "+38 %", SAGEB], [L.kpi2, "1,2 M€", INKTXT], [L.kpi3, "97 %", AMBER]].map(([lab, val, col], i) => (
        <g key={lab} transform={`translate(${14 + i * 134} 12)`}>
          <rect width="124" height="38" rx="10" fill={PANEL} stroke={LINE} />
          <text x="10" y="15" className="viz-lab">{lab}</text>
          <text x="10" y="31" className="viz-num" fill={col}>{val}</text>
        </g>
      ))}
      {/* courbe */}
      <g transform="translate(14 68)">
        <rect width="236" height="80" rx="10" fill={PANEL} stroke={LINE} />
        <g transform="translate(14 6)">
          {[0, 1, 2].map((i) => <line key={i} x1="0" x2="210" y1={10 + i * 28} y2={10 + i * 28} stroke="rgba(255,255,255,0.07)" />)}
          <path d={area} fill="url(#an-area)" className="an-area" />
          <path d={line} fill="none" stroke={SAGEB} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="an-line" />
          <circle cx="210" cy="10" r="4" fill={AMBER} className="an-dot" />
        </g>
      </g>
      {/* barres */}
      <g transform="translate(262 68)">
        <rect width="80" height="80" rx="10" fill={PANEL} stroke={LINE} />
        {bars.map((h, i) => (
          <rect key={i} x={9 + i * 9.5} y={70 - h * 0.82} width="6" height={h * 0.82} rx="2" fill={i === 5 ? AMBER : SAGE} className="an-bar" style={{ animationDelay: `${i * -0.45}s` }} />
        ))}
      </g>
      {/* donut */}
      <g transform="translate(354 68)">
        <rect width="52" height="80" rx="10" fill={PANEL} stroke={LINE} />
        <g transform="translate(26 40)" className="an-donut">
          {[[0, 95, SAGE], [95, 60, TEAL], [155, 55, BLUE], [210, 40, AMBER], [250, 110, SAGEB]].map(([start, len, col]) => (
            <circle key={start} r="15" fill="none" stroke={col} strokeWidth="7" strokeDasharray={`${(len / 360) * 94.2} 94.2`} transform={`rotate(${start - 90})`} />
          ))}
        </g>
      </g>
    </svg>
  );
}

// CPQ : un devis qui se compose ligne par ligne, puis se signe
function QuoteViz({ L }) {
  const lines = [
    [L.q1, "38 400 €"],
    [L.q2, "7 200 €"],
    [L.q3, "-4 560 €"],
  ];
  return (
    <svg className="viz" viewBox="0 0 420 160" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <g transform="translate(40 10)">
        <rect width="340" height="140" rx="12" fill={PANEL} stroke={LINE} />
        <text x="16" y="22" className="viz-lab">{L.quote}</text>
        <text x="324" y="22" textAnchor="end" className="viz-lab viz-lab--sage">Q-2026-0417</text>
        <line x1="16" x2="324" y1="30" y2="30" stroke={LINE} />
        {lines.map(([lab, val], i) => (
          <g key={lab} transform={`translate(16 ${50 + i * 22})`}>
            <g className="q-row" style={{ animationDelay: `${0.4 + i * 0.9}s` }}>
              <circle cx="4" cy="-4" r="3" fill={i === 2 ? AMBER : SAGE} />
              <text x="14" y="0" className="viz-txt">{lab}</text>
              <text x="308" y="0" textAnchor="end" className="viz-num viz-num--sm" fill={i === 2 ? AMBER : INKTXT}>{val}</text>
            </g>
          </g>
        ))}
        <line x1="16" x2="324" y1="110" y2="110" stroke={LINE} />
        <g className="q-row" style={{ animationDelay: "3.2s" }}>
          <text x="16" y="130" className="viz-txt viz-txt--strong">{L.total}</text>
          <text x="324" y="130" textAnchor="end" className="viz-num" fill={SAGEB}>41 040 €</text>
        </g>
        <g transform="translate(196 98)">
          <g className="q-stamp">
            <rect width="76" height="26" rx="13" fill="none" stroke={SAGEB} strokeWidth="2" />
            <text x="38" y="17" textAnchor="middle" className="viz-lab viz-lab--sage">{L.signed}</text>
          </g>
        </g>
      </g>
    </svg>
  );
}

// Dev : éditeur Apex + Flow en parallèle, avec un événement qui traverse
function CodeViz({ L }) {
  const toks = [
    [[0, 44, SAGE], [48, 70, INKTXT]],
    [[12, 30, BLUE], [46, 60, TEAL], [110, 24, AMBER]],
    [[24, 36, TEAL], [64, 80, INKTXT]],
    [[24, 54, BLUE], [82, 40, SAGEB]],
    [[12, 30, BLUE], [46, 26, AMBER]],
    [[0, 10, INKTXT]],
  ];
  return (
    <svg className="viz" viewBox="0 0 420 160" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      {/* éditeur */}
      <g transform="translate(14 14)">
        <rect width="196" height="132" rx="10" fill="rgba(0,0,0,0.35)" stroke={LINE} />
        <circle cx="12" cy="11" r="3" fill="rgba(255,255,255,0.25)" /><circle cx="22" cy="11" r="3" fill="rgba(255,255,255,0.25)" /><circle cx="32" cy="11" r="3" fill="rgba(255,255,255,0.25)" />
        <text x="186" y="14" textAnchor="end" className="viz-lab">Apex · .cls</text>
        {toks.map((line, i) => (
          <g key={i} transform={`translate(12 ${32 + i * 17})`}>
            <text x="0" y="6" className="viz-ln">{i + 1}</text>
            {line.map(([x, w, c], j) => (
              <rect key={j} x={16 + x} y="0" width={w} height="7" rx="3.5" fill={c} opacity="0.85" className="cv-tok" style={{ animationDelay: `${i * 0.35 + j * 0.12}s` }} />
            ))}
          </g>
        ))}
      </g>
      {/* flow */}
      <g transform="translate(226 14)">
        <rect width="180" height="132" rx="10" fill={PANEL} stroke={LINE} />
        <text x="12" y="16" className="viz-lab">Flow</text>
        <path id="cv-f1" d="M34 50 L90 50" /><path id="cv-f2" d="M90 50 L146 50" /><path id="cv-f3" d="M90 68 L90 104" />
        <g className="cv-links">
          <path d="M34 50 L90 50 L146 50" /><path d="M90 68 L90 104" />
        </g>
        <Packet path="cv-f1" dur={1.4} begin="0s" color={SAGEB} r={3} />
        <Packet path="cv-f2" dur={1.4} begin="1.4s" color={SAGEB} r={3} />
        <Packet path="cv-f3" dur={1.2} begin="1.4s" color={AMBER} r={3} />
        <circle cx="34" cy="50" r="12" fill={SAGE} />
        <text x="34" y="78" textAnchor="middle" className="viz-lab">{L.trigger}</text>
        <rect x="76" y="36" width="28" height="28" rx="6" fill="rgba(242,165,22,0.18)" stroke={AMBER} transform="rotate(45 90 50)" />
        <text x="90" y="24" textAnchor="middle" className="viz-lab viz-lab--amber">{L.decisionQ}</text>
        <rect x="132" y="38" width="30" height="24" rx="7" fill="rgba(122,165,149,0.2)" stroke={SAGEB} />
        <text x="147" y="78" textAnchor="middle" className="viz-lab">{L.action}</text>
        <rect x="68" y="104" width="44" height="18" rx="9" fill="rgba(255,255,255,0.08)" stroke={LINE} />
        <text x="90" y="116" textAnchor="middle" className="viz-lab">Apex</text>
      </g>
    </svg>
  );
}

// SAP : cœur SAP avec satellites et échanges bidirectionnels
function NodesViz({ L }) {
  const sats = [
    ["Salesforce", 60, 44, "IDoc"],
    ["BI", 340, 40, "OData"],
    [L.web, 350, 118, "REST"],
    [L.files, 70, 124, "SFTP"],
  ];
  return (
    <svg className="viz" viewBox="0 0 420 160" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <defs>
        <radialGradient id="sap-core"><stop offset="0" stopColor={SAGEB} /><stop offset="1" stopColor={SAGE} /></radialGradient>
      </defs>
      {sats.map(([lab, x, y], i) => (
        <g key={lab}>
          <path id={`sap-l${i}`} d={`M210 80 L${x} ${y}`} />
          <path id={`sap-r${i}`} d={`M${x} ${y} L210 80`} />
        </g>
      ))}
      <g className="sap-links">
        {sats.map(([lab, x, y]) => <line key={lab} x1="210" y1="80" x2={x} y2={y} />)}
      </g>
      {sats.map(([lab, x, y, proto], i) => (
        <g key={lab}>
          <Packet path={`sap-l${i}`} dur={2.2} begin={`${i * 0.5}s`} color={SAGEB} r={3} />
          <Packet path={`sap-r${i}`} dur={2.2} begin={`${i * 0.5 + 1.1}s`} color={BLUE} r={3} />
          <g transform={`translate(${(210 + x) / 2} ${(80 + y) / 2})`}>
            <rect x="-20" y="-8" width="40" height="16" rx="8" fill="#0c1513" stroke={LINE} />
            <text y="4" textAnchor="middle" className="viz-lab">{proto}</text>
          </g>
          <g transform={`translate(${x} ${y})`}>
            <rect x="-40" y="-16" width="80" height="32" rx="10" fill={PANEL} stroke={LINE} />
            <text y="4" textAnchor="middle" className="viz-txt">{lab}</text>
          </g>
        </g>
      ))}
      <g transform="translate(210 80)">
        <circle r="30" fill="none" stroke={SAGE} strokeWidth="1.5" className="sap-ring" />
        <circle r="30" fill="none" stroke={SAGE} strokeWidth="1.5" className="sap-ring" style={{ animationDelay: "1.2s" }} />
        <circle r="26" fill="url(#sap-core)" />
        <text y="5" textAnchor="middle" className="viz-core">SAP</text>
      </g>
    </svg>
  );
}

// Mobile : deux écrans avec un vrai contenu qui défile
function PhoneViz() {
  return (
    <div className="viz viz-phone" aria-hidden="true">
      <span className="phone">
        <i>
          <b className="ph-bar" />
          <b className="ph-title" />
          <b className="ph-chart" />
          <b className="ph-row" /><b className="ph-row" /><b className="ph-row" />
        </i>
      </span>
      <span className="phone phone--2">
        <i>
          <b className="ph-bar" />
          <b className="ph-tile" /><b className="ph-tile ph-tile--2" />
          <b className="ph-row" /><b className="ph-row" />
        </i>
      </span>
    </div>
  );
}

export const VIZ = {
  migration: MigrationViz,
  analytics: AnalyticsViz,
  cpq: QuoteViz,
  dev: CodeViz,
  sap: NodesViz,
  mobile: PhoneViz,
};
