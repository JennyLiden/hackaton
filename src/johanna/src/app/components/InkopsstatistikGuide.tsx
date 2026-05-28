import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronRight, ChevronLeft, BarChart2, TrendingUp, Filter, Download, Bell } from "lucide-react";

const MS = {
  green: "#006b3f",
  greenLight: "#4a9060",
  greenPale: "#e8f5ee",
  gold: "#d4a843",
  cream: "#f5f2eb",
  dark: "#1a2e1a",
  muted: "#6b7a6b",
  red: "#c06060",
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
  kpiChips?: { label: string; value: string; trend?: string }[];
  tooltips?: { term: string; def: string }[];
}

function IntroIllustration() {
  const kpis = [
    { label: "Spend", value: "142 300 kr", icon: "💰", color: MS.green },
    { label: "Ordrar", value: "48 st", icon: "📦", color: "#5a7db8" },
    { label: "AOV", value: "2 965 kr", icon: "📊", color: MS.gold },
  ];
  return (
    <div className="flex flex-col gap-2 w-full">
      {kpis.map((k, i) => (
        <motion.div
          key={i}
          className="flex items-center justify-between px-3 py-2 rounded-xl"
          style={{ background: "white", border: "1.5px solid #e8e4d9" }}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: i * 0.1 + 0.15 }}
        >
          <div className="flex items-center gap-2">
            <span style={{ fontSize: "1rem" }}>{k.icon}</span>
            <span style={{ fontFamily: "Nunito Sans, sans-serif", fontSize: "0.78rem", color: MS.dark }}>{k.label}</span>
          </div>
          <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "0.8rem", color: k.color }}>{k.value}</span>
        </motion.div>
      ))}
    </div>
  );
}

function KpiIllustration() {
  const bars = [42, 68, 55, 80, 63, 90, 74];
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-end gap-1.5 justify-center h-16">
        {bars.map((h, i) => (
          <motion.div
            key={i}
            className="rounded-t-md flex-1"
            style={{ background: i === bars.length - 1 ? MS.green : `${MS.greenLight}66`, maxWidth: "28px" }}
            initial={{ height: 0 }}
            animate={{ height: `${h}%` }}
            transition={{ delay: i * 0.07 + 0.2, type: "spring", damping: 18 }}
          />
        ))}
      </div>
      <div className="flex items-center gap-3 justify-center">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: MS.greenPale, border: `1px solid #b8e0c8` }}>
          <TrendingUp size={12} color={MS.green} />
          <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "0.7rem", color: MS.green }}>+12% vs förra perioden</span>
        </div>
      </div>
    </div>
  );
}

function FilterIllustration() {
  const filters = [
    { label: "Den här månaden", active: true },
    { label: "Mejeri", active: true },
    { label: "ICA Maxi", active: false },
    { label: "Kök nord", active: false },
  ];
  return (
    <div className="flex flex-wrap gap-1.5 justify-center">
      {filters.map((f, i) => (
        <motion.span
          key={i}
          className="px-3 py-1.5 rounded-full"
          style={{
            background: f.active ? MS.green : "white",
            color: f.active ? "white" : MS.muted,
            fontFamily: "Nunito, sans-serif",
            fontWeight: 700,
            fontSize: "0.72rem",
            border: f.active ? "none" : "1.5px solid #e8e4d9",
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: i * 0.1 + 0.15, type: "spring", damping: 16 }}
        >
          {f.active && <span style={{ marginRight: "4px" }}>✓</span>}
          {f.label}
        </motion.span>
      ))}
    </div>
  );
}

