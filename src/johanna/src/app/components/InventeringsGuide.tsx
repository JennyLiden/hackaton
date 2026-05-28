import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronRight, ChevronLeft, Package, Barcode, AlertTriangle, CheckCircle, FileText } from "lucide-react";

const MS = {
  green: "#006b3f",
  greenLight: "#4a9060",
  greenPale: "#e8f5ee",
  gold: "#d4a843",
  goldLight: "#f0e0a0",
  goldPale: "#fffbf0",
  goldDark: "#a07820",
  cream: "#f5f2eb",
  dark: "#1a2e1a",
  muted: "#6b7a6b",
};

interface Screen {
  id: number;
  emoji: string;
  rubrik: string;
  ingress?: string;
  brodtext?: string;
  tips?: string;
  illustration: React.ReactNode;
  primaryCta: string;
  secondaryCta?: string;
  chips?: string[];
  statusChips?: { label: string; color: string; bg: string }[];
  typCards?: { label: string; sub: string }[];
  bullets?: string[];
  tooltips?: { term: string; def: string }[];
}

/* ── Illustrations ── */

function IntroIllustration() {
  const items = [
    { icon: "📦", label: "Välj typ", done: true },
    { icon: "🔢", label: "Räkna", done: false },
    { icon: "✅", label: "Attestera", done: false },
  ];
  return (
    <div className="flex items-center justify-center gap-2 w-full">
      {items.map((item, i) => (
        <motion.div
          key={i}
          className="flex flex-col items-center gap-1.5 flex-1"
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: i * 0.12 + 0.1 }}
        >
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{
              background: item.done ? "linear-gradient(135deg, #d4a843, #a07820)" : "white",
              border: `2px solid ${item.done ? "#d4a843" : "#e8e4d9"}`,
              boxShadow: item.done ? "0 4px 12px rgba(212,168,67,0.35)" : "none",
            }}
          >
            <span style={{ fontSize: "1.3rem" }}>{item.icon}</span>
          </div>
          <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "0.68rem", color: item.done ? MS.goldDark : MS.muted }}>
            {item.label}
          </span>
          {i < items.length - 1 && (
            <div className="absolute" style={{ display: "none" }} />
          )}
        </motion.div>
      ))}
    </div>
  );
}

function TypIllustration() {
  const types = [
    { label: "Full", icon: "🏪", active: false },
    { label: "Del", icon: "🗂️", active: true },
    { label: "Cykel", icon: "🔄", active: false },
    { label: "Blind", icon: "🙈", active: false },
  ];
  return (
    <div className="grid grid-cols-2 gap-2 w-full">
      {types.map((t, i) => (
        <motion.div
          key={i}
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
          style={{
            background: t.active ? "linear-gradient(135deg, #fffbf0, #fff3d4)" : "white",
            border: `2px solid ${t.active ? MS.gold : "#e8e4d9"}`,
            boxShadow: t.active ? "0 3px 10px rgba(212,168,67,0.25)" : "none",
          }}
          initial={{ scale: 0.88, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: i * 0.09 + 0.1, type: "spring", damping: 16 }}
        >
          <span style={{ fontSize: "1.1rem" }}>{t.icon}</span>
          <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: t.active ? 800 : 600, fontSize: "0.78rem", color: t.active ? MS.goldDark : MS.dark }}>
            {t.label}
          </span>
          {t.active && <CheckCircle size={13} color={MS.gold} className="ml-auto flex-shrink-0" />}
        </motion.div>
      ))}
    </div>
  );
}

