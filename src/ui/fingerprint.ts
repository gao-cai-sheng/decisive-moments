// 思想指纹：把一位哲人的既有字段算成一张独一无二的 SVG。
//
// 项目没有、也不打算有 542 张肖像（古代与非西方人物多无可靠画像，近现代有版权），
// 所以「图」全部由数据算出：同一个人永远得到同一张图，零资源、零版权。
//
// 参数来源：themes 数 → 主轴数；keywordsZh 数 → 每轴节点数；civilization → 色相；id → 起始角与扰动。

const FNV_OFFSET = 2166136261;
const FNV_PRIME = 16777619;

/** FNV-1a：稳定的字符串哈希，同一 id 跨会话跨设备结果一致。 */
export function hashString(input: string): number {
  let hash = FNV_OFFSET;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, FNV_PRIME);
  }
  return hash >>> 0;
}

/** 线性同余伪随机：给定种子必然产出同一串扰动，保证指纹可复现。 */
function createRng(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

export type FingerprintInput = {
  id: string;
  civilization: string;
  themes: string[];
  keywordsZh: string[];
};

export type FingerprintOptions = {
  /** 画布边长（px），同时决定内部半径。 */
  size: number;
  /** 文明色，由调用方从 civilizationColors 取，避免本模块依赖场景层。 */
  color: string;
};

type Node = { x: number; y: number; r: number };

/**
 * 计算指纹的几何数据。与渲染分离，便于测试与复用（卡面、缩略图、分享图都用它）。
 * 轴数与节点数都做了下限保护：种子档可能只有 1 个 theme 或空 keywords。
 */
export function fingerprintGeometry(input: FingerprintInput, size: number) {
  const axes = Math.max(2, Math.min(input.themes.length, 6));
  const perAxis = Math.max(2, Math.min(input.keywordsZh.length, 8));
  const seed = hashString(input.id);
  const rng = createRng(seed);
  const radius = size / 2;
  const center = radius;
  const baseAngle = ((seed % 360) * Math.PI) / 180;

  const spokes: { x: number; y: number }[] = [];
  const nodes: Node[] = [];

  for (let a = 0; a < axes; a += 1) {
    const angle = baseAngle + (a * 2 * Math.PI) / axes;
    spokes.push({
      x: center + Math.cos(angle) * radius * 0.86,
      y: center + Math.sin(angle) * radius * 0.86,
    });
    for (let n = 0; n < perAxis; n += 1) {
      const t = 0.22 + (n / Math.max(1, perAxis - 1)) * 0.64;
      const jitter = (rng() - 0.5) * 0.34;
      const nodeAngle = angle + jitter;
      const nodeRadius = radius * t;
      nodes.push({
        x: center + Math.cos(nodeAngle) * nodeRadius,
        y: center + Math.sin(nodeAngle) * nodeRadius,
        r: 1.6 + rng() * 3.2,
      });
    }
  }

  return { axes, perAxis, center, radius, spokes, nodes };
}

const fmt = (value: number) => value.toFixed(1);

/** 渲染成自包含 SVG 字符串。id 参与 gradient id，避免同页多张图互相覆盖。 */
export function fingerprintSvg(input: FingerprintInput, options: FingerprintOptions): string {
  const { size, color } = options;
  const { center, radius, spokes, nodes, axes } = fingerprintGeometry(input, size);
  const gradientId = `fp-${input.id.replace(/[^a-zA-Z0-9_-]/g, "")}-${size}`;

  const parts: string[] = [
    `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-hidden="true">`,
    `<defs><radialGradient id="${gradientId}">` +
      `<stop offset="0" stop-color="${color}" stop-opacity="0.28"/>` +
      `<stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient></defs>`,
    `<circle cx="${center}" cy="${center}" r="${fmt(radius * 0.92)}" fill="url(#${gradientId})"/>`,
  ];

  for (let ring = 1; ring <= 3; ring += 1) {
    parts.push(
      `<circle cx="${center}" cy="${center}" r="${fmt(radius * 0.24 * ring)}" fill="none" ` +
        `stroke="${color}" stroke-opacity="0.13" stroke-width="1"/>`,
    );
  }

  for (const spoke of spokes) {
    parts.push(
      `<line x1="${center}" y1="${center}" x2="${fmt(spoke.x)}" y2="${fmt(spoke.y)}" ` +
        `stroke="${color}" stroke-opacity="0.3" stroke-width="1"/>`,
    );
  }

  // 跨轴连线：把相邻轴上同序号的节点连起来，形成星座感而不是孤立散点。
  for (let i = 0; i < nodes.length; i += 1) {
    const next = nodes[(i + axes) % nodes.length];
    parts.push(
      `<line x1="${fmt(nodes[i].x)}" y1="${fmt(nodes[i].y)}" x2="${fmt(next.x)}" y2="${fmt(next.y)}" ` +
        `stroke="${color}" stroke-opacity="0.2" stroke-width="0.7"/>`,
    );
  }

  for (const node of nodes) {
    parts.push(
      `<circle cx="${fmt(node.x)}" cy="${fmt(node.y)}" r="${fmt(node.r)}" fill="${color}" fill-opacity="0.85"/>`,
    );
  }

  parts.push(`<circle cx="${center}" cy="${center}" r="4.5" fill="#ffffff" fill-opacity="0.95"/>`);
  parts.push("</svg>");
  return parts.join("");
}
