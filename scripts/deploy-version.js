#!/usr/bin/env node

/**
 * Script di Deploy per Versioni Firebase Hosting (plinio-studio-vX)
 * 
 * Permette di scegliere una versione (es. v2, v3, v4) e deployare la landing page
 * su https://plinio-studio-vX.web.app.
 * Se il site Firebase Hosting non esiste ancora, lo crea automaticamente.
 * Se esiste già, sovrascrive la versione esistente.
 * 
 * Utilizzo:
 *   node scripts/deploy-version.js <versione>
 *   npm run deploy:version -- <versione>
 *   npm run deploy:version  (modalità interattiva)
 */

import { execSync, spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const ROOT_DIR = process.cwd();
const FIREBASE_RC_PATH = path.join(ROOT_DIR, '.firebaserc');
const FIREBASE_JSON_PATH = path.join(ROOT_DIR, 'firebase.json');

/**
 * Recupera l'ID del progetto Firebase corrente da .firebaserc
 */
function getProjectId() {
  try {
    if (fs.existsSync(FIREBASE_RC_PATH)) {
      const rc = JSON.parse(fs.readFileSync(FIREBASE_RC_PATH, 'utf8'));
      return rc?.projects?.default || 'plinio-studio';
    }
  } catch (err) {
    console.warn('⚠️ Impossibile leggere .firebaserc, fallback su "plinio-studio"');
  }
  return 'plinio-studio';
}

/**
 * Normalizza l'input dell'utente in un identificatore di versione e siteId
 * Es: "2" -> { target: "v2", siteId: "plinio-studio-v2" }
 * Es: "v3" -> { target: "v3", siteId: "plinio-studio-v3" }
 * Es: "prod" -> { target: "production", siteId: "plinio-studio" }
 */
function normalizeVersionInput(rawInput) {
  const trimmed = (rawInput || '').trim().toLowerCase();
  
  if (!trimmed || trimmed === 'prod' || trimmed === 'production' || trimmed === 'main' || trimmed === 'default') {
    return {
      target: 'production',
      siteId: 'plinio-studio',
      versionLabel: 'production (plinio-studio.web.app)'
    };
  }

  // Rimuovi eventuale prefisso "plinio-studio-" se passato per esteso
  let clean = trimmed.replace(/^plinio-studio-/, '');

  // Se è un numero (es. "3") o non ha prefisso "v", aggiungi "v"
  if (/^\d+$/.test(clean)) {
    clean = `v${clean}`;
  } else if (!clean.startsWith('v')) {
    clean = `v${clean}`;
  }

  const siteId = `plinio-studio-${clean}`;

  // Validazione identificatore Firebase (solo caratteri minuscoli, numeri e trattini)
  if (!/^[a-z0-9-]+$/.test(siteId)) {
    throw new Error(`Identificatore di versione non valido: "${clean}". Usa solo lettere, numeri e trattini.`);
  }

  return {
    target: clean,
    siteId: siteId,
    versionLabel: `${clean} (${siteId}.web.app)`
  };
}

/**
 * Ottiene la lista dei siti Firebase Hosting esistenti per il progetto
 */
function getExistingSites(projectId) {
  try {
    const rawOutput = execSync(`firebase hosting:sites:list --project ${projectId} --json`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore']
    });
    const parsed = JSON.parse(rawOutput);
    const sites = parsed?.result?.sites || [];
    return sites.map(s => {
      // name è nel formato "projects/<proj>/sites/<siteId>"
      const siteId = s.name.split('/').pop();
      return {
        siteId,
        defaultUrl: s.defaultUrl || `https://${siteId}.web.app`,
        type: s.type
      };
    });
  } catch (err) {
    console.warn('⚠️ Impossibile recuperare la lista dei siti da Firebase:', err.message);
    return [];
  }
}

/**
 * Crea un nuovo site Firebase Hosting se non esiste
 */