function ForberedIllustration() {
  const checks = [
    { label: "Stoppa plock", done: true },
    { label: "Städa hyllplan", done: true },
    { label: "Ha skanner redo", done: false },
  ];
  return (
    <div className="flex flex-col gap-2 w-full">
      {checks.map((c, i) => (
        <motion.div
          key={i}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
          style={{
            background: c.done ? MS.goldPale : "white",
            border: `1.5px solid ${c.done ? "#e8c878" : "#e8e4d9"}`,
          }}
          initial={{ x: -16, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: i * 0.12 + 0.1 }}
        >
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: c.done ? MS.gold : "#e8e4d9" }}
          >
            {c.done && <span style={{ color: "white", fontSize: "0.65rem", fontWeight: 900 }}>✓</span>}
          </div>
          <span style={{ fontFamily: "Nunito Sans, sans-serif", fontSize: "0.82rem", color: c.done ? MS.goldDark : MS.dark, textDecoration: c.done ? "line-through" : "none", opacity: c.done ? 0.75 : 1 }}>
            {c.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

function RaknaIllustration() {
  return (
    <div className="flex flex-col gap-2 w-full">
      <motion.div
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
        style={{ background: "white", border: "1.5px solid #e8e4d9" }}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Barcode size={16} color={MS.gold} />
        <span style={{ fontFamily: "Nunito Sans, sans-serif", fontSize: "0.78rem", color: MS.muted }}>
          Skanna eller sök artikel…
        </span>
      </motion.div>
      <div className="flex gap-2">
        {["st", "kg", "l", "fp", "krt"].map((u, i) => (
          <motion.span
            key={u}
            className="px-2.5 py-1 rounded-lg"
            style={{
              background: i === 0 ? MS.gold : "white",
              color: i === 0 ? "white" : MS.muted,
              fontFamily: "Nunito, sans-serif",
              fontWeight: 700,
              fontSize: "0.7rem",
              border: i === 0 ? "none" : "1.5px solid #e8e4d9",
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.08 + 0.2, type: "spring", damping: 14 }}
          >
            {u}
          </motion.span>
        ))}
      </div>
      <motion.div
        className="flex items-center justify-between px-3 py-2 rounded-xl"
        style={{ background: MS.goldPale, border: `1.5px solid #e8c878` }}
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <span style={{ fontFamily: "Nunito Sans, sans-serif", fontSize: "0.76rem", color: MS.dark }}>Kycklingfilé 2 kg</span>
        <div className="flex items-center gap-2">
          <button className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "#e8e4d9", fontSize: "0.85rem" }}>−</button>
          <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "0.85rem", color: MS.dark, minWidth: "24px", textAlign: "center" }}>4</span>
          <button className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: MS.gold, fontSize: "0.85rem", color: "white" }}>+</button>
        </div>
      </motion.div>
    </div>
  );
}

function AvvikelseIllustration() {
  const rows = [
    { name: "Lax, norsk", diff: "−12 kg", pct: "−24%", flag: true },
    { name: "Mjölk 3%", diff: "+3 l", pct: "+6%", flag: false },
    { name: "Smör 500g", diff: "−18 fp", pct: "−36%", flag: true },
  ];
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {rows.map((r, i) => (
        <motion.div
          key={i}
          className="flex items-center gap-2 px-3 py-2 rounded-xl"
          style={{
            background: r.flag ? "#fff5f5" : "white",
            border: `1.5px solid ${r.flag ? "#f0c0c0" : "#e8e4d9"}`,
          }}
          initial={{ x: 16, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: i * 0.1 + 0.1 }}
        >
          {r.flag && <AlertTriangle size={13} color="#c06060" className="flex-shrink-0" />}
          <span style={{ fontFamily: "Nunito Sans, sans-serif", fontSize: "0.76rem", color: MS.dark, flex: 1 }}>{r.name}</span>
          <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "0.74rem", color: r.flag ? "#c06060" : "#4a9060" }}>{r.diff}</span>
          <span
            className="px-1.5 py-0.5 rounded-full"
            style={{ background: r.flag ? "#f0c0c0" : "#d4eddf", fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "0.65rem", color: r.flag ? "#903030" : MS.green }}
          >
            {r.pct}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

function AttestIllustration() {
  const summary = [
    { label: "Rader räknade", value: "342", icon: "📋" },
    { label: "Avvikelser", value: "14", icon: "⚠️" },
    { label: "Värdepåverkan", value: "−4 200 kr", icon: "💰" },
  ];
  return (
    <div className="flex flex-col gap-2 w-full">
      {summary.map((s, i) => (
        <motion.div
          key={i}
          className="flex items-center justify-between px-3 py-2 rounded-xl"
          style={{ background: "white", border: "1.5px solid #e8e4d9" }}
          initial={{ x: -12, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: i * 0.1 + 0.1 }}
        >
          <div className="flex items-center gap-2">
            <span style={{ fontSize: "0.95rem" }}>{s.icon}</span>
            <span style={{ fontFamily: "Nunito Sans, sans-serif", fontSize: "0.78rem", color: MS.muted }}>{s.label}</span>
          </div>
          <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "0.82rem", color: MS.dark }}>{s.value}</span>
        </motion.div>
      ))}
      <motion.div
        className="flex items-center gap-2 px-3 py-2 rounded-xl"
        style={{ background: "linear-gradient(135deg, #fffbf0, #fff3d4)", border: `1.5px solid ${MS.gold}` }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.45 }}
      >
        <span style={{ fontSize: "0.95rem" }}>🔐</span>
        <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "0.75rem", color: MS.goldDark }}>
          Endast attestansvarig kan posta
        </span>
      </motion.div>
    </div>
  );
}

