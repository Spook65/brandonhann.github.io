import assert from 'node:assert/strict';
import test from 'node:test';
import { chromium } from 'playwright';

const site = process.env.PORTFOLIO_PREVIEW_URL ?? 'http://127.0.0.1:4173/brandonhann.github.io/';
const phase = (page, name) => page.locator(`[data-phase="${name}"]`);

test('homepage remains usable without downloading the optional world', async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    const requests = [];
    page.on('request', (request) => requests.push(request.url()));
    await page.goto(site);
    await page.getByRole('heading', { name: /Hey, I’m Brandon/ }).waitFor();
    assert.ok(await page.getByRole('link', { name: /Explore projects/ }).isVisible());
    assert.ok(await page.getByRole('link', { name: /Read résumé/ }).isVisible());
    assert.equal(requests.some((url) => /SecurityOutpost-.*\.(js|css)$/.test(url)), false);
    assert.equal(requests.some((url) => /guardian-organic|human-core-chamber/.test(url)), false);
  } finally { await browser.close(); }
});

test('outpost entry is useful without JavaScript or homepage portrait media', async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ javaScriptEnabled: false });
    const requests = [];
    page.on('request', (request) => requests.push(request.url()));
    await page.goto(`${site}outpost.html`);
    assert.ok(await page.getByRole('heading', { name: /Every request meets a rule/ }).isVisible());
    assert.ok(await page.getByRole('link', { name: 'Projects' }).isVisible());
    assert.ok(await page.getByRole('link', { name: 'Résumé' }).isVisible());
    assert.equal(requests.some((url) => /brandon-about|guardian-organic|SecurityOutpost/.test(url)), false);
  } finally { await browser.close(); }
});

test('one opening demonstration delivers the allowed sample and then rests', async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(`${site}outpost.html`);
    await page.locator('canvas').waitFor();
    await phase(page, 'pickup').waitFor({ timeout: 3000 });
    await phase(page, 'travel').waitFor();
    await phase(page, 'allow').waitFor({ timeout: 6000 });
    assert.ok(await page.getByText(/Trust gate \/ open/).isVisible());
    assert.ok(await page.locator('[data-bubble="sentinel"][data-visible="true"]').isVisible());
    await phase(page, 'audit').waitFor({ timeout: 6000 });
    await phase(page, 'idle').waitFor({ timeout: 6000 });
    await page.waitForTimeout(1100);
    assert.equal(await phase(page, 'idle').count(), 1, 'opening demonstration should not repeat');
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
});

test('reduced motion requires an explicit choice; deny remains blocked and replayable', async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    await page.goto(`${site}outpost.html`);
    await page.locator('canvas').waitFor();
    await page.waitForTimeout(900);
    assert.equal(await phase(page, 'idle').count(), 1);
    await page.getByRole('button', { name: /Try protected export/ }).click();
    await phase(page, 'deny').waitFor({ timeout: 6000 });
    assert.ok(await page.getByText(/Trust gate \/ locked/).isVisible());
    await phase(page, 'audit').waitFor({ timeout: 6000 });
    await page.getByText('What happened at the checkpoint').click();
    assert.match(await page.locator('details').innerText(), /Policy: DENY/);
    assert.match(await page.locator('details').innerText(), /BLOCKED/);
    await phase(page, 'idle').waitFor({ timeout: 6000 });
    await page.getByRole('button', { name: 'Replay last request' }).click();
    await phase(page, 'deny').waitFor({ timeout: 6000 });
  } finally { await browser.close(); }
});

test('pause, reset, pointer pickup, and browser Back remain reversible', async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    await page.goto(site);
    await page.getByRole('link', { name: /Enter the outpost/ }).click();
    await page.locator('canvas').waitFor();
    const packet = await page.evaluate(() => {
      const host = document.querySelector('[data-render-status]');
      const bounds = host.outpostInspection().objects.packet;
      const rect = host.getBoundingClientRect();
      return { x: rect.left + (bounds.left + bounds.right) / 2, y: rect.top + (bounds.top + bounds.bottom) / 2 };
    });
    await page.mouse.click(packet.x, packet.y);
    await phase(page, 'pickup').waitFor();
    await page.getByRole('button', { name: 'Pause' }).click();
    await page.waitForTimeout(1100);
    assert.equal(await phase(page, 'pickup').count(), 1);
    await page.getByRole('button', { name: 'Resume' }).click();
    await phase(page, 'travel').waitFor();
    await page.getByRole('button', { name: 'Reset' }).click();
    assert.equal(await phase(page, 'idle').count(), 1);
    await page.goBack();
    await page.getByRole('heading', { name: /Hey, I’m Brandon/ }).waitFor();
    await page.goForward();
    await page.locator('canvas').waitFor();
    assert.equal(await phase(page, 'idle').count(), 1);
  } finally { await browser.close(); }
});

test('the transaction waits while its world is offscreen, then resumes', async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    await page.goto(`${site}outpost.html`);
    await page.locator('canvas').waitFor();
    await page.getByRole('button', { name: 'Try read-only request' }).click();
    await phase(page, 'pickup').waitFor();
    await page.evaluate(() => {
      const spacer = document.createElement('div');
      spacer.style.height = '1600px';
      document.body.append(spacer);
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(1250);
    assert.equal(await phase(page, 'pickup').count(), 1);
    await page.evaluate(() => window.scrollTo(0, 0));
    await phase(page, 'travel').waitFor({ timeout: 4000 });
  } finally { await browser.close(); }
});

