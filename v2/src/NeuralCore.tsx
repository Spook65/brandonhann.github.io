import { memo } from "react";
import type { DestinationId } from "./data/domain";
import operatorConcept from "./assets/operator-core-concept.jpg";
import styles from "./NeuralCore.module.css";

const routes: Record<DestinationId, string> = {
  quest: "M716 650 C857 574 969 457 1125 292 S1293 177 1415 126",
  archives: "M716 650 C583 570 474 429 298 270 S158 177 30 114",
  arsenal: "M716 650 C561 671 381 638 154 530 L-20 505",
  chronicles: "M716 650 C889 686 1084 642 1274 539 L1460 497",
  profile: "M716 650 C627 482 589 306 654 116 L679 -20",
  signal: "M716 650 C803 465 844 277 787 106 L773 -20",
};

/** Illustrated operator backdrop with real SVG route highlights above it. */
export const NeuralCore = memo(function NeuralCore({
  className,
  selected,
}: {
  className?: string;
  selected?: DestinationId;
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
        {Object.entries(routes).map(([route, d]) => {
          const active = selected === route;
          return (
            <g key={route} data-route={route} data-active={active} className={styles.route}>
              <path d={d} stroke="#09090a" strokeOpacity={active ? ".76" : ".46"} strokeWidth={active ? "15" : "10"} />
              <path d={d} stroke={active ? "#e5a95d" : "#82b9b7"} strokeOpacity={active ? ".9" : ".28"} strokeWidth={active ? "4.5" : "2.3"} />
            </g>
          );
        })}
      </g>
    </svg>
  );
});
