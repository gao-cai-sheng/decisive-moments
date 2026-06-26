import { Line } from "@react-three/drei";
import type { Relationship } from "../data/schemas";
import type { StarLayoutNode } from "../domain/layout/starLayout";

type RelationshipLinesProps = {
  relationships: Relationship[];
  layout: StarLayoutNode[];
  focusedIds: string[];
};

export function RelationshipLines({ relationships, layout, focusedIds }: RelationshipLinesProps) {
  const positionById = new Map(layout.map((node) => [node.id, node.position]));
  const focused = new Set(focusedIds);

  return (
    <>
      {relationships.map((relationship) => {
        const from = positionById.get(relationship.from);
        const to = positionById.get(relationship.to);
        if (!from || !to) return null;
        const isFocused = focused.has(relationship.id);

        return (
          <Line
            key={relationship.id}
            points={[from, to]}
            color={isFocused ? "#ffd27a" : "#596071"}
            opacity={isFocused ? 0.48 : 0.07}
            transparent
            lineWidth={isFocused ? 1.1 : 0.45}
          />
        );
      })}
    </>
  );
}
