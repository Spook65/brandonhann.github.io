import { NeuralCore } from "./NeuralCore";
import styles from "./BreachTransition.module.css";

export const BREACH_MS = 1600;

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const ease = (value: number) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};

/** The Core is staged behind the actual SVG mouth opening, not inside a second tunnel scene. */
export function BreachTransition({ elapsed }: { elapsed: number }) {
  const reveal = ease((elapsed - 850) / 300);
  const settle = ease((elapsed - 940) / 660);
  return (
    <div
      className={styles.coreBehindMouth}
      data-testid="breach-core"
      aria-hidden="true"
      style={{ opacity: reveal, transform: `scale(${(1.18 - 0.155 * settle).toFixed(3)})` }}
    >
      <NeuralCore className={styles.coreArt} />
    </div>
  );
}
