import { motion } from "motion/react";
import { useState } from "react";
import { ChefHat, ShoppingBag, BarChart3, Truck } from "lucide-react";

const roles = [
  { id: "chef", label: "Köksmästare", emoji: "👨‍🍳", desc: "Beställer råvaror och planerar menyer" },
  { id: "purchasing", label: "Inköpsansvarig", emoji: "📋", desc: "Hanterar avtal, priser och leverantörer" },
  { id: "manager", label: "Restaurangchef", emoji: "🏪", desc: "Ansvarar för hela verksamheten" },
  { id: "logistics", label: "Logistikansvarig", emoji: "🚚", desc: "Koordinerar leveranser och lager" },
];

interface WelcomeScreenProps {
  onComplete: (name: string, role: string) => void;
}

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [step, setStep] = useState<"welcome" | "name" | "role">("welcome");
  const [name, setName] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: "linear-gradient(160deg, #e8f5ee 0%, #f5f2eb 40%, #d4e8d0 100%)",
      }}
    >
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          { x: "10%", y: "15%", w: 320, color: "#c8e8d0", delay: 0 },
          { x: "70%", y: "60%", w: 260, color: "#d4a84333", delay: 1 },
          { x: "60%", y: "5%", w: 200, color: "#a8d4c033", delay: 2 },
          { x: "5%", y: "70%", w: 180, color: "#b8d8c033", delay: 0.5 },
        ].map((blob, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: blob.x,
              top: blob.y,
              width: blob.w,
              height: blob.w,
              background: blob.color,
              filter: "blur(60px)",
            }}
            animate={{ scale: [1, 1.1, 1], x: [0, 20, 0], y: [0, -15, 0] }}
            transition={{ duration: 8 + i * 2, repeat: Infinity, delay: blob.delay }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Welcome step */}
        {step === "welcome" && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 20 }}
          >
            {/* M&S Logo area — 3D spinning cube face */}
            <div style={{ perspective: "600px", width: "96px", height: "96px", margin: "0 auto 1.5rem" }}>
              <motion.div
                className="w-24 h-24 rounded-3xl flex items-center justify-center shadow-2xl"
                style={{
                  background: "linear-gradient(135deg, #006b3f, #4a9060)",
                  transformStyle: "preserve-3d",
                }}
                animate={{
                  rotateY: [0, 15, -15, 0],
                  rotateX: [0, -8, 8, 0],
                  y: [0, -10, 0],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Top face shine */}
                <div
                  className="absolute inset-0 rounded-3xl"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.35) 0%, transparent 60%)",
                    pointerEvents: "none",
                  }}
                />
                <span style={{ fontSize: "3rem", position: "relative", zIndex: 1 }}>🌿</span>
              </motion.div>
            </div>

            <motion.h1
              style={{
                fontFamily: "Nunito, sans-serif",
                fontWeight: 900,
                fontSize: "2.2rem",
                color: "#1a2e1a",
                lineHeight: 1.2,
                marginBottom: "0.5rem",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Välkommen till Martin & Servera! 🎉
            </motion.h1>

            <motion.p
              style={{
                fontFamily: "Nunito Sans, sans-serif",
                color: "#4a6e4a",
                fontSize: "1.1rem",
                lineHeight: 1.6,
                marginBottom: "2rem",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Din resa mot smidigare restaurangdrift börjar här. Utforska din digitala ö och lås upp nya superkrafter!
            </motion.p>

            {/* Feature teaser pills */}
            <motion.div
              className="flex flex-wrap justify-center gap-2 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {["🛒 Beställ enkelt", "📦 Hantera lager", "📱 App & digitala tjänster", "🚚 Spåra leveranser", "📊 Analyser"].map(
                (tag, i) => (
                  <motion.span
                    key={i}
                    className="px-3 py-1.5 rounded-full text-sm"
                    style={{
                      background: "white",
                      color: "#006b3f",
                      fontFamily: "Nunito, sans-serif",
                      fontWeight: 700,
                      boxShadow: "0 2px 8px rgba(0,107,63,0.15)",
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6 + i * 0.08, type: "spring" }}
                  >
                    {tag}
                  </motion.span>
                )
              )}
            </motion.div>

            <motion.button
              className="w-full py-4 rounded-2xl shadow-lg"
              style={{
                background: "linear-gradient(135deg, #006b3f, #4a9060)",
                color: "white",
                fontFamily: "Nunito, sans-serif",
                fontWeight: 800,
                fontSize: "1.1rem",
              }}
              whileHover={{ scale: 1.02, boxShadow: "0 8px 24px rgba(0,107,63,0.35)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setStep("name")}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              Starta äventyret! 🚀
            </motion.button>
          </motion.div>
        )}

        {/* Name step */}
        {step === "name" && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", damping: 20 }}
          >
            <div className="text-6xl mb-4">👋</div>
            <h2
              style={{
                fontFamily: "Nunito, sans-serif",
                fontWeight: 900,
                fontSize: "1.8rem",
                color: "#1a2e1a",
                marginBottom: "0.5rem",
              }}
            >
              Vad heter du?
            </h2>
            <p style={{ fontFamily: "Nunito Sans, sans-serif", color: "#4a6e4a", marginBottom: "2rem" }}>
              Vi skapar en personlig upplevelse för dig
            </p>

            <div
              className="rounded-2xl p-1 mb-4 shadow-inner"
              style={{ background: "white", border: "2px solid #e8f5ee" }}
            >
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ditt namn..."
                className="w-full px-4 py-3 rounded-xl outline-none"
                style={{
                  fontFamily: "Nunito, sans-serif",
                  fontWeight: 600,
                  fontSize: "1.1rem",
                  color: "#1a2e1a",
                  background: "transparent",
                }}
                onKeyDown={(e) => e.key === "Enter" && name.trim() && setStep("role")}
                autoFocus
              />
            </div>

            <motion.button
              className="w-full py-4 rounded-2xl shadow-lg"
              style={{
                background: name.trim()
                  ? "linear-gradient(135deg, #006b3f, #4a9060)"
                  : "#e8e4d9",
                color: name.trim() ? "white" : "#6b7a6b",
                fontFamily: "Nunito, sans-serif",
                fontWeight: 800,
                fontSize: "1.1rem",
                cursor: name.trim() ? "pointer" : "not-allowed",
              }}
              whileHover={name.trim() ? { scale: 1.02 } : {}}
              whileTap={name.trim() ? { scale: 0.98 } : {}}
              onClick={() => name.trim() && setStep("role")}
            >
              Fortsätt →
            </motion.button>
          </motion.div>
        )}

        {/* Role step */}
        {step === "role" && (
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", damping: 20 }}
          >
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">🎭</div>
              <h2
                style={{
                  fontFamily: "Nunito, sans-serif",
                  fontWeight: 900,
                  fontSize: "1.8rem",
                  color: "#1a2e1a",
                  marginBottom: "0.5rem",
                }}
              >
                Vilken roll har du, {name}?
              </h2>
              <p style={{ fontFamily: "Nunito Sans, sans-serif", color: "#4a6e4a" }}>
                Vi anpassar din upplevelse efter dina behov
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {roles.map((role) => (
                <motion.button
                  key={role.id}
                  className="p-4 rounded-2xl text-left"
                  style={{
                    background: selectedRole === role.id ? "linear-gradient(135deg, #e8f5ee, #d0ecda)" : "white",
                    border: `2px solid ${selectedRole === role.id ? "#006b3f" : "#e8e4d9"}`,
                    cursor: "pointer",
                    boxShadow: selectedRole === role.id ? "0 8px 24px rgba(0,107,63,0.25)" : "0 2px 8px rgba(0,0,0,0.06)",
                  }}
                  onClick={() => setSelectedRole(role.id)}
                  whileHover={{ scale: 1.04, y: -4, boxShadow: "0 12px 32px rgba(0,107,63,0.2)" }}
                  whileTap={{ scale: 0.97, y: 0 }}
                >
                  <div style={{ fontSize: "1.8rem", marginBottom: "0.3rem" }}>{role.emoji}</div>
                  <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "0.9rem", color: "#1a2e1a" }}>
                    {role.label}
                  </div>
                  <div style={{ fontFamily: "Nunito Sans, sans-serif", fontSize: "0.75rem", color: "#6b7a6b", marginTop: "2px" }}>
                    {role.desc}
                  </div>
                </motion.button>
              ))}
            </div>

            <motion.button
              className="w-full py-4 rounded-2xl shadow-lg"
              style={{
                background: selectedRole
                  ? "linear-gradient(135deg, #006b3f, #4a9060)"
                  : "#e8e4d9",
                color: selectedRole ? "white" : "#6b7a6b",
                fontFamily: "Nunito, sans-serif",
                fontWeight: 800,
                fontSize: "1.1rem",
                cursor: selectedRole ? "pointer" : "not-allowed",
              }}
              whileHover={selectedRole ? { scale: 1.02 } : {}}
              whileTap={selectedRole ? { scale: 0.98 } : {}}
              onClick={() => selectedRole && onComplete(name, selectedRole)}
            >
              Utforska din ö! 🏝️
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
