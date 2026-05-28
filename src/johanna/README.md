# Martin & Servera - Gamified Onboarding

An Animal Crossing-inspired gamified onboarding experience for Martin & Servera's e-commerce platform that makes learning the platform enjoyable and drives feature adoption.

## Features

- **3D Isometric Island Map** - Interactive island with six buildings representing different platform features
- **Welcome Wizard** - Personalized onboarding flow with name and role selection
- **Feature Modals** - CSS 3D tilt effects with step-by-step tutorials
- **Quest System** - Progressive unlocking of features with XP/leveling mechanics
- **Celebration Animations** - Confetti and rewards for completing quests
- **Martin & Servera Branding** - Signature green (#006b3f) color scheme
- **Fully Responsive** - Works on desktop and mobile devices

## Tech Stack

- **React 18.3.1** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS 4** - Styling
- **Motion (Framer Motion)** - Animations and 3D transforms
- **Lucide React** - Icons
- **Canvas Confetti** - Celebration animations

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

### Building

```bash
pnpm run build
```

## Project Structure

```
src/
├── app/
│   ├── App.tsx                    # Main application component
│   └── components/
│       ├── WelcomeScreen.tsx      # Welcome wizard
│       ├── IslandMap.tsx          # 3D isometric island
│       ├── FeatureModal.tsx       # Feature detail modals
│       └── QuestPanel.tsx         # Quest & progress tracking
└── styles/
    ├── index.css                  # Global styles
    ├── theme.css                  # Theme tokens
    └── tailwind.css               # Tailwind configuration
```

## Features Overview

### Buildings on the Island

1. **Butiken (E-commerce)** 🛒 - Order management and product catalog
2. **Appen (Mobile App)** 📱 - Mobile app download and setup
3. **Lagret (Inventory)** 📦 - Intelligent inventory management
4. **Analys (Analytics)** 📊 - Cost analysis and insights
5. **Leveranser (Delivery)** 🚚 - Real-time delivery tracking
6. **Mitt Konto (Account)** ⭐ - Profile and account management

### Gamification Elements

- **XP System** - Earn experience points for completing features
- **Leveling** - Progress through levels as you explore
- **Badges** - Unlock achievement badges
- **Quests** - Complete guided quests to learn the platform
- **Streak** - Track consecutive days of engagement

## License

Private - Martin & Servera Internal Project

## Contributing

This is a hackathon project for Martin & Servera.
