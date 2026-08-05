import puppeteer from "puppeteer-core";
import path from "node:path";
import fs from "node:fs/promises";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const axePath = require.resolve("axe-core/axe.min.js");
const base = process.env.QA_BASE_URL || "http://localhost:3001";
const chrome = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const routes = [
  "/", "/work", "/work/6hrs", "/work/dream-of-red-chamber-jade",
  "/work/xny-clinic", "/work/sentral-dental-clinic", "/work/senada-consulting",
  "/work/elaine-leong-associates", "/services", "/about", "/contact",
];
const viewports = [
  { name: "desktop", width: 1440, height: 900, isMobile: false, hasTouch: false },
  { name: "tablet", width: 768, height: 1024, isMobile: false, hasTouch: true },
  { name: "mobile", width: 375, height: 812, isMobile: true, hasTouch: true },
];
const outDir = path.resolve("artifacts/qa");
await fs.mkdir(outDir, { recursive: true });

const browser = await puppeteer.launch({ executablePath: chrome, headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const report = { base, routes: {}, interactions: {}, reducedMotion: {}, noJavaScript: {}, errors: [] };

async function inspectRoute(route, viewport) {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  const consoleErrors = [];
  const pageErrors = [];
  page.on("console", (msg) => { if (msg.type() === "error") consoleErrors.push(msg.text()); });
  page.on("pageerror", (error) => pageErrors.push(error.message));
  const response = await page.goto(base + route, { waitUntil: "networkidle0", timeout: 30000 });
  await page.evaluate(async () => {
    const step = Math.max(300, Math.floor(innerHeight * 0.75));
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 18));
    }
    scrollTo(0, 0);
  });
  await new Promise((resolve) => setTimeout(resolve, 120));
  const layout = await page.evaluate(() => ({
    title: document.title,
    h1: document.querySelectorAll("h1").length,
    bodyWidth: document.body.scrollWidth,
    viewportWidth: document.documentElement.clientWidth,
    documentHeight: document.documentElement.scrollHeight,
    visibleText: (document.body.innerText || "").trim().length,
    canvases: document.querySelectorAll("canvas").length,
  }));
  await page.addScriptTag({ path: axePath });
  const axe = await page.evaluate(async () => {
    const result = await window.axe.run(document, { resultTypes: ["violations"] });
    return result.violations
      .filter((item) => ["serious", "critical"].includes(item.impact))
      .map((item) => ({ id: item.id, impact: item.impact, nodes: item.nodes.length, help: item.help }));
  });
  const file = `${viewport.name}-${route === "/" ? "home" : route.slice(1).replaceAll("/", "-")}.png`;
  await page.screenshot({ path: path.join(outDir, file), fullPage: true });
  await page.close();
  return { status: response?.status(), layout, consoleErrors, pageErrors, axe, screenshot: file };
}

for (const viewport of viewports) {
  for (const route of routes) {
    const key = `${viewport.name}:${route}`;
    try { report.routes[key] = await inspectRoute(route, viewport); }
    catch (error) { report.errors.push(`${key}: ${error.stack || error}`); }
  }
}

// Mobile navigation keyboard contract.
{
  const page = await browser.newPage();
  await page.setViewport(viewports[2]);
  await page.goto(base, { waitUntil: "networkidle0" });
  await page.click(".menu-trigger");
  const opened = await page.$eval(".menu-trigger", (el) => el.getAttribute("aria-expanded"));
  const firstFocus = await page.evaluate(() => document.activeElement?.textContent?.trim());
  await page.keyboard.press("Escape");
  const closed = await page.$eval(".menu-trigger", (el) => el.getAttribute("aria-expanded"));
  const restored = await page.evaluate(() => document.activeElement?.classList.contains("menu-trigger"));
  const lockedAfterClose = await page.evaluate(() => document.body.classList.contains("menu-open"));
  report.interactions.mobileMenu = { opened, firstFocus, closed, restored, lockedAfterClose };
  await page.close();
}

