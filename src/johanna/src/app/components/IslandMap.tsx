import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import butikenLogo from "../../imports/Ska_rmavbild_2026-05-28_kl._12.14.38.png";

// ─── Isometric engine ─────────────────────────────────────────────────────────
const TW = 54;  // screen px per grid unit (x / z axis)
const TH = 27;  // TW / 2
const WH = 23;  // screen px per grid unit (y / height axis)
const OX = 350; // screen origin x
const OY = 258; // screen origin y

function iso(ix: number, iz: number, iy = 0): [number, number] {
  return [OX + (ix - iz) * TW / 2, OY + (ix + iz) * TH / 2 - iy * WH];
}

function pts(ps: Array<[number, number]>): string {
  return ps.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
}

function darken(hex: string, f: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, Math.round(((n >> 16) & 0xff) * f));
  const g = Math.min(255, Math.round(((n >> 8) & 0xff) * f));
  const b = Math.min(255, Math.round((n & 0xff) * f));
  return `rgb(${r},${g},${b})`;
}
function lighten(hex: string, f: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, Math.round(((n >> 16) & 0xff) * f));
  const g = Math.min(255, Math.round(((n >> 8) & 0xff) * f));
  const b = Math.min(255, Math.round((n & 0xff) * f));
  return `rgb(${r},${g},${b})`;
}

// ─── Island platform ──────────────────────────────────────────────────────────
const GH = 1.0;

// Large island boundary
const ISLAND_OUTLINE: [number, number][] = [
  [0.5, -6.5], [2.8, -5.8], [5.5, -3.8], [6.5, -0.5],
  [5.8, 3.2],  [3.0, 6.0],  [-1.0, 6.5], [-4.0, 5.5],
  [-6.5, 2.5], [-6.5, -0.8], [-5.5, -3.8], [-2.8, -5.8],
];

// ─── Building metadata ────────────────────────────────────────────────────────
const BUILD_ISO: Record<string, {
  ix: number; iz: number; w: number; d: number; h: number;
  color: string; accent: string;
}> = {
  ecommerce: { ix:  1.8, iz: -4.8, w: 1.8, d: 1.8, h: 2.0, color: "#30885a", accent: "#d4a843" },
  account:   { ix: -4.5, iz: -4.0, w: 1.6, d: 1.6, h: 2.2, color: "#6848a8", accent: "#b088e8" },
  inventory: { ix:  4.2, iz:  0.2, w: 1.8, d: 1.8, h: 1.8, color: "#a87820", accent: "#d4a843" },
  app:       { ix: -5.5, iz:  0.8, w: 1.6, d: 1.6, h: 2.0, color: "#375D44", accent: "#90b8e8" },
  delivery:  { ix:  2.0, iz:  4.0, w: 1.8, d: 1.8, h: 1.6, color: "#308868", accent: "#70b898" },
  analytics: { ix: -4.8, iz:  3.5, w: 1.6, d: 1.6, h: 3.2, color: "#5C3A2E", accent: "#E8E0D8" },
};

// Painter's order: sort buildings back-to-front by (ix + iz) ascending
const BUILD_ORDER = Object.keys(BUILD_ISO).sort(
  (a, b) => (BUILD_ISO[a].ix + BUILD_ISO[a].iz) - (BUILD_ISO[b].ix + BUILD_ISO[b].iz)
);

