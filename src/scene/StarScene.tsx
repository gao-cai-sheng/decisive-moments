import { Html, Line, Sphere } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Canvas } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import type { Philosopher } from "../data/schemas";
import { filterPhilosophersForStarMap, filterRelationshipsForStarMap } from "../domain/filters/starFilters";
import { computeStarLayout } from "../domain/layout/starLayout";
import { getFocusedRelationshipIds } from "../domain/relationships/relationshipFilters";
import { useAppStore } from "../store/appStore";
import { CameraRig } from "./CameraRig";
import { civilizationColors, PhilosopherStars } from "./PhilosopherStars";
import { RelationshipLines } from "./RelationshipLines";

type StarDustProps = {
  quality: "low" | "high";
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

function StarDust({ quality }: StarDustProps) {
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
      positions[offset + 2] = Math.sin(angle) * spread * 0.68 + nextSigned() * (core ? 1.2 : 0.7);

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
        opacity={0.9}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
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

        return (
          <group key={problem.id}>
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
              <Html center distanceFactor={7}>
                <span className="thought-orbit-label">{problem.titleZh}</span>
              </Html>
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
          </group>
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

  const visiblePhilosophers = filterPhilosophersForStarMap(philosophers, filters);
  const visibleRelationships = filterRelationshipsForStarMap(relationships, visiblePhilosophers, filters);
  const layout = computeStarLayout(visiblePhilosophers, relationships);
  const focusedIds = selectedId ? getFocusedRelationshipIds(selectedId, visibleRelationships) : [];
  const selectedLayout = selectedId ? layout.find((node) => node.id === selectedId) : null;

  return (
    <Canvas
      camera={{ position: [0, 9, 22], fov: 52, near: 0.1, far: 100 }}
      dpr={quality === "high" ? [1, 2] : 1}
      gl={{ antialias: false, powerPreference: "high-performance", preserveDrawingBuffer: true }}
    >
      <color attach="background" args={["#04050a"]} />
      <fog attach="fog" args={["#04050a", 20, 60]} />
      <ambientLight intensity={0.18} />
      <StarDust quality={quality} />
      <PhilosopherStars
        philosophers={visiblePhilosophers}
        layout={layout}
        selectedId={selectedId}
        onSelect={selectPhilosopher}
      />
      {selectedPhilosopher && selectedLayout && (
        <ThoughtOrbit
          philosopher={selectedPhilosopher}
          position={selectedLayout.position}
          selectedProblemId={selectedThoughtProblemId}
          onSelectProblem={selectThoughtProblem}
          onSelectClaim={selectThoughtClaim}
        />
      )}
      <RelationshipLines relationships={visibleRelationships} layout={layout} focusedIds={focusedIds} />
      <CameraRig target={selectedLayout?.position} />
      {quality === "high" && (
        <EffectComposer>
          <Bloom intensity={0.42} luminanceThreshold={0.35} luminanceSmoothing={0.22} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
