import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { X, CheckCircle2, Clock, Package, Truck, PartyPopper } from "lucide-react";
import { MOCK_PRODUCTS } from "./ProductList";

const MS = {
  green: "#006b3f",
  greenLight: "#4a9060",
  greenPale: "#e8f5ee",
  gold: "#d4a843",
  cream: "#f5f2eb",
  dark: "#1a2e1a",
  muted: "#6b7a6b",
};

export interface Order {
  id: string;
  items: Record<string, number>;
  placedAt: Date;
  deliveryDate: string;
}

type Stage = 0 | 1 | 2 | 3;

const STAGES = [
  { label: "Beställning mottagen", sublabel: "Vi har tagit emot din order", icon: CheckCircle2, color: MS.green, duration: 8000 },
  { label: "Plockas & packas", sublabel: "Dina varor plockas på lagret", icon: Package, color: "#5a7db8", duration: 12000 },
  { label: "Ute för leverans", sublabel: "Chauffören är på väg till dig", icon: Truck, color: MS.gold, duration: 15000 },
  { label: "Levererad!", sublabel: "Klart — välkommen att beställa igen", icon: PartyPopper, color: MS.green, duration: Infinity },
];

interface OrderTrackerProps {
  order: Order;
  open: boolean;
  onClose: () => void;
}

