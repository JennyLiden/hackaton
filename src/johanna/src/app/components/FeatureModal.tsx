import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "motion/react";
import { useState, useRef } from "react";
import { X, ChevronRight, Star, CheckCircle2, BookOpen } from "lucide-react";
import { ProductList } from "./ProductList";
import { InkopslistorGuide } from "./InkopslistorGuide";
import { InkopsstatistikGuide } from "./InkopsstatistikGuide";
import { InventeringsGuide } from "./InventeringsGuide";

interface Step {
  title: string;
  description: string;
}

interface Feature {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  color: string;
  shadowColor: string;
  xpReward: number;
  steps: Step[];
}

interface FeatureModalProps {
  feature: Feature | null;
  onClose: () => void;
  onComplete: (featureId: string, xp: number) => void;
  completed: boolean;
  onSaveFavorites?: (favorites: Record<string, number>) => void;
  savedFavorites?: Record<string, number>;
  openProductList?: boolean;
  showAfterOrderMessage?: boolean;
  onOpenFavorites?: () => void;
}

export function FeatureModal({ feature, onClose, onComplete, completed, onSaveFavorites, savedFavorites, openProductList, showAfterOrderMessage, onOpenFavorites }: FeatureModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepsDone, setStepsDone] = useState<Set<number>>(new Set());
  const [showProductList, setShowProductList] = useState(openProductList ?? false);
  const [showInkopslistorGuide, setShowInkopslistorGuide] = useState(false);
  const [showInkopsstatistikGuide, setShowInkopsstatistikGuide] = useState(false);
  const [showInventeringsGuide, setShowInventeringsGuide] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D tilt tracking
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 200, damping: 28 });
  const springY = useSpring(rotateY, { stiffness: 200, damping: 28 });
  const glare = useTransform(springY, [-15, 15], [0.0, 0.18]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    rotateY.set(dx * 10);
    rotateX.set(dy * -8);
  }

  function handleMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  if (!feature) return null;

  const allDone = feature.steps.every((_, i) => stepsDone.has(i));

  function handleStepClick(idx: number) {
    setCurrentStep(idx);

    // Special handling: open product list for "Skapa din favoratlista" step in Butiken
    if (feature.id === "ecommerce" && idx === 1 && !stepsDone.has(idx)) {
      setShowProductList(true);
    }
    // Special handling: open favorites panel for "Lägg din första beställning" step in Butiken
    else if (feature.id === "ecommerce" && idx === 2 && !stepsDone.has(idx)) {
      handleStepDone(idx);
      // If all steps are now done, trigger completion (XP + unlock buildings)
      const allStepsDone = feature.steps.every((_, i) => i === idx || stepsDone.has(i));
      if (allStepsDone) {
        onComplete(feature.id, feature.xpReward);
      }
      if (onOpenFavorites) {
        onOpenFavorites();
      }
    }
    // Special handling: open app download URL for "Ladda ner appen" step in Appen
    else if (feature.id === "app" && idx === 0 && !stepsDone.has(idx)) {
      window.open("https://www.martinservera.se/utbildning-tjanster/app", "_blank");
      handleStepDone(idx);
    }
    // Special handling: open inventory system URL for "Öppna inventeringssystemet" step in Inventering
    else if (feature.id === "inventory" && idx === 0 && !stepsDone.has(idx)) {
      window.open("https://inventering.martinservera.se/", "_blank");
      handleStepDone(idx);
    }
    // Special handling: open export report URL for "Exportera en rapport" step in Analys
    else if (feature.id === "analytics" && idx === 2 && !stepsDone.has(idx)) {
      window.open("https://statistik.martinservera.se/rapporter/inkop", "_blank");
      handleStepDone(idx);
    }
    else if (!stepsDone.has(idx)) {
      handleStepDone(idx);
    }
  }

  function handleStepDone(idx: number) {
    setStepsDone(prev => new Set([...prev, idx]));
    if (idx < feature!.steps.length - 1) setCurrentStep(idx + 1);
  }

  function handleProductListComplete() {
    handleStepDone(1);
    setShowProductList(false);
  }

  function handleProductListSave(favorites: Record<string, number>) {
    onSaveFavorites?.(favorites);
  }

  function handleComplete() {
    onComplete(feature!.id, feature!.xpReward);
    onClose();
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center px-4 py-10"
        style={{ background: "rgba(10, 30, 10, 0.72)", backdropFilter: "blur(6px)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        {/* Perspective wrapper */}
        <div style={{ perspective: "1000px", width: "100%", maxWidth: "420px", maxHeight: "100%" }}>
          <motion.div
            ref={cardRef}
            className="relative w-full rounded-3xl overflow-hidden shadow-2xl"
            style={{
              background: "white",
              maxHeight: "calc(100vh - 5rem)",
              display: "flex",
              flexDirection: "column",
              rotateX: springX,
              rotateY: springY,
              transformStyle: "preserve-3d",
            }}
            initial={{ scale: 0.65, y: 80, rotateX: -20, opacity: 0 }}
            animate={{ scale: 1, y: 0, rotateX: 0, opacity: 1 }}
            exit={{ scale: 0.75, y: 60, opacity: 0 }}
            transition={{ type: "spring", damping: 18, stiffness: 280 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {/* Glare overlay (follows mouse) */}
            <motion.div
              className="absolute inset-0 z-10 pointer-events-none rounded-3xl"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.5) 0%, transparent 60%)",
                opacity: glare,
              }}
            />

            {/* Header */}
            <div
              className="relative px-6 pt-6 pb-4 rounded-t-3xl flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${feature.color}, ${feature.shadowColor})` }}
            >
              {/* 3D depth layer on header */}
              <div
                className="absolute inset-0 rounded-t-3xl"
                style={{
                  background: "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 100%)",
                  pointerEvents: "none",
                }}
              />

              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.28)" }}
              >
                <X size={16} color="white" />
              </button>

              {/* Emoji with 3D float */}
              <motion.div
                className="text-5xl mb-3 inline-block"
                animate={{ y: [0, -6, 0], rotateZ: [0, -5, 5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformStyle: "preserve-3d", display: "block" }}
              >
                {feature.emoji}
              </motion.div>

              <h2 className="text-white mb-1" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "1.5rem" }}>
                {feature.name}
              </h2>
              <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.95rem", fontFamily: "Nunito Sans, sans-serif" }}>
                {feature.tagline}
              </p>

              {!completed ? (
                <div
                  className="absolute top-4 left-4 flex items-center gap-1 px-3 py-1 rounded-full"
                  style={{ background: "rgba(255,255,255,0.22)", backdropFilter: "blur(4px)" }}
                >
                  <Star size={12} color="#ffe66d" fill="#ffe66d" />
                  <span style={{ color: "white", fontSize: "0.8rem", fontWeight: 700, fontFamily: "Nunito, sans-serif" }}>
                    +{feature.xpReward} XP
                  </span>
                </div>
              ) : (
                <div
                  className="absolute top-4 left-4 flex items-center gap-1 px-3 py-1 rounded-full"
                  style={{ background: "rgba(255,255,255,0.22)" }}
                >
                  <CheckCircle2 size={12} color="#ffe66d" />
                  <span style={{ color: "white", fontSize: "0.8rem", fontWeight: 700, fontFamily: "Nunito, sans-serif" }}>
                    Klar!
                  </span>
                </div>
              )}
            </div>

            {/* Body */}
            <div className="px-6 py-4 overflow-y-auto" style={{ flex: 1, minHeight: 0 }}>
              {/* After-order message banner for Analytics */}
              {showAfterOrderMessage && feature.id === "analytics" && (
                <motion.div
                  className="mb-5 p-4 rounded-2xl"
                  style={{
                    background: "linear-gradient(135deg, #fffbf0, #fff7e6)",
                    border: "2px solid #d4a843",
                  }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-start gap-3">
                    <motion.span
                      style={{ fontSize: "1.5rem", flexShrink: 0 }}
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      🎉
                    </motion.span>
                    <div className="flex-1">
                      <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "0.95rem", color: "#1a2e1a", marginBottom: "4px" }}>
                        Grattis till din beställning!
                      </p>
                      <p style={{ fontFamily: "Nunito Sans, sans-serif", fontSize: "0.85rem", color: "#4a5e4a", lineHeight: 1.6 }}>
                        Nu när du har lagt din första order är det dags att börja följa upp dina inköp. Här i Analys kan du spåra dina utgifter, jämföra priser över tid och hitta besparingsmöjligheter.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              <p className="mb-5" style={{ color: "#4a5e4a", fontFamily: "Nunito Sans, sans-serif", lineHeight: 1.65, fontSize: "0.95rem" }}>
                {feature.description}
              </p>

              {/* Inköpslistor guide CTA — only for Butiken */}
              {feature.id === "ecommerce" && (
                <motion.button
                  className="w-full mb-5 flex items-center gap-3 px-4 py-3.5 rounded-2xl"
                  style={{
                    background: "linear-gradient(135deg, #e8f5ee, #d4eddf)",
                    border: "1.5px solid #b8e0c8",
                    cursor: "pointer",
                  }}
                  whileHover={{ scale: 1.015, boxShadow: "0 4px 16px rgba(0,107,63,0.15)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowInkopslistorGuide(true)}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #006b3f, #4a9060)" }}
                  >
                    <BookOpen size={18} color="white" />
                  </div>
                  <div className="flex-1 text-left">
                    <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "0.88rem", color: "#006b3f", lineHeight: 1.2 }}>
                      Lär dig inköpslistor
                    </p>
                    <p style={{ fontFamily: "Nunito Sans, sans-serif", fontSize: "0.76rem", color: "#4a7a5a", marginTop: "2px" }}>
                      Spara tid — beställ återkommande varor snabbare
                    </p>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: "#006b3f" }}>
                    <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "0.68rem", color: "white" }}>5 skärmar</span>
                  </div>
                </motion.button>
              )}

              {/* Inventering guide CTA — only for Inventering */}
              {feature.id === "inventory" && (
                <motion.button
                  className="w-full mb-5 flex items-center gap-3 px-4 py-3.5 rounded-2xl"
                  style={{
                    background: "linear-gradient(135deg, #fffbf0, #fff3d4)",
                    border: "1.5px solid #e8c878",
                    cursor: "pointer",
                  }}
                  whileHover={{ scale: 1.015, boxShadow: "0 4px 16px rgba(212,168,67,0.2)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowInventeringsGuide(true)}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #d4a843, #a07820)" }}
                  >
                    <BookOpen size={18} color="white" />
                  </div>
                  <div className="flex-1 text-left">
                    <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "0.88rem", color: "#a07820", lineHeight: 1.2 }}>
                      Lär dig inventering
                    </p>
                    <p style={{ fontFamily: "Nunito Sans, sans-serif", fontSize: "0.76rem", color: "#7a6020", marginTop: "2px" }}>
                      Välj typ, räkna, attestera och posta — steg för steg
                    </p>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: "#d4a843" }}>
                    <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "0.68rem", color: "white" }}>7 skärmar</span>
                  </div>
                </motion.button>
              )}

              {/* Analytics guide CTA — only for Analys */}
              {feature.id === "analytics" && (
                <motion.button
                  className="w-full mb-5 flex items-center gap-3 px-4 py-3.5 rounded-2xl"
                  style={{
                    background: "linear-gradient(135deg, #fdf0f0, #fde8e8)",
                    border: "1.5px solid #e8c0c0",
                    cursor: "pointer",
                  }}
                  whileHover={{ scale: 1.015, boxShadow: "0 4px 16px rgba(192,96,96,0.15)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowInkopsstatistikGuide(true)}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #c06060, #903030)" }}
                  >
                    <BookOpen size={18} color="white" />
                  </div>
                  <div className="flex-1 text-left">
                    <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "0.88rem", color: "#903030", lineHeight: 1.2 }}>
                      Lär dig inköpsstatistik
                    </p>
                    <p style={{ fontFamily: "Nunito Sans, sans-serif", fontSize: "0.76rem", color: "#a06060", marginTop: "2px" }}>
                      KPI:er, filter, trender och export — steg för steg
                    </p>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: "#c06060" }}>
                    <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "0.68rem", color: "white" }}>6 skärmar</span>
                  </div>
                </motion.button>
              )}

              {/* Steps */}
              <div className="space-y-2.5 mb-6">
                <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "0.88rem", color: "#1a2e1a" }}>
                  Kom igång — {Math.min(stepsDone.size, feature.steps.length)}/{feature.steps.length} steg klara
                </p>

                {feature.steps.map((step, i) => {
                  const done = stepsDone.has(i) || completed;
                  const active = currentStep === i && !done;
                  return (
                    <motion.div
                      key={i}
                      className="flex items-start gap-3 p-3 rounded-2xl cursor-pointer"
                      style={{
                        background: done ? "#e8f5ee" : active ? "#fffbf0" : "white",
                        border: `2px solid ${done ? "#006b3f" : active ? "#d4a843" : "#e8e4d9"}`,
                        boxShadow: active ? "0 4px 12px rgba(212,168,67,0.2)" : done ? "0 2px 8px rgba(0,107,63,0.1)" : "none",
                        transform: active ? "scale(1.01)" : "scale(1)",
                        transition: "all 0.2s ease",
                      }}
                      onClick={() => handleStepClick(i)}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Step number circle */}
                      <motion.div
                        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: done ? "#006b3f" : active ? "#d4a843" : "#e8e4d9" }}
                        animate={done ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 0.3 }}
                      >
                        {done ? (
                          <span style={{ color: "white", fontSize: "0.8rem" }}>✓</span>
                        ) : (
                          <span style={{ color: active ? "white" : "#6b7a6b", fontSize: "0.8rem", fontWeight: 700 }}>{i + 1}</span>
                        )}
                      </motion.div>

                      <div className="flex-1">
                        <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "0.88rem", color: done ? "#006b3f" : "#1a2e1a" }}>
                          {step.title}
                        </p>
                        <p style={{ fontFamily: "Nunito Sans, sans-serif", fontSize: "0.8rem", color: "#6b7a6b", marginTop: "2px" }}>
                          {step.description}
                        </p>
                      </div>

                      {!done && <ChevronRight size={15} color={active ? "#d4a843" : "#6b7a6b"} className="mt-1 flex-shrink-0" />}
                    </motion.div>
                  );
                })}
              </div>

              {/* CTA */}
              {!completed ? (
                <motion.button
                  className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2"
                  style={{
                    background: allDone
                      ? "linear-gradient(135deg, #006b3f, #4a9060)"
                      : "#e8e4d9",
                    color: allDone ? "white" : "#6b7a6b",
                    fontFamily: "Nunito, sans-serif",
                    fontWeight: 800,
                    fontSize: "1rem",
                    cursor: allDone ? "pointer" : "default",
                    boxShadow: allDone ? "0 6px 20px rgba(0,107,63,0.35)" : "none",
                  }}
                  onClick={allDone ? handleComplete : undefined}
                  whileHover={allDone ? { scale: 1.02, boxShadow: "0 8px 28px rgba(0,107,63,0.4)" } : {}}
                  whileTap={allDone ? { scale: 0.98 } : {}}
                >
                  {allDone ? (
                    <>
                      <motion.span
                        animate={{ rotate: [0, 20, -20, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        <Star size={18} fill="currentColor" />
                      </motion.span>
                      Hämta {feature.xpReward} XP!
                    </>
                  ) : (
                    `Slutför ${feature.steps.length - stepsDone.size} steg till`
                  )}
                </motion.button>
              ) : (
                <div
                  className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2"
                  style={{ background: "#e8f5ee", color: "#006b3f", fontFamily: "Nunito, sans-serif", fontWeight: 800 }}
                >
                  <CheckCircle2 size={18} /> Utforskat och klart!
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Product list overlay */}
      <AnimatePresence>
        {showProductList && (
          <ProductList
            onClose={() => setShowProductList(false)}
            onComplete={handleProductListComplete}
            onSave={handleProductListSave}
            initialFavorites={savedFavorites}
          />
        )}
      </AnimatePresence>

      {/* Inköpslistor guide overlay */}
      <AnimatePresence>
        {showInkopslistorGuide && (
          <InkopslistorGuide
            onClose={() => setShowInkopslistorGuide(false)}
            onComplete={() => setShowInkopslistorGuide(false)}
          />
        )}
      </AnimatePresence>

      {/* Inköpsstatistik guide overlay */}
      <AnimatePresence>
        {showInkopsstatistikGuide && (
          <InkopsstatistikGuide
            onClose={() => setShowInkopsstatistikGuide(false)}
            onComplete={() => setShowInkopsstatistikGuide(false)}
          />
        )}
      </AnimatePresence>

      {/* Inventerings guide overlay */}
      <AnimatePresence>
        {showInventeringsGuide && (
          <InventeringsGuide
            onClose={() => setShowInventeringsGuide(false)}
            onComplete={() => setShowInventeringsGuide(false)}
          />
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
}
