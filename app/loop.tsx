"use client";

import { useMountEffect } from "@/hooks/useMountEffect";
import { setInfiniteScroll } from "./smooth-scroll";

function snapCloneToPixel(clone: HTMLElement) {
  const current = parseFloat(clone.style.marginTop) || 0;
  const top = clone.getBoundingClientRect().top + window.scrollY - current;
  const offset = Math.ceil(top) - top;
  if (Math.abs(offset - current) > 0.01) clone.style.marginTop = `${offset}px`;
}

export function Loop() {
  useMountEffect(() => {
    const clone = document.querySelector<HTMLElement>(".loop-clone");
    const modules = document.querySelector(".modules");
    if (!clone || !modules) return;

    let frame = 0;
    const sync = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        snapCloneToPixel(clone);
        setInfiniteScroll(true);
      });
    };

    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(modules);
    window.addEventListener("orientationchange", sync);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("orientationchange", sync);
      setInfiniteScroll(false);
    };
  });

  return <span data-loop hidden />;
}
