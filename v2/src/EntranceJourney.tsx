import { memo } from "react";
import { NeuralCore } from "./NeuralCore";
import styles from "./EntranceJourney.module.css";

export const JOURNEY_MS = 4300;

export type JourneyPhase = "jaw" | "approach" | "tunnel" | "arrival";

export function phaseAt(ms: number): JourneyPhase {
  if (ms < 760) return "jaw";
  if (ms < 1450) return "approach";
  if (ms < 3350) return "tunnel";
  return "arrival";
}

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const ease = (value: number) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};

const ringDepths = [-260, -1040, -1820, -2600, -3380, -4160];

const folds = [
  {
    shapes: "M0 0H302Q255 103 239 216Q266 344 176 474Q176 596 105 700H0ZM1000 0H701Q749 106 785 213Q749 340 828 468Q835 595 909 700H1000ZM290 0H712Q654 55 505 82Q368 89 290 0ZM105 700Q338 584 513 625Q698 579 909 700Z",
    edge: "M302 0Q255 103 239 216Q266 344 176 474Q176 596 105 700M701 0Q749 106 785 213Q749 340 828 468Q835 595 909 700M290 0Q368 89 505 82Q654 55 712 0M105 700Q338 584 513 625Q698 579 909 700",
    vein: "M65 108Q207 161 183 272Q197 361 129 508M946 89Q825 188 843 281Q815 388 893 523M155 661Q357 602 495 646",
  },
  {
    shapes: "M0 0H337Q286 114 255 209Q274 374 183 454Q200 580 131 700H0ZM1000 0H671Q743 115 765 228Q731 331 851 455Q819 591 882 700H1000ZM329 0H674Q638 74 481 94Q374 72 329 0ZM131 700Q362 601 481 641Q693 592 882 700Z",
    edge: "M337 0Q286 114 255 209Q274 374 183 454Q200 580 131 700M671 0Q743 115 765 228Q731 331 851 455Q819 591 882 700M329 0Q374 72 481 94Q638 74 674 0M131 700Q362 601 481 641Q693 592 882 700",
    vein: "M80 127Q244 181 207 292Q226 396 147 511M910 83Q795 171 802 290Q850 401 873 505M199 647Q352 603 470 651",
  },
] as const;

const OrganicFold = memo(function OrganicFold({ index }: { index: number }) {
  const fold = folds[index % folds.length];
  const gradientId = `organic-fold-${index}`;
  return (
    <svg viewBox="0 0 1000 700" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x2=".7" y2="1">
          <stop stopColor="#4d3035" />
          <stop offset=".42" stopColor="#2a2024" />
          <stop offset="1" stopColor="#110e12" />
        </linearGradient>
      </defs>
      <path d={fold.shapes} fill={`url(#${gradientId})`} stroke="#0f0b0f" strokeWidth="18" />
      <path d={fold.edge} fill="none" stroke="#130a0f" strokeWidth="27" />
      <path d={fold.edge} fill="none" stroke="#805657" strokeWidth="5" strokeOpacity=".6" />
      <path d={fold.vein} fill="none" stroke="#0b1114" strokeWidth="19" strokeLinecap="round" />
      <path d={fold.vein} fill="none" stroke="#7aa6a1" strokeWidth="3" strokeOpacity=".7" strokeLinecap="round" />
    </svg>
  );
});

export function EntranceJourney({ elapsed }: { elapsed: number }) {
  const travel = ease((elapsed - 1280) / 2250);
  const tunnelIn = ease((elapsed - 1190) / 380);
  const tunnelOut = 1 - ease((elapsed - 3480) / 720);
  const tunnelOpacity = tunnelIn * tunnelOut;
  const coreReveal = ease((elapsed - 2920) / 1280);
  const cameraBend = Math.sin(travel * Math.PI) * 95;
  return (
    <div className={styles.journey} data-journey-phase={phaseAt(elapsed)} aria-hidden="true">
      <div
        className={styles.tunnel}
        data-testid="mouth-passage"
        style={{ opacity: tunnelOpacity, visibility: elapsed < 1160 || elapsed > 4250 ? "hidden" : "visible" }}
      >
        <div className={styles.wall} style={{ transform: `translate3d(${-cameraBend * 0.22}px, 0, 0) scale(${1 + 0.22 * travel})` }}>
          <div className={styles.wallDrift} />
        </div>
        <div className={styles.depthGimbal} data-testid="tunnel-gimbal">
          <div className={styles.depth}>
          {ringDepths.map((depth, index) => {
            const z = depth + travel * 5000;
            const x = (index - 3.5) * 22 - cameraBend;
            const y = Math.sin(index * 0.8 + travel * 2) * 20;
            const visible = z < 420 && z > -4700;
            return (
              <div
                className={styles.fold}
                data-depth={index}
                key={depth}
                style={{
                  transform: `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${z}px) rotateY(${(index - 3.5) * 1.2 - travel * 6}deg)`,
                  opacity: visible ? clamp((420 - z) / 150) : 0,
                  visibility: visible ? "visible" : "hidden",
                }}
              >
                <div className={styles.foldAmbient} style={{ animationDelay: `${-index * 0.72}s`, animationDuration: `${3.4 + index * 0.55}s` }}>
                  <OrganicFold index={index} />
                </div>
              </div>
            );
          })}
          </div>
        </div>
        <div className={styles.shadow} style={{ opacity: 0.14 + 0.18 * Math.sin(travel * Math.PI * 4) ** 2 }} />
      </div>
      <div
        className={styles.coreArrival}
        data-testid="operator-arrival"
        style={{ opacity: coreReveal, transform: `scale(${1.2 - 0.2 * coreReveal})` }}
      >
        <NeuralCore className={styles.arrivalArt} />
      </div>
    </div>
  );
}
