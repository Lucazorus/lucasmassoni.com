"use client";

// Visualisation du hero : un pipeline de données en six actes, en boucle.
// Ingestion → Nettoyage → Structuration → Modélisation → Visualisation → Impact.
// Les mêmes enregistrements traversent toute la séquence : ils arrivent des
// sources en désordre, sont contrôlés, alignés en table, répartis dans un
// schéma en étoile, puis alimentent un dashboard commercial.
// SVG piloté par une horloge rAF, chorégraphie déterministe, sans aléa.

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

const W = 720;
const H = 640;

// Actes : début, durée (secondes)
const ACTS = [
  { key: "ingest", t0: 0, d: 3.6 },
  { key: "cleanse", t0: 3.6, d: 3.6 },
  { key: "structure", t0: 7.2, d: 3.4 },
  { key: "model", t0: 10.6, d: 3.6 },
  { key: "visualise", t0: 14.2, d: 4.8 },
  { key: "impact", t0: 19.0, d: 4.0 },
];
const LOOP = 23.0;

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a, b, t) => a + (b - a) * t;
const prog = (T, start, dur, ease = easeOut) => ease(clamp01((T - start) / dur));

const C = {
  ink: "#f2f4f1",
  body: "#b3bdb7",
  muted: "#7d8a84",
  line: "rgba(255,255,255,0.1)",
  lineStrong: "rgba(255,255,255,0.2)",
  panel: "rgba(255,255,255,0.035)",
  sage: "#7aa595",
  sageBright: "#9ccab8",
  blue: "#6f9caf",
  amber: "#f2a516",
};
const SRC_COLORS = [C.sage, C.blue, C.amber];

// Générateur pseudo-aléatoire à graine fixe : la scène est identique à chaque boucle
const rng = (() => {
  let seed = 20261019;
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
})();

// ---------------------------------------------------------------------------
// Géométrie
// ---------------------------------------------------------------------------
const M = 24;
const COLS = 6;
const ROWS = 8;
const N = COLS * ROWS;

// Sources (acte 1)
const SRC = [0, 1, 2].map((i) => ({ x: M + i * 232, y: 72, w: 208, h: 40 }));

// Zone de staging (acte 1-2) : grille bousculée
const STG = { x: M, y: 146, w: W - 2 * M, h: 320 };

// Table (acte 3)
const TBL = { x: 48, y: 146, w: W - 96, h: 320, headY: 176, rowY0: 204, rowH: 31, colW: 100, colX0: 72 };

// Modèle de données Salesforce (acte 4) : objets standard et relations
const OBJ = [
  { key: "lead", x: 120, y: 318 },
  { key: "account", x: 360, y: 232 },
  { key: "contact", x: 360, y: 404 },
  { key: "opportunity", x: 584, y: 232 },
  { key: "contract", x: 584, y: 404 },
];
const OBJ_W = 118, OBJ_H = 40;
// relations : de, vers, libellé (clé de traduction), ordre d'apparition
const EDGES = [
  { from: 0, to: 1, label: "convert", step: 1 },
  { from: 0, to: 2, label: "convert", step: 1, hideLabel: true },
  { from: 0, to: 3, label: "convert", step: 1, hideLabel: true },
  { from: 2, to: 1, label: "accountId", step: 2 },
  { from: 3, to: 1, label: "accountId", step: 2 },
  { from: 3, to: 4, label: "closedWon", step: 3 },
];
// colonne → objet
const COL_NODE = [0, 1, 2, 3, 4, 3];

// Dashboard (acte 5)
const KPI = { y: 104, h: 84, w: (W - 2 * M - 3 * 14) / 4 };
const CH = { y: 212, h: 230 };
const WF = { x: M, w: 360 };
const LN = { x: M + 360 + 16, w: W - M - (M + 360 + 16) };
const BOT = { y: 458, h: 54 };

