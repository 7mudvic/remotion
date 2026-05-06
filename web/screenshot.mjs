/**
 * Capture iPad-sized screenshots of the editorial magazine prototype.
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
await page.waitForTimeout(1500);

const scrollToSpread = async (i) => {
  await page.evaluate((idx) => {
    const sections = document.querySelectorAll('[data-spread]');
    sections[idx]?.scrollIntoView({behavior: 'instant', block: 'start'});
  }, i);
  await page.waitForTimeout(900);
};

// Spread 0 — Layout 1 (image right, big title left)
await page.screenshot({path: `${OUT}/01-layout1.png`});
console.log('✓ 01-layout1.png');

// Spread 1 — Layout 2 (yellow page)
await scrollToSpread(1);
await page.screenshot({path: `${OUT}/02-layout2-yellow.png`});
console.log('✓ 02-layout2-yellow.png');

// Spread 2 — Layout 3 (blue poster)
await scrollToSpread(2);
await page.screenshot({path: `${OUT}/03-layout3-poster.png`});
console.log('✓ 03-layout3-poster.png');

// Spread 3 — Layout 4 (split column)
await scrollToSpread(3);
await page.screenshot({path: `${OUT}/04-layout4-split.png`});
console.log('✓ 04-layout4-split.png');

// Areeka multiprice on layout 1
await page.evaluate(() => {
  document
    .querySelectorAll('[data-spread]')[0]
    ?.scrollIntoView({behavior: 'instant', block: 'start'});
});
await page.waitForTimeout(400);
await page.locator('button', {hasText: 'جميع الأصناف'}).click();
await page.waitForTimeout(500);
await page.locator('button', {hasText: 'عَريكة و معصوب'}).click();
await page.waitForTimeout(900);
await page.screenshot({path: `${OUT}/05-areeka-multiprice.png`});
console.log('✓ 05-areeka-multiprice.png');

// Filter drawer open
await page.locator('button', {hasText: 'عَريكة و معصوب'}).first().click();
await page.waitForTimeout(500);
await page.screenshot({path: `${OUT}/06-filter-drawer.png`});
console.log('✓ 06-filter-drawer.png');

await browser.close();
console.log('\nAll screenshots saved to', OUT);
