"use client";

import React from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

export function StarsBackground() {
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();

  // Multi-layer parallax offsets responding to scroll
  const yStars1 = useTransform(scrollY, [0, 3000], [0, -300]);
  const yStars2 = useTransform(scrollY, [0, 3000], [0, -600]);
  const yGlow1 = useTransform(scrollY, [0, 2000], [0, -160]);
  const yGlow2 = useTransform(scrollY, [0, 2000], [0, 200]);

  return (
    <div className="stars-container pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* Ambient Arcane Parallax Nebula Glows */}
      <motion.div
        style={{ y: shouldReduceMotion ? 0 : yGlow1 }}
        className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full bg-gold/5 blur-[130px] pointer-events-none will-change-transform"
      />
      <motion.div
        style={{ y: shouldReduceMotion ? 0 : yGlow2 }}
        className="absolute top-[35%] -right-32 w-[580px] h-[580px] rounded-full bg-crimson/5 blur-[150px] pointer-events-none will-change-transform"
      />

      {/* Layer 1: Stars with gentle parallax drift */}
      <motion.div
        style={{ y: shouldReduceMotion ? 0 : yStars1 }}
        className="stars-layer-1 will-change-transform"
      />

      {/* Layer 2: Deeper layer stars with faster parallax drift */}
      <motion.div
        style={{ y: shouldReduceMotion ? 0 : yStars2 }}
        className="stars-layer-2 will-change-transform"
      />
    </div>
  );
}
