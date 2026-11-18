import { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence, MotionConfig } from "motion/react";
import Loader from "./Loader/Loader";
import Hero from "./Hero/Hero";
import Gallery from "./Gallery/Gallery";
import OrbitLoader from "./Loader/OrbitLoader";
import { initSmoothScroll, scrollToTop } from "../lib/scroll";

const GALLERY_READY_TIMEOUT = 4500;
const isGalleryHash = () => window.location.hash.startsWith("#gallery");

function AppLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [triggerTransition, setTriggerTransition] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [galleryReady, setGalleryReady] = useState(false);
  const inGalleryRef = useRef(false); // true from the shutter click until we're back home
  const mountTimerRef = useRef(null);
  const [heroKey, setHeroKey] = useState(0); // remount the hero (camera undived) on return

  // Smooth scrolling + always start at the top of the hero
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    // The experience always starts from the hero; drop any stale #gallery hash.
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    const destroy = initSmoothScroll();
    scrollToTop();
    const timer = setTimeout(scrollToTop, 100);
    return () => {
      clearTimeout(timer);
      destroy();
    };
  }, []);

  // Hero -> Gallery
  const handleTransitionStart = useCallback((val) => {
    if (!val || inGalleryRef.current) return;
    inGalleryRef.current = true;
    setTriggerTransition(true);
    setGalleryReady(false);
    window.history.pushState({ gallery: true }, "", "#gallery");
    // Mount the gallery once the orbit loader covers the screen
    mountTimerRef.current = setTimeout(() => setShowGallery(true), 1000);
  }, []);

  const handleLoaderComplete = useCallback(() => setTriggerTransition(false), []);
  const handleIntroComplete = useCallback(() => setIsLoading(false), []);
  const handleGalleryReady = useCallback(() => setGalleryReady(true), []);

  // Gallery -> Hero
  const goHome = useCallback(() => {
    inGalleryRef.current = false;
    clearTimeout(mountTimerRef.current);
    setTriggerTransition(true);
    setGalleryReady(true);
    setTimeout(() => {
      setShowGallery(false);
      setHeroKey((k) => k + 1);
      scrollToTop();
    }, 1000);
  }, []);

  // The HOME button walks browser history back, so Back and HOME behave the same.
  const handleBack = useCallback(() => {
    if (isGalleryHash()) window.history.back();
    else goHome();
  }, [goHome]);

  // Browser back button (or HOME) leaving #gallery
  useEffect(() => {
    const onPop = () => {
      if (inGalleryRef.current && !isGalleryHash()) goHome();
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [goHome]);

  useEffect(() => {
    if (!triggerTransition || galleryReady) return;
    const timer = setTimeout(() => setGalleryReady(true), GALLERY_READY_TIMEOUT);
    return () => clearTimeout(timer);
  }, [galleryReady, triggerTransition]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen">
        {/* ORBIT LOADER Transition */}
        <AnimatePresence>
          {triggerTransition && (
            <OrbitLoader canFinish={galleryReady} onComplete={handleLoaderComplete} />
          )}
        </AnimatePresence>

        {/* HERO SECTION */}
        {!showGallery && (
          <Hero key={heroKey} isLoading={isLoading} isPaused={false} onPortalEnter={handleTransitionStart} />
        )}

        {/* GALLERY SECTION */}
        {showGallery && (
          <Gallery
            visible={!triggerTransition}
            onBack={handleBack}
            onImagesLoaded={handleGalleryReady}
          />
        )}

        {/* INITIAL SITE LOADER */}
        <AnimatePresence>
          {isLoading && <Loader key="loader" onComplete={handleIntroComplete} />}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}

export default AppLayout;
