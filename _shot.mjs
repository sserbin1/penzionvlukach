import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
await page.goto('https://abogadosenplasencia.es/?cb=STATS1', { waitUntil: 'networkidle', timeout: 30000 });
// Try locate header
const locator = page.getByText('Marco legal aplicado en cada caso', { exact: false }).first();
try {
  await locator.waitFor({ timeout: 5000 });
  await locator.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
} catch(e) {
  console.log('Header not found via text, trying scroll');
}
await page.screenshot({ path: 'C:/Users/serbi/.claude/evidence/abogadosenplasencia/stats_fixed.png', fullPage: false });
// Also take a full page screenshot
await page.screenshot({ path: 'C:/Users/serbi/.claude/evidence/abogadosenplasencia/stats_fixed_full.png', fullPage: true });
// Report whether header exists
const has = await page.locator('text=Marco legal aplicado en cada caso').count();
console.log('HEADER_COUNT=' + has);
// Count cards by looking for Ley/RD/RGPD/LAU texts
for (const t of ['Ley 31/1995','RD 286/2006','RGPD','LAU']) {
  const c = await page.locator(`text=${t}`).count();
  console.log(`${t}=${c}`);
}
await browser.close();
