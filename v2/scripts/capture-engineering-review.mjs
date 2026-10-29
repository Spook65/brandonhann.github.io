import { chromium } from "playwright";
import { mkdir, rename, readdir } from "node:fs/promises";
const site =
  process.env.PORTFOLIO_PREVIEW_URL ??
  "http://127.0.0.1:4181/brandonhann.github.io/";
const out = new URL("../artifacts/h3a-review/", import.meta.url);
await mkdir(out, { recursive: true });
const b = await chromium.launch();
for (const width of [320, 390, 768, 1440]) {
  const p = await b.newPage({
    viewport: { width, height: 900 },
    reducedMotion: "reduce",
  });
  await p.goto(site);
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: new URL(`opening-${width}.png`, out).pathname });
  await p.locator("#projects").scrollIntoViewIfNeeded();
  await p.screenshot({ path: new URL(`projects-${width}.png`, out).pathname });
  await p.locator("#project-mapetite").scrollIntoViewIfNeeded();
  await p.locator("#project-mapetite summary").click();
  await p.screenshot({
    path: new URL(`case-study-${width}.png`, out).pathname,
  });
  await p.close();
}
const c = await b.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: { dir: out.pathname, size: { width: 1440, height: 900 } },
});
const p = await c.newPage();
await p.goto(site);
await p.getByRole("link", { name: "Explore projects" }).click();
await p
  .getByRole("navigation", { name: "Project index" })
  .getByRole("link", { name: /Rivet/ })
  .hover();
await p.waitForTimeout(700);
await p
  .getByRole("navigation", { name: "Project index" })
  .getByRole("link", { name: /Rivet/ })
  .click();
await p.locator("#project-rivet summary").click();
await p.waitForTimeout(900);
await p.goBack();
await p.waitForTimeout(600);
await p.close();
const video = await p.video().path();
await c.close();
await rename(video, new URL("project-interaction.webm", out).pathname);
const fonts = await readdir(new URL("../dist/assets/", import.meta.url));
const fontUrl = (prefix) =>
  site + "assets/" + fonts.find((name) => name.startsWith(prefix));
const specimen = await b.newPage({ viewport: { width: 1440, height: 900 } });
await specimen.goto(site);
await specimen.setContent(
  `<style>@font-face{font-family:CurrentBody;src:url('${fontUrl("source-sans-3-latin-wght-normal-")}')}@font-face{font-family:CurrentDisplay;src:url('${fontUrl("fraunces-latin-wght-normal-")}')}@font-face{font-family:NewBody;src:url('${fontUrl("inter-latin-wght-normal-")}')}@font-face{font-family:NewDetail;src:url('${fontUrl("jetbrains-mono-latin-wght-normal-")}')}*{box-sizing:border-box}body{margin:0;background:#0c111b;color:#ecf2fa;padding:70px;font-family:NewBody;line-height:1.6}main{display:grid;grid-template-columns:1fr 1fr;gap:80px}h1{font-size:30px;margin:0 0 50px}h2{font-size:52px;line-height:1.12;margin:30px 0}p{font-size:20px;color:#a7b5c8}small{font-size:14px;color:#8abaff}.old{font-family:CurrentBody}.old h2{font-family:CurrentDisplay}.new small{font-family:NewDetail}article{border-top:1px solid #2b3a4f;padding-top:30px}</style><h1>Typography review / same content, two systems</h1><main><article class=old><small>H.2A · Source Sans 3 + Fraunces</small><h2>Brandon Hann.<br>Software with care.</h2><p>I build across the stack, with an interest in cybersecurity and AI security.</p><small>ARCHITECTURE / EVIDENCE / IMPLEMENTATION</small><p>Restaurant data is incomplete. A useful search experience has to make uncertainty visible.</p></article><article class=new><small>H.3A · Inter + JetBrains Mono</small><h2>Brandon Hann.<br>Software with care.</h2><p>I build across the stack, with an interest in cybersecurity and AI security.</p><small>ARCHITECTURE / EVIDENCE / IMPLEMENTATION</small><p>Restaurant data is incomplete. A useful search experience has to make uncertainty visible.</p></article></main>`,
);
await specimen.evaluate(() => document.fonts.ready);
await specimen.screenshot({
  path: new URL("font-comparison.png", out).pathname,
});
await specimen.close();
await b.close();
console.log(out.pathname);
