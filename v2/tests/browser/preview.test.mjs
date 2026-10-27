import assert from 'node:assert/strict';
import test from 'node:test';
import { chromium } from 'playwright';

const site = process.env.PORTFOLIO_PREVIEW_URL ?? 'http://127.0.0.1:4173/brandonhann.github.io/';

test('production preview works at the GitHub Pages subpath across widths', async () => {
  const browser = await chromium.launch();
  try {
    for (const width of [360, 390, 768, 1280]) {
      const page = await browser.newPage({ viewport: { width, height: 800 }, reducedMotion: 'reduce' });
      const response = await page.goto(site);
      assert.equal(response?.status(), 200);
      await page.getByRole('heading', { name: /Hey, I’m Brandon\./, level: 1 }).waitFor();

      const layout = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        scroll: document.documentElement.scrollWidth,
        sections: [...document.querySelectorAll('main section')].map((section) => ({
          id: section.id,
          opacity: getComputedStyle(section).opacity,
          visibility: getComputedStyle(section).visibility,
        })),
      }));
      assert.ok(layout.scroll <= layout.viewport + 1, `horizontal overflow at ${width}px: ${layout.scroll} > ${layout.viewport}`);
      assert.ok(layout.sections.length >= 5);
      assert.ok(layout.sections.every((section) => section.opacity === '1' && section.visibility === 'visible'));
      await page.close();
    }
  } finally {
    await browser.close();
  }
});

test('direct legacy hash navigation and static assets work', async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.goto(`${site}#project-cuda-mandelbrot`);
    await page.getByRole('heading', { name: 'Cura' }).waitFor();
    assert.ok(await page.locator('#project-cuda-mandelbrot').count());
    assert.equal(await page.getByRole('button', { name: /Cura/ }).getAttribute('aria-pressed'), 'true');

    for (const path of ['favicon.svg', 'brandon-about.jpg', 'assets/resume/Brandon-Hann-Resume.pdf']) {
      const response = await page.request.get(`${site}${path}`);
      assert.equal(response.status(), 200, `${path} did not load`);
      assert.ok((await response.body()).length > 0, `${path} is empty`);
    }

    const imageLoaded = await page.evaluate((url) => new Promise((resolve) => {
      const image = new Image();
      image.onload = () => resolve(image.naturalWidth > 0);
      image.onerror = () => resolve(false);
      image.src = url;
    }), `${site}brandon-about.jpg`);
    assert.equal(imageLoaded, true, 'social image failed to decode');

    await page.goto(site);
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('link', { name: 'Download PDF' }).first().click();
    const download = await downloadPromise;
    assert.equal(download.suggestedFilename(), 'Brandon-Hann-Resume.pdf');

    const resume = await browser.newPage({ javaScriptEnabled: false });
    await resume.goto(`${site}resume.html`);
    assert.ok(await resume.getByRole('heading', { name: 'Brandon Hann', level: 1 }).isVisible());
    assert.ok(await resume.getByRole('link', { name: 'Download PDF' }).isVisible());
    assert.equal(await resume.getByRole('link', { name: 'Download PDF' }).getAttribute('href'), 'assets/resume/Brandon-Hann-Resume.pdf');
    await resume.close();
    await page.close();
  } finally {
    await browser.close();
  }
});
