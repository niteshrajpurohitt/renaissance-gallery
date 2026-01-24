import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import { CameraModel } from './CameraModel';
import { Suspense } from 'react';

export default function CameraScene({ scrollYProgress, onPortalEnter, isPaused = false }) {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        
        <Suspense fallback={null}>
          <CameraModel scrollYProgress={scrollYProgress} onPortalEnter={onPortalEnter} isPaused={isPaused} />
        
          <Environment preset="city" />
          <ContactShadows position={[0, -4, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
        </Suspense>
      </Canvas>
    </div>
  );
}
