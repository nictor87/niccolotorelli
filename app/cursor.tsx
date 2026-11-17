"use client";

import { useRef } from "react";
import { useMountEffect } from "@/hooks/useMountEffect";

export function Cursor() {
  const label = useRef<HTMLSpanElement>(null);

  useMountEffect(() => {
    const element = label.current;
    if (!element || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const move = (event: PointerEvent) => {
      element.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      const owner = (event.target as Element | null)?.closest<HTMLElement>("[data-cursor]");
      const text = owner?.dataset.cursor ?? "";
      if (element.textContent !== text) element.textContent = text;
      element.dataset.visible = String(text.length > 0);
    };

    const hide = () => {
      element.dataset.visible = "false";
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("wheel", hide, { passive: true });
    window.addEventListener("scroll", hide, { passive: true });
    document.documentElement.addEventListener("pointerleave", hide);

    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("wheel", hide);
      window.removeEventListener("scroll", hide);
      document.documentElement.removeEventListener("pointerleave", hide);
    };
  });

  return <span ref={label} className="cursor-label" data-visible="false" aria-hidden="true" />;
}