function DrillIllustration() {
  const items = [
    { name: "Kycklingfilé", spend: "28 400 kr", share: "20%" },
    { name: "Ekologisk mjölk", spend: "14 200 kr", share: "10%" },
    { name: "Lax, norsk", spend: "11 800 kr", share: "8%" },
  ];
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {items.map((item, i) => (
        <motion.div
          key={i}
          className="flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer"
          style={{ background: i === 0 ? MS.greenPale : "white", border: `1.5px solid ${i === 0 ? "#b8e0c8" : "#e8e4d9"}` }}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: i * 0.1 + 0.15 }}
          whileHover={{ scale: 1.01 }}
        >
          <span style={{ fontFamily: "Nunito Sans, sans-serif", fontSize: "0.78rem", color: MS.dark }}>{item.name}</span>
          <div className="flex items-center gap-3">
            <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "0.75rem", color: MS.green }}>{item.spend}</span>
            <span style={{ fontFamily: "Nunito Sans, sans-serif", fontSize: "0.7rem", color: MS.muted }}>{item.share}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function TrendIllustration() {
  const points1 = [30, 45, 38, 55, 48, 65, 58];
  const points2 = [25, 35, 42, 38, 52, 45, 60];
  const maxH = 70;
  const w = 200;
  const toPath = (pts: number[]) => {
    const step = w / (pts.length - 1);
    return pts.map((p, i) => `${i === 0 ? "M" : "L"} ${i * step} ${maxH - p}`).join(" ");
  };
  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <svg width={w} height={maxH + 4} style={{ overflow: "visible" }}>
        <motion.path
          d={toPath(points1)}
          fill="none"
          stroke={MS.green}
          strokeWidth={2.5}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
        <motion.path
          d={toPath(points2)}
          fill="none"
          stroke={MS.gold}
          strokeWidth={2}
          strokeLinecap="round"
          strokeDasharray="4 3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        />
      </svg>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-0.5 rounded-full" style={{ background: MS.green }} />
          <span style={{ fontFamily: "Nunito Sans, sans-serif", fontSize: "0.68rem", color: MS.muted }}>Denna period</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-0.5 rounded-full" style={{ background: MS.gold, borderTop: "2px dashed" }} />
          <span style={{ fontFamily: "Nunito Sans, sans-serif", fontSize: "0.68rem", color: MS.muted }}>Föregående period</span>
        </div>
      </div>
    </div>
  );
}

function ExportIllustration() {
  return (
    <div className="flex flex-col gap-2.5 w-full items-center">
      <motion.div
        className="flex items-center gap-3 px-4 py-3 rounded-2xl w-full"
        style={{ background: "white", border: "1.5px solid #e8e4d9" }}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#e8f5ee" }}>
          <Download size={16} color={MS.green} />
        </div>
        <div className="flex-1">
          <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "0.82rem", color: MS.dark }}>inköp_maj_2026.csv</p>
          <p style={{ fontFamily: "Nunito Sans, sans-serif", fontSize: "0.7rem", color: MS.muted }}>142 rader · 8 kolumner</p>
        </div>
        <motion.div
          className="w-2 h-2 rounded-full"
          style={{ background: MS.green }}
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
      </motion.div>
      <motion.div
        className="flex items-center gap-3 px-4 py-3 rounded-2xl w-full"
        style={{ background: "#fffbf0", border: "1.5px solid #f0dcaa" }}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#fff3d4" }}>
          <Bell size={16} color={MS.gold} />
        </div>
        <div className="flex-1">
          <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "0.82rem", color: MS.dark }}>Avisering aktiv</p>
          <p style={{ fontFamily: "Nunito Sans, sans-serif", fontSize: "0.7rem", color: "#7a6020" }}>Prisförändring &gt;5% · Veckovis</p>
        </div>
      </motion.div>
    </div>
  );
}

const SCREENS: Screen[] = [
  {
    id: 1,
    emoji: "📊",
    rubrik: "Få koll på inköpen",
    ingress: "Se kostnad, volym och trender. Filtrera, borra ner och exportera på minuten.",
    illustration: <IntroIllustration />,
    primaryCta: "Öppna analys",
    secondaryCta: "Lär dig grunderna",
  },
  {
    id: 2,
    emoji: "🎯",
    rubrik: "Dina nyckeltal",
    brodtext: "Välj period och se spend, orderfrekvens och AOV. Jämför med föregående period.",
    illustration: <KpiIllustration />,
    primaryCta: "Välj period",
    secondaryCta: "Visa definitioner",
    kpiChips: [
      { label: "Total spend", value: "142 300 kr", trend: "+12%" },
      { label: "Orderfrekvens", value: "48 ordrar" },
      { label: "AOV", value: "2 965 kr" },
      { label: "Prisförändring", value: "+3,2%" },
    ],
    tooltips: [
      { term: "Total spend", def: "Summa fakturerat belopp i vald period." },
      { term: "AOV", def: "Spend delat på antal ordrar." },
    ],
  },
  {
    id: 3,
    emoji: "🔍",
    rubrik: "Filtrera snabbt",
    brodtext: "Avgränsa på datum, kategori, leverantör, enhet eller avdelning.",
    illustration: <FilterIllustration />,
    primaryCta: "Lägg till filter",
    secondaryCta: "Rensa alla",
    chips: ["Datum", "Kategori", "Leverantör", "Enhet/avdelning"],
    tips: "Proffstips: Spara ofta använda filter som en vy för snabb åtkomst.",
  },
  {
    id: 4,
    emoji: "🔎",
    rubrik: "Från helhet till rad",
    brodtext: "Klicka på ett KPI-kort för att se trend, toppartiklar och orderrader.",
    illustration: <DrillIllustration />,
    primaryCta: "Visa toppartiklar",
    secondaryCta: "Se orderrader",
  },
  {
    id: 5,
    emoji: "📈",
    rubrik: "Upptäck trender",
    brodtext: "Jämför perioder, säsonger eller enheter. Markera prisändringar och avvikelser.",
    illustration: <TrendIllustration />,
    primaryCta: "Jämför period",
    secondaryCta: "Lägg till serie",
    tips: "Proffstips: Jämför mot samma period i fjol för att fånga säsongseffekter.",
  },
  {
    id: 6,
    emoji: "📤",
    rubrik: "Dela och bevaka",
    brodtext: "Spara vyer, exportera till CSV och få avisering när nyckeltal passerar gränser.",
    illustration: <ExportIllustration />,
    primaryCta: "Skapa avisering",
    secondaryCta: "Exportera CSV",
  },
];

