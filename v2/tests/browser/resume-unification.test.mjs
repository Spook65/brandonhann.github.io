import assert from 'node:assert/strict';
import test from 'node:test';
import { chromium } from 'playwright';

const site = process.env.PORTFOLIO_PREVIEW_URL ?? 'http://127.0.0.1:4173/brandonhann.github.io/';

test('standalone résumé keeps homepage navigation and PDF usable without JavaScript', async () => {
  const browser = await chromium.launch();
  try {
    for (const width of [320, 390, 900, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, javaScriptEnabled: false });
      const requests = [];
      page.on('request', (request) => requests.push(request.url()));
      assert.equal((await page.goto(`${site}resume.html`))?.status(), 200);
      assert.ok(await page.getByRole('heading', { name: 'Résumé.', level: 1 }).isVisible());
      assert.equal(await page.getByRole('navigation', { name: 'Primary navigation' }).getByRole('link').count(), 4);
      assert.equal(await page.getByRole('link', { name: 'Résumé', exact: true }).getAttribute('aria-current'), 'page');
      assert.equal(await page.getByRole('link', { name: 'Brandon Hann, homepage' }).getAttribute('href'), './');
      assert.equal(await page.getByRole('link', { name: 'Projects', exact: true }).getAttribute('href'), './#projects');
      assert.equal(await page.getByRole('link', { name: 'Contact', exact: true }).getAttribute('href'), './#contact');
      assert.equal(await page.getByRole('link', { name: 'GitHub ↗', exact: true }).getAttribute('href'), 'https://github.com/Spook65');
      const pdfPath = 'assets/resume/Brandon-Hann-Resume.pdf';
      assert.equal(await page.getByRole('link', { name: 'Open PDF', exact: true }).getAttribute('href'), pdfPath);
      assert.equal(await page.getByRole('link', { name: 'Download PDF' }).getAttribute('download'), 'Brandon-Hann-Resume.pdf');
      assert.equal(await page.getByTitle('Brandon Hann résumé PDF preview').getAttribute('src'), `${pdfPath}#view=FitH`);
      assert.equal((await page.request.get(`${site}${pdfPath}`)).status(), 200);
      const layout = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        targets: [...document.querySelectorAll('.site-header a, .resume-hero-actions a')]
          .map((link) => ({ label: link.textContent.trim(), height: link.getBoundingClientRect().height })),
      }));
      assert.equal(layout.overflow, false, `horizontal overflow at ${width}px`);
      assert.ok(layout.targets.every(({ height }) => height >= 44), `small touch target at ${width}px: ${JSON.stringify(layout.targets)}`);
      assert.equal(requests.some((url) => /\.js(?:\?|$)|Guardian|SignalHero|three/i.test(url)), false);
      await page.close();
    }
  } finally { await browser.close(); }
});

test('résumé links retain native homepage hashes, history, and focus visibility', async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
    await page.goto(`${site}resume.html`);
    const projectLink = page.getByRole('navigation', { name: 'Primary navigation' }).getByRole('link', { name: 'Projects' });
    await projectLink.focus();
    assert.equal(await projectLink.evaluate((node) => node.matches(':focus-visible')), true);
    assert.notEqual(await projectLink.evaluate((node) => getComputedStyle(node).outlineStyle), 'none');
    await projectLink.click();
    await page.waitForURL(/#projects$/);
    assert.ok(await page.getByRole('heading', { name: 'The work, beneath the surface.' }).isVisible());
    await page.goBack();
    await page.waitForURL(/resume\.html$/);
    await page.getByRole('link', { name: 'Contact', exact: true }).click();
    await page.waitForURL(/#contact$/);
    await page.goBack();
    await page.waitForURL(/resume\.html$/);
    await page.getByRole('link', { name: 'Brandon Hann, homepage' }).click();
    await page.waitForURL(site);
    await page.close();
  } finally { await browser.close(); }
});

test('résumé PDF actions open a new tab and download the expected filename', async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ javaScriptEnabled: false, acceptDownloads: true });
    await page.goto(`${site}resume.html`);
    const popupPromise = page.waitForEvent('popup');
    await page.getByRole('link', { name: 'Open PDF', exact: true }).click();
    const popup = await popupPromise;
    assert.equal(await page.getByRole('link', { name: 'Open PDF', exact: true }).getAttribute('target'), '_blank');
    assert.equal((await page.request.get(`${site}assets/resume/Brandon-Hann-Resume.pdf`)).status(), 200);
    await popup.close();
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('link', { name: 'Download PDF' }).click();
    const download = await downloadPromise;
    assert.equal(download.suggestedFilename(), 'Brandon-Hann-Resume.pdf');
    await page.close();
  } finally { await browser.close(); }
});
