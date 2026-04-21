#!/usr/bin/env node
/**
 * export_deck_stage_pdf.mjs — Tek dosya <deck-stage> mimarisi ozel PDF disa aktarim
 *
 * Kullanim:
 *   node export_deck_stage_pdf.mjs --html <deck.html> --out <file.pdf> [--width 1920] [--height 1080]
 *
 * Ne zaman kullanilir?
 *   - deck'iniz **tek HTML dosyasi**, tum slayt'lar `<section>`, dis `<deck-stage>` ile sarilir
 *   - Bu durumda `export_deck_pdf.mjs` (coklu dosya ozel) kullanilamaz
 *
 * Neden dogrudan `page.pdf()` kullanilamaz (2026-04-20 hata kaydi):
 *   1. deck-stage'in shadow CSS `::slotted(section) { display: none }` sadece aktif slayt gorunur
 *   2. print medyasinda dis `!important` shadow DOM kuralini ezemez
 *   3. Sonuc: PDF her zaman sadece 1 sayfa (aktif olan)
 *
 * Cozum:
 *   HTML acildiktan sonra, page.evaluate ile tum section'lari deck-stage slot'undan cikar,
 *   body altına normal bir div olarak eklenir, inline style ile position:relative + sabit boyut zorunlu,
 *   her section'a page-break-after: always eklenir, sonuncu auto yapılarak sondaki boş sayfadan kaçınılır.
 *
 * Bağımlılıklar: playwright
 *   npm install playwright
 *
 * Çıktı özellikleri:
 *   - Metin vektör olarak korunur (kopyalanabilir, aranabilir)
 *   - Görsel 1:1 sadakat
 *   - Yazı tipi Chromium tarafından yüklenebilmeli (yerel yazı tipi veya Google Fonts)
 */

import { chromium } from 'playwright';
import fs from 'fs/promises';
import path from 'path';

function parseArgs() {
  const args = { width: 1920, height: 1080 };
  const a = process.argv.slice(2);
  for (let i = 0; i < a.length; i += 2) {
    const k = a[i].replace(/^--/, '');
    args[k] = a[i + 1];
  }
  if (!args.html || !args.out) {
    console.error('Kullanim: node export_deck_stage_pdf.mjs --html <deck.html> --out <dosya.pdf> [--width 1920] [--height 1080]');
    process.exit(1);
  }
  args.width = parseInt(args.width);
  args.height = parseInt(args.height);
  return args;
}

async function main() {
  const { html, out, width, height } = parseArgs();
  const htmlAbs = path.resolve(html);
  const outFile = path.resolve(out);

  await fs.access(htmlAbs).catch(() => {
    console.error(`HTML file not found: ${htmlAbs}`);
    process.exit(1);
  });

  console.log(`Rendering ${path.basename(htmlAbs)} → ${path.basename(outFile)}`);

  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width, height } });
  const page = await ctx.newPage();

  await page.goto('file://' + htmlAbs, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);  // Google Fonts + deck-stage init bekle

  // Cekirdek duzeltme: section'lari shadow DOM slot'undan cikararak duzlestir
  const sectionCount = await page.evaluate(({ W, H }) => {
    const stage = document.querySelector('deck-stage');
    if (!stage) throw new Error('<deck-stage> not found — bu script sadece tek dosya deck-stage mimarisi icindir');
    const sections = Array.from(stage.querySelectorAll(':scope > section'));
    if (!sections.length) throw new Error('No <section> found inside <deck-stage>');

    // Yazdırma stillerini enjekte et
    const style = document.createElement('style');
    style.textContent = `
      @page { size: ${W}px ${H}px; margin: 0; }
      html, body { margin: 0 !important; padding: 0 !important; background: #fff; }
      deck-stage { display: none !important; }
    `;
    document.head.appendChild(style);

    // body altına düzleştir
    const container = document.createElement('div');
    container.id = 'print-container';
    sections.forEach(s => {
      // Inline style en yuksek onceligi alir; position:relative absolute alt ogelerin dogru kisitlanmasini saglar
      s.style.cssText = `
        width: ${W}px !important;
        height: ${H}px !important;
        display: block !important;
        position: relative !important;
        overflow: hidden !important;
        page-break-after: always !important;
        break-after: page !important;
        margin: 0 !important;
        padding: 0 !important;
      `;
      container.appendChild(s);
    });
    // Son sayfa sayfa sonu yapmaz, kuyruk bos sayfasini onler
    const last = sections[sections.length - 1];
    last.style.pageBreakAfter = 'auto';
    last.style.breakAfter = 'auto';
    document.body.appendChild(container);
    return sections.length;
  }, { W: width, H: height });

  await page.waitForTimeout(800);

  await page.pdf({
    path: outFile,
    width: `${width}px`,
    height: `${height}px`,
    printBackground: true,
    preferCSSPageSize: true,
  });

  await browser.close();

  const stat = await fs.stat(outFile);
  const kb = (stat.size / 1024).toFixed(0);
  console.log(`\n✓ Wrote ${outFile}  (${kb} KB, ${sectionCount} pages, vector)`);
  console.log(`  Sayfa dogrulama: mdimport "${outFile}" && pdfinfo "${outFile}" | grep Pages`);
}

main().catch(e => { console.error(e); process.exit(1); });
