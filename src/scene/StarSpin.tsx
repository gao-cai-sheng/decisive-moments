import * as THREE from "three";

function hashId(input: string) {
  let value = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    value ^= input.charCodeAt(index);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

// 每颗恒星的自转参数：转速 0.25–1.1 rad/s，自转轴倾角 ±0.47 rad，均由 id 决定（确定性）。
export function starSpinParams(id: string) {
  const seed = hashId(id);
  const speed = 0.25 + ((seed % 997) / 997) * 0.85;
  const tilt = (((seed >>> 10) % 628) / 628) * 0.94 - 0.47;
  return { speed, tilt };
}

// 恒星表面纹理：白底灰斑 + 少量亮点，供 material.color 着色。
// 有表面细节自转才可见——纯色球体转与不转无区别。
export function createStarSurfaceTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 128, 64);

  let state = 987654321;
  const random = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };

  for (let index = 0; index < 70; index += 1) {
    const gray = 150 + Math.floor(random() * 70);
    ctx.fillStyle = `rgba(${gray},${gray},${gray},${(0.18 + random() * 0.22).toFixed(2)})`;
    ctx.beginPath();
    const radius = 2 + random() * 7;
    ctx.ellipse(random() * 128, random() * 64, radius, radius * (0.5 + random() * 0.5), random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
  for (let index = 0; index < 8; index += 1) {
    ctx.fillStyle = `rgba(255,255,255,${(0.25 + random() * 0.3).toFixed(2)})`;
    ctx.beginPath();
    ctx.arc(random() * 128, random() * 64, 1 + random() * 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// 自转驱动已并入 PhilosopherStars 的 InstancedMesh 帧循环（批量重组实例矩阵），
// 本模块只保留确定性自转参数与共享表面纹理。
