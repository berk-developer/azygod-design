# Slide Decks：HTML幻灯片制作规范

做幻灯片是设计工作的高频场景。这份文档说明怎么做好HTML幻灯片。

**和huashu-slides skill的区别**：huashu-slides focus on「AI演示文稿全流程」（含PPT导出）；本文档focus on「用HTML本身作为呈现媒介」的设计方法论。两者可以配合使用——用这里的方法做高质量的HTML deck，再用huashu-slides导出成PPTX。

---

## 🛑 先定架构：单文件 还是 多文件？

**这个选择是做幻灯片的第一步，错了会反复踩坑。先读完这一节再动手。**

### 两种架构对比

| 维度 | 单文件 + `deck_stage.js` | **多文件 + `deck_index.html` 拼接器** |
|------|--------------------------|--------------------------------------|
| 代码结构 | 一个 HTML，所有 slide 是 `<section>` | 每页独立 HTML，`index.html` 用 iframe 拼接 |
| CSS 作用域 | ❌ 全局，一页的样式可能影响所有页 | ✅ 天然隔离，iframe 各自一片天 |
| 验证粒度 | ❌ 要 JS goTo 才能切到某页 | ✅ 单页文件双击就能在浏览器看 |
| 并行开发 | ❌ 一个文件，多 agent 改会冲突 | ✅ 多 agent 可并行做不同页，零冲突 merge |
| 调试难度 | ❌ 一处 CSS 出错，全 deck 翻车 | ✅ 一页出错只影响自己 |
| 内嵌交互 | ✅ 跨页共享状态很简单 | 🟡 iframe 间需 postMessage |
| 打印 PDF | ✅ 内置 | ✅ 拼接器 beforeprint 遍历 iframe |
| 键盘导航 | ✅ 内置 | ✅ 拼接器内置 |

### 选哪个？（决策树）

```
│ 问：deck 预计有多少页？
├── ≤10 页、需要 in-deck 动画或跨页交互、pitch deck → 单文件
└── ≥10 页、学术讲座、课件、长 deck、多 agent 并行 → 多文件（推荐）
```

**默认走多文件路径**。它不是「备选」，是**长 deck 和团队协作的主路径**。原因：单文件架构的每一个优势（键盘导航、打印、scale）多文件都有，而多文件的作用域隔离和可验证性是单文件补不回来的。

### 为什么这条规则这么硬？（真实事故记录）

单文件架构曾经在 AI心理学讲座 deck 制作中连踩四坑：

1. **CSS 特异性覆盖**：`.emotion-slide { display: grid }` (特异性 10) 干翻 `deck-stage > section { display: none }` (特异性 2)，导致所有页同时渲染叠加。
2. **Shadow DOM slot 规则被外层 CSS 压制**：`::slotted(section) { display: none }` 挡不住 outer rule 的覆盖，sections 不肯隐藏。
3. **localStorage + hash 导航竞态**：刷新后不是跳到 hash 位置，而是停在 localStorage 记录的旧位置。
4. **验证成本高**：必须 `page.evaluate(d => d.goTo(n))` 才能截某页，比直接 `goto(file://.../slides/05-X.html)` 慢一倍，还常报错。

全部根因是**单一全局命名空间**——多文件架构从物理层面把这些问题消除了。

---

## 路径 A（默认）：多文件架构

### 目录结构

```
我的Deck/
├── index.html              # 从 assets/deck_index.html 复制来，改 MANIFEST
├── shared/
│   ├── tokens.css          # 共享设计 token（色板/字号/常用 chrome）
│   └── fonts.html          # <link> 引入 Google Fonts（每页 include）
└── slides/
    ├── 01-cover.html       # 每个文件都是完整 1920×1080 HTML
    ├── 02-agenda.html
    ├── 03-problem.html
    └── ...
```

### 每张 slide 的模板骨架

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<title>P05 · Chapter Title</title>
<link href="https://fonts.googleapis.com/css2?family=..." rel="stylesheet">
<link rel="stylesheet" href="../shared/tokens.css">
<style>
  /* 这一页独有的样式。用任何 class 名都不会污染别的页。*/
  body { padding: 120px; }
  .my-thing { ... }
</style>
</head>
<body>
  <!-- 1920×1080 的内容（由 body 的 width/height 在 tokens.css 里锁定）-->
  <div class="page-header">...</div>
  <div>...</div>
  <div class="page-footer">...</div>