// ─── 4-walled isometric building ─────────────────────────────────────────────
function IsoBuilding({
  id, ix, iz, w, d, h, color, accent, emoji, unlocked, completed,
  hovered, onClick, onHover, xpReward, name,
}: {
  id: string; ix: number; iz: number; w: number; d: number; h: number;
  color: string; accent: string; emoji: string; unlocked: boolean; completed: boolean;
  hovered: boolean; onClick: () => void; onHover: (v: boolean) => void;
  xpReward: number; name: string;
}) {
  const gy = GH;
  const OH = 0.10;
  const RH = 0.28;

  const locked = !unlocked;
  const col = locked ? "#999" : color;
  const acc = locked ? "#bbb" : accent;

  const isGroceryStore = id === "ecommerce";

  // Light comes from northwest — 4 distinct wall shades
  const topColor   = lighten(col, 1.28);
  const westColor  = col;                   // lit side
  const northColor = darken(col, 0.74);     // partially lit
  const eastColor  = darken(col, 0.52);     // shadow (far right)
  const southColor = darken(col, 0.58);     // shadow (far back)

  const roofTopColor   = lighten(acc, 1.32);
  const roofWestColor  = acc;
  const roofNorthColor = darken(acc, 0.74);
  const roofEastColor  = darken(acc, 0.55);
  const roofSouthColor = darken(acc, 0.62);

  // All 8 corners of the box
  const BLB = iso(ix,   iz,   gy);
  const BRB = iso(ix+w, iz,   gy);
  const FLB = iso(ix,   iz+d, gy);
  const FRB = iso(ix+w, iz+d, gy);   // far corner (new)
  const BLT = iso(ix,   iz,   gy+h);
  const BRT = iso(ix+w, iz,   gy+h);
  const FLT = iso(ix,   iz+d, gy+h);
  const FRT = iso(ix+w, iz+d, gy+h);

  // 4 walls — painter order (far first): south, east, west, north
  const southWall = [FLT, FRT, FRB, FLB] as Array<[number, number]>;
  const eastWall  = [BRT, FRT, FRB, BRB] as Array<[number, number]>;
  const westWall  = [BLT, FLT, FLB, BLB] as Array<[number, number]>;
  const northWall = [BLT, BRT, BRB, BLB] as Array<[number, number]>;
  const topFace   = [BLT, BRT, FRT, FLT] as Array<[number, number]>;

  // Roof cap (slight overhang)
  const rix = ix - OH, riz = iz - OH;
  const rw = w + 2*OH, rd = d + 2*OH, rt = gy+h+RH;
  const RBLB = iso(rix,    riz,    gy+h);
  const RBRB = iso(rix+rw, riz,    gy+h);
  const RFLB = iso(rix,    riz+rd, gy+h);
  const RFRB = iso(rix+rw, riz+rd, gy+h);   // new far corner
  const RBLT = iso(rix,    riz,    rt);
  const RBRT = iso(rix+rw, riz,    rt);
  const RFLT = iso(rix,    riz+rd, rt);
  const RFRT = iso(rix+rw, riz+rd, rt);

  const roofSouth = [RFLT, RFRT, RFRB, RFLB] as Array<[number, number]>;
  const roofEast  = [RBRT, RFRT, RFRB, RBRB] as Array<[number, number]>;
  const roofWest  = [RBLT, RFLT, RFLB, RBLB] as Array<[number, number]>;
  const roofNorth = [RBLT, RBRT, RBRB, RBLB] as Array<[number, number]>;
  const roofTop   = [RBLT, RBRT, RFRT, RFLT] as Array<[number, number]>;

  // Windows
  const winLit  = "rgba(180,220,255,0.80)";
  const winShad = "rgba(130,175,215,0.65)";

  const winNW = [[0.25, 0.4, 0.62, 0.82], [w*0.55, 0.4, w*0.82, 0.82]];
  const winES = [[0.25, 0.4, 0.62, 0.82], [d*0.55, 0.4, d*0.82, 0.82]];

  // Door on north wall (wider for grocery store)
  const dW = isGroceryStore ? 0.65 : 0.44;
  const dH = isGroceryStore ? 1.15 : 0.70;
  const dX = w / 2 - dW / 2;
  const doorPts = [
    iso(ix + dX,      iz, gy),
    iso(ix + dX + dW, iz, gy),
    iso(ix + dX + dW, iz, gy + dH),
    iso(ix + dX,      iz, gy + dH),
  ] as Array<[number, number]>;

  const shadowCenter = iso(ix + w/2, iz + d/2, 0);
  const shadowRx = (w + d) * TW / 4;
  const shadowRy = (w + d) * TH / 4;

  const emojiPos = iso(ix + w/2, iz + d/2, gy + h + RH + 0.9);
  const labelPos = iso(ix + w/2, iz + d/2, gy + h + RH + 2.4);

  // Center of visible face for lock icon
  const lockX = (BLT[0] + BRT[0]) / 2;
  const lockY = (BLT[1] + BRB[1]) / 2 + 8;

  return (
    <g
      onClick={unlocked ? onClick : undefined}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      style={{ cursor: unlocked ? "pointer" : "not-allowed" }}
    >
      {/* Ground shadow */}
      <ellipse
        cx={shadowCenter[0]} cy={shadowCenter[1] + 6}
        rx={shadowRx * 0.72} ry={shadowRy * 0.52}
        fill="rgba(0,0,0,0.14)"
      />

      <motion.g animate={{ y: hovered ? -13 : 0 }} transition={{ type: "spring", stiffness: 400, damping: 28 }}>

        {/* ── South wall (farthest — render first) ── */}
        <polygon points={pts(southWall)} fill={southColor} stroke="rgba(0,0,0,0.11)" strokeWidth="0.7" />
        {!locked && id !== "analytics" && winES.map(([u1, v1, u2, v2], wi) => (
          <polygon key={`ws${wi}`}
            points={pts([iso(ix+u1, iz+d, gy+v1), iso(ix+u2, iz+d, gy+v1), iso(ix+u2, iz+d, gy+v2), iso(ix+u1, iz+d, gy+v2)])}
            fill={winShad} stroke="rgba(0,0,0,0.15)" strokeWidth="0.5"
          />
        ))}

        {/* ── East wall ── */}
        <polygon points={pts(eastWall)} fill={eastColor} stroke="rgba(0,0,0,0.11)" strokeWidth="0.7" />
        {!locked && id !== "analytics" && winES.map(([u1, v1, u2, v2], wi) => (
          <polygon key={`we${wi}`}
            points={pts([iso(ix+w, iz+u1, gy+v1), iso(ix+w, iz+u2, gy+v1), iso(ix+w, iz+u2, gy+v2), iso(ix+w, iz+u1, gy+v2)])}
            fill={winShad} stroke="rgba(0,0,0,0.15)" strokeWidth="0.5"
          />
        ))}

        {/* ── West wall (lit) ── */}
        <polygon points={pts(westWall)} fill={westColor} stroke="rgba(0,0,0,0.11)" strokeWidth="0.7" />
        {!locked && id !== "analytics" && winNW.map(([u1, v1, u2, v2], wi) => (
          <polygon key={`ww${wi}`}
            points={pts([iso(ix, iz+u1, gy+v1), iso(ix, iz+u2, gy+v1), iso(ix, iz+u2, gy+v2), iso(ix, iz+u1, gy+v2)])}
            fill={winLit} stroke="rgba(0,0,0,0.15)" strokeWidth="0.5"
          />
        ))}
        {/* Analytics: multi-floor windows on west wall only */}
        {!locked && id === "analytics" && (() => {
          const floors = [0.08, 0.28, 0.48, 0.68];
          const winH = 0.14;
          const cols = [[0.15, 0.42], [0.58, 0.85]];
          return floors.map((floorY, fi) =>
            cols.map(([z1f, z2f], ci) => {
              const z1 = iz + d * z1f, z2 = iz + d * z2f;
              const y1 = gy + h * (floorY), y2 = gy + h * (floorY + winH);
              return (
                <polygon key={`aw${fi}-${ci}`}
                  points={pts([iso(ix, z1, y1), iso(ix, z2, y1), iso(ix, z2, y2), iso(ix, z1, y2)])}
                  fill="rgba(180,220,255,0.80)" stroke="rgba(0,0,0,0.18)" strokeWidth="0.5"
                />
              );
            })
          );
        })()}

        {/* ── North wall (lit) + door ── */}
        <polygon points={pts(northWall)} fill={northColor} stroke="rgba(0,0,0,0.11)" strokeWidth="0.7" />
        {!locked && id !== "analytics" && winNW.map(([u1, v1, u2, v2], wi) => (
          <polygon key={`wn${wi}`}
            points={pts([iso(ix+u1, iz, gy+v1), iso(ix+u2, iz, gy+v1), iso(ix+u2, iz, gy+v2), iso(ix+u1, iz, gy+v2)])}
            fill={winLit} stroke="rgba(0,0,0,0.15)" strokeWidth="0.5"
          />
        ))}
        {/* Analytics: multi-floor windows on north wall only */}
        {!locked && id === "analytics" && (() => {
          const floors = [0.08, 0.28, 0.48, 0.68];
          const winH = 0.14;
          const cols = [[0.15, 0.42], [0.58, 0.85]];
          return floors.map((floorY, fi) =>
            cols.map(([x1f, x2f], ci) => {
              const x1 = ix + w * x1f, x2 = ix + w * x2f;
              const y1 = gy + h * (floorY), y2 = gy + h * (floorY + winH);
              return (
                <polygon key={`an${fi}-${ci}`}
                  points={pts([iso(x1, iz, y1), iso(x2, iz, y1), iso(x2, iz, y2), iso(x1, iz, y2)])}
                  fill="rgba(180,220,255,0.80)" stroke="rgba(0,0,0,0.18)" strokeWidth="0.5"
                />
              );
            })
          );
        })()}
        {!locked && (
          <>
            <polygon points={pts(doorPts)} fill={darken(col, 0.42)} stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />
            {/* Glass door effect for grocery store */}
            {isGroceryStore && (
              <>
                <polygon points={pts(doorPts)} fill="rgba(180,220,255,0.35)" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />
                {/* Door handle */}
                <line
                  x1={doorPts[1][0] - 4}
                  y1={doorPts[1][1] + (doorPts[0][1] - doorPts[1][1]) * 0.5}
                  x2={doorPts[1][0] - 4}
                  y2={doorPts[1][1] + (doorPts[0][1] - doorPts[1][1]) * 0.65}
                  stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round"
                />
              </>
            )}
          </>
        )}

        {/* ── Top face ── */}
        <polygon points={pts(topFace)} fill={topColor} stroke="rgba(0,0,0,0.09)" strokeWidth="0.7" />

        {/* ── Lock icon ── */}
        {locked && (
          <text x={lockX} y={lockY} textAnchor="middle" dominantBaseline="middle" fontSize="18">🔒</text>
        )}

        {/* ── Roof cap — same 4-wall order ── */}
        <polygon points={pts(roofSouth)} fill={roofSouthColor} stroke="rgba(0,0,0,0.11)" strokeWidth="0.7" />
        <polygon points={pts(roofEast)}  fill={roofEastColor}  stroke="rgba(0,0,0,0.11)" strokeWidth="0.7" />
        <polygon points={pts(roofWest)}  fill={roofWestColor}  stroke="rgba(0,0,0,0.11)" strokeWidth="0.7" />
        <polygon points={pts(roofNorth)} fill={roofNorthColor} stroke="rgba(0,0,0,0.11)" strokeWidth="0.7" />
        <polygon points={pts(roofTop)}   fill={roofTopColor}   stroke="rgba(0,0,0,0.09)" strokeWidth="0.7" />

        {/* ── Completed glow ── */}
        {completed && (
          <>
            <circle cx={emojiPos[0]} cy={emojiPos[1] + 8} r="14" fill="#006b3f" opacity="0.9">
              <animate attributeName="r" values="13;15;13" dur="2.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.9;0.6;0.9" dur="2.4s" repeatCount="indefinite" />
            </circle>
            <text x={emojiPos[0]} y={emojiPos[1]+8} textAnchor="middle" dominantBaseline="middle" fontSize="12" fill="white" fontWeight="900">✓</text>
          </>
        )}

        {/* ── Floating emoji/logo ── */}
        {!locked && (
          isGroceryStore ? (
            <image
              href={butikenLogo}
              x={emojiPos[0] - 30}
              y={emojiPos[1] - 12}
              width="60"
              height="24"
              preserveAspectRatio="xMidYMid meet"
            >
              <animateTransform attributeName="transform" type="translate"
                values="0,0; 0,-4; 0,0" dur="3s" repeatCount="indefinite" additive="sum"
              />
            </image>
          ) : (
            <text x={emojiPos[0]} y={emojiPos[1]} textAnchor="middle" dominantBaseline="middle" fontSize="20">
              {emoji}
              <animateTransform attributeName="transform" type="translate"
                values="0,0; 0,-4; 0,0" dur="3s" repeatCount="indefinite" additive="sum"
              />
            </text>
          )
        )}

        {/* ── XP badge (below emoji) ── */}
        {!locked && !completed && (
          <g>
            <rect x={emojiPos[0]-19} y={emojiPos[1]+14} width="38" height="15" rx="7.5" fill="#d4a843" />
            <text x={emojiPos[0]} y={emojiPos[1]+22} textAnchor="middle" dominantBaseline="middle"
              fontSize="8.5" fill="white" fontWeight="700" fontFamily="Nunito, sans-serif">
              +{xpReward}XP
            </text>
          </g>
        )}

        {/* ── Inventory warehouse boxes ── */}
        <AnimatePresence>
        {id === "inventory" && !locked && !completed && (
          <motion.g
            initial={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.6, rotate: 15, filter: "blur(6px)" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* Left side — tall stack of boxes */}
            <g transform={`translate(${BLB[0] - 18}, ${BLB[1] - 8})`}>
              {/* Bottom box */}
              <rect x="0" y="12" width="14" height="12" fill="#8b6f47" stroke="#5a4a30" strokeWidth="0.7" />
              <rect x="0.5" y="12.5" width="6" height="5.5" fill="#a0855d" stroke="#5a4a30" strokeWidth="0.4" />
              <line x1="7" y1="12" x2="7" y2="24" stroke="#5a4a30" strokeWidth="0.5" />
              {/* Second box */}
              <rect x="0" y="0" width="14" height="12" fill="#9b7f57" stroke="#5a4a30" strokeWidth="0.7" />
              <rect x="0.5" y="0.5" width="6" height="5.5" fill="#b89568" stroke="#5a4a30" strokeWidth="0.4" />
              <line x1="7" y1="0" x2="7" y2="12" stroke="#5a4a30" strokeWidth="0.5" />
              {/* Top box */}
              <rect x="1" y="-10" width="12" height="10" fill="#7a5f3f" stroke="#5a4a30" strokeWidth="0.7" />
              <rect x="1.5" y="-9.5" width="5" height="4.5" fill="#9b7f57" stroke="#5a4a30" strokeWidth="0.4" />
              <line x1="7" y1="-10" x2="7" y2="0" stroke="#5a4a30" strokeWidth="0.5" />
            </g>

            {/* Front left — medium stack */}
            <g transform={`translate(${BLB[0] - 4}, ${BLB[1] + 4})`}>
              {/* Bottom box */}
              <rect x="0" y="10" width="16" height="14" fill="#8b6f47" stroke="#5a4a30" strokeWidth="0.7" />
              <rect x="1" y="11" width="7" height="6" fill="#a0855d" stroke="#5a4a30" strokeWidth="0.4" />
              <line x1="8" y1="10" x2="8" y2="24" stroke="#5a4a30" strokeWidth="0.5" />
              <line x1="0" y1="17" x2="16" y2="17" stroke="#5a4a30" strokeWidth="0.5" />
              {/* Top box */}
              <rect x="2" y="-2" width="12" height="12" fill="#9b7f57" stroke="#5a4a30" strokeWidth="0.7" />
              <rect x="2.5" y="-1.5" width="5.5" height="5.5" fill="#b89568" stroke="#5a4a30" strokeWidth="0.4" />
              <line x1="8" y1="-2" x2="8" y2="10" stroke="#5a4a30" strokeWidth="0.5" />
            </g>

            {/* Front center — wide pallet with boxes */}
            <g transform={`translate(${(BLB[0] + BRB[0]) / 2 - 8}, ${BLB[1] + 8})`}>
              {/* Pallet base */}
              <rect x="0" y="14" width="16" height="2" fill="#5a4a30" />
              <line x1="4" y1="14" x2="4" y2="16" stroke="#3a2a20" strokeWidth="0.5" />
              <line x1="8" y1="14" x2="8" y2="16" stroke="#3a2a20" strokeWidth="0.5" />
              <line x1="12" y1="14" x2="12" y2="16" stroke="#3a2a20" strokeWidth="0.5" />
              {/* Box 1 */}
              <rect x="0" y="2" width="8" height="12" fill="#a0855d" stroke="#5a4a30" strokeWidth="0.6" />
              <rect x="0.5" y="2.5" width="3.5" height="5" fill="#b89568" stroke="#5a4a30" strokeWidth="0.3" />
              <line x1="4" y1="2" x2="4" y2="14" stroke="#5a4a30" strokeWidth="0.4" />
              {/* Box 2 */}
              <rect x="8" y="2" width="8" height="12" fill="#8b6f47" stroke="#5a4a30" strokeWidth="0.6" />
              <rect x="8.5" y="2.5" width="3.5" height="5" fill="#9b7f57" stroke="#5a4a30" strokeWidth="0.3" />
              <line x1="12" y1="2" x2="12" y2="14" stroke="#5a4a30" strokeWidth="0.4" />
            </g>

            {/* Right side — pyramid stack */}
            <g transform={`translate(${BRB[0] - 2}, ${BRB[1] + 2})`}>
              {/* Bottom row - 3 boxes */}
              <rect x="0" y="12" width="10" height="10" fill="#8b6f47" stroke="#5a4a30" strokeWidth="0.6" />
              <rect x="10" y="12" width="10" height="10" fill="#9b7f57" stroke="#5a4a30" strokeWidth="0.6" />
              <rect x="20" y="12" width="10" height="10" fill="#7a5f3f" stroke="#5a4a30" strokeWidth="0.6" />
              {/* Middle row - 2 boxes */}
              <rect x="5" y="2" width="10" height="10" fill="#a0855d" stroke="#5a4a30" strokeWidth="0.6" />
              <rect x="15" y="2" width="10" height="10" fill="#8b6f47" stroke="#5a4a30" strokeWidth="0.6" />
              {/* Top box */}
              <rect x="10" y="-6" width="10" height="8" fill="#9b7f57" stroke="#5a4a30" strokeWidth="0.6" />
              {/* Labels on boxes */}
              <rect x="1" y="13" width="4" height="2.5" fill="#fff" opacity="0.7" />
              <rect x="11" y="13" width="4" height="2.5" fill="#fff" opacity="0.7" />
              <rect x="6" y="3" width="4" height="2.5" fill="#fff" opacity="0.7" />
            </g>

            {/* Far right — small box pile */}
            <g transform={`translate(${BRB[0] + 8}, ${BRB[1] - 4})`}>
              <rect x="0" y="8" width="12" height="11" fill="#8b6f47" stroke="#5a4a30" strokeWidth="0.6" />
              <rect x="0.5" y="8.5" width="5.5" height="5" fill="#a0855d" stroke="#5a4a30" strokeWidth="0.3" />
              <rect x="2" y="-1" width="8" height="9" fill="#9b7f57" stroke="#5a4a30" strokeWidth="0.6" />
              <rect x="2.5" y="-0.5" width="3.5" height="4" fill="#b89568" stroke="#5a4a30" strokeWidth="0.3" />
            </g>

            {/* Back left — tall narrow stack */}
            <g transform={`translate(${FLB[0] - 10}, ${FLB[1] + 2})`}>
              <rect x="0" y="16" width="10" height="13" fill="#7a5f3f" stroke="#5a4a30" strokeWidth="0.6" />
              <rect x="0.5" y="16.5" width="4.5" height="6" fill="#8b6f47" stroke="#5a4a30" strokeWidth="0.3" />
              <rect x="1" y="3" width="8" height="13" fill="#8b6f47" stroke="#5a4a30" strokeWidth="0.6" />
              <rect x="1.5" y="3.5" width="3.5" height="6" fill="#9b7f57" stroke="#5a4a30" strokeWidth="0.3" />
              <rect x="2" y="-8" width="6" height="11" fill="#a0855d" stroke="#5a4a30" strokeWidth="0.6" />
              <rect x="2.5" y="-7.5" width="2.5" height="5" fill="#b89568" stroke="#5a4a30" strokeWidth="0.3" />
            </g>

            {/* Forklift pallet */}
            <g transform={`translate(${FRB[0] + 4}, ${FRB[1] + 8})`}>
              {/* Pallet */}
              <rect x="0" y="0" width="18" height="2.5" fill="#5a4a30" />
              <line x1="4.5" y1="0" x2="4.5" y2="2.5" stroke="#3a2a20" strokeWidth="0.5" />
              <line x1="9" y1="0" x2="9" y2="2.5" stroke="#3a2a20" strokeWidth="0.5" />
              <line x1="13.5" y1="0" x2="13.5" y2="2.5" stroke="#3a2a20" strokeWidth="0.5" />
              {/* Single large box on pallet */}
              <rect x="1" y="-10" width="16" height="10" fill="#8b6f47" stroke="#5a4a30" strokeWidth="0.7" />
              <rect x="1.5" y="-9.5" width="7" height="4.5" fill="#a0855d" stroke="#5a4a30" strokeWidth="0.4" />
              <line x1="9" y1="-10" x2="9" y2="0" stroke="#5a4a30" strokeWidth="0.5" />
              {/* Fragile sticker */}
              <rect x="10" y="-7" width="6" height="3" fill="#ff6b6b" opacity="0.8" />
              <text x="13" y="-4.5" textAnchor="middle" fontSize="2" fill="white" fontWeight="700">!</text>
            </g>
          </motion.g>
        )}
        </AnimatePresence>

        {/* ── Grocery store decorations ── */}
        {isGroceryStore && !locked && (
          <>
            {/* Front left - Bread/bakery basket */}
            <g transform={`translate(${BLB[0] - 12}, ${BLB[1] - 4})`}>
              {/* Wicker basket */}
              <ellipse cx="7" cy="8" rx="8" ry="4" fill="#d4a373" stroke="#a67c52" strokeWidth="0.5" />
              <rect x="1" y="2" width="12" height="6" fill="#d4a373" stroke="#a67c52" strokeWidth="0.5" />
              <ellipse cx="7" cy="2" rx="6" ry="3" fill="#c99865" />
              {/* Bread loaves */}
              <ellipse cx="5" cy="-1" rx="3.5" ry="2" fill="#daa520" />
              <ellipse cx="9" cy="-1" rx="3.5" ry="2" fill="#cd853f" />
              <ellipse cx="7" cy="-3.5" rx="4" ry="2.2" fill="#d2691e" />
              {/* Bread details */}
              <line x1="5" y1="-1" x2="5" y2="-1.5" stroke="#a0522d" strokeWidth="0.3" />
              <line x1="9" y1="-1" x2="9" y2="-1.5" stroke="#a0522d" strokeWidth="0.3" />
            </g>

            {/* Front center-left - Fruit crate (apples) */}
            <g transform={`translate(${BLB[0] + 2}, ${BLB[1] + 2})`}>
              {/* Crate */}
              <rect x="0" y="0" width="12" height="9" fill="#8b6f47" stroke="#5a4a30" strokeWidth="0.5" />
              <line x1="0" y1="3" x2="12" y2="3" stroke="#5a4a30" strokeWidth="0.5" />
              <line x1="4" y1="0" x2="4" y2="9" stroke="#5a4a30" strokeWidth="0.5" />
              <line x1="8" y1="0" x2="8" y2="9" stroke="#5a4a30" strokeWidth="0.5" />
              {/* Red apples */}
              <circle cx="3" cy="-1.5" r="2.5" fill="#dc143c" />
              <circle cx="9" cy="-1.5" r="2.5" fill="#c41e3a" />
              <circle cx="6" cy="-1" r="2.5" fill="#e30b5c" />
              <circle cx="3" cy="-4" r="2.5" fill="#c41e3a" />
              <circle cx="9" cy="-4" r="2.5" fill="#dc143c" />
              <circle cx="6" cy="-5" r="2.5" fill="#d60d3f" />
            </g>

            {/* Front center - Vegetable crate */}
            <g transform={`translate(${(BLB[0] + BRB[0]) / 2 - 6}, ${BLB[1] + 6})`}>
              {/* Crate */}
              <rect x="0" y="0" width="12" height="9" fill="#8b6f47" stroke="#5a4a30" strokeWidth="0.5" />
              <line x1="0" y1="3" x2="12" y2="3" stroke="#5a4a30" strokeWidth="0.5" />
              <line x1="4" y1="0" x2="4" y2="9" stroke="#5a4a30" strokeWidth="0.5" />
              <line x1="8" y1="0" x2="8" y2="9" stroke="#5a4a30" strokeWidth="0.5" />
              {/* Mixed vegetables */}
              <circle cx="3" cy="-2" r="2.5" fill="#32cd32" />
              <circle cx="9" cy="-2" r="2.5" fill="#ff6347" />
              <circle cx="6" cy="-1.5" r="2.5" fill="#ff8c00" />
              <circle cx="4" cy="-4.5" r="2.5" fill="#9370db" />
              <circle cx="8" cy="-4.5" r="2.5" fill="#ffd700" />
            </g>

            {/* Front right - Orange crate */}
            <g transform={`translate(${BRB[0] - 10}, ${BRB[1] + 2})`}>
              {/* Crate */}
              <rect x="0" y="0" width="12" height="9" fill="#8b6f47" stroke="#5a4a30" strokeWidth="0.5" />
              <line x1="0" y1="3" x2="12" y2="3" stroke="#5a4a30" strokeWidth="0.5" />
              <line x1="4" y1="0" x2="4" y2="9" stroke="#5a4a30" strokeWidth="0.5" />
              <line x1="8" y1="0" x2="8" y2="9" stroke="#5a4a30" strokeWidth="0.5" />
              {/* Oranges */}
              <circle cx="3" cy="-2" r="2.5" fill="#ff8c00" />
              <circle cx="9" cy="-2" r="2.5" fill="#ffa500" />
              <circle cx="6" cy="-1.5" r="2.5" fill="#ff9500" />
              <circle cx="3" cy="-5" r="2.5" fill="#ffa500" />
              <circle cx="9" cy="-5" r="2.5" fill="#ff8c00" />
              <circle cx="6" cy="-5.5" r="2.5" fill="#ff9500" />
            </g>

            {/* Far right - Berry/small fruit basket */}
            <g transform={`translate(${BRB[0] + 2}, ${BRB[1] - 2})`}>
              {/* Small basket */}
              <rect x="0" y="0" width="10" height="7" fill="#8b6f47" stroke="#5a4a30" strokeWidth="0.4" />
              <line x1="0" y1="2.5" x2="10" y2="2.5" stroke="#5a4a30" strokeWidth="0.4" />
              {/* Berries/grapes */}
              <circle cx="3" cy="-1" r="2" fill="#8b008b" />
              <circle cx="7" cy="-1" r="2" fill="#9400d3" />
              <circle cx="5" cy="-2.5" r="2" fill="#9932cc" />
            </g>

            {/* Left side - Potato sack */}
            <g transform={`translate(${BLT[0] - 8}, ${(BLT[1] + BLB[1]) / 2 - 5})`}>
              {/* Burlap sack */}
              <path d="M 2,8 L 0,0 L 10,0 L 8,8 Q 5,10 2,8 Z" fill="#d2b48c" stroke="#a0826d" strokeWidth="0.5" />
              <line x1="0" y1="2" x2="10" y2="2" stroke="#a0826d" strokeWidth="0.3" />
              <line x1="1" y1="5" x2="9" y2="5" stroke="#a0826d" strokeWidth="0.3" />
              {/* Top potatoes visible */}
              <circle cx="3" cy="-1" r="2" fill="#cd853f" />
              <circle cx="7" cy="-1" r="2" fill="#d2691e" />
              <circle cx="5" cy="-2" r="2" fill="#daa520" />
            </g>

            {/* Right side - Leafy greens display */}
            <g transform={`translate(${BRT[0] + 4}, ${(BRT[1] + BRB[1]) / 2 - 5})`}>
              {/* Small crate */}
              <rect x="0" y="0" width="10" height="8" fill="#8b6f47" stroke="#5a4a30" strokeWidth="0.4" />
              {/* Lettuce/cabbage heads */}
              <circle cx="3" cy="-2" r="3" fill="#90ee90" />
              <circle cx="7" cy="-2" r="3" fill="#98fb98" />
              <circle cx="5" cy="-4" r="3" fill="#7cfc00" />
              {/* Leaf details */}
              <path d="M 3,-2 Q 3,-3 2,-3" stroke="#228b22" strokeWidth="0.3" fill="none" />
              <path d="M 7,-2 Q 7,-3 8,-3" stroke="#228b22" strokeWidth="0.3" fill="none" />
            </g>

            {/* Shopping cart */}
            <g transform={`translate(${BLT[0] - 20}, ${(BLT[1] + BLB[1]) / 2 + 12})`}>
              {/* Cart basket */}
              <path d="M 0,0 L 2,-2 L 10,-2 L 12,0 L 10,8 L 2,8 Z" fill="#c0c0c0" stroke="#808080" strokeWidth="0.6" />
              {/* Cart grid */}
              <line x1="3" y1="-2" x2="3" y2="8" stroke="#808080" strokeWidth="0.4" />
              <line x1="6" y1="-2" x2="6" y2="8" stroke="#808080" strokeWidth="0.4" />
              <line x1="9" y1="-2" x2="9" y2="8" stroke="#808080" strokeWidth="0.4" />
              <line x1="2" y1="2" x2="10" y2="2" stroke="#808080" strokeWidth="0.4" />
              <line x1="2" y1="5" x2="10" y2="5" stroke="#808080" strokeWidth="0.4" />
              {/* Cart handle */}
              <path d="M 2,8 L 0,11 M 10,8 L 12,11" stroke="#808080" strokeWidth="1" fill="none" />
              <line x1="0" y1="11" x2="12" y2="11" stroke="#808080" strokeWidth="1.2" strokeLinecap="round" />
              {/* Wheels */}
              <circle cx="3" cy="13" r="1.5" fill="#404040" stroke="#202020" strokeWidth="0.4" />
              <circle cx="9" cy="13" r="1.5" fill="#404040" stroke="#202020" strokeWidth="0.4" />
            </g>

            {/* Second shopping cart */}
            <g transform={`translate(${BRT[0] + 12}, ${(BRT[1] + BRB[1]) / 2 + 12})`}>
              {/* Cart basket */}
              <path d="M 0,0 L 2,-2 L 10,-2 L 12,0 L 10,8 L 2,8 Z" fill="#c0c0c0" stroke="#808080" strokeWidth="0.6" />
              {/* Cart grid */}
              <line x1="3" y1="-2" x2="3" y2="8" stroke="#808080" strokeWidth="0.4" />
              <line x1="6" y1="-2" x2="6" y2="8" stroke="#808080" strokeWidth="0.4" />
              <line x1="9" y1="-2" x2="9" y2="8" stroke="#808080" strokeWidth="0.4" />
              <line x1="2" y1="2" x2="10" y2="2" stroke="#808080" strokeWidth="0.4" />
              <line x1="2" y1="5" x2="10" y2="5" stroke="#808080" strokeWidth="0.4" />
              {/* Cart handle */}
              <path d="M 2,8 L 0,11 M 10,8 L 12,11" stroke="#808080" strokeWidth="1" fill="none" />
              <line x1="0" y1="11" x2="12" y2="11" stroke="#808080" strokeWidth="1.2" strokeLinecap="round" />
              {/* Wheels */}
              <circle cx="3" cy="13" r="1.5" fill="#404040" stroke="#202020" strokeWidth="0.4" />
              <circle cx="9" cy="13" r="1.5" fill="#404040" stroke="#202020" strokeWidth="0.4" />
            </g>
          </>
        )}

        {/* ── Analytics office decorations ── */}
        {id === "analytics" && !locked && (
          <>
            {/* Satellite dish on roof */}
            <g transform={`translate(${RBLT[0] + 4}, ${RBLT[1] - 16})`}>
              {/* Dish pole */}
              <line x1="0" y1="16" x2="0" y2="6" stroke="#8a8a8a" strokeWidth="1.5" />
              {/* Dish */}
              <ellipse cx="0" cy="4" rx="6" ry="3.5" fill="#d0d0d0" stroke="#999" strokeWidth="0.5" />
              <ellipse cx="0" cy="4" rx="4" ry="2.2" fill="#e8e8e8" />
              {/* Receiver arm */}
              <line x1="0" y1="4" x2="2" y2="-2" stroke="#666" strokeWidth="0.8" />
              <circle cx="2" cy="-2" r="1" fill="#4285F4" />
            </g>

            {/* Large monitor/screen on north wall */}
            <g>
              {(() => {
                const sx = ix + w * 0.15, sx2 = ix + w * 0.85;
                const sy1 = gy + h * 0.35, sy2 = gy + h * 0.75;
                const screenPts = [
                  iso(sx, iz, sy1), iso(sx2, iz, sy1),
                  iso(sx2, iz, sy2), iso(sx, iz, sy2),
                ] as Array<[number, number]>;
                return (
                  <>
                    {/* Screen bezel */}
                    <polygon points={pts(screenPts)} fill="#1a1a2e" stroke="#333" strokeWidth="0.8" />
                    {/* Screen content - bar chart */}
                    {[0.25, 0.40, 0.55, 0.70].map((offset, bi) => {
                      const barH = [0.55, 0.72, 0.45, 0.85][bi];
                      const barColor = ["#4285F4", "#34A853", "#FBBC05", "#EA4335"][bi];
                      const bx1 = ix + w * (offset - 0.02), bx2 = ix + w * (offset + 0.06);
                      const by1 = gy + h * (0.75 - barH * 0.35), by2 = gy + h * 0.73;
                      const barPts = [
                        iso(bx1, iz, by1), iso(bx2, iz, by1),
                        iso(bx2, iz, by2), iso(bx1, iz, by2),
                      ] as Array<[number, number]>;
                      return <polygon key={bi} points={pts(barPts)} fill={barColor} opacity="0.9" />;
                    })}
                  </>
                );
              })()}
            </g>

            {/* Smaller screen on west wall */}
            <g>
              {(() => {
                const sy1 = gy + h * 0.4, sy2 = gy + h * 0.7;
                const sz1 = iz + d * 0.2, sz2 = iz + d * 0.75;
                const screenPts = [
                  iso(ix, sz1, sy1), iso(ix, sz2, sy1),
                  iso(ix, sz2, sy2), iso(ix, sz1, sy2),
                ] as Array<[number, number]>;
                return (
                  <>
                    <polygon points={pts(screenPts)} fill="#1a1a2e" stroke="#333" strokeWidth="0.6" />
                    {/* Pie chart */}
                    {(() => {
                      const cx2 = (screenPts[0][0] + screenPts[1][0]) / 2;
                      const cy2 = (screenPts[0][1] + screenPts[2][1]) / 2;
                      return (
                        <>
                          <circle cx={cx2} cy={cy2} r="5" fill="#4285F4" />
                          <path d={`M ${cx2} ${cy2} L ${cx2} ${cy2-5} A 5 5 0 0 1 ${cx2+4.3} ${cy2+2.5} Z`} fill="#34A853" />
                          <path d={`M ${cx2} ${cy2} L ${cx2+4.3} ${cy2+2.5} A 5 5 0 0 1 ${cx2-2} ${cy2+4.6} Z`} fill="#FBBC05" />
                        </>
                      );
                    })()}
                  </>
                );
              })()}
            </g>

            {/* Google-colored accent stripe at base */}
            {(() => {
              const stripeH = 0.12;
              const stripePts = [
                iso(ix, iz, gy), iso(ix + w, iz, gy),
                iso(ix + w, iz, gy + stripeH), iso(ix, iz, gy + stripeH),
              ] as Array<[number, number]>;
              return <polygon points={pts(stripePts)} fill="#4285F4" opacity="0.7" />;
            })()}

            {/* Potted plant by entrance */}
            <g transform={`translate(${BLB[0] - 8}, ${BLB[1] + 2})`}>
              {/* Pot */}
              <rect x="0" y="4" width="7" height="6" rx="1" fill="#8B4513" stroke="#5a3a20" strokeWidth="0.4" />
              <rect x="-0.5" y="3" width="8" height="2" rx="1" fill="#6b3a1a" />
              {/* Plant */}
              <circle cx="3.5" cy="0" r="4" fill="#2d8030" />
              <circle cx="3.5" cy="-3" r="3" fill="#3a9940" />
              <circle cx="1.5" cy="-1" r="2.5" fill="#45a845" />
              <circle cx="5.5" cy="-1" r="2.5" fill="#45a845" />
            </g>

            {/* Second potted plant */}
            <g transform={`translate(${BRB[0] + 2}, ${BRB[1] + 2})`}>
              <rect x="0" y="4" width="7" height="6" rx="1" fill="#8B4513" stroke="#5a3a20" strokeWidth="0.4" />
              <rect x="-0.5" y="3" width="8" height="2" rx="1" fill="#6b3a1a" />
              <circle cx="3.5" cy="0" r="4" fill="#2d8030" />
              <circle cx="3.5" cy="-3" r="3" fill="#3a9940" />
              <circle cx="1.5" cy="-1" r="2.5" fill="#45a845" />
              <circle cx="5.5" cy="-1" r="2.5" fill="#45a845" />
            </g>
          </>
        )}

        {/* ── Name label (neon for grocery store) ── */}
        {isGroceryStore ? (
          <>
            {/* Neon glow effect */}
            <defs>
              <filter id="neonGlow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            {/* Neon backing */}
            <rect x={labelPos[0] - name.length * 5.5} y={labelPos[1]-2} width={name.length * 11} height="22" rx="4" fill="rgba(20,20,20,0.85)" />
            {/* Neon glow layers */}
            <text x={labelPos[0]} y={labelPos[1]+10} textAnchor="middle" dominantBaseline="middle"
              fontSize="12" fill="#22c55e" fontWeight="900" fontFamily="Kalam, cursive" filter="url(#neonGlow)">
              {name.toUpperCase()}
              <animate attributeName="opacity" values="0.85;1;0.85" dur="2s" repeatCount="indefinite" />
            </text>
            {/* Bright core */}
            <text x={labelPos[0]} y={labelPos[1]+10} textAnchor="middle" dominantBaseline="middle"
              fontSize="12" fill="#4ade80" fontWeight="900" fontFamily="Kalam, cursive">
              {name.toUpperCase()}
            </text>
          </>
        ) : (
          <>
            <rect x={labelPos[0] - name.length * 4.2} y={labelPos[1]+2} width={name.length * 8.4} height="16" rx="8" fill="rgba(10,30,10,0.65)" />
            <text x={labelPos[0]} y={labelPos[1]+10} textAnchor="middle" dominantBaseline="middle"
              fontSize="9" fill="white" fontWeight="700" fontFamily="Kalam, cursive">
              {name.toUpperCase()}
            </text>
          </>
        )}


      </motion.g>
    </g>
  );
}

