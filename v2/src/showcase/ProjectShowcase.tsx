import { useState, type ReactNode } from "react";
import { caseStudies, type CaseStudy } from "../data/caseStudies";
import { legacyAnchors } from "../data/legacyAnchors";
import { useProjectNavigation } from "./useProjectNavigation";
import { MapetiteEvidence } from "./MapetiteEvidence";
import styles from "./ProjectShowcase.module.css";

function CaseStudyArticle({
  study,
  index,
  selected,
}: {
  study: CaseStudy;
  index: number;
  selected: boolean;
}) {
  const { project } = study;
  return (
    <article
      id={project.id}
      className={styles.study}
      data-selected={selected}
      aria-labelledby={`${project.id}-title`}
    >
      {project.id === "project-oddworks" && (
        <span id={legacyAnchors.oddworks} />
      )}
      {project.id === "project-secureagent" && (
        <span id={legacyAnchors.threatgrid} />
      )}
      <div className={styles.studyHeader}>
        <p className={styles.metadata}>
          {String(index + 1).padStart(2, "0")} / {study.category}
        </p>
        <span className={styles.status}>{project.status}</span>
      </div>
      <div className={styles.studyBody}>
        <div className={styles.narrative}>
          <h3 id={`${project.id}-title`}>
            {project.name}
            <span aria-hidden="true">.</span>
          </h3>
          <p className={styles.problem}>{study.problem}</p>
          <p>{study.contribution}</p>
          <ul
            className={styles.stack}
            aria-label={`${project.name} technologies`}
          >
            {study.stack.map((tool) => (
              <li key={tool}>{tool}</li>
            ))}
          </ul>
          <div className={styles.decision}>
            <h4>Engineering decision</h4>
            <p>{study.decision}</p>
          </div>
          <div className={styles.links}>
            {project.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label} <span aria-hidden="true">↗</span>
              </a>
            ))}
            {!project.links.length && (
              <span>Public-safe overview · source not published</span>
            )}
          </div>
        </div>
        <div className={styles.evidence}>
          {project.id === "project-mapetite" ? (
            <MapetiteEvidence />
          ) : (
            <figure className={styles.architecture}>
              <figcaption>
                Architecture schematic{" "}
                <span>Illustrative · based on reviewed documentation</span>
              </figcaption>
              <ol>
                {study.flow.map((step, stepIndex) => (
                  <li key={step.title}>
                    <span className={styles.node} aria-hidden="true">
                      {stepIndex + 1}
                    </span>
                    <div>
                      <strong>{step.title}</strong>
                      <small>{step.detail}</small>
                    </div>
                  </li>
                ))}
              </ol>
            </figure>
          )}
          <div className={styles.validation}>
            <h4>Evidence & boundaries</h4>
            <p>{study.evidence}</p>
            <p className={styles.limitation}>{study.limitation}</p>
            {study.source && (
              <a href={study.source} target="_blank" rel="noopener noreferrer">
                Inspect the evidence ↗
              </a>
            )}
          </div>
        </div>
      </div>
      <details className={styles.details}>
        <summary>
          Implementation notes <span>{study.category}</span>
        </summary>
        <ul>
          {study.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </details>
    </article>
  );
}

export function ProjectShowcase({ afterIndex }: { afterIndex?: ReactNode }) {
  const selected = useProjectNavigation();
  const [hovered, setHovered] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const preview = focused ?? hovered;
  const active =
    caseStudies.find(({ project }) => project.id === (preview ?? selected)) ??
    caseStudies[0];
  return (
    <section
      id="projects"
      className={styles.showcase}
      aria-labelledby="projects-title"
    >
      <header className={styles.heading}>
        <div>
          <p className={styles.metadata}>01 / Engineering in practice</p>
          <h2 id="projects-title">The work, beneath the surface.</h2>
        </div>
        <p>
          Four projects. Different constraints.
          <br />
          Decisions you can inspect.
        </p>
      </header>
      <nav
        className={styles.index}
        aria-label="Project index"
        onPointerLeave={() => setHovered(null)}
      >
        {caseStudies.map(({ project, category }, index) => (
          <a
            key={project.id}
            href={`#${project.id}`}
            aria-current={selected === project.id ? "location" : undefined}
            data-preview={preview === project.id && selected !== project.id}
            onPointerEnter={(event) => {
              if (event.pointerType !== "touch") setHovered(project.id);
            }}
            onFocus={() => setFocused(project.id)}
            onBlur={() => setFocused(null)}
          >
            <span className={styles.indexNumber}>
              {String(index + 1).padStart(2, "0")}
              <span className={styles.indexState} aria-hidden="true">
                {selected === project.id
                  ? "Selected"
                  : preview === project.id
                    ? "Preview"
                    : "Open ↘"}
              </span>
            </span>
            <strong>{project.name}</strong>
            <small>{category}</small>
          </a>
        ))}
      </nav>
      <div className={styles.preview} aria-label="Project focus preview">
        <span>
          {preview && preview !== selected ? "Preview" : "Selected"} /{" "}
          {active.project.name}
        </span>
        <p>{active.insight}</p>
        <a href={`#${active.project.id}`}>
          Read case study <span aria-hidden="true">↓</span>
        </a>
      </div>
      {afterIndex}
      {caseStudies.map((study, index) => (
        <CaseStudyArticle
          key={study.project.id}
          study={study}
          index={index}
          selected={selected === study.project.id}
        />
      ))}
    </section>
  );
}
