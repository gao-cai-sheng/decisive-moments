import { useFrame } from "@react-three/fiber";
import { useRef, type MutableRefObject } from "react";
import * as THREE from "three";

export type StarSpinEntry = { mesh: THREE.Mesh; speed: number };

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

export function useStarSpinRegistry() {
  const registry = useRef(new Map<string, StarSpinEntry>());
  const register = (id: string, mesh: THREE.Mesh | null) => {
    if (!mesh) {
      registry.current.delete(id);
      return;
    }
    const { speed, tilt } = starSpinParams(id);
    mesh.rotation.z = tilt;
    registry.current.set(id, { mesh, speed });
  };
  return { registry, register };
}

// 必须渲染在 <Canvas> 内。集中驱动全部恒星自转，避免每颗星各挂一个 useFrame。
export function StarSpinDriver({ registry }: { registry: MutableRefObject<Map<string, StarSpinEntry>> }) {
  useFrame((_, delta) => {
    registry.current.forEach((entry) => {
      entry.mesh.rotation.y += entry.speed * delta;
    });
  });
  return null;
}
