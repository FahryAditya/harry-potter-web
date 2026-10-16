import gsap from "gsap";

/**
 * Trigger an arcane spell burst explosion of golden magic particles
 * using GSAP physics animation.
 */
export function triggerSpellBurst(x: number, y: number, count = 18) {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const colors = ["#E5B869", "#FFFFFF", "#FFD700", "#9E2A2B", "#F5F5F7"];

  for (let i = 0; i < count; i++) {
    const particle = document.createElement("div");
    document.body.appendChild(particle);

    const size = 3 + Math.random() * 4.5;
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
    const distance = 40 + Math.random() * 70;
    const destX = x + Math.cos(angle) * distance;
    const destY = y + Math.sin(angle) * distance;

    gsap.set(particle, {
      x,
      y,
      width: size,
      height: size,
      borderRadius: Math.random() > 0.4 ? "50%" : "2px",
      backgroundColor: colors[Math.floor(Math.random() * colors.length)],
      position: "fixed",
      top: 0,
      left: 0,
      pointerEvents: "none",
      zIndex: 99999,
      boxShadow: "0 0 12px rgba(229, 184, 105, 0.9)",
      opacity: 1,
    });

    gsap.to(particle, {
      x: destX,
      y: destY + 15, // Subtle downward gravity pull
      opacity: 0,
      scale: 0.2,
      rotation: (Math.random() - 0.5) * 360,
      duration: 0.65 + Math.random() * 0.35,
      ease: "power3.out",
      onComplete: () => {
        particle.remove();
      },
    });
  }
}
