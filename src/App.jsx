import { useState, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import Loader from "./components/Loader/Loader";
import Hero from "./components/Hero/Hero";
import Gallery from "./components/Gallery/Gallery";
import OrbitLoader from "./components/Loader/OrbitLoader";
import images from "./components/Gallery/images.json"; 

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [triggerTransition, setTriggerTransition] = useState(false);
  const [showGallery, setShowGallery] = useState(false);

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
          // PRE-MOUNT GALLERY: Mount it after a delay so Loader covers screen
          setTimeout(() => {
             setShowGallery(true); 
          }, 1000);
      }
  };

  // Handle transition complete (Loader finshed)
  const handleLoaderComplete = () => {
    // Reveal Visuals by turning off the loader/transition state
    // Gallery is already mounted but opacity is controlled by !triggerTransition
    setTriggerTransition(false);
  };

  // Handle back to home
  const handleBack = () => {
    // Exact same flow as entering, but unmounting Gallery
    setTriggerTransition(true);

    // Wait for loader to cover screen (1000ms), then switch views
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
            <OrbitLoader onComplete={handleLoaderComplete} />
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
        <Gallery visible={!triggerTransition} onBack={handleBack} />
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

export default App;
