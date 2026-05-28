import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronRight, ChevronLeft, ShoppingCart, List, Share2, Plus, Package } from "lucide-react";

const MS = {
  green: "#006b3f",
  greenLight: "#4a9060",
  greenPale: "#e8f5ee",
  gold: "#d4a843",
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
  hasInput?: boolean;
  inputPlaceholder?: string;
  inputHint?: string;
  chips?: string[];
}

const SCREENS: Screen[] = [
  {
    id: 1,
    emoji: "📋",
    rubrik: "Spara tid med inköpslistor",
    ingress: "Samla dina återkommande varor och beställ snabbare – varje gång.",
    illustration: <IntroIllustration />,
    primaryCta: "Skapa lista",
    secondaryCta: "Läs hur det funkar",
  },
  {
    id: 2,
    emoji: "✏️",
    rubrik: "Döp din första lista",
    brodtext: "Ge listan ett tydligt namn så du och dina kollegor hittar rätt direkt.",
    illustration: <NameIllustration />,
    hasInput: true,
    inputPlaceholder: "Namn på lista",
    inputHint: "Ex: 'Basvaror', 'Frukost mån–fre'.",
    primaryCta: "Skapa",
    secondaryCta: "Hoppa över",
  },
  {
    id: 3,
    emoji: "🔍",
    rubrik: "Lägg till varor",
    brodtext: "Sök, skanna eller importera från tidigare order. Sätt standardantal.",
    tips: "Proffstips: Lägg till anteckning, t.ex. 'Endast eko'.",
    illustration: <SearchIllustration />,
    primaryCta: "Lägg till varor",
    secondaryCta: "Importera från order",
    chips: ["Mejeri", "Grönt", "Protein", "Dryck", "Torris"],
  },
  {
    id: 4,
    emoji: "🤝",
    rubrik: "Ordna och dela",
    brodtext: "Gruppera i kategorier och bjud in kollegor att visa eller redigera.",
    illustration: <ShareIllustration />,
    primaryCta: "Bjud in kollega",
    secondaryCta: "Hoppa över",
    chips: ["Ägare", "Redaktör", "Läsare"],
  },
  {
    id: 5,
    emoji: "🛒",
    rubrik: "Beställ på minuten",
    brodtext: "Markera varor du behöver nu och lägg allt i varukorgen. Justera innan köp.",
    illustration: <OrderIllustration />,
    primaryCta: "Lägg i varukorg",
    secondaryCta: "Visa lista",
  },
];

function IntroIllustration() {
  return (
    <div className="flex items-center justify-center gap-3">
      {["🥛", "🥦", "🍗", "🧀"].map((e, i) => (
        <motion.div
          key={i}
          className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-md"
          style={{ background: "white", fontSize: "1.4rem" }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: i * 0.1 + 0.2, type: "spring", damping: 16 }}
        >
          {e}
        </motion.div>
      ))}
      <motion.div
        className="absolute"
        style={{ right: "2rem", bottom: "0.5rem" }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.7, type: "spring" }}
      >
        <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: MS.gold }}>
          <span style={{ color: "white", fontSize: "0.7rem", fontWeight: 900 }}>✓</span>
        </div>
      </motion.div>
    </div>
  );
}

function NameIllustration() {
  return (
    <motion.div
      className="flex items-center gap-2 px-4 py-3 rounded-2xl shadow-md"
      style={{ background: "white", border: `2px solid ${MS.greenPale}` }}
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.2, type: "spring", damping: 16 }}
    >
      <List size={18} color={MS.green} />
      <span style={{ color: MS.dark, fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "0.9rem" }}>
        Basvaror vecka 23
      </span>
      <motion.div
        className="w-2 h-4 rounded-sm ml-0.5"
        style={{ background: MS.green }}
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
    </motion.div>
  );
}

function SearchIllustration() {
  const items = [
    { name: "Standardantal", val: "2 kg" },
    { name: "Ekologisk mjölk", val: "6 st" },
    { name: "Kycklingfilé", val: "4 kg" },
  ];
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {items.map((item, i) => (
        <motion.div
          key={i}
          className="flex items-center justify-between px-3 py-2 rounded-xl"
          style={{ background: "white", border: "1.5px solid #e8e4d9" }}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: i * 0.12 + 0.2 }}
        >
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: MS.greenPale }}>
              <span style={{ fontSize: "0.6rem", color: MS.green }}>✓</span>
            </div>
            <span style={{ fontFamily: "Nunito Sans, sans-serif", fontSize: "0.78rem", color: MS.dark }}>{item.name}</span>
          </div>
          <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "0.75rem", color: MS.muted }}>{item.val}</span>
        </motion.div>
      ))}
    </div>
  );
}

function ShareIllustration() {
  const roles = [
    { role: "Ägare", emoji: "👤", color: MS.green },
    { role: "Redaktör", emoji: "✏️", color: "#5a7db8" },
    { role: "Läsare", emoji: "👁️", color: MS.muted },
  ];
  return (
    <div className="flex gap-3 justify-center">
      {roles.map((r, i) => (
        <motion.div
          key={i}
          className="flex flex-col items-center gap-1.5"
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: i * 0.12 + 0.2 }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
            style={{ background: "white", border: `2px solid ${r.color}22` }}
          >
            <span style={{ fontSize: "1.1rem" }}>{r.emoji}</span>
          </div>
          <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "0.68rem", color: r.color }}>{r.role}</span>
        </motion.div>
      ))}
    </div>
  );
}

