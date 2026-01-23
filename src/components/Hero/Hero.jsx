
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import profileImage from "../../assets/images/profile.webp";
import CameraScene from "./CameraScene";

// eslint-disable-next-line react/prop-types
function Hero({ isLoading, onPortalEnter }) {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const profileOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const profileY = useTransform(scrollYProgress, [0, 0.2], [0, 200]);
  const profileX = useTransform(scrollYProgress, [0, 0.2], [0, 150]); // Move Right
  const profileRotate = useTransform(scrollYProgress, [0, 0.2], [0, 15]); // Rotate Clockwise

  return (
    <section ref={containerRef} className="relative min-h-[250vh]">
      <div 
        className="sticky top-0 h-screen flex flex-col justify-end overflow-hidden bg-[#1c1917]"
        style={{
          background: 'radial-gradient(circle at center, rgba(80,70,60,0.2) 0%, rgba(20,15,10,0.95) 60%)',
          backgroundColor: '#1c1917'
        }}
      >
        
        {/* 3D SCENE LAYER */}
        <CameraScene scrollYProgress={scrollYProgress} onPortalEnter={onPortalEnter} />

        {/* HERO CONTENT (Profile) */}
        <div className="w-full h-full flex flex-col justify-end items-center pb-0 relative z-20 pointer-events-none">
          
          {/* TEXT LAYER */}
          <motion.div 
            className="text-center mb-8 flex flex-col items-center z-30 mix-blend-overlay"
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            style={{ 
              opacity: profileOpacity, 
              y: profileY,
            }}
          >
            <h1 className="text-white text-6xl md:text-8xl font-primary font-medium tracking-tight opacity-90 leading-tight">
              I see, therefore I am
            </h1>
            <motion.p 
              className="text-amber-100/60 text-sm md:text-base font-secondary tracking-tight uppercase mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
            >
             NITESH | PHOTOGRAPHY
            </motion.p>
          </motion.div>

          <motion.div 
            className="translate-y-12 mb-12"
            initial={{ opacity: 0, scale: 0.9, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 50 }} 
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            style={{ 
              opacity: profileOpacity, 
              y: profileY,
              x: profileX,
              rotate: profileRotate
            }}
          >
            <img
              src={profileImage}
              alt="Photographer profile"
              className="size-105 object-contain drop-shadow-2xl pointer-events-none"
            />
          </motion.div>

          {/* INSTRUCTION TEXT - Fades in only at the end of scroll */}
          <motion.div
             className="absolute bottom-10 z-50 text-white/50 font-secondary text-sm tracking-widest uppercase pointer-events-none mix-blend-difference"
             style={{ opacity: useTransform(scrollYProgress, [0.85, 0.95], [0, 1]) }}
          >
             [ Click Camera to Enter ]
          </motion.div>
        </div>
        
      </div>
    </section>
  );
}

export default Hero;
