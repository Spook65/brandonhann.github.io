import { useState } from "react";
import { caseStudies, type CaseStudy } from "../data/caseStudies";
import styles from "./SignalNetwork.module.css";

type RouteId = "project-mapetite" | "project-rivet" | "project-secureagent" | "project-oddworks";
type RouteVisual = {
  readonly id: RouteId;
  readonly tone: "mint" | "amber" | "lavender" | "blue";
  readonly index: string;
  readonly role: string;
  readonly desktopPath: string;
  readonly mobilePath: string;
};

// Geometry and color are concept-only presentation data. Project facts come from caseStudies.
const routeVisuals: readonly RouteVisual[] = [
  {
    id: "project-mapetite", tone: "mint", index: "01", role: "PLACE / VALIDATE",
    desktopPath: "M 144 210 H 188 L 258 86 H 434",
    mobilePath: "M 110 135 H 135 V 47 H 190",
  },
  {
    id: "project-rivet", tone: "amber", index: "02", role: "MATCH / AUTHORIZE",
    desktopPath: "M 144 210 H 205 L 273 165 H 479",
    mobilePath: "M 110 147 H 151 V 120 H 190",
  },
  {
    id: "project-secureagent", tone: "lavender", index: "03", role: "ACTION / BOUNDARY",
    desktopPath: "M 144 210 H 206 L 275 296 H 434",
    mobilePath: "M 110 159 H 142 V 200 H 190",
  },
  {
    id: "project-oddworks", tone: "blue", index: "04", role: "STATE / SERVER",
    desktopPath: "M 144 210 H 186 L 302 375 H 479",
    mobilePath: "M 110 171 H 128 V 275 H 190",
  },
];

type Route = RouteVisual & { readonly study: CaseStudy };
const routes: readonly Route[] = routeVisuals.map((visual) => {
  const study = caseStudies.find(({ project }) => project.id === visual.id);
  if (!study) throw new Error(`Missing featured study for ${visual.id}`);
  return { ...visual, study };
});