function KlartIllustration() {
  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <motion.div
        className="w-16 h-16 rounded-full flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #d4a843, #a07820)", boxShadow: "0 6px 20px rgba(212,168,67,0.45)" }}
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.1 }}
      >
        <CheckCircle size={32} color="white" />
      </motion.div>
      <div className="flex gap-2 flex-wrap justify-center">
        {["Sparad", "Omräknad", "Attesterad", "Postad"].map((s, i) => (
          <motion.span
            key={s}
            className="px-3 py-1 rounded-full"
            style={{
              background: i === 3 ? MS.gold : MS.goldPale,
              color: i === 3 ? "white" : MS.goldDark,
              fontFamily: "Nunito, sans-serif",
              fontWeight: 700,
              fontSize: "0.7rem",
              border: i === 3 ? "none" : `1px solid #e8c878`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.1 + 0.3, type: "spring", damping: 14 }}
          >
            ✓ {s}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

/* ── Screens data ── */

const SCREENS: Screen[] = [
  {
    id: 1,
    emoji: "📦",
    rubrik: "Inventera lagret rätt",
    ingress: "Välj inventeringstyp, räkna med skanner eller sök, och attestera innan postning.",
    illustration: <IntroIllustration />,
    primaryCta: "Starta inventering",
    secondaryCta: "Läs instruktion",
  },
  {
    id: 2,
    emoji: "🗂️",
    rubrik: "Välj typ och område",
    brodtext: "Välj full, del eller cykel. Avgränsa på zon, hylla, kategori eller datum.",
    illustration: <TypIllustration />,
    primaryCta: "Fortsätt",
    secondaryCta: "Avbryt",
    chips: ["Zon", "Hylla", "Kategori", "Datum"],
    tooltips: [
      { term: "Blind inventering", def: "Räkna utan att se lagersaldo — minskar bias och ger mer tillförlitliga siffror." },
      { term: "Omräkning", def: "Ny räkning av avvikande rad utförd av en annan person." },
      { term: "Differens", def: "Skillnad mellan räknat och registrerat antal." },
    ],
  },
  {
    id: 3,
    emoji: "✅",
    rubrik: "Förbered innan du räknar",
    brodtext: "Tre snabba förberedelser som minimerar fel och avbrott under räkningen.",
    illustration: <ForberedIllustration />,
    bullets: ["Stoppa plock", "Städa hyllplan", "Ha skanner redo"],
    primaryCta: "Börja räkna",
    secondaryCta: "Visa checklista",
    tips: "Proffstips: Stäng plock i området under inventering för färre missar.",
  },
  {
    id: 4,
    emoji: "🔢",
    rubrik: "Räkna och skanna",
    brodtext: "Skanna streckkod eller sök. Ange antal i rätt enhet. Lägg anteckning vid avvikelse.",
    illustration: <RaknaIllustration />,
    primaryCta: "Spara rad",
    secondaryCta: "Hoppa över",
    tips: "Proffstips: Räkna hylla för hylla för färre missar.",
    statusChips: [
      { label: "Ej räknad", color: MS.muted, bg: "#f0ede4" },
      { label: "Sparad", color: MS.green, bg: MS.greenPale },
      { label: "Omräknad", color: MS.goldDark, bg: MS.goldPale },
    ],
  },
  {
    id: 5,
    emoji: "⚠️",
    rubrik: "Hitta och säkra avvikelser",
    brodtext: "Vi markerar stora differenser. Tilldela omräkning och bifoga kommentar eller foto.",
    illustration: <AvvikelseIllustration />,
    primaryCta: "Skicka till omräkning",
    secondaryCta: "Visa differenser",
    tips: "Proffstips: Foto och kommentar är obligatoriskt vid avvikelse över tröskeln.",
  },
  {
    id: 6,
    emoji: "📋",
    rubrik: "Granska och attestera",
    brodtext: "Se sammanställning: differenser, värdepåverkan och rader utan ändring. Posta när klart.",
    illustration: <AttestIllustration />,
    primaryCta: "Posta inventering",
    secondaryCta: "Exportera CSV",
  },
  {
    id: 7,
    emoji: "🎉",
    rubrik: "Inventering klar",
    brodtext: "Justeringar bokade. Rapport finns under Exporter och Historik.",
    illustration: <KlartIllustration />,
    primaryCta: "Visa rapport",
    secondaryCta: "Till historik",
  },
];

interface InventeringsGuideProps {
  onClose: () => void;
  onComplete?: () => void;
}

export function InventeringsGuide({ onClose, onComplete }: InventeringsGuideProps) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [expandedTooltip, setExpandedTooltip] = useState<string | null>(null);

  const screen = SCREENS[step];
  const isLast = step === SCREENS.length - 1;
  const isFirst = step === 0;

  function goNext() {
    setDirection(1);
    if (isLast) {
      onComplete?.();
      onClose();
    } else {
      setStep(s => s + 1);
      setExpandedTooltip(null);
    }
  }

  function goPrev() {
    if (isFirst) return;
    setDirection(-1);
    setStep(s => s - 1);
    setExpandedTooltip(null);
  }

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4"
      style={{ background: "rgba(10, 20, 10, 0.82)", backdropFilter: "blur(8px)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{ perspective: "1000px", width: "100%", maxWidth: "440px" }}>
        <motion.div
          className="relative w-full rounded-3xl overflow-hidden shadow-2xl"
          style={{ background: "white" }}
          initial={{ scale: 0.7, y: 60, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.8, y: 40, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
        >
          {/* Header */}
          <div
            className="relative px-7 pt-7 pb-5"
            style={{ background: "linear-gradient(135deg, #d4a843, #a07820)" }}
          >
            <div
              className="absolute inset-0 rounded-t-3xl pointer-events-none"
              style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.14) 0%, transparent 100%)" }}
            />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.25)" }}
              aria-label="Stäng"
            >
              <X size={15} color="white" />
            </button>

            <div
              className="absolute top-4 left-4 px-3 py-1 rounded-full flex items-center gap-1.5"
              style={{ background: "rgba(255,255,255,0.22)" }}
            >
              <Package size={11} color="rgba(255,255,255,0.9)" />
              <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "0.72rem", color: "white" }}>
                Inventering
              </span>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <motion.span
                key={step}
                style={{ fontSize: "2.4rem" }}
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 14 }}
              >
                {screen.emoji}
              </motion.span>
              <div>
                <motion.h2
                  key={`h-${step}`}
                  style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.2rem", color: "white", lineHeight: 1.2 }}
                  initial={{ opacity: 0, x: direction * 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {screen.rubrik}
                </motion.h2>
                {screen.ingress && (
                  <motion.p
                    key={`i-${step}`}
                    style={{ color: "rgba(255,255,255,0.82)", fontSize: "0.8rem", fontFamily: "Nunito Sans, sans-serif", marginTop: "2px", lineHeight: 1.4 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    {screen.ingress}
                  </motion.p>
                )}
              </div>
            </div>

            {/* Progress dots */}
            <div className="flex gap-1.5 mt-4">
              {SCREENS.map((_, i) => (
                <motion.div
                  key={i}
                  className="rounded-full"
                  style={{ background: "rgba(255,255,255,0.9)" }}
                  animate={{
                    width: i === step ? "24px" : "6px",
                    height: "6px",
                    opacity: i <= step ? 1 : 0.35,
                  }}
                  transition={{ type: "spring", damping: 20 }}
                />
              ))}
            </div>
          </div>

          {/* Body */}
          <div className="px-7 py-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: direction * 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -30 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                {/* Illustration */}
                <div
                  className="relative mb-4 flex items-center justify-center min-h-[90px] rounded-2xl px-4 py-4"
                  style={{ background: MS.cream }}
                >
                  {screen.illustration}
                </div>

                {screen.brodtext && (
                  <p className="mb-4" style={{ fontFamily: "Nunito Sans, sans-serif", color: "#4a5e4a", fontSize: "0.9rem", lineHeight: 1.6 }}>
                    {screen.brodtext}
                  </p>
                )}

                {/* Filter chips */}
                {screen.chips && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {screen.chips.map(chip => (
                      <span
                        key={chip}
                        className="px-3 py-1 rounded-full"
                        style={{
                          background: MS.goldPale,
                          color: MS.goldDark,
                          fontFamily: "Nunito, sans-serif",
                          fontWeight: 700,
                          fontSize: "0.72rem",
                          border: `1px solid #e8c878`,
                        }}
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                )}

                {/* Status chips */}
                {screen.statusChips && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {screen.statusChips.map(s => (
                      <span
                        key={s.label}
                        className="px-3 py-1 rounded-full"
                        style={{
                          background: s.bg,
                          color: s.color,
                          fontFamily: "Nunito, sans-serif",
                          fontWeight: 700,
                          fontSize: "0.72rem",
                        }}
                      >
                        {s.label}
                      </span>
                    ))}
                  </div>
                )}

                {/* Tips */}
                {screen.tips && (
                  <div
                    className="flex items-start gap-2 px-3.5 py-2.5 rounded-2xl mb-4"
                    style={{ background: MS.goldPale, border: `1.5px solid #e8c878` }}
                  >
                    <span style={{ fontSize: "0.95rem", flexShrink: 0, marginTop: "1px" }}>💡</span>
                    <p style={{ fontFamily: "Nunito Sans, sans-serif", fontSize: "0.78rem", color: MS.goldDark, lineHeight: 1.5 }}>
                      {screen.tips}
                    </p>
                  </div>
                )}

                {/* Tooltips / glossary */}
                {screen.tooltips && (
                  <div className="flex flex-col gap-1.5 mb-4">
                    {screen.tooltips.map(t => (
                      <div key={t.term}>
                        <button
                          className="flex items-center gap-1.5 text-left w-full"
                          onClick={() => setExpandedTooltip(expandedTooltip === t.term ? null : t.term)}
                        >
                          <span
                            className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ background: "#e8e4d9", fontSize: "0.6rem", fontWeight: 800, color: MS.muted }}
                          >
                            ℹ
                          </span>
                          <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "0.78rem", color: MS.muted }}>
                            {t.term}
                          </span>
                        </button>
                        <AnimatePresence>
                          {expandedTooltip === t.term && (
                            <motion.p
                              className="ml-6 mt-1"
                              style={{ fontFamily: "Nunito Sans, sans-serif", fontSize: "0.75rem", color: "#4a5e4a", lineHeight: 1.5 }}
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              {t.def}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* CTAs */}
            <div className="flex flex-col gap-2 mt-2">
              <motion.button
                className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #d4a843, #a07820)",
                  color: "white",
                  fontFamily: "Nunito, sans-serif",
                  fontWeight: 800,
                  fontSize: "0.95rem",
                  boxShadow: "0 6px 20px rgba(212,168,67,0.38)",
                }}
                whileHover={{ scale: 1.02, boxShadow: "0 8px 28px rgba(212,168,67,0.48)" }}
                whileTap={{ scale: 0.97 }}
                onClick={goNext}
              >
                {screen.primaryCta}
                {!isLast && <ChevronRight size={17} />}
                {isLast && <span style={{ fontSize: "1rem" }}>🎉</span>}
              </motion.button>

              {screen.secondaryCta && (
                <button
                  className="w-full py-2.5 rounded-2xl flex items-center justify-center gap-1"
                  style={{
                    background: "transparent",
                    color: MS.muted,
                    fontFamily: "Nunito, sans-serif",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    border: "1.5px solid #e8e4d9",
                  }}
                  onClick={goNext}
                >
                  {screen.secondaryCta}
                </button>
              )}
            </div>

            {/* Nav footer */}
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={goPrev}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl"
                style={{
                  background: isFirst ? "transparent" : "#f5f2eb",
                  color: isFirst ? "transparent" : MS.muted,
                  fontFamily: "Nunito, sans-serif",
                  fontWeight: 700,
                  fontSize: "0.78rem",
                  pointerEvents: isFirst ? "none" : "auto",
                  transition: "all 0.2s",
                }}
              >
                <ChevronLeft size={14} /> Tillbaka
              </button>

              <span style={{ fontFamily: "Nunito Sans, sans-serif", fontSize: "0.72rem", color: MS.muted }}>
                {step + 1} av {SCREENS.length}
              </span>

              <button
                onClick={onClose}
                className="px-3 py-1.5 rounded-xl"
                style={{
                  background: "transparent",
                  color: MS.muted,
                  fontFamily: "Nunito, sans-serif",
                  fontWeight: 700,
                  fontSize: "0.78rem",
                }}
              >
                Avsluta guide
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