// Quote flow output, preserving fields while intercepting popup navigation.
{
  const page = await browser.newPage();
  await page.setViewport(viewports[0]);
  await page.goto(base + "/contact", { waitUntil: "networkidle0" });
  await page.evaluate(() => {
    window.__qaOpened = "";
    window.open = (url) => { window.__qaOpened = String(url); return { opener: null }; };
  });
  await page.type('input[name="name"]', "QA Person");
  await page.type('input[name="business"]', "QA Business");
  await page.type('input[name="contact"]', "0123456789");
  await page.select('select[name="tier"]', "Growth, RM6,000");
  await page.type('textarea[name="project"]', "A five-page service website with a WhatsApp enquiry path.");
  await page.click('button[type="submit"]');
  const openedUrl = await page.evaluate(() => window.__qaOpened);
  const values = await page.evaluate(() => Object.fromEntries(new FormData(document.querySelector("form"))));
  report.interactions.quote = { openedUrl, decoded: decodeURIComponent(openedUrl || ""), values };
  await page.close();
}

// Reduced motion must preserve content and suppress runtime atmosphere.
for (const route of routes) {
  const page = await browser.newPage();
  await page.setViewport(viewports[0]);
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await page.goto(base + route, { waitUntil: "networkidle0" });
  report.reducedMotion[route] = await page.evaluate(() => ({
    h1: document.querySelectorAll("h1").length,
    text: (document.body.innerText || "").trim().length,
    canvas: document.querySelectorAll("canvas").length,
    cursorPreview: Boolean(document.querySelector(".cursor-preview")),
    horizontalHeight: document.querySelector(".horizontal-section")?.getBoundingClientRect().height || 0,
  }));
  await page.close();
}

// Server-rendered core with JavaScript disabled.
for (const route of routes) {
  const page = await browser.newPage();
  await page.setJavaScriptEnabled(false);
  await page.setViewport(viewports[2]);
  const response = await page.goto(base + route, { waitUntil: "domcontentloaded" });
  report.noJavaScript[route] = await page.evaluate(() => ({
    statusText: document.body.innerText.slice(0, 160),
    h1: document.querySelectorAll("h1").length,
    links: document.querySelectorAll("a[href]").length,
    text: (document.body.innerText || "").trim().length,
    horizontalOverflow: document.body.scrollWidth > document.documentElement.clientWidth + 1,
  }));
  report.noJavaScript[route].status = response?.status();
  await page.close();
}

await browser.close();
await fs.writeFile(path.join(outDir, "report.json"), JSON.stringify(report, null, 2));
const failures = [];
for (const [key, result] of Object.entries(report.routes)) {
  if (result.status !== 200) failures.push(`${key} status ${result.status}`);
  if (result.layout.h1 !== 1) failures.push(`${key} h1 count ${result.layout.h1}`);
  if (result.layout.bodyWidth > result.layout.viewportWidth + 1) failures.push(`${key} body overflow ${result.layout.bodyWidth}/${result.layout.viewportWidth}`);
  if (result.consoleErrors.length || result.pageErrors.length) failures.push(`${key} browser errors`);
  if (result.axe.length) failures.push(`${key} axe ${result.axe.map((v) => v.id).join(",")}`);
}
if (report.interactions.mobileMenu.opened !== "true" || report.interactions.mobileMenu.closed !== "false" || !report.interactions.mobileMenu.restored || report.interactions.mobileMenu.lockedAfterClose) failures.push("mobile menu contract");
if (!report.interactions.quote.openedUrl?.startsWith("https://wa.me/60126492560?text=") || !report.interactions.quote.decoded.includes("Tier: Growth, RM6,000")) failures.push("quote URL");
for (const [route, result] of Object.entries(report.reducedMotion)) if (result.h1 !== 1 || !result.text || result.canvas || result.cursorPreview) failures.push(`reduced ${route}`);
for (const [route, result] of Object.entries(report.noJavaScript)) if (result.status !== 200 || result.h1 !== 1 || !result.links || !result.text || result.horizontalOverflow) failures.push(`nojs ${route}`);
console.log(JSON.stringify({ screenshots: Object.keys(report.routes).length, routes: routes.length, failures, report: path.join(outDir, "report.json") }, null, 2));
process.exitCode = failures.length ? 1 : 0;
