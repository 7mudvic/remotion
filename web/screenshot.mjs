/**
 * Capture both iPad and iPhone screenshots so we can verify the
 * featured row reads well on a phone (where the user spotted issues).
 */
import {chromium} from 'playwright';
import fs from 'node:fs/promises';

const URL = 'http://127.0.0.1:4173/';
const OUT = './screenshots';
await fs.mkdir(OUT, {recursive: true});

const browser = await chromium.launch({headless: true});

// ── iPhone 14 Pro portrait — what the user is testing on ──
{
  const ctx = await browser.newContext({
    viewport: {width: 393, height: 852},
    deviceScaleFactor: 3,
    hasTouch: true,
  });
  const page = await ctx.newPage();
  await page.goto(URL, {waitUntil: 'networkidle'});
  await page.waitForTimeout(2000);
  // Default — مطبّق tab active
  await page.screenshot({path: `${OUT}/phone-01-mutabbaq.png`, fullPage: false});
  console.log('✓ phone-01-mutabbaq.png');

  // Switch to العَريكة and capture
  await page.locator('button[role="tab"]', {hasText: 'العَريكة والمعصوب'}).click();
  await page.waitForTimeout(500);
  await page.screenshot({path: `${OUT}/phone-02-areeka.png`, fullPage: false});
  console.log('✓ phone-02-areeka.png');

  // Full page
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.locator('button[role="tab"]', {hasText: 'المطبّق'}).click();
  await page.waitForTimeout(400);
  await page.screenshot({path: `${OUT}/phone-03-full.png`, fullPage: true});
  console.log('✓ phone-03-full.png');
  await ctx.close();
}

// ── iPad Pro 11" landscape ──
{
  const ctx = await browser.newContext({
    viewport: {width: 1366, height: 1024},
    deviceScaleFactor: 2,
    hasTouch: true,
  });
  const page = await ctx.newPage();
  await page.goto(URL, {waitUntil: 'networkidle'});
  await page.waitForTimeout(2000);
  await page.screenshot({path: `${OUT}/ipad-01-home.png`});
  console.log('✓ ipad-01-home.png');

  await page.locator('button[role="tab"]', {hasText: 'العَريكة والمعصوب'}).click();
  await page.waitForTimeout(700);
  await page.screenshot({path: `${OUT}/ipad-02-areeka.png`});
  console.log('✓ ipad-02-areeka.png');

  // Click the first featured card (it's the first <button> inside the
  // "أصناف مميّزة" section on the page).
  await page.locator('section button').first().click().catch(() => {});
  await page.waitForTimeout(900);
  await page.screenshot({path: `${OUT}/ipad-03-detail.png`});
  console.log('✓ ipad-03-detail.png');

  await ctx.close();
}

await browser.close();
console.log('\nAll screenshots saved to', OUT);