// Enregistrements : source, colonne, ligne, anomalie, positions par acte
const RECORDS = Array.from({ length: N }, (_, i) => {
  const c = i % COLS;
  const r = Math.floor(i / COLS);
  const src = c < 2 ? 0 : c < 4 ? 1 : 2;
  const u = rng();
  const flag = u < 0.1 ? "dup" : u < 0.24 ? "null" : null;
  const jx = (rng() - 0.5) * 26;
  const jy = (rng() - 0.5) * 14;
  const wRaw = 46 + Math.round(rng() * 40);
  const p1 = { x: STG.x + 16 + c * ((STG.w - 32) / COLS) + jx, y: STG.y + 18 + r * 38 + jy, w: wRaw };
  const p3 = { x: TBL.colX0 + c * TBL.colW, y: TBL.rowY0 + r * TBL.rowH, w: 64 };
  const node = OBJ[COL_NODE[c]];
  const slot = Math.floor(rng() * 10);
  const p4 = { x: node.x - OBJ_W / 2 + 6 + slot * 11, y: node.y + OBJ_H / 2 + 12 + Math.floor(rng() * 2) * 9, w: 6 };
  const k = c % 4;
  const p5 = { x: M + k * (KPI.w + 14) + KPI.w / 2 + (rng() - 0.5) * 40, y: KPI.y + KPI.h / 2 + (rng() - 0.5) * 20, w: 6 };
  return { i, c, r, src, flag, p1, p3, p4, p5 };
});

