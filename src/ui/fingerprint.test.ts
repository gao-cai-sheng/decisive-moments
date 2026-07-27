import { describe, expect, it } from "vitest";
import { fingerprintGeometry, fingerprintSvg, hashString, type FingerprintInput } from "./fingerprint";

const kant: FingerprintInput = {
  id: "kant",
  civilization: "european_modern",
  themes: ["knowledge", "ethics", "freedom"],
  keywordsZh: ["先验观念论", "范畴", "定言命令", "自律", "现象与物自身"],
};

const zhuangzi: FingerprintInput = {
  id: "zhuangzi",
  civilization: "chinese",
  themes: ["freedom", "language", "life_death"],
  keywordsZh: ["逍遥", "齐物", "心斋", "无待", "齐生死"],
};

const opts = { size: 120, color: "#cf73b8" };

describe("hashString", () => {
  it("同一输入恒等，不同输入不同", () => {
    expect(hashString("kant")).toBe(hashString("kant"));
    expect(hashString("kant")).not.toBe(hashString("zhuangzi"));
  });
});

describe("fingerprintGeometry", () => {
  it("轴数取 themes 数，节点总数为 轴数 × 每轴节点数", () => {
    const geo = fingerprintGeometry(kant, 120);
    expect(geo.axes).toBe(3);
    expect(geo.perAxis).toBe(5);
    expect(geo.nodes).toHaveLength(15);
    expect(geo.spokes).toHaveLength(3);
  });

  it("所有节点落在画布内", () => {
    const geo = fingerprintGeometry(kant, 120);
    for (const node of geo.nodes) {
      expect(node.x).toBeGreaterThanOrEqual(0);
      expect(node.x).toBeLessThanOrEqual(120);
      expect(node.y).toBeGreaterThanOrEqual(0);
      expect(node.y).toBeLessThanOrEqual(120);
    }
  });

  // 种子档常见形态：themes 只有 1 个、keywordsZh 为空。不能因此画出退化图形或崩溃。
  it("种子档极简输入仍产出可渲染的图", () => {
    const seedTier: FingerprintInput = { id: "buton", civilization: "chinese", themes: ["religion"], keywordsZh: [] };
    const geo = fingerprintGeometry(seedTier, 120);
    expect(geo.axes).toBe(2);
    expect(geo.perAxis).toBe(2);
    expect(geo.nodes).toHaveLength(4);
  });

  it("字段超长时收敛到上限，避免节点爆炸", () => {
    const overflow: FingerprintInput = {
      id: "x",
      civilization: "chinese",
      themes: Array.from({ length: 10 }, (_, i) => `t${i}`),
      keywordsZh: Array.from({ length: 20 }, (_, i) => `k${i}`),
    };
    const geo = fingerprintGeometry(overflow, 120);
    expect(geo.axes).toBe(6);
    expect(geo.perAxis).toBe(8);
  });
});

describe("fingerprintSvg", () => {
  it("确定性：同一个人永远画出同一张图", () => {
    expect(fingerprintSvg(kant, opts)).toBe(fingerprintSvg(kant, opts));
  });

  it("不同的人画出不同的图", () => {
    expect(fingerprintSvg(kant, opts)).not.toBe(fingerprintSvg(zhuangzi, opts));
  });

  it("使用传入的文明色，不写死颜色", () => {
    const svg = fingerprintSvg(zhuangzi, { size: 120, color: "#d8a24f" });
    expect(svg).toContain("#d8a24f");
    expect(svg).not.toContain("#cf73b8");
  });

  // 同页会同时出现多张指纹（卡面 + 收藏册缩略图），gradient id 撞车会导致串色。
  it("gradient id 随 id 与尺寸区分，同页多图不串色", () => {
    expect(fingerprintSvg(kant, opts)).toContain('id="fp-kant-120"');
    expect(fingerprintSvg(kant, { ...opts, size: 60 })).toContain('id="fp-kant-60"');
  });

  it("id 含连字符时 gradient id 仍是合法选择器", () => {
    const messy: FingerprintInput = { ...kant, id: "ibn-rushd" };
    expect(fingerprintSvg(messy, opts)).toContain('id="fp-ibn-rushd-120"');
  });

  it("输出是完整 SVG 且对读屏隐藏（信息由相邻文本承担）", () => {
    const svg = fingerprintSvg(kant, opts);
    expect(svg.startsWith("<svg")).toBe(true);
    expect(svg.endsWith("</svg>")).toBe(true);
    expect(svg).toContain('aria-hidden="true"');
  });
});
