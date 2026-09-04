import { spawn, execFileSync } from 'node:child_process';
import { access, mkdir, rm, writeFile } from 'node:fs/promises';
import { constants as fsConstants } from 'node:fs';
import path from 'node:path';

const BASE_URL = process.env.QA_BASE_URL || 'http://127.0.0.1:8080/';
const OUTPUT_DIR = path.resolve('artifacts/mobile-qa');

const MOBILE_VIEWPORTS = [
  { name: 'iphone-se', width: 320, height: 568 },
  { name: 'android-360', width: 360, height: 800 },
  { name: 'iphone-14', width: 390, height: 844 },
  { name: 'iphone-plus', width: 430, height: 932 },
  { name: 'ipad-portrait', width: 768, height: 1024 },
];

const DESKTOP_VIEWPORT = { name: 'desktop-smoke', width: 1440, height: 900 };
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fileExists(file) {
  try {
    await access(file, fsConstants.X_OK);
    return true;
  } catch {
    return false;
  }
}

async function resolveChrome() {
  const candidates = [
    process.env.CHROME_BIN,
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (await fileExists(candidate)) return candidate;
  }

  for (const command of ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser']) {
    try {
      const resolved = execFileSync('bash', ['-lc', `command -v ${command}`], { encoding: 'utf8' }).trim();
      if (resolved) return resolved;
    } catch {
      // Try the next binary.
    }
  }

  throw new Error('No Chromium/Chrome binary found on the runner.');
}

class CdpClient {
  constructor(url) {
    this.url = url;
    this.nextId = 1;
    this.pending = new Map();
    this.ws = null;
  }

  async connect() {
    if (typeof WebSocket === 'undefined') {
      throw new Error('Global WebSocket is unavailable. Use Node 22+.');
    }

    this.ws = new WebSocket(this.url);
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('CDP WebSocket connection timed out')), 8000);
      this.ws.addEventListener('open', () => {
        clearTimeout(timer);
        resolve();
      }, { once: true });
      this.ws.addEventListener('error', () => {
        clearTimeout(timer);
        reject(new Error('CDP WebSocket connection failed'));
      }, { once: true });
    });

    this.ws.addEventListener('message', (event) => {
      let message;
      try {
        message = JSON.parse(String(event.data));
      } catch {
        return;
      }
      if (!message.id) return;
      const pending = this.pending.get(message.id);
      if (!pending) return;
      this.pending.delete(message.id);
      if (message.error) pending.reject(new Error(`${pending.method}: ${message.error.message}`));
      else pending.resolve(message.result || {});
    });
  }

  send(method, params = {}) {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject, method });
      this.ws.send(JSON.stringify({ id, method, params }));
      setTimeout(() => {
        if (!this.pending.has(id)) return;
        this.pending.delete(id);
        reject(new Error(`${method} timed out`));
      }, 12000);
    });
  }

  close() {
    try { this.ws?.close(); } catch { /* noop */ }
  }
}