// ─── Tree ─────────────────────────────────────────────────────────────────────
function IsoTree({ ix, iz, h = 1 }: { ix: number; iz: number; h?: number }) {
  const base  = iso(ix, iz, GH);
  const trunk = iso(ix, iz, GH + h * 0.4);
  const top   = iso(ix, iz, GH + h);

  return (
    <g>
      <line x1={base[0]} y1={base[1]} x2={trunk[0]} y2={trunk[1]} stroke="#6b3f1a" strokeWidth="4" strokeLinecap="round" />
      <circle cx={top[0]} cy={top[1] + 4}  r={16 * h} fill="#2d6820" />
      <circle cx={top[0]} cy={top[1]}       r={14 * h} fill="#3a8028" />
      <circle cx={top[0]} cy={top[1] - 6}   r={10 * h} fill="#4a9c30" />
      <circle cx={top[0]} cy={top[1] - 11}  r={6 * h}  fill="#5ab83a" />
    </g>
  );
}

// ─── Island cliff faces ───────────────────────────────────────────────────────
function IslandCliff() {
  const cliffFaces: JSX.Element[] = [];
  const n = ISLAND_OUTLINE.length;

  for (let i = 0; i < n; i++) {
    const [ax, az] = ISLAND_OUTLINE[i];
    const [bx, bz] = ISLAND_OUTLINE[(i + 1) % n];
    const dx = bx - ax, dz = bz - az;

    if (dx > dz) {
      const topA = iso(ax, az, GH);
      const topB = iso(bx, bz, GH);
      const botA = iso(ax, az, 0);
      const botB = iso(bx, bz, 0);

      const ratio = Math.max(0, Math.min(1, (dx - dz) / (Math.abs(dx) + Math.abs(dz) + 0.001)));
      const r = Math.round(55 + ratio * 22);
      const g = Math.round(95 + ratio * 22);
      const b = Math.round(38 + ratio * 12);
      const cliffColor = `rgb(${r},${g},${b})`;

      cliffFaces.push(
        <polygon key={`cliff-${i}`} points={pts([topA, topB, botB, botA])} fill={cliffColor} stroke="rgba(0,0,0,0.07)" strokeWidth="0.5" />
      );
    }
  }
  return <>{cliffFaces}</>;
}

