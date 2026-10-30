import { mapetiteValidation } from "../data/caseStudies";
import styles from "./MapetiteEvidence.module.css";

export function MapetiteEvidence() {
  return (
    <figure className={styles.figure} aria-labelledby="mapetite-flow-title">
      <figcaption>
        <span className={styles.eyebrow}>Mapetite / Place validation</span>
        <strong id="mapetite-flow-title">{mapetiteValidation.title}</strong>
        <span className={styles.disclosure}>
          Illustrative architecture · derived from public source, not an app screenshot
        </span>
      </figcaption>
      <div className={styles.input}>
        <span className={styles.step}>01 / Input</span>
        <strong>{mapetiteValidation.input}</strong>
      </div>
      <div className={styles.boundary}>
        <span className={styles.step}>02 / Backend validation</span>
        <p>Resolve against the backend place index before requesting restaurant data.</p>
      </div>
      <ol className={styles.outcomes} aria-label="Possible validation outcomes">
        {mapetiteValidation.outcomes.map((outcome) => (
          <li key={outcome.code} data-kind={outcome.kind}>
            <code>{outcome.code}</code>
            <strong>{outcome.label}</strong>
            <span>{outcome.result}</span>
          </li>
        ))}
      </ol>
      <p className={styles.followThrough}>
        <span className={styles.step}>03 / Resolved place only</span>
        {mapetiteValidation.followThrough}
      </p>
      <a
        className={styles.source}
        href={mapetiteValidation.source}
        target="_blank"
        rel="noopener noreferrer"
      >
        Inspect validation source <span aria-hidden="true">↗</span>
      </a>
    </figure>
  );
}
