import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import cameraUrl from '../../assets/camera.glb';
import shutterSound from '../../assets/shutter.mp3';

export function CameraModel({ scrollYProgress, onPortalEnter, isPaused = false }) {
  const { scene } = useGLTF(cameraUrl);
  const group = useRef();

  useFrame(() => {
    if (!group.current || isPaused) return;
    
    // Calculate progress based on scroll
    // Assuming 0 is top of page, and we want animation to happen as we scroll down
    const progress = scrollYProgress.get(); 
    
   
    // Phase 1: Entry -> Top (0.1 -> 0.4)
    const p1Start = 0.1;
    const p1End = 0.4;
    
    // Phase 2: Top -> Center Front (0.45 -> 0.7)
    const p2Start = 0.45;
    const p2End = 0.7;

    // Phase 3: Zoom In (0.75 -> 0.9)
    const p3Start = 0.75;
    const p3End = 0.8;
    
    // Default / Start State
    let targetY = -10; 
    let targetX = -2;
    let targetZ = 0;
    
    let targetRotX = 0;
    let targetRotY = Math.PI; 
    let targetRotZ = Math.PI / 3;

    if (progress <= p1End) {
      // PHASE 1: RISE & SWIRL TO TOP
      if (progress > p1Start) {
        const t = Math.min(1, (progress - p1Start) / (p1End - p1Start));
        const ease = 1 - Math.pow(1 - t, 3);
        
        targetY = -10 + (ease * 12); // Rise to Top
        targetX = -2 + (ease * 2);   // Move Left -> Center
        
        targetRotX = ease * (Math.PI / 2); // Front -> Top
        targetRotY = Math.PI - (ease * Math.PI); // Side -> Front(Top)
        targetRotZ = (Math.PI / 3) - (ease * (Math.PI / 3)); 
      }
    } else if (progress <= p2End) {
       // PHASE 1 FINAL STATE (Baseline for Phase 2)
       targetY = 2; // Top
       targetX = 0;
       targetRotX = Math.PI / 2; // Top View
       targetRotY = 0;
       targetRotZ = 0;

       // PHASE 2: DROP & ROTATE TO FRONT
       if (progress > p2Start) {
         const t = Math.min(1, (progress - p2Start) / (p2End - p2Start));
         const ease = 1 - Math.pow(1 - t, 3);
         
         targetY = 2 - (ease * 2); // Top (2) -> Center (0)
         
         // Rotate Top View (PI/2) back to Front View (0)
         targetRotX = (Math.PI / 2) - (ease * (Math.PI / 2));
       }
    } else {
       // PHASE 2 FINAL STATE (Baseline for Phase 3)
       targetY = 0;
       targetX = 0;
       targetRotX = 0; // Front View
       targetRotY = 0;
       targetRotZ = 0;

       // PHASE 3: STABILIZE & FLASH (Simple Zoom)
       if (progress > p3Start) {
          const t = Math.min(1, (progress - p3Start) / (p3End - p3Start));
          const ease = t * t; 
          
          targetZ = ease * 2; // Slight zoom, not deep portal
          
          
       }
    }

    // Smooth interop 
    const damp = 0.5;
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, targetY, damp);
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, targetX, damp);
    group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, targetZ, damp); // Add Z
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetRotX, damp);
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetRotY, damp);
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, targetRotZ, damp);
  });

  // Responsive Scale (Simple check)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const baseScale = isMobile ? 0.018 : 0.025;

  return (
    <primitive 
      ref={group} 
      object={scene} 
      scale={baseScale} 
      position={[-5, -10, 0]} 
      rotation={[0, 0, 0]}
      onClick={(e) => {
         e.stopPropagation();
         
         // Audio Trigger
         try {
           const audio = new Audio(shutterSound);
           audio.volume = 0.6;
           audio.play().catch(err => console.warn("Audio play failed:", err));
         } catch (e) {
           console.warn("Audio setup failed:", e);
         }

         onPortalEnter?.(true); 
      }}
      onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { document.body.style.cursor = 'auto'; }}
    />
  );
}

useGLTF.preload(cameraUrl);
