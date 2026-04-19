# Animation Pitfalls：HTML 动画踩过的坑与规则

做动画时最常踩的 bug 和如何避免。每条规则都来自真实失败案例。

写动画之前读完这篇，能省一轮迭代。

## 1. 叠层布局 —— `position: relative` 是默认义务

**踩的坑**：一个 sentence-wrap 元素包了 3 个 bracket-layer（`position: absolute`）。没给 sentence-wrap 设 `position: relative`，结果 absolute 的 bracket 以 `.canvas` 为坐标系，飘到屏幕底部 200px 外。

**规则**：
- 任何包含 `position: absolute` 子元素的容器，**必须**显式 `position: relative`
- 即使视觉上不需要「偏移」，也要写 `position: relative` 作为坐标系锚点
- 如果你在写 `.parent { ... }`，其子元素里有 `.child { position: absolute }`，下意识给 parent 加 relative

**快速检查**：每出现一个 `position: absolute`，往上数 ancestor，确保最近的 positioned 祖先是你*想要的*坐标系。

## 2. 字符陷阱 —— 不依赖稀有 Unicode

**踩的坑**：想用 `␣` (U+2423 OPEN BOX) 可视化「空格 token」。Noto Serif SC / Cormorant Garamond 都没这个字形，渲染为空白/豆腐，观众完全看不到。

**规则**：
- **动画里出现的每个字符，都必须在你选定的字体里存在**
- 常见稀有字符黑名单：`␣ ␀ ␐ ␋ ␨ ↩ ⏎ ⌘ ⌥ ⌃ ⇧ ␦ ␖ ␛`
- 要表达「空格 / 回车 / 制表符」这类元字符，用 **CSS 构造的语义盒子**：
  ```html
  <span class="space-key">Space</span>
  ```
  ```css
  .space-key {
    display: inline-flex;
    padding: 4px 14px;
    border: 1.5px solid var(--accent);
    border-radius: 4px;
    font-family: monospace;
    font-size: 0.3em;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }
  ```
- Emoji 也要验证：某些 emoji 在 Noto Emoji 以外字体会 fallback 成灰色方框，最好用 `emoji` font-family 或 SVG

## 3. 数据驱动的 Grid/Flex 模板

**踩的坑**：代码里 `const N = 6` 个 tokens，但 CSS 写死 `grid-template-columns: 80px repeat(5, 1fr)`。结果第 6 个 token 没有 column，整个矩阵错位。

**规则**：
- 当 count 从 JS 数组来（`TOKENS.length`），CSS 模板也应该数据驱动
- 方案 A：用 CSS 变量从 JS 注入
  ```js
  el.style.setProperty('--cols', N);
  ```
  ```css
  .grid { grid-template-columns: 80px repeat(var(--cols), 1fr); }
  ```
- 方案 B：用 `grid-auto-flow: column` 让浏览器自动扩展
- **禁用「固定数字 +  JS 常量」的组合**，N 改了 CSS 不会同步更新

## 4. 过渡断层 —— 场景切换要连续

**踩的坑**：zoom1 (13-19s) → zoom2 (19.2-23s) 之间，主句子已经 hidden，zoom1 fade out（0.6s）+ zoom2 fade in（0.6s）+ stagger delay（0.2s+）= 约 1 秒纯空白画面。观众以为动画卡住了。

**规则**：
- 连续切换场景时，fade out 和 fade in 要**交叉重叠**，不是前一个完全消失再开始下一个
  ```js
  // 差：
  if (t >= 19) hideZoom('zoom1');      // 19.0s out
  if (t >= 19.4) showZoom('zoom2');    // 19.4s in → 中间 0.4s 空白

  // 好：
  if (t >= 18.6) hideZoom('zoom1');    // 提前 0.4s 开始 fade out
  if (t >= 18.6) showZoom('zoom2');    // 同时 fade in（cross-fade）
  ```