const fmt = (lang, v, digits = 1) =>
  new Intl.NumberFormat(lang === "fr" ? "fr-FR" : "en-GB", { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(v);
const fmtInt = (lang, v) => new Intl.NumberFormat(lang === "fr" ? "fr-FR" : "en-GB").format(Math.round(v));

// ---------------------------------------------------------------------------
export default function PipelineViz({ active, lang = "fr", L }) {
  const reduced = useReducedMotion();
  const [T, setT] = useState(reduced ? ACTS[4].t0 + ACTS[4].d - 0.2 : 0);
  const raf = useRef(0);
  const last = useRef(0);
  const acc = useRef(0);

  useEffect(() => {
    if (reduced) { setT(ACTS[4].t0 + ACTS[4].d - 0.2); return; }
    if (!active) return;
    const step = (now) => {
      if (last.current) {
        const dt = Math.min(0.05, (now - last.current) / 1000);
        acc.current = (acc.current + dt) % LOOP;
        setT(acc.current);
      }
      last.current = now;
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(raf.current); last.current = 0; };
  }, [active, reduced]);

  const actIdx = ACTS.reduce((acc2, a, i) => (T >= a.t0 ? i : acc2), 0);
  const [A1, A2, A3, A4, A5, A6] = ACTS;
  const globalA = 1 - prog(T, LOOP - 0.8, 0.8, easeInOut);

  // ---- acte 1 : arrivée des enregistrements
  const srcIn = (i) => prog(T, A1.t0 + 0.1 + i * 0.15, 0.5);
  const arrive = (rec) => prog(T, A1.t0 + 0.7 + rec.r * 0.16 + rec.c * 0.07, 0.9, easeInOut);

  // ---- acte 2 : balayage de contrôle
  const scanP = prog(T, A2.t0 + 0.2, 2.6, easeInOut);
  const scanY = STG.y + scanP * STG.h;
  const qcIn = prog(T, A2.t0 + 0.2, 0.5);

  // ---- acte 3 : alignement
  const tblIn = prog(T, A3.t0, 0.6);
  const align = (rec) => prog(T, A3.t0 + 0.25 + rec.r * 0.14, 0.9, easeInOut);

  // ---- acte 4 : étoile
  const objIn = (i) => prog(T, A4.t0 + [0, 0.45, 0.6, 0.75, 1.5][i], 0.5);
  const edgeIn = (step) => prog(T, A4.t0 + [0, 0.5, 1.1, 1.6][step], 0.7, easeInOut);
  const toStar = (rec) => prog(T, A4.t0 + 0.25 + (rec.i % 12) * 0.05, 1.0, easeInOut);

  // ---- acte 5 : dashboard
  const toKpi = (rec) => prog(T, A5.t0 + 0.1 + (rec.i % 12) * 0.04, 0.9, easeInOut);
  const recFade = prog(T, A5.t0 + 1.0, 0.5);
  const dashIn = prog(T, A5.t0 + 0.6, 0.6);
  const kpiP = (i) => prog(T, A5.t0 + 0.9 + i * 0.2, 1.1);
  const wfP = (i) => prog(T, A5.t0 + 1.7 + i * 0.25, 0.55);
  const targetP = prog(T, A5.t0 + 2.0, 0.5);
  const lineP = prog(T, A5.t0 + 2.6, 1.6, easeInOut);

  // ---- acte 6 : impact
  const dim = 1 - 0.7 * prog(T, A6.t0, 0.6);
  const impIn = prog(T, A6.t0 + 0.3, 0.7);
  const impRow = (i) => prog(T, A6.t0 + 0.8 + i * 0.3, 0.5);

  // Données du dashboard
  const kpis = L.kpis;
  const wfBase = L.waterfall.base;
  let run = 0;
  const wfBars = L.waterfall.steps.map((s, i) => {
    const isTotal = i === 0 || i === L.waterfall.steps.length - 1;
    const start = isTotal ? wfBase : run;
    const end = isTotal ? s.value : run + s.value;
    run = end;
    return { ...s, start, end, isTotal };
  });
  const wfMax = Math.max(...wfBars.map((b) => Math.max(b.start, b.end))) + 1.2;
  const wfPlotY = CH.y + 46, wfPlotH = CH.h - 74;
  const yOf = (v) => wfPlotY + wfPlotH - ((v - wfBase) / (wfMax - wfBase)) * wfPlotH;
  const wfBand = (WF.w - 24) / wfBars.length;

  const trend = [21.6, 22.4, 22.1, 23.5, 24.2, 24.0, 25.1, 26.3, 26.0, 27.4, 28.2, 29.1];
  const target = 26;
  const lnPlotX = LN.x + 12, lnPlotW = LN.w - 24, lnPlotY = CH.y + 46, lnPlotH = CH.h - 86;
  const tMin = 20, tMax = 30;
  const px = (i) => lnPlotX + (i / (trend.length - 1)) * lnPlotW;
  const py = (v) => lnPlotY + lnPlotH - ((v - tMin) / (tMax - tMin)) * lnPlotH;
  const linePath = trend.map((v, i) => `${i ? "L" : "M"}${px(i).toFixed(1)} ${py(v).toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L${px(trend.length - 1).toFixed(1)} ${(lnPlotY + lnPlotH).toFixed(1)} L${lnPlotX} ${(lnPlotY + lnPlotH).toFixed(1)} Z`;

  // Phase de scène : avant / pendant / après le dashboard
  const showPipeline = T < A5.t0 + 1.6;
  const showDash = T >= A5.t0;

  // Compteurs de contrôle qualité (acte 2)
  const dups = RECORDS.filter((r) => r.flag === "dup").length;
  const nulls = RECORDS.filter((r) => r.flag === "null").length;
  const scannedDups = RECORDS.filter((r) => r.flag === "dup" && r.p1.y < scanY).length;
  const scannedNulls = RECORDS.filter((r) => r.flag === "null" && r.p1.y < scanY).length;

  // Comptes par objet (acte 4)
  const nodeCounts = OBJ.map((_, n) => RECORDS.filter((r) => r.flag !== "dup" && COL_NODE[r.c] === n).length);

  return (
    <svg className="exec" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true" style={{ opacity: globalA }}>
      {/* En-tête : titre de l'acte */}
      <g>
        <text x={M} y="30" className="ex-lab">{L.kicker}</text>
        <text x={W - M} y="30" textAnchor="end" className="ex-mono ex-muted">{String(actIdx + 1).padStart(2, "0")} / 06</text>
        {ACTS.map((a, i) => {
          const p = prog(T, a.t0, 0.5);
          const next = ACTS[i + 1];
          const out = next ? 1 - prog(T, next.t0, 0.35) : 1;
          const o = Math.min(p, out);
          if (o <= 0) return null;
          return (
            <g key={a.key} opacity={o}>
              <text x={M} y="56" className="ex-title" style={{ fontSize: 19 }}>{L.titles[i]}</text>
              <text x={M} y="74" className="ex-small ex-muted">{L.subs[i]}</text>
            </g>
          );
        })}
      </g>

      {/* ── Actes 1 à 4 : sources, staging, table, étoile ───────────────── */}
      {showPipeline && (
        <g opacity={1 - prog(T, A5.t0 + 1.0, 0.6)}>
          {/* sources */}
          {SRC.map((s, i) => {
            const p = srcIn(i) * (1 - prog(T, A3.t0, 0.5));
            return (
              <g key={i} opacity={p} transform={`translate(0 ${(1 - p) * 6})`}>
                <rect x={s.x} y={s.y + 22} width={s.w} height={s.h} rx="8" fill={C.panel} stroke={C.line} />
                <circle cx={s.x + 16} cy={s.y + 42} r="3.5" fill={SRC_COLORS[i]} />
                <text x={s.x + 28} y={s.y + 46} className="ex-small">{L.sources[i]}</text>
                <text x={s.x + s.w - 12} y={s.y + 46} textAnchor="end" className="ex-tick">{L.sourceSub[i]}</text>
              </g>
            );
          })}

          {/* table (acte 3) */}
          <g opacity={tblIn * (1 - prog(T, A4.t0, 0.6))}>
            <rect x={TBL.x} y={TBL.y} width={TBL.w} height={TBL.h} rx="8" fill={C.panel} stroke={C.line} />
            <line x1={TBL.x + 12} x2={TBL.x + TBL.w - 12} y1={TBL.headY + 10} y2={TBL.headY + 10} stroke={C.lineStrong} />
            {L.cols.map((cName, c) => (
              <text key={cName} x={TBL.colX0 + c * TBL.colW} y={TBL.headY} className="ex-lab">{cName}</text>
            ))}
            {Array.from({ length: ROWS }, (_, r) => (
              <line key={r} x1={TBL.x + 12} x2={TBL.x + TBL.w - 12} y1={TBL.rowY0 + r * TBL.rowH + 16} y2={TBL.rowY0 + r * TBL.rowH + 16} stroke={C.line} />
            ))}
          </g>

          {/* modèle de données Salesforce (acte 4) */}
          <g opacity={objIn(0)}>
            <defs>
              <marker id="pv-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0 0 L8 4 L0 8 Z" fill={C.sageBright} />
              </marker>
            </defs>
            {EDGES.map((e, i) => {
              const p = edgeIn(e.step);
              const from = OBJ[e.from], to = OBJ[e.to];
              // départ/arrivée au bord des cartes
              const dx = to.x - from.x, dy = to.y - from.y;
              const len = Math.hypot(dx, dy) || 1;
              const ux = dx / len, uy = dy / len;
              const offFrom = Math.min(OBJ_W / 2 / Math.max(Math.abs(ux), 0.01), OBJ_H / 2 / Math.max(Math.abs(uy), 0.01));
              const x1 = from.x + ux * offFrom, y1 = from.y + uy * offFrom;
              const x2e = to.x - ux * (offFrom + 4), y2e = to.y - uy * (offFrom + 4);
              const x2 = lerp(x1, x2e, p), y2 = lerp(y1, y2e, p);
              const mx = (x1 + x2e) / 2, my = (y1 + y2e) / 2;
              return (
                <g key={i} opacity={p > 0 ? 1 : 0}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.sageBright} strokeWidth="1.25" strokeDasharray={e.step === 1 ? "4 4" : "0"} markerEnd={p > 0.95 ? "url(#pv-arrow)" : undefined} opacity="0.8" />
                  {!e.hideLabel && (
                    <g opacity={prog(T, A4.t0 + [0, 0.5, 1.1, 1.6][e.step] + 0.6, 0.4)}>
                      <rect x={mx - 34} y={my - 9} width="68" height="18" rx="4" fill="#0f1917" stroke={C.line} />
                      <text x={mx} y={my + 3.5} textAnchor="middle" className="ex-tick">{L.edges[e.label]}</text>
                    </g>
                  )}
                </g>
              );
            })}
            {OBJ.map((o, i) => {
              const p = objIn(i);
              return (
                <g key={o.key} opacity={p} transform={`translate(0 ${(1 - p) * 6})`}>
                  <rect x={o.x - OBJ_W / 2} y={o.y - OBJ_H / 2} width={OBJ_W} height={OBJ_H} rx="7" fill="#121c1a" stroke={i === 1 ? C.sageBright : C.lineStrong} />
                  <rect x={o.x - OBJ_W / 2 + 10} y={o.y - 9} width="18" height="18" rx="4" fill={[C.amber, C.sageBright, C.blue, C.sage, C.sage][i]} />
                  <text x={o.x - OBJ_W / 2 + 36} y={o.y - 1} className="ex-small" style={{ fontWeight: 600 }}>{L.objects[i].label}</text>
                  <text x={o.x - OBJ_W / 2 + 36} y={o.y + 11} className="ex-tick">{L.objects[i].api}</text>
                  <text x={o.x + OBJ_W / 2} y={o.y + OBJ_H / 2 + 36} textAnchor="end" className="ex-tick" opacity={toStar({ i: 11 })}>{nodeCounts[i]} {L.records}</text>
                </g>
              );
            })}
          </g>

          {/* balayage qualité (acte 2) */}
          {actIdx === 1 && scanP > 0 && scanP < 1 && (
            <g>
              <rect x={STG.x} y={STG.y} width={STG.w} height={Math.max(0, scanY - STG.y)} fill="rgba(122,165,149,0.05)" />
              <line x1={STG.x} x2={STG.x + STG.w} y1={scanY} y2={scanY} stroke={C.sageBright} strokeWidth="1" opacity="0.9" />
            </g>
          )}
          <g opacity={qcIn * (1 - prog(T, A3.t0, 0.4))} transform={`translate(0 ${(1 - qcIn) * 4})`}>
            <rect x={W - M - 196} y={STG.y + STG.h + 10} width="196" height="44" rx="8" fill="#121c1a" stroke={C.line} />
            <text x={W - M - 184} y={STG.y + STG.h + 28} className="ex-lab">{L.scan}</text>
            <text x={W - M - 184} y={STG.y + STG.h + 44} className="ex-small">
              <tspan fill={C.amber}>{scannedDups}</tspan> {L.dupes}<tspan fill={C.muted}>  ·  </tspan><tspan fill={C.blue}>{scannedNulls}</tspan> {L.nulls}
            </text>
          </g>

          {/* enregistrements */}
          {RECORDS.map((rec) => {
            const a1 = arrive(rec);
            if (a1 <= 0) return null;
            const s = SRC[rec.src];
            const start = { x: s.x + 20 + (rec.c % 2) * 60, y: s.y + 62 };
            let x = lerp(start.x, rec.p1.x, a1);
            let y = lerp(start.y, rec.p1.y, a1);
            let w = rec.p1.w;
            let op = a1;
            let h = 8;
            let fill = rec.flag === "null" ? "none" : rec.flag === "dup" ? C.amber : SRC_COLORS[rec.src];
            let stroke = rec.flag === "null" ? C.lineStrong : "none";
            let strike = 0;

            // acte 2 : après le passage du balayage
            const passed = T >= A2.t0 && rec.p1.y < scanY;
            const sinceScan = passed ? prog(T, A2.t0 + 0.2 + ((rec.p1.y - STG.y) / STG.h) * 2.6, 0.5) : 0;
            if (passed) {
              w = lerp(rec.p1.w, 64, sinceScan);
              if (rec.flag === "dup") { op = a1 * lerp(1, 0.25, sinceScan); strike = sinceScan; }
              if (rec.flag === "null") { fill = SRC_COLORS[rec.src]; stroke = "none"; op = a1 * lerp(0.5, 1, sinceScan); }
            }
            // acte 3 : alignement en table ; les doublons disparaissent
            const a3 = align(rec);
            if (a3 > 0) {
              if (rec.flag === "dup") op = 0.25 * (1 - a3);
              x = lerp(x, rec.p3.x, a3);
              y = lerp(y, rec.p3.y, a3);
              w = lerp(w, rec.p3.w, a3);
              fill = rec.flag === "dup" ? C.amber : lerpColor(fill, C.sage, a3);
              stroke = "none";
            }
            if (rec.flag === "dup" && T >= A3.t0 + 1.4) return null;
            // acte 4 : vers l'étoile, en pastilles
            const a4 = toStar(rec);
            if (a4 > 0) {
              x = lerp(x, rec.p4.x, a4);
              y = lerp(y, rec.p4.y, a4);
              w = lerp(w, rec.p4.w, a4);
              h = lerp(8, 6, a4);
              fill = [C.amber, C.sageBright, C.blue, C.sage, C.sage][COL_NODE[rec.c]];
            }
            // acte 5 : vers les indicateurs, puis fondu
            const a5 = toKpi(rec);
            if (a5 > 0) {
              x = lerp(x, rec.p5.x, a5);
              y = lerp(y, rec.p5.y, a5);
              op *= 1 - recFade;
            }
            if (op <= 0.01) return null;
            const rx = Math.min(h / 2, 4);
            return (
              <g key={rec.i} opacity={op}>
                <rect x={x} y={y - h / 2} width={Math.max(w, 6)} height={h} rx={rx} fill={fill} stroke={stroke} />
                {strike > 0 && <line x1={x} x2={x + w * strike} y1={y} y2={y} stroke="#0b1412" strokeWidth="2" />}
              </g>
            );
          })}
        </g>
      )}

      {/* ── Acte 5 : dashboard commercial ─────────────────────────────── */}
      {showDash && (
        <g opacity={dashIn * dim}>
          <text x={M} y={KPI.y - 12} className="ex-lab">{L.dash.title}</text>
          <text x={W - M} y={KPI.y - 12} textAnchor="end" className="ex-mono ex-muted">{L.dash.period}</text>

          {kpis.map((k, i) => {
            const p = kpiP(i);
            const x = M + i * (KPI.w + 14);
            const val = k.value * p;
            const isInt = k.digits === 0;
            return (
              <g key={k.label} opacity={0.3 + 0.7 * p}>
                <rect x={x} y={KPI.y} width={KPI.w} height={KPI.h} rx="8" fill={C.panel} stroke={C.line} />
                <text x={x + 14} y={KPI.y + 24} className="ex-lab">{k.label}</text>
                <text x={x + 14} y={KPI.y + 54} className="ex-kpi" opacity={p > 0 ? 1 : 0}>
                  {isInt ? fmtInt(lang, val) : fmt(lang, val, k.digits ?? 1)}
                  <tspan className="ex-unit"> {k.unit}</tspan>
                </text>
                <text x={x + 14} y={KPI.y + 72} className="ex-delta is-up" opacity={p}>{k.delta}</text>
              </g>
            );
          })}

          {/* pont de marge */}
          <g opacity={0.3 + 0.7 * Math.min(1, wfP(0) * 4)}>
            <rect x={WF.x} y={CH.y} width={WF.w} height={CH.h} rx="8" fill={C.panel} stroke={C.line} />
            <text x={WF.x + 14} y={CH.y + 24} className="ex-lab">{L.waterfall.title}</text>
            <text x={WF.x + WF.w - 14} y={CH.y + 24} textAnchor="end" className="ex-lab ex-muted">{L.waterfall.unit}</text>
            {[0.25, 0.5, 0.75, 1].map((f) => {
              const y = wfPlotY + wfPlotH * (1 - f);
              return <line key={f} x1={WF.x + 12} x2={WF.x + WF.w - 12} y1={y} y2={y} stroke={C.line} />;
            })}
            {wfBars.map((b, i) => {
              const p = wfP(i);
              const x = WF.x + 12 + i * wfBand + wfBand * 0.18;
              const bw = wfBand * 0.64;
              const hi = Math.max(b.start, b.end), lo = Math.min(b.start, b.end);
              const yTop = yOf(hi), yBot = yOf(lo);
              const hh = (yBot - yTop) * p;
              const neg = !b.isTotal && b.value < 0;
              const fill = b.isTotal ? C.sageBright : neg ? C.amber : C.sage;
              const yDraw = neg ? yTop : yBot - hh;
              const prev = wfBars[i - 1];
              return (
                <g key={b.label} opacity={p > 0 ? 1 : 0}>
                  {prev && <line x1={x - wfBand * 0.36} x2={x} y1={yOf(prev.end)} y2={yOf(prev.end)} stroke={C.lineStrong} strokeDasharray="2 3" opacity={p} />}
                  <rect x={x} y={yDraw} width={bw} height={Math.max(0, hh)} rx="2" fill={fill} opacity={b.isTotal ? 1 : 0.9} />
                  <text x={x + bw / 2} y={yTop - 7} textAnchor="middle" className="ex-val" opacity={p}>
                    {b.isTotal ? fmt(lang, b.value, 1) : `${b.value > 0 ? "+" : "−"}${fmt(lang, Math.abs(b.value), 1)}`}
                  </text>
                  <text x={x + bw / 2} y={wfPlotY + wfPlotH + 18} textAnchor="middle" className="ex-tick" opacity={p}>{b.label}</text>
                </g>
              );
            })}
          </g>

          {/* tendance vs objectif */}
          <g opacity={0.3 + 0.7 * Math.min(1, targetP * 4)}>
            <rect x={LN.x} y={CH.y} width={LN.w} height={CH.h} rx="8" fill={C.panel} stroke={C.line} />
            <text x={LN.x + 14} y={CH.y + 24} className="ex-lab">{L.trend.title}</text>
            {[0, 0.5, 1].map((f) => {
              const y = lnPlotY + lnPlotH * (1 - f);
              return (
                <g key={f}>
                  <line x1={lnPlotX} x2={lnPlotX + lnPlotW} y1={y} y2={y} stroke={C.line} />
                  <text x={lnPlotX} y={y - 4} className="ex-tick">{fmtInt(lang, tMin + (tMax - tMin) * f)} %</text>
                </g>
              );
            })}
            <g opacity={targetP}>
              <line x1={lnPlotX} x2={lnPlotX + lnPlotW} y1={py(target)} y2={py(target)} stroke={C.amber} strokeDasharray="4 4" />
              <text x={lnPlotX + lnPlotW} y={py(target) - 5} textAnchor="end" className="ex-tick ex-amber">{L.trend.target} {fmtInt(lang, target)} %</text>
            </g>
            <path d={areaPath} fill={C.sage} opacity={0.1 * lineP} />
            <path d={linePath} fill="none" stroke={C.sageBright} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - lineP} />
            {lineP >= 0.999 && (
              <g>
                <circle cx={px(trend.length - 1)} cy={py(trend[trend.length - 1])} r="3.5" fill={C.sageBright} />
                <text x={px(trend.length - 1) - 8} y={py(trend[trend.length - 1]) - 10} textAnchor="end" className="ex-val">{fmt(lang, trend[trend.length - 1], 1)} %</text>
              </g>
            )}
            {L.trend.months.map((m, i) => (
              (i % 3 === 0 || i === 11) && <text key={m} x={px(i)} y={lnPlotY + lnPlotH + 18} textAnchor="middle" className="ex-tick">{m}</text>
            ))}
          </g>

          {/* bandeau de synthèse sous les graphiques */}
          <g opacity={Math.min(1, lineP * 2)}>
            <rect x={M} y={BOT.y} width={W - 2 * M} height="54" rx="8" fill={C.panel} stroke={C.line} />
            <text x={M + 14} y={BOT.y + 22} className="ex-lab">{L.dash.sourcesLabel}</text>
            <text x={M + 14} y={BOT.y + 40} className="ex-small">{L.dash.sourcesText}</text>
            <text x={W - M - 14} y={BOT.y + 22} textAnchor="end" className="ex-lab">{L.dash.freshLabel}</text>
            <text x={W - M - 14} y={BOT.y + 40} textAnchor="end" className="ex-small ex-sage">{L.dash.freshText}</text>
          </g>
        </g>
      )}

      {/* ── Acte 6 : impact ───────────────────────────────────────────── */}
      {T >= A6.t0 && (
        <g opacity={impIn} transform={`translate(0 ${(1 - impIn) * 8})`}>
          <rect x="150" y="150" width={W - 300} height="300" rx="10" fill="#101c19" stroke="rgba(122,165,149,0.45)" />
          <text x="178" y="186" className="ex-lab ex-sage">{L.impact.label}</text>
          <text x="178" y="214" className="ex-title" style={{ fontSize: 18 }}>{L.impact.title}</text>
          {L.impact.rows.map((row, i) => {
            const p = impRow(i);
            const y = 252 + i * 46;
            return (
              <g key={row.label} opacity={p} transform={`translate(0 ${(1 - p) * 4})`}>
                <line x1="178" x2={W - 178} y1={y - 22} y2={y - 22} stroke={C.line} />
                <text x="178" y={y} className="ex-kpi" style={{ fontSize: 20 }}>{row.value}</text>
                <text x={W - 178} y={y} textAnchor="end" className="ex-small">{row.label}</text>
              </g>
            );
          })}
          <g opacity={impRow(3)}>
            <rect x="178" y="394" width={W - 356} height="28" rx="6" fill={C.sageBright} />
            <text x={W / 2} y="412" textAnchor="middle" className="ex-small ex-onsage">{L.impact.action}</text>
          </g>
        </g>
      )}

      {/* ── Rail des six étapes ───────────────────────────────────────── */}
      <g>
        {ACTS.map((a, i) => {
          const segW = (W - 2 * M - 5 * 8) / 6;
          const x = M + i * (segW + 8);
          const on = i === actIdx;
          const done = i < actIdx;
          const fillP = on ? clamp01((T - a.t0) / a.d) : done ? 1 : 0;
          return (
            <g key={a.key}>
              <rect x={x} y="594" width={segW} height="2" rx="1" fill={C.lineStrong} />
              <rect x={x} y="594" width={segW * fillP} height="2" rx="1" fill={C.sageBright} opacity={done ? 0.55 : 1} />
              <text x={x} y="614" className={`ex-tick${on ? " is-on" : ""}`}>{String(i + 1).padStart(2, "0")}</text>
              <text x={x + 20} y="614" className={`ex-step${on ? " is-on" : ""}`}>{L.rail[i]}</text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}

// Interpolation de couleur hex → hex (les deux en #rrggbb)
function lerpColor(a, b, t) {
  if (!a || a[0] !== "#" || !b || b[0] !== "#") return t > 0.5 ? b : a;
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const r = pa.map((v, i) => Math.round(lerp(v, pb[i], t)));
  return `rgb(${r[0]},${r[1]},${r[2]})`;
}