function createSiteIfNeeded(siteId, projectId, existingSites) {
  const alreadyExists = existingSites.some(s => s.siteId === siteId);

  if (alreadyExists) {
    console.log(`\n🔄 Il sito Firebase Hosting "${siteId}" esiste già.`);
    console.log(`   I contenuti correnti sovrascriveranno la versione esistente.`);
    return false;
  }

  console.log(`\n✨ Creazione del nuovo sito Firebase Hosting: "${siteId}" sul progetto "${projectId}"...`);
  try {
    execSync(`firebase hosting:sites:create ${siteId} --project ${projectId}`, {
      stdio: 'inherit'
    });
    console.log(`✅ Sito "${siteId}" creato con successo!`);
    return true;
  } catch (err) {
    throw new Error(`Errore durante la creazione del sito "${siteId}": ${err.message}`);
  }
}

/**
 * Aggiorna i file di configurazione .firebaserc e firebase.json per includere il target
 */
function updateFirebaseConfigs(projectId, targetName, siteId) {
  // 1. Aggiornamento .firebaserc
  let rc = {};
  if (fs.existsSync(FIREBASE_RC_PATH)) {
    try {
      rc = JSON.parse(fs.readFileSync(FIREBASE_RC_PATH, 'utf8'));
    } catch {
      rc = {};
    }
  }

  rc.projects = rc.projects || {};
  rc.projects.default = projectId;

  rc.targets = rc.targets || {};
  rc.targets[projectId] = rc.targets[projectId] || {};
  rc.targets[projectId].hosting = rc.targets[projectId].hosting || {};
  rc.targets[projectId].hosting[targetName] = [siteId];

  fs.writeFileSync(FIREBASE_RC_PATH, JSON.stringify(rc, null, 2) + '\n', 'utf8');

  // 2. Aggiornamento firebase.json
  let fbJson = {};
  if (fs.existsSync(FIREBASE_JSON_PATH)) {
    try {
      fbJson = JSON.parse(fs.readFileSync(FIREBASE_JSON_PATH, 'utf8'));
    } catch {
      fbJson = {};
    }
  }

  fbJson.$schema = fbJson.$schema || 'https://raw.githubusercontent.com/firebase/firebase-tools/master/schema/firebase-config.json';

  // Configurazione base condivisa per gli hosting
  const baseHeaders = [
    {
      source: '**',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }
      ]
    },
    {
      source: '**/*.@(jpg|jpeg|gif|png|svg|webp|ico|woff|woff2|ttf|eot)',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }]
    },
    {
      source: '**/*.@(js|css)',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' }]
    },
    {
      source: '**/*.@(html|htm)',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=3600, must-revalidate' }]
    }
  ];

  const baseIgnore = [
    'firebase.json',
    '.firebaserc',
    '.git/**',
    '.firebase/**',
    '**/.*',
    '**/node_modules/**',
    'docs/**',
    'product/**',
    'scripts/**',
    'README.md',
    'package.json',
    'package-lock.json'
  ];

  // Se hosting è un oggetto singolo o non array, convertilo
  let hostingList = Array.isArray(fbJson.hosting) ? fbJson.hosting : [];
  if (!Array.isArray(fbJson.hosting) && fbJson.hosting && typeof fbJson.hosting === 'object') {
    hostingList = [fbJson.hosting];
  }

  // Cerca se esiste già un blocco con questo target
  const existingTargetIdx = hostingList.findIndex(h => h.target === targetName);
  const targetConfig = {
    target: targetName,
    public: '.',
    ignore: baseIgnore,
    cleanUrls: true,
    trailingSlash: false,
    headers: baseHeaders
  };

  if (existingTargetIdx >= 0) {
    hostingList[existingTargetIdx] = { ...hostingList[existingTargetIdx], ...targetConfig };
  } else {
    hostingList.push(targetConfig);
  }

  fbJson.hosting = hostingList;
  fs.writeFileSync(FIREBASE_JSON_PATH, JSON.stringify(fbJson, null, 2) + '\n', 'utf8');
}

/**
 * Esegue il deploy del target specificato tramite Firebase CLI
 */
