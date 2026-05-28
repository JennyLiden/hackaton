import { motion, AnimatePresence } from "motion/react";
import { Trophy, Star, Flame, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface Quest {
  id: string;
  title: string;
  description: string;
  emoji: string;
  xp: number;
  completed: boolean;
}

interface Badge {
  id: string;
  name: string;
  emoji: string;
  unlocked: boolean;
}

interface QuestPanelProps {
  userName: string;
  level: number;
  xp: number;
  maxXp: number;
  streak: number;
  quests: Quest[];
  badges: Badge[];
  completedCount: number;
  totalCount: number;
}

export function QuestPanel({
  userName, level, xp, maxXp, streak, quests, badges, completedCount, totalCount
}: QuestPanelProps) {
  const [showBadges, setShowBadges] = useState(false);
  const progress = (xp / maxXp) * 100;

  return (
    <div className="flex flex-col gap-3 h-full overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      {/* Player card */}
      <div
        className="rounded-2xl p-4"
        style={{ background: "linear-gradient(135deg, #006b3f, #4a9060)", boxShadow: "0 4px 16px rgba(0,107,63,0.3)" }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
            style={{ background: "rgba(255,255,255,0.25)" }}
          >
            🧑‍🍳
          </div>
          <div>
            <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, color: "white", fontSize: "1rem" }}>
              {userName}
            </p>
            <div className="flex items-center gap-1">
              <Star size={12} color="#ffe66d" fill="#ffe66d" />
              <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, color: "rgba(255,255,255,0.9)", fontSize: "0.8rem" }}>
                Nivå {level} — Matproffs
              </span>
            </div>
          </div>
          {streak > 0 && (
            <div className="ml-auto flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.2)" }}>
              <Flame size={14} color="#ff8c42" />
              <span style={{ color: "white", fontWeight: 800, fontSize: "0.8rem", fontFamily: "Nunito, sans-serif" }}>{streak}</span>
            </div>
          )}
        </div>

        {/* XP bar */}
        <div className="mb-1 flex justify-between">
          <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, color: "rgba(255,255,255,0.85)", fontSize: "0.75rem" }}>
            {xp} / {maxXp} XP
          </span>
          <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, color: "rgba(255,255,255,0.85)", fontSize: "0.75rem" }}>
            Nivå {level + 1} →
          </span>
        </div>
        <div className="h-3 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.2)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #ffe66d, #ffc107)" }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Island progress */}
      <div className="rounded-2xl p-4" style={{ background: "white", border: "1.5px solid #e8e4d9" }}>
        <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, color: "#1a2e1a", fontSize: "0.9rem", marginBottom: "0.5rem" }}>
          🏝️ Ö-framsteg
        </p>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ background: "#e8e4d9" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, #006b3f, #4a9060)" }}
              animate={{ width: `${(completedCount / totalCount) * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "0.85rem", color: "#006b3f" }}>
            {completedCount}/{totalCount}
          </span>
        </div>
        <p style={{ fontFamily: "Nunito Sans, sans-serif", fontSize: "0.78rem", color: "#6b7a6b", marginTop: "6px" }}>
          {completedCount === totalCount
            ? "🎉 Du har utforskat hela ön!"
            : `${totalCount - completedCount} byggnader kvar att utforska`}
        </p>
      </div>

      {/* Active quests */}
      <div className="rounded-2xl p-4" style={{ background: "white", border: "1.5px solid #e8e4d9" }}>
        <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, color: "#1a2e1a", fontSize: "0.9rem", marginBottom: "0.75rem" }}>
          📜 Aktiva uppdrag
        </p>
        <div className="space-y-2">
          {quests.filter(q => !q.completed).slice(0, 3).map((quest) => (
            <div
              key={quest.id}
              className="flex items-center gap-3 p-2.5 rounded-xl"
              style={{ background: "#f5f2eb" }}
            >
              <span style={{ fontSize: "1.2rem" }}>{quest.emoji}</span>
              <div className="flex-1 min-w-0">
                <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "0.8rem", color: "#1a2e1a" }}>
                  {quest.title}
                </p>
                <p style={{ fontFamily: "Nunito Sans, sans-serif", fontSize: "0.72rem", color: "#6b7a6b" }}>
                  {quest.description}
                </p>
              </div>
              <div
                className="flex-shrink-0 px-2 py-0.5 rounded-full"
                style={{ background: "#e8f5ee" }}
              >
                <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "0.72rem", color: "#006b3f" }}>
                  +{quest.xp}XP
                </span>
              </div>
            </div>
          ))}
          {quests.filter(q => !q.completed).length === 0 && (
            <p style={{ fontFamily: "Nunito Sans, sans-serif", fontSize: "0.82rem", color: "#6b7a6b", textAlign: "center", padding: "0.5rem" }}>
              🎊 Alla uppdrag klara!
            </p>
          )}
        </div>
      </div>

      {/* Badges */}
      <div className="rounded-2xl overflow-hidden" style={{ border: "1.5px solid #e8e4d9" }}>
        <button
          className="w-full p-4 flex items-center justify-between"
          style={{ background: "white", cursor: "pointer" }}
          onClick={() => setShowBadges(!showBadges)}
        >
          <div className="flex items-center gap-2">
            <Trophy size={16} color="#d4a843" />
            <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, color: "#1a2e1a", fontSize: "0.9rem" }}>
              Märken ({badges.filter(b => b.unlocked).length}/{badges.length})
            </span>
          </div>
          {showBadges ? <ChevronUp size={16} color="#6b7a6b" /> : <ChevronDown size={16} color="#6b7a6b" />}
        </button>
        <AnimatePresence>
          {showBadges && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 grid grid-cols-4 gap-2" style={{ background: "white" }}>
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className="flex flex-col items-center gap-1"
                    title={badge.name}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                      style={{
                        background: badge.unlocked ? "linear-gradient(135deg, #ffd700, #ffaa00)" : "#e8e4d9",
                        boxShadow: badge.unlocked ? "0 2px 8px rgba(212,168,67,0.4)" : "none",
                        filter: badge.unlocked ? "none" : "grayscale(1)",
                        opacity: badge.unlocked ? 1 : 0.4,
                      }}
                    >
                      {badge.emoji}
                    </div>
                    <span style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.6rem", fontWeight: 700, color: badge.unlocked ? "#1a2e1a" : "#aaa", textAlign: "center" }}>
                      {badge.name}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Completed quests */}
      {quests.filter(q => q.completed).length > 0 && (
        <div className="rounded-2xl p-4" style={{ background: "#e8f5ee", border: "1.5px solid #c8e8d0" }}>
          <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, color: "#006b3f", fontSize: "0.85rem", marginBottom: "0.5rem" }}>
            ✅ Slutförda uppdrag
          </p>
          <div className="space-y-1.5">
            {quests.filter(q => q.completed).map((quest) => (
              <div key={quest.id} className="flex items-center gap-2">
                <span style={{ fontSize: "0.9rem" }}>{quest.emoji}</span>
                <span style={{ fontFamily: "Nunito Sans, sans-serif", fontSize: "0.78rem", color: "#4a7a4a", textDecoration: "line-through" }}>
                  {quest.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
