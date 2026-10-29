import { useState } from "react";
import { profile, skillGroups } from "./data/domain";
import { projects } from "./data/projects";
import { legacyAnchors } from "./data/legacyAnchors";
import { principles } from "./data/caseStudies";
import { ProjectShowcase } from "./showcase/ProjectShowcase";
import styles from "./WelcomingHome.module.css";
import "@fontsource-variable/inter/wght.css";
import "@fontsource-variable/jetbrains-mono/wght.css";

const base = import.meta.env.BASE_URL;
const foundCura = projects.find((project) => project.id === "project-cura");
if (!foundCura) throw new Error("Cura content is required.");
const cura = foundCura;

export function WelcomingHome() {
  const [principle, setPrinciple] = useState(1);
  return (
    <div className={styles.home}>
      <a className={styles.skipLink} href="#main-content">
        Skip to content
      </a>
      <header className={styles.header}>
        <a
          className={styles.brand}
          href={base}
          aria-label="Brandon Hann, homepage"
        >
          <span aria-hidden="true">bh/</span> Brandon Hann
        </a>
        <nav aria-label="Primary navigation">
          <a href="#projects">Projects</a>
          <a href={base + "resume.html"}>Résumé</a>
          <a
            href="https://github.com/Spook65"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub ↗
          </a>
          <a href="#contact">Contact</a>
        </nav>
      </header>
      <main id="main-content">
        <section className={styles.hero} aria-labelledby="welcome-title">
          <p className={styles.eyebrow}>
            Computer science / Software engineering
          </p>
          <h1 id="welcome-title">
            Brandon Hann<span>.</span>
          </h1>
          <div className={styles.heroBody}>
            <div>
              <p className={styles.lead}>
                Useful software.
                <br />
                Thoughtful boundaries.
              </p>
              <p className={styles.intro}>
                I build across the stack, with a particular interest in
                cybersecurity and AI security. I like understanding how systems
                work—and what happens when they don’t.
              </p>
              <div className={styles.heroActions}>
                <a href="#projects" className={styles.primaryAction}>
                  Explore projects <span aria-hidden="true">↓</span>
                </a>
                <a href={base + "resume.html"}>Read résumé ↗</a>
              </div>
            </div>
            <aside
              className={styles.principle}
              aria-label="Engineering principles"
            >
              <p className={styles.eyebrow}>A principle behind the work</p>
              <div role="group" aria-label="Inspect a principle">
                {principles.map((item, index) => (
                  <button
                    key={item.name}
                    type="button"
                    aria-pressed={principle === index}
                    onClick={() => setPrinciple(index)}
                  >
                    {item.name}
                    <span aria-hidden="true">{index < 2 ? "→" : "↵"}</span>
                  </button>
                ))}
              </div>
              <p className={styles.principleDetail} aria-live="polite">
                {principles[principle].detail}
              </p>
              <a href="#project-secureagent">
                Explore the authorization boundary ↗
              </a>
            </aside>
          </div>
          <p className={styles.education}>
            {profile.education}
            <span>Software · Security · AI systems</span>
          </p>
        </section>
        <ProjectShowcase />
        <section
          className={styles.additional}
          aria-labelledby="additional-title"
        >
          <p className={styles.eyebrow}>02 / More to the story</p>
          <h2 id="additional-title">Additional work.</h2>
          <span id={legacyAnchors.cura} className={styles.anchor} />
          <article id="project-cura">
            <div>
              <h3>{cura.name}</h3>
              <p className={styles.eyebrow}>{cura.status}</p>
            </div>
            <div>
              <p>{cura.summary}</p>
              <p>
                I developed the frontend with Creao AI: landing and sign-up
                pages, a dashboard, calendar, appointments, and patient list,
                with attention to responsive interfaces and backend API
                integration.
              </p>
              <details>
                <summary>Contribution & implementation notes</summary>
                <p>
                  Team prototype. My contribution was the web interface; the
                  voice agent, backend services, and iOS work were built by
                  teammates. The public submission describes the shared
                  architecture. This is not a validated clinical product.
                </p>
              </details>
              <div className={styles.links}>
                {cura.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label} ↗
                  </a>
                ))}
              </div>
            </div>
          </article>
        </section>
        <div className={styles.aboutGrid}>
          <section id="about">
            <p className={styles.eyebrow}>03 / About</p>
            <h2>Curious by default.</h2>
            <p>{profile.intro}</p>
            <p>{profile.focus}</p>
          </section>
          <section id="skills">
            <p className={styles.eyebrow}>04 / Working toolkit</p>
            <h2>Tools with a purpose.</h2>
            {skillGroups.map((group) => (
              <p key={group.title}>
                <strong>{group.title}</strong>
                <br />
                {group.items.join(" · ")}
              </p>
            ))}
          </section>
        </div>
        <section id="contact" className={styles.contact}>
          <span id="contributions" className={styles.anchor} />
          <p className={styles.eyebrow}>05 / Get in touch</p>
          <h2>Let’s build something useful.</h2>
          <p>
            Open to conversations about software engineering, cybersecurity, and
            AI systems.
          </p>
          <div className={styles.links}>
            <a
              href="https://www.linkedin.com/in/bhanncs/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Connect on LinkedIn ↗
            </a>
            <a
              href="https://github.com/Spook65"
              target="_blank"
              rel="noopener noreferrer"
            >
              Explore GitHub ↗
            </a>
            <a
              href={base + "assets/resume/Brandon-Hann-Resume.pdf"}
              download="Brandon-Hann-Resume.pdf"
            >
              Résumé PDF ↗
            </a>
          </div>
        </section>
        <aside className={styles.optional}>
          <span>Prefer a different perspective?</span>
          <a href={`${base}?experience=guardian`}>
            Explore The Inner Workings ↗
          </a>
        </aside>
      </main>
      <footer className={styles.footer}>
        <span>Brandon Hann / Built with care.</span>
        <a href="#main-content">Back to top ↑</a>
      </footer>
    </div>
  );
}