interface InkopsstatistikGuideProps {
  onClose: () => void;
  onComplete?: () => void;
}

export function InkopsstatistikGuide({ onClose, onComplete }: InkopsstatistikGuideProps) {
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
      style={{ background: "rgba(10, 20, 30, 0.80)", backdropFilter: "blur(8px)" }}
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
            style={{ background: "linear-gradient(135deg, #c06060, #903030)" }}
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
              <BarChart2 size={11} color="rgba(255,255,255,0.9)" />
              <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "0.72rem", color: "white" }}>
                Inköpsstatistik
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
                  style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.25rem", color: "white", lineHeight: 1.2 }}
                  initial={{ opacity: 0, x: direction * 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.28 }}
                >
                  {screen.rubrik}
                </motion.h2>
                {screen.ingress && (
                  <motion.p
                    key={`i-${step}`}
                    style={{ color: "rgba(255,255,255,0.82)", fontSize: "0.82rem", fontFamily: "Nunito Sans, sans-serif", marginTop: "2px", lineHeight: 1.4 }}
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
                transition={{ duration: 0.25, ease: "easeOut" }}
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

                {/* KPI chips */}
                {screen.kpiChips && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {screen.kpiChips.map(k => (
                      <div
                        key={k.label}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                        style={{ background: MS.greenPale, border: `1px solid #b8e0c8` }}
                      >
                        <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "0.7rem", color: MS.green }}>{k.label}</span>
                        {k.trend && (
                          <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "0.68rem", color: "#4a9060" }}>{k.trend}</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Filter chips */}
                {screen.chips && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {screen.chips.map(chip => (
                      <span
                        key={chip}
                        className="flex items-center gap-1 px-3 py-1 rounded-full"
                        style={{
                          background: MS.greenPale,
                          color: MS.green,
                          fontFamily: "Nunito, sans-serif",
                          fontWeight: 700,
                          fontSize: "0.72rem",
                          border: `1px solid #b8e0c8`,
                        }}
                      >
                        <Filter size={10} color={MS.green} />
                        {chip}
                      </span>
                    ))}
                  </div>
                )}

                {/* Tips */}
                {screen.tips && (
                  <div
                    className="flex items-start gap-2 px-3.5 py-2.5 rounded-2xl mb-4"
                    style={{ background: "#fffbf0", border: "1.5px solid #f0dcaa" }}
                  >
                    <span style={{ fontSize: "0.95rem", flexShrink: 0, marginTop: "1px" }}>💡</span>
                    <p style={{ fontFamily: "Nunito Sans, sans-serif", fontSize: "0.78rem", color: "#7a6020", lineHeight: 1.5 }}>
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
                  background: "linear-gradient(135deg, #c06060, #903030)",
                  color: "white",
                  fontFamily: "Nunito, sans-serif",
                  fontWeight: 800,
                  fontSize: "0.95rem",
                  boxShadow: "0 6px 20px rgba(192,96,96,0.32)",
                }}
                whileHover={{ scale: 1.02, boxShadow: "0 8px 28px rgba(192,96,96,0.4)" }}
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
