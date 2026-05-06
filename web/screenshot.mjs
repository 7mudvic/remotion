/**
 * Capture iPad-sized screenshots of the Glass Grid prototype
 * (first prototype's structure, Bento's dark glass aesthetic).
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

// 1) Default — all dishes
await page.screenshot({path: `${OUT}/01-home.png`});
console.log('✓ 01-home.png');

// 2) Mutabbaq tab
await page.locator('button[role="tab"]', {hasText: /^مطبّق$/}).click();
await page.waitForTimeout(700);
await page.screenshot({path: `${OUT}/02-mutabbaq.png`});
console.log('✓ 02-mutabbaq.png');

// 3) Areeka tab — multi-price dishes
await page.locator('button[role="tab"]', {hasText: 'عَريكة و معصوب'}).click();
await page.waitForTimeout(700);
await page.screenshot({path: `${OUT}/03-areeka.png`});
console.log('✓ 03-areeka.png');

// 4) Tap a card → detail modal (multi-price)
await page.locator('button:has(img)').first().click();
await page.waitForTimeout(900);
await page.screenshot({path: `${OUT}/04-detail-multiprice.png`});
console.log('✓ 04-detail-multiprice.png');

// 5) Close modal, switch to mutabbaq, open a single-price dish
await page.locator('[aria-label="إغلاق"]').click();
await page.waitForTimeout(400);
await page.locator('button[role="tab"]', {hasText: /^مطبّق$/}).click();
await page.waitForTimeout(500);
// Find Nutella
await page.locator('button:has(img)').filter({hasText: 'مطبّق نوتيلا'}).first().click();
await page.waitForTimeout(900);
await page.screenshot({path: `${OUT}/05-detail-single.png`});
console.log('✓ 05-detail-single.png');

// 6) Close + search
await page.locator('[aria-label="إغلاق"]').click();
await page.waitForTimeout(300);
await page.locator('button[role="tab"]', {hasText: 'الكل'}).click();
await page.waitForTimeout(400);
const search = page.locator('input[placeholder="ابحث عن صنف…"]');
await search.click();
await search.type('تونة');
await page.waitForTimeout(700);
await page.screenshot({path: `${OUT}/06-search.png`});
console.log('✓ 06-search.png');

await browser.close();
console.log('\nAll screenshots saved to', OUT);
