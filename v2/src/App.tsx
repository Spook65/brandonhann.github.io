import { useEffect } from 'react';
import { projects } from './data/projects';
import { legacyAnchors } from './data/legacyAnchors';
import styles from './App.module.css';

const base = import.meta.env.BASE_URL;

function App() {
  useEffect(() => {
    const scrollToHash = () => {
      if (!window.location.hash) return;
      const id = decodeURIComponent(window.location.hash.slice(1));
      document.getElementById(id)?.scrollIntoView();
    };

    scrollToHash();
    window.addEventListener('hashchange', scrollToHash);
    return () => window.removeEventListener('hashchange', scrollToHash);
  }, []);

  return (
    <>
      <a className={styles.skipLink} href="#main-content">Skip to content</a>
      <div className={styles.shell}>
        <header className={styles.header}>
          <a className={styles.brand} href="#hero">Brandon Hann</a>
          <nav className={styles.nav} aria-label="Primary navigation">
            <a href="#projects">Projects</a>
            <a href="#about">About</a>
            <a href="#beyond">Memories</a>
            <a href={`${base}resume.html`}>Résumé</a>
            <a href="#contact">Contact</a>
          </nav>
        </header>

        <main id="main-content">
          <section id="hero" className={styles.section} aria-labelledby="hero-title">
            <p className={styles.eyebrow}>Portfolio v2 foundation preview</p>
            <h1 id="hero-title" className={styles.title}>Brandon Hann</h1>
            <p className={styles.lead}>I build software and explore how systems can be useful, reliable, and clear to the people using them.</p>
            <div className={styles.links}>
              <a href="#projects">Selected work</a>
              <a href={`${base}resume.html`}>View résumé</a>
              <a href={`${base}assets/resume/Brandon-Hann-Resume.pdf`} download="Brandon-Hann-Resume.pdf">Download PDF</a>
            </div>
          </section>

          <section id="projects" className={styles.section} aria-labelledby="projects-title">
            <p className={styles.eyebrow}>Selected work</p>
            <h2 id="projects-title">Projects</h2>
            <div className={styles.grid}>
              {projects.map((project) => (
                <article className={styles.card} id={project.id} key={project.id}>
                  {project.id === 'project-cura' && <span className={styles.anchor} id={legacyAnchors.cura} aria-hidden="true" />}
                  {project.id === 'project-oddworks' && <span className={styles.anchor} id={legacyAnchors.oddworks} aria-hidden="true" />}
                  <p className={styles.meta}>{project.status}</p>
                  <h3>{project.name}</h3>
                  <p>{project.summary}</p>
                  <p className={styles.note}>{project.evidence}</p>
                  <div className={styles.links}>
                    {project.links.map((link) => (
                      <a href={link.href} key={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>
                    ))}
                  </div>
                </article>
              ))}
            </div>
            <span className={styles.anchor} id={legacyAnchors.threatgrid} aria-hidden="true" />
            <p className={styles.note}>THREATGRID is outside the featured selection. Its <a href="https://github.com/Spook65/Spook65.github.io" target="_blank" rel="noopener noreferrer">prototype repository</a> remains available.</p>
          </section>

          <section id="about" className={styles.section} aria-labelledby="about-title">
            <span className={styles.anchor} id="skills" aria-hidden="true" />
            <p className={styles.eyebrow}>About</p>
            <h2 id="about-title">Background and tools</h2>
            <p className={styles.lead}>Placeholder for reviewed experience, current work, and a concise technical toolkit.</p>
          </section>

          <section id="beyond" className={styles.section} aria-labelledby="memories-title">
            <p className={styles.eyebrow}>Beyond the code</p>
            <h2 id="memories-title">Memories</h2>
            <p className={styles.lead}>Photo placeholders will remain here until images and captions are approved.</p>
          </section>

          <section id="resume" className={styles.section} aria-labelledby="resume-title">
            <h2 id="resume-title">Résumé</h2>
            <div className={styles.links}>
              <a href={`${base}resume.html`}>Read the résumé</a>
              <a href={`${base}assets/resume/Brandon-Hann-Resume.pdf`} download="Brandon-Hann-Resume.pdf">Download PDF</a>
            </div>
          </section>

          <section id="contact" className={styles.section} aria-labelledby="contact-title">
            <span className={styles.anchor} id="contributions" aria-hidden="true" />
            <h2 id="contact-title">Contact and links</h2>
            <div className={styles.links}>
              <a href="https://github.com/Spook65" target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href="https://www.linkedin.com/in/bhanncs/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </div>
          </section>
        </main>

        <footer className={styles.footer}>Foundation preview. Field Notes + Patch visual design is planned for a later phase.</footer>
      </div>
    </>
  );
}

export default App;
