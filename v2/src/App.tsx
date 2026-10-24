import { useEffect, useRef, useState } from "react";
import { BREACH_MS, BreachTransition } from "./BreachTransition";
import { NeuralCore } from "./NeuralCore";
import {
  destinations,
  profile,
  secureAgent,
  skillGroups,
  type DestinationId,
} from "./data/domain";
import { projects } from "./data/projects";
import { legacyAnchors } from "./data/legacyAnchors";
import { LayeredGuardian } from "./LayeredGuardian";
import styles from "./App.module.css";

const base = import.meta.env.BASE_URL;
const dialogue = [
  "Whoa, you actually made it in.",
  "I’m Brandon. I build things, break things, and figure out why they broke.",
  "There’s more to this place than meets the eye. Want to see?",
] as const;
type Scene = "guardian" | "entering" | "human" | "domain";

function Out({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children} <span aria-hidden="true">↗</span>
    </a>
  );
}

function DomainPanel({ selected }: { selected: DestinationId | null }) {
  switch (selected) {
    case null:
      return (
        <>
          <p className={styles.status}>Operator online</p>
          <h3>Choose a connection.</h3>
          <p>Six paths lead from the operator to Brandon’s work and story.</p>
        </>
      );
    case "quest":
      return (
        <>
          <p className={styles.status}>{secureAgent.status}</p>
          <h3>{secureAgent.name}</h3>
          <p>{secureAgent.summary}</p>
          <details className={styles.questDetails}>
            <summary>Build notes and reviewed evidence</summary>
            <div className={styles.inset}>
              <strong>Current objective</strong>
              <p>{secureAgent.objective}</p>
            </div>
            <p className={styles.fine}>{secureAgent.reviewed}</p>
            <p className={styles.fine}>{secureAgent.scope}</p>
          </details>
        </>
      );
    case "archives":
      return (
        <>
          <h3>Project Archives</h3>
          <div className={styles.archiveList}>
            {projects.map((project) => (
              <article key={project.id}>
                <h4>{project.name}</h4>
                <p className={styles.status}>{project.status}</p>
                <p>{project.summary}</p>
                <div className={styles.inlineLinks}>
                  {project.links.map((link) => (
                    <Out key={link.href} href={link.href}>
                      {link.label}
                    </Out>
                  ))}
                  <a href={`#${project.id}`}>Read more ↓</a>
                </div>
              </article>
            ))}
          </div>
        </>
      );
    case "arsenal":
      return (
        <>
          <h3>Arsenal</h3>
          <p>Tools I use to build, test, and investigate systems.</p>
          <div className={styles.skillGroups}>
            {skillGroups.map((group) => (
              <div key={group.title}>
                <h4>{group.title}</h4>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </>
      );
    case "chronicles":
      return (
        <>
          <h3>Chronicles</h3>
          <p>{profile.education}</p>
          <ul className={styles.storyList}>
            {profile.experience.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className={styles.fine}>
            Personal photos and captions will appear after approval.
          </p>
        </>
      );
    case "profile":
      return (
        <>
          <h3>About Brandon</h3>
          <p>{profile.intro}</p>
          <p>{profile.focus}</p>
          <p>
            Outside the keyboard: friends, games, the gym, badminton, and a
            competitive game of pool.
          </p>
        </>
      );
    case "signal":
      return (
        <>
          <h3>Signal</h3>
          <p>
            For engineering conversations, project questions, and opportunities:
          </p>
          <div className={styles.signalLinks}>
            <a href={base + "resume.html"}>Read résumé ↗</a>
            <a
              href={base + "assets/resume/Brandon-Hann-Resume.pdf"}
              download="Brandon-Hann-Resume.pdf"
            >
              Download PDF ↓
            </a>
            <Out href="https://github.com/Spook65">GitHub</Out>
            <Out href="https://www.linkedin.com/in/bhanncs/">LinkedIn</Out>
          </div>
        </>
      );
  }
}

function App() {
  const [scene, setScene] = useState<Scene>("guardian");
  const [line, setLine] = useState(0);
  const [selected, setSelected] = useState<DestinationId | null>(null);
  const [preview, setPreview] = useState<DestinationId | null>(null);
  const [operatorOpen, setOperatorOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [panelRevealVersion, setPanelRevealVersion] = useState(0);
  const [jawProgress, setJawProgress] = useState(0);
  const [jawAlert, setJawAlert] = useState(false);
  const [breachElapsed, setBreachElapsed] = useState(0);
  const enterRef = useRef<HTMLButtonElement>(null);
  const humanTitleRef = useRef<HTMLHeadingElement>(null);
  const domainTitleRef = useRef<HTMLHeadingElement>(null);
  const stageRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const mobileNavRef = useRef<HTMLElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const pendingPanelReveal = useRef(false);
  const spatialFrame = useRef(0);
  const pendingPointer = useRef({ x: 0, y: 0 });

  const paintPointer = () => {
    spatialFrame.current = 0;
    const stage = stageRef.current;
    if (!stage) return;
    const { x, y } = pendingPointer.current;
    stage.style.setProperty("--look-x", `${(x * 8).toFixed(2)}px`);
    stage.style.setProperty("--look-y", `${(y * 6).toFixed(2)}px`);
    stage.style.setProperty("--camera-yaw", `${(x * 2.2).toFixed(2)}deg`);
    stage.style.setProperty("--camera-pitch", `${(-y * 1.5).toFixed(2)}deg`);
    stage.style.setProperty("--core-look-x", `${(-x * 4).toFixed(2)}px`);
    stage.style.setProperty("--core-look-y", `${(-y * 3).toFixed(2)}px`);
    stage.style.setProperty("--shade-look-x", `${(x * 2).toFixed(2)}px`);
    stage.style.setProperty("--shade-look-y", `${(y * 1.5).toFixed(2)}px`);
  };
  const onSpatialMove = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType === "touch" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    pendingPointer.current = {
      x: Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width - 0.5) * 2)),
      y: Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height - 0.5) * 2)),
    };
    if (!spatialFrame.current) spatialFrame.current = window.requestAnimationFrame(paintPointer);
  };
  const resetSpatial = () => {
    pendingPointer.current = { x: 0, y: 0 };
    if (!spatialFrame.current) spatialFrame.current = window.requestAnimationFrame(paintPointer);
  };
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotionChange = () => { if (motion.matches) resetSpatial(); };
    const onVisibility = () => {
      stageRef.current?.setAttribute("data-tab-hidden", String(document.hidden));
      if (document.hidden) resetSpatial();
    };
    motion.addEventListener("change", onMotionChange);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.cancelAnimationFrame(spatialFrame.current);
      motion.removeEventListener("change", onMotionChange);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  useEffect(() => {
    const navigateHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      const destination = destinations.find((item) => `domain-${item.id}` === id);
      if (destination) {
        pendingPanelReveal.current = true;
        setPanelRevealVersion((version) => version + 1);
        setSelected(destination.id);
        setScene("domain");
        return;
      }
      if (id === "domain") setScene("domain");
      else if (id === "core") setScene("human");
      else if (id === "hero") {
        setScene("guardian");
        setJawProgress(0);
        setBreachElapsed(0);
      } else if (id) {
        setScene((current) => current === "entering" ? "guardian" : current);
        setJawProgress(0);
        setBreachElapsed(0);
      }
      if (id)
        window.requestAnimationFrame(() =>
          document.getElementById(id)?.scrollIntoView(),
        );
    };
    navigateHash();
    window.addEventListener("hashchange", navigateHash);
    window.addEventListener("popstate", navigateHash);
    return () => {
      window.removeEventListener("hashchange", navigateHash);
      window.removeEventListener("popstate", navigateHash);
    };
  }, []);
  useEffect(() => {
    if (scene !== "domain" || !selected || !pendingPanelReveal.current) return;
    pendingPanelReveal.current = false;
    if (!window.matchMedia("(max-width: 600px)").matches) return;
    const frame = window.requestAnimationFrame(() => {
      const panel = panelRef.current;
      if (!panel) return;
      panel.scrollIntoView({
        block: "start",
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
      });
      panel.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [scene, selected, panelRevealVersion]);
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const dismiss = (event: PointerEvent) => {
      if (!mobileNavRef.current?.contains(event.target as Node)) setMobileMenuOpen(false);
    };
    const onEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMobileMenuOpen(false);
      mobileMenuButtonRef.current?.focus();
    };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", onEscape);
    };
  }, [mobileMenuOpen]);
  useEffect(() => {
    if (scene !== "entering") return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = Math.min(BREACH_MS, now - start);
      setBreachElapsed(elapsed);
      const jaw = Math.min(1, Math.max(0, (elapsed - 90) / 560));
      setJawProgress(1 - (1 - jaw) ** 3);
      if (elapsed >= BREACH_MS) setScene("human");
      else frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotionChange = () => {
      if (motion.matches) setScene("human");
    };
    const onVisibility = () => {
      if (document.hidden) setScene("human");
    };
    motion.addEventListener("change", onMotionChange);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.cancelAnimationFrame(frame);
      motion.removeEventListener("change", onMotionChange);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [scene]);
  useEffect(() => {
    if (scene === "human") humanTitleRef.current?.focus();
    if (scene === "domain") domainTitleRef.current?.focus();
  }, [scene]);
  const reduced = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const enter = () => {
    if (scene === "guardian") {
      setJawAlert(false);
      setScene(reduced() ? "human" : "entering");
    }
  };
  const skip = () => setScene("domain");
  const activateDestination = (id: DestinationId) => {
    pendingPanelReveal.current = true;
    setPanelRevealVersion((version) => version + 1);
    setSelected(id);
    const hash = `#domain-${id}`;
    if (window.location.hash !== hash) window.history.pushState(null, "", hash);
  };
  const returnHome = () => {
    setScene("guardian");
    setJawProgress(0);
    setBreachElapsed(0);
    setJawAlert(false);
    setLine(0);
    setPreview(null);
    setOperatorOpen(false);
    setSelected(null);
    window.scrollTo({ top: 0, behavior: "instant" });
    window.requestAnimationFrame(() => enterRef.current?.focus());
  };
  const continueDialogue = () => {
    if (line < dialogue.length - 1) setLine(line + 1);
    else setScene("domain");
  };
  const guardianVisible = scene === "guardian" || scene === "entering";
  const chamberVisible = !guardianVisible;
  const domainVisible = scene === "domain";
  const approach = Math.min(1, Math.max(0, (breachElapsed - 540) / 810));
  const cameraEase = approach * approach * (3 - 2 * approach);
  const aperture = Math.min(1, Math.max(0, (breachElapsed - 830) / 440));
  const guardianFade = 1 - Math.min(1, Math.max(0, (breachElapsed - 1330) / 250));
  const copyFade = 1 - Math.min(1, Math.max(0, (breachElapsed - 440) / 260));
  const controlFade = 1 - Math.min(1, Math.max(0, (breachElapsed - 70) / 230));

  return (
    <>
      <a className={styles.skipLink} href="#main-content">
        Skip to content
      </a>
      <div className={styles.shell}>
        <header className={styles.header}>
          <a
            className={styles.brand}
            href="#hero"
            onClick={returnHome}
            aria-label="Brandon Hann, return to Guardian"
          >
            bh<span>.</span>
          </a>
          <nav className={styles.nav} aria-label="Primary navigation">
            <a href="#projects">Projects</a>
            <a href="#about">About</a>
            <a href="#skills">Skills</a>
            <a href={base + "resume.html"}>Résumé</a>
            <a href="#contact">Contact</a>
          </nav>
          <nav ref={mobileNavRef} className={styles.mobileNav} aria-label="Mobile navigation">
            <a href="#projects" onClick={() => setMobileMenuOpen(false)}>Projects</a>
            <a href={base + "resume.html"}>Résumé</a>
            <button
              ref={mobileMenuButtonRef}
              type="button"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-secondary-navigation"
              onClick={() => setMobileMenuOpen((open) => !open)}
            >
              Menu <span aria-hidden="true">▾</span>
            </button>
            <div id="mobile-secondary-navigation" className={styles.mobileMenu} hidden={!mobileMenuOpen}>
              <a href="#about" onClick={() => setMobileMenuOpen(false)}>About</a>
              <a href="#skills" onClick={() => setMobileMenuOpen(false)}>Skills</a>
              <a href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact</a>
            </div>
          </nav>
        </header>
        <main id="main-content">
          <section
            id="hero"
            ref={stageRef}
            className={styles.stage}
            aria-label="The Builder’s Domain entrance and hub"
            onPointerMove={onSpatialMove}
            onPointerLeave={resetSpatial}
          >
            <div
              className={[
                styles.guardianScene,
                !guardianVisible ? styles.sceneHidden : "",
              ].join(" ")}
              data-attentive={jawAlert && scene === "guardian"}
              aria-hidden={!guardianVisible}
              inert={!guardianVisible}
            >
              {scene === "entering" && <BreachTransition elapsed={breachElapsed} />}
              <div
                className={styles.guardianCamera}
                style={{
                  opacity: scene === "entering" ? guardianFade : 1,
                  transform: `translateX(calc(var(--mouth-x-shift) * ${cameraEase})) translateY(calc(var(--mouth-shift) * ${cameraEase})) scale(${1 + 4.5 * cameraEase})`,
                }}
              >
                <LayeredGuardian
                  className={styles.layeredGuardian}
                  progress={jawProgress}
                  alert={jawAlert && scene === "guardian"}
                  aperture={aperture}
                />
              </div>
              <div className={styles.guardianShade} style={{ opacity: 1 - aperture * 0.45 }} aria-hidden="true" />
              <div className={styles.heroCopy} style={{ opacity: scene === "entering" ? copyFade : 1 }}>
                <p className={styles.kicker}>
                  The Builder’s Logbook <span>/ 001</span>
                </p>
                <h1 id="hero-title" className={styles.heroTitle}>
                  Brandon
                  <br />
                  Hann<span>.</span>
                </h1>
                <p className={styles.heroLead}>
                  I build systems, test ideas, and follow the paths between
                  technology and people.
                </p>
              </div>
              <div className={styles.mouthControl} style={{ opacity: scene === "entering" ? controlFade : 1 }}>
                <button
                  ref={enterRef}
                  className={styles.enterButton}
                  type="button"
                  onClick={enter}
                  onMouseEnter={() => setJawAlert(true)}
                  onMouseLeave={() => setJawAlert(false)}
                  onFocus={() => setJawAlert(true)}
                  onBlur={() => setJawAlert(false)}
                  disabled={scene === "entering"}
                  aria-label="Enter through the Guardian’s mouth"
                >
                  <span aria-hidden="true">↓</span> Enter
                </button>
                <span className={styles.mouthCaption}>
                  A passage into the person behind the work
                </span>
              </div>
              <div className={styles.heroBottom}>
                <button
                  className={styles.textButton}
                  type="button"
                  onClick={skip}
                >
                  Skip introduction ↗
                </button>
                <span>01 / The Encounter</span>
              </div>
            </div>
            <div
              id="core"
              data-active-route={domainVisible ? preview ?? selected : undefined}
              className={[
                styles.chamberScene,
                chamberVisible ? styles.chamberVisible : "",
                domainVisible ? styles.domainAwake : "",
              ].join(" ")}
              aria-hidden={!chamberVisible}
              inert={!chamberVisible}
            >
              <NeuralCore
                className={styles.coreArt}
                selected={domainVisible ? selected : undefined}
                preview={domainVisible ? preview : null}
              />
              <div className={styles.chamberShade} aria-hidden="true" />
              {scene === "human" && (
                <div className={styles.humanIntro}>
                  <p className={styles.kicker}>
                    Inside the Guardian <span>/ 002</span>
                  </p>
                  <h2 ref={humanTitleRef} tabIndex={-1}>
                    The human
                    <br />
                    <em>inside.</em>
                  </h2>
                  <div
                    className={styles.dialogue}
                    aria-label="A note from Brandon"
                  >
                    <p aria-live="polite">“{dialogue[line]}”</p>
                    <div className={styles.dialogueActions}>
                      <button type="button" onClick={continueDialogue}>
                        {line === dialogue.length - 1
                          ? "Show me"
                          : "Continue"}{" "}
                        →
                      </button>
                      <button type="button" onClick={skip}>
                        Skip dialogue
                      </button>
                    </div>
                  </div>
                  <p className={styles.conceptNote}>
                    The illustrated operator is a fictional placeholder, not a portrait.
                  </p>
                </div>
              )}
              {domainVisible && (
                <div id="domain" className={styles.domainInterface}>
                  <div className={styles.domainHeading}>
                    <p className={styles.kicker}>
                      The Builder’s Logbook <span>/ 003</span>
                    </p>
                    <h2 ref={domainTitleRef} tabIndex={-1}>
                      The Builder’s <em>Domain.</em>
                    </h2>
                    <p>
                      Pick a path. Every part of this place connects back to the
                      work and the person behind it.
                    </p>
                  </div>
                  <div className={styles.domainLayout}>
                    <div className={styles.connectionField} role="group" aria-label="Operator and neural connections">
                      <button
                        type="button"
                        className={styles.operatorButton}
                        aria-expanded={operatorOpen}
                        aria-controls="operator-status"
                        onClick={() => setOperatorOpen((open) => !open)}
                      >
                        <span className={styles.operatorMark} aria-hidden="true">◎</span>
                        Operator status
                      </button>
                      <div className={styles.connectionPins} role="group" aria-label="Spatial destination connections">
                        {destinations.map((item) => (
                          <button
                            type="button"
                            key={item.id}
                            className={styles.connectionPin}
                            data-route={item.id}
                            data-state={selected === item.id ? "selected" : preview === item.id ? "preview" : "inactive"}
                            aria-label={`Open ${item.label} connection`}
                            aria-pressed={selected === item.id}
                            aria-controls="destination-panel"
                            onClick={() => activateDestination(item.id)}
                            onPointerEnter={() => setPreview(item.id)}
                            onPointerLeave={() => setPreview(null)}
                            onFocus={() => setPreview(item.id)}
                            onBlur={() => setPreview(null)}
                          >
                            {item.number}
                          </button>
                        ))}
                      </div>
                      <section id="operator-status" className={styles.operatorStatus} aria-label="Operator status" hidden={!operatorOpen}>
                          <strong>System status</strong>
                          <p>Brandon Hann · Builder and operator</p>
                          <p>Main Quest: {secureAgent.name} · {secureAgent.status}</p>
                          <button type="button" onClick={() => { activateDestination("quest"); setOperatorOpen(false); }}>
                            Follow Main Quest →
                          </button>
                      </section>
                    </div>
                    <div
                      className={styles.destinationList}
                      role="group"
                      aria-label="Domain destinations"
                    >
                      {destinations.map((item) => (
                        <button
                          type="button"
                          className={
                            selected === item.id
                              ? styles.destinationSelected
                              : ""
                          }
                          key={item.id}
                          aria-pressed={selected === item.id}
                          aria-controls="destination-panel"
                          onClick={() => activateDestination(item.id)}
                          onPointerEnter={() => setPreview(item.id)}
                          onPointerLeave={() => setPreview(null)}
                          onFocus={() => setPreview(item.id)}
                          onBlur={() => setPreview(null)}
                        >
                          <span className={styles.destinationNumber}>
                            {item.number}
                          </span>
                          <span>
                            <strong>{item.label}</strong>
                            <small>{item.hint}</small>
                          </span>
                          <span aria-hidden="true">↗</span>
                        </button>
                      ))}
                    </div>
                    <section
                      ref={panelRef}
                      className={`${styles.destinationPanel} ${selected === null ? styles.destinationPanelIdle : ""}`}
                      id="destination-panel"
                      tabIndex={-1}
                      aria-live="polite"
                      aria-label={selected === null ? "Connection details" : `${destinations.find((item) => item.id === selected)?.label} details`}
                    >
                      <DomainPanel selected={selected} />
                    </section>
                  </div>
                  <button
                    className={styles.returnButton}
                    type="button"
                    onClick={returnHome}
                  >
                    ← Return to Guardian
                  </button>
                </div>
              )}
            </div>
          </section>
          <div className={styles.content}>
            <section
              id="projects"
              className={styles.section}
              aria-labelledby="projects-title"
            >
              <p className={styles.kicker}>Selected work</p>
              <h2 id="projects-title">Projects</h2>
              <p className={styles.sectionLead}>
                Experiments and products at different stages, with their status
                stated plainly.
              </p>
              <div className={styles.projectGrid}>
                <article className={styles.projectCard}>
                  <p className={styles.projectNumber}>01 / Main Quest</p>
                  <h3>{secureAgent.name}</h3>
                  <p className={styles.status}>{secureAgent.status}</p>
                  <p>{secureAgent.summary}</p>
                  <p className={styles.fine}>{secureAgent.scope}</p>
                  <a
                    href="#domain"
                    onClick={() => {
                      setSelected("quest");
                      setScene("domain");
                    }}
                  >
                    Open Main Quest ↑
                  </a>
                </article>
                {projects.map((project, index) => (
                  <article
                    className={styles.projectCard}
                    id={project.id}
                    key={project.id}
                  >
                    {project.id === "project-cura" && (
                      <span
                        className={styles.anchor}
                        id={legacyAnchors.cura}
                        aria-hidden="true"
                      />
                    )}
                    {project.id === "project-oddworks" && (
                      <span
                        className={styles.anchor}
                        id={legacyAnchors.oddworks}
                        aria-hidden="true"
                      />
                    )}
                    <p className={styles.projectNumber}>
                      {String(index + 2).padStart(2, "0")} / Project Archive
                    </p>
                    <h3>{project.name}</h3>
                    <p className={styles.status}>{project.status}</p>
                    <p>{project.summary}</p>
                    <p className={styles.fine}>{project.evidence}</p>
                    <div className={styles.inlineLinks}>
                      {project.links.map((link) => (
                        <Out key={link.href} href={link.href}>
                          {link.label}
                        </Out>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
              <span
                className={styles.anchor}
                id={legacyAnchors.threatgrid}
                aria-hidden="true"
              />
            </section>
            <section
              id="about"
              className={styles.section}
              aria-labelledby="about-title"
            >
              <p className={styles.kicker}>Character Profile</p>
              <h2 id="about-title">About Brandon</h2>
              <p className={styles.sectionLead}>{profile.intro}</p>
              <p>{profile.focus}</p>
            </section>
            <section
              id="skills"
              className={styles.section}
              aria-labelledby="skills-title"
            >
              <p className={styles.kicker}>Arsenal</p>
              <h2 id="skills-title">Skills & tools</h2>
              <div className={styles.skillGroups}>
                {skillGroups.map((group) => (
                  <div key={group.title}>
                    <h3>{group.title}</h3>
                    <ul>
                      {group.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
            <section
              id="beyond"
              className={styles.section}
              aria-labelledby="chronicles-title"
            >
              <p className={styles.kicker}>Chronicles</p>
              <h2 id="chronicles-title">Experience & education</h2>
              <p className={styles.sectionLead}>{profile.education}</p>
              <ul className={styles.storyList}>
                {profile.experience.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className={styles.fine}>
                Personal photographs and captions are pending approval.
              </p>
            </section>
            <section
              id="resume"
              className={styles.section}
              aria-labelledby="resume-title"
            >
              <p className={styles.kicker}>Dossier</p>
              <h2 id="resume-title">Résumé</h2>
              <div className={styles.inlineLinks}>
                <a href={base + "resume.html"}>Read résumé ↗</a>
                <a
                  href={base + "assets/resume/Brandon-Hann-Resume.pdf"}
                  download="Brandon-Hann-Resume.pdf"
                >
                  Download PDF ↓
                </a>
              </div>
            </section>
            <section
              id="contact"
              className={styles.section}
              aria-labelledby="contact-title"
            >
              <span
                className={styles.anchor}
                id="contributions"
                aria-hidden="true"
              />
              <p className={styles.kicker}>Signal</p>
              <h2 id="contact-title">Get in touch</h2>
              <p>
                See current work, connect professionally, or explore the code.
              </p>
              <div className={styles.inlineLinks}>
                <Out href="https://github.com/Spook65">GitHub</Out>
                <Out href="https://www.linkedin.com/in/bhanncs/">LinkedIn</Out>
              </div>
            </section>
          </div>
        </main>
        <footer className={styles.footer}>
          The Builder’s Logbook · Built by Brandon Hann
        </footer>
      </div>
    </>
  );
}
export default App;
