import puppeteer from "puppeteer-core";

const base = process.env.QA_BASE_URL || "http://localhost:3102";
const chrome = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const browser = await puppeteer.launch({ executablePath: chrome, headless: true, args: ["--no-sandbox"] });
const failures = [];
const results = {};

// Keyboard traversal and complete focus trap cycling.
{
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
  await page.goto(base, { waitUntil: "networkidle0" });
  await page.click(".menu-trigger");
  const endpoints = await page.$$eval("#mobile-menu a[href]", (items) => items.map((el) => ({ text: el.textContent?.trim(), href: el.href })));
  await page.evaluate(() => { const items = document.querySelectorAll("#mobile-menu a[href]"); items[items.length - 1]?.focus(); });
  await page.keyboard.press("Tab");
  const afterLast = await page.evaluate(() => document.activeElement?.textContent?.trim());
  await page.evaluate(() => document.querySelector("#mobile-menu a[href]")?.focus());
  await page.keyboard.down("Shift"); await page.keyboard.press("Tab"); await page.keyboard.up("Shift");
  const beforeFirst = await page.evaluate(() => document.activeElement?.textContent?.trim());
  const first = endpoints[0]?.text;
  const last = endpoints.at(-1)?.text;
  results.focusTrap = { first, last, afterLast, beforeFirst };
  if (afterLast !== first || beforeFirst !== last) failures.push("focus trap did not cycle");
  await page.keyboard.press("Escape");
  if (!(await page.$eval(".menu-trigger", (el) => el === document.activeElement))) failures.push("menu focus not restored");
  await page.close();
}

// Tab through every route and ensure focus remains visible/in-document.
{
  const routes = ["/", "/work", "/work/6hrs", "/work/early-winter", "/work/sokach-diary", "/work/dream-of-red-chamber-jade", "/work/xny-clinic", "/work/sentral-dental-clinic", "/work/senada-consulting", "/work/elaine-leong-associates", "/services", "/about", "/contact"];
  results.keyboardRoutes = {};
  for (const route of routes) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(base + route, { waitUntil: "networkidle0" });
    const expected = await page.$$eval('a[href],button:not([disabled]),input,select,textarea', (els) => els.filter((el) => el.getClientRects().length && getComputedStyle(el).visibility !== "hidden").length);
    const visited = [];
    for (let i = 0; i < Math.min(expected + 2, 80); i++) {
      await page.keyboard.press("Tab");
      visited.push(await page.evaluate(() => ({ tag: document.activeElement?.tagName, text: document.activeElement?.textContent?.trim().slice(0, 40), outline: getComputedStyle(document.activeElement).outlineStyle })));
    }
    results.keyboardRoutes[route] = { expected, visited: visited.length, bodyFocuses: visited.filter((x) => x.tag === "BODY").length };
    if (!expected || visited.some((x) => x.tag === "BODY")) failures.push(`keyboard route ${route}`);
    await page.close();
  }
}

// Horizontal sequence moves with normal vertical scrolling and releases after its section.
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(base, { waitUntil: "networkidle0" });
  const geometry = await page.$eval(".horizontal-section", (el) => ({ top: el.offsetTop, height: el.offsetHeight }));
  const xAt = async (y) => {
    await page.evaluate((nextY) => scrollTo(0, nextY), y);
    await new Promise((resolve) => setTimeout(resolve, 180));
    return page.$eval(".horizontal-track", (el) => ({ transform: getComputedStyle(el).transform, scrollY, stickyTop: document.querySelector(".horizontal-sticky")?.getBoundingClientRect().top }));
  };
  const start = await xAt(geometry.top + 10);
  const middle = await xAt(geometry.top + geometry.height / 2);
  const end = await xAt(geometry.top + geometry.height + 200);
  results.horizontal = { geometry, start, middle, end };
  if (start.transform === middle.transform || middle.transform === end.transform) failures.push("horizontal track did not progress");
  if (Math.abs(start.stickyTop) > 2 || Math.abs(middle.stickyTop) > 2 || end.stickyTop >= 0) failures.push("horizontal sticky did not release");
  await page.close();
}

// Throttled production LCP and CLS using a clean browser page.
{
  const page = await browser.newPage();
  const client = await page.createCDPSession();
  await client.send("Network.enable");
  await client.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: 1_600_000 / 8, uploadThroughput: 750_000 / 8, connectionType: "cellular3g" });
  await client.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await page.evaluateOnNewDocument(() => {
    window.__qaVitals = { lcp: 0, cls: 0 };
    new PerformanceObserver((list) => { for (const e of list.getEntries()) window.__qaVitals.lcp = e.startTime; }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((list) => { for (const e of list.getEntries()) if (!e.hadRecentInput) window.__qaVitals.cls += e.value; }).observe({ type: "layout-shift", buffered: true });
  });
  await page.goto(base, { waitUntil: "networkidle0", timeout: 60000 });
  await new Promise((resolve) => setTimeout(resolve, 1200));
  results.performance = await page.evaluate(() => ({ ...window.__qaVitals, resources: performance.getEntriesByType("resource").filter((e) => e.name.includes(".woff2")).map((e) => ({ name: e.name.split("/").at(-1), transferSize: e.transferSize })) }));
  if (results.performance.lcp >= 2000) failures.push(`LCP ${results.performance.lcp}`);
  if (results.performance.cls >= .02) failures.push(`CLS ${results.performance.cls}`);
  await page.close();
}

await browser.close();
console.log(JSON.stringify({ failures, results }, null, 2));
process.exitCode = failures.length ? 1 : 0;
