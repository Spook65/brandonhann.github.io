import { useEffect, useRef, useState } from "react";
import guardianArt from "./assets/guardian-encounter.webp";
import chamberArt from "./assets/human-core-chamber.webp";
import mobileChamberArt from "./assets/human-core-chamber-mobile.webp";
import humanArt from "./assets/human-silhouette.webp";
import {
  destinations,
  profile,
  secureAgent,
  skillGroups,
  type DestinationId,
} from "./data/domain";
import { projects } from "./data/projects";
import { legacyAnchors } from "./data/legacyAnchors";
import styles from "./App.module.css";

const base = import.meta.env.BASE_URL;
const dialogue = [
  "Whoa, you actually made it in.",
  "I’m Brandon. I build things, break things, and figure out why they broke.",
  "There’s more to this place than meets the eye. Want to see?",
] as const;
type Scene = "guardian" | "entering" | "human" | "awakening" | "domain";

function Out({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children} <span aria-hidden="true">↗</span>
    </a>
  );
}

function DomainPanel({ selected }: { selected: DestinationId }) {
  switch (selected) {
    case "quest":
      return (
        <>
          <p className={styles.status}>{secureAgent.status}</p>
          <h3>{secureAgent.name}</h3>
          <p>{secureAgent.summary}</p>
          <div className={styles.inset}>
            <strong>Current objective</strong>
            <p>{secureAgent.objective}</p>
          </div>
          <p className={styles.fine}>{secureAgent.reviewed}</p>
          <p className={styles.fine}>{secureAgent.scope}</p>
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
  const [dialogueDone, setDialogueDone] = useState(false);
  const [selected, setSelected] = useState<DestinationId>("quest");
  const [guardianFailed, setGuardianFailed] = useState(false);
  const [chamberFailed, setChamberFailed] = useState(false);
  const enterRef = useRef<HTMLButtonElement>(null);
  const humanTitleRef = useRef<HTMLHeadingElement>(null);
  const domainTitleRef = useRef<HTMLHeadingElement>(null);
  const relicRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const navigateHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (id === "domain") setScene("domain");
      if (id === "core") setScene("human");
      if (id)
        window.requestAnimationFrame(() =>
          document.getElementById(id)?.scrollIntoView(),
        );
    };
    navigateHash();
    window.addEventListener("hashchange", navigateHash);
    return () => window.removeEventListener("hashchange", navigateHash);
  }, []);
  useEffect(() => {
    if (scene !== "entering" && scene !== "awakening") return;
    const next: Scene = scene === "entering" ? "human" : "domain";
    const timer = window.setTimeout(
      () => setScene(next),
      scene === "entering" ? 1050 : 820,
    );
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotionChange = () => {
      if (motion.matches) setScene(next);
    };
    const onVisibility = () => {
      if (document.hidden) setScene(next);
    };
    motion.addEventListener("change", onMotionChange);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearTimeout(timer);
      motion.removeEventListener("change", onMotionChange);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [scene]);
  useEffect(() => {
    if (scene === "human") humanTitleRef.current?.focus();
    if (scene === "domain") domainTitleRef.current?.focus();
  }, [scene]);
  useEffect(() => {
    if (dialogueDone && scene === "human") relicRef.current?.focus();
  }, [dialogueDone, scene]);

  const reduced = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const enter = () => {
    if (scene === "guardian") setScene(reduced() ? "human" : "entering");
  };
  const awaken = () => setScene(reduced() ? "domain" : "awakening");
  const skip = () => setScene("domain");
  const returnHome = () => {
    setScene("guardian");
    setLine(0);
    setDialogueDone(false);
    window.scrollTo({ top: 0, behavior: "instant" });
    window.requestAnimationFrame(() => enterRef.current?.focus());
  };
  const continueDialogue = () => {
    if (line < dialogue.length - 1) setLine(line + 1);
    else setDialogueDone(true);
  };
  const guardianVisible = scene === "guardian" || scene === "entering";
  const chamberVisible = !guardianVisible;
  const domainVisible = scene === "domain";

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
        </header>
        <main id="main-content">
          <section
            id="hero"
            className={styles.stage}
            aria-label="The Builder’s Domain entrance and hub"
          >
            <div
              className={[
                styles.guardianScene,
                scene === "entering" ? styles.guardianEntering : "",
                !guardianVisible ? styles.sceneHidden : "",
              ].join(" ")}
              aria-hidden={!guardianVisible}
              inert={!guardianVisible}
            >
              {!guardianFailed && (
                <img
                  className={styles.guardianArt}
                  src={guardianArt}
                  alt=""
                  fetchPriority="high"
                  onError={() => setGuardianFailed(true)}
                />
              )}
              <div className={styles.guardianShade} aria-hidden="true" />
              <div className={styles.heroCopy}>
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
              <div className={styles.mouthControl}>
                <div className={styles.mouthVoid} aria-hidden="true" />
                <button
                  ref={enterRef}
                  className={styles.enterButton}
                  type="button"
                  onClick={enter}
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
              className={[
                styles.chamberScene,
                scene === "entering" ? styles.chamberEntering : "",
                chamberVisible ? styles.chamberVisible : "",
                scene === "awakening" ? styles.awakening : "",
                domainVisible ? styles.domainAwake : "",
              ].join(" ")}
              aria-hidden={!chamberVisible}
              inert={!chamberVisible}
            >
              {!chamberFailed && (
                <picture className={styles.chamberPicture}>
                  <source
                    media="(max-width: 600px)"
                    srcSet={mobileChamberArt}
                  />
                  <img
                    className={styles.chamberArt}
                    src={chamberArt}
                    alt=""
                    onError={() => setChamberFailed(true)}
                  />
                </picture>
              )}
              <div className={styles.chamberShade} aria-hidden="true" />
              <svg
                className={styles.seams}
                viewBox="0 0 1440 900"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path d="M0 640 380 590 620 730 720 490 820 730 1090 570 1440 650M720 490 720 90M380 590 210 340M1090 570 1250 300" />
              </svg>
              <div className={styles.humanGround} aria-hidden="true" />
              <img
                className={styles.humanArt}
                src={humanArt}
                alt=""
                onError={(event) => {
                  event.currentTarget.hidden = true;
                }}
              />
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
                  {!dialogueDone ? (
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
                        <button
                          type="button"
                          onClick={() => setDialogueDone(true)}
                        >
                          Skip dialogue
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className={styles.humanPrompt}>
                      There’s something in this room. Try the engraved relic.
                    </p>
                  )}
                </div>
              )}
              {scene === "human" && (
                <button
                  ref={relicRef}
                  className={styles.relic}
                  type="button"
                  onClick={awaken}
                  aria-label="Activate the engraved relic and reveal the Builder’s Domain"
                >
                  <span className={styles.relicMark} aria-hidden="true">
                    ⌁
                  </span>
                  <span>Activate relic</span>
                </button>
              )}
              {scene === "awakening" && (
                <div className={styles.awakeningCopy} role="status">
                  <span>The domain is waking.</span>
                  <button type="button" onClick={skip}>
                    Skip transition
                  </button>
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
                          onClick={() => setSelected(item.id)}
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
                      className={styles.destinationPanel}
                      id="destination-panel"
                      aria-live="polite"
                      aria-label={`${destinations.find((item) => item.id === selected)?.label} details`}
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
