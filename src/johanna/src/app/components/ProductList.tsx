import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { X, Search, Plus, Minus, Check, Star, ShoppingCart } from "lucide-react";

const MS = {
  green: "#006b3f",
  greenLight: "#4a9060",
  greenPale: "#e8f5ee",
  gold: "#d4a843",
  cream: "#f5f2eb",
  dark: "#1a2e1a",
  muted: "#6b7a6b",
};

export const MOCK_PRODUCTS = [
  { id: "p1", name: "Lax filé", category: "Fisk & Skaldjur", price: "189 kr/kg", image: "🐟", unit: "kg" },
  { id: "p2", name: "Oxfilé", category: "Kött", price: "449 kr/kg", image: "🥩", unit: "kg" },
  { id: "p3", name: "Körsbärstomater", category: "Grönsaker", price: "45 kr/ask", image: "🍅", unit: "ask" },
  { id: "p4", name: "Basilika färsk", category: "Örter", price: "25 kr/kruka", image: "🌿", unit: "kruka" },
  { id: "p5", name: "Parmesan 24 mån", category: "Ost", price: "285 kr/kg", image: "🧀", unit: "kg" },
  { id: "p6", name: "Olivolja Extra Virgin", category: "Olja & Vinäger", price: "125 kr/l", image: "🫒", unit: "liter" },
  { id: "p7", name: "Surdegsbröd", category: "Bröd & Bakverk", price: "42 kr/st", image: "🥖", unit: "st" },
  { id: "p8", name: "Ägg frigående", category: "Mejeri & Ägg", price: "38 kr/förp", image: "🥚", unit: "förp" },
  { id: "p9", name: "Smör normalsaltat", category: "Mejeri & Ägg", price: "95 kr/kg", image: "🧈", unit: "kg" },
  { id: "p10", name: "Pasta Tagliatelle", category: "Torrvaror", price: "28 kr/förp", image: "🍝", unit: "förp" },
  { id: "p11", name: "Vitlök färsk", category: "Grönsaker", price: "32 kr/kg", image: "🧄", unit: "kg" },
  { id: "p12", name: "Ruccola", category: "Grönsaker", price: "35 kr/påse", image: "🥬", unit: "påse" },
];

interface ProductListProps {
  onClose: () => void;
  onComplete: () => void;
  onSave: (favorites: Record<string, number>) => void;
  initialFavorites?: Record<string, number>;
}

