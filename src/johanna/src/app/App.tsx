import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { IslandMap } from "./components/IslandMap";
import { FeatureModal } from "./components/FeatureModal";
import { QuestPanel } from "./components/QuestPanel";
import { MapPin, Menu, X, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import { FavoritesPanel } from "./components/FavoritesPanel";
import { OrderTracker, type Order } from "./components/OrderTracker";

// Martin & Servera brand color system
const MS = {
  green: "#006b3f",
  greenLight: "#4a9060",
  greenPale: "#e8f5ee",
  gold: "#d4a843",
  cream: "#f5f2eb",
  dark: "#1a2e1a",
  muted: "#6b7a6b",
};

const FEATURES = [
  {
    id: "ecommerce",
    name: "Butiken",
    emoji: "🛒",
    tagline: "Din smarta beställningscentral",
    description:
      "Beställ allt du behöver med bara några klick. Smarta favoriter, återkommande beställningar och rekommendationer baserade på din meny — allt finns på ett ställe.",
    color: "#4a9060",
    shadowColor: "#2d6040",
    xpReward: 150,
    x: 350,
    y: 240,
    unlocked: true,
    completed: false,
    steps: [
      { title: "Utforska sortimentet", description: "Bläddra bland 15 000+ produkter från ledande leverantörer" },
      { title: "Skapa din favoratlista", description: "Spara dina vanligaste produkter för snabbare beställning" },
      { title: "Lägg din första beställning", description: "Välj leveransdag och bekräfta — klart på under 2 minuter" },
    ],
  },
  {
    id: "app",
    name: "Appen",
    emoji: "📱",
    tagline: "Köksmästarens digitala assistent",
    description:
      "Ta med hela Martin & Servera i fickan. Beställ när inspirationen slår till, spåra leveranser i realtid och få notiser när varor är på väg.",
    color: "#5a7db8",
    shadowColor: "#3a5a90",
    xpReward: 100,
    x: 200,
    y: 290,
    unlocked: true,
    completed: false,
    steps: [
      { title: "Ladda ner appen", description: "Finns i App Store och Google Play — sök Martin & Servera" },
      { title: "Logga in med ditt konto", description: "Samma inloggning som webbshoppen — inget nytt att komma ihåg" },
      { title: "Aktivera leveransnotiser", description: "Få ett ping när bilen är 30 min bort" },
    ],
  },
  {
    id: "inventory",
    name: "Inventering",
    emoji: "📦",
    tagline: "Månatlig lagerkontroll",
    description:
      "Det är dags för månadsskifte! Gör din månatliga inventering för att hålla koll på vad du har, vad som tar slut och vad du behöver beställa.",
    color: "#d4a843",
    shadowColor: "#a07820",
    xpReward: 175,
    x: 480,
    y: 270,
    unlocked: false,
    completed: false,
    steps: [
      { title: "Öppna inventeringssystemet", description: "Gå till inventeringsverktyget för att börja räkna" },
      { title: "Registrera ditt lager", description: "Ange vilka produkter du har och i vilka mängder" },
      { title: "Slutför inventeringen", description: "Spara din inventering och jämför med föregående månad" },
    ],
  },
  {
    id: "analytics",
    name: "Analys",
    emoji: "📊",
    tagline: "Dina siffror — din styrka",
    description:
      "Förstå dina inköpsmönster, jämför kostnader över tid och hitta besparingsmöjligheter du inte visste om. Data-driven restaurangdrift gjord enkelt.",
    color: "#c06060",
    shadowColor: "#903030",
    xpReward: 125,
    x: 165,
    y: 365,
    unlocked: false,
    completed: false,
    steps: [
      { title: "Öppna din kostnadsdashboard", description: "Se en översikt av dina utgifter per kategori" },
      { title: "Jämför med föregående period", description: "Förstå trender och säsongsvariationer" },
      { title: "Exportera en rapport", description: "Dela din inköpshistorik med ekonomiansvarig" },
    ],
  },
  {
    id: "delivery",
    name: "Leveranser",
    emoji: "🚚",
    tagline: "Alltid i tid, alltid rätt",
    description:
      "Spåra dina leveranser i realtid, justera leveranstider och kommunicera direkt med chauffören. Aldrig mer vänta i onödan.",
    color: "#7ab8a0",
    shadowColor: "#4a8870",
    xpReward: 100,
    x: 530,
    y: 340,
    unlocked: false,
    completed: false,
    steps: [
      { title: "Öppna leveransspårning", description: "Se var din beställning befinner sig just nu" },
      { title: "Ange leveransinstruktioner", description: "Berätta för chauffören om bakingång, portkod etc." },
      { title: "Bekräfta mottagning digitalt", description: "Signera leveransen direkt i appen" },
    ],
  },
  {
    id: "account",
    name: "Mitt konto",
    emoji: "⭐",
    tagline: "Din digitala restaurangprofil",
    description:
      "Hantera dina fakturor, avtal och kontaktuppgifter. Kontakta din personliga kundansvarige och se alla dina förmåner och erbjudanden.",
    color: "#9b7ab0",
    shadowColor: "#6b4a80",
    xpReward: 75,
    x: 340,
    y: 175,
    unlocked: true,
    completed: false,
    steps: [
      { title: "Komplettera din profil", description: "Lägg till restauranginformation och kontaktuppgifter" },
      { title: "Koppla dina betalsätt", description: "Faktura, kort eller autogiro — välj vad som passar dig" },
      { title: "Hitta din kundansvarige", description: "Din personliga kontakt på Martin & Servera" },
    ],
  },
];

const INITIAL_QUESTS = [
  { id: "q1", title: "Första beställningen", description: "Utforska Butiken och lär dig beställa", emoji: "🛒", xp: 50, completed: false },
  { id: "q2", title: "Digital pionjär", description: "Ladda ner och aktivera appen", emoji: "📱", xp: 40, completed: false },
  { id: "q3", title: "Inventeringsexpert", description: "Genomför din första inventering", emoji: "📦", xp: 60, completed: false },
  { id: "q4", title: "Profilhjälte", description: "Fyll i din restaurangprofil", emoji: "⭐", xp: 30, completed: false },
  { id: "q5", title: "Ö-utforskare", description: "Besök alla byggnader på ön", emoji: "🏝️", xp: 100, completed: false },
];

const ALL_BADGES = [
  { id: "b1", name: "Välkommen", emoji: "🎉", unlocked: true },
  { id: "b2", name: "Beställare", emoji: "🛒", unlocked: false },
  { id: "b3", name: "App-proffs", emoji: "📱", unlocked: false },
  { id: "b4", name: "Inventerare", emoji: "📦", unlocked: false },
  { id: "b5", name: "Analytiker", emoji: "📊", unlocked: false },
  { id: "b6", name: "Spårare", emoji: "🚚", unlocked: false },
  { id: "b7", name: "Stjärnan", emoji: "⭐", unlocked: false },
  { id: "b8", name: "ÖMästare", emoji: "🏆", unlocked: false },
];

function XpToast({ xp, onDone }: { xp: number; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-3 rounded-2xl shadow-2xl"
      style={{
        background: "linear-gradient(135deg, #006b3f, #4a9060)",
        color: "white",
        fontFamily: "Nunito, sans-serif",
        fontWeight: 800,
        fontSize: "1.1rem",
      }}
      initial={{ y: 80, opacity: 0, scale: 0.8 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: -20, opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", damping: 20 }}
    >
      <Sparkles size={20} color="#ffe66d" />
      +{xp} XP intjänat! 🎉
    </motion.div>
  );
}

export default function App() {
  const [onboarded, setOnboarded] = useState(false);
  const [userName, setUserName] = useState("Kock");
  const [userRole, setUserRole] = useState("");
  const [buildings, setBuildings] = useState(FEATURES);
  const [selectedFeature, setSelectedFeature] = useState<typeof FEATURES[0] | null>(null);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [xp, setXp] = useState(50);
  const [level, setLevel] = useState(1);
  const [streak] = useState(3);
  const [quests, setQuests] = useState(INITIAL_QUESTS);
  const [badges, setBadges] = useState(ALL_BADGES);
  const [xpToast, setXpToast] = useState<number | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [savedFavorites, setSavedFavorites] = useState<Record<string, number>>({});
  const [favPanelOpen, setFavPanelOpen] = useState(false);
  const [openProductListOnModal, setOpenProductListOnModal] = useState(false);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [orderTrackerOpen, setOrderTrackerOpen] = useState(false);
  const [shouldOpenAnalyticsAfterOrder, setShouldOpenAnalyticsAfterOrder] = useState(false);
  const [showAfterOrderMessage, setShowAfterOrderMessage] = useState(false);
  const [showInventoryReminder, setShowInventoryReminder] = useState(false);

  const maxXp = level * 300;

  function handleWelcomeComplete(name: string, role: string) {
    setUserName(name);
    setUserRole(role);
    setOnboarded(true);
  }

  const handleBuildingClick = useCallback((building: typeof FEATURES[0]) => {
    setSelectedFeature(building);
  }, []);

  function handleFeatureComplete(featureId: string, xpReward: number) {
    if (completedIds.has(featureId)) return;

    const newCompleted = new Set([...completedIds, featureId]);
    setCompletedIds(newCompleted);

    // Update buildings
    setBuildings(prev =>
      prev.map(b => {
        if (b.id === featureId) return { ...b, completed: true };
        // Unlock next buildings
        if (featureId === "ecommerce" && (b.id === "analytics" || b.id === "delivery")) {
          return { ...b, unlocked: true };
        }
        // Unlock Inventering after completing both Butiken and Analys
        if ((featureId === "ecommerce" || featureId === "analytics") && b.id === "inventory") {
          const hasEcommerce = newCompleted.has("ecommerce");
          const hasAnalytics = newCompleted.has("analytics");
          if (hasEcommerce && hasAnalytics) {
            // Show inventory reminder when it unlocks
            setShowInventoryReminder(true);
            return { ...b, unlocked: true };
          }
        }
        return b;
      })
    );

    // Add XP
    const newXp = xp + xpReward;
    setXp(newXp);
    setXpToast(xpReward);

    // Level up
    if (newXp >= maxXp) {
      setLevel(l => l + 1);
      setXp(newXp - maxXp);
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ["#006b3f", "#d4a843", "#4a9060", "#ffffff"] });
    } else {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 }, colors: ["#d4a843", "#006b3f", "#ffffff"] });
    }

    // Update quests
    const questMap: Record<string, string> = {
      ecommerce: "q1", app: "q2", inventory: "q3", account: "q4",
    };
    if (questMap[featureId]) {
      setQuests(prev => prev.map(q => q.id === questMap[featureId] ? { ...q, completed: true } : q));
    }

    // Check all explored
    if (newCompleted.size === FEATURES.length) {
      setQuests(prev => prev.map(q => q.id === "q5" ? { ...q, completed: true } : q));
    }

    // Update badges
    const badgeMap: Record<string, string> = {
      ecommerce: "b2", app: "b3", inventory: "b4",
      analytics: "b5", delivery: "b6", account: "b7",
    };
    if (badgeMap[featureId]) {
      setBadges(prev => prev.map(b => b.id === badgeMap[featureId] ? { ...b, unlocked: true } : b));
    }
    if (newCompleted.size === FEATURES.length) {
      setBadges(prev => prev.map(b => b.id === "b8" ? { ...b, unlocked: true } : b));
    }
  }

  function handlePlaceOrder() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toLocaleDateString("sv-SE", { weekday: "long", day: "numeric", month: "long" });
    const order: Order = {
      id: Math.random().toString(36).slice(2, 8).toUpperCase(),
      items: { ...savedFavorites },
      placedAt: new Date(),
      deliveryDate: dateStr.charAt(0).toUpperCase() + dateStr.slice(1),
    };
    setActiveOrder(order);
    setFavPanelOpen(false);
    setShouldOpenAnalyticsAfterOrder(true);
    setTimeout(() => setOrderTrackerOpen(true), 300);
  }

  const completedCount = completedIds.size;

  function handleOrderTrackerClose() {
    setOrderTrackerOpen(false);

    // Auto-open Analytics building after order is placed
    if (shouldOpenAnalyticsAfterOrder) {
      setShouldOpenAnalyticsAfterOrder(false);
      const analyticsBuilding = buildings.find(b => b.id === "analytics");
      if (analyticsBuilding) {
        setShowAfterOrderMessage(true);
        setTimeout(() => setSelectedFeature(analyticsBuilding), 400);
      }
    }
  }

  return (
    <div className="size-full flex flex-col overflow-hidden" style={{ background: MS.cream, fontFamily: "Nunito Sans, sans-serif" }}>
      {/* MARKER-MAKE-KIT-INVOKED */}

      {/* Welcome overlay */}
      <AnimatePresence>
        {!onboarded && <WelcomeScreen onComplete={handleWelcomeComplete} />}
      </AnimatePresence>

      {/* XP toast */}
      <AnimatePresence>
        {xpToast !== null && (
          <XpToast xp={xpToast} onDone={() => setXpToast(null)} />
        )}
      </AnimatePresence>

      {/* Header */}
      <header
        className="flex-shrink-0 flex items-center justify-between px-4 py-3 z-30"
        style={{
          background: "white",
          borderBottom: `1px solid rgba(0,107,63,0.12)`,
          boxShadow: "0 2px 8px rgba(0,107,63,0.06)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #006b3f, #4a9060)" }}
          >
            <span style={{ fontSize: "1.1rem" }}>🌿</span>
          </div>
          <div>
            <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "0.9rem", color: MS.dark, lineHeight: 1.1 }}>
              Martin & Servera
            </p>
            <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.68rem", color: MS.muted, lineHeight: 1 }}>
              Din digitala ö 🏝️
            </p>
          </div>
        </div>

        {/* Center: XP + level */}
        <div className="hidden sm:flex items-center gap-2">
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{ background: "#e8f5ee", border: "1.5px solid #c8e8d0" }}
          >
            <span style={{ fontSize: "0.9rem" }}>⭐</span>
            <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "0.82rem", color: MS.green }}>
              Nivå {level}
            </span>
            <div className="w-20 h-2 rounded-full overflow-hidden" style={{ background: "#c8e8d0" }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, #006b3f, #d4a843)" }}
                animate={{ width: `${Math.min((xp / maxXp) * 100, 100)}%` }}
              />
            </div>
            <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "0.72rem", color: MS.muted }}>
              {xp}/{maxXp}
            </span>
          </div>
        </div>

        {/* Right: map indicator + menu */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full" style={{ background: "#f5f2eb" }}>
            <MapPin size={13} color={MS.green} />
            <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "0.78rem", color: MS.dark }}>
              {completedCount}/{FEATURES.length} klara
            </span>
          </div>
          <button
            className="sm:hidden w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "#e8f5ee" }}
            onClick={() => setPanelOpen(v => !v)}
          >
            {panelOpen ? <X size={18} color={MS.green} /> : <Menu size={18} color={MS.green} />}
          </button>
        </div>
      </header>

      {/* Main layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Island map */}
        <div className="flex-1 p-3 sm:p-4 overflow-hidden">
          {/* Instruction banner */}
          <AnimatePresence>
            {onboarded && completedCount === 0 && (
              <motion.div
                className="mb-3 px-4 py-2.5 rounded-2xl flex items-center gap-3"
                style={{ background: "linear-gradient(135deg, #006b3f, #4a9060)", boxShadow: "0 4px 12px rgba(0,107,63,0.25)" }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.5 }}
              >
                <motion.span
                  style={{ fontSize: "1.3rem" }}
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  👆
                </motion.span>
                <div>
                  <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, color: "white", fontSize: "0.9rem" }}>
                    Hej {userName}! Klicka på en byggnad för att börja utforska din ö
                  </p>
                  <p style={{ fontFamily: "Nunito Sans, sans-serif", color: "rgba(255,255,255,0.8)", fontSize: "0.78rem" }}>
                    Tjäna XP och lås upp nya funktioner — precis som ett äventyrsspel!
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Inventory reminder banner */}
          <AnimatePresence>
            {showInventoryReminder && (
              <motion.div
                className="mb-3 px-4 py-3 rounded-2xl flex items-center gap-3"
                style={{ background: "linear-gradient(135deg, #d4a843, #a07820)", boxShadow: "0 4px 12px rgba(212,168,67,0.35)" }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <motion.span
                  style={{ fontSize: "1.5rem" }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                >
                  📦
                </motion.span>
                <div className="flex-1">
                  <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, color: "white", fontSize: "0.9rem" }}>
                    Dags för månadsskifte!
                  </p>
                  <p style={{ fontFamily: "Nunito Sans, sans-serif", color: "rgba(255,255,255,0.85)", fontSize: "0.78rem" }}>
                    Nu när du har handlat och kontrollerat din statistik är det dags att göra din månatliga inventering
                  </p>
                </div>
                <button
                  className="px-3 py-1.5 rounded-full flex-shrink-0"
                  style={{ background: "white", color: MS.dark, fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "0.75rem" }}
                  onClick={() => {
                    setShowInventoryReminder(false);
                    const inventoryBuilding = buildings.find(b => b.id === "inventory");
                    if (inventoryBuilding) {
                      setSelectedFeature(inventoryBuilding);
                    }
                  }}
                >
                  Gå dit
                </button>
                <button
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(255,255,255,0.2)" }}
                  onClick={() => setShowInventoryReminder(false)}
                >
                  <X size={14} color="white" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* The island — wrapped in CSS 3D perspective for depth */}
          <motion.div
            className="w-full rounded-3xl overflow-hidden"
            style={{
              height: "calc(100% - 4rem)",
              boxShadow: "0 16px 48px rgba(0,107,63,0.2), 0 4px 12px rgba(0,0,0,0.1)",
              border: "2px solid rgba(0,107,63,0.18)",
              perspective: "900px",
              perspectiveOrigin: "50% 30%",
            }}
            initial={{ opacity: 0, scale: 0.92, rotateX: 8 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ delay: 0.3, type: "spring", damping: 22 }}
          >
            {/* Inner tilt container */}
            <div
              style={{
                width: "100%",
                height: "100%",
                transform: "rotateX(6deg) scale(1.02)",
                transformOrigin: "50% 30%",
                transformStyle: "preserve-3d",
              }}
            >
            <IslandMap
              buildings={buildings.map(b => ({ ...b, completed: completedIds.has(b.id) }))}
              onBuildingClick={handleBuildingClick}
              level={level}
              xp={xp}
              maxXp={maxXp}
            />
            </div>
          </motion.div>

          {/* Quick-access feature pills — bottom */}
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {buildings.map(b => (
              <button
                key={b.id}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{
                  background: completedIds.has(b.id) ? "#e8f5ee" : b.unlocked ? "white" : "#f0ede4",
                  border: `1.5px solid ${completedIds.has(b.id) ? "#006b3f" : b.unlocked ? "#e8e4d9" : "#ddd"}`,
                  cursor: b.unlocked ? "pointer" : "not-allowed",
                  opacity: b.unlocked ? 1 : 0.5,
                }}
                onClick={() => b.unlocked && setSelectedFeature(b)}
              >
                <span style={{ fontSize: "0.85rem" }}>{b.emoji}</span>
                <span style={{
                  fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "0.75rem",
                  color: completedIds.has(b.id) ? MS.green : MS.dark,
                }}>
                  {b.name}
                </span>
                {completedIds.has(b.id) && <span style={{ fontSize: "0.65rem" }}>✓</span>}
                {!b.unlocked && <span style={{ fontSize: "0.65rem" }}>🔒</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Right sidebar — quest panel */}
        {/* Desktop: always visible */}
        <div
          className="hidden sm:flex flex-col w-72 flex-shrink-0 p-3 overflow-hidden"
          style={{ borderLeft: "1px solid rgba(0,107,63,0.1)" }}
        >
          <QuestPanel
            userName={userName}
            level={level}
            xp={xp}
            maxXp={maxXp}
            streak={streak}
            quests={quests}
            badges={badges}
            completedCount={completedCount}
            totalCount={FEATURES.length}
          />
        </div>

        {/* Mobile: slide-in panel */}
        <AnimatePresence>
          {panelOpen && (
            <motion.div
              className="sm:hidden absolute inset-y-0 right-0 w-72 z-20 p-3 overflow-y-auto"
              style={{ background: MS.cream, borderLeft: "1px solid rgba(0,107,63,0.15)", boxShadow: "-4px 0 20px rgba(0,0,0,0.1)" }}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <QuestPanel
                userName={userName}
                level={level}
                xp={xp}
                maxXp={maxXp}
                streak={streak}
                quests={quests}
                badges={badges}
                completedCount={completedCount}
                totalCount={FEATURES.length}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Feature modal */}
      <AnimatePresence>
        {selectedFeature && (
          <FeatureModal
            feature={selectedFeature}
            onClose={() => {
              setSelectedFeature(null);
              setOpenProductListOnModal(false);
              setShowAfterOrderMessage(false);
            }}
            onComplete={handleFeatureComplete}
            completed={completedIds.has(selectedFeature.id)}
            onSaveFavorites={setSavedFavorites}
            savedFavorites={savedFavorites}
            openProductList={openProductListOnModal}
            showAfterOrderMessage={showAfterOrderMessage}
          />
        )}
      </AnimatePresence>

      {/* Active order FAB */}
      <AnimatePresence>
        {onboarded && activeOrder && (
          <motion.button
            className="fixed bottom-24 right-6 z-[50] flex items-center gap-2 px-4 py-2.5 rounded-full shadow-xl"
            style={{
              background: `linear-gradient(135deg, #5a7db8, #3a5a90)`,
              color: "white",
              fontFamily: "Nunito, sans-serif",
              fontWeight: 800,
              fontSize: "0.85rem",
              boxShadow: "0 6px 22px rgba(58,90,144,0.45)",
            }}
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 18, stiffness: 280 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOrderTrackerOpen(true)}
          >
            <motion.span
              style={{ fontSize: "1rem" }}
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            >
              🚚
            </motion.span>
            <span>Spåra order #{activeOrder.id}</span>
            <motion.div
              className="w-2 h-2 rounded-full"
              style={{ background: "#ffe66d" }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Favorites FAB */}
      <AnimatePresence>
        {onboarded && (
          <motion.button
            className="fixed bottom-6 right-6 z-[50] flex items-center gap-2.5 px-5 py-3.5 rounded-full shadow-2xl"
            style={{
              background: Object.keys(savedFavorites).length > 0
                ? `linear-gradient(135deg, ${MS.green}, ${MS.greenLight})`
                : "white",
              color: Object.keys(savedFavorites).length > 0 ? "white" : MS.muted,
              border: Object.keys(savedFavorites).length > 0 ? "none" : `2px solid #e8e4d9`,
              fontFamily: "Nunito, sans-serif",
              fontWeight: 800,
              fontSize: "0.95rem",
              boxShadow: Object.keys(savedFavorites).length > 0
                ? "0 8px 28px rgba(0,107,63,0.4)"
                : "0 4px 16px rgba(0,0,0,0.12)",
            }}
            initial={{ scale: 0, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 18, stiffness: 280, delay: 0.3 }}
            whileHover={{ scale: 1.06, boxShadow: "0 12px 36px rgba(0,107,63,0.45)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFavPanelOpen(true)}
          >
            <motion.span
              style={{ fontSize: "1.2rem" }}
              animate={Object.keys(savedFavorites).length > 0 ? { scale: [1, 1.15, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              ⭐
            </motion.span>
            <span>Favoritlista</span>
            {Object.keys(savedFavorites).length > 0 && (
              <motion.span
                className="flex items-center justify-center w-6 h-6 rounded-full"
                style={{ background: MS.gold, color: MS.dark, fontSize: "0.75rem", fontWeight: 900 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 14 }}
              >
                {Object.keys(savedFavorites).length}
              </motion.span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Favorites panel */}
      <FavoritesPanel
        open={favPanelOpen}
        onClose={() => setFavPanelOpen(false)}
        favorites={savedFavorites}
        onEdit={() => {
          setFavPanelOpen(false);
          const butiken = buildings.find(b => b.id === "ecommerce");
          if (butiken) {
            setOpenProductListOnModal(true);
            setSelectedFeature(butiken);
          }
        }}
        onOrder={handlePlaceOrder}
      />

      {/* Order tracker */}
      {activeOrder && (
        <OrderTracker
          order={activeOrder}
          open={orderTrackerOpen}
          onClose={handleOrderTrackerClose}
        />
      )}

      {/* Completion celebration */}
      <AnimatePresence>
        {onboarded && completedCount === FEATURES.length && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-center px-8 py-10 rounded-3xl shadow-2xl pointer-events-auto"
              style={{ background: "linear-gradient(135deg, #006b3f, #4a9060)", maxWidth: 420 }}
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 15 }}
            >
              <div style={{ fontSize: "4rem", marginBottom: "0.5rem" }}>🏆</div>
              <h2 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, color: "white", fontSize: "1.8rem", marginBottom: "0.5rem" }}>
                Grattis, {userName}!
              </h2>
              <p style={{ fontFamily: "Nunito Sans, sans-serif", color: "rgba(255,255,255,0.85)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                Du har utforskat hela Martin & Servera-ön och låst upp alla digitala tjänster. Du är nu redo att ta din restaurang till nästa nivå!
              </p>
              <button
                className="px-6 py-3 rounded-2xl"
                style={{ background: "#d4a843", color: "white", fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "1rem" }}
                onClick={() => {
                  confetti({ particleCount: 200, spread: 100, origin: { y: 0.5 }, colors: ["#006b3f", "#d4a843", "#ffffff", "#4a9060"] });
                }}
              >
                🎉 Fira din framgång!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
