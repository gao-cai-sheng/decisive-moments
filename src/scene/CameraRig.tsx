import { OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

type CameraRigProps = {
  target?: [number, number, number];
  paused?: boolean;
  focused?: boolean;
  focusKey?: string | null;
};

export const GALAXY_AUTO_ROTATE_SPEED = 0.07;
// 聚焦恒星系时的取景距离：fov 52° 下恰好容纳最外圈思想行星轨道（半径约 1.8）
export const FOCUS_FRAME_DISTANCE = 5.2;

export function interpolateDistance(current: number, target: number, delta: number, speed = 3.5) {
  const alpha = 1 - Math.exp(-speed * delta);
  return current + (target - current) * alpha;
}

export function getGalaxyAutoRotateSpeed(prefersReducedMotion: boolean) {
  return prefersReducedMotion ? 0 : GALAXY_AUTO_ROTATE_SPEED;
}

function getReducedMotionQuery() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return null;
  return window.matchMedia("(prefers-reduced-motion: reduce)");
}

function readPrefersReducedMotion() {
  return getReducedMotionQuery()?.matches ?? false;
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(readPrefersReducedMotion);

  useEffect(() => {
    const query = getReducedMotionQuery();
    if (!query) return undefined;

    const update = () => setPrefersReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return prefersReducedMotion;
}

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

export function CameraRig({ target = [0, 0, 0], paused = false, focused = false, focusKey = null }: CameraRigProps) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const currentTargetRef = useRef<[number, number, number]>(target);
  const targetRef = useRef<[number, number, number]>(target);
  const prevFocusedRef = useRef(false);
  const prevFocusKeyRef = useRef<string | null>(null);
  const desiredDistanceRef = useRef<number | null>(null);
  const savedDistanceRef = useRef<number>(22);
  const autoRotateSpeed = getGalaxyAutoRotateSpeed(usePrefersReducedMotion());

  useEffect(() => {
    targetRef.current = target;
  }, [target]);

  useFrame((state, delta) => {
    const controls = controlsRef.current;
    if (!controls) return;

    currentTargetRef.current = interpolateTarget(currentTargetRef.current, targetRef.current, delta);
    controls.target.copy(new THREE.Vector3(...currentTargetRef.current));

    // 追焦推近/拉远：聚焦沿视线推到取景距离，退出时回到聚焦前的观察距离
    if (focused !== prevFocusedRef.current) {
      const currentDistance = state.camera.position.distanceTo(controls.target);
      if (focused) {
        savedDistanceRef.current = currentDistance;
        desiredDistanceRef.current = FOCUS_FRAME_DISTANCE;
      } else {
        desiredDistanceRef.current = savedDistanceRef.current;
      }
      prevFocusedRef.current = focused;
    } else if (focused && focusKey !== prevFocusKeyRef.current) {
      // 聚焦态下切换目标（如"前往 X 的恒星系"）：保持首次聚焦前的返航距离，重新触发推近
      desiredDistanceRef.current = FOCUS_FRAME_DISTANCE;
    }
    prevFocusKeyRef.current = focusKey;

    if (desiredDistanceRef.current !== null) {
      const currentDistance = state.camera.position.distanceTo(controls.target);
      const nextDistance = interpolateDistance(currentDistance, desiredDistanceRef.current, delta);
      const direction = state.camera.position.clone().sub(controls.target).normalize();
      state.camera.position.copy(controls.target.clone().add(direction.multiplyScalar(nextDistance)));
      // 到位后交还控制权，用户仍可自由缩放
      if (Math.abs(nextDistance - desiredDistanceRef.current) < 0.06) desiredDistanceRef.current = null;
    }

    controls.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      target={currentTargetRef.current}
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.55}
      autoRotate={autoRotateSpeed > 0 && !paused}
      autoRotateSpeed={autoRotateSpeed}
      zoomSpeed={0.7}
      minDistance={4}
      maxDistance={38}
    />
  );
}
