import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
const site = process.env.PORTFOLIO_PREVIEW_URL;
if (!site) throw new Error("Set PORTFOLIO_PREVIEW_URL");
const label = process.argv[2] ?? "sample";
const out = new URL("../artifacts/h3a-review/", import.meta.url);
await mkdir(out, { recursive: true });
const browser = await chromium.launch();
const samples = [];
for (let run = 0; run < 5; run++) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  await page.addInitScript(() => {
    window.__metrics = { lcp: 0, cls: 0, long: 0, shifts: [] };
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        window.__metrics.lcp = e.startTime;
        window.__metrics.lcpElement = e.element?.tagName;
      }
    }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((list) => {
      for (const e of list.getEntries())
        if (!e.hadRecentInput) {
          window.__metrics.cls += e.value;
          window.__metrics.shifts.push({
            value: e.value,
            nodes: Array.from(e.sources ?? []).map((s) => ({
              html: (s.node instanceof Element
                ? s.node.outerHTML
                : s.node?.parentElement?.outerHTML
              )?.slice(0, 180),
              previous: s.previousRect,
              current: s.currentRect,
            })),
          });
        }
    }).observe({ type: "layout-shift", buffered: true });
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) window.__metrics.long += e.duration;
    }).observe({ type: "longtask", buffered: true });
  });
  const cdp = await context.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await cdp.send("Network.emulateNetworkConditions", {
    offline: false,
    latency: 150,
    downloadThroughput: 1600000 / 8,
    uploadThroughput: 750000 / 8,
  });
  for (const cache of ["cold", "warm"]) {
    await cdp.send("Network.setCacheDisabled", {
      cacheDisabled: cache === "cold",
    });
    await page.goto(site);
    await page.waitForTimeout(1800);
    samples.push({
      run,
      cache,
      ...(await page.evaluate(() => ({
        ...window.__metrics,
        fcp: performance.getEntriesByName("first-contentful-paint")[0]
          ?.startTime,
        resources: performance
          .getEntriesByType("resource")
          .map((e) => ({
            name: e.name.split("/").at(-1),
            transfer: e.transferSize,
            type: e.initiatorType,
          })),
      }))),
    });
  }
  await context.close();
}
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(site);
await page.screenshot({ path: new URL(`${label}-desktop.png`, out).pathname });
await page.setViewportSize({ width: 390, height: 844 });
await page.screenshot({ path: new URL(`${label}-mobile.png`, out).pathname });
await browser.close();
await writeFile(
  new URL(`${label}-performance.json`, out),
  JSON.stringify(samples, null, 2),
);
for (const cache of ["cold", "warm"]) {
  const rows = samples.filter((x) => x.cache === cache);
  const med = (k) => rows.map((x) => x[k]).sort((a, b) => a - b)[2];
  console.log(
    label,
    cache,
    JSON.stringify({
      FCP: med("fcp"),
      LCP: med("lcp"),
      CLS: med("cls"),
      longTasks: med("long"),
    }),
  );
}
