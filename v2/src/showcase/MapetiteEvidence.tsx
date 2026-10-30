import { useEffect, useState } from "react";
import { mapetiteValidation } from "../data/caseStudies";
import styles from "./MapetiteEvidence.module.css";

export function MapetiteEvidence() {
  const [enhanced, setEnhanced] = useState(false);
  const [selectedKind, setSelectedKind] = useState<
    (typeof mapetiteValidation.outcomes)[number]["kind"] | null
  >(null);
  useEffect(() => setEnhanced(true), []);
  const selected = mapetiteValidation.outcomes.find(
    (outcome) => outcome.kind === selectedKind,
  );

  return (
    <figure className={styles.figure} aria-labelledby="mapetite-flow-title">
      <figcaption>
        <span className={styles.eyebrow}>Mapetite / Place validation</span>
        <strong id="mapetite-flow-title">{mapetiteValidation.title}</strong>
        <span className={styles.disclosure}>
          Illustrative walkthrough from public source and tests · no live request
        </span>
      </figcaption>
      <div className={styles.input}>
        <span className={styles.step}>
          01 / {selected ? "Example input" : "Input"}
        </span>
        <strong>{selected?.example ?? mapetiteValidation.input}</strong>
      </div>
      <div className={styles.boundary}>
        <span className={styles.step}>02 / Backend validation</span>
        {selected ? (
          <p>
            <code>{selected.code}</code> · {selected.result}
          </p>
        ) : (
          <p>
            Resolve against the backend place index before requesting restaurant
            data.
          </p>
        )}
      </div>
      {enhanced && (
        <p className={styles.hint}>
          Choose a validation result to trace the request.
        </p>
      )}
      <ol className={styles.outcomes} aria-label="Possible validation outcomes">
        {mapetiteValidation.outcomes.map((outcome) => (
          <li
            key={outcome.code}
            data-kind={outcome.kind}
            data-selected={selectedKind === outcome.kind}
          >
            {enhanced ? (
              <button
                type="button"
                aria-pressed={selectedKind === outcome.kind}
                onClick={() => setSelectedKind(outcome.kind)}
              >
                <code>{outcome.code}</code>
                <strong>{outcome.label}</strong>
                <span>Inspect path ↗</span>
              </button>
            ) : (
              <div className={styles.staticOutcome}>
                <code>{outcome.code}</code>
                <strong>{outcome.label}</strong>
                <span>{outcome.result}</span>
              </div>
            )}
          </li>
        ))}
      </ol>
      <div
        className={styles.announcement}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {selected
          ? `${selected.example}. ${selected.code}. Provider search ${selected.providerReached ? "would proceed" : "not reached"}. ${selected.explanation}`
          : ""}
      </div>
      <p className={styles.followThrough}>
        <span className={styles.step}>
          03 / {selected ? "Provider search" : "Resolved place only"}
        </span>
        {selected ? (
          <>
            <strong>
              {selected.providerReached ? "Would proceed" : "Not reached"}
            </strong>
            <span>{selected.explanation}</span>
          </>
        ) : (
          mapetiteValidation.followThrough
        )}
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
