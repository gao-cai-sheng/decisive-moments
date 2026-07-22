import { expect, test, type Locator } from "@playwright/test";

async function readCanvasSample(canvas: Locator) {
  return canvas.evaluate((element) => {
    const canvasElement = element as HTMLCanvasElement;
    const gl = canvasElement.getContext("webgl2") ?? canvasElement.getContext("webgl");
    if (!gl) return { ok: false, width: 0, height: 0, luminous: 0, samples: [] as number[] };

    const width = canvasElement.width;
    const height = canvasElement.height;
    const buffer = new Uint8Array(width * height * 4);
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, buffer);

    let luminous = 0;
    const samples: number[] = [];
    const stepX = Math.max(1, Math.floor(width / 48));
    const stepY = Math.max(1, Math.floor(height / 32));

    for (let y = 0; y < height; y += stepY) {
      for (let x = 0; x < width; x += stepX) {
        const offset = (y * width + x) * 4;
        const value = buffer[offset] + buffer[offset + 1] + buffer[offset + 2];
        if (buffer[offset + 3] > 0 && value > 45) luminous += 1;
        samples.push(value);
      }
    }

    return { ok: true, width, height, luminous, samples };
  });
}

function countChangedSamples(before: number[], after: number[]) {
  const count = Math.min(before.length, after.length);
  let changed = 0;
  for (let index = 0; index < count; index += 1) {
    if (Math.abs(before[index] - after[index]) > 8) changed += 1;
  }
  return changed;
}

async function skipOnboarding(page: Parameters<Parameters<typeof test>[1]>[0]["page"]) {
  await page.addInitScript(() => localStorage.setItem("qunxing-onboarded-v1", "1"));
}

test("loads star map and basic UI", async ({ page }, testInfo) => {
  await skipOnboarding(page);
  // preserve-buffer：本测试用 gl.readPixels 断言画面，需保留绘制缓冲（生产默认关闭省一块 framebuffer）
  await page.goto("/?preserve-buffer");
  await expect(page.getByText("群星闪耀时").first()).toBeVisible();
  await expect(page.getByLabel("搜索哲人、文明、命题")).toBeVisible();
  const canvas = page.locator("canvas");
  await expect(canvas).toBeVisible();
  await page.waitForTimeout(250);
  await canvas.screenshot({ path: testInfo.outputPath("star-map-canvas.png") });
  const pixels = await readCanvasSample(canvas);
  expect(pixels.ok).toBe(true);
  expect(pixels.width).toBeGreaterThan(100);
  expect(pixels.height).toBeGreaterThan(100);
  expect(pixels.luminous).toBeGreaterThan(10);

  await page.waitForTimeout(1500);
  const nextPixels = await readCanvasSample(canvas);
  expect(countChangedSamples(pixels.samples, nextPixels.samples)).toBeGreaterThan(5);
  await page.getByLabel("搜索哲人、文明、命题").fill("柏拉图");
  await page.getByRole("button", { name: /柏拉图/ }).click();
  await expect(page.getByLabel("搜索结果")).toBeHidden();
  const detailPanel = page.getByLabel("柏拉图详情");
  await expect(detailPanel).toBeVisible();
  await expect(detailPanel.getByText("思想星系")).toBeVisible();
  await expect(detailPanel.getByText("理念与真实")).toBeVisible();
  await detailPanel.getByRole("button", { name: /理念与真实/ }).click();
  // 选中思想行星后：右栏面板隐藏、全屏信息图打开（506f05e 交互改版 + 5bead3e 防鬼影）
  const infographic = page.getByRole("dialog", { name: "理念与真实 信息图" });
  await expect(infographic).toBeVisible();
  await expect(detailPanel).toBeHidden();
  await expect(infographic.getByText("理念高于可感事物")).toBeVisible();
  await expect(infographic.getByText(/理念论让知识拥有稳定对象/)).toBeVisible();
  await expect(infographic.getByText("《理想国》中的理念讨论")).toBeVisible();
  await expect(infographic.getByText(/柏拉图代表文本|plato-primary-work/).first()).toBeVisible();
  await expect(infographic.getByText(/《理想国》第六卷/).first()).toBeVisible();
  await expect(infographic.getByText("摘要", { exact: true }).first()).toBeVisible();
  await infographic.getByRole("button", { name: /返回恒星系/ }).click();
  await expect(detailPanel).toBeVisible();
});

test("filters the star map and toggles relationship types", async ({ page }) => {
  await skipOnboarding(page);
  await page.goto("/");

  await expect(page.getByLabel("星图筛选")).toBeVisible();
  const filters = page.getByLabel("星图筛选");
  const civilizationFilter = filters.locator("label", { hasText: "文明" }).locator("select");
  const themeFilter = filters.locator("label", { hasText: "主题" }).locator("select");
  await civilizationFilter.selectOption("chinese");
  await themeFilter.selectOption("ethics");
  await expect(civilizationFilter).toHaveValue("chinese");
  await expect(themeFilter).toHaveValue("ethics");

  const critiqueButton = page.getByRole("button", { name: "批判" });
  await critiqueButton.click();
  await expect(critiqueButton).toHaveAttribute("aria-pressed", "true");
  await critiqueButton.click();
  await expect(critiqueButton).toHaveAttribute("aria-pressed", "false");

  await page.getByRole("button", { name: "清除筛选" }).click();
  await expect(civilizationFilter).toHaveValue("");
  await expect(themeFilter).toHaveValue("");
});

test("saves philosophers, arguments, search questions, and exports collections", async ({ page }) => {
  await skipOnboarding(page);
  await page.goto("/");

  await page.getByLabel("搜索哲人、文明、命题").fill("柏拉图");
  await page.getByRole("button", { name: /柏拉图/ }).click();
  const detailPanel = page.getByLabel("柏拉图详情");
  await expect(detailPanel).toBeVisible();

  await detailPanel.getByRole("button", { name: "收藏哲人" }).click();
  await expect(detailPanel.getByText("已收藏哲人。")).toBeVisible();
  await detailPanel.getByRole("button", { name: "收藏论证" }).first().click();
  await expect(detailPanel.getByText("已收藏论证。")).toBeVisible();

  await detailPanel.getByRole("button", { name: "关闭" }).click();
  await page.getByLabel("搜索哲人、文明、命题").fill("正义");
  const searchPanel = page.getByLabel("搜索结果");
  await expect(searchPanel).toBeVisible();
  await searchPanel.getByRole("button", { name: "收藏这个问题" }).click();
  await expect(searchPanel.getByText("已收藏搜索问题。")).toBeVisible();

  await page.getByRole("button", { name: "收藏", exact: true }).click();
  const drawer = page.getByLabel("收藏与札记");
  await expect(drawer).toBeVisible();
  await expect(drawer.getByText("柏拉图").first()).toBeVisible();
  await expect(drawer.getByText("正义").first()).toBeVisible();
  await expect(drawer.getByText("哲人 · plato")).toBeVisible();
  await expect(drawer.getByText("搜索问题 · 正义")).toBeVisible();
  await expect(drawer.getByText(/论证 · plato-/).first()).toBeVisible();
  await expect(drawer.getByRole("button", { name: "导出 JSON" })).toBeVisible();
  await expect(drawer.getByRole("button", { name: "导入 JSON" })).toBeVisible();
});
