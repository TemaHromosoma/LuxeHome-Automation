import lighthouse     from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

const PAGES_TO_AUDIT = [
  { name: 'Cart',     path: '/cart'     },
  { name: 'PDP',      path: '/product/1'},
];

const SCORE_THRESHOLDS = {
  performance:    70,
  accessibility:  90,
  'best-practices': 80,
  seo:            80,
};

const LIGHTHOUSE_CONFIG = {
  extends: 'lighthouse:default',
  settings: {
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    formFactor:     'desktop',
    throttlingMethod: 'simulate',
    throttling: {
      rttMs:                   40,
      throughputKbps:          10240,
      cpuSlowdownMultiplier:   1,
    },
    screenEmulation: {
      mobile:     false,
      width:      1350,
      height:     940,
      deviceScaleFactor: 1,
    },
  },
};

async function runAudit(chrome, pageUrl, pageName) {
  const result = await lighthouse(pageUrl, {
    port:       chrome.port,
    output:     'json',
    logLevel:   'error',
  }, LIGHTHOUSE_CONFIG);

  const { categories } = result.lhr;
  const scores = {};
  let   passed = true;

  for (const [key, threshold] of Object.entries(SCORE_THRESHOLDS)) {
    const score = Math.round((categories[key]?.score ?? 0) * 100);
    scores[key] = score;
    if (score < threshold) passed = false;
  }

  return { pageName, pageUrl, scores, passed };
}

function printResults(results) {
  console.log('\n══════════════════════════════════════════════');
  console.log('  LIGHTHOUSE AUDIT RESULTS');
  console.log('══════════════════════════════════════════════');

  let allPassed = true;

  for (const { pageName, pageUrl, scores, passed } of results) {
    const icon = passed ? '✅' : '❌';
    console.log(`\n${icon}  ${pageName} — ${pageUrl}`);
    console.log('─'.repeat(46));

    for (const [key, score] of Object.entries(scores)) {
      const threshold = SCORE_THRESHOLDS[key];
      const status    = score >= threshold ? '✓' : '✗';
      const bar       = '█'.repeat(Math.floor(score / 5)).padEnd(20, '░');

      console.log(
        `  ${status} ${key.padEnd(16)} ${String(score).padStart(3)}/100  ${bar}  (min: ${threshold})`
      );
    }

    if (!passed) allPassed = false;
  }

  console.log('\n══════════════════════════════════════════════');
  console.log(allPassed
    ? '  ✅  ALL PAGES PASSED LIGHTHOUSE THRESHOLDS'
    : '  ❌  SOME PAGES FAILED — see details above'
  );
  console.log('══════════════════════════════════════════════\n');

  return allPassed;
}

async function main() {
  console.log(`\n🔍 Starting Lighthouse audit for: ${BASE_URL}`);
  console.log(`   Pages: ${PAGES_TO_AUDIT.map(p => p.name).join(', ')}\n`);

  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu'],
  });

  const results = [];

  try {
    for (const { name, path } of PAGES_TO_AUDIT) {
      const pageUrl = `${BASE_URL}${path}`;
      process.stdout.write(`  Auditing ${name}...`);

      const result = await runAudit(chrome, pageUrl, name);
      results.push(result);

      console.log(result.passed ? ' ✅' : ' ❌');
    }
  } finally {
    await chrome.kill();
  }

  const allPassed = printResults(results);

  process.exit(allPassed ? 0 : 1);
}

main().catch(err => {
  console.error('Lighthouse run failed:', err.message);
  process.exit(1);
});