export function OrderTracker({ order, open, onClose }: OrderTrackerProps) {
  const [stage, setStage] = useState<Stage>(0);
  const [elapsed, setElapsed] = useState(0);

  // Auto-advance through stages
  useEffect(() => {
    if (!open) return;
    if (stage >= 3) return;
    const duration = STAGES[stage].duration;
    const interval = setInterval(() => {
      setElapsed(e => {
        const next = e + 500;
        if (next >= duration) {
          setStage(s => Math.min(s + 1, 3) as Stage);
          return 0;
        }
        return next;
      });
    }, 500);
    return () => clearInterval(interval);
  }, [stage, open]);

  const items = MOCK_PRODUCTS.filter(p => (order.items[p.id] ?? 0) > 0);
  const totalUnits = Object.values(order.items).reduce((s, q) => s + q, 0);
  const currentStage = STAGES[stage];
  const progress = stage >= 3 ? 100 : Math.min((elapsed / currentStage.duration) * 100, 100);
  const delivered = stage === 3;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[65]"
            style={{ background: "rgba(10,30,10,0.55)", backdropFilter: "blur(6px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed right-0 top-0 bottom-0 z-[66] flex flex-col"
            style={{ width: "min(460px, 100vw)", background: "white", boxShadow: "-8px 0 48px rgba(0,0,0,0.22)" }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
          >
            {/* Header */}
            <div
              className="flex-shrink-0 px-6 py-5"
              style={{
                background: delivered
                  ? `linear-gradient(135deg, ${MS.gold}, #b8860b)`
                  : `linear-gradient(135deg, ${MS.greenLight}, ${MS.green})`,
                transition: "background 0.8s ease",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <motion.div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.25)" }}
                    animate={!delivered ? { scale: [1, 1.08, 1] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span style={{ fontSize: "1.3rem" }}>{delivered ? "🎉" : "🚚"}</span>
                  </motion.div>
                  <div>
                    <h2 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "white" }}>
                      Order #{order.id}
                    </h2>
                    <p style={{ fontFamily: "Nunito Sans, sans-serif", fontSize: "0.78rem", color: "rgba(255,255,255,0.85)" }}>
                      {items.length} produkter · {totalUnits} enheter · {order.deliveryDate}
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

              {/* Current stage label */}
              <div
                className="px-4 py-3 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(4px)" }}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  {!delivered && (
                    <motion.div
                      className="w-2 h-2 rounded-full"
                      style={{ background: "#ffe66d" }}
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                    />
                  )}
                  <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "0.95rem", color: "white" }}>
                    {currentStage.label}
                  </p>
                </div>
                <p style={{ fontFamily: "Nunito Sans, sans-serif", fontSize: "0.8rem", color: "rgba(255,255,255,0.82)" }}>
                  {currentStage.sublabel}
                </p>

                {/* Progress bar for current stage */}
                {!delivered && (
                  <div className="mt-2.5 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.25)" }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: "#ffe66d" }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Stage stepper */}
            <div className="flex-shrink-0 px-6 py-5" style={{ borderBottom: "1px solid rgba(0,107,63,0.1)" }}>
              <div className="relative flex items-start justify-between">
                {/* Connector line */}
                <div
                  className="absolute top-4 left-4 right-4 h-0.5"
                  style={{ background: "#e8e4d9", zIndex: 0 }}
                />
                <motion.div
                  className="absolute top-4 left-4 h-0.5"
                  style={{ background: `linear-gradient(90deg, ${MS.green}, ${MS.greenLight})`, zIndex: 1, transformOrigin: "left" }}
                  animate={{ width: `${(stage / 3) * (100 - (8 / 460) * 100)}%` }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                />

                {STAGES.map((s, i) => {
                  const done = i < stage;
                  const active = i === stage;
                  const Icon = s.icon;
                  return (
                    <div key={i} className="flex flex-col items-center gap-1.5 z-10" style={{ width: "25%" }}>
                      <motion.div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{
                          background: done ? MS.green : active ? "white" : "#f0f0f0",
                          border: active ? `2.5px solid ${MS.green}` : "none",
                          boxShadow: active ? `0 0 0 4px ${MS.greenPale}` : "none",
                        }}
                        animate={active ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <Icon
                          size={14}
                          color={done ? "white" : active ? MS.green : "#c0c0c0"}
                          strokeWidth={done || active ? 2.5 : 2}
                        />
                      </motion.div>
                      <p
                        style={{
                          fontFamily: "Nunito, sans-serif",
                          fontWeight: active || done ? 700 : 500,
                          fontSize: "0.62rem",
                          color: done ? MS.green : active ? MS.dark : MS.muted,
                          textAlign: "center",
                          lineHeight: 1.2,
                        }}
                      >
                        {s.label.split(" ")[0]}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ETA card */}
            <div className="flex-shrink-0 mx-5 mt-4 p-4 rounded-2xl flex items-center gap-3" style={{ background: MS.greenPale }}>
              <Clock size={20} color={MS.green} />
              <div>
                <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "0.88rem", color: MS.dark }}>
                  {delivered ? "Levererad idag" : `Beräknad leverans: ${order.deliveryDate}`}
                </p>
                <p style={{ fontFamily: "Nunito Sans, sans-serif", fontSize: "0.75rem", color: MS.muted }}>
                  {delivered ? "Tack för din beställning! 🎉" : "Direkt till din bakingång · 06:00–08:00"}
                </p>
              </div>
            </div>

            {/* Items list */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "0.82rem", color: MS.muted, marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Beställda varor
              </p>
              <div className="space-y-2">
                {items.map((product, idx) => {
                  const qty = order.items[product.id];
                  return (
                    <motion.div
                      key={product.id}
                      className="flex items-center gap-3 p-3 rounded-xl"
                      style={{ background: "#fafaf8", border: "1px solid #f0ede6" }}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04, type: "spring", damping: 22 }}
                    >
                      <span style={{ fontSize: "1.4rem", lineHeight: 1 }}>{product.image}</span>
                      <div className="flex-1 min-w-0">
                        <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "0.85rem", color: MS.dark }}>
                          {product.name}
                        </p>
                        <p style={{ fontFamily: "Nunito Sans, sans-serif", fontSize: "0.72rem", color: MS.muted }}>
                          {product.price}
                        </p>
                      </div>
                      <span
                        className="px-2.5 py-1 rounded-lg"
                        style={{ background: MS.greenPale, fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "0.8rem", color: MS.green }}
                      >
                        {qty} {product.unit}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div
              className="flex-shrink-0 px-5 py-4"
              style={{ background: MS.cream, borderTop: "1px solid rgba(0,107,63,0.1)" }}
            >
              <motion.button
                className="w-full py-3 rounded-2xl flex items-center justify-center gap-2"
                style={{
                  background: `linear-gradient(135deg, ${MS.green}, ${MS.greenLight})`,
                  color: "white",
                  fontFamily: "Nunito, sans-serif",
                  fontWeight: 800,
                  fontSize: "0.95rem",
                  boxShadow: "0 4px 14px rgba(0,107,63,0.3)",
                }}
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                Stäng spårning
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
