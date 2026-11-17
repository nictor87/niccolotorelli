"use client";

import Image from "next/image";
import { useState } from "react";
import { isScrolling } from "./smooth-scroll";
import type { Page } from "./work";

const CUTS = [0, 6, 9, 17, 21, 30, 34, 41, 52, 55, 63, 70, 74, 83, 88, 94, 100];
const SHIFTS = [-6, 4, -3, 8, -5, 3, -8, 5, -2, 7, -4, 3, -7, 4, -3, 6];

type ScanSheetProps = {
  image: Page;
  sizes: string;
  eager: boolean;
};

function canScan() {
  return (
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function ScanSheet({ image, sizes, eager }: ScanSheetProps) {
  const [pass, setPass] = useState(0);
  const last = SHIFTS.length - 1;

  const [armed, setArmed] = useState(true);

  const scan = (event: React.PointerEvent) => {
    if (
      !armed ||
      isScrolling() ||
      (event.movementX === 0 && event.movementY === 0)
    )
      return;
    setArmed(false);
    if (canScan()) setPass((count) => count + 1);
  };

  const settle = (index: number) => {
    if (index === last) setPass(0);
  };

  const picture = (loading: "eager" | "lazy") => (
    <Image
      src={image.src}
      width={image.w}
      height={image.h}
      sizes={sizes}
      alt=""
      loading={loading}
      draggable={false}
    />
  );

  return (
    <span
      className="card-sheet"
      onPointerMove={scan}
      onPointerLeave={() => setArmed(true)}
    >
      {picture(eager ? "eager" : "lazy")}
      {pass > 0 && (
        <span key={pass} className="scan" aria-hidden="true">
          {SHIFTS.map((shift, index) => (
            <span
              key={index}
              className="scan-band"
              style={
                {
                  "--left": `${CUTS[index]}%`,
                  "--right": `${100 - CUTS[index + 1]}%`,
                  "--shift": `${shift}%`,
                  "--band": (index * 7) % SHIFTS.length,
                } as React.CSSProperties
              }
              onAnimationEnd={() => settle(index)}
            >
              {picture("eager")}
            </span>
          ))}
        </span>
      )}
    </span>
  );
}
