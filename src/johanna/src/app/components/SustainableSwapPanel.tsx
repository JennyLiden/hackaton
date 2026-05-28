import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Leaf, ArrowRight, TreePine, Sparkles, X, ChevronDown, ChevronUp } from "lucide-react";
import confetti from "canvas-confetti";
import { MOCK_PRODUCTS } from "./ProductList";

const MS = {
  green: "#006b3f",
  greenLight: "#4a9060",
  greenPale: "#e8f5ee",
  gold: "#d4a843",
  cream: "#f5f2eb",
  dark: "#1a2e1a",
  muted: "#6b7a6b",
  leaf: "#2d8f3e",
  leafLight: "#5cc06a",
  earth: "#8b6f47",
};

// Sustainable alternatives mapped to product IDs
export const SUSTAINABLE_ALTERNATIVES: Record<string, {
  id: string;
  name: string;
  reason: string;
  image: string;
  price: string;
  unit: string;
  co2Saved: string;
  category: string;
  badge: string;
}[]> = {
  p1: [
    { id: "s1", name: "MSC-certifierad lax", reason: "Hållbart fiskad med MSC-märkning", image: "🐟", price: "199 kr/kg", unit: "kg", co2Saved: "−30% CO₂", category: "Fisk & Skaldjur", badge: "MSC" },
    { id: "s2", name: "Röding närodlad", reason: "Svenskodlad i slutet system, minimal miljöpåverkan", image: "🐠", price: "175 kr/kg", unit: "kg", co2Saved: "−45% CO₂", category: "Fisk & Skaldjur", badge: "Närodlat" },
  ],
  p2: [
    { id: "s3", name: "Naturbeteskött", reason: "Djuren betar fritt och bidrar till biologisk mångfald", image: "🥩", price: "465 kr/kg", unit: "kg", co2Saved: "−25% CO₂", category: "Kött", badge: "KRAV" },
    { id: "s4", name: "Viltskav (hjort)", reason: "Vilt från svenska skogar, minimalt klimatavtryck", image: "🦌", price: "320 kr/kg", unit: "kg", co2Saved: "−60% CO₂", category: "Kött", badge: "Viltkött" },
  ],
  p3: [
    { id: "s5", name: "KRAV-tomater svenska", reason: "Ekologiskt odlade i Sverige utan kemiska bekämpningsmedel", image: "🍅", price: "52 kr/ask", unit: "ask", co2Saved: "−40% CO₂", category: "Grönsaker", badge: "KRAV" },
  ],
  p4: [
    { id: "s6", name: "Basilika kryddträdgård", reason: "Odlad i vertikalfarm med 95% mindre vatten", image: "🌿", price: "28 kr/kruka", unit: "kruka", co2Saved: "−55% CO₂", category: "Örter", badge: "Vertikalfarm" },
  ],
  p5: [
    { id: "s7", name: "Västerbottensost 24 mån", reason: "Svensktillverkad med kort transportväg", image: "🧀", price: "245 kr/kg", unit: "kg", co2Saved: "−35% CO₂", category: "Ost", badge: "Svensk" },
  ],
  p6: [
    { id: "s8", name: "Rapsolja kallpressad", reason: "Svensk rapsolja, 70% kortare transport", image: "🌻", price: "89 kr/l", unit: "liter", co2Saved: "−50% CO₂", category: "Olja & Vinäger", badge: "Närodlat" },
  ],
  p7: [
    { id: "s9", name: "Surdeg stenugnsbakat eko", reason: "Ekologiskt mjöl, lokalt bageri", image: "🥖", price: "48 kr/st", unit: "st", co2Saved: "−30% CO₂", category: "Bröd & Bakverk", badge: "Eko" },
  ],
  p8: [
    { id: "s10", name: "Ägg ekologiska KRAV", reason: "Frigående höns med ekologiskt foder", image: "🥚", price: "45 kr/förp", unit: "förp", co2Saved: "−35% CO₂", category: "Mejeri & Ägg", badge: "KRAV" },
  ],
  p9: [
    { id: "s11", name: "Smör ekologiskt", reason: "Från ekologiska gårdar med betande kor", image: "🧈", price: "108 kr/kg", unit: "kg", co2Saved: "−20% CO₂", category: "Mejeri & Ägg", badge: "Eko" },
  ],
  p10: [
    { id: "s12", name: "Pasta fullkorn eko", reason: "Ekologiskt durumvete, mindre bekämpningsmedel", image: "🍝", price: "32 kr/förp", unit: "förp", co2Saved: "−25% CO₂", category: "Torrvaror", badge: "Eko" },
  ],
  p11: [
    { id: "s13", name: "Vitlök svensk eko", reason: "Odlad i Sverige, undviker import från Kina", image: "🧄", price: "58 kr/kg", unit: "kg", co2Saved: "−70% CO₂", category: "Grönsaker", badge: "Närodlat" },
  ],
  p12: [
    { id: "s14", name: "Ruccola KRAV växthus", reason: "Svenskodlad i vattensmart växthus", image: "🥬", price: "39 kr/påse", unit: "påse", co2Saved: "−45% CO₂", category: "Grönsaker", badge: "KRAV" },
  ],
};

