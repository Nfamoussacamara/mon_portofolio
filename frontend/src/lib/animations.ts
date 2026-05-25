import type { Variants } from 'framer-motion';

// ── Viewport par défaut ──────────────────────────────────────────────
export const defaultViewport = { once: true, amount: 0.3 } as const;

// ── Easing premium (BezierDefinition = [number, number, number, number]) ─
export const premiumEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ── Fade + montée ────────────────────────────────────────────────────
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: premiumEase },
  },
};

// ── Fade + descente ───────────────────────────────────────────────────
export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: premiumEase },
  },
};

// ── Fade + depuis la gauche ───────────────────────────────────────────
export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 1.1, ease: premiumEase },
  },
};

// ── Fade + depuis la droite ───────────────────────────────────────────
export const fadeRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 1.1, ease: premiumEase },
  },
};

// ── Conteneur avec stagger enfants ───────────────────────────────────
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0,
    },
  },
};

// ── Item enfant dans un stagger ───────────────────────────────────────
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.0, ease: premiumEase },
  },
};

// ── Header de section ─────────────────────────────────────────────────
export const sectionHeader: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: premiumEase },
  },
};
