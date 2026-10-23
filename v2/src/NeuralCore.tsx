import { memo } from "react";
import type { DestinationId } from "./data/domain";
import operatorConcept from "./assets/operator-core-concept.jpg";
import styles from "./NeuralCore.module.css";

const routes: Record<DestinationId, { path: string; end: [number, number] }> = {
  quest: { path: "M716 650 C784 621 778 518 846 461", end: [846, 461] },
  archives: { path: "M716 650 C633 602 551 486 438 461", end: [438, 461] },
  arsenal: { path: "M716 650 C590 685 492 597 390 611", end: [390, 611] },
  chronicles: { path: "M716 650 C769 713 817 699 850 635", end: [850, 635] },
  profile: { path: "M716 650 C627 578 622 493 555 415", end: [555, 415] },
  signal: { path: "M716 650 C732 571 746 491 714 415", end: [714, 415] },
};

/** Illustrated operator backdrop with real SVG route highlights above it. */
export const NeuralCore = memo(function NeuralCore({
  className,
  selected,
  preview,
}: {
  className?: string;
  selected?: DestinationId | null;
  preview?: DestinationId | null;
}) {
  return (
    <svg
      className={`${styles.core} ${className ?? ""}`}
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      data-testid="neural-core-art"
    >
      <rect width="1440" height="900" fill="#10090c" />
      <image
        className={styles.backdrop}
        href={operatorConcept}
        x="0"
        y="0"
        width="1440"
        height="900"
        preserveAspectRatio="xMidYMid slice"
      />
      <g fill="none" strokeLinecap="round">
        {(Object.entries(routes) as [DestinationId, (typeof routes)[DestinationId]][]).map(([route, { path, end }]) => {
          const state = selected === route ? "selected" : preview === route ? "preview" : "inactive";
          return (
            <g key={route} data-route={route} data-state={state} data-active={state !== "inactive"} className={styles.route}>
              <path className={styles.routeAura} d={path} />
              <path className={styles.routeBed} d={path} />
              <path className={styles.routeLight} d={path} pathLength={100} />
              <ellipse className={styles.routeNode} cx={end[0]} cy={end[1]} rx="6" ry="4" />
            </g>
          );
        })}
        <circle className={styles.origin} cx="716" cy="650" r="6" />
      </g>
    </svg>
  );
});