// ─── Island grass top ─────────────────────────────────────────────────────────
function IslandTop() {
  const topPts = ISLAND_OUTLINE.map(([ix, iz]) => iso(ix, iz, GH));
  return (
    <>
      <polygon points={pts(topPts)} fill="#5ca83a" />
      <polygon
        points={pts(ISLAND_OUTLINE.map(([ix, iz]) => {
          const [sx, sy] = iso(ix * 0.5, iz * 0.5, GH);
          return [sx, sy] as [number, number];
        }))}
        fill="#6ec048" opacity="0.45"
      />
    </>
  );
}

// ─── Dirt path between two grid points ───────────────────────────────────────
function DirtPath({ ax, az, bx, bz }: { ax: number; az: number; bx: number; bz: number }) {
  const a = iso(ax, az, GH + 0.02);
  const b = iso(bx, bz, GH + 0.02);
  return (
    <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#c4a060" strokeWidth="7" strokeLinecap="round" opacity="0.50" />
  );
}

// ─── 3D Character ─────────────────────────────────────────────────────────────
function IsoCharacter({ ix, iz }: { ix: number; iz: number }) {
  const base = iso(ix, iz, GH);
  const x = base[0];
  const y = base[1];

  return (
    <g>
      {/* Ground shadow */}
      <ellipse cx={x} cy={y + 2} rx={12} ry={5} fill="rgba(0,0,0,0.18)" />

      <g>
        {/* Bobbing animation */}
        <animateTransform attributeName="transform" type="translate"
          values={`0,0; 0,-3; 0,0`} dur="1.8s" repeatCount="indefinite" additive="sum"
        />

        {/* ── Shoes ── */}
        <ellipse cx={x - 5} cy={y - 1} rx={6} ry={3.5} fill="#1e1208" />
        <ellipse cx={x + 5} cy={y - 1} rx={6} ry={3.5} fill="#1e1208" />

        {/* ── Legs ── */}
        <rect x={x - 9} y={y - 16} width={7} height={15} rx={3} fill="#2a3560" />
        <rect x={x + 2} y={y - 16} width={7} height={15} rx={3} fill="#2a3560" />

        {/* ── Body ── */}
        <ellipse cx={x} cy={y - 26} rx={13} ry={14} fill="#006b3f" />
        {/* Shirt collar detail */}
        <ellipse cx={x} cy={y - 37} rx={5} ry={3} fill="#00854e" />

        {/* ── Left arm ── */}
        <g transform={`rotate(30, ${x - 13}, ${y - 26})`}>
          <ellipse cx={x - 15} cy={y - 24} rx={4.5} ry={7} fill="#30885a" />
          {/* hand */}
          <circle cx={x - 15} cy={y - 16} r={4} fill="#f5c99a" />
        </g>

        {/* ── Right arm ── */}
        <g transform={`rotate(-30, ${x + 13}, ${y - 26})`}>
          <ellipse cx={x + 15} cy={y - 24} rx={4.5} ry={7} fill="#30885a" />
          {/* hand */}
          <circle cx={x + 15} cy={y - 16} r={4} fill="#f5c99a" />
        </g>

        {/* ── Neck ── */}
        <rect x={x - 4} y={y - 41} width={8} height={6} rx={3} fill="#f5c99a" />

        {/* ── Head ── */}
        <circle cx={x} cy={y - 52} r={15} fill="#f5c99a" />

        {/* ── Hair ── */}
        <ellipse cx={x} cy={y - 64} rx={13} ry={7} fill="#3d2010" />
        <ellipse cx={x - 8} cy={y - 60} rx={6} ry={8} fill="#3d2010" />
        <ellipse cx={x + 8} cy={y - 60} rx={6} ry={8} fill="#3d2010" />
        {/* hair front fringe */}
        <ellipse cx={x - 5} cy={y - 55} rx={5} ry={3.5} fill="#3d2010" />
        <ellipse cx={x + 5} cy={y - 55} rx={5} ry={3.5} fill="#3d2010" />

        {/* ── Chef's hat ── */}
        {/* Band */}
        <rect x={x - 13} y={y - 68} width={26} height={8} rx={2} fill="#e8e4dc" />
        <rect x={x - 13} y={y - 68} width={26} height={8} rx={2}
          fill="none" stroke="#ccc8c0" strokeWidth="0.8" />
        {/* Puffy top — layered ellipses for volume */}
        <ellipse cx={x} cy={y - 88} rx={11} ry={22} fill="#f5f2ea" />
        <ellipse cx={x - 4} cy={y - 88} rx={9} ry={20} fill="#faf8f2" opacity="0.6" />
        <ellipse cx={x} cy={y - 100} rx={9} ry={10} fill="#faf8f2" />
        {/* Hat outline */}
        <ellipse cx={x} cy={y - 88} rx={11} ry={22}
          fill="none" stroke="#dedad2" strokeWidth="0.8" />
        {/* Band highlight stripe */}
        <line x1={x - 5} y1={y - 67} x2={x - 5} y2={y - 61}
          stroke="#006b3f" strokeWidth="1.5" opacity="0.5" />
        <line x1={x + 2} y1={y - 67} x2={x + 2} y2={y - 61}
          stroke="#006b3f" strokeWidth="1.5" opacity="0.5" />

        {/* ── Eyes ── */}
        <ellipse cx={x - 5} cy={y - 52} rx={3} ry={3.5} fill="#1a1208" />
        <ellipse cx={x + 5} cy={y - 52} rx={3} ry={3.5} fill="#1a1208" />
        {/* Eye shine */}
        <circle cx={x - 4} cy={y - 54} r={1.2} fill="white" />
        <circle cx={x + 6} cy={y - 54} r={1.2} fill="white" />

        {/* ── Blush ── */}
        <ellipse cx={x - 9} cy={y - 49} rx={3.5} ry={2} fill="#ffaabb" opacity="0.55" />
        <ellipse cx={x + 9} cy={y - 49} rx={3.5} ry={2} fill="#ffaabb" opacity="0.55" />

        {/* ── Smile ── */}
        <path d={`M ${x-4} ${y-46} Q ${x} ${y-42} ${x+4} ${y-46}`}
          stroke="#c07040" strokeWidth="1.4" fill="none" strokeLinecap="round"
        />

        {/* ── Little M&S logo badge on chest ── */}
        <circle cx={x + 5} cy={y - 28} r={4} fill="#d4a843" />
        <text x={x + 5} y={y - 27} textAnchor="middle" dominantBaseline="middle"
          fontSize="4.5" fill="white" fontWeight="900" fontFamily="Nunito, sans-serif">M</text>
      </g>
    </g>
  );
}

