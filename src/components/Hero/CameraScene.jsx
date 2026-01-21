import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import { CameraModel } from './CameraModel';
import { Suspense } from 'react';

export default function CameraScene({ scrollYProgress }) {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        
        <Suspense fallback={null}>
          <CameraModel scrollYProgress={scrollYProgress} />
          {/* 
            Available Presets: 
            "sunset" (Warm/Orange), "dawn" (Cool/Rising), "night" (Dark), 
            "warehouse" (Industrial), "forest" (Green), "apartment" (Warm Home), 
            "studio" (Clean/White), "city" (Bright), "park" (Green/Open), "lobby" (Warm/Commercial) 
          */}
          <Environment preset="city" />
          <ContactShadows position={[0, -4, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
        </Suspense>
      </Canvas>
    </div>
  );
}
