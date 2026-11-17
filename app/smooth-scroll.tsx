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

const SCROLL_IDLE_MS = 200;

export function isScrolling() {
  return document.documentElement.dataset.scrolling === "true";
}

function trackScrolling() {
  const root = document.documentElement;
  let idle = 0;
  const markScrolling = () => {
    root.dataset.scrolling = "true";
    window.clearTimeout(idle);
    idle = window.setTimeout(
      () => delete root.dataset.scrolling,
      SCROLL_IDLE_MS,
    );
  };
  const events = ["wheel", "scroll", "touchmove"] as const;
  events.forEach((name) =>
    window.addEventListener(name, markScrolling, { passive: true }),
  );
  return () => {
    window.clearTimeout(idle);
    delete root.dataset.scrolling;
    events.forEach((name) => window.removeEventListener(name, markScrolling));
  };
}

export function SmoothScroll() {
  useMountEffect(() => {
    const stopTracking = trackScrolling();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return stopTracking;
    instance = new Lenis({ autoRaf: true, lerp: 0.09, anchors: true });
    if (document.querySelector("[data-loop]")) setInfiniteScroll(true);
    return () => {
      stopTracking();
      instance?.destroy();
      instance = null;
    };
  });

  return null;
}