// ─── Flying Bird ──────────────────────────────────────────────────────────────
function IsoBird({ cx, cy }: { cx: number; cy: number }) {
  const r = 38; // orbit radius
  const id = "bird-orbit";
  return (
    <g>
      {/* Elliptical orbit path — bird follows this */}
      <animateMotion
        dur="0"
        // defined below via <mpath>
      />
      {/* Bird group, animated along an elliptical path */}
      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          // keyframe pairs: x,y around an ellipse centered on (cx, cy-80)
          // 16 keyframes for a smooth loop
          values={[
            `${cx + r},${cy - 80}`,
            `${cx + r * 0.92},${cy - 80 - r * 0.24}`,
            `${cx + r * 0.71},${cy - 80 - r * 0.43}`,
            `${cx + r * 0.38},${cy - 80 - r * 0.55}`,
            `${cx},${cy - 80 - r * 0.6}`,
            `${cx - r * 0.38},${cy - 80 - r * 0.55}`,
            `${cx - r * 0.71},${cy - 80 - r * 0.43}`,
            `${cx - r * 0.92},${cy - 80 - r * 0.24}`,
            `${cx - r},${cy - 80}`,
            `${cx - r * 0.92},${cy - 80 + r * 0.24}`,
            `${cx - r * 0.71},${cy - 80 + r * 0.43}`,
            `${cx - r * 0.38},${cy - 80 + r * 0.55}`,
            `${cx},${cy - 80 + r * 0.6}`,
            `${cx + r * 0.38},${cy - 80 + r * 0.55}`,
            `${cx + r * 0.71},${cy - 80 + r * 0.43}`,
            `${cx + r * 0.92},${cy - 80 + r * 0.24}`,
            `${cx + r},${cy - 80}`,
          ].join("; ")}
          dur="5s"
          repeatCount="indefinite"
          additive="replace"
        />
        {/* Wing flap — body stays, wings oscillate */}
        {/* Body */}
        <ellipse cx={0} cy={0} rx={5} ry={3} fill="#ffffff" />
        {/* Left wing */}
        <g>
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 0 0; -30 0 0; 0 0 0; 10 0 0; 0 0 0"
            dur="0.55s"
            repeatCount="indefinite"
          />
          <path d="M -1,0 Q -10,-10 -16,-4 Q -10,-2 -1,0 Z" fill="#e8e8e8" />
        </g>
        {/* Right wing */}
        <g>
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 0 0; 30 0 0; 0 0 0; -10 0 0; 0 0 0"
            dur="0.55s"
            repeatCount="indefinite"
          />
          <path d="M 1,0 Q 10,-10 16,-4 Q 10,-2 1,0 Z" fill="#e8e8e8" />
        </g>
        {/* Head */}
        <circle cx={5} cy={-1} r={3} fill="#f0e8c0" />
        {/* Beak */}
        <path d="M 7.5,-1 L 10,0 L 7.5,1 Z" fill="#e8a830" />
        {/* Eye */}
        <circle cx={6} cy={-1.5} r={0.8} fill="#1a1208" />
        {/* Shadow on ground (faint, below character) */}
      </g>
    </g>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface Building {
  id: string; name: string; emoji: string; description: string;
  color: string; shadowColor: string; xpReward: number;
  unlocked: boolean; completed: boolean;
}

interface IslandMapProps {
  buildings: Building[];
  onBuildingClick: (building: Building) => void;
  level: number; xp: number; maxXp: number;
}

// ─── Main component ───────────────────────────────────────────────────────────
export function IslandMap({ buildings, onBuildingClick }: IslandMapProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const buildMap = Object.fromEntries(buildings.map(b => [b.id, b]));

  const clouds = [
    { x: 80,  y: 42,  r: 1.0, speed: 6 },
    { x: 270, y: 25,  r: 0.8, speed: 9 },
    { x: 510, y: 48,  r: 1.1, speed: 7 },
    { x: 630, y: 20,  r: 0.7, speed: 11 },
  ];

  // Path endpoints: center of each building → center of island
  const paths: [number, number, number, number][] = [
    [ 1.8+0.9, -4.8+0.9,  0.5, -0.5],
    [-4.5+0.8, -4.0+0.8, -0.5, -0.5],
    [ 4.2+0.9,  0.2+0.9,  0.8,  0.4],
    [-5.5+0.8,  0.8+0.8, -0.8,  0.4],
    [ 2.0+0.9,  4.0+0.9,  0.5,  1.2],
    [-4.8+0.8,  3.5+0.8, -0.5,  1.2],
  ];

  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl">
      <svg
        viewBox="0 0 700 480"
        className="w-full h-full"
        style={{ background: "linear-gradient(180deg, #7ec8f0 0%, #b0dcf8 35%, #d8f0ff 60%, #6bbcd4 80%, #4aa8c8 100%)" }}
      >
        <defs>
          <radialGradient id="waterGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a0e0f8" />
            <stop offset="100%" stopColor="#5bb4d8" />
          </radialGradient>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5bb0e8" />
            <stop offset="100%" stopColor="#b8dcf8" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Sky */}
        <rect x="0" y="0" width="700" height="480" fill="url(#skyGrad)" />

        {/* Sun */}
        {/* Outer halo pulse */}
        <circle cx="620" cy="58" r="52" fill="#ffe066" opacity="0.12">
          <animate attributeName="r" values="48;58;48" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.08;0.18;0.08" dur="3s" repeatCount="indefinite" />
        </circle>
        {/* Mid glow ring */}
        <circle cx="620" cy="58" r="42" fill="#ffcc00" opacity="0.22">
          <animate attributeName="r" values="40;46;40" dur="2.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.15;0.3;0.15" dur="2.2s" repeatCount="indefinite" />
        </circle>
        {/* Main disc */}
        <circle cx="620" cy="58" r="30" fill="#ffe066" opacity="0.95" filter="url(#glow)">
          <animate attributeName="r" values="28;31;28" dur="4s" repeatCount="indefinite" />
        </circle>
        {/* Bright core */}
        <circle cx="620" cy="58" r="20" fill="#fff8c0">
          <animate attributeName="opacity" values="0.85;1;0.85" dur="2s" repeatCount="indefinite" />
        </circle>
        {/* Rotating rays group */}
        <g style={{ transformOrigin: "620px 58px" }}>
          <animateTransform attributeName="transform" type="rotate"
            values="0 620 58; 360 620 58" dur="18s" repeatCount="indefinite" />
          {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg, i) => {
            const isLong = i % 3 === 0;
            const r1 = isLong ? 34 : 32;
            const r2 = isLong ? 52 : 44;
            const w = isLong ? 3 : 1.8;
            return (
              <line key={deg}
                x1={620 + Math.cos(deg*Math.PI/180)*r1} y1={58 + Math.sin(deg*Math.PI/180)*r1}
                x2={620 + Math.cos(deg*Math.PI/180)*r2} y2={58 + Math.sin(deg*Math.PI/180)*r2}
                stroke="#ffe066" strokeWidth={w} strokeLinecap="round" opacity={isLong ? 0.85 : 0.5}
              />
            );
          })}
        </g>

        {/* Clouds */}
        {clouds.map((c, i) => (
          <g key={i} opacity="0.88">
            <ellipse cx={c.x} cy={c.y} rx={28*c.r} ry={14*c.r} fill="white" />
            <ellipse cx={c.x-15*c.r} cy={c.y+5*c.r} rx={18*c.r} ry={11*c.r} fill="white" />
            <ellipse cx={c.x+15*c.r} cy={c.y+5*c.r} rx={18*c.r} ry={11*c.r} fill="white" />
            <animateTransform attributeName="transform" type="translate"
              values={`0,0; ${c.speed},0; 0,0`} dur={`${20+i*5}s`} repeatCount="indefinite"
            />
          </g>
        ))}

        {/* Water */}
        <ellipse cx={OX} cy={OY + 65} rx={420} ry={200} fill="url(#waterGlow)" opacity="0.9" />
        {[[-90,30],[110,20],[-55,-22],[140,55],[65,-42],[-130,12]].map(([dx,dy],i)=>(
          <circle key={i} cx={OX+dx} cy={OY+55+dy} r="3" fill="white" opacity="0.5">
            <animate attributeName="opacity" values="0.3;0.8;0.3" dur={`${2+i*0.7}s`} repeatCount="indefinite" />
            <animate attributeName="r" values="2;4;2" dur={`${2+i*0.7}s`} repeatCount="indefinite" />
          </circle>
        ))}

        {/* Island platform */}
        <IslandCliff />
        <IslandTop />

        {/* Sandy beach border */}
        <polygon
          points={pts(ISLAND_OUTLINE.map(([ix, iz]) => iso(ix, iz, GH)))}
          fill="none" stroke="#d4bc78" strokeWidth="5" opacity="0.42"
        />

        {/* Dirt paths */}
        {paths.map(([ax,az,bx,bz], i) => (
          <DirtPath key={i} ax={ax} az={az} bx={bx} bz={bz} />
        ))}

        {/* Background trees (northwest — rendered before buildings) */}
        <IsoTree ix={-2.5} iz={-6.0} h={0.90} />
        <IsoTree ix={ 0.5} iz={-6.2} h={1.00} />
        <IsoTree ix={ 4.2} iz={-3.5} h={0.85} />
        <IsoTree ix={-0.5} iz={-3.0} h={0.80} />
        <IsoTree ix={ 2.5} iz={-2.5} h={0.75} />

        {/* ── Buildings in painter's order ── */}
        {BUILD_ORDER.map(bid => {
          const def = BUILD_ISO[bid];
          if (!def) return null;
          const b = buildMap[bid];
          if (!b) return null;
          return (
            <IsoBuilding
              key={bid}
              id={bid}
              ix={def.ix} iz={def.iz}
              w={def.w} d={def.d} h={def.h}
              color={def.color} accent={def.accent}
              emoji={b.emoji}
              unlocked={b.unlocked}
              completed={b.completed}
              hovered={hovered === bid}
              onClick={() => onBuildingClick(b)}
              onHover={(v) => setHovered(v ? bid : null)}
              xpReward={b.xpReward}
              name={b.name}
            />
          );
        })}

        {/* ── Little character standing in the center plaza ── */}
        <IsoCharacter ix={0.2} iz={0.2} />
        {/* ── Bird circling above the character ── */}
        {(() => { const [bx, by] = iso(0.2, 0.2, GH); return <IsoBird cx={bx} cy={by} />; })()}

        {/* Foreground trees (southeast — rendered after buildings) */}
        <IsoTree ix={ 4.0} iz={ 4.5} h={0.85} />
        <IsoTree ix={-2.0} iz={ 5.8} h={0.95} />
        <IsoTree ix={ 0.8} iz={ 5.5} h={0.80} />
        <IsoTree ix={ 5.5} iz={ 2.5} h={0.75} />
        <IsoTree ix={-0.5} iz={ 3.0} h={0.70} />

        {/* Ground flowers */}
        {[
          [-1.2, -1.5, "#ffdd57"], [ 1.5, -2.0, "#ff8fab"],
          [-2.0,  1.5, "#80e0ff"], [ 2.0,  0.5, "#ffdd57"],
          [ 0.0,  0.8, "#ff8fab"], [-0.5, -0.8, "#ffdd57"],
          [ 3.2, -2.8, "#ff8fab"], [-3.0, -0.5, "#80e0ff"],
          [ 0.8,  3.2, "#ffdd57"], [-1.0,  2.8, "#ff8fab"],
          [ 2.5,  2.0, "#80e0ff"], [-2.5,  2.0, "#ffdd57"],
          [ 0.5, -4.0, "#ff8fab"], [-3.5, -2.5, "#ffdd57"],
        ].map(([fix, fiz, fc], i) => {
          const fp = iso(fix as number, fiz as number, GH + 0.02);
          return (
            <g key={i}>
              <circle cx={fp[0]} cy={fp[1]} r="4.5" fill={fc as string} opacity="0.82">
                <animate attributeName="cy" values={`${fp[1]};${fp[1]-3};${fp[1]}`} dur={`${3+i*0.4}s`} repeatCount="indefinite"/>
              </circle>
              <circle cx={fp[0]+4} cy={fp[1]+2} r="3" fill={fc as string} opacity="0.55" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
