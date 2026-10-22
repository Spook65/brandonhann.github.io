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

const PassageRing = memo(function PassageRing({ index }: { index: number }) {
  return (
    <svg viewBox="0 0 1000 700" preserveAspectRatio="none" aria-hidden="true">
      <path
        d="M40 52Q500-65 960 52L1010 286Q1036 355 1010 414L960 648Q500 765 40 648L-10 414Q-36 355-10 286z M167 166Q500 77 833 166L854 289Q870 350 854 411L833 534Q500 623 167 534L146 411Q130 350 146 289z"
        fill="#26363b"
        fillRule="evenodd"
        stroke="#73817c"
        strokeWidth="11"
      />
      <path d="M52 62Q500-35 948 62M52 638Q500 735 948 638" fill="none" stroke="#a48769" strokeWidth="9" />
      <path d="M65 136q110 34 134 133l-9 160q-37 106-125 135M935 136q-110 34-134 133l9 160q37 106 125 135" fill="none" stroke="#101b21" strokeWidth="50" />
      <path d="M68 137q110 34 134 133l-9 160q-37 106-125 135M932 137q-110 34-134 133l9 160q37 106 125 135" fill="none" stroke="#75bdc5" strokeOpacity=".72" strokeWidth="6" />
      <path d="M200 173q300-76 600 0M200 527q300 76 600 0" fill="none" stroke="#ba7f63" strokeOpacity=".58" strokeWidth="8" />
      <path d="M327 142v29M500 120v31M673 142v29M327 558v-29M500 580v-31M673 558v-29" stroke="#d4ab76" strokeWidth="12" />
      <path d="M190 290h-48M190 410h-48M810 290h48M810 410h48" stroke="#dc986b" strokeWidth="7" />
      <path d="M70 70 170 170M930 70 830 170M70 630 170 530M930 630 830 530" stroke="#56777a" strokeWidth="8" opacity=".65" />
      <path d="M88 345h90M822 345h90" stroke="#e5a95d" strokeWidth="5" />
      <path d="M84 355h92M824 355h92" stroke="#572f2b" strokeWidth="20" opacity=".75" />
      <path d="M170 170Q500 80 830 170M170 530Q500 620 830 530" fill="none" stroke="#080e13" strokeWidth="18" />
      <path d="M170 170Q500 80 830 170M170 530Q500 620 830 530" fill="none" stroke="#a28170" strokeOpacity=".58" strokeWidth="3" strokeDasharray="16 21" />
      <circle cx="500" cy="148" r="13" fill={index % 2 ? "#75bdc5" : "#e5a95d"} />
      <circle cx="500" cy="552" r="13" fill={index % 2 ? "#75bdc5" : "#e5a95d"} />
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
        <div className={styles.wall} style={{ transform: `translate3d(${-cameraBend * 0.22}px, 0, 0)` }} />
        <div className={styles.strandLeft} style={{ transform: `translate3d(${-cameraBend * 0.7}px, ${travel * 130}px, 0)` }} />
        <div className={styles.strandRight} style={{ transform: `translate3d(${-cameraBend * 0.3}px, ${-travel * 105}px, 0)` }} />
        <div className={styles.depth}>
          {ringDepths.map((depth, index) => {
            const z = depth + travel * 5000;
            const x = (index - 3.5) * 22 - cameraBend;
            const y = Math.sin(index * 0.8 + travel * 2) * 20;
            const visible = z < 420 && z > -4700;
            return (
              <div
                className={styles.ring}
                data-depth={index}
                key={depth}
                style={{
                  transform: `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${z}px) rotateY(${(index - 3.5) * 1.2 - travel * 6}deg)`,
                  opacity: visible ? clamp((420 - z) / 150) : 0,
                  visibility: visible ? "visible" : "hidden",
                }}
              >
                <PassageRing index={index} />
              </div>
            );
          })}
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
