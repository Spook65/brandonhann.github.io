import { useEffect, useRef, useState } from 'react';
import { profile, secureAgent, skillGroups } from './data/domain';
import { legacyAnchors } from './data/legacyAnchors';
import { projects } from './data/projects';
import { Patch, type PatchPose } from './Patch';
import { ProjectVisual } from './ProjectVisual';
import type { VisualProjectId } from './visualModel';
import '@fontsource-variable/inter/wght.css';
import '@fontsource-variable/jetbrains-mono/wght.css';
import styles from './WelcomingHome.module.css';

const base = import.meta.env.BASE_URL;

type ShowcaseItem = {
  id: VisualProjectId;
  name: string;
  status: string;
  summary: string;
  links: readonly { label: string; href: string }[];
};

const showcase: readonly ShowcaseItem[] = [
  ...projects.map((project) => ({
    id: project.id,
    name: project.name,
    status: project.status,
    summary: project.summary,
    links: project.links,
  })),
  {
    id: 'project-secureagent',
    name: secureAgent.name,
    status: secureAgent.status,
    summary: secureAgent.summary,
    links: [],
  },
];

function projectFromHash(): VisualProjectId {
  let hash: string;
  try { hash = decodeURIComponent(window.location.hash.slice(1)); }
  catch { return 'project-cura'; }
  if (hash === legacyAnchors.cura) return 'project-cura';
  if (hash === legacyAnchors.oddworks) return 'project-oddworks';
  return showcase.find((item) => item.id === hash)?.id ?? 'project-cura';
}