async function waitForDebugger(port, timeoutMs = 12000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/list`);
      if (response.ok) {
        const targets = await response.json();
        const page = targets.find((target) => target.type === 'page');
        if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
      }
    } catch {
      // Chrome is still starting.
    }
    await sleep(150);
  }
  throw new Error(`Chrome remote debugger did not start on port ${port}`);
}

async function cleanupChrome(chrome, userDataDir) {
  try { chrome.kill('SIGKILL'); } catch { /* noop */ }
  await sleep(180);
  // Runner temp data is ephemeral. Cleanup must never turn a valid UI check into a failed test.
  await rm(userDataDir, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 }).catch(() => {});
}

async function launchChrome(chromeBin, viewport, index, mobile) {
  const port = 9320 + index;
  const userDataDir = `/tmp/plinio-mobile-qa-${viewport.name}-${process.pid}`;
  await rm(userDataDir, { recursive: true, force: true }).catch(() => {});

  const args = [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--hide-scrollbars',
    '--disable-background-networking',
    '--disable-default-apps',
    '--disable-extensions',
    '--disable-sync',
    '--metrics-recording-only',
    '--no-first-run',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    `--window-size=${viewport.width},${viewport.height}`,
    'about:blank',
  ];

  const chrome = spawn(chromeBin, args, { stdio: ['ignore', 'ignore', 'pipe'] });
  let stderr = '';
  chrome.stderr.on('data', (chunk) => { stderr += String(chunk).slice(-4000); });

  try {
    const wsUrl = await waitForDebugger(port);
    const client = new CdpClient(wsUrl);
    await client.connect();
    await client.send('Page.enable');
    await client.send('Runtime.enable');
    await client.send('Network.enable');
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 1,
      mobile,
      screenWidth: viewport.width,
      screenHeight: viewport.height,
      positionX: 0,
      positionY: 0,
      dontSetVisibleSize: false,
    });
    if (mobile) {
      await client.send('Emulation.setTouchEmulationEnabled', {
        enabled: true,
        maxTouchPoints: 5,
      });
    }

    return { chrome, client, userDataDir, stderr: () => stderr };
  } catch (error) {
    await cleanupChrome(chrome, userDataDir);
    throw new Error(`${error.message}\nChrome stderr: ${stderr.slice(-2000)}`);
  }
}

async function evaluate(client, expression) {
  const response = await client.send('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
    userGesture: true,
  });
  if (response.exceptionDetails) {
    throw new Error(response.exceptionDetails.exception?.description || response.exceptionDetails.text || 'Runtime.evaluate failed');
  }
  return response.result?.value;
}

async function waitForExpression(client, expression, timeoutMs = 10000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      if (await evaluate(client, expression)) return;
    } catch {
      // DOM can be in-flight while fragments mount.
    }
    await sleep(120);
  }
  throw new Error(`Timed out waiting for: ${expression}`);
}

async function preparePage(client, viewport, mobile) {
  const consent = JSON.stringify({ necessary: true, analytics: false, updatedAt: new Date().toISOString(), version: 1 });
  await client.send('Page.addScriptToEvaluateOnNewDocument', {
    source: `try { localStorage.setItem('plinio_consent_v1', ${JSON.stringify(consent)}); } catch (e) {}`,
  });

  if (mobile) {
    await client.send('Network.setUserAgentOverride', {
      userAgent: 'Mozilla/5.0 (Linux; Android 14; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Mobile Safari/537.36',
      platform: 'Android',
      userAgentMetadata: {
        brands: [{ brand: 'Chromium', version: '152' }, { brand: 'Google Chrome', version: '152' }],
        fullVersionList: [{ brand: 'Chromium', version: '152.0.0.0' }, { brand: 'Google Chrome', version: '152.0.0.0' }],
        fullVersion: '152.0.0.0',
        platform: 'Android',
        platformVersion: '14.0.0',
        architecture: '',
        model: 'Mobile',
        mobile: true,
        bitness: '',
        wow64: false,
      },
    });
  }

  await client.send('Page.navigate', { url: BASE_URL });
  await waitForExpression(client, `Boolean(document.querySelector('#app main') && document.querySelector('.pl-product-hero__title'))`, 12000);
  await evaluate(client, `(async () => {
    try { if (document.fonts?.ready) await Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 3500))]); } catch (e) {}
    const images = [...document.images];
    await Promise.race([
      Promise.all(images.map(img => img.complete ? Promise.resolve() : new Promise(resolve => {
        img.addEventListener('load', resolve, { once: true });
        img.addEventListener('error', resolve, { once: true });
      }))),
      new Promise(resolve => setTimeout(resolve, 4500))
    ]);
    await new Promise(resolve => setTimeout(resolve, 250));
    return true;
  })()`);

  const size = await evaluate(client, `({ width: window.innerWidth, height: window.innerHeight, dpr: window.devicePixelRatio })`);
  if (size.width !== viewport.width) throw new Error(`Expected viewport width ${viewport.width}, got ${size.width}`);
}

async function revealWholePage(client, viewportHeight) {
  const pageHeight = await evaluate(client, `Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)`);
  const step = Math.max(260, Math.floor(viewportHeight * 0.72));
  for (let y = 0; y < pageHeight; y += step) {
    await evaluate(client, `window.scrollTo(0, ${y})`);
    await sleep(90);
  }
  await evaluate(client, `window.scrollTo(0, Math.max(document.body.scrollHeight, document.documentElement.scrollHeight))`);
  await sleep(160);
  await evaluate(client, `window.scrollTo(0, 0)`);
  await sleep(320);
}

function rectOk(rect, minWidth, minHeight) {
  return rect && rect.width >= minWidth && rect.height >= minHeight;
}

async function captureFullPage(client, viewport, outputPath) {
  const metrics = await client.send('Page.getLayoutMetrics');
  const content = metrics.cssContentSize || metrics.contentSize;
  const height = Math.ceil(Math.min(content.height, 18000));
  const response = await client.send('Page.captureScreenshot', {
    format: 'png',
    fromSurface: true,
    captureBeyondViewport: true,
    clip: { x: 0, y: 0, width: viewport.width, height, scale: 1 },
  });
  await writeFile(outputPath, Buffer.from(response.data, 'base64'));
}

async function captureSelector(client, viewport, selector, outputPath) {
  const rect = await evaluate(client, `(() => {
    const el = document.querySelector(${JSON.stringify(selector)});
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { y: Math.max(0, r.top + scrollY), height: r.height };
  })()`);
  if (!rect || rect.height <= 0) return;
  const response = await client.send('Page.captureScreenshot', {
    format: 'png',
    fromSurface: true,
    captureBeyondViewport: true,
    clip: { x: 0, y: rect.y, width: viewport.width, height: Math.min(Math.ceil(rect.height), 12000), scale: 1 },
  });
  await writeFile(outputPath, Buffer.from(response.data, 'base64'));
}

async function captureViewport(client, outputPath) {
  const response = await client.send('Page.captureScreenshot', { format: 'png', fromSurface: true });
  await writeFile(outputPath, Buffer.from(response.data, 'base64'));
}

async function runMobileViewport(chromeBin, viewport, index) {
  const failures = [];
  const notes = [];
  const { chrome, client, userDataDir } = await launchChrome(chromeBin, viewport, index, true);

  try {
    await preparePage(client, viewport, true);

    const state = await evaluate(client, `(() => {
      const rect = (sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        const style = getComputedStyle(el);
        return { x: r.x, y: r.y, width: r.width, height: r.height, display: style.display, visibility: style.visibility };
      };
      const faq = [...document.querySelectorAll('#faq .pl-faq-card')].map(card => ({
        n: card.querySelector('.pl-faq-card__num')?.textContent?.trim(),
        y: card.getBoundingClientRect().top + scrollY,
        open: card.hasAttribute('open'),
      })).sort((a,b) => a.y - b.y);
      return {
        scrollWidth: document.documentElement.scrollWidth,
        bodyScrollWidth: document.body.scrollWidth,
        viewport: window.innerWidth,
        desktopPipeline: rect('.pl-hero-desktop-showcase'),
        mobileCarousel: rect('.pl-hero-mobile-carousel'),
        headerCta: rect('.pl-v5-header .pl-header__cta'),
        carouselPrev: rect('.pl-hero-mobile-carousel .pl-radar-nav-btn'),
        carouselDot: rect('.pl-hero-mobile-carousel .pl-radar-dot'),
        title: rect('.pl-product-hero__title'),
        faq,
        visibleComparisonRows: [...document.querySelectorAll('.pl-purpose-table tbody tr')].filter(row => getComputedStyle(row).display !== 'none').length,
      };
    })()`);

    if (state.scrollWidth > viewport.width + 1 || state.bodyScrollWidth > viewport.width + 1) {
      failures.push(`horizontal overflow: document=${state.scrollWidth}, body=${state.bodyScrollWidth}, viewport=${viewport.width}`);
    }
    if (!state.desktopPipeline || state.desktopPipeline.display !== 'none') failures.push('desktop hero pipeline is visible on mobile');
    if (!state.mobileCarousel || state.mobileCarousel.display === 'none' || state.mobileCarousel.visibility === 'hidden') failures.push('mobile hero carousel is not visible');
    if (!rectOk(state.headerCta, 44, 44)) failures.push(`header CTA touch target below 44x44: ${JSON.stringify(state.headerCta)}`);
    if (!rectOk(state.carouselPrev, 44, 44)) failures.push(`carousel arrow touch target below 44x44: ${JSON.stringify(state.carouselPrev)}`);
    if (!rectOk(state.carouselDot, 44, 44)) failures.push(`carousel dot touch target below 44x44: ${JSON.stringify(state.carouselDot)}`);
    if (!state.title || state.title.x < -1 || state.title.x + state.title.width > viewport.width + 1) failures.push(`hero title is outside viewport: ${JSON.stringify(state.title)}`);

    const faqOrder = state.faq.map(item => item.n).join(',');
    if (faqOrder !== '01,02,03,04,05,06,07,08') failures.push(`FAQ visual order is ${faqOrder}`);
    if (state.faq.some(item => item.open)) failures.push('one or more FAQ cards start open on mobile');
    if (state.visibleComparisonRows !== 3) failures.push(`expected 3 comparison detail rows on mobile, got ${state.visibleComparisonRows}`);

    await revealWholePage(client, viewport.height);

    await captureFullPage(client, viewport, path.join(OUTPUT_DIR, `${viewport.name}-full.png`));
    await captureSelector(client, viewport, '.pl-product-hero', path.join(OUTPUT_DIR, `${viewport.name}-hero.png`));
    await captureSelector(client, viewport, '#confronto', path.join(OUTPUT_DIR, `${viewport.name}-comparison.png`));
    await captureSelector(client, viewport, '#faq', path.join(OUTPUT_DIR, `${viewport.name}-faq.png`));

    await evaluate(client, `(() => { window.scrollTo(0, 0); document.querySelector('[data-open-lead-modal]')?.click(); return true; })()`);
    await waitForExpression(client, `document.querySelector('.pl-lead-modal')?.classList.contains('is-open')`, 5000);
    await sleep(250);

    const modal = await evaluate(client, `(() => {
      const rect = (sel) => {
        const el = document.querySelector(sel); if (!el) return null;
        const r = el.getBoundingClientRect(); return { x:r.x,y:r.y,width:r.width,height:r.height };
      };
      return {
        dialog: rect('.pl-lead-modal__dialog'),
        form: rect('.pl-lead-form'),
        steps: rect('.pl-lead-modal__steps-panel'),
        close: rect('.pl-lead-modal__close'),
        submit: rect('.pl-lead-form__submit'),
      };
    })()`);

    if (!modal.dialog || modal.dialog.width > viewport.width + 1) failures.push(`lead modal exceeds viewport: ${JSON.stringify(modal.dialog)}`);
    if (!modal.form || !modal.steps || modal.form.y >= modal.steps.y) failures.push(`lead modal is not form-first: form=${JSON.stringify(modal.form)} steps=${JSON.stringify(modal.steps)}`);
    if (!rectOk(modal.close, 44, 44)) failures.push(`modal close touch target below 44x44: ${JSON.stringify(modal.close)}`);
    if (!rectOk(modal.submit, 44, 48)) failures.push(`modal submit touch target below 44x48: ${JSON.stringify(modal.submit)}`);

    await captureViewport(client, path.join(OUTPUT_DIR, `${viewport.name}-modal.png`));
    notes.push('scroll reveal traversal completed');

    return { viewport, ok: failures.length === 0, failures, notes, metrics: { initial: state, modal } };
  } finally {
    client.close();
    await cleanupChrome(chrome, userDataDir);
  }
}

async function runDesktopSmoke(chromeBin, viewport, index) {
  const failures = [];
  const { chrome, client, userDataDir } = await launchChrome(chromeBin, viewport, index, false);
  try {
    await preparePage(client, viewport, false);
    const state = await evaluate(client, `(() => {
      const visible = (sel) => {
        const el = document.querySelector(sel); if (!el) return false;
        const s = getComputedStyle(el); const r = el.getBoundingClientRect();
        return s.display !== 'none' && s.visibility !== 'hidden' && r.width > 0 && r.height > 0;
      };
      return {
        scrollWidth: document.documentElement.scrollWidth,
        desktopPipeline: visible('.pl-hero-desktop-showcase'),
        mobileCarousel: visible('.pl-hero-mobile-carousel'),
        nav: visible('.pl-header__nav'),
      };
    })()`);
    if (state.scrollWidth > viewport.width + 1) failures.push(`desktop horizontal overflow: ${state.scrollWidth}px`);
    if (!state.desktopPipeline) failures.push('desktop hero pipeline is not visible');
    if (state.mobileCarousel) failures.push('mobile carousel is visible on desktop');
    if (!state.nav) failures.push('desktop navigation is not visible');

    await revealWholePage(client, viewport.height);
    await captureSelector(client, viewport, '.pl-product-hero', path.join(OUTPUT_DIR, 'desktop-smoke-hero.png'));
    await captureSelector(client, viewport, '#confronto', path.join(OUTPUT_DIR, 'desktop-smoke-comparison.png'));
    return { viewport, ok: failures.length === 0, failures, metrics: state };
  } finally {
    client.close();
    await cleanupChrome(chrome, userDataDir);
  }
}

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });
  const chromeBin = await resolveChrome();
  console.log(`[mobile-qa] Using Chrome: ${chromeBin}`);

  const results = [];
  for (let i = 0; i < MOBILE_VIEWPORTS.length; i += 1) {
    const viewport = MOBILE_VIEWPORTS[i];
    console.log(`[mobile-qa] ${viewport.name} ${viewport.width}x${viewport.height}`);
    try {
      const result = await runMobileViewport(chromeBin, viewport, i);
      results.push(result);
      console.log(result.ok ? '  PASS' : `  FAIL: ${result.failures.join(' | ')}`);
    } catch (error) {
      results.push({ viewport, ok: false, failures: [error.stack || error.message] });
      console.error(`  ERROR: ${error.stack || error.message}`);
    }
  }

  try {
    const desktop = await runDesktopSmoke(chromeBin, DESKTOP_VIEWPORT, 20);
    results.push(desktop);
    console.log(desktop.ok ? '[desktop-smoke] PASS' : `[desktop-smoke] FAIL: ${desktop.failures.join(' | ')}`);
  } catch (error) {
    results.push({ viewport: DESKTOP_VIEWPORT, ok: false, failures: [error.stack || error.message] });
    console.error(`[desktop-smoke] ERROR: ${error.stack || error.message}`);
  }

  const report = {
    generatedAt: new Date().toISOString(),
    chromeBin,
    baseUrl: BASE_URL,
    results,
  };
  await writeFile(path.join(OUTPUT_DIR, 'qa-results.json'), JSON.stringify(report, null, 2));

  const failed = results.filter(result => !result.ok);
  console.log(`\n[mobile-qa] ${results.length - failed.length}/${results.length} checks passed.`);
  if (failed.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
