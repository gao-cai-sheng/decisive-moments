import { Html, Sphere } from "@react-three/drei";
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
  onSelect(id: string): void;
};

export function PhilosopherStars({ philosophers, layout, selectedId, onSelect }: PhilosopherStarsProps) {
  const byId = new Map(philosophers.map((item) => [item.id, item]));

  return (
    <>
      {layout.map((node) => {
        const philosopher = byId.get(node.id);
        if (!philosopher) return null;
        const selected = selectedId === node.id;
        const color = getStarColor(node.colorKey);
        const showHalo = selected || philosopher.influenceWeight >= 3;
        const haloScale = selected ? 4.2 : 1.9;
        const visualRadius = node.radius * (selected ? 1.75 : 0.72);

        return (
          <group key={node.id} position={node.position}>
            <Sphere
              args={[Math.max(node.radius * 4, 0.34), 10, 10]}
              onClick={(event) => {
                event.stopPropagation();
                onSelect(node.id);
              }}
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
              onClick={(event) => {
                event.stopPropagation();
                onSelect(node.id);
              }}
            >
              <meshBasicMaterial color={selected ? "#ffe0a0" : color} toneMapped={false} />
            </Sphere>
            {selected && (
              <Html center distanceFactor={10}>
                <span
                  style={{
                    color: "#ffd27a",
                    fontSize: 13,
                    whiteSpace: "nowrap",
                    textShadow: "0 1px 12px #000",
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
