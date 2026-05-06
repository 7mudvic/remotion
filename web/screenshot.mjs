/**
 * Capture iPad-sized screenshots of the Bento Glass prototype.
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

// 1) Default — first dish featured
await page.screenshot({path: `${OUT}/01-bento-default.png`});
console.log('✓ 01-bento-default.png');

// 2) Tap a small tile to make it featured
const smallTiles = page.locator('button:has(img)').nth(2);
await smallTiles.click();
await page.waitForTimeout(900);
await page.screenshot({path: `${OUT}/02-bento-swap.png`});
console.log('✓ 02-bento-swap.png');

// 3) Switch to Areeka category — multi-price dishes
await page.locator('button', {hasText: 'عَريكة و معصوب'}).click();
await page.waitForTimeout(900);
await page.screenshot({path: `${OUT}/03-bento-areeka.png`});
console.log('✓ 03-bento-areeka.png');

// 4) Open detail sheet by tapping the featured tile
await page.locator('button:has(img)').first().click();
await page.waitForTimeout(900);
await page.screenshot({path: `${OUT}/04-detail-sheet.png`});
console.log('✓ 04-detail-sheet.png');

// 5) Close & switch to Mutabbaq, navigate to page 2
await page.locator('[aria-label="إغلاق"]').click();
await page.waitForTimeout(500);
await page.locator('button', {hasText: 'مطبّق', hasNotText: 'و معصوب'}).first().click();
await page.waitForTimeout(700);
await page.locator('[aria-label="التالي"]').click();
await page.waitForTimeout(900);
await page.screenshot({path: `${OUT}/05-mutabbaq-page2.png`});
console.log('✓ 05-mutabbaq-page2.png');

// 6) Switch to All — full menu spread
await page.locator('button', {hasText: 'الكل'}).click();
await page.waitForTimeout(900);
await page.screenshot({path: `${OUT}/06-all-final.png`});
console.log('✓ 06-all-final.png');

await browser.close();
console.log('\nAll screenshots saved to', OUT);