export function WelcomingHome() {
  const [selectedId, setSelectedId] = useState(projectFromHash);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [patchPose, setPatchPose] = useState<PatchPose>('idle');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [portraitFailed, setPortraitFailed] = useState(false);
  const [revealVersion, setRevealVersion] = useState(0);
  const previewRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const reactionTimer = useRef(0);
  const pendingReveal = useRef(false);

  const reactPatch = (pose: PatchPose) => {
    window.clearTimeout(reactionTimer.current);
    setPatchPose(pose);
    if (pose !== 'idle') reactionTimer.current = window.setTimeout(() => setPatchPose('idle'), 1200);
  };

  useEffect(() => () => window.clearTimeout(reactionTimer.current), []);

  useEffect(() => {
    const syncHash = () => {
      let hash: string;
      try { hash = decodeURIComponent(window.location.hash.slice(1)); }
      catch { return; }
      if (!hash) {
        setSelectedId('project-cura');
        setPreviewId(null);
        return;
      }
      const mapped = hash === legacyAnchors.cura ? 'project-cura' : hash === legacyAnchors.oddworks ? 'project-oddworks' : hash;
      const match = showcase.find((item) => item.id === mapped);
      if (!match) return;
      setSelectedId(match.id);
      setPreviewId(null);
      pendingReveal.current = true;
      setRevealVersion((version) => version + 1);
    };
    if (window.location.hash) syncHash();
    window.addEventListener('hashchange', syncHash);
    window.addEventListener('popstate', syncHash);
    return () => {
      window.removeEventListener('hashchange', syncHash);
      window.removeEventListener('popstate', syncHash);
    };
  }, []);

  useEffect(() => {
    if (!pendingReveal.current) return;
    pendingReveal.current = false;
    if (!window.matchMedia('(max-width: 700px)').matches) return;
    const frame = window.requestAnimationFrame(() => {
      previewRef.current?.scrollIntoView({
        block: 'start',
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      });
      previewRef.current?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [selectedId, revealVersion]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMobileMenuOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setMobileMenuOpen(false);
      menuButtonRef.current?.focus();
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [mobileMenuOpen]);

  const chooseProject = (id: VisualProjectId) => {
    setSelectedId(id);
    setPreviewId(null);
    reactPatch('inspect');
    pendingReveal.current = true;
    setRevealVersion((version) => version + 1);
    if (window.location.hash !== `#${id}`) window.history.pushState(null, '', `#${id}`);
  };

  const shown = showcase.find((item) => item.id === previewId) ?? showcase.find((item) => item.id === selectedId) ?? showcase[0];

  return (
    <div className={styles.welcome}>
      <a className={styles.skipLink} href="#main-content">Skip to content</a>
      <header className={styles.header}>
        <a className={styles.brand} href={base} aria-label="Brandon Hann, homepage">bh<span>.</span></a>
        <nav className={styles.desktopNav} aria-label="Primary navigation">
          <a href="#projects">Projects</a><a href="#about">About</a><a href="#skills">Skills</a><a href={base + 'resume.html'}>Résumé</a><a href="#contact">Contact</a>
        </nav>
        <nav className={styles.mobileNav} ref={menuRef} aria-label="Mobile navigation">
          <a href="#projects" onClick={() => setMobileMenuOpen(false)}>Projects</a>
          <a href={base + 'resume.html'}>Résumé</a>
          <button type="button" ref={menuButtonRef} aria-expanded={mobileMenuOpen} aria-controls="welcome-mobile-menu" onClick={() => setMobileMenuOpen((open) => !open)}>Menu <span aria-hidden="true">▾</span></button>
          <div id="welcome-mobile-menu" className={styles.mobileMenu} hidden={!mobileMenuOpen}>
            <a href="#about" onClick={() => setMobileMenuOpen(false)}>About</a>
            <a href="#skills" onClick={() => setMobileMenuOpen(false)}>Skills</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact</a>
          </div>
        </nav>
      </header>
      <main id="main-content">
        <section className={styles.hero} aria-labelledby="welcome-title">
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>A field note from Brandon</p>
            <h1 id="welcome-title">Hey, I’m<br /><em>Brandon.</em></h1>
            <p className={styles.lead}>I build things, break things, and figure out why they broke.</p>
            <p className={styles.intro}>{profile.education}. I’m drawn to software engineering, cybersecurity, AI evaluation, and creative experiments that make complex systems easier to understand.</p>
            <div className={styles.heroActions}>
              <a className={styles.primaryAction} href="#projects" onPointerEnter={() => reactPatch('wave')} onFocus={() => reactPatch('wave')}>Explore projects <span aria-hidden="true">↗</span></a>
              <a className={styles.textAction} href={base + 'resume.html'}>Read résumé ↗</a>
            </div>
            <p className={styles.now}>Currently building: SecureAgent Lab · active development</p>
          </div>
          <div className={styles.portraitArea}>
            <ProjectVisual projectId={shown.id} hero />
            <div className={styles.photoFrame}>
              {portraitFailed ? <div className={styles.portraitFallback}>Brandon’s portrait is temporarily unavailable.</div> : <img src={base + 'brandon-about.jpg'} alt="Brandon Hann in a casual portrait" onError={() => setPortraitFailed(true)} />}
              <div className={styles.photoCaption}><span>Brandon, outside the editor</span><span>bh / 2026</span></div>
            </div>
            <Patch pose={patchPose} onActivate={() => reactPatch('wave')} />
          </div>
        </section>

        <section className={styles.projects} id="projects" aria-labelledby="projects-title">
          <div className={styles.sectionHeading}>
            <div><p className={styles.eyebrow}>02 / Things I’ve made</p><h2 id="projects-title">Selected work.</h2></div>
            <p>Experiments and products at different stages, with their status stated plainly.</p>
          </div>
          <p id="project-explorer-help" className={styles.projectHelp}>Choose a project to read its verified overview and links. Focus or hover previews another project.</p>
          <div className={styles.explorer}>
            <div className={styles.projectList} role="group" aria-label="Featured projects">
              {showcase.map((item, index) => (
                <div className={styles.projectItem} key={item.id}>
                  {item.id === 'project-cura' && <span className={styles.anchor} id={legacyAnchors.cura} aria-hidden="true" />}
                  {item.id === 'project-oddworks' && <span className={styles.anchor} id={legacyAnchors.oddworks} aria-hidden="true" />}
                  <button
                    id={item.id}
                    type="button"
                    className={styles.projectButton}
                    data-selected={selectedId === item.id}
                    data-preview={previewId === item.id}
                    aria-pressed={selectedId === item.id}
                    aria-controls="project-preview"
                    aria-describedby="project-explorer-help"
                    onPointerEnter={() => { setPreviewId(item.id); reactPatch('inspect'); }}
                    onPointerLeave={() => setPreviewId(null)}
                    onFocus={() => { setPreviewId(item.id); reactPatch('inspect'); }}
                    onBlur={() => setPreviewId(null)}
                    onClick={() => chooseProject(item.id)}
                  >
                    <span className={styles.projectIndex}>{String(index + 1).padStart(2, '0')}</span>
                    <span className={styles.projectName}><strong>{item.name}</strong><small>{item.status}</small></span>
                    <span className={styles.projectArrow} aria-hidden="true">↗</span>
                  </button>
                </div>
              ))}
              <span className={styles.anchor} id={legacyAnchors.threatgrid} aria-hidden="true" />
            </div>
            <section ref={previewRef} id="project-preview" className={styles.projectPreview} tabIndex={-1} aria-label={`${shown.name} project preview`}>
              <ProjectVisual projectId={shown.id} />
              <div className={styles.previewContent}>
                <p className={styles.previewStatus}>{shown.status}</p>
                <h3>{shown.name}</h3>
                <p>{shown.summary}</p>
                {shown.links.length ? <div className={styles.previewLinks}>{shown.links.map((link) => <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">{link.label} ↗</a>)}</div> : <p className={styles.noDemo}>Public overview only · no demo or public source link</p>}
              </div>
            </section>
          </div>
          <p className={styles.selectionAnnouncement} aria-live="polite">Selected project: {showcase.find((item) => item.id === selectedId)?.name}</p>
        </section>

        <div className={styles.quickLinks}>
          <section id="about"><p className={styles.eyebrow}>03 / About</p><h2>Curiosity is the through-line.</h2><p>{profile.intro}</p></section>
          <section id="skills"><p className={styles.eyebrow}>04 / Skills</p><h2>Tools I reach for.</h2><p>{skillGroups.map((group) => group.items.slice(0, 3).join(' · ')).join(' / ')}</p></section>
          <section id="contact"><span className={styles.anchor} id="contributions" aria-hidden="true" /><p className={styles.eyebrow}>05 / Contact</p><h2>Let’s connect.</h2><div className={styles.contactLinks}><a href="https://github.com/Spook65" target="_blank" rel="noopener noreferrer">GitHub ↗</a><a href="https://www.linkedin.com/in/bhanncs/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><a href={base + 'assets/resume/Brandon-Hann-Resume.pdf'} download="Brandon-Hann-Resume.pdf">Download PDF ↓</a></div></section>
        </div>

        <aside className={styles.innerInvitation} aria-labelledby="inner-title">
          <div><p className={styles.eyebrow}>An optional side door</p><h2 id="inner-title">The Inner Workings.</h2><p>An optional cinematic journey through the Guardian to the connections behind the work. The main portfolio is always available here.</p></div>
          <a href={`${base}?experience=guardian`}>Enter The Inner Workings <span aria-hidden="true">↗</span></a>
        </aside>
      </main>
      <footer className={styles.footer}>The Builder’s Logbook · Built by Brandon Hann</footer>
    </div>
  );
}
