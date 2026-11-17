"use client";

import Lenis from "lenis";
import { useMountEffect } from "@/hooks/useMountEffect";

let instance: Lenis | null = null;

export function setInfiniteScroll(enabled: boolean) {
  if (!instance) return;
  const loopable = window.matchMedia(
    "(hover: hover) and (pointer: fine) and (orientation: landscape)",
  ).matches;
  const next = enabled && loopable;
  if (instance.options.infinite === next) return;
  instance.options.infinite = next;
  instance.resize();
}

export function SmoothScroll() {
  useMountEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    instance = new Lenis({ autoRaf: true, lerp: 0.09, anchors: true });
    if (document.querySelector("[data-loop]")) setInfiniteScroll(true);
    return () => {
      instance?.destroy();
      instance = null;
    };
  });

  return null;
}
