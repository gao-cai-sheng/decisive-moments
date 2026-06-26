import { OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

type CameraRigProps = {
  target?: [number, number, number];
};

export function interpolateTarget(
  current: [number, number, number],
  target: [number, number, number],
  delta: number,
  speed = 8,
): [number, number, number] {
  const alpha = 1 - Math.exp(-speed * delta);
  return [
    current[0] + (target[0] - current[0]) * alpha,
    current[1] + (target[1] - current[1]) * alpha,
    current[2] + (target[2] - current[2]) * alpha,
  ];
}

export function CameraRig({ target = [0, 0, 0] }: CameraRigProps) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const currentTargetRef = useRef<[number, number, number]>(target);
  const targetRef = useRef<[number, number, number]>(target);

  useEffect(() => {
    targetRef.current = target;
  }, [target]);

  useFrame((_, delta) => {
    const controls = controlsRef.current;
    if (!controls) return;

    currentTargetRef.current = interpolateTarget(currentTargetRef.current, targetRef.current, delta);
    controls.target.copy(new THREE.Vector3(...currentTargetRef.current));
    controls.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      target={currentTargetRef.current}
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.55}
      zoomSpeed={0.7}
      minDistance={4}
      maxDistance={38}
    />
  );
}
