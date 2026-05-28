import { motion, AnimatePresence } from "motion/react";
import { X, Star, ShoppingCart, Pencil, Leaf } from "lucide-react";
import { MOCK_PRODUCTS } from "./ProductList";
import confetti from "canvas-confetti";

const MS = {
  green: "#006b3f",
  greenLight: "#4a9060",
  greenPale: "#e8f5ee",
  gold: "#d4a843",
  cream: "#f5f2eb",
  dark: "#1a2e1a",
  muted: "#6b7a6b",
};

interface FavoritesPanelProps {
  open: boolean;
  onClose: () => void;
  favorites: Record<string, number>;
  onEdit: () => void;
  onOrder: () => void;
  onOpenSustainSwap?: () => void;
  sustainabilityTrees?: number;
}

export function FavoritesPanel({ open, onClose, favorites, onEdit, onOrder, onOpenSustainSwap, sustainabilityTrees = 0 }: FavoritesPanelProps) {
  const items = MOCK_PRODUCTS.filter(p => (favorites[p.id] ?? 0) > 0);
  const totalUnits = Object.values(favorites).reduce((s, q) => s + q, 0);

  function handleOrder() {
    // Confetti burst
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ["#006b3f", "#d4a843", "#4a9060", "#ffffff", "#ffe66d"] });
    setTimeout(() => {
      confetti({ particleCount: 60, spread: 100, angle: 60, origin: { x: 0, y: 0.7 }, colors: ["#006b3f", "#d4a843", "#ffffff"] });
      confetti({ particleCount: 60, spread: 100, angle: 120, origin: { x: 1, y: 0.7 }, colors: ["#006b3f", "#d4a843", "#ffffff"] });
    }, 250);
    // Navigate to Martin & Servera shopping list
    setTimeout(() => {
      window.open("https://www.martinservera.se/inkopslistor/j_gKCgtZTgoAAAGD_HQjoD0l", "_blank");
    }, 400);
    onOrder();
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[55]"
            style={{ background: "rgba(10,30,10,0.45)", backdropFilter: "blur(4px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 z-[56] flex flex-col"
            style={{ width: "min(420px, 100vw)", background: "white", boxShadow: "-8px 0 40px rgba(0,0,0,0.18)" }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
          >
            {/* Header */}
            <div
              className="flex-shrink-0 px-6 py-5 flex items-center justify-between"
              style={{ background: `linear-gradient(135deg, ${MS.greenLight}, ${MS.green})` }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.25)" }}
                >
                  <Star size={20} color="white" fill="white" />
                </div>
                <div>
                  <h2 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "1.15rem", color: "white" }}>
                    Min favoritlista
                  </h2>
                  <p style={{ fontFamily: "Nunito Sans, sans-serif", fontSize: "0.8rem", color: "rgba(255,255,255,0.85)" }}>
                    {items.length} produkter · {totalUnits} enheter
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.25)" }}
              >
                <X size={18} color="white" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 pb-16">
                  <span style={{ fontSize: "3rem" }}>⭐</span>
                  <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "1rem", color: MS.muted }}>
                    Inga favoriter sparade ännu
                  </p>
                  <p style={{ fontFamily: "Nunito Sans, sans-serif", fontSize: "0.85rem", color: MS.muted, textAlign: "center" }}>
                    Gå till Butiken och skapa din favoritlista för snabbare beställningar.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {items.map(product => {
                    const qty = favorites[product.id];
                    return (
                      <motion.div
                        key={product.id}
                        className="flex items-center gap-3 p-3.5 rounded-2xl"
                        style={{ background: MS.greenPale, border: `1.5px solid ${MS.green}22` }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ type: "spring", damping: 22 }}
                      >
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: "rgba(0,107,63,0.1)", fontSize: "1.6rem" }}
                        >
                          {product.image}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "0.92rem", color: MS.dark }}>
                            {product.name}
                          </p>
                          <p style={{ fontFamily: "Nunito Sans, sans-serif", fontSize: "0.75rem", color: MS.muted }}>
                            {product.category} · {product.price}
                          </p>
                        </div>
                        <div
                          className="flex-shrink-0 px-3 py-1.5 rounded-xl"
                          style={{ background: MS.green }}
                        >
                          <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "0.9rem", color: "white" }}>
                            {qty} {product.unit}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div
              className="flex-shrink-0 px-5 py-4 space-y-3"
              style={{ background: MS.cream, borderTop: "1px solid rgba(0,107,63,0.1)" }}
            >
              {/* Sustainability swap CTA */}
              {items.length > 0 && onOpenSustainSwap && (
                <motion.button
                  className="w-full py-3 rounded-2xl flex items-center justify-center gap-2.5"
                  style={{
                    background: "linear-gradient(135deg, #1a5c2a, #2d8f3e)",
                    color: "white",
                    fontFamily: "Nunito, sans-serif",
                    fontWeight: 800,
                    fontSize: "0.88rem",
                    boxShadow: "0 4px 16px rgba(45,143,62,0.3)",
                    border: "none",
                  }}
                  onClick={onOpenSustainSwap}
                  whileHover={{ scale: 1.02, boxShadow: "0 6px 22px rgba(45,143,62,0.4)" }}
                  whileTap={{ scale: 0.97 }}
                >
                  <motion.span
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Leaf size={16} />
                  </motion.span>
                  Upptäck hållbara byten
                  {sustainabilityTrees > 0 && (
                    <span className="ml-1 px-2 py-0.5 rounded-full text-[0.7rem]" style={{ background: "rgba(255,255,255,0.25)" }}>
                      🌳 {sustainabilityTrees}
                    </span>
                  )}
                </motion.button>
              )}

              <div className="flex gap-3">
              <motion.button
                className="flex-1 py-3 rounded-2xl flex items-center justify-center gap-2"
                style={{
                  background: "white",
                  border: `2px solid ${MS.green}`,
                  color: MS.green,
                  fontFamily: "Nunito, sans-serif",
                  fontWeight: 800,
                  fontSize: "0.9rem",
                }}
                onClick={onEdit}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <Pencil size={15} />
                Redigera lista
              </motion.button>
              <motion.button
                className="flex-1 py-3 rounded-2xl flex items-center justify-center gap-2"
                style={{
                  background: items.length > 0 ? `linear-gradient(135deg, ${MS.green}, ${MS.greenLight})` : "#e8e4d9",
                  color: items.length > 0 ? "white" : MS.muted,
                  fontFamily: "Nunito, sans-serif",
                  fontWeight: 800,
                  fontSize: "0.9rem",
                  boxShadow: items.length > 0 ? "0 4px 14px rgba(0,107,63,0.3)" : "none",
                }}
                disabled={items.length === 0}
                onClick={items.length > 0 ? handleOrder : undefined}
                whileHover={items.length > 0 ? { scale: 1.02 } : {}}
                whileTap={items.length > 0 ? { scale: 0.97 } : {}}
              >
                <ShoppingCart size={15} />
                Beställ favoriter
              </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
