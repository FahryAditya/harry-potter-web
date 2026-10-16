"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export function WandCursor() {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const sparksContainerRef = useRef<HTMLDivElement>(null);
  const [isPointerDevice, setIsPointerDevice] = useState(false);

  useEffect(() => {
    // Only enable on non-touch devices with fine pointers
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setIsPointerDevice(true);

    const dot = cursorDotRef.current;
    const ring = cursorRingRef.current;
    const sparksContainer = sparksContainerRef.current;
    if (!dot || !ring) return;

    // GSAP quickTo setters for 120fps hardware-accelerated tracking
    const setDotX = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power3" });
    const setDotY = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power3" });
    const setRingX = gsap.quickTo(ring, "x", { duration: 0.25, ease: "power2.out" });
    const setRingY = gsap.quickTo(ring, "y", { duration: 0.25, ease: "power2.out" });

    let lastSparkTime = 0;

    const handleMouseMove = (e: MouseEvent) => {
      setDotX(e.clientX);
      setDotY(e.clientY);
      setRingX(e.clientX);
      setRingY(e.clientY);

      // Create subtle spark trail when moving wand
      const now = Date.now();
      if (now - lastSparkTime > 75 && sparksContainer) {
        lastSparkTime = now;
        createSpark(e.clientX, e.clientY, sparksContainer);
      }
    };

    const handleMouseDown = () => {
      gsap.to(ring, { scale: 0.7, borderColor: "#FFFFFF", duration: 0.15 });
      gsap.to(dot, { scale: 1.6, backgroundColor: "#FFFFFF", duration: 0.15 });
    };

    const handleMouseUp = () => {
      gsap.to(ring, { scale: 1, borderColor: "#E5B869", duration: 0.2 });
      gsap.to(dot, { scale: 1, backgroundColor: "#E5B869", duration: 0.2 });
    };

    // Detect hover over interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const isInteractive = target.closest("a, button, input, select, [role='button'], .cursor-pointer");
      if (isInteractive) {
        gsap.to(ring, {
          scale: 2.2,
          backgroundColor: "rgba(229, 184, 105, 0.12)",
          borderColor: "#E5B869",
          duration: 0.25,
        });
        gsap.to(dot, { scale: 0.4, opacity: 0.7, duration: 0.2 });
      } else {
        gsap.to(ring, {
          scale: 1,
          backgroundColor: "transparent",
          borderColor: "rgba(229, 184, 105, 0.5)",
          duration: 0.25,
        });
        gsap.to(dot, { scale: 1, opacity: 1, duration: 0.2 });
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseover", handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  const createSpark = (x: number, y: number, container: HTMLElement) => {
    const spark = document.createElement("div");
    spark.className = "wand-spark";
    container.appendChild(spark);

    const angle = Math.random() * Math.PI * 2;
    const distance = 8 + Math.random() * 14;
    const destX = x + Math.cos(angle) * distance;
    const destY = y + Math.sin(angle) * distance;
    const size = 2 + Math.random() * 2.5;

    gsap.set(spark, {
      x,
      y,
      width: size,
      height: size,
      opacity: 0.9,
      backgroundColor: Math.random() > 0.4 ? "#E5B869" : "#FFF8DC",
      borderRadius: "50%",
      position: "fixed",
      top: 0,
      left: 0,
      pointerEvents: "none",
      zIndex: 9999,
      boxShadow: "0 0 6px #E5B869",
    });

    gsap.to(spark, {
      x: destX,
      y: destY,
      opacity: 0,
      scale: 0.2,
      duration: 0.6 + Math.random() * 0.3,
      ease: "power2.out",
      onComplete: () => {
        spark.remove();
      },
    });
  };

  if (!isPointerDevice) return null;

  return (
    <>
      <div ref={sparksContainerRef} aria-hidden="true" />
      {/* Outer Wand Arcane Ring */}
      <div
        ref={cursorRingRef}
        className="fixed top-0 left-0 w-8 h-8 -ml-4 -mt-4 rounded-full border border-gold/50 pointer-events-none z-[9999] will-change-transform transition-[border-color,background-color]"
        aria-hidden="true"
      />
      {/* Center Golden Wand Tip */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 -ml-[3px] -mt-[3px] rounded-full bg-gold shadow-[0_0_8px_#E5B869] pointer-events-none z-[9999] will-change-transform"
        aria-hidden="true"
      />
    </>
  );
}