</body>
</html>
```

**关键约束**：
- `<body>` 就是画布，直接在上面布局。不要包 `<section>` 或其他 wrapper。
- `width: 1920px; height: 1080px` 由 `shared/tokens.css` 里的 `body` 规则锁定。
- 引 `shared/tokens.css` 共享设计 token（色板、字号、page-header/footer 等）。
- 字体 `<link>` 每页自己写（fonts 单独 import 不贵，且保证每页独立可打开）。

### 拼接器：`deck_index.html`

**直接从 `assets/deck_index.html` 复制**。你只需要改一处——`window.DECK_MANIFEST` 数组，按顺序列出所有 slide 文件名和人类可读标签：

```js
window.DECK_MANIFEST = [
  { file: "slides/01-cover.html",    label: "封面" },
  { file: "slides/02-agenda.html",   label: "目录" },
  { file: "slides/03-problem.html",  label: "问题陈述" },
  // ...
];
```

拼接器已内置：键盘导航（←/→/Home/End/数字键/P 打印）、scale + letterbox、右下计数器、localStorage 记忆、hash 跳页、打印模式（遍历 iframe 按页输出 PDF）。

### 单页验证（这是多文件架构的杀手级优势）

每张 slide 都是独立 HTML。**做完一张就在浏览器双击打开看**：

```bash
open slides/05-personas.html
```

Playwright 截图也是直接 `goto(file://.../slides/05-personas.html)`，不需要 JS 跳页，也不会被别的页的 CSS 干扰。这让「改一点验一点」的工作流成本接近零。

### 并行开发

把每张 slide 的任务拆给不同 agent，同时跑——HTML 文件彼此独立，merge 时没有冲突。长 deck 用这种并行方式能把制作时间压到 1/N。

### `shared/tokens.css` 该放什么

只放**真正跨页共用**的东西：

- CSS 变量（色板、字号阶、间距阶）
- `body { width: 1920px; height: 1080px; }` 这样的 canvas 锁定
- `.page-header` / `.page-footer` 这种每页都用一模一样的 chrome

**不要**把单页的布局 class 塞进来——那会退化回单文件架构的全局污染问题。

---

## 路径 B（小 deck）：单文件 + `deck_stage.js`

适用于 ≤10 页、需要跨页共享状态（比如一个 React tweaks 面板要操控所有页）、或者做 pitch deck demo 这种要求极度紧凑的场景。

### 基本用法

1. 从 `assets/deck_stage.js` 读取内容，嵌入 HTML 的 `<script>`（或 `<script src="deck_stage.js">`）
2. 在 body 里用 `<deck-stage>` 包 slide：

```html
<deck-stage>
  <section>
    <h1>Slide 1</h1>
  </section>
  <section>
    <h1>Slide 2</h1>
  </section>
</deck-stage>
```

### ⚠️ 单文件架构的 CSS 陷阱（务必阅读）

单文件架构最常见的坑——**`display` 属性被单页样式偷走**。

如果你给某张 slide 的样式写了 `display: flex/grid`：

```css
.emotion-slide { display: grid; }   /* 特异性: 10 */
```

它会压过 deck 级的「隐藏非 active 页」规则：

```css
deck-stage > section { display: none; }   /* 特异性: 2 */
```

结果所有 slide 同时渲染叠加。

**修复模式**（写 deck 时必做）：

```css
/* ✅ 用 :not(.active) + !important 锁死「非激活即隐藏」 */
deck-stage > section:not(.active) {
  display: none !important;
}
```

特异性+权重双保险，单页 layout class 的 `display: grid/flex` 就不会影响可见性。

另一个替代方案：**把单页的 flex/grid 写到内部 wrapper div 上**，section 本身只管 `display: block/none`。

### 自定义尺寸

```html
<deck-stage width="1080" height="1920">
  <!-- 9:16 竖版 -->
</deck-stage>
```

---

## Slide Labels

Deck_stage 和 deck_index 都会给每页打标签（计数器显示）。给它们**更有意义**的 label：

**多文件**：在 `MANIFEST` 里写 `{ file, label: "04 问题陈述" }`
**单文件**：在 section 上加 `<section data-screen-label="04 Problem Statement">`

**关键：Slide 编号从 1 开始，不要从 0**。

用户说"slide 5"时，他指的是第 5 张，永远不是数组位置 `[4]`。人类不说 0-indexed。

---

## Speaker Notes

**默认不加**，只在用户明确要求时才加。

加了 speaker notes 你就可以把 slide 上的文字减少到最小，focus on impactful visuals——notes 承载完整 script。

### 格式

**多文件**：在 `index.html` 的 `<head>` 里写：

```html
<script type="application/json" id="speaker-notes">
[
  "第1张的 script...",
  "第2张的 script...",
  "..."
]
</script>
```

**单文件**：同上位置。

### Notes 写作要点

- **完整**：不是提纲，是真要讲的话
- **对话式**：像平时说话，不是书面语
- **对应**：数组第 N 个对应第 N 张 slide
- **长度**：200-400 字最佳
- **情绪线**：标注重音、停顿、强调点

---

## Slide 设计模式

### 1. 建立一个系统（必做）

探索完 design context 后，**先口头说你要用的系统**：

```markdown
Deck系统：
- 背景色：最多2种（90% 白 + 10% 深色 section divider）
- 字型：display 用 Instrument Serif，body 用 Geist Sans
- 节奏：section divider 用 full-bleed 彩色 + 白字，普通 slide 白底
- 图像：hero slide 用 full-bleed 照片，data slide 用 chart

我按这个系统做，有问题告诉我。
```

用户确认后再往下做。

### 2. 常用 slide layouts

- **Title slide**：纯色背景 + 巨大标题 + 副标题 + 作者/日期
- **Section divider**：彩色背景 + 章节号 + 章节标题
- **Content slide**：白底 + 标题 + 1-3 bullet points
- **Data slide**：标题 + 大图表/数字 + 简短说明
- **Image slide**：full-bleed 照片 + 底部小 caption
- **Quote slide**：留白 + 巨大 quote + attribution
- **Two-column**：左右对比（vs / before-after / problem-solution）

一个 deck 里最多用 4-5 种 layout。

### 3. Scale（再次强调）

- 正文最小 **24px**，理想 28-36px
- 标题 **60-120px**
- Hero 字 **180-240px**
- 幻灯片是给 10 米外看的，字要够大

### 4. 视觉节奏

Deck 需要 **intentional variety**：

- 颜色节奏：大部分白底 + 偶尔彩色 section divider + 偶尔 dark 片段
- 密度节奏：几张 text-heavy 的 + 几张 image-heavy 的 + 几张 quote 留白
- 字号节奏：正常标题 + 偶尔巨型 hero 文字

**不要每张 slide 长一样**——那是 PPT 模板，不是设计。

### 5. 空间呼吸（数据密集页必读）

**新手最容易踩的坑**：把所有能放的信息都塞进一页。

信息密度 ≠ 有效信息传达。学术/演讲类 deck 尤其要克制：

- 列表/矩阵页：不要把 N 个元素都画成同一大小。用 **主次分层**——今天要聊的 5 个放大做主角，剩下 16 个缩小做背景 hint。
- 大数字页：数字本身是视觉主角。周围的 caption 不要超过 3 行，否则观众眼球来回跳。
- 引用页：引语和 attribution 之间要有留白隔开，不要贴在一起。

对照「数据是不是主角」「文字有没有挤在一起」两条自我审查，改到留白让你有点不安为止。

---

## 打印为 PDF

**多文件**：`deck_index.html` 已处理 `beforeprint` 事件，按页输出 PDF。

**单文件**：`deck_stage.js` 同样处理。

打印样式已写好，不需要额外写 `@media print` CSS。

---

## 导出为 PPTX / PDF（自助脚本）

HTML 优先是第一公民。但用户经常需要 PPTX/PDF 交付。提供两个通用脚本，**任何多文件 deck 都能用**，位于 `scripts/` 下：

### `export_deck_pdf.mjs` — 导出矢量 PDF（推荐）

```bash
node scripts/export_deck_pdf.mjs --slides <slides-dir> --out deck.pdf
```

**特点**：
- 文字**保留矢量**（可复制、可搜索）
- 视觉 100% 保真（Playwright 内嵌 Chromium 渲染后打印）
- **不需要改 HTML 任何一个字**
- 每个 slide 独立 `page.pdf()`，再用 `pdf-lib` 合并

**依赖**：`npm install playwright pdf-lib`

**限制**：PDF 不能再编辑文字——要改回到 HTML 改。

### `export_deck_pptx.mjs` — 导出 PPTX（两种模式）

```bash
# 图片铺底（视觉 100% 保真，不可编辑文字）
node scripts/export_deck_pptx.mjs --slides <dir> --out deck.pptx --mode image

# 每个文本独立文本框（可编辑，但字体会回落）
node scripts/export_deck_pptx.mjs --slides <dir> --out deck.pptx --mode editable
```

| 模式 | 视觉保真 | 文字可编辑 | 工作原理 | 限制 |
|------|---------|----------|---------|------|
| `image` | ✅ 100% | ❌ | Playwright 截图 → pptxgenjs addImage | 文字变图片 |
| `editable` | 🟡 ~70% | ✅ | html2pptx 提取每个文本框 | 见下方约束 |

**editable 模式的硬性约束**（用户 HTML 必须满足，否则该页 skip）：
- 所有文字必须在 `<p>`/`<h1>`-`<h6>`/`<ul>`/`<ol>` 里（禁止裸文本 div）
- `<p>`/`<h*>` 标签自身不能有 background/border/shadow（放外层 div）
- 不用 `::before`/`::after` 插入装饰文字（伪元素提不出来）
- inline 元素（span/em/strong）不能有 margin
- 不用 CSS gradient（不可渲染）
- div 不用 `background-image`（用 `<img>`）

脚本已内置**自动预处理器**——把 "叶子 div 里的裸文本" 自动包成 `<p>`（保留 class）。这解决了最常见的违规（裸文本）。但其他违规（p 上有 border、span 上有 margin 等）仍需 HTML 源头合规。

**editable 模式的另一个 caveat——字体回落**：
- Playwright 用 webfont 测量 text-box 尺寸；PowerPoint/Keynote 用本机字体渲染
- 两者不同时会有**溢出或错位**——每页都要肉眼过
- 建议目标机器装好 HTML 里用的字体，或 fallback 到 `system-ui`

### 从一开始就让 HTML 对导出友好

对性能最稳的 deck：**从写 HTML 时就按 editable 模式的约束写**。这样 `--mode editable` 可以直接全部 pass。额外成本不大：

```html
<!-- ❌ 不好 -->
<div class="title">关键发现</div>

<!-- ✅ 好（p 包裹，class 继承） -->
<p class="title">关键发现</p>

<!-- ❌ 不好（border 在 p 上） -->
<p class="stat" style="border-left: 3px solid red;">41%</p>

<!-- ✅ 好（border 在外层 div） -->
<div class="stat-wrap" style="border-left: 3px solid red;">
  <p class="stat">41%</p>
</div>
```

### 何时选哪个

| 场景 | 推荐 |
|------|------|
| 给主办方/档案存档 | **PDF**（通用、高保真、文字可搜） |
| 发给协作者让他们微调文字 | **PPTX editable**（接受字体回落） |
| 要现场演讲、不改内容 | **PDF** 或 **PPTX image** |
| HTML 是首选呈现媒介 | 直接浏览器播放，导出只是备份 |

## 导出为可编辑 PPTX 的深度路径（仅长期项目）

如果你的 deck 会长期维护、反复修改、团队协作——建议**一开始就按 html2pptx 约束写 HTML**，让 `--mode editable` 稳定通过。详见 `huashu-slides` skill 的 `references/prompt-templates.md` 第 2 节（4 条硬性约束）。

---

## 常见问题

**多文件：iframe 里的页打不开 / 白屏**
→ 检查 `MANIFEST` 的 `file` 路径是否相对 `index.html` 正确。用浏览器 DevTools 看 iframe 的 src 能否直接访问。

**多文件：某页样式和别页冲突**
→ 不可能（iframe 隔离）。如果感觉冲突，那是缓存——Cmd+Shift+R 强刷。

**单文件：多 slide 同时渲染叠加**
→ CSS 特异性问题。看上面「单文件架构的 CSS 陷阱」一节。

**单文件：缩放看起来不对**
→ 检查是否所有 slide 直接挂在 `<deck-stage>` 下作为 `<section>`。中间不能包 `<div>`。

**单文件：想跳到特定 slide**
→ URL 加 hash：`index.html#slide-5` 跳到第 5 张。

**两种架构都适用：字在不同屏幕下位置不一致**
→ 用固定尺寸（1920×1080）和 `px` 单位，不要用 `vw`/`vh` 或 `%`。缩放统一处理。

---

## 验证检查清单（做完 deck 必过）

1. [ ] 浏览器直接打开 `index.html`（或主 HTML），检查首页无破图、字体已加载
2. [ ] 按 → 键翻到每一页，没有空白页、没有布局错位
3. [ ] 按 P 键打印预览，每页恰好一张 A4（或 1920×1080）且无裁切
4. [ ] 随机选 3 页 Cmd+Shift+R 强刷，localStorage 记忆正常工作
5. [ ] Playwright 批量截图（单页架构：遍历 `slides/*.html`；单文件架构：用 goTo 切换），人工肉眼过一遍
6. [ ] 搜一下 `TODO` / `placeholder` 残留，确认都清理了