test('touch and keyboard can reach the scene outcome without losing mobile context', async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
    await page.goto(`${site}outpost.html`);
    await page.locator('canvas').waitFor();
    await page.getByRole('button', { name: /Try protected export/ }).tap();
    await phase(page, 'deny').waitFor({ timeout: 6000 });
    assert.ok(await page.locator('[data-bubble="sentinel"][data-visible="true"]').isVisible());
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1), true);
    await phase(page, 'idle').waitFor({ timeout: 6000 });
    const replay = page.getByRole('button', { name: 'Replay last request' });
    await replay.focus();
    await page.keyboard.press('Enter');
    await phase(page, 'pickup').waitFor();
    await page.getByRole('link', { name: 'Résumé' }).tap();
    await page.waitForURL(/resume\.html$/);
  } finally { await browser.close(); }
});

test('scene bounds, actor facing, and dialogue stay clear at 320, 390, 768, and 1440 pixels', async () => {
  const browser = await chromium.launch();
  try {
    for (const width of [320, 390, 768, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: width < 600 ? 844 : 900 }, reducedMotion: 'reduce' });
      await page.goto(`${site}outpost.html`);
      await page.locator('canvas').waitFor();
      const inspect = () => page.evaluate(() => document.querySelector('[data-render-status]').outpostInspection());
      const assertSafe = async (state) => {
        const sample = await inspect();
        for (const name of ['scout', 'sentinel', 'packet', 'gate', 'barrier', 'nearRail', 'farRail', 'water', 'inlet', 'basin', 'audit']) {
          const box = sample.objects[name];
          assert.ok(box.left >= -1 && box.right <= sample.width + 1 && box.top >= -1 && box.bottom <= sample.height + 1, `${width}px ${state}: ${name} clipped ${JSON.stringify(box)}`);
        }
        for (const box of sample.bubbles) {
          assert.ok(box.left >= 0 && box.right <= sample.width && box.top >= 0 && box.bottom <= sample.height, `${width}px ${state}: dialogue outside scene`);
        }
        const bubbleClearance = await page.evaluate(() => {
          const label = document.querySelector('[data-gate-label]');
          const visible = document.querySelector('[data-bubble][data-visible="true"]');
          if (!label || !visible) return true;
          const a = label.getBoundingClientRect();
          const b = visible.getBoundingClientRect();
          return a.right <= b.left || b.right <= a.left || a.bottom <= b.top || b.bottom <= a.top;
        });
        assert.equal(bubbleClearance, true, `${width}px ${state}: dialogue overlaps gate status`);
        const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
        assert.equal(horizontalOverflow, false, `${width}px ${state}: horizontal overflow`);
        return sample;
      };
      await assertSafe('idle');
      await page.getByRole('button', { name: 'Try read-only request' }).click();
      await phase(page, 'examine').waitFor();
      const examination = await assertSafe('examine');
      assert.ok(examination.facing.scoutToSentinel > .8 && examination.facing.sentinelToScout > .8, `${width}px: actors must face each other`);
      assert.ok(examination.world.packetX < 1.0 && examination.world.gateBottomY < .1);
      await phase(page, 'allow').waitFor();
      const allowed = await assertSafe('allow');
      assert.ok(allowed.world.packetX > 1.35 && allowed.world.gateBottomY > 1.4);
      await page.getByRole('button', { name: 'Reset' }).click();
      await page.getByRole('button', { name: 'Try protected export' }).click();
      await phase(page, 'deny').waitFor();
      const denied = await assertSafe('deny');
      assert.ok(denied.world.packetX < 1.0 && denied.world.gateBottomY < .1);
      await page.close();
    }
  } finally { await browser.close(); }
});

test('the gate opens before passage and stays open while Scout returns', async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
    await page.goto(`${site}outpost.html`);
    await page.locator('canvas').waitFor();
    await page.getByRole('button', { name: 'Try read-only request' }).click();
    const readings = await page.evaluate(async () => {
      const host = document.querySelector('[data-render-status]');
      const samples = [];
      for (let index = 0; index < 145; index++) {
        samples.push(host.outpostInspection());
        await new Promise((resolve) => setTimeout(resolve, 60));
      }
      return samples;
    });
    assert.ok(readings.some((sample) => sample.phase === 'allow' && sample.world.packetX > 1.35));
    for (const sample of readings) {
      const { scoutX, packetX, packetY, packetVisible, gateBottomY } = sample.world;
      if (packetVisible && packetX + .26 >= 1.295 && packetX - .26 <= 1.405) {
        assert.ok(gateBottomY > packetY + .13, `packet touched a closed barrier in ${sample.phase}`);
      }
      if (scoutX + .32 >= 1.295 && scoutX - .32 <= 1.405) {
        assert.ok(gateBottomY > 1.42, `Scout touched a closing barrier in ${sample.phase}`);
      }
    }
  } finally { await browser.close(); }
});

test('WebGL failure retains the semantic simulation and direct links', async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    await page.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (type, ...args) {
        if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl') return null;
        return original.call(this, type, ...args);
      };
    });
    await page.goto(`${site}outpost.html`);
    await page.getByText('The scene is unavailable.').waitFor();
    await page.getByRole('button', { name: /Try protected export/ }).click();
    await phase(page, 'deny').waitFor({ timeout: 6000 });
    assert.ok(await page.getByRole('link', { name: 'Projects' }).isVisible());
  } finally { await browser.close(); }
});