- 或者用一个「锚点元素」（如主句子）作为场景之间的视觉连接，zoom 切换期间它短暂回显
- 配 CSS transition 的 duration 算清楚，避免 transition 还没结束就触发下一个

## 5. Pure Render 原则 —— 动画状态应可 seek

**踩的坑**：用 `setTimeout` + `fireOnce(key, fn)` 链式触发动画状态。正常播放没问题，但做逐帧录制/seek到任意时间点时，之前的 setTimeout 已经执行过就无法「回到过去」。

**规则**：
- `render(t)` 函数理想上是 **pure function**：给定 t 输出唯一 DOM 状态
- 如果必须用副作用（如 class 切换），用 `fired` set 配合显式 reset：
  ```js
  const fired = new Set();
  function fireOnce(key, fn) { if (!fired.has(key)) { fired.add(key); fn(); } }
  function reset() { fired.clear(); /* 清所有 .show class */ }
  ```
- 暴露 `window.__seek(t)` 供 Playwright / 调试用：
  ```js
  window.__seek = (t) => { reset(); render(t); };
  ```
- 动画相关的 setTimeout 不要跨越 >1 秒，否则 seek 回跳时会乱套

## 6. 字体加载前测量 = 测错

**踩的坑**：页面一 DOMContentLoaded 就调用 `charRect(idx)` 测量 bracket 位置，字体还没加载，每个字符宽度是 fallback 字体的宽度，位置全错。等字体一加载（约 500ms 后），bracket 的 `left: Xpx` 还是老值，永久偏移。

**规则**：
- 任何依赖 DOM 测量（`getBoundingClientRect`、`offsetWidth`）的布局代码，**必须**包在 `document.fonts.ready.then()` 里
  ```js
  document.fonts.ready.then(() => {
    requestAnimationFrame(() => {
      buildBrackets(...);  // 此时字体已就绪，测量准确
      tick();              // 动画开始
    });
  });
  ```
- 额外的 `requestAnimationFrame` 给浏览器一帧时间提交 layout
- 如果用 Google Fonts CDN，`<link rel="preconnect">` 加速首次加载

## 7. 录制准备 —— 为视频导出预留抓手

**踩的坑**：Playwright `recordVideo` 默认 25fps，从 context 创建就开始录。页面加载、字体加载的前 2 秒都被录进去。交付时视频前面 2 秒空白/闪白。

**规则**：
- 提供 `render-video.js` 工具处理：warmup navigate → reload 重启动画 → 等 duration → ffmpeg trim head + 转 H.264 MP4
- 动画的**第 0 帧**要是最终布局已就位的完整初始状态（不是空白或加载中）
- 想要 60fps？用 ffmpeg `minterpolate` 后处理，不指望浏览器源帧率
- 想要 GIF？两阶段 palette（`palettegen` + `paletteuse`），对 30s 1080p 动画能压到 3MB

参见 `video-export.md` 获取完整脚本调用方式。

## 8. 批量导出 —— tmp 目录必须带 PID 防并发冲突

**踩的坑**：用 `render-video.js` 3 个进程并行录 3 个 HTML。因为 TMP_DIR 只用 `Date.now()` 命名，3 个进程同毫秒启动时共用同一个 tmp 目录。最先完成的进程清理 tmp，另外两个读目录时 `ENOENT`，全部崩溃。

**规则**：
- 任何多进程可能共用的临时目录，命名必须带 **PID 或随机后缀**：
  ```js
  const TMP_DIR = path.join(DIR, '.video-tmp-' + Date.now() + '-' + process.pid);
  ```
- 如果确实想多文件并行，用 shell 的 `&` + `wait` 而不是在一个 node 脚本里 fork
- 批量录多个 HTML 时，保守做法：**串行**运行（2 个以内可并行，3 个以上老实排队）

## 9. 录屏里有进度条/重播按钮 —— Chrome 元素污染视频

