import { Html, Line, Sphere } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";
import type { Philosopher, PhilosopherIndexEntry } from "../data/schemas";
import { filterPhilosophersForStarMap } from "../domain/filters/starFilters";
import { computeStarLayout, type StarLayoutNode } from "../domain/layout/starLayout";
import { useAppStore } from "../store/appStore";
import { CameraRig } from "./CameraRig";
import { NearbyOrbits } from "./NearbyOrbits";
import { civilizationColors, PhilosopherStars } from "./PhilosopherStars";
import { createStarSurfaceTexture, StarSpinDriver, useStarSpinRegistry } from "./StarSpin";

type StarDustProps = {
  quality: "low" | "high";
  dimmed?: boolean;
};

const colorKeys = Object.keys(civilizationColors);

function seededRandom(seed: number) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let mixed = value;
    mixed = Math.imul(mixed ^ (mixed >>> 15), mixed | 1);
    mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61);
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
  };
}

function StarDust({ quality, dimmed = false }: StarDustProps) {
  const { colors, positions } = useMemo(() => {
    const count = quality === "high" ? 7600 : 2400;
    const random = seededRandom(20260624);
    const nextSigned = () => random() * 2 - 1;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const center = new THREE.Color("#f1ead1");

    for (let index = 0; index < count; index += 1) {
      const offset = index * 3;
      const core = index < count * 0.28;
      const arm = Math.floor(random() * colorKeys.length);
      const spread = core ? Math.pow(random(), 2.25) * 5.8 : 4.8 + Math.pow(random(), 0.64) * 12.5;
      const angle = arm * ((Math.PI * 2) / colorKeys.length) + spread * 0.42 + nextSigned() * (core ? 1.8 : 0.46);
      const verticalNoise = nextSigned() * (core ? 1.15 : 0.42 + spread * 0.035);

      positions[offset] = Math.cos(angle) * spread + nextSigned() * (core ? 1.4 : 0.55);
      positions[offset + 1] = verticalNoise;
      positions[offset + 2] = Math.sin(angle) * spread + nextSigned() * (core ? 1.2 : 0.7);

      const color = core
        ? center.clone().lerp(new THREE.Color(civilizationColors.global_modern), random() * 0.28)
        : new THREE.Color(civilizationColors[colorKeys[arm]]).lerp(center, random() * 0.22);
      const brightness = core ? 0.78 + random() * 0.42 : 0.42 + random() * 0.44;
      colors[offset] = color.r * brightness;
      colors[offset + 1] = color.g * brightness;
      colors[offset + 2] = color.b * brightness;
    }

    return { colors, positions };
  }, [quality]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={quality === "high" ? 0.04 : 0.05}
        sizeAttenuation
        vertexColors
        transparent
        opacity={dimmed ? 0.28 : 0.9}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// 行星公转载体：整组（含轨道连线与行星）绕恒星 Y 轴匀速旋转；paused 时冻结。
function RevolvingGroup({ speed, paused = false, children }: { speed: number; paused?: boolean; children: ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (!paused && ref.current) ref.current.rotation.y += speed * delta;
  });
  return <group ref={ref}>{children}</group>;
}

// 哲人名字闪烁出现：每 3.6 秒轮换一组恒星，名字淡入淡出，轮询整个星图。
type StarNameTwinkleProps = {
  layout: StarLayoutNode[];
  philosophers: PhilosopherIndexEntry[];
  selectedId: string | null;
};

function StarNameTwinkle({ layout, philosophers, selectedId }: StarNameTwinkleProps) {
  const [cycle, setCycle] = useState(0);
  const names = useMemo(() => new Map(philosophers.map((item) => [item.id, item.names.zh])), [philosophers]);

  useEffect(() => {
    const timer = setInterval(() => setCycle((value) => value + 1), 3600);
    return () => clearInterval(timer);
  }, []);

  // 每轮完全随机抽取一组恒星（非批次轮换）
  const chosen = useMemo(() => {
    const limit = Math.min(12, layout.length);
    const picked = new Set<number>();
    while (picked.size < limit && layout.length > 0) {
      picked.add(Math.floor(Math.random() * layout.length));
    }
    return [...picked].map((index) => layout[index]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cycle, layout]);

  // 聚焦恒星系时整体隐藏，不干扰主视觉
  if (layout.length === 0 || selectedId !== null) return null;

  return (
    <>
      {chosen.map((node) => {
        const name = names.get(node.id);
        if (!name) return null;
        return (
          <Html
            key={`${cycle}-${node.id}`}
            center
            position={[node.position[0], node.position[1] + 0.34, node.position[2]]}
            distanceFactor={13}
            zIndexRange={[10, 0]}
          >
            <span className="star-name-twinkle">{name}</span>
          </Html>
        );
      })}
    </>
  );
}

type ThoughtOrbitProps = {
  philosopher: Philosopher;
  position: [number, number, number];
  selectedProblemId: string | null;
  onSelectProblem(id: string): void;
  onSelectClaim(id: string): void;
};

function ThoughtOrbit({ philosopher, position, selectedProblemId, onSelectProblem, onSelectClaim }: ThoughtOrbitProps) {
  if (!philosopher.thoughtSystem) return null;

  const problemCount = philosopher.thoughtSystem.problems.length;
  const baseColor = civilizationColors[philosopher.civilization] ?? "#d8a24f";

  return (
    <group position={position}>
      {philosopher.thoughtSystem.problems.map((problem, problemIndex) => {
        const angle = (Math.PI * 2 * problemIndex) / problemCount;
        const orbitRadius = 0.95 + problem.weight * 0.26;
        const problemPosition: [number, number, number] = [
          Math.cos(angle) * orbitRadius,
          Math.sin(angle * 1.7) * 0.16,
          Math.sin(angle) * orbitRadius * 0.72,
        ];
        const isExpanded = problem.id === selectedProblemId;

        const revolveSpeed = 0.09 + problemIndex * 0.035 + (3 - problem.weight) * 0.02;
        // 任一行星被选中时，整个恒星系停转（层级与"选恒星→银河停转"一致）
        const systemPaused = selectedProblemId !== null;

        return (
          <RevolvingGroup key={problem.id} speed={revolveSpeed} paused={systemPaused}>
            <Line
              points={[[0, 0, 0], problemPosition]}
              color={baseColor}
              transparent
              opacity={0.24}
              lineWidth={0.7}
            />
            <group position={problemPosition}>
              <Sphere
                args={[0.055 + problem.weight * 0.016, 10, 10]}
                onClick={(event) => {
                  event.stopPropagation();
                  onSelectProblem(problem.id);
                }}
              >
                <meshBasicMaterial color={isExpanded ? "#fff6d8" : "#ffe2a0"} toneMapped={false} />
              </Sphere>
              {/* 信息图打开期间隐藏全部行星标签，防止 drei Html 高 z-index 穿透遮罩 */}
              {selectedProblemId === null && (
                <Html center distanceFactor={7} position={[0, 0.16, 0]}>
                  <span className="thought-orbit-label">{problem.titleZh}</span>
                </Html>
              )}
            </group>
            {isExpanded && problem.claims.map((claim, claimIndex) => {
              const claimAngle = angle + (claimIndex - (problem.claims.length - 1) / 2) * 0.34;
              const claimRadius = orbitRadius + 0.55 + claim.weight * 0.08;
              const claimPosition: [number, number, number] = [
                Math.cos(claimAngle) * claimRadius,
                Math.sin(claimAngle * 1.3) * 0.24,
                Math.sin(claimAngle) * claimRadius * 0.72,
              ];

              return (
                <group key={claim.id}>
                  <Line
                    points={[problemPosition, claimPosition]}
                    color="#d8e1ea"
                    transparent
                    opacity={0.16}
                    lineWidth={0.45}
                  />
                  <Sphere
                    args={[0.032 + claim.weight * 0.008, 8, 8]}
                    position={claimPosition}
                    onClick={(event) => {
                      event.stopPropagation();
                      onSelectClaim(claim.id);
                    }}
                  >
                    <meshBasicMaterial color={baseColor} toneMapped={false} />
                  </Sphere>
                </group>
              );
            })}
          </RevolvingGroup>
        );
      })}
    </group>
  );
}

export function StarScene() {
  const philosophers = useAppStore((state) => state.philosophers);
  const relationships = useAppStore((state) => state.relationships);
  const selectedId = useAppStore((state) => state.selectedPhilosopherId);
  const selectedPhilosopher = useAppStore((state) => state.selectedPhilosopher);
  const selectPhilosopher = useAppStore((state) => state.selectPhilosopher);
  const selectedThoughtProblemId = useAppStore((state) => state.selectedThoughtProblemId);
  const selectThoughtProblem = useAppStore((state) => state.selectThoughtProblem);
  const selectThoughtClaim = useAppStore((state) => state.selectThoughtClaim);
  const quality = useAppStore((state) => state.quality);
  const filters = useAppStore((state) => state.filters);

  // memo 保证 layout 引用稳定：下游 NearbyOrbits 依赖它缓存扫描目标，逐帧重建会退化成每帧全量分配
  const visiblePhilosophers = useMemo(
    () => filterPhilosophersForStarMap(philosophers, filters),
    [philosophers, filters],
  );
  const layout = useMemo(
    () => computeStarLayout(visiblePhilosophers, relationships),
    [visiblePhilosophers, relationships],
  );
  const starTexture = useMemo(() => createStarSurfaceTexture(), []);
  const { registry: spinRegistry, register: registerStar } = useStarSpinRegistry();
  const selectedLayout = selectedId ? layout.find((node) => node.id === selectedId) : null;

  // Esc 逐层退出：观点 → 行星信息图 → 恒星聚焦 → 银河
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      const state = useAppStore.getState();
      if (state.selectedThoughtClaimId) state.selectThoughtClaim(null);
      else if (state.selectedThoughtProblemId) state.selectThoughtProblem(null);
      else state.selectPhilosopher(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 9, 22], fov: 52, near: 0.1, far: 100 }}
      dpr={quality === "high" ? [1, 1.5] : 1}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        // DEV 调试钩子：profiling 经 window.__gl 读 renderer.info（draw calls / geometries / textures）
        if (import.meta.env.DEV) (window as unknown as { __gl?: THREE.WebGLRenderer }).__gl = gl;
      }}
      onPointerMissed={() => selectPhilosopher(null)}
    >
      <color attach="background" args={["#04050a"]} />
      <fog attach="fog" args={["#04050a", 20, 60]} />
      <ambientLight intensity={0.18} />
      <StarDust quality={quality} dimmed={selectedId !== null} />
      <PhilosopherStars
        philosophers={visiblePhilosophers}
        layout={layout}
        selectedId={selectedId}
        onSelect={selectPhilosopher}
        surfaceTexture={starTexture}
        registerStar={registerStar}
        labelsHidden={selectedThoughtProblemId !== null}
      />
      <StarSpinDriver registry={spinRegistry} />
      <StarNameTwinkle layout={layout} philosophers={visiblePhilosophers} selectedId={selectedId} />
      <NearbyOrbits layout={layout} selectedId={selectedId} onSelect={selectPhilosopher} />
      {selectedPhilosopher && selectedLayout && (
        <ThoughtOrbit
          philosopher={selectedPhilosopher}
          position={selectedLayout.position}
          selectedProblemId={selectedThoughtProblemId}
          onSelectProblem={selectThoughtProblem}
          onSelectClaim={selectThoughtClaim}
        />
      )}
      {/* 关系连线暂时移除：与思想行星轨道视觉干涉，待行星系统稳定后再以按需高亮方式恢复 */}
      <CameraRig
        target={selectedLayout?.position}
        paused={selectedId !== null}
        focused={selectedId !== null}
        focusKey={selectedId}
      />
      {quality === "high" && (
        // multisampling=0：主 Canvas 本就 antialias:false，composer 默认的 MSAA 离屏 buffer 是纯浪费
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.42} luminanceThreshold={0.35} luminanceSmoothing={0.22} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
