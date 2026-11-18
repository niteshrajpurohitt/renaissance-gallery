import { useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import cameraUrl from '../../assets/camera.glb';

const { damp, lerp, smoothstep } = THREE.MathUtils;
const PI = Math.PI;

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const easeInQuad = (t) => t * t;

/*
 * Scroll choreography. Each keyframe is reached at scroll progress `p`;
 * `ease` shapes the segment that leads INTO that keyframe.
 *   0.10 → 0.40  rise & swirl to a top view      (AIM)
 *   0.45 → 0.70  drop & rotate to face the viewer (FOCUS)
 *   0.75 → 0.80  push in towards the viewer       (SHOOT)
 */
const KEYFRAMES = [
  { p: 0.1, pos: [-2, -10, 0], rot: [0, PI, PI / 3] },
  { p: 0.4, pos: [0, 2, 0], rot: [PI / 2, 0, 0], ease: easeOutCubic },
  { p: 0.45, pos: [0, 2, 0], rot: [PI / 2, 0, 0] },
  { p: 0.7, pos: [0, 0, 0], rot: [0, 0, 0], ease: easeOutCubic },
  { p: 0.75, pos: [0, 0, 0], rot: [0, 0, 0] },
  { p: 0.8, pos: [0, 0, 2], rot: [0, 0, 0], ease: easeInQuad },
];

function sampleKeyframes(progress, outPos, outRot) {
  const first = KEYFRAMES[0];
  const last = KEYFRAMES[KEYFRAMES.length - 1];
  if (progress <= first.p) {
    outPos.set(...first.pos);
    outRot.set(...first.rot);
    return;
  }
  if (progress >= last.p) {
    outPos.set(...last.pos);
    outRot.set(...last.rot);
    return;
  }
  for (let i = 1; i < KEYFRAMES.length; i++) {
    const a = KEYFRAMES[i - 1];
    const b = KEYFRAMES[i];
    if (progress <= b.p) {
      const raw = (progress - a.p) / (b.p - a.p);
      const t = b.ease ? b.ease(raw) : raw;
      outPos.set(lerp(a.pos[0], b.pos[0], t), lerp(a.pos[1], b.pos[1], t), lerp(a.pos[2], b.pos[2], t));
      outRot.set(lerp(a.rot[0], b.rot[0], t), lerp(a.rot[1], b.rot[1], t), lerp(a.rot[2], b.rot[2], t));
      return;
    }
  }
}

// How strongly the camera follows the cursor: subtle always, strongest while "AIM" is on screen.
function aimWeight(progress) {
  const aim = smoothstep(progress, 0.25, 0.38) * (1 - smoothstep(progress, 0.5, 0.58));
  const settled = smoothstep(progress, 0.78, 0.85);
  return 0.05 + aim * 0.3 + settled * 0.1;
}

// How tightly the camera follows the (already smooth) Lenis scroll.
// ~40 matches the original lerp(0.5)-per-frame at 60fps, but is frame-rate independent.
const FOLLOW = 40;
// The cursor tilt and idle float get their own, softer smoothing.
const TILT_FOLLOW = 6;

export function CameraModel({ scrollYProgress, onShutter, isPaused = false }) {
  const { scene } = useGLTF(cameraUrl);
  const group = useRef();
  const isMobile = useThree((s) => s.size.width < 768);
  const targetPos = useRef(new THREE.Vector3()).current;
  const targetRot = useRef(new THREE.Vector3()).current;
  const tilt = useRef({ x: 0, y: 0 }).current;

  useEffect(() => () => { document.body.style.cursor = 'auto'; }, []);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g || isPaused) return;
    const dt = Math.min(delta, 1 / 20); // avoid jumps after a tab switch
    const t = state.clock.elapsedTime;
    const progress = scrollYProgress.get();

    sampleKeyframes(progress, targetPos, targetRot);

    // Cursor tilt is smoothed separately so the scroll path itself stays responsive.
    const w = aimWeight(progress);
    tilt.x = damp(tilt.x, -state.pointer.y * w * 0.6, TILT_FOLLOW, dt);
    tilt.y = damp(tilt.y, state.pointer.x * w, TILT_FOLLOW, dt);

    // Idle life: a slow float and a hint of sway.
    targetPos.y += Math.sin(t * 1.1) * 0.06;
    targetRot.x += tilt.x;
    targetRot.y += tilt.y;
    targetRot.z += Math.sin(t * 0.7) * 0.02;

    const lambda = FOLLOW;

    g.position.set(
      damp(g.position.x, targetPos.x, lambda, dt),
      damp(g.position.y, targetPos.y, lambda, dt),
      damp(g.position.z, targetPos.z, lambda, dt),
    );
    g.rotation.set(
      damp(g.rotation.x, targetRot.x, lambda, dt),
      damp(g.rotation.y, targetRot.y, lambda, dt),
      damp(g.rotation.z, targetRot.z, lambda, dt),
    );
  });

  return (
    <primitive
      ref={group}
      object={scene}
      scale={isMobile ? 0.018 : 0.025}
      position={KEYFRAMES[0].pos}
      rotation={KEYFRAMES[0].rot}
      onClick={(e) => {
        e.stopPropagation();
        onShutter?.();
      }}
      onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { document.body.style.cursor = 'auto'; }}
    />
  );
}

useGLTF.preload(cameraUrl);
