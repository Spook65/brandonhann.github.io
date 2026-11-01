import { useState } from "react";
import { caseStudies } from "../data/caseStudies";
import styles from "./SignalHero.module.css";

const courier = `${import.meta.env.BASE_URL}assets/relay-courier.svg`;

// Illustration coordinates describe independent routes from one authored-work source.
// Project names, destinations, and facts always come from the case-study contract.
const routes = [
  { id: "project-mapetite", path: "M220 181 H302 L389 45 H525", x: 525, y: 14, color: "#8ce5cd", shape: "M0 7 172 0 194 15 184 58 13 62 0 43Z", number: "01" },
  { id: "project-rivet", path: "M220 193 H337 L409 124 H540", x: 540, y: 91, color: "#aabaff", shape: "M8 0 180 7 194 51 12 61 0 30Z", number: "02" },
  { id: "project-secureagent", path: "M220 205 H359 L421 215 H505", x: 505, y: 181, color: "#c9a7ff", shape: "M0 9 168 0 194 18 182 64 11 68 0 46Z", number: "03" },
  { id: "project-oddworks", path: "M220 217 H304 L405 301 H550", x: 550, y: 270, color: "#ffc98a", shape: "M0 0 176 5 194 25 177 62 0 59 8 30Z", number: "04" },
] as const;

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
            {selected && <path className={styles.selectedRoute} d={selected.path} stroke={selected.color} fill="none" strokeWidth="6" strokeLinecap="square" strokeLinejoin="bevel" />}
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
                      <rect width="194" height="70" fill="transparent" />
                      <path d={route.shape} fill="#14202e" stroke={route.color} strokeWidth="2" />
                      <path d="M11 51 H169" stroke={route.color} strokeWidth="2" opacity=".7" />
                      <text className={styles.nodeNumber} x="15" y="22" fill={route.color}>{route.number} / PROJECT</text>
                      <text className={styles.nodeName} x="15" y="44">{study.project.name}</text>
                      <path d="M169 28 h12 m-6-6 6 6-6 6" stroke={route.color} fill="none" strokeWidth="2" />
                    </g>
                  </a>
                );
              })}
            </g>
            <g key={preview ?? "rest"} className={preview ? styles.courierReact : styles.courier} aria-hidden="true">
              <image href={courier} x="228" y="225" width="89" height="107" />
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
