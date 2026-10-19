// Figures des guides : composants sans état, rendus côté serveur.
// HTML pour ce qui doit rester lisible sur mobile (étapes, barres,
// comparatifs, fourchettes, frises), SVG pour les schémas (flux, matrice,
// dédoublonnage, dashboard). Animations CSS/SMIL, coupées si mouvement réduit.

const C = {
  ink: "#f2f4f1",
  body: "#b3bdb7",
  muted: "#7d8a84",
  line: "rgba(255,255,255,0.12)",
  lineStrong: "rgba(255,255,255,0.22)",
  panel: "rgba(255,255,255,0.04)",
  sage: "#7aa595",
  sageBright: "#9ccab8",
  blue: "#6f9caf",
  amber: "#f2a516",
};
const TONES = { sage: C.sage, bright: C.sageBright, blue: C.blue, amber: C.amber, muted: C.muted };

function Frame({ title, caption, children, scroll = false }) {
  return (
    <figure className="fig">
      {title && <figcaption className="fig-title">{title}</figcaption>}
      <div className={`fig-body${scroll ? " fig-scroll" : ""}`}>{children}</div>
      {caption && <figcaption className="fig-caption">{caption}</figcaption>}
    </figure>
  );
}

// ---------------------------------------------------------------------------
// Étapes : une séquence numérotée, révélée une à une
// ---------------------------------------------------------------------------
function Steps({ steps }) {
  return (
    <ol className="fig-steps" style={{ "--n": steps.length }}>
      {steps.map((s, i) => (
        <li key={s.label} className="fig-step fig-in" style={{ "--i": i }}>
          <span className="fig-step-n mono">{String(i + 1).padStart(2, "0")}</span>
          <span className="fig-step-label">{s.label}</span>
          {s.note && <span className="fig-step-note">{s.note}</span>}
        </li>
      ))}
    </ol>
  );
}

