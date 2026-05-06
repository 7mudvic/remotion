/**
 * Capture iPad-sized screenshots of the running web preview so the user
 * can see the prototype before deploying to a real tablet.
 */
import {chromium} from 'playwright';
import fs from 'node:fs/promises';

const URL = 'http://127.0.0.1:4173/';
const OUT = './screenshots';

await fs.mkdir(OUT, {recursive: true});

// iPad Pro 11" landscape — common cashier-counter setup
const browser = await chromium.launch({headless: true});
const ctx = await browser.newContext({
  viewport: {width: 1366, height: 1024},
  deviceScaleFactor: 2,
  userAgent:
    'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  isMobile: false,
  hasTouch: true,
});
const page = await ctx.newPage();

console.log('→ navigating to', URL);
await page.goto(URL, {waitUntil: 'networkidle'});
// Give fonts + images a moment to settle
await page.waitForTimeout(1500);

// 1) Landing — full menu (الكل)
await page.screenshot({path: `${OUT}/01-home.png`, fullPage: false});
console.log('✓ 01-home.png');

// 2) Mutabbaq tab
await page.getByRole('tab', {name: 'مطبّق'}).click();
await page.waitForTimeout(700);
await page.screenshot({path: `${OUT}/02-mutabbaq-tab.png`});
console.log('✓ 02-mutabbaq-tab.png');

// 3) Areeka tab
await page.getByRole('tab', {name: 'عَريكة و معصوب'}).click();
await page.waitForTimeout(700);
await page.screenshot({path: `${OUT}/03-areeka-tab.png`});
console.log('✓ 03-areeka-tab.png');

// 4) Detail modal — single price (mutabbaq)
await page.getByRole('tab', {name: 'مطبّق'}).click();
await page.waitForTimeout(500);
await page.locator('button').filter({hasText: 'مطبّق نوتيلا'}).first().click();
await page.waitForTimeout(900);
await page.screenshot({path: `${OUT}/04-detail-single-price.png`});
console.log('✓ 04-detail-single-price.png');

// Close modal
await page.keyboard.press('Escape').catch(() => {});
await page.locator('[aria-label="إغلاق"]').click();
await page.waitForTimeout(400);

// 5) Detail modal — three sizes (areeka)
await page.getByRole('tab', {name: 'عَريكة و معصوب'}).click();
await page.waitForTimeout(500);
await page.locator('button').filter({hasText: 'عَريكة جنوبية'}).first().click();
await page.waitForTimeout(900);
await page.screenshot({path: `${OUT}/05-detail-three-sizes.png`});
console.log('✓ 05-detail-three-sizes.png');

await page.locator('[aria-label="إغلاق"]').click();
await page.waitForTimeout(300);

// 6) Search — go back to "All" so results actually appear
await page.getByRole('tab', {name: 'الكل'}).click();
await page.waitForTimeout(400);
const search = page.locator('input[placeholder="ابحث عن صنف…"]');
await search.click();
await search.type('تونة');
await page.waitForTimeout(700);
await page.screenshot({path: `${OUT}/06-search.png`});
console.log('✓ 06-search.png');

await browser.close();
console.log('\nAll screenshots saved to', OUT);
