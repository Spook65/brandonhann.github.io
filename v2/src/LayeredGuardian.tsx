import { memo, useLayoutEffect, useRef } from "react";
import guardianSvg from "./assets/guardian-layered.svg?raw";

const artwork = { __html: guardianSvg };

type Props = {
  className: string;
  progress: number;
  alert: boolean;
};

/** The local SVG is a trusted, checked-in construction study, never user input. */
export const LayeredGuardian = memo(function LayeredGuardian({
  className,
  progress,
  alert,
}: Props) {
  const host = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const svg = host.current?.querySelector("svg");
    if (!svg) return;
    const p = Math.max(0, Math.min(1, progress || (alert ? 0.055 : 0)));
    const drop = 104 * p;
    const lowerJaw = svg.querySelector('[data-layer="lower-jaw"]');
    lowerJaw?.setAttribute(
      "transform",
      `translate(0 ${drop.toFixed(1)}) translate(0 542) scale(1 ${(1 - 0.13 * p).toFixed(3)}) translate(0 -542)`,
    );
    const linkageEnd = 542 + 63 * (1 - 0.13 * p) + drop;
    svg.querySelectorAll('[data-layer="left-rod"] line, [data-layer="right-rod"] line').forEach((line) => {
      line.setAttribute("y2", linkageEnd.toFixed(1));
    });
    svg.querySelector('[data-layer="left-hinge-pin"]')?.setAttribute(
      "transform",
      `rotate(${(-35 * p).toFixed(1)} 255 510)`,
    );
    svg.querySelector('[data-layer="right-hinge-pin"]')?.setAttribute(
      "transform",
      `rotate(${(35 * p).toFixed(1)} 645 510)`,
    );
    const cavity = svg.querySelector<SVGGElement>('[data-layer="mouth-cavity"]');
    if (cavity) cavity.style.opacity = String(0.65 + 0.35 * p);
    svg.querySelectorAll('ellipse[filter="url(#glow)"]').forEach((eye) => {
      eye.setAttribute("opacity", String(0.55 + 0.45 * p));
    });
  }, [progress, alert]);

  return <div ref={host} className={className} dangerouslySetInnerHTML={artwork} aria-hidden="true" />;
});
