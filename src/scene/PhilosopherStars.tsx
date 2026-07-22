import { Html } from "@react-three/drei";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { PhilosopherIndexEntry } from "../data/schemas";
import type { StarLayoutNode } from "../domain/layout/starLayout";
import { starSpinParams } from "./StarSpin";

export const civilizationColors: Record<string, string> = {
  chinese: "#d8a24f",
  indian: "#55d2a7",
  ancient_greek: "#8fb8ff",
  islamic: "#4cc2b4",
  european_modern: "#cf73b8",
  latin_christian: "#d8c37a",
  american: "#f27f5f",
  global_modern: "#d8e1ea",
  jewish: "#b9a7ff",
  japanese: "#ff8fb3",
  korean: "#7bd6ff",
  african: "#f2b35d",
  latin_american: "#7ccf8d",
};

const defaultStarColor = "#d8a24f";

const schoolColors: Record<string, string> = {
  "chinese:confucianism": "#d8a24f",
  "chinese:daoism": "#a9c96e",
};

export function getStarColor(colorKey: string) {
  const [civilization] = colorKey.split(":");
  return schoolColors[colorKey] ?? civilizationColors[colorKey] ?? civilizationColors[civilization] ?? defaultStarColor;
}

const SELECTED_COLOR = "#ffe0a0";
const DIMMED_COLOR = "#4a5058";
const HIT_MIN_RADIUS = 0.34;

type PhilosopherStarsProps = {
  philosophers: PhilosopherIndexEntry[];
  layout: StarLayoutNode[];
  selectedId: string | null;
  onSelect(id: string | null): void;
  surfaceTexture?: THREE.Texture | null;
  labelsHidden?: boolean;
};

// 视觉网格不参与拾取：命中球（半径更大、便于点击）统一承接指针事件
const noRaycast = () => null;