**踩的坑**：动画 HTML 加了 `.progress` 进度条、`.replay` 重播按钮、`.counter` 时间戳，方便人类调试播放。录成 MP4 交付时这些元素出现在视频底部，像把开发者工具截进去了一样。

**规则**：
- HTML 里给人类用的「chrome 元素」（progress bar / replay button / footer / masthead / counter / phase labels）和视频内容本体分开管理
- **约定 class 名** `.no-record`：任何带这个 class 的元素，录屏脚本自动隐藏
- 脚本端（`render-video.js`）默认注入 CSS 隐藏常见 chrome class 名：
  ```
  .progress .counter .phases .replay .masthead .footer .no-record [data-role="chrome"]
  ```
- 用 Playwright 的 `addInitScript` 注入（会在每次 navigate 前生效，reload 也稳）
- 想看原样 HTML（带 chrome）时加 `--keep-chrome` flag

## 10. 录屏开头几秒动画重复 —— Warmup 帧泄漏

**踩的坑**：`render-video.js` 的旧流程 `goto → wait fonts 1.5s → reload → wait duration`。录制从 context 创建就开始，warmup 阶段动画已经播了一段，reload 后从 0 重启。结果视频前几秒是「动画中段 + 切换 + 动画从 0 开始」，重复感强。

**规则**：
- **Warmup 和 Record 必须用独立的 context**：
  - Warmup context（无 `recordVideo` 选项）：只负责 load url、等字体、然后 close
  - Record context（有 `recordVideo`）：fresh 状态开始，animation 从 t=0 开始录
- ffmpeg `-ss trim` 只能裁 Playwright 的一点点 startup latency（~0.3s），**不能**用来掩盖 warmup 帧；源头要干净
- 录制 context 关闭 = webm 文件写入磁盘，这是 Playwright 的约束
- 相关代码模式：
  ```js
  // Phase 1: warmup (throwaway)
  const warmupCtx = await browser.newContext({ viewport });
  const warmupPage = await warmupCtx.newPage();
  await warmupPage.goto(url, { waitUntil: 'networkidle' });
  await warmupPage.waitForTimeout(1200);
  await warmupCtx.close();

  // Phase 2: record (fresh)
  const recordCtx = await browser.newContext({ viewport, recordVideo });
  const page = await recordCtx.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(DURATION * 1000);
  await page.close();
  await recordCtx.close();
  ```

## 11. 画面内别画「伪 chrome」—— 装饰版 player UI 与真 chrome 撞车

**踩的坑**：动画用 `Stage` 组件，已经自带 scrubber + 时间码 + 暂停按钮（属于 `.no-record` chrome，导出时自动隐藏）。我又在画面底部画了一条「`00:60 ──── CLAUDE-DESIGN / ANATOMY`」的"杂志页码感装饰进度条"，自我感觉良好。**结果**：用户看到两条进度条——一条是 Stage 控制器，一条是我画的装饰。视觉上完全撞车，认定为 bug。「视频内还有个进度条是怎么回事？」

**规则**：

- Stage 已经提供：scrubber + 时间码 + 暂停/重播按钮。**画面内不要再画**进度指示、当前时间码、版权署名条、章节计数器——它们要么和 chrome 撞车，要么就是 filler slop（违反「earn its place」原则）。
- 「页码感」「杂志感」「底部署名条」这些**装饰诉求**，是 AI 自动加上的高频 filler。每一个出现都要警觉——它真的传达了不可替代的信息吗？还是单纯填满空白？
- 如果你坚信某个底部条带必须存在（例如：动画主题就是讲 player UI），那它必须**叙事必要**，且**视觉上和 Stage scrubber 显著区分**（不同位置、不同形式、不同色调）。

**元素归属测试**（每个画进 canvas 的元素必须能回答）：

| 它属于什么 | 处理 |
|------------|------|
| 某一幕的叙事内容 | OK，留着 |
| 全局 chrome（控制/调试用） | 加 `.no-record` class，导出时隐藏 |
| **既不属于任何幕，又不是 chrome** | **删**。这就是无主之物，必然是 filler slop |