export function ProductList({ onClose, onComplete, onSave, initialFavorites = {} }: ProductListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [quantities, setQuantities] = useState<Record<string, number>>(initialFavorites);
  const [showSuccess, setShowSuccess] = useState(false);

  const filteredProducts = MOCK_PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function setQty(productId: string, delta: number) {
    setQuantities(prev => {
      const current = prev[productId] ?? 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const { [productId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [productId]: next };
    });
  }

  function toggleProduct(productId: string) {
    if ((quantities[productId] ?? 0) === 0) {
      setQty(productId, 1);
    }
  }

  const totalItems = Object.keys(quantities).length;
  const totalUnits = Object.values(quantities).reduce((s, q) => s + q, 0);

  function handleSave() {
    if (totalItems > 0) {
      onSave(quantities);
      setShowSuccess(true);
      setTimeout(() => {
        onComplete();
        onClose();
      }, 1500);
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ background: "rgba(10, 30, 10, 0.82)", backdropFilter: "blur(8px)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
        initial={{ scale: 0.85, y: 60, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 40, opacity: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 260 }}
        style={{ maxHeight: "90vh", display: "flex", flexDirection: "column" }}
      >
        {/* Header */}
        <div
          className="px-6 py-5 flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${MS.greenLight}, ${MS.green})` }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.25)" }}
          >
            <X size={18} color="white" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.25)" }}
            >
              <Star size={24} color="white" fill="white" />
            </div>
            <div>
              <h2 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "1.4rem", color: "white" }}>
                Skapa din favoritlista
              </h2>
              <p style={{ fontFamily: "Nunito Sans, sans-serif", fontSize: "0.85rem", color: "rgba(255,255,255,0.85)" }}>
                Välj produkter och ange antal för snabb beställning
              </p>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search size={18} color={MS.muted} className="absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Sök produkter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl"
              style={{
                background: "white",
                border: "2px solid transparent",
                fontFamily: "Nunito Sans, sans-serif",
                fontSize: "0.95rem",
                outline: "none",
              }}
            />
          </div>
        </div>

        {/* Product grid */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredProducts.map(product => {
              const qty = quantities[product.id] ?? 0;
              const isSelected = qty > 0;
              return (
                <motion.div
                  key={product.id}
                  className="relative p-4 rounded-2xl"
                  style={{
                    background: isSelected ? MS.greenPale : "white",
                    border: `2px solid ${isSelected ? MS.green : "#e8e4d9"}`,
                    transition: "all 0.2s ease",
                    cursor: isSelected ? "default" : "pointer",
                  }}
                  onClick={() => toggleProduct(product.id)}
                  whileHover={!isSelected ? { scale: 1.02 } : {}}
                  whileTap={!isSelected ? { scale: 0.98 } : {}}
                >
                  {/* Product info row */}
                  <div className="flex items-start gap-3">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(0,107,63,0.08)", fontSize: "1.8rem" }}
                    >
                      {product.image}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "0.95rem", color: isSelected ? MS.green : MS.dark, marginBottom: "2px" }}>
                        {product.name}
                      </p>
                      <p style={{ fontFamily: "Nunito Sans, sans-serif", fontSize: "0.75rem", color: MS.muted, marginBottom: "4px" }}>
                        {product.category}
                      </p>
                      <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "0.88rem", color: MS.green }}>
                        {product.price}
                      </p>
                    </div>
                  </div>

                  {/* Counter row — appears when selected */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        className="mt-3 flex items-center justify-between"
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.18 }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span style={{ fontFamily: "Nunito Sans, sans-serif", fontSize: "0.78rem", color: MS.muted }}>
                          Antal ({product.unit})
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            className="w-7 h-7 rounded-full flex items-center justify-center"
                            style={{ background: qty === 1 ? "#fee2e2" : MS.greenPale, color: qty === 1 ? "#dc2626" : MS.green }}
                            onClick={() => setQty(product.id, -1)}
                          >
                            <Minus size={14} strokeWidth={2.5} />
                          </button>
                          <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "1rem", color: MS.dark, minWidth: "1.5rem", textAlign: "center" }}>
                            {qty}
                          </span>
                          <button
                            className="w-7 h-7 rounded-full flex items-center justify-center"
                            style={{ background: MS.green, color: "white" }}
                            onClick={() => setQty(product.id, 1)}
                          >
                            <Plus size={14} strokeWidth={2.5} />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Check badge (top-right, only when selected and no counter interaction) */}
                  {!isSelected && (
                    <div
                      className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center"
                      style={{ background: "#f0f0f0" }}
                    >
                      <Plus size={14} color={MS.muted} />
                    </div>
                  )}
                  {isSelected && (
                    <div
                      className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center"
                      style={{ background: MS.green }}
                    >
                      <Check size={14} color="white" strokeWidth={3} />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-6 py-4 flex-shrink-0 flex items-center justify-between"
          style={{ background: MS.cream, borderTop: "1px solid rgba(0,107,63,0.1)" }}
        >
          <div>
            <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "0.9rem", color: MS.dark }}>
              {totalItems} produkter · {totalUnits} enheter totalt
            </p>
            <p style={{ fontFamily: "Nunito Sans, sans-serif", fontSize: "0.75rem", color: MS.muted }}>
              Välj minst 1 produkt för att fortsätta
            </p>
          </div>

          <motion.button
            className="px-6 py-3 rounded-2xl flex items-center gap-2"
            style={{
              background: totalItems > 0 ? `linear-gradient(135deg, ${MS.green}, ${MS.greenLight})` : "#e8e4d9",
              color: totalItems > 0 ? "white" : MS.muted,
              fontFamily: "Nunito, sans-serif",
              fontWeight: 800,
              fontSize: "0.95rem",
              cursor: totalItems > 0 ? "pointer" : "not-allowed",
              boxShadow: totalItems > 0 ? "0 4px 16px rgba(0,107,63,0.3)" : "none",
            }}
            onClick={handleSave}
            whileHover={totalItems > 0 ? { scale: 1.03 } : {}}
            whileTap={totalItems > 0 ? { scale: 0.97 } : {}}
            disabled={totalItems === 0}
          >
            <ShoppingCart size={16} />
            Spara favoritlista
          </motion.button>
        </div>

        {/* Success overlay */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: "rgba(0,107,63,0.95)", backdropFilter: "blur(4px)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="text-center"
                initial={{ scale: 0.5, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: "spring", damping: 15 }}
              >
                <motion.div
                  style={{ fontSize: "4rem", marginBottom: "1rem" }}
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  ⭐
                </motion.div>
                <h3 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "1.5rem", color: "white", marginBottom: "0.5rem" }}>
                  Favoritlista sparad!
                </h3>
                <p style={{ fontFamily: "Nunito Sans, sans-serif", fontSize: "0.95rem", color: "rgba(255,255,255,0.85)" }}>
                  {totalItems} produkter · {totalUnits} enheter
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
