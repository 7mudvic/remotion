/**
 * Capture iPad-sized screenshots of the trimmed Glass Grid prototype.
 */
import {chromium} from 'playwright';
import fs from 'node:fs/promises';

const URL = 'http://127.0.0.1:4173/';
const OUT = './screenshots';

await fs.mkdir(OUT, {recursive: true});

const browser = await chromium.launch({headless: true});
const ctx = await browser.newContext({
  viewport: {width: 1366, height: 1024},
  deviceScaleFactor: 2,
  hasTouch: true,
});
const page = await ctx.newPage();

await page.goto(URL, {waitUntil: 'networkidle'});
await page.waitForTimeout(2000);

// 1) Default — Mutabbaq tab visible, Featured row at top
await page.screenshot({path: `${OUT}/01-home.png`, fullPage: true});
console.log('✓ 01-home.png');

// 2) Visible viewport (no scroll) of the home
await page.screenshot({path: `${OUT}/02-home-viewport.png`});
console.log('✓ 02-home-viewport.png');

// 3) Switch to Areeka tab
await page.locator('button[role="tab"]', {hasText: 'العَريكة والمعصوب'}).click();
await page.waitForTimeout(700);
await page.screenshot({path: `${OUT}/03-areeka-tab.png`});
console.log('✓ 03-areeka-tab.png');

// 4) Tap a Featured card (scroll back to top first)
await page.evaluate(() => window.scrollTo({top: 0}));
await page.locator('button', {hasText: 'مميّز'}).first().click();
await page.waitForTimeout(900);
await page.screenshot({path: `${OUT}/04-featured-detail.png`});
console.log('✓ 04-featured-detail.png');

// 5) Close + Mutabbaq tab full grid
await page.locator('[aria-label="إغلاق"]').click();
await page.waitForTimeout(400);
await page.locator('button[role="tab"]', {hasText: 'المطبّق'}).click();
await page.waitForTimeout(700);
await page.screenshot({path: `${OUT}/05-mutabbaq-grid.png`});
console.log('✓ 05-mutabbaq-grid.png');

// 6) Full page scroll capture so user sees everything stacks
await page.screenshot({path: `${OUT}/06-full-page.png`, fullPage: true});
console.log('✓ 06-full-page.png');

await browser.close();
console.log('\nAll screenshots saved to', OUT);