**自检（交付前 3 秒）**：截一张静态图，问自己——

- 画面里有没有「看起来像 video player UI 的东西」（横线进度条、时间码、控制按钮模样）？
- 如果有，删掉它叙事是否有损？无损就删。
- 同一类信息（进度/时间/署名）有没有出现两次？合并到 chrome 一处。

**反例**：底部画 `00:42 ──── PROJECT NAME`、画面右下角画"CH 03 / 06"章节计数、画面边缘画版本号"v0.3.1"——都是伪 chrome filler。

## 12. 录屏前置空白 —— 用 `window.__ready` 同步动画 t=0

**踩的坑**：60 秒动画导出 MP4，前 2-3 秒是空白页面。`ffmpeg --trim=0.3` 剪不掉。

**根因**：Playwright `recordVideo` 从 `newContext()` 那一刻就开始写 WebM。但此时 Babel Standalone 还在编译 inline JSX、React 还没 mount、`document.fonts.ready.then(root.render)` 还没触发。`page.goto(url, { waitUntil: 'networkidle' })` 只等网络空闲，检测不到 JS 执行阶段——所以 WebM 前 1.5-3s 是空白页。

**规则**：

1. **动画代码**在 tick 第一帧发 `window.__ready = true`，和动画 t=0 同步：
   ```js
   function tick(now) {
     if (last === null) {
       last = now;
       window.__ready = true;  // 必须在这里，不是 useEffect
     }
     // ... 动画推进
   }
   ```
   为什么同步？如果 `__ready` 在 tick 之前设（如 `useEffect` 或 rAF 排队），触发时 WebM 光标还在空白页；如果在 tick 之后设（rAF 嵌套），则动画已经跑了几帧被 trim 掉。**pair 起来**才是对的。

2. **录屏脚本**`page.goto` 之后 `waitForFunction(() => window.__ready === true)`，记录此时相对 WebM 起点的秒数作为 ffmpeg trim 偏移。完全不靠猜。

3. **字体等待**放在 tick 启动条件里：`document.fonts.ready.then(() => rAF(tick))`。这样 tick 第一帧就是字体已就绪的画面——`__ready` 信号 = WebM 捕到的第一个"用户会看到"的动画帧。

**不这么做的代价**：固定 trim 靠猜。机器快慢、字体缓存状态、网速每次不同——某台机器上的 3s trim 换到另一台可能不够或截掉开头。动态测量从根本解决。

**参考实现**：`assets/animations.jsx` 的 Stage 组件已内置。`scripts/render-video.js` 已内置 auto-trim 逻辑。非 animations.jsx 的手写 HTML，自行在 tick/渲染循环的第一帧设信号。

**验证方法**：导出后 `ffmpeg -i video.mp4 -ss 0 -vframes 1 frame-0.png`，检查第一帧是动画应有的初始状态（不是动画中段、不是黑屏）。

## 快速自查清单（开工前 5 秒）

- [ ] 每个 `position: absolute` 的父元素都有 `position: relative`？
- [ ] 动画里的特殊字符（`␣` `⌘` `emoji`）都在字体里存在？
- [ ] Grid/Flex 模板的 count 和 JS 数据的 length 一致？
- [ ] 场景切换之间有 cross-fade，没有 >0.3s 的纯空白？
- [ ] DOM 测量代码包在 `document.fonts.ready.then()` 里？
- [ ] `render(t)` 是 pure 的，或有明确的 reset 机制？
- [ ] 第 0 帧是完整初始状态，不是空白？
- [ ] 画面内没有「伪 chrome」装饰（进度条/时间码/底部署名条与 Stage scrubber 撞车）？
- [ ] 动画 tick 第一帧同步设 `window.__ready = true`？（用 animations.jsx 自带；手写 HTML 自己加）
- [ ] 导出后抽第 0 帧验证是动画初始状态？
