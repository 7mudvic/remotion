/**
 * Capture iPad-sized screenshots of the cinematic carousel prototype.
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

console.log('→', URL);
await page.goto(URL, {waitUntil: 'networkidle'});
await page.waitForTimeout(1500);

// 1) First dish — single-price (مطبّق)
await page.screenshot({path: `${OUT}/01-hero-single.png`});
console.log('✓ 01-hero-single.png');

// 2) Click forward arrow a couple of times to reach a different dish
await page.locator('[aria-label="التالي"]').click();
await page.waitForTimeout(800);
await page.locator('[aria-label="التالي"]').click();
await page.waitForTimeout(900);
await page.screenshot({path: `${OUT}/02-hero-after-swipe.png`});
console.log('✓ 02-hero-after-swipe.png');

// 3) Switch to Areeka tab — multi-price dishes
await page.locator('button', {hasText: 'عَريكة و معصوب'}).click();
await page.waitForTimeout(900);
await page.screenshot({path: `${OUT}/03-areeka-multiprice.png`});
console.log('✓ 03-areeka-multiprice.png');

// 4) Advance once more inside Areeka category
await page.locator('[aria-label="التالي"]').click();
await page.waitForTimeout(900);
await page.screenshot({path: `${OUT}/04-areeka-second.png`});
console.log('✓ 04-areeka-second.png');

// 5) Open the search overlay
await page.locator('[aria-label="بحث"]').click();
await page.waitForTimeout(500);
await page.locator('input[placeholder="ابحث عن صنف…"]').type('عَريكة');
await page.waitForTimeout(700);
await page.screenshot({path: `${OUT}/05-search-overlay.png`});
console.log('✓ 05-search-overlay.png');

// 6) Mutabbaq tab to show the third filter state
await page.keyboard.press('Escape').catch(() => {});
// Close the overlay by clicking outside
await page.mouse.click(50, 50);
await page.waitForTimeout(400);
await page.locator('button', {hasText: 'مطبّق', hasNotText: 'و معصوب'}).first().click();
await page.waitForTimeout(900);
await page.screenshot({path: `${OUT}/06-mutabbaq-only.png`});
console.log('✓ 06-mutabbaq-only.png');

await browser.close();
console.log('\nAll screenshots saved to', OUT);
