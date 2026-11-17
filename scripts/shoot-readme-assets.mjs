#!/usr/bin/env node
// 重新生成 README 素材（docs/assets/）。UI 改版后跑一次即可，别手工截图 ——
// 3D 星图需要脚本控制相机才能拿到一致的构图。
//
//   1. 先起服务：npm run dev
//   2. 再拍：     node scripts/shoot-readme-assets.mjs
//
// 可选参数：--url=http://localhost:5173  --out=docs/assets  --skip-gif
// GIF 需要 ffmpeg；没装则自动跳过，其余静态图照常产出。
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const arg = (name, fallback) =>
  process.argv.find((a) => a.startsWith(`--${name}=`))?.split("=").slice(1).join("=") ?? fallback;

const URL = arg("url", "http://localhost:5173");
const OUT = path.resolve(root, arg("out", "docs/assets"));
const SKIP_GIF = process.argv.includes("--skip-gif");

const VIEW = { width: 1440, height: 810 };
const ONBOARDING_KEY = "qunxing-onboarded-v1"; // 同 tests/smoke.spec.ts
const tmp = fs.mkdtempSync(path.join(root, ".readme-assets-"));

fs.mkdirSync(OUT, { recursive: true });

function hasFfmpeg() {
  try {
    execFileSync("ffmpeg", ["-version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

const ffmpeg = (args) => execFileSync("ffmpeg", ["-y", "-v", "error", ...args], { stdio: "inherit" });

/** OrbitControls 只认真实的 pointermove 序列，一步到位的 drag 无效 */
async function orbit(page, dy, steps = 24) {
  const cx = VIEW.width / 2;
  const cy = VIEW.height / 2 + 120;
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  for (let i = 1; i <= steps; i += 1) {
    await page.mouse.move(cx, cy + (dy * i) / steps);
    await page.waitForTimeout(12);
  }
  await page.mouse.up();
  await page.waitForTimeout(400);
}

async function newPage(context) {
  const page = await context.newPage();
  await page.goto(URL);
  await page.waitForSelector("canvas");
  await page.waitForTimeout(2500); // 等数据加载 + 星图自转起来
  return page;
}

const browser = await chromium.launch();

// ---------- 静态图 ----------
{
  const context = await browser.newContext({
    viewport: VIEW,
    deviceScaleFactor: 2,
    locale: "zh-CN",
  });
  await context.addInitScript(([key]) => localStorage.setItem(key, "1"), [ONBOARDING_KEY]);
  const shot = (page, name) => page.screenshot({ path: path.join(tmp, `${name}.png`) });

  // hero：默认是俯视，转到赤道视角才有横贯银河的构图
  const page = await newPage(context);
  await orbit(page, -220);
  await shot(page, "hero-raw");

  // 筛选 + 关系类型
  await page.reload();
  await page.waitForTimeout(2000);
  const filters = page.getByLabel("星图筛选");
  await filters.locator("label", { hasText: "文明" }).locator("select").selectOption("chinese");
  await page.getByRole("button", { name: "师承" }).click();
  await page.getByRole("button", { name: "影响" }).click();
  await page.waitForTimeout(1800);
  await shot(page, "filters");

  // 恒星系详情
  await page.reload();
  await page.waitForTimeout(2000);
  await page.getByLabel("搜索哲人、文明、命题").fill("柏拉图");
  await page.waitForTimeout(400);
  await page.getByRole("button", { name: /柏拉图/ }).click();
  await page.waitForTimeout(2500); // 相机飞入
  await shot(page, "detail-panel");

  // 思想信息图
  const detail = page.getByLabel("柏拉图详情");
  await detail.getByRole("button", { name: /理念与真实/ }).click();
  await page.waitForTimeout(1200);
  await shot(page, "infographic");
  await page.getByRole("button", { name: /返回恒星系/ }).click();
  await page.waitForTimeout(800);

  // 收藏抽屉
  await detail.getByRole("button", { name: "收藏哲人" }).click();
  await detail.getByRole("button", { name: "收藏论证" }).first().click();
  await detail.getByRole("button", { name: "关闭" }).click();
  await page.getByLabel("搜索哲人、文明、命题").fill("正义");
  await page.waitForTimeout(600);
  await page.getByLabel("搜索结果").getByRole("button", { name: "收藏这个问题" }).click();
  await page.getByRole("button", { name: "收藏", exact: true }).click();
  await page.waitForTimeout(800);
  await shot(page, "collections");

  // 投稿向导
  await page.reload();
  await page.waitForTimeout(2000);
  await page.getByRole("button", { name: "投稿" }).click();
  await page.waitForTimeout(800);
  await shot(page, "contribute");

  await context.close();
  console.log("✓ 静态图已拍完");
}

// ---------- 演示视频 ----------
let videoPath = null;
if (!SKIP_GIF) {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1,
    locale: "zh-CN",
    recordVideo: { dir: path.join(tmp, "video"), size: { width: 1280, height: 720 } },
  });
  await context.addInitScript(([key]) => localStorage.setItem(key, "1"), [ONBOARDING_KEY]);
  const page = await newPage(context);
  await page.waitForTimeout(500);

  const search = page.getByLabel("搜索哲人、文明、命题");
  await search.click();
  await search.pressSequentially("柏拉图", { delay: 180 }); // 逐字输入更像演示
  await page.waitForTimeout(1200);
  await page.getByRole("button", { name: /柏拉图/ }).click();
  await page.waitForTimeout(3500);
  await page.getByLabel("柏拉图详情").getByRole("button", { name: /理念与真实/ }).click();
  await page.waitForTimeout(3500); // 停住让人看清信息图
  await page.getByRole("button", { name: /返回恒星系/ }).click();
  await page.waitForTimeout(1800);

  await context.close(); // 必须 close 才会 flush 视频
  const dir = path.join(tmp, "video");
  videoPath = path.join(dir, fs.readdirSync(dir).find((f) => f.endsWith(".webm")));
  console.log("✓ 演示视频已录完");
}

await browser.close();

// ---------- 后期：裁剪、缩放、转 GIF ----------
if (!hasFfmpeg()) {
  console.warn("! 未找到 ffmpeg，跳过裁剪与 GIF；原始截图留在", tmp);
} else {
  // hero 裁掉下方空白，压成宽幅 banner
  ffmpeg([
    "-i", path.join(tmp, "hero-raw.png"),
    "-vf", "crop=2880:1150:0:0,scale=1600:-1",
    path.join(OUT, "hero.png"),
  ]);

  for (const name of ["detail-panel", "infographic", "filters", "contribute", "collections"]) {
    ffmpeg(["-i", path.join(tmp, `${name}.png`), "-vf", "scale=1600:-1", path.join(OUT, `${name}.png`)]);
  }

  if (videoPath) {
    // 两遍调色板；这组参数把 GIF 压到 ~3MB，默认参数会到 13MB
    const chain = "setpts=0.7*PTS,fps=9,scale=720:-1:flags=lanczos";
    const palette = path.join(tmp, "palette.png");
    ffmpeg(["-i", videoPath, "-vf", `${chain},palettegen=stats_mode=diff:max_colors=32`, palette]);
    ffmpeg([
      "-i", videoPath, "-i", palette,
      "-lavfi", `[0:v]${chain}[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle:new=1`,
      path.join(OUT, "demo.gif"),
    ]);
  }

  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(`✓ 素材已写入 ${path.relative(root, OUT)}`);
  for (const f of fs.readdirSync(OUT).sort()) {
    const { size } = fs.statSync(path.join(OUT, f));
    console.log(`   ${f.padEnd(20)} ${(size / 1024).toFixed(0)} KB`);
  }
}