function Traces({
  variant, activeId, pulse, clearPulse,
}: {
  variant: "desktop" | "mobile";
  activeId: RouteId | null;
  pulse: { id: RouteId; serial: number } | null;
  clearPulse: (serial: number) => void;
}) {
  return (
    <svg
      className={variant === "desktop" ? styles.desktopTraces : styles.mobileTraces}
      data-signal-variant={variant}
      viewBox={variant === "desktop" ? "0 0 680 420" : "0 0 360 330"}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {routes.map((route) => {
        const path = variant === "desktop" ? route.desktopPath : route.mobilePath;
        return (
          <g key={route.id} className={styles[route.tone]} data-route-id={route.id} data-active={activeId === route.id}>
            <path className={styles.traceUnderlay} d={path} />
            <path className={styles.trace} d={path} />
            {pulse?.id === route.id && (
              <path
                key={pulse.serial}
                className={styles.packet}
                data-signal-packet={route.id}
                d={path}
                pathLength="100"
                onAnimationEnd={() => clearPulse(pulse.serial)}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}

export function SignalNetwork() {
  const [selectedId, setSelectedId] = useState<RouteId | null>(null);
  const [previewId, setPreviewId] = useState<RouteId | null>(null);
  const [pulse, setPulse] = useState<{ id: RouteId; serial: number } | null>(null);
  const activeId = previewId ?? selectedId;
  const active = routes.find((route) => route.id === activeId) ?? null;
  const base = import.meta.env.BASE_URL;

  const signal = (id: RouteId) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setPulse((previous) => ({ id, serial: (previous?.serial ?? 0) + 1 }));
  };

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <span><strong>bh/</strong> Brandon Hann</span>
        <a href={base}>Current portfolio <span aria-hidden="true">↗</span></a>
      </header>
      <main className={styles.main}>
        <p className={styles.kicker}>Visual study 01 / isolated prototype</p>
        <div className={styles.frame}>
          <div className={styles.intro}>
            <p className={styles.overline}>Computer science / software engineering</p>
            <h1 id="signal-network-title" aria-label="Signal Network.">Signal<br /><span className={styles.secondWord}>Network</span><span>.</span></h1>
            <p className={styles.lead}>Four projects. Four different engineering boundaries.</p>
            <p className={styles.copy}>A conceptual map of Brandon’s work, drawn as independent routes. Inspect a signal to see the decision behind each project.</p>
            <a className={styles.projectAction} href={`${base}#projects`}>Explore actual projects <span aria-hidden="true">↗</span></a>
          </div>
          <section className={styles.network} aria-label="Signal Network concept">
            <div className={styles.board}>
              <div className={styles.boardMark}>SIGNAL NETWORK <span>· FOUR INDEPENDENT ROUTES</span></div>
              <Traces variant="desktop" activeId={activeId} pulse={pulse} clearPulse={(serial) => setPulse((current) => current?.serial === serial ? null : current)} />
              <Traces variant="mobile" activeId={activeId} pulse={pulse} clearPulse={(serial) => setPulse((current) => current?.serial === serial ? null : current)} />
              <div className={styles.source} aria-hidden="true">
                <span>BH / 00</span>
                <strong>BUILD</strong>
                <small>curiosity → systems</small>
              </div>
              {routes.map((route) => (
                <div
                  key={route.id}
                  className={`${styles.port} ${styles[route.tone]} ${styles[route.id]}`}
                  data-route-id={route.id}
                  data-active={activeId === route.id}
                  data-selected={selectedId === route.id}
                  onPointerEnter={(event) => {
                    if (event.pointerType === "mouse" || event.pointerType === "pen") {
                      setPreviewId(route.id);
                      signal(route.id);
                    }
                  }}
                  onPointerLeave={() => setPreviewId(null)}
                >
                  <button
                    type="button"
                    aria-label={`Inspect ${route.study.project.name}`}
                    aria-pressed={selectedId === route.id}
                    onFocus={(event) => {
                      setPreviewId(route.id);
                      if (event.currentTarget.matches(":focus-visible")) signal(route.id);
                    }}
                    onBlur={() => setPreviewId(null)}
                    onClick={() => {
                      setSelectedId(route.id);
                      signal(route.id);
                    }}
                  >
                    <span className={styles.portIndex}>{route.index} / {route.role}</span>
                    <strong>{route.study.project.name}</strong>
                  </button>
                  <a href={`${base}#${route.id}`} aria-label={`Open ${route.study.project.name} case study`} title={`Open ${route.study.project.name} case study`}>↗</a>
                </div>
              ))}
              <div className={styles.boardFoot}>SELECT A ROUTE <span>•</span> INSPECT THE DECISION</div>
            </div>
            <div className={styles.fact} aria-live="polite" aria-atomic="true">
              {active ? (
                <>
                  <div><span className={styles.factLabel}>{previewId && previewId !== selectedId ? "Preview" : "Selected"} / {active.study.project.name}</span>
                    {selectedId && <button type="button" onClick={() => { setSelectedId(null); setPreviewId(null); setPulse(null); }}>Clear selection</button>}
                  </div>
                  <p>{active.study.insight}</p>
                  <a href={`${base}#${active.id}`}>Read {active.study.project.name} case study ↗</a>
                </>
              ) : (
                <>
                  <span className={styles.factLabel}>Awaiting inspection</span>
                  <p>Choose a route. Each destination is a separate project, connected here by Brandon’s approach to engineering.</p>
                </>
              )}
            </div>
            <noscript><p className={styles.noScript}>The network preview needs JavaScript. Each project’s ↗ link still opens its full case study.</p></noscript>
          </section>
        </div>
        <p className={styles.disclaimer}>Illustrative visual study. These four projects do not communicate through a live pipeline.</p>
      </main>
    </div>
  );
}