// ---------------------------------------------------------------------------
// Barres horizontales : valeur ou fourchette, avec unité
// ---------------------------------------------------------------------------
function Bars({ rows, max, unit = "", range = false }) {
  const m = max || Math.max(...rows.map((r) => (range ? r.to : r.value)));
  return (
    <div className="fig-bars">
      {rows.map((r, i) => {
        const from = range ? (r.from / m) * 100 : 0;
        const to = ((range ? r.to : r.value) / m) * 100;
        return (
          <div key={r.label} className="fig-bar fig-in" style={{ "--i": i }}>
            <span className="fig-bar-label">{r.label}</span>
            <span className="fig-bar-track">
              <span className="fig-bar-fill" style={{ left: `${from}%`, width: `${to - from}%`, background: TONES[r.tone] || C.sage }} />
            </span>
            <span className="fig-bar-value mono">{range ? `${r.from} à ${r.to}${unit}` : `${r.value}${unit}`}</span>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Comparatif : critères en lignes, options en colonnes, niveau 0 à 3
// ---------------------------------------------------------------------------
function Compare({ options, criteria }) {
  return (
    <div className="fig-compare" style={{ "--cols": options.length }}>
      <div className="fig-compare-head">
        <span />
        {options.map((o) => <span key={o} className="fig-compare-opt">{o}</span>)}
      </div>
      {criteria.map((c, i) => (
        <div key={c.label} className="fig-compare-row fig-in" style={{ "--i": i }}>
          <span className="fig-compare-crit">{c.label}</span>
          {c.levels.map((lv, j) => (
            <span key={j} className="fig-compare-cell" aria-label={`${options[j]} : ${lv} sur 3`}>
              {[0, 1, 2].map((k) => <i key={k} className={k < lv ? "is-on" : ""} />)}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Fourchette : une échelle avec des repères
// ---------------------------------------------------------------------------
function Range({ min, max, unit, marks, band }) {
  const pct = (v) => ((v - min) / (max - min)) * 100;
  return (
    <div className="fig-range">
      <div className="fig-range-track">
        {band && <span className="fig-range-band" style={{ left: `${pct(band[0])}%`, width: `${pct(band[1]) - pct(band[0])}%` }} />}
        {marks.map((mk, i) => (
          <span key={mk.label} className="fig-range-mark fig-in" style={{ left: `${pct(mk.value)}%`, "--i": i }}>
            <i />
            <span className="fig-range-mark-label">{mk.label}</span>
            <span className="fig-range-mark-value mono">{mk.value}{unit}</span>
          </span>
        ))}
      </div>
      <div className="fig-range-axis mono"><span>{min}{unit}</span><span>{max}{unit}</span></div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Frise : jalons datés
// ---------------------------------------------------------------------------
function Timeline({ items }) {
  return (
    <ol className="fig-timeline">
      {items.map((it, i) => (
        <li key={it.date + it.label} className={`fig-tl-item fig-in${it.tone ? ` is-${it.tone}` : ""}`} style={{ "--i": i }}>
          <span className="fig-tl-date mono">{it.date}</span>
          <span className="fig-tl-dot" />
          <span className="fig-tl-label">{it.label}</span>
          {it.note && <span className="fig-tl-note">{it.note}</span>}
        </li>
      ))}
    </ol>
  );
}

// ---------------------------------------------------------------------------
// SVG : flux entre systèmes, avec paquets qui circulent
// ---------------------------------------------------------------------------
function Packet({ id, dur, begin, color = C.sageBright, r = 3.5 }) {
  return (
    <circle r={r} fill={color}>
      <animateMotion dur={`${dur}s`} begin={begin} repeatCount="indefinite" calcMode="spline" keyTimes="0;1" keySplines="0.45 0 0.25 1">
        <mpath href={`#${id}`} />
      </animateMotion>
      <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.85;1" dur={`${dur}s`} begin={begin} repeatCount="indefinite" />
    </circle>
  );
}

function Flow({ nodes, edges, width = 720, height = 220, uid }) {
  const NW = 136, NH = 46;
  const pos = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const edgePath = (e) => {
    const a = pos[e.from], b = pos[e.to];
    const dx = b.x - a.x, dy = b.y - a.y;
    const horizontal = Math.abs(dx) >= Math.abs(dy);
    const x1 = horizontal ? a.x + Math.sign(dx) * NW / 2 : a.x;
    const y1 = horizontal ? a.y : a.y + Math.sign(dy) * NH / 2;
    const x2 = horizontal ? b.x - Math.sign(dx) * (NW / 2 + 6) : b.x;
    const y2 = horizontal ? b.y : b.y - Math.sign(dy) * (NH / 2 + 6);
    if (horizontal && Math.abs(dy) > 4) {
      const mx = (x1 + x2) / 2;
      return `M${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
    }
    return `M${x1} ${y1} L${x2} ${y2}`;
  };
  return (
    <svg className="fig-svg" viewBox={`0 0 ${width} ${height}`} style={{ minWidth: Math.min(width, 640) }} aria-hidden="true">
      <defs>
        <marker id={`${uid}-arrow`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L8 4 L0 8 Z" fill={C.sageBright} />
        </marker>
      </defs>
      {edges.map((e, i) => {
        const d = edgePath(e);
        const id = `${uid}-e${i}`;
        const a = pos[e.from], b = pos[e.to];
        const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
        return (
          <g key={id}>
            <path id={id} d={d} fill="none" stroke={C.lineStrong} strokeWidth="1.25" strokeDasharray={e.dashed ? "4 4" : undefined} markerEnd={`url(#${uid}-arrow)`} markerStart={e.both ? `url(#${uid}-arrow)` : undefined} />
            <Packet id={id} dur={e.dur || 2.4} begin={`${(i * 0.5) % 2}s`} color={TONES[e.tone] || C.sageBright} />
            {e.label && (
              <g>
                <rect x={mx - e.label.length * 3.2 - 8} y={my - 9 + (e.labelDy || 0)} width={e.label.length * 6.4 + 16} height="18" rx="4" fill="#0f1917" stroke={C.line} />
                <text x={mx} y={my + 3.5 + (e.labelDy || 0)} textAnchor="middle" className="fig-tick">{e.label}</text>
              </g>
            )}
          </g>
        );
      })}
      {nodes.map((n, i) => (
        <g key={n.id} className="fig-in" style={{ "--i": i }}>
          <rect x={n.x - NW / 2} y={n.y - NH / 2} width={NW} height={NH} rx="8" fill={n.tone === "accent" ? "rgba(122,165,149,0.1)" : "#121c1a"} stroke={n.tone === "accent" ? C.sageBright : C.lineStrong} />
          <text x={n.x} y={n.y + (n.sub ? -2 : 4)} textAnchor="middle" className="fig-node">{n.label}</text>
          {n.sub && <text x={n.x} y={n.y + 13} textAnchor="middle" className="fig-tick">{n.sub}</text>}
        </g>
      ))}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// SVG : matrice 2 × 2 de décision
// ---------------------------------------------------------------------------
function Matrix({ xLabel, yLabel, quadrants, points }) {
  const W = 720, H = 300, L = 56, T = 24, R = 24, B = 48;
  const w = W - L - R, h = H - T - B;
  const qx = [L, L + w / 2], qy = [T, T + h / 2];
  return (
    <svg className="fig-svg" viewBox={`0 0 ${W} ${H}`} style={{ minWidth: 560 }} aria-hidden="true">
      {quadrants.map((q, i) => {
        const x = qx[i % 2], y = qy[Math.floor(i / 2)];
        return (
          <g key={i} className="fig-in" style={{ "--i": i }}>
            <rect x={x + 3} y={y + 3} width={w / 2 - 6} height={h / 2 - 6} rx="8" fill={q.tone === "accent" ? "rgba(122,165,149,0.1)" : C.panel} stroke={q.tone === "accent" ? "rgba(156,202,184,0.5)" : C.line} />
            <text x={x + 16} y={y + 26} className="fig-node">{q.label}</text>
            {q.note && <text x={x + 16} y={y + 44} className="fig-tick">{q.note}</text>}
          </g>
        );
      })}
      {points?.map((p, i) => (
        <g key={p.label} className="fig-in" style={{ "--i": i + 4 }}>
          <circle cx={L + (p.x / 100) * w} cy={T + h - (p.y / 100) * h} r="5" fill={TONES[p.tone] || C.amber} />
          <text x={L + (p.x / 100) * w + 10} y={T + h - (p.y / 100) * h + 4} className="fig-tick" fill={C.ink}>{p.label}</text>
        </g>
      ))}
      <line x1={L} x2={W - R} y1={T + h + 10} y2={T + h + 10} stroke={C.lineStrong} />
      <text x={L + w / 2} y={H - 10} textAnchor="middle" className="fig-tick">{xLabel}</text>
      <text x={16} y={T + h / 2} textAnchor="middle" transform={`rotate(-90 16 ${T + h / 2})`} className="fig-tick">{yLabel}</text>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// SVG : dédoublonnage, avant / après
// ---------------------------------------------------------------------------
function Dedupe({ before, after2: after, groups }) {
  // before : nombre d'enregistrements ; groups : [[indices]] en doublon
  const W = 720, H = 200;
  const cols = 6, cell = 48;
  const idxTone = (i) => {
    const g = groups.findIndex((grp) => grp.includes(i));
    return g === -1 ? C.sage : [C.amber, C.blue, C.sageBright][g % 3];
  };
  const survivors = Array.from({ length: before }, (_, i) => i).filter((i) => !groups.some((grp) => grp.indexOf(i) > 0));
  return (
    <svg className="fig-svg" viewBox={`0 0 ${W} ${H}`} style={{ minWidth: 560 }} aria-hidden="true">
      <text x="24" y="24" className="fig-node">{`Avant : ${before} enregistrements`}</text>
      {Array.from({ length: before }, (_, i) => (
        <g key={i} className="fig-in" style={{ "--i": i * 0.3 }}>
          <rect x={24 + (i % cols) * cell} y={40 + Math.floor(i / cols) * 22} width={cell - 8} height="14" rx="4" fill={idxTone(i)} opacity={groups.some((grp) => grp.indexOf(i) > 0) ? 0.55 : 0.95} />
          {groups.some((grp) => grp.indexOf(i) > 0) && <line x1={24 + (i % cols) * cell} x2={24 + (i % cols) * cell + cell - 8} y1={47 + Math.floor(i / cols) * 22} y2={47 + Math.floor(i / cols) * 22} stroke="#0b1412" strokeWidth="2" />}
        </g>
      ))}
      <path id="fig-dd-arrow" d="M330 100 L400 100" stroke={C.lineStrong} strokeWidth="1.25" markerEnd="url(#fig-dd-m)" />
      <defs>
        <marker id="fig-dd-m" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill={C.sageBright} /></marker>
      </defs>
      <text x="365" y="90" textAnchor="middle" className="fig-tick">fusion</text>
      <text x="420" y="24" className="fig-node">{`Après : ${after} enregistrements`}</text>
      {survivors.map((i, k) => (
        <rect key={i} className="fig-in" style={{ "--i": 4 + k * 0.3 }} x={420 + (k % cols) * cell} y={40 + Math.floor(k / cols) * 22} width={cell - 8} height="14" rx="4" fill={C.sage} />
      ))}
      <text x="24" y={H - 16} className="fig-tick">{`${groups.length} groupes de doublons, ${before - after} fusions journalisées`}</text>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// SVG : mini dashboard
// ---------------------------------------------------------------------------
function Dash({ kpis, series, target }) {
  const W = 720, H = 240, L = 24;
  const kw = (W - 2 * L - 3 * 12) / 4;
  const px0 = L, pw = W - 2 * L, py0 = 120, ph = 84;
  const vmin = Math.min(...series) - 1, vmax = Math.max(...series) + 1;
  const px = (i) => px0 + (i / (series.length - 1)) * pw;
  const py = (v) => py0 + ph - ((v - vmin) / (vmax - vmin)) * ph;
  const d = series.map((v, i) => `${i ? "L" : "M"}${px(i).toFixed(1)} ${py(v).toFixed(1)}`).join(" ");
  return (
    <svg className="fig-svg" viewBox={`0 0 ${W} ${H}`} style={{ minWidth: 560 }} aria-hidden="true">
      {kpis.map((k, i) => (
        <g key={k.label} className="fig-in" style={{ "--i": i }}>
          <rect x={L + i * (kw + 12)} y="16" width={kw} height="76" rx="8" fill={C.panel} stroke={C.line} />
          <text x={L + i * (kw + 12) + 14} y="38" className="fig-tick">{k.label}</text>
          <text x={L + i * (kw + 12) + 14} y="66" className="fig-kpi">{k.value}</text>
          <text x={L + i * (kw + 12) + kw - 14} y="66" textAnchor="end" className="fig-tick" fill={C.sageBright}>{k.delta}</text>
        </g>
      ))}
      {[0, 0.5, 1].map((f) => <line key={f} x1={px0} x2={px0 + pw} y1={py0 + ph * f} y2={py0 + ph * f} stroke={C.line} />)}
      {target != null && <line x1={px0} x2={px0 + pw} y1={py(target)} y2={py(target)} stroke={C.amber} strokeDasharray="4 4" />}
      <path d={d} fill="none" stroke={C.sageBright} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" pathLength="1" className="fig-draw" />
      <text x={px0} y={H - 14} className="fig-tick">{series.length} mois</text>
      {target != null && <text x={px0 + pw} y={py(target) - 6} textAnchor="end" className="fig-tick" fill={C.amber}>objectif</text>}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// SVG : modèle de données (objets et relations)
// ---------------------------------------------------------------------------
function Erd({ nodes, edges, width = 760, height = 320 }) {
  const NW = 140, NH = 46;
  const pos = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const clip = (a, b) => {
    const dx = b.x - a.x, dy = b.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len, uy = dy / len;
    const off = Math.min(NW / 2 / Math.max(Math.abs(ux), 0.01), NH / 2 / Math.max(Math.abs(uy), 0.01));
    return { x1: a.x + ux * off, y1: a.y + uy * off, x2: b.x - ux * off, y2: b.y - uy * off };
  };
  return (
    <svg className="fig-svg" viewBox={`0 0 ${width} ${height}`} style={{ minWidth: 640 }} aria-hidden="true">
      {edges.map((e, i) => {
        const a = pos[e.from], b = pos[e.to];
        const { x1, y1, x2, y2 } = clip(a, b);
        const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
        return (
          <g key={i} className="fig-in" style={{ "--i": i * 0.4 + 2 }}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.lineStrong} strokeWidth="1.25" strokeDasharray={e.dashed ? "4 4" : undefined} />
            {e.label && (
              <g>
                <rect x={mx - e.label.length * 2.8 - 5} y={my - 8} width={e.label.length * 5.6 + 10} height="16" rx="4" fill="#0f1917" stroke={C.line} />
                <text x={mx} y={my + 3.5} textAnchor="middle" className="fig-tick" style={{ fontSize: 9.5 }}>{e.label}</text>
              </g>
            )}
          </g>
        );
      })}
      {nodes.map((n, i) => (
        <g key={n.id} className="fig-in" style={{ "--i": i * 0.4 }}>
          <rect x={n.x - NW / 2} y={n.y - NH / 2} width={NW} height={NH} rx="7" fill={n.tone === "accent" ? "rgba(122,165,149,0.1)" : n.tone === "std" ? "#121c1a" : "rgba(111,156,175,0.08)"} stroke={n.tone === "accent" ? C.sageBright : n.tone === "std" ? C.lineStrong : "rgba(111,156,175,0.5)"} />
          <text x={n.x} y={n.y - 2} textAnchor="middle" className="fig-node">{n.label}</text>
          <text x={n.x} y={n.y + 13} textAnchor="middle" className="fig-tick">{n.api}</text>
        </g>
      ))}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Équivalence objet par objet entre deux modèles
// ---------------------------------------------------------------------------
function Mapping({ from, to, rows }) {
  return (
    <div className="fig-map">
      <div className="fig-map-head"><span>{from}</span><span /><span>{to}</span></div>
      {rows.map((r, i) => (
        <div key={r.from.label} className="fig-map-row fig-in" style={{ "--i": i }}>
          <span className="fig-map-cell">
            <span className="fig-map-label">{r.from.label}</span>
            <span className="fig-map-api mono">{r.from.api}</span>
          </span>
          <span className="fig-map-arrow" aria-hidden="true" />
          <span className="fig-map-cell is-to">
            <span className="fig-map-label">{r.to.label}</span>
            <span className="fig-map-api mono">{r.to.api}</span>
          </span>
          {r.note && <span className="fig-map-note">{r.note}</span>}
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
export default function Figure({ figure, uid }) {
  const { type, title, caption, ...rest } = figure;
  const svgTypes = ["flow", "matrix", "dedupe", "dash", "erd"];
  let body = null;
  switch (type) {
    case "steps": body = <Steps {...rest} />; break;
    case "bars": body = <Bars {...rest} />; break;
    case "compare": body = <Compare {...rest} />; break;
    case "range": body = <Range {...rest} />; break;
    case "timeline": body = <Timeline {...rest} />; break;
    case "flow": body = <Flow {...rest} uid={uid} />; break;
    case "matrix": body = <Matrix {...rest} />; break;
    case "dedupe": body = <Dedupe {...rest} />; break;
    case "dash": body = <Dash {...rest} />; break;
    case "erd": body = <Erd {...rest} />; break;
    case "mapping": body = <Mapping {...rest} />; break;
    default: return null;
  }
  return <Frame title={title} caption={caption} scroll={svgTypes.includes(type)}>{body}</Frame>;
}