interface SustainableSwapPanelProps {
  open: boolean;
  onClose: () => void;
  favorites: Record<string, number>;
  onSwap: (originalId: string, alternative: typeof SUSTAINABLE_ALTERNATIVES[string][0]) => void;
  swappedProducts: Set<string>;
  treeCount: number;
}

export function SustainableSwapPanel({ open, onClose, favorites, onSwap, swappedProducts, treeCount }: SustainableSwapPanelProps) {
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [justSwapped, setJustSwapped] = useState<string | null>(null);

  const items = MOCK_PRODUCTS.filter(p => (favorites[p.id] ?? 0) > 0);
  const itemsWithAlternatives = items.filter(p => SUSTAINABLE_ALTERNATIVES[p.id]?.length > 0);

  function handleSwap(productId: string, alternative: typeof SUSTAINABLE_ALTERNATIVES[string][0]) {
    setJustSwapped(productId);

    // MEGA confetti celebration — green & gold explosion
    const colors = ["#2d8f3e", "#5cc06a", "#d4a843", "#ffffff", "#006b3f", "#90ee90"];

    // Central burst
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.5, x: 0.5 },
      colors,
      gravity: 0.8,
      ticks: 300,
    });

    // Left burst
    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 70,
        angle: 60,
        origin: { x: 0.15, y: 0.6 },
        colors,
        gravity: 0.7,
      });
    }, 150);

    // Right burst
    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 70,
        angle: 120,
        origin: { x: 0.85, y: 0.6 },
        colors,
        gravity: 0.7,
      });
    }, 300);

    // Leaf-shaped confetti from top
    setTimeout(() => {
      confetti({
        particleCount: 40,
        spread: 160,
        origin: { y: 0, x: 0.5 },
        colors: ["#2d8f3e", "#5cc06a", "#90ee90"],
        shapes: ["circle"],
        gravity: 0.4,
        drift: 1,
        ticks: 400,
      });
    }, 450);

    onSwap(productId, alternative);

    setTimeout(() => setJustSwapped(null), 2000);
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[57]"
            style={{ background: "rgba(5,25,5,0.55)", backdropFilter: "blur(6px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 z-[58] flex flex-col"
            style={{ width: "min(480px, 100vw)", background: "#fafdf8", boxShadow: "-10px 0 50px rgba(0,80,30,0.22)" }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 280 }}
          >
            {/* Header — lush green gradient with organic shape */}
            <div
              className="flex-shrink-0 px-6 py-5 relative overflow-hidden"
              style={{ background: `linear-gradient(145deg, #1a5c2a, #2d8f3e, #4aad5a)` }}
            >
              {/* Decorative leaf shapes */}
              <div className="absolute -top-4 -right-8 w-32 h-32 rounded-full opacity-15" style={{ background: "#90ee90" }} />
              <div className="absolute -bottom-6 -left-4 w-24 h-24 rounded-full opacity-10" style={{ background: "#ffffff" }} />

              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <motion.div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(4px)" }}
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Leaf size={22} color="white" />
                  </motion.div>
                  <div>
                    <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: "1.2rem", color: "white", letterSpacing: "-0.02em" }}>
                      Hållbara Byten
                    </h2>
                    <p style={{ fontFamily: "Nunito Sans, sans-serif", fontSize: "0.78rem", color: "rgba(255,255,255,0.85)" }}>
                      Byt till grönare alternativ — plantera träd på din ö
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.2)" }}
                >
                  <X size={18} color="white" />
                </button>
              </div>

              {/* Tree counter */}
              <motion.div
                className="mt-4 flex items-center gap-3 px-4 py-2.5 rounded-2xl relative z-10"
                style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(4px)" }}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: Math.min(treeCount, 8) }).map((_, i) => (
                    <motion.span
                      key={i}
                      style={{ fontSize: "1.1rem" }}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: i * 0.08, type: "spring", damping: 12 }}
                    >
                      🌳
                    </motion.span>
                  ))}
                  {treeCount > 8 && (
                    <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "0.85rem", color: "white" }}>
                      +{treeCount - 8}
                    </span>
                  )}
                  {treeCount === 0 && (
                    <span style={{ fontSize: "1.1rem", opacity: 0.5 }}>🌱</span>
                  )}
                </div>
                <div className="flex-1">
                  <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "0.82rem", color: "white" }}>
                    {treeCount === 0 ? "Gör ditt första byte!" : `${treeCount} träd planterade`}
                  </p>
                  <p style={{ fontFamily: "Nunito Sans, sans-serif", fontSize: "0.7rem", color: "rgba(255,255,255,0.75)" }}>
                    {treeCount === 0 ? "Varje hållbart byte planterar ett träd på din ö" : "Fortsätt byta — din ö blir grönare!"}
                  </p>
                </div>
                <TreePine size={20} color="rgba(255,255,255,0.7)" />
              </motion.div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {itemsWithAlternatives.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 pb-16">
                  <span style={{ fontSize: "3rem" }}>🌱</span>
                  <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "1rem", color: MS.muted }}>
                    Inga produkter att byta ännu
                  </p>
                  <p style={{ fontFamily: "Nunito Sans, sans-serif", fontSize: "0.85rem", color: MS.muted, textAlign: "center" }}>
                    Lägg till produkter i din favoritlista för att se hållbara alternativ.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Progress indicator */}
                  <div className="flex items-center gap-3 mb-4 px-3 py-2 rounded-xl" style={{ background: "#f0faf2" }}>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "0.78rem", color: MS.dark }}>
                          Hållbarhetsmål
                        </span>
                        <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "0.78rem", color: MS.leaf }}>
                          {swappedProducts.size}/{itemsWithAlternatives.length}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "#d4ecd8" }}>
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: `linear-gradient(90deg, ${MS.leaf}, ${MS.leafLight})` }}
                          animate={{ width: `${(swappedProducts.size / itemsWithAlternatives.length) * 100}%` }}
                          transition={{ type: "spring", damping: 20 }}
                        />
                      </div>
                    </div>
                  </div>

                  {itemsWithAlternatives.map((product, idx) => {
                    const isExpanded = expandedProduct === product.id;
                    const isSwapped = swappedProducts.has(product.id);
                    const alternatives = SUSTAINABLE_ALTERNATIVES[product.id] || [];
                    const wasJustSwapped = justSwapped === product.id;

                    return (
                      <motion.div
                        key={product.id}
                        className="rounded-2xl overflow-hidden"
                        style={{
                          background: isSwapped ? "#f0faf2" : "white",
                          border: `1.5px solid ${isSwapped ? "#5cc06a44" : "#e8e4d9"}`,
                          boxShadow: isSwapped ? "0 2px 12px rgba(45,143,62,0.08)" : "0 2px 8px rgba(0,0,0,0.04)",
                        }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.06 }}
                      >
                        {/* Product header — clickable to expand */}
                        <button
                          className="w-full px-4 py-3.5 flex items-center gap-3 text-left"
                          onClick={() => setExpandedProduct(isExpanded ? null : product.id)}
                        >
                          <div
                            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: isSwapped ? "rgba(45,143,62,0.12)" : "rgba(0,107,63,0.07)", fontSize: "1.5rem" }}
                          >
                            {product.image}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "0.9rem", color: MS.dark }}>
                                {product.name}
                              </p>
                              {isSwapped && (
                                <motion.div
                                  className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                                  style={{ background: MS.leaf, fontSize: "0.65rem", color: "white", fontWeight: 700 }}
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: "spring", damping: 12 }}
                                >
                                  <Leaf size={10} /> Bytt
                                </motion.div>
                              )}
                            </div>
                            <p style={{ fontFamily: "Nunito Sans, sans-serif", fontSize: "0.75rem", color: MS.muted }}>
                              {product.category} · {product.price}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {!isSwapped && (
                              <div className="px-2 py-1 rounded-lg" style={{ background: "#fff3d0", border: "1px solid #f0d060" }}>
                                <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "0.68rem", color: "#8b6f00" }}>
                                  {alternatives.length} alternativ
                                </span>
                              </div>
                            )}
                            {isExpanded ? (
                              <ChevronUp size={16} color={MS.muted} />
                            ) : (
                              <ChevronDown size={16} color={MS.muted} />
                            )}
                          </div>
                        </button>

                        {/* Expanded alternatives */}
                        <AnimatePresence>
                          {isExpanded && !isSwapped && (
                            <motion.div
                              className="px-4 pb-4"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ type: "spring", damping: 24, stiffness: 300 }}
                            >
                              <div className="pt-1 border-t" style={{ borderColor: "#e8e4d922" }}>
                                <p style={{ fontFamily: "Nunito Sans, sans-serif", fontSize: "0.72rem", color: MS.muted, marginBottom: "0.5rem", marginTop: "0.5rem" }}>
                                  Hållbara alternativ som du kan byta till:
                                </p>
                                <div className="space-y-2">
                                  {alternatives.map((alt) => (
                                    <motion.div
                                      key={alt.id}
                                      className="flex items-center gap-3 p-3 rounded-xl cursor-pointer group"
                                      style={{ background: "#f8fdf6", border: "1.5px solid #e0f0e0" }}
                                      whileHover={{ scale: 1.01, background: "#edf8ec", borderColor: "#5cc06a" }}
                                      whileTap={{ scale: 0.98 }}
                                      onClick={() => handleSwap(product.id, alt)}
                                    >
                                      <div
                                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                        style={{ background: "rgba(45,143,62,0.1)", fontSize: "1.3rem" }}
                                      >
                                        {alt.image}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                          <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "0.82rem", color: MS.dark }}>
                                            {alt.name}
                                          </p>
                                          <span
                                            className="px-1.5 py-0.5 rounded text-[0.6rem]"
                                            style={{ background: "#d0f0d4", color: MS.leaf, fontWeight: 700 }}
                                          >
                                            {alt.badge}
                                          </span>
                                        </div>
                                        <p style={{ fontFamily: "Nunito Sans, sans-serif", fontSize: "0.7rem", color: MS.muted, lineHeight: 1.4 }}>
                                          {alt.reason}
                                        </p>
                                        <div className="flex items-center gap-3 mt-1">
                                          <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "0.72rem", color: MS.dark }}>
                                            {alt.price}
                                          </span>
                                          <span
                                            className="flex items-center gap-1"
                                            style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "0.68rem", color: MS.leaf }}
                                          >
                                            🌍 {alt.co2Saved}
                                          </span>
                                        </div>
                                      </div>
                                      <motion.div
                                        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                                        style={{ background: `linear-gradient(135deg, ${MS.leaf}, ${MS.leafLight})` }}
                                        whileHover={{ scale: 1.15 }}
                                      >
                                        <ArrowRight size={14} color="white" />
                                      </motion.div>
                                    </motion.div>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Swapped success state */}
                        <AnimatePresence>
                          {isSwapped && isExpanded && (
                            <motion.div
                              className="px-4 pb-4"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                            >
                              <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "rgba(45,143,62,0.08)" }}>
                                <Sparkles size={14} color={MS.leaf} />
                                <p style={{ fontFamily: "Nunito Sans, sans-serif", fontSize: "0.75rem", color: MS.leaf, fontWeight: 600 }}>
                                  Bra val! Ett nytt träd växer på din ö 🌳
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Just-swapped celebration overlay */}
                        <AnimatePresence>
                          {wasJustSwapped && (
                            <motion.div
                              className="absolute inset-0 flex items-center justify-center pointer-events-none"
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 1.5 }}
                              transition={{ duration: 0.6 }}
                            >
                              <span style={{ fontSize: "3rem" }}>🌳</span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div
              className="flex-shrink-0 px-5 py-4"
              style={{ background: "#f0faf2", borderTop: "1px solid rgba(45,143,62,0.12)" }}
            >
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "0.82rem", color: MS.dark }}>
                    Ditt klimatavtryck
                  </p>
                  <p style={{ fontFamily: "Nunito Sans, sans-serif", fontSize: "0.72rem", color: MS.muted }}>
                    {swappedProducts.size > 0
                      ? `Du har minskat ditt CO₂-avtryck med ~${swappedProducts.size * 15}% genom dina byten`
                      : "Börja byta produkter för att minska ditt avtryck"}
                  </p>
                </div>
                <motion.div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background: swappedProducts.size > 0
                      ? `conic-gradient(${MS.leaf} ${(swappedProducts.size / itemsWithAlternatives.length) * 360}deg, #e0f0e0 0deg)`
                      : "#e0f0e0",
                  }}
                  animate={swappedProducts.size > 0 ? { rotate: [0, 5, -5, 0] } : {}}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "#fafdf8" }}>
                    <span style={{ fontSize: "1rem" }}>🌍</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
