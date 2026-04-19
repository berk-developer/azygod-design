#!/usr/bin/env node
/**
 * export_deck_pptx.mjs — 把多文件 slide deck 导出为 PPTX（图片铺底）
 *
 * 用法：
 *   node export_deck_pptx.mjs --slides <dir> --out <file.pptx> [--width 1920] [--height 1080]
 *
 * 特点：
 *   - 每张 slide 截图成 PNG，满铺一张 PPTX 页面
 *   - 视觉 100% 保真（因为就是图片）
 *   - ⚠️ 文字不可编辑（文字变成了图片）
 *
 * 如果用户需要「可编辑文字」的 PPTX：
 *   ❌ 不要在 claude-design 的 HTML 上硬上 html2pptx——claude-design 的 HTML 视觉自由度高，
 *      很少能满足 html2pptx 的严格约束（p 标签语法、无 ::before、无 span margin 等）。
 *      实测 32 页里能 pass 的不到 30%，剩下的要逐页改造 + 逐页修字体溢出——工时失控。
 *   ✅ 正确做法：切换到 **huashu-slides** skill 的 Path A，按它的 HTML 格式**从头重构**
 *      每一页。huashu-slides 的 HTML 从一开始就符合 html2pptx 约束，可 100% 导出可编辑 PPTX。
 *
 * 依赖：playwright pptxgenjs
 *   npm install playwright pptxgenjs
 *
 * 会按文件名排序（01-xxx.html → 02-xxx.html → ...）
 */

import { chromium } from 'playwright';
import pptxgen from 'pptxgenjs';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

function parseArgs() {
  const args = { width: 1920, height: 1080 };
  const a = process.argv.slice(2);
  for (let i = 0; i < a.length; i += 2) {
    const k = a[i].replace(/^--/, '');
    args[k] = a[i + 1];
  }
  if (!args.slides || !args.out) {
    console.error('用法: node export_deck_pptx.mjs --slides <dir> --out <file.pptx> [--width 1920] [--height 1080]');
    process.exit(1);
  }
  args.width = parseInt(args.width);
  args.height = parseInt(args.height);
  return args;
}

async function main() {
  const { slides, out, width, height } = parseArgs();
  const slidesDir = path.resolve(slides);
  const outFile = path.resolve(out);

  const files = (await fs.readdir(slidesDir))
    .filter(f => f.endsWith('.html'))
    .sort();
  if (!files.length) {
    console.error(`No .html files found in ${slidesDir}`);
    process.exit(1);
  }
  console.log(`Found ${files.length} slides, rendering to PNG...`);

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

  // Build PPTX
  const pres = new pptxgen();
  pres.defineLayout({ name: 'DECK', width: width / 96, height: height / 96 });
  pres.layout = 'DECK';
  for (const png of pngs) {
    const s = pres.addSlide();
    s.addImage({ path: png, x: 0, y: 0, w: pres.width, h: pres.height });
  }
  await pres.writeFile({ fileName: outFile });

  // cleanup
  for (const p of pngs) await fs.unlink(p).catch(() => {});
  await fs.rmdir(tmpDir).catch(() => {});

  console.log(`\n✓ Wrote ${outFile}  (${files.length} slides, image mode)`);
  console.log(`  要可编辑？改走 huashu-slides 的 Path A 从头重构 HTML。`);
}

main().catch(e => { console.error(e); process.exit(1); });
