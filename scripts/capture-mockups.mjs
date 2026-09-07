import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ARTIFACT_DIR = '/Users/moltisantid/.gemini/antigravity-ide/brain/61eff214-2c44-4db4-8644-b340e51ba975';
const CHROME_BIN = process.env.CHROME_BIN || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const TARGET_URL = 'http://127.0.0.1:8080/mockup-titles.html';

class Cdp {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.nextId = 1;
    this.pending = new Map();
  }

  async connect() {
    this.ws = new WebSocket(this.wsUrl);
    await new Promise((resolve, reject) => {
      this.ws.addEventListener('open', resolve);
      this.ws.addEventListener('error', reject);
    });

    this.ws.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    });
  }

  send(method, params = {}) {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function run() {
  await mkdir(ARTIFACT_DIR, { recursive: true });
  const port = 9555;

  const chrome = spawn(CHROME_BIN, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--disable-gpu',
    '--no-sandbox',
    '--hide-scrollbars',
    '--window-size=1440,960',
    'about:blank'
  ], { stdio: 'ignore' });

  // Wait for debugger
  let wsUrl = '';
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/list`);
      if (res.ok) {
        const list = await res.json();
        const page = list.find((t) => t.type === 'page');
        if (page?.webSocketDebuggerUrl) {
          wsUrl = page.webSocketDebuggerUrl;
          break;
        }
      }
    } catch {
      // waiting
    }
    await new Promise((r) => setTimeout(r, 200));
  }

  if (!wsUrl) {
    chrome.kill('SIGKILL');
    throw new Error('Could not find page target on Chrome debugger');
  }

  const cdp = new Cdp(wsUrl);
  await cdp.connect();

  await cdp.send('Page.enable');
  await cdp.send('DOM.enable');
  await cdp.send('CSS.enable');
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 950,
    deviceScaleFactor: 2,
    mobile: false
  });

  await cdp.send('Page.navigate', { url: TARGET_URL });
  await new Promise((res) => setTimeout(res, 2000));

  // Function to capture an element
  async function capture(tabDataTarget, filename) {
    // Click tab
    await cdp.send('Runtime.evaluate', {
      expression: `
        document.querySelector('[data-target="${tabDataTarget}"]').click();
      `
    });
    await new Promise((res) => setTimeout(res, 400));

    // Capture screenshot
    const screenshot = await cdp.send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: false
    });

    const outPath = path.join(ARTIFACT_DIR, filename);
    await writeFile(outPath, Buffer.from(screenshot.data, 'base64'));
    console.log(`Captured ${filename}`);
  }

  await capture('opt-a', 'mockup-option-a.png');
  await capture('opt-b', 'mockup-option-b.png');
  await capture('opt-c', 'mockup-option-c.png');
  await capture('grid-view', 'mockup-comparison-grid.png');

  cdp.close();
  chrome.kill('SIGTERM');
  console.log('All mockups captured successfully!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
