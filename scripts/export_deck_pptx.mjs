#!/usr/bin/env node
/**
 * export_deck_pptx.mjs — Çoklu dosya slayt deck'ini PPTX'e dışa aktarır
 *
 * İki Mod:
 *   --mode image     Gorsel tabanli, gorsel %100 butunluk, ⚠️ metin duzenlenemez
 *   --mode editable  Metin kutusu yerli, metin duzenlenebilir, HTML 4 sert kisitlamaya uymali (bkz. references/editable-pptx.md)
 *
 * Kullanim:
 *   # Gorsel modu (varsayilan)
 *   node export_deck_pptx.mjs --slides <dir> --out <file.pptx>
 *   # Duzenlenebilir mod
 *   node export_deck_pptx.mjs --slides <dir> --out <file.pptx> --mode editable
 *
 * --mode image ozellikleri:
 *   - Her slayt PNG olarak ekran goruntusu alinir, bir PPTX sayfasina tamamen yayilir
 *   - Gorsel %100 butunluk (cunku resimdir)
 *   - Metin düzenlenemez
 *   - HTML istedigin gibi yaz, format secmez
 *
 * --mode editable özellikleri:
 *   - scripts/html2pptx.js çağırarak HTML DOM'u eleman eleman PowerPoint nesnesine çevirir
 *   - Metin gerçek metin kutusu, PPT'de doğrudan çift tıklayarak düzenlenebilir
 *   - ⚠️ HTML 4 sert kısıtlamaya uymalı (bkz. references/editable-pptx.md):
 *     1. Metin <p>/<h1>-<h6> içinde olmalı (div doğrudan metin içeremez)
 *     2. CSS gradyan kullanılmamalı
 *     3. <p>/<h*> background/border/shadow olmamalı (dış div'e konulmalı)
 *     4. div'de background-image olmamalı (<img> kullanılmalı)
 *   - body boyutu varsayılan 960pt × 540pt (LAYOUT_WIDE, 13.333″ × 7.5″)
 *   - Görsel odaklı HTML neredeyse geçemez — HTML'yi ilk satırdan itibaren kısıtlamalara göre yazılmalı
 *
 * Bağımlılıklar:
 *   --mode image:    npm install playwright pptxgenjs
 *   --mode editable: npm install playwright pptxgenjs sharp
 *
 * Dosya adına göre sıralanır (01-xxx.html → 02-xxx.html → ...).
 */

import { chromium } from 'playwright';
import pptxgen from 'pptxgenjs';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function parseArgs() {
  const args = { width: 1920, height: 1080, mode: 'image' };
  const a = process.argv.slice(2);
  for (let i = 0; i < a.length; i += 2) {
    const k = a[i].replace(/^--/, '');
    args[k] = a[i + 1];
  }
  if (!args.slides || !args.out) {
    console.error('Kullanim: node export_deck_pptx.mjs --slides <dizin> --out <dosya.pptx> [--mode image|editable] [--width 1920] [--height 1080]');
    process.exit(1);
  }
  args.width = parseInt(args.width);
  args.height = parseInt(args.height);
  if (!['image', 'editable'].includes(args.mode)) {
    console.error(`Bilinmeyen --mode: ${args.mode}. Desteklenen: image, editable`);
    process.exit(1);
  }
  return args;
}

async function exportImage({ slidesDir, outFile, files, width, height }) {
  console.log(`[image mode] Rendering ${files.length} slides as PNG...`);

  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width, height } });
  const page = await ctx.newPage();

  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'deck-pptx-'));
  const pngs = [];
  for (const f of files) {
    const url = 'file://' + path.join(slidesDir, f);
    await page.goto(url, { waitUntil: 'networkidle' }).catch(() => page.goto(url));
    await page.waitForTimeout(1200);
    const out = path.join(tmpDir, f.replace(/\.html$/, '.png'));
    await page.screenshot({ path: out, fullPage: false });
    pngs.push(out);
    console.log(`  [${pngs.length}/${files.length}] ${f}`);
  }
  await browser.close();

  const pres = new pptxgen();
  pres.defineLayout({ name: 'DECK', width: width / 96, height: height / 96 });
  pres.layout = 'DECK';
  for (const png of pngs) {
    const s = pres.addSlide();
    s.addImage({ path: png, x: 0, y: 0, w: pres.width, h: pres.height });
  }
  await pres.writeFile({ fileName: outFile });

  for (const p of pngs) await fs.unlink(p).catch(() => {});
  await fs.rmdir(tmpDir).catch(() => {});

  console.log(`\n✓ Wrote ${outFile}  (${files.length} slayt, image modu, metin duzenlenemez)`);
}

async function exportEditable({ slidesDir, outFile, files }) {
  console.log(`[editable mode] Converting ${files.length} slides via html2pptx...`);

  // html2pptx.js dinamik require (CommonJS modülü)
  const { createRequire } = await import('module');
  const require = createRequire(import.meta.url);
  let html2pptx;
  try {
    html2pptx = require(path.join(__dirname, 'html2pptx.js'));
  } catch (e) {
    console.error(`✗ html2pptx.js yuklenemedi: ${e.message}`);
    console.error(`  Bu modul sharp bagimliligi iceriyor — lutfen npm install sharp calistirin.`);
    process.exit(1);
  }

  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE';  // 13.333 × 7.5 inch, HTML body 960 × 540 pt karşılığı

  const errors = [];
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    const fullPath = path.join(slidesDir, f);
    try {
      await html2pptx(fullPath, pres);
      console.log(`  [${i + 1}/${files.length}] ${f} ✓`);
    } catch (e) {
      console.error(`  [${i + 1}/${files.length}] ${f} ✗  ${e.message}`);
      errors.push({ file: f, error: e.message });
    }
  }

  if (errors.length) {
    console.error(`\n⚠️ ${errors.length} slayt donusturme basarisiz. Sik neden: HTML 4 sert kisitlamaya uymuyor.`);
    console.error(`  Detaylar icin references/editable-pptx.md icindeki "Sik Hata Hizli Bakis".`);
    if (errors.length === files.length) {
      console.error(`✗ Tumu basarisiz, PPTX olusturulmuyor.`);
      process.exit(1);
    }
  }

  await pres.writeFile({ fileName: outFile });
  console.log(`\n✓ Wrote ${outFile}  (${files.length - errors.length}/${files.length} slayt, editable modu, metin PPT'te dogrudan duzenlenebilir)`);
}

async function main() {
  const { slides, out, width, height, mode } = parseArgs();
  const slidesDir = path.resolve(slides);
  const outFile = path.resolve(out);

  const files = (await fs.readdir(slidesDir))
    .filter(f => f.endsWith('.html'))
    .sort();
  if (!files.length) {
    console.error(`No .html files found in ${slidesDir}`);
    process.exit(1);
  }

  if (mode === 'image') {
    await exportImage({ slidesDir, outFile, files, width, height });
  } else {
    await exportEditable({ slidesDir, outFile, files });
  }
}

main().catch(e => { console.error(e); process.exit(1); });