// 542 星逐个挂 drei Sphere 时代：每星 2–3 份独立 geometry+material、上千 draw call，
// 是内存与渲染开销的大头。改为 4 个 InstancedMesh（本体/置灰/halo/命中）+ 3 份共享几何体。
export function PhilosopherStars({
  philosophers,
  layout,
  selectedId,
  onSelect,
  surfaceTexture,
  labelsHidden = false,
}: PhilosopherStarsProps) {
  const byId = useMemo(() => new Map(philosophers.map((item) => [item.id, item])), [philosophers]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const focusMode = selectedId !== null;

  const bodyRef = useRef<THREE.InstancedMesh>(null);
  const dimmedRef = useRef<THREE.InstancedMesh>(null);
  const haloRef = useRef<THREE.InstancedMesh>(null);
  const hitRef = useRef<THREE.InstancedMesh>(null);

  const shared = useMemo(
    () => ({
      bodyGeometry: new THREE.SphereGeometry(1, 12, 12),
      haloGeometry: new THREE.SphereGeometry(1, 16, 16),
      hitGeometry: new THREE.SphereGeometry(1, 10, 10),
      bodyMaterial: new THREE.MeshBasicMaterial({ color: "#ffffff", toneMapped: false }),
      dimmedMaterial: new THREE.MeshBasicMaterial({
        color: DIMMED_COLOR,
        transparent: true,
        opacity: 0.3,
        toneMapped: false,
      }),
      haloMaterial: new THREE.MeshBasicMaterial({
        color: "#ffffff",
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      }),
      hitMaterial: new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        depthWrite: false,
        colorWrite: false,
      }),
    }),
    [],
  );

  useEffect(() => {
    shared.bodyMaterial.map = surfaceTexture ?? null;
    shared.bodyMaterial.needsUpdate = true;
  }, [shared, surfaceTexture]);

  useEffect(
    () => () => {
      shared.bodyGeometry.dispose();
      shared.haloGeometry.dispose();
      shared.hitGeometry.dispose();
      shared.bodyMaterial.dispose();
      shared.dimmedMaterial.dispose();
      shared.haloMaterial.dispose();
      shared.hitMaterial.dispose();
    },
    [shared],
  );

  const temps = useMemo(
    () => ({
      matrix: new THREE.Matrix4(),
      position: new THREE.Vector3(),
      quaternion: new THREE.Quaternion(),
      identityQuaternion: new THREE.Quaternion(),
      euler: new THREE.Euler(),
      scale: new THREE.Vector3(),
      color: new THREE.Color(),
    }),
    [],
  );

  const spinParams = useMemo(() => layout.map((node) => starSpinParams(node.id)), [layout]);
  const spinAnglesRef = useRef(new Float32Array(0));
  if (spinAnglesRef.current.length !== layout.length) {
    spinAnglesRef.current = new Float32Array(layout.length);
  }

  const selectedIndex = useMemo(
    () => (selectedId ? layout.findIndex((node) => node.id === selectedId) : -1),
    [layout, selectedId],
  );

  // 聚焦模式：本体只剩选中星，其余全部转入置灰网格；halo 只给选中星（平时给分量 3 的名家）
  const bodyIndices = useMemo(
    () => (focusMode ? (selectedIndex >= 0 ? [selectedIndex] : []) : layout.map((_, index) => index)),
    [focusMode, selectedIndex, layout],
  );
  const dimmedIndices = useMemo(
    () => (focusMode ? layout.map((_, index) => index).filter((index) => index !== selectedIndex) : []),
    [focusMode, selectedIndex, layout],
  );
  const haloEntries = useMemo(() => {
    if (focusMode) return selectedIndex >= 0 ? [{ index: selectedIndex, scale: 4.2, opacity: 0.22 }] : [];
    return layout
      .map((node, index) => ({ node, index }))
      .filter(({ node }) => (byId.get(node.id)?.influenceWeight ?? 0) >= 3)
      .map(({ index }) => ({ index, scale: 1.9, opacity: 0.045 }));
  }, [focusMode, selectedIndex, layout, byId]);

  useLayoutEffect(() => {
    const body = bodyRef.current;
    const dimmed = dimmedRef.current;
    const halo = haloRef.current;
    const hit = hitRef.current;
    if (!body || !dimmed || !halo || !hit) return;

    const composeAt = (mesh: THREE.InstancedMesh, instanceIndex: number, node: StarLayoutNode, radius: number) => {
      temps.position.set(node.position[0], node.position[1], node.position[2]);
      temps.scale.setScalar(radius);
      temps.matrix.compose(temps.position, temps.identityQuaternion, temps.scale);
      mesh.setMatrixAt(instanceIndex, temps.matrix);
    };

    body.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    body.count = bodyIndices.length;
    bodyIndices.forEach((layoutIndex, instanceIndex) => {
      const node = layout[layoutIndex];
      composeAt(body, instanceIndex, node, node.radius * (node.id === selectedId ? 1.75 : 0.72));
      temps.color.set(node.id === selectedId ? SELECTED_COLOR : getStarColor(node.colorKey));
      body.setColorAt(instanceIndex, temps.color);
    });
    body.instanceMatrix.needsUpdate = true;
    if (body.instanceColor) body.instanceColor.needsUpdate = true;

    dimmed.count = dimmedIndices.length;
    dimmedIndices.forEach((layoutIndex, instanceIndex) => {
      const node = layout[layoutIndex];
      composeAt(dimmed, instanceIndex, node, node.radius * 0.72);
    });
    dimmed.instanceMatrix.needsUpdate = true;

    halo.count = haloEntries.length;
    haloEntries.forEach((entry, instanceIndex) => {
      const node = layout[entry.index];
      composeAt(halo, instanceIndex, node, node.radius * entry.scale);
      // AdditiveBlending 下把 RGB 预乘目标透明度，等效实现 per-instance opacity
      temps.color.set(getStarColor(node.colorKey)).multiplyScalar(entry.opacity);
      halo.setColorAt(instanceIndex, temps.color);
    });
    halo.instanceMatrix.needsUpdate = true;
    if (halo.instanceColor) halo.instanceColor.needsUpdate = true;

    hit.count = layout.length;
    layout.forEach((node, instanceIndex) => {
      composeAt(hit, instanceIndex, node, Math.max(node.radius * 4, HIT_MIN_RADIUS));
    });
    hit.instanceMatrix.needsUpdate = true;
  }, [layout, bodyIndices, dimmedIndices, haloEntries, selectedId, temps]);

  // 自转：批量重组本体实例矩阵；聚焦模式下只剩 1 颗，代价随之收缩
  useFrame((_, delta) => {
    const body = bodyRef.current;
    if (!body || bodyIndices.length === 0) return;
    const angles = spinAnglesRef.current;
    bodyIndices.forEach((layoutIndex, instanceIndex) => {
      const node = layout[layoutIndex];
      angles[layoutIndex] += spinParams[layoutIndex].speed * delta;
      temps.euler.set(0, angles[layoutIndex], spinParams[layoutIndex].tilt);
      temps.quaternion.setFromEuler(temps.euler);
      temps.position.set(node.position[0], node.position[1], node.position[2]);
      temps.scale.setScalar(node.radius * (node.id === selectedId ? 1.75 : 0.72));
      temps.matrix.compose(temps.position, temps.quaternion, temps.scale);
      body.setMatrixAt(instanceIndex, temps.matrix);
    });
    body.instanceMatrix.needsUpdate = true;
  });

  const idFromEvent = (event: ThreeEvent<PointerEvent> | ThreeEvent<MouseEvent>) =>
    event.instanceId != null ? layout[event.instanceId]?.id : undefined;

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    const id = idFromEvent(event);
    if (!id) return;
    // 聚焦模式下点击置灰背景星 = 退出聚焦
    onSelect(focusMode && id !== selectedId ? null : id);
  };

  const handleHover = (event: ThreeEvent<PointerEvent>) => {
    const id = idFromEvent(event);
    if (!id) return;
    if (focusMode && id !== selectedId) return;
    event.stopPropagation();
    setHoveredId(id);
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = () => {
    setHoveredId(null);
    document.body.style.cursor = "";
  };

  const labelNodes = useMemo(() => {
    const ids = new Set<string>();
    if (selectedId) ids.add(selectedId);
    if (hoveredId && (!focusMode || hoveredId === selectedId)) ids.add(hoveredId);
    if (ids.size === 0) return [];
    return layout.filter((node) => ids.has(node.id));
  }, [selectedId, hoveredId, focusMode, layout]);

  if (layout.length === 0) return null;

  return (
    <>
      <instancedMesh
        ref={bodyRef}
        args={[shared.bodyGeometry, shared.bodyMaterial, layout.length]}
        frustumCulled={false}
        raycast={noRaycast}
      />
      <instancedMesh
        ref={dimmedRef}
        args={[shared.bodyGeometry, shared.dimmedMaterial, layout.length]}
        frustumCulled={false}
        raycast={noRaycast}
      />
      <instancedMesh
        ref={haloRef}
        args={[shared.haloGeometry, shared.haloMaterial, layout.length]}
        frustumCulled={false}
        raycast={noRaycast}
      />
      <instancedMesh
        ref={hitRef}
        args={[shared.hitGeometry, shared.hitMaterial, layout.length]}
        frustumCulled={false}
        onClick={handleClick}
        onPointerOver={handleHover}
        onPointerMove={handleHover}
        onPointerOut={handlePointerOut}
      />
      {!labelsHidden &&
        labelNodes.map((node) => (
          <Html
            key={node.id}
            center
            distanceFactor={10}
            position={[node.position[0], node.position[1] + node.radius * 3.2 + 0.18, node.position[2]]}
          >
            <span
              style={{
                color: node.id === selectedId ? "#ffd27a" : "#e8f0ff",
                fontSize: 13,
                whiteSpace: "nowrap",
                textShadow: "0 1px 12px #000",
                pointerEvents: "none",
              }}
            >
              {byId.get(node.id)?.names.zh}
            </span>
          </Html>
        ))}
    </>
  );
}