function deployTarget(targetName) {
  return new Promise((resolve, reject) => {
    console.log(`\n🚀 Avvio deploy per il target "${targetName}"...`);
    const isWindows = process.platform === 'win32';
    const deployProc = spawn(isWindows ? 'firebase.cmd' : 'firebase', ['deploy', '--only', `hosting:${targetName}`], {
      stdio: 'inherit'
    });

    deployProc.on('close', code => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Firebase deploy terminato con codice di errore ${code}`));
      }
    });

    deployProc.on('error', err => {
      reject(err);
    });
  });
}

/**
 * Flusso principale
 */
/**
 * Estrae la versione desiderata dagli argomenti CLI
 * Supporta sintassi come:
 *   - "version 3" -> "3"
 *   - "v3" -> "v3"
 *   - "3" -> "3"
 *   - "--version 3" -> "3"
 *   - "--version=3" -> "3"
 *   - nessuna opzione -> "prod"
 */
function extractVersionFromArgs(args) {
  if (!args || args.length === 0) {
    return 'prod';
  }

  // Se è richiesta esplicitamente la modalità interattiva
  if (args.includes('--interactive') || args.includes('-i')) {
    return null;
  }

  // Cerca pattern tipo "version 3", "--version 3", "-v 3"
  for (let i = 0; i < args.length; i++) {
    const arg = args[i].toLowerCase();
    if (arg === 'version' || arg === '--version' || arg === '-v' || arg === '--v') {
      if (args[i + 1]) {
        return args[i + 1];
      }
    }
    if (arg.startsWith('--version=') || arg.startsWith('--v=')) {
      return arg.split('=')[1];
    }
  }

  // Altrimenti prendi il primo argomento che non sia un flag
  const candidate = args.find(a => !a.startsWith('-'));
  if (candidate) {
    return candidate;
  }

  return 'prod';
}

/**
 * Flusso principale
 */
async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('       🎯 Plinio Studio - Versioned Firebase Deployment        ');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const projectId = getProjectId();
  console.log(`📌 Progetto Firebase attivo: ${projectId}`);

  // Recupera siti esistenti
  console.log('🔍 Controllo siti Firebase Hosting attivi...');
  const existingSites = getExistingSites(projectId);
  
  if (existingSites.length > 0) {
    console.log('\nSiti attualmente disponibili nel progetto:');
    existingSites.forEach(s => {
      console.log(` • ${s.siteId.padEnd(24)} -> ${s.defaultUrl}`);
    });
  }

  const cliArgs = process.argv.slice(2);
  let selectedInput = extractVersionFromArgs(cliArgs);

  // Se è null (modalità interattiva esplicita), chiedi all'utente
  if (selectedInput === null) {
    const rl = readline.createInterface({ input, output });
    try {
      console.log('\n---------------------------------------------------------------');
      const answer = await rl.question('👉 Inserisci versione [v2, v3, ...] o premi INVIO per default (plinio-studio.web.app): ');
      selectedInput = answer.trim() || 'prod';
    } finally {
      rl.close();
    }
  }

  const { target, siteId, versionLabel } = normalizeVersionInput(selectedInput);

  console.log(`\n🎯 Target selezionato: ${target}`);
  console.log(`🌐 Hosting Site ID:   ${siteId}`);
  console.log(`🔗 URL di destinazione: https://${siteId}.web.app`);

  // Crea il site su Firebase se non esiste ancora
  createSiteIfNeeded(siteId, projectId, existingSites);

  // Aggiorna .firebaserc e firebase.json
  updateFirebaseConfigs(projectId, target, siteId);

  // Esegui il deploy
  await deployTarget(target);

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('🎉 DEPLOY COMPLETATO CON SUCCESSO!');
  console.log(`👉 Live URL:    https://${siteId}.web.app`);
  console.log(`⚙️  Console:     https://console.firebase.google.com/project/${projectId}/hosting/sites/${siteId}`);
  console.log('═══════════════════════════════════════════════════════════════\n');
}

main().catch(err => {
  console.error('\n❌ ERRORE DURANTE IL DEPLOY:', err.message);
  process.exit(1);
});
