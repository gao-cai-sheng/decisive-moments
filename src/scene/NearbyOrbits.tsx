import { Line, Sphere } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";
import { getPhilosopher } from "../data/client";
import type { Philosopher } from "../data/schemas";
import type { StarLayoutNode } from "../domain/layout/starLayout";
import { getStarColor } from "./PhilosopherStars";

// LOD 常显：镜头距离小于该值时浮现行星系；最多同时显示 3 个，避免轨道打架
const NEARBY_RADIUS = 7.5;
const MAX_NEARBY = 3;
const SCAN_INTERVAL = 0.25;
// detail 缓存上限：漫游一整圈会路过上百颗标准星，无上限会单调增长
const MAX_DETAIL_CACHE = 24;

function orbitRingPoints(radius: number): [number, number, number][] {
  const points: [number, number, number][] = [];
  for (let index = 0; index <= 48; index += 1) {
    const angle = (index / 48) * Math.PI * 2;
    points.push([Math.cos(angle) * radius, 0, Math.sin(angle) * radius]);
  }
  return points;
}

function MiniRevolve({ speed, phase, children }: { speed: number; phase: number; children: ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += speed * delta;
  });
  return (
    <group ref={ref} rotation={[0, phase, 0]}>
      {children}
    </group>
  );
}

type NearbyOrbitsProps = {
  layout: StarLayoutNode[];
  selectedId: string | null;
  onSelect(id: string): void;
};

export function NearbyOrbits({ layout, selectedId, onSelect }: NearbyOrbitsProps) {
  const [nearbyIds, setNearbyIds] = useState<string[]>([]);
  const [, setTick] = useState(0);
  const cacheRef = useRef(new Map<string, Philosopher | "loading">());
  const scanAccumulatorRef = useRef(0);

  // 只有标准档才有 thoughtSystem（=行星）；seed 星渲染不出轨道，
  // 若参与「最近 3 颗」竞争会挤占名额、把附近的标准星饿死（苏格拉底/柏拉图行星消失即此因）。
  // Vector3 预建：扫描每 0.25s 一轮，逐节点 new Vector3 会造成持续 GC 压力。
  const scanTargets = useMemo(
    () =>
      layout
        .filter((node) => node.tier === "standard")
        .map((node) => ({ id: node.id, position: new THREE.Vector3(...node.position) })),
    [layout],
  );

  useFrame((state, delta) => {
    scanAccumulatorRef.current += delta;
    if (scanAccumulatorRef.current < SCAN_INTERVAL) return;
    scanAccumulatorRef.current = 0;

    if (selectedId !== null) {
      if (nearbyIds.length > 0) setNearbyIds([]);
      return;
    }

    const camera = state.camera.position;
    const next = scanTargets
      .map((target) => ({ id: target.id, distance: camera.distanceTo(target.position) }))
      .filter((entry) => entry.distance < NEARBY_RADIUS)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, MAX_NEARBY)
      .map((entry) => entry.id);

    if (next.join("|") !== nearbyIds.join("|")) setNearbyIds(next);
  });

  useEffect(() => {
    nearbyIds.forEach((id) => {
      if (cacheRef.current.has(id)) return;
      while (cacheRef.current.size >= MAX_DETAIL_CACHE) {
        const evictable = [...cacheRef.current.keys()].find((key) => !nearbyIds.includes(key));
        if (!evictable) break;
        cacheRef.current.delete(evictable);
      }
      cacheRef.current.set(id, "loading");
      getPhilosopher(id)
        .then((philosopher) => {
          cacheRef.current.set(id, philosopher);
          setTick((value) => value + 1);
        })
        .catch(() => cacheRef.current.delete(id));
    });
  }, [nearbyIds]);

  const nodeById = new Map(layout.map((node) => [node.id, node]));

  return (
    <>
      {nearbyIds.map((id) => {
        const node = nodeById.get(id);
        const detail = cacheRef.current.get(id);
        if (!node || !detail || detail === "loading" || !detail.thoughtSystem) return null;
        const color = getStarColor(node.colorKey);

        return (
          <group key={id} position={node.position}>
            {detail.thoughtSystem.problems.map((problem, problemIndex) => {
              const orbitRadius = 0.95 + problem.weight * 0.26;
              const speed = 0.09 + problemIndex * 0.035 + (3 - problem.weight) * 0.02;

              return (
                <group key={problem.id} scale={[1, 1, 0.72]}>
                  <Line
                    points={orbitRingPoints(orbitRadius)}
                    color={color}
                    transparent
                    opacity={0.12}
                    lineWidth={0.4}
                  />
                  <MiniRevolve speed={speed} phase={problemIndex * 2.1}>
                    <Sphere
                      args={[0.05 + problem.weight * 0.012, 8, 8]}
                      position={[orbitRadius, 0, 0]}
                      onClick={(event) => {
                        event.stopPropagation();
                        onSelect(id);
                      }}
                    >
                      <meshBasicMaterial color="#ffe2a0" toneMapped={false} transparent opacity={0.85} />
                    </Sphere>
                  </MiniRevolve>
                </group>
              );
            })}
          </group>
        );
      })}
    </>
  );
}
