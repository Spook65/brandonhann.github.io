(function () {
  function onReady(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback, { once: true });
      return;
    }

    callback();
  }

  async function forceDownload(url, filename) {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error('Download failed');
    }

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(blobUrl);
  }

  function setupLoadedState() {
    window.setTimeout(() => {
      document.body.classList.add('loaded');
    }, 250);
  }

  function setupImageFallbacks() {
    document.querySelectorAll('[data-fallback-hide]').forEach((image) => {
      image.addEventListener('error', () => {
        image.style.display = 'none';
        if (image.parentElement) {
          image.parentElement.style.border = 'none';
        }
      }, { once: true });
    });
  }

  function setupResumeDownloadLinks() {
    document.querySelectorAll('[data-force-download-pdf]').forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        forceDownload(link.href, link.getAttribute('download') || 'Brandon-Hann-Resume.pdf').catch(() => {
          window.location.href = link.href;
        });
      });
    });
  }

  function setupResumeYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

  function setupHeroTypewriter() {
    const roles = [
      'Computer Science Student',
      'Cybersecurity',
      'AI Ethics'
    ];

    const el = document.getElementById('hero-role-text');
    if (!el) return;

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function tick() {
      const current = roles[roleIndex];

      if (isDeleting) {
        charIndex = Math.max(charIndex - 1, 0);
        el.textContent = current.slice(0, charIndex);
      } else {
        charIndex = Math.min(charIndex + 1, current.length);
        el.textContent = current.slice(0, charIndex);
      }

      let delay = isDeleting ? 30 : 60;

      if (!isDeleting && charIndex === current.length) {
        delay = 2200;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 240;
      }

      window.setTimeout(tick, delay);
    }

    tick();
  }

  function setupThreeBackground() {
    if (!window.THREE) {
      return;
    }

    const canvas = document.querySelector('#bg-canvas');
    if (!canvas) {
      return;
    }

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geometry = new THREE.PlaneGeometry(2, 2);

    const uniforms = {
      u_time: { value: 0 },
      u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      u_mouse: { value: new THREE.Vector2(0.5, 0.5) }
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;

        uniform float u_time;
        uniform vec2 u_resolution;
        uniform vec2 u_mouse;

        varying vec2 vUv;

        float hash(vec2 p){
          return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453123);
        }

        float grid(vec2 uv, float scale){
          vec2 g = fract(uv * scale);
          vec2 lines = smoothstep(0.0, 0.02, abs(g - 0.5));
          return 1.0 - min(lines.x, lines.y);
        }

        void main() {
          vec2 uv = vUv;

          vec2 pos = uv - 0.5;
          pos.x *= u_resolution.x / u_resolution.y;

          vec2 mouse = (u_mouse - 0.5) * 0.03;
          pos += mouse;

          vec3 color = vec3(0.02, 0.04, 0.06);

          float g1 = grid(uv + u_time * 0.01, 18.0);
          float g2 = grid(uv - u_time * 0.005, 36.0) * 0.5;
          float gridField = g1 + g2;
          color += gridField * 0.08;

          float dist = length(pos);
          float light = 0.15 / (dist + 0.3);
          vec3 accent = vec3(0.23, 0.62, 1.0);
          color += light * accent * 0.25;

          float flow = sin(pos.x * 3.0 + u_time * 0.3) * 0.02;
          color += flow;

          float scan = sin(uv.y * u_resolution.y * 0.5 + u_time * 2.0);
          color += scan * 0.005;

          float n = hash(uv * u_resolution.xy + u_time);
          color += (n - 0.5) * 0.02;

          float vignette = smoothstep(0.9, 0.2, dist);
          color *= vignette;

          gl_FragColor = vec4(color, 1.0);
        }
      `
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    window.addEventListener('mousemove', (event) => {
      uniforms.u_mouse.value.x = event.clientX / window.innerWidth;
      uniforms.u_mouse.value.y = 1.0 - (event.clientY / window.innerHeight);
    });

    window.addEventListener('resize', () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
    });

    function animate(time) {
      uniforms.u_time.value = time * 0.001;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    animate();
  }

  function setupNavbarAndScrolling() {
    const navbar = document.getElementById('navbar');
    const progressBar = document.getElementById('scroll-progress');
    const spotlight = document.getElementById('cursor-spotlight');
    const cursor = document.getElementById('cursor');
    const cursorRing = document.getElementById('cursor-ring');
    const navToggle = document.querySelector('[data-nav-toggle]');
    const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
    const mobileNavLinks = Array.from(document.querySelectorAll('[data-mobile-nav-link]'));
    const navLinks = Array.from(document.querySelectorAll('.nav-link'));
    const sectionIds = ['about', 'projects', 'skills', 'resume', 'contact'];
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    const projectsBusVisual = document.querySelector('.projects-bus-visual');
    const projectsBusGraph = document.querySelector('[data-bus-graph]');
    const projectsBusNode = document.querySelector('[data-bus-node]');
    const projectBusCards = Array.from(document.querySelectorAll('[data-bus-card]'));
    const fallbackHideImages = Array.from(document.querySelectorAll('[data-fallback-hide]'));
    const projectRows = Array.from(document.querySelectorAll('[data-project-target]'));
    const isTouchDevice = navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches;

    if (spotlight) {
      spotlight.style.left = `${Math.max(window.innerWidth / 2 - 300, 0)}px`;
      spotlight.style.top = `${Math.max(window.innerHeight / 3 - 300, 0)}px`;
    }

    if (isTouchDevice) {
      document.body.classList.add('touch-device');
    }

    fallbackHideImages.forEach((image) => {
      image.addEventListener('error', () => {
        image.style.display = 'none';
        if (image.parentElement) {
          image.parentElement.style.border = 'none';
        }
      }, { once: true });
    });

    const closeMobileNav = () => {
      if (!navToggle || !mobileNavOverlay) return;
      mobileNavOverlay.classList.remove('open');
      mobileNavOverlay.setAttribute('aria-hidden', 'true');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    const openMobileNav = () => {
      if (!navToggle || !mobileNavOverlay) return;
      mobileNavOverlay.classList.add('open');
      mobileNavOverlay.setAttribute('aria-hidden', 'false');
      navToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    };

    if (navToggle && mobileNavOverlay) {
      navToggle.addEventListener('click', () => {
        if (mobileNavOverlay.classList.contains('open')) {
          closeMobileNav();
        } else {
          openMobileNav();
        }
      });

      mobileNavOverlay.addEventListener('click', (event) => {
        if (event.target === mobileNavOverlay) {
          closeMobileNav();
        }
      });

      mobileNavLinks.forEach((link) => {
        link.addEventListener('click', () => {
          closeMobileNav();
        });
      });

      window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          closeMobileNav();
        }
      });

      window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
          closeMobileNav();
        }
      });
    }

    function setScrolledState() {
      if (!navbar) return;
      navbar.classList.toggle('scrolled', window.scrollY > 80);
    }

    function updateScrollProgress() {
      if (!progressBar) return;
      const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollMax > 0 ? Math.min(Math.max(window.scrollY / scrollMax, 0), 1) : 0;
      progressBar.style.transform = `scaleX(${progress})`;
    }

    let activeSectionId = '';

    const linkById = new Map(
      navLinks
        .map((link) => [link.getAttribute('href')?.slice(1), link])
        .filter(([id]) => Boolean(id))
    );

    const updateActiveSection = () => {
      if (!sections.length || !navbar) return;

      const navbarHeight = navbar.getBoundingClientRect().height;
      const anchorY = Math.min(Math.max(window.innerHeight * 0.33, navbarHeight + 12), window.innerHeight * 0.5);
      const viewportY = window.scrollY + anchorY;
      const reachedPageBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;

      let nextActive = reachedPageBottom ? sections[sections.length - 1].id : sections[0].id;

      for (const section of sections) {
        if (section.offsetTop <= viewportY) {
          nextActive = section.id;
        } else {
          break;
        }
      }

      if (nextActive === activeSectionId) return;
      activeSectionId = nextActive;

      navLinks.forEach((link) => link.classList.remove('active'));
      const activeLink = linkById.get(nextActive);
      if (activeLink) activeLink.classList.add('active');
    };

    if (navbar) {
      setScrolledState();
      window.addEventListener('scroll', setScrolledState, { passive: true });
    }

    updateScrollProgress();
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    window.addEventListener('resize', updateScrollProgress);

    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection);

    if (!isTouchDevice && cursor && cursorRing) {
      document.body.classList.add('custom-cursor');

      let mouseX = window.innerWidth / 2;
      let mouseY = window.innerHeight / 2;
      let ringX = mouseX;
      let ringY = mouseY;
      let hovering = false;

      const hoverTargets = 'a, button, [role="button"], .project-bus-card, .contact-card';

      const setHovering = (state) => {
        hovering = state;
        cursor.classList.toggle('hovering', state);
        cursorRing.classList.toggle('hovering', state);
      };

      document.addEventListener('mousemove', (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
        cursor.style.left = `${mouseX}px`;
        cursor.style.top = `${mouseY}px`;
        if (spotlight) {
          spotlight.style.left = `${mouseX - 300}px`;
          spotlight.style.top = `${mouseY - 300}px`;
        }
      });

      document.addEventListener('mouseover', (event) => {
        if (event.target instanceof Element) {
          setHovering(Boolean(event.target.closest(hoverTargets)));
        }
      });

      document.addEventListener('mousedown', () => {
        cursor.classList.add('mousedown');
      });

      document.addEventListener('mouseup', () => {
        cursor.classList.remove('mousedown');
      });

      document.addEventListener('mouseout', (event) => {
        if (!event.relatedTarget || !(event.relatedTarget instanceof Element) || !event.relatedTarget.closest(hoverTargets)) {
          setHovering(false);
        }
      });

      const animateCursor = () => {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        cursorRing.style.left = `${ringX}px`;
        cursorRing.style.top = `${ringY}px`;
        requestAnimationFrame(animateCursor);
      };

      animateCursor();
    }

    const headingObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '0px 0px -10% 0px'
    });

    document.querySelectorAll('h2').forEach((heading) => {
      const text = heading.textContent?.trim();
      if (!text || heading.dataset.splitWords === 'true') return;

      heading.dataset.splitWords = 'true';
      heading.classList.add('split-heading');
      heading.innerHTML = text
        .split(/\s+/)
        .map((word, index) => `<span class="split-word" style="--word-index:${index}">${word}</span>`)
        .join(' ');
      headingObserver.observe(heading);
    });

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.15
    });

    document.querySelectorAll('.reveal').forEach((element) => {
      revealObserver.observe(element);
    });

    if (projectsBusVisual && projectsBusGraph && projectsBusNode && projectBusCards.length >= 3) {
      const updateProjectsBusGraph = () => {
        if (window.innerWidth <= 1280) return;

        const containerRect = projectsBusVisual.getBoundingClientRect();
        const nodeRect = projectsBusNode.getBoundingClientRect();
        const cardRects = projectBusCards.slice(0, 3).map((card) => card.getBoundingClientRect());

        if (cardRects.some((rect) => rect.width === 0 || rect.height === 0)) return;

        const relX = (value) => value - containerRect.left;
        const relY = (value) => value - containerRect.top;

        const nodeRight = relX(nodeRect.right);
        const nodeMidY = relY(nodeRect.top + (nodeRect.height * 0.5));
        const cardLeft = Math.min(...cardRects.map((rect) => relX(rect.left)));
        const cardRight = Math.max(...cardRects.map((rect) => relX(rect.right)));
        const cardMidYs = cardRects.map((rect) => relY(rect.top + (rect.height * 0.5)));
        const topY = Math.min(...cardMidYs);
        const midY = cardMidYs[1] ?? cardMidYs[0];
        const bottomY = Math.max(...cardMidYs);
        const gap = Math.max(cardLeft - nodeRight, 180);
        const forkX = nodeRight + Math.min(gap * 0.48, 170);
        const branchX = Math.min(cardLeft + 14, cardRight - 40);
        const svgWidth = containerRect.width;
        const svgHeight = containerRect.height;

        projectsBusGraph.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`);
        projectsBusGraph.setAttribute('preserveAspectRatio', 'none');
        projectsBusGraph.innerHTML = `
          <defs>
            <filter id="busGlowWide" x="0" y="0" width="${svgWidth}" height="${svgHeight}" filterUnits="userSpaceOnUse">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path class="bus-wire bus-wire-base" d="M ${nodeRight} ${nodeMidY} H ${forkX}" />
          <path class="bus-wire bus-wire-base" d="M ${forkX} ${topY} V ${bottomY}" />
          <path class="bus-wire bus-wire-base" d="M ${forkX} ${topY} H ${branchX}" />
          <path class="bus-wire bus-wire-base" d="M ${forkX} ${midY} H ${branchX}" />
          <path class="bus-wire bus-wire-base" d="M ${forkX} ${bottomY} H ${branchX}" />
          <path class="bus-wire bus-wire-flow" d="M ${nodeRight} ${nodeMidY} H ${forkX}" />
          <path class="bus-wire bus-wire-flow" d="M ${forkX} ${topY} V ${bottomY}" />
          <path class="bus-wire bus-wire-flow" d="M ${forkX} ${topY} H ${branchX}" />
          <path class="bus-wire bus-wire-flow" d="M ${forkX} ${midY} H ${branchX}" />
          <path class="bus-wire bus-wire-flow" d="M ${forkX} ${bottomY} H ${branchX}" />
        `;
      };

      const scheduleBusUpdate = () => {
        requestAnimationFrame(updateProjectsBusGraph);
      };

      scheduleBusUpdate();
      window.addEventListener('resize', scheduleBusUpdate);
      window.addEventListener('scroll', scheduleBusUpdate, { passive: true });
      if (window.ResizeObserver) {
        const busObserver = new ResizeObserver(scheduleBusUpdate);
        busObserver.observe(projectsBusVisual);
        projectBusCards.forEach((card) => busObserver.observe(card));
      }
    }

    projectRows.forEach((row) => {
      row.addEventListener('click', () => {
        const targetId = row.getAttribute('data-project-target');
        if (!targetId) return;
        const target = document.getElementById(targetId);
        if (!target) return;
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', (event) => {
        const href = link.getAttribute('href');
        if (!href || !href.startsWith('#')) return;
        const target = document.querySelector(href);
        if (!target) return;

        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    const funRow = document.querySelector('.fun-row');
    if (funRow && !isTouchDevice) {
      funRow.addEventListener('wheel', (event) => {
        if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
          event.preventDefault();
          funRow.scrollLeft += event.deltaY;
        }
      }, { passive: false });
    }

    const metricGrid = document.querySelector('[data-metric-grid]');
    if (metricGrid) {
      const metricValues = Array.from(metricGrid.querySelectorAll('[data-count-target]'));
      const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
      let metricTriggered = false;

      const animateMetric = (element) => {
        const target = Number(element.dataset.countTarget || '0');
        const duration = Number(element.dataset.countDuration || '1000');
        const decimals = Number(element.dataset.countDecimals || '0');
        const suffix = element.dataset.countSuffix || '';
        const step = Number(element.dataset.countStep || '0');
        const start = performance.now();

        const frame = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = easeOutExpo(progress);
          const currentValue = target * eased;

          if (decimals > 0) {
            const stepped = step > 0
              ? Math.min(target, Math.round(currentValue / step) * step)
              : Math.min(target, currentValue);
            element.textContent = `${stepped.toFixed(decimals)}${suffix}`;
          } else {
            element.textContent = `${Math.min(target, Math.round(currentValue))}${suffix}`;
          }

          if (progress < 1) {
            requestAnimationFrame(frame);
          } else {
            element.textContent = `${target.toFixed(decimals)}${suffix}`;
          }
        };

        requestAnimationFrame(frame);
      };

      const metricObserver = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || metricTriggered) return;
          metricTriggered = true;
          metricValues.forEach((element) => animateMetric(element));
          observerInstance.disconnect();
        });
      }, {
        threshold: 0.5
      });

      metricObserver.observe(metricGrid);
    }

    const contributionsCount = document.getElementById('contrib-count');
    const contributionsGraph = document.getElementById('contrib-graph');
    const contributionsRange = document.getElementById('contrib-range');
    const contributionsApiUrl = 'https://github-contributions-api.jogruber.de/v4/Spook65?y=last';
    const contributionsFallbackImage = 'https://github-contributions.vercel.app/Spook65.svg';

    const formatDateKey = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const formatDateLabel = (date) => new Intl.DateTimeFormat(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);

    const animateContribCount = (targetValue, duration = 1400) => {
      if (!contributionsCount) return;
      const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
      const start = performance.now();

      const frame = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = easeOutExpo(progress);
        const value = Math.round(targetValue * eased);
        contributionsCount.textContent = value.toLocaleString();
        if (progress < 1) {
          requestAnimationFrame(frame);
        } else {
          contributionsCount.textContent = Number(targetValue).toLocaleString();
        }
      };

      requestAnimationFrame(frame);
    };

    const deriveLevel = (count, providedLevel) => {
      if (Number.isFinite(Number(providedLevel))) {
        return Math.max(0, Math.min(4, Number(providedLevel)));
      }

      if (count <= 0) return 0;
      if (count < 4) return 1;
      if (count < 8) return 2;
      if (count < 16) return 3;
      return 4;
    };

    const renderContributionFallback = () => {
      if (!contributionsGraph) return;
      contributionsGraph.innerHTML = '';

      const fallback = document.createElement('img');
      fallback.src = contributionsFallbackImage;
      fallback.alt = 'Live GitHub contribution graph for Spook65';
      fallback.loading = 'lazy';
      fallback.style.display = 'block';
      fallback.style.width = '100%';
      fallback.style.height = 'auto';
      contributionsGraph.appendChild(fallback);
    };

    const renderContributionHeatmap = (items) => {
      if (!contributionsGraph || !Array.isArray(items) || !items.length) {
        renderContributionFallback();
        return;
      }

      const normalized = items
        .map((entry) => {
          const date = new Date(`${entry.date}T12:00:00`);
          return {
            date,
            key: formatDateKey(date),
            count: Number(entry.count || 0),
            level: Number(entry.level || 0)
          };
        })
        .filter((entry) => !Number.isNaN(entry.date.getTime()))
        .sort((a, b) => a.date - b.date);

      if (!normalized.length) {
        renderContributionFallback();
        return;
      }

      const firstDate = normalized[0].date;
      const lastDate = normalized[normalized.length - 1].date;
      const start = new Date(firstDate);
      start.setDate(start.getDate() - start.getDay());
      start.setHours(12, 0, 0, 0);

      const end = new Date(lastDate);
      end.setDate(end.getDate() + (6 - end.getDay()));
      end.setHours(12, 0, 0, 0);

      const weekCount = Math.max(1, Math.ceil((end - start) / (7 * 24 * 60 * 60 * 1000)));
      contributionsGraph.innerHTML = '';
      contributionsGraph.style.setProperty('--contrib-columns', String(weekCount));
      contributionsGraph.style.aspectRatio = `${weekCount} / 7`;

      const lookup = new Map(normalized.map((entry) => [entry.key, entry]));
      const fragment = document.createDocumentFragment();

      for (let week = 0; week < weekCount; week += 1) {
        for (let day = 0; day < 7; day += 1) {
          const cellDate = new Date(start);
          cellDate.setDate(start.getDate() + (week * 7) + day);
          const key = formatDateKey(cellDate);
          const entry = lookup.get(key);
          const count = entry ? entry.count : 0;
          const level = deriveLevel(count, entry ? entry.level : 0);

          const cell = document.createElement('span');
          cell.className = `contribution-cell ${level > 0 ? `level-${level}` : ''}`.trim();
          cell.title = `${formatDateLabel(cellDate)}: ${count} contributions`;
          cell.setAttribute('aria-hidden', 'true');
          fragment.appendChild(cell);
        }
      }

      contributionsGraph.appendChild(fragment);

      if (contributionsRange) {
        const startLabel = new Intl.DateTimeFormat(undefined, { month: 'short', year: 'numeric' }).format(firstDate);
        const endLabel = new Intl.DateTimeFormat(undefined, { month: 'short', year: 'numeric' }).format(lastDate);
        contributionsRange.textContent = `${startLabel} → ${endLabel}`;
      }
    };

    if (contributionsCount || contributionsGraph || contributionsRange) {
      fetch(contributionsApiUrl, { cache: 'no-store' })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Contribution fetch failed with ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          const totals = data && typeof data === 'object' ? data.total || {} : {};
          const totalLastYear = Number(totals.lastYear ?? totals[String(new Date().getFullYear() - 1)] ?? 0);
          const fallbackTotal = Array.isArray(data.contributions)
            ? data.contributions.reduce((sum, entry) => sum + Number(entry.count || 0), 0)
            : 0;
          const countTarget = Number.isFinite(totalLastYear) && totalLastYear > 0 ? totalLastYear : fallbackTotal;
          if (contributionsCount && countTarget > 0) {
            animateContribCount(countTarget, 1200);
          }

          renderContributionHeatmap(Array.isArray(data.contributions) ? data.contributions : []);
        })
        .catch(() => {
          if (contributionsCount) {
            contributionsCount.textContent = '—';
          }
          if (contributionsRange) {
            contributionsRange.textContent = 'Live data unavailable right now';
          }
          renderContributionFallback();
        });
    }
  }

  onReady(() => {
    setupLoadedState();
    setupImageFallbacks();
    setupResumeDownloadLinks();
    setupResumeYear();
    setupHeroTypewriter();
    setupThreeBackground();
    setupNavbarAndScrolling();
  });
})();
