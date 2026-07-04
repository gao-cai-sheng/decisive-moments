import { Html, Sphere } from "@react-three/drei";
import { useState } from "react";
import * as THREE from "three";
import type { PhilosopherIndexEntry } from "../data/schemas";
import type { StarLayoutNode } from "../domain/layout/starLayout";

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

type PhilosopherStarsProps = {
  philosophers: PhilosopherIndexEntry[];
  layout: StarLayoutNode[];
  selectedId: string | null;
  onSelect(id: string | null): void;
  surfaceTexture?: THREE.Texture | null;
  registerStar?(id: string, mesh: THREE.Mesh | null): void;
  labelsHidden?: boolean;
};

export function PhilosopherStars({
  philosophers,
  layout,
  selectedId,
  onSelect,
  surfaceTexture,
  registerStar,
  labelsHidden = false,
}: PhilosopherStarsProps) {
  const byId = new Map(philosophers.map((item) => [item.id, item]));
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const hoverProps = (id: string) => ({
    onPointerOver: (event: { stopPropagation(): void }) => {
      event.stopPropagation();
      setHoveredId(id);
      document.body.style.cursor = "pointer";
    },
    onPointerOut: () => {
      setHoveredId((current) => (current === id ? null : current));
      document.body.style.cursor = "";
    },
  });

  return (
    <>
      {layout.map((node) => {
        const philosopher = byId.get(node.id);
        if (!philosopher) return null;
        const selected = selectedId === node.id;
        const focusMode = selectedId !== null;
        // 聚焦模式下，其余恒星退为置灰背景：不可悬停，点击 = 退出聚焦
        const dimmed = focusMode && !selected;
        const color = getStarColor(node.colorKey);
        const showHalo = selected || (!focusMode && philosopher.influenceWeight >= 3);
        const haloScale = selected ? 4.2 : 1.9;
        const visualRadius = node.radius * (selected ? 1.75 : 0.72);

        return (
          <group key={node.id} position={node.position}>
            <Sphere
              args={[Math.max(node.radius * 4, 0.34), 10, 10]}
              onClick={(event) => {
                event.stopPropagation();
                onSelect(dimmed ? null : node.id);
              }}
              {...(dimmed ? {} : hoverProps(node.id))}
            >
              <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </Sphere>
            {showHalo && (
              <Sphere args={[node.radius * haloScale, 16, 16]}>
                <meshBasicMaterial
                  color={color}
                  transparent
                  opacity={selected ? 0.22 : 0.045}
                  depthWrite={false}
                  blending={THREE.AdditiveBlending}
                  toneMapped={false}
                />
              </Sphere>
            )}
            <Sphere
              args={[visualRadius, 12, 12]}
              ref={(mesh) => registerStar?.(node.id, mesh as THREE.Mesh | null)}
              onClick={(event) => {
                event.stopPropagation();
                onSelect(dimmed ? null : node.id);
              }}
            >
              <meshBasicMaterial
                color={selected ? "#ffe0a0" : dimmed ? "#4a5058" : color}
                toneMapped={false}
                map={dimmed ? undefined : surfaceTexture ?? undefined}
                transparent={dimmed}
                opacity={dimmed ? 0.3 : 1}
              />
            </Sphere>
            {!labelsHidden && (selected || (hoveredId === node.id && !dimmed)) && (
              <Html center distanceFactor={10} position={[0, node.radius * 3.2 + 0.18, 0]}>
                <span
                  style={{
                    color: selected ? "#ffd27a" : "#e8f0ff",
                    fontSize: 13,
                    whiteSpace: "nowrap",
                    textShadow: "0 1px 12px #000",
                    pointerEvents: "none",
                  }}
                >
                  {philosopher.names.zh}
                </span>
              </Html>
            )}
          </group>
        );
      })}
    </>
  );
}
