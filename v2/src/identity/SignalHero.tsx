import { useState } from "react";
import { caseStudies } from "../data/caseStudies";
import styles from "./SignalHero.module.css";

const courier = `${import.meta.env.BASE_URL}assets/relay-courier.svg`;

// Illustration coordinates describe independent routes from one authored-work source.
// Project names, destinations, and facts always come from the case-study contract.
const routes = [
  { id: "project-mapetite", path: "M220 181 H302 L389 45 H525", x: 525, y: 14, color: "#8ce5cd", shape: "M0 10 178 0 208 18 193 63 14 66 0 45Z", number: "01" },
  { id: "project-rivet", path: "M220 193 H337 L409 124 H540", x: 540, y: 91, color: "#aabaff", shape: "M9 0 189 8 208 33 190 64 0 60 10 31Z", number: "02" },
  { id: "project-secureagent", path: "M220 205 H359 L421 215 H505", x: 505, y: 181, color: "#c9a7ff", shape: "M0 5 168 0 180 7 208 17 202 61 184 70 13 67 0 47Z", number: "03" },
  { id: "project-oddworks", path: "M220 217 H304 L405 301 H550", x: 550, y: 270, color: "#ffc98a", shape: "M6 0 192 3 208 23 190 63 0 60 8 34Z", number: "04" },
] as const;

type ProjectRoute = (typeof routes)[number];

function ProjectMark({ id, color }: { id: ProjectRoute["id"]; color: string }) {
  switch (id) {
    case "project-mapetite":
      return <g data-project-mark="location-validation" transform="translate(171 14)" stroke={color} strokeWidth="2.3" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
        <path d="M16 2C9 2 5 7 5 13c0 8 11 18 11 18s11-10 11-18C27 7 23 2 16 2Z" fill="#0b1d27" />
        <path d="m11 13 4 4 7-8" fill="none" />
      </g>;
    case "project-rivet":
      return <g data-project-mark="matching" transform="translate(171 17)" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
        <path d="M2 5h8l7 11-7 11H2l8-11Z" fill="#15223c" />
        <path d="M30 5h-8l-7 11 7 11h8l-8-11Z" fill="#15223c" />
        <path d="M13 16h6" fill="none" />
      </g>;
    case "project-secureagent":
      return <g data-project-mark="policy-boundary" transform="translate(171 14)" stroke={color} strokeWidth="2.3" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
        <path d="M16 2 29 7v10c0 8-6 13-13 16C9 30 3 25 3 17V7Z" fill="#211a34" />
        <path d="M16 8v18M9 16h14" fill="none" />
      </g>;
    case "project-oddworks":
      return <g data-project-mark="server-owned-state" transform="translate(171 15)" stroke={color} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
        <path d="M5 2h22v11H5Z" fill="#2a211c" />
        <path d="M10 8h4M20 8h2M16 13v10M7 23h18" fill="none" />
        <path d="M3 23h9v8H3ZM20 23h9v8h-9Z" fill="#2a211c" />
      </g>;
    default: {
      const exhaustive: never = id;
      return exhaustive;
    }
  }
}

export function SignalHero() {
  const [preview, setPreview] = useState<string | null>(null);
  const selected = routes.find((route) => route.id === preview);
  const selectedStudy = caseStudies.find((study) => study.project.id === preview);

  return (
    <div className={styles.feature}>
      <div className={styles.desktop}>
        <p className={styles.kicker}>A map of the work <span aria-hidden="true">↘</span></p>
        <nav aria-label="Signal Network project destinations" className={styles.network} onMouseLeave={() => setPreview(null)}>
          <svg viewBox="0 0 760 360" aria-label="Four independent project routes from BUILD" preserveAspectRatio="xMidYMid meet">
            <defs>
              <pattern id="signal-hatch" width="14" height="14" patternUnits="userSpaceOnUse">
                <path d="M0 14 14 0" stroke="#ffffff" strokeOpacity=".035" />
              </pattern>
            </defs>
            <path className={styles.backdrop} d="M0 88 292 20 440 86 760 0V360H0Z" />
            <path className={styles.hatch} d="M0 88 292 20 440 86 760 0V360H0Z" fill="url(#signal-hatch)" />
            <path className={styles.cutout} d="M15 109 279 44 359 78 315 291 139 337 0 288Z" />
            <path className={styles.accentSlash} d="M33 114 269 58 288 71 51 127Z" />
            <g className={styles.neutralRoutes} fill="none" strokeWidth="3" strokeLinecap="square" strokeLinejoin="bevel">
              {routes.map((route) => <path key={route.id} d={route.path} stroke={route.color} />)}
            </g>
            {selected && <path className={styles.selectedRoute} d={selected.path} stroke={selected.color} fill="none" strokeWidth="6" strokeLinecap="square" strokeLinejoin="bevel" style={{ filter: `drop-shadow(0 0 6px ${selected.color})` }} />}
            <g className={styles.build} aria-hidden="true">
              <path d="M29 148 177 116 228 165 210 260 48 265 18 225Z" />
              <path className={styles.buildEdge} d="M29 148 177 116 228 165" />
              <text x="52" y="202">BUILD</text>
              <text className={styles.buildSub} x="55" y="229">BRANDON’S WORK</text>
            </g>
            <g className={styles.nodes}>
              {routes.map((route) => {
                const study = caseStudies.find((entry) => entry.project.id === route.id);
                if (!study) throw new Error(`Missing case study for ${route.id}`);
                return (
                  <a
                    key={route.id}
                    href={`#${route.id}`}
                    aria-label={`Open ${study.project.name} case study`}
                    data-preview={preview === route.id ? "true" : undefined}
                    onMouseEnter={() => setPreview(route.id)}
                    onFocus={() => setPreview(route.id)}
                    onBlur={(event) => {
                      if (!event.currentTarget.contains(event.relatedTarget)) setPreview(null);
                    }}
                  >
                    <g transform={`translate(${route.x} ${route.y})`}>
                      <rect width="208" height="70" fill="transparent" />
                      <g className={styles.terminalShell}>
                        <path className={styles.terminalPlate} d={route.shape} fill="#14202e" stroke={route.color} strokeWidth="2" />
                        <path d="M11 53 H162" stroke={route.color} strokeWidth="2" opacity=".7" />
                        <text className={styles.nodeNumber} x="15" y="22" fill={route.color}>{route.number} / PROJECT</text>
                        <text className={styles.nodeName} x="15" y="45">{study.project.name}</text>
                        <ProjectMark id={route.id} color={route.color} />
                      </g>
                    </g>
                  </a>
                );
              })}
            </g>
            <g key={preview ?? "rest"} className={preview ? styles.courierReact : styles.courier} aria-hidden="true">
              <image href={courier} x="210" y="225" width="110" height="132" />
            </g>
          </svg>
        </nav>
        <div className={styles.readout} aria-live="polite">
          {selectedStudy ? (
            <><strong>{selectedStudy.project.name}</strong><span>{selectedStudy.insight}</span><a href={`#${selectedStudy.project.id}`}>Read case study ↗</a></>
          ) : (
            <><strong>Choose a route.</strong><span>Focus a project to see one decision behind it.</span><span className={styles.readoutEnd}>04 independent projects</span></>
          )}
        </div>
        <p className={styles.disclaimer}>Illustrative map of separate projects, not a connected live system.</p>
      </div>
      <a className={styles.mobile} href="#projects" aria-label="Explore Brandon’s projects">
        <img src={courier} alt="" width="50" height="60" />
      </a>
    </div>
  );
}