function OrderIllustration() {
  return (
    <div className="flex flex-col gap-2 w-full">
      <motion.div
        className="flex items-center justify-between px-3 py-2.5 rounded-xl"
        style={{ background: MS.greenPale, border: `1.5px solid #b8e0c8` }}
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-2">
          <span style={{ fontSize: "1rem" }}>🥛</span>
          <span style={{ fontFamily: "Nunito Sans, sans-serif", fontSize: "0.8rem", color: MS.dark }}>Ekologisk mjölk 3%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "0.75rem", color: MS.muted }}>6 st</span>
          <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: MS.green }}>
            <ShoppingCart size={11} color="white" />
          </div>
        </div>
      </motion.div>
      <motion.div
        className="w-full py-2 rounded-xl flex items-center justify-center gap-2"
        style={{ background: MS.green }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, type: "spring" }}
      >
        <ShoppingCart size={14} color="white" />
        <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "0.8rem", color: "white" }}>Tillagt i varukorg</span>
      </motion.div>
    </div>
  );
}

interface InkopslistorGuideProps {
  onClose: () => void;
  onComplete?: () => void;
}

export function InkopslistorGuide({ onClose, onComplete }: InkopslistorGuideProps) {
  const [step, setStep] = useState(0);
  const [listName, setListName] = useState("");
  const [direction, setDirection] = useState<1 | -1>(1);

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
    }
  }

  function goPrev() {
    if (isFirst) return;
    setDirection(-1);
    setStep(s => s - 1);
  }

  function handleSecondary() {
    goNext();
  }

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4"
      style={{ background: "rgba(10, 30, 10, 0.78)", backdropFilter: "blur(8px)" }}
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
          {/* Header band */}
          <div
            className="relative px-7 pt-7 pb-5"
            style={{ background: "linear-gradient(135deg, #006b3f, #4a9060)" }}
          >
            {/* Shimmer */}
            <div
              className="absolute inset-0 rounded-t-3xl pointer-events-none"
              style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.14) 0%, transparent 100%)" }}
            />

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.25)" }}
              aria-label="Stäng"
            >
              <X size={15} color="white" />
            </button>

            {/* Step counter badge */}
            <div
              className="absolute top-4 left-4 px-3 py-1 rounded-full flex items-center gap-1.5"
              style={{ background: "rgba(255,255,255,0.22)" }}
            >
              <Package size={11} color="rgba(255,255,255,0.9)" />
              <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "0.72rem", color: "white" }}>
                Inköpslistor
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
          <div className="px-7 py-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: direction * 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -30 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                {/* Illustration */}
                <div className="relative mb-5 flex items-center justify-center min-h-[80px] rounded-2xl px-4 py-4"
                  style={{ background: MS.cream }}>
                  {screen.illustration}
                </div>

                {/* Body text */}
                {screen.brodtext && (
                  <p className="mb-4" style={{ fontFamily: "Nunito Sans, sans-serif", color: "#4a5e4a", fontSize: "0.9rem", lineHeight: 1.6 }}>
                    {screen.brodtext}
                  </p>
                )}

                {/* Input */}
                {screen.hasInput && (
                  <div className="mb-4">
                    <input
                      type="text"
                      value={listName}
                      onChange={e => setListName(e.target.value)}
                      placeholder={screen.inputPlaceholder}
                      className="w-full px-4 py-3 rounded-2xl outline-none"
                      style={{
                        border: `2px solid ${listName ? MS.green : "#e8e4d9"}`,
                        fontFamily: "Nunito Sans, sans-serif",
                        fontSize: "0.92rem",
                        color: MS.dark,
                        background: "white",
                        transition: "border-color 0.2s",
                      }}
                    />
                    {screen.inputHint && (
                      <p className="mt-1.5 ml-1" style={{ fontFamily: "Nunito Sans, sans-serif", fontSize: "0.75rem", color: MS.muted }}>
                        {screen.inputHint}
                      </p>
                    )}
                  </div>
                )}

                {/* Chips */}
                {screen.chips && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {screen.chips.map(chip => (
                      <span
                        key={chip}
                        className="px-3 py-1 rounded-full"
                        style={{
                          background: MS.greenPale,
                          color: MS.green,
                          fontFamily: "Nunito, sans-serif",
                          fontWeight: 700,
                          fontSize: "0.72rem",
                          border: `1px solid #b8e0c8`,
                        }}
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                )}

                {/* Tips chip */}
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

                {/* Empty state note (screen 3) */}
                {screen.id === 3 && (
                  <div
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl mb-4"
                    style={{ background: "#f5f2eb", border: "1px solid #e8e4d9" }}
                  >
                    <Plus size={14} color={MS.muted} />
                    <span style={{ fontFamily: "Nunito Sans, sans-serif", fontSize: "0.75rem", color: MS.muted }}>
                      Inga varor ännu. Börja med din topp‑10!
                    </span>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* CTAs */}
            <div className="flex flex-col gap-2 mt-2">
              <motion.button
                className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #006b3f, #4a9060)",
                  color: "white",
                  fontFamily: "Nunito, sans-serif",
                  fontWeight: 800,
                  fontSize: "0.95rem",
                  boxShadow: "0 6px 20px rgba(0,107,63,0.32)",
                }}
                whileHover={{ scale: 1.02, boxShadow: "0 8px 28px rgba(0,107,63,0.4)" }}
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
                  onClick={handleSecondary}
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
