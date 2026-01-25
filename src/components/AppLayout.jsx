import { useState, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import Loader from "./Loader/Loader";
import Hero from "./Hero/Hero";
import Gallery from "./Gallery/Gallery";
import OrbitLoader from "./Loader/OrbitLoader";

function AppLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [triggerTransition, setTriggerTransition] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [galleryReady, setGalleryReady] = useState(false);

  // Prevent browser scroll restoration and force scroll to top
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Handle transition start
  const handleTransitionStart = (val) => {
      if (val && !triggerTransition) {
          setTriggerTransition(true);
          setGalleryReady(false); // Reset readiness
          // PRE-MOUNT GALLERY: Mount it after a delay so Loader covers screen
          setTimeout(() => {
             setShowGallery(true); 
          }, 1000);
      }
  };

  // Handle transition complete (Loader finshed)
  const handleLoaderComplete = () => {
    setTriggerTransition(false);
  };

  // Handle back to home
  const handleBack = () => {
   
    setTriggerTransition(true);
    setGalleryReady(true); // Immediate ready for back transition (optional, or just logic)
    setTimeout(() => {
        setShowGallery(false);
        window.scrollTo(0, 0);
    }, 1000);
  };

  return (
    <div className="relative min-h-screen">
      
      {/* ORBIT LOADER Transition */}
      <AnimatePresence>
        {triggerTransition && (
            <OrbitLoader 
                canFinish={galleryReady}
                onComplete={handleLoaderComplete} 
            />
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <div style={{ display: showGallery ? 'none' : 'block' }}>
        <Hero 
            isLoading={isLoading}
            isPaused={showGallery}
            onPortalEnter={handleTransitionStart} 
        />
      </div>

      {/* GALLERY SECTION */}
      {showGallery && (
        <Gallery 
            visible={!triggerTransition} 
            onBack={handleBack} 
            onImagesLoaded={() => setGalleryReady(true)}
        />
      )}

      {/* INITIAL SITE LOADER */}
      <AnimatePresence>
        {isLoading && (
          <Loader key="loader" onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default AppLayout;
