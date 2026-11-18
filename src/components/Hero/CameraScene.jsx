import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import { CameraModel } from './CameraModel';
import { Suspense } from 'react';

export default function CameraScene({ scrollYProgress, onShutter, isPaused = false }) {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.5} />
        {/* Warm candle-like key light */}
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} color="#fff1dc" />
        <pointLight position={[-10, -10, -10]} />
        {/* Gilded rim light from behind — Renaissance chiaroscuro */}
        <pointLight position={[-6, 4, -6]} intensity={60} color="#d4af37" distance={30} />

        <Suspense fallback={null}>
          <CameraModel
            scrollYProgress={scrollYProgress}
            onShutter={onShutter}
            isPaused={isPaused}
          />

          {/* Same "city" lighting as before, served from /public instead of a third-party CDN */}
          <Environment files="/hdri/potsdamer_platz_1k.hdr" />
          <ContactShadows position={[0, -4, 0]} opacity={0.4} scale={10} blur={2.5} far={4} resolution={256} />
        </Suspense>
      </Canvas>
    </div>
  );
}
