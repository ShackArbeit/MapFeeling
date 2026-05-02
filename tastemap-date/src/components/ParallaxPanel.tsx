"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export function ParallaxPanel({
  children,
  className,
  direction = "up",
  strength = 44,
}: {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "down";
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let frame = 0;

    const updatePosition = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const elementCenter = rect.top + rect.height / 2;
      const distance = (elementCenter - viewportCenter) / window.innerHeight;
      const clamped = Math.max(-1, Math.min(1, distance));
      const factor = direction === "up" ? -1 : 1;
      const offset = clamped * strength * factor;
      element.style.transform = `translate3d(0, ${offset}px, 0)`;
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updatePosition);
    };

    updatePosition();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [direction, strength]);

  return (
    <div
      ref={ref}
      className={cn("will-change-transform transition-transform duration-300 ease-out", className)}
    >
      {children}
    </div>
  );
}
