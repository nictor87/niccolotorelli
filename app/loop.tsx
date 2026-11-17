"use client";

import { useMountEffect } from "@/hooks/useMountEffect";
import { setInfiniteScroll } from "./smooth-scroll";

function snapCloneToPixel() {
  const clone = document.querySelector<HTMLElement>(".loop-clone");
  if (!clone) return;
  clone.style.marginTop = "0px";
  const top = clone.getBoundingClientRect().top + window.scrollY;
  clone.style.marginTop = `${Math.ceil(top) - top}px`;
}

export function Loop() {
  useMountEffect(() => {
    snapCloneToPixel();
    setInfiniteScroll(true);
    const observer = new ResizeObserver(() => {
      snapCloneToPixel();
      setInfiniteScroll(true);
    });
    const modules = document.querySelector(".modules");
    if (modules) observer.observe(modules);
    return () => {
      observer.disconnect();
      setInfiniteScroll(false);
    };
  });

  return <span data-loop hidden />;
}
