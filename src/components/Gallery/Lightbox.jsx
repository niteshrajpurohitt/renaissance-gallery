import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { photoAlt, photoSrc, toRoman } from "./photos";

const SWIPE_THRESHOLD = 80;

export default function Lightbox({ photos, index, originIndex, direction = 0, onClose, onNavigate }) {
  const open = index != null;
  const photo = open ? photos[index] : null;
  const hasPrev = open && index > 0;
  const hasNext = open && index < photos.length - 1;

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft" && hasPrev) onNavigate(index - 1);
      else if (e.key === "ArrowRight" && hasNext) onNavigate(index + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, index, hasPrev, hasNext, onClose, onNavigate]);

  const details = photo && [photo.place, photo.date].filter(Boolean).join(" · ");
  // Only the photo that was clicked zooms out of its grid frame; photos reached
  // with next/prev slide in instead (otherwise each would fly in from the grid).
  const isOrigin = index === originIndex;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="lightbox"
          className="fixed inset-0 z-[150] flex flex-col items-center justify-center px-4 py-10 md:px-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          role="dialog"
          aria-modal="true"
          aria-label={photoAlt(photo, index)}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[#0f0c0a]/95 backdrop-blur-sm cursor-zoom-out"
            onClick={onClose}
          />

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-10 text-gilt/70 hover:text-gilt font-primary text-sm tracking-[0.3em] uppercase cursor-pointer transition-colors"
            aria-label="Close"
          >
            Close ✕
          </button>

          {/* The framed photograph */}
          <motion.div
            key={photo.file}
            layoutId={isOrigin ? `photo-${photo.file}` : undefined}
            initial={isOrigin ? false : { opacity: 0, x: direction * 60 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative z-[1] p-2 md:p-3 bg-umber border border-gilt/70 shadow-[0_0_0_1px_rgba(212,175,55,0.15),0_30px_80px_rgba(0,0,0,0.7)]"
            transition={{ type: "spring", stiffness: 260, damping: 32 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            onDragEnd={(_, info) => {
              if (info.offset.x < -SWIPE_THRESHOLD && hasNext) onNavigate(index + 1);
              else if (info.offset.x > SWIPE_THRESHOLD && hasPrev) onNavigate(index - 1);
            }}
          >
            <div className="border border-gilt/25">
              <img
                src={photoSrc(photo)}
                alt={photoAlt(photo, index)}
                width={photo.w}
                height={photo.h}
                draggable={false}
                className="block max-h-[72vh] max-w-[88vw] md:max-w-[70vw] w-auto h-auto object-contain select-none"
              />
            </div>
          </motion.div>

          {/* Brass plaque */}
          <motion.div
            key={`plaque-${index}`}
            className="relative z-[1] mt-6 px-6 py-2 border border-gilt/50 bg-umber text-center"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
          >
            <p className="font-primary text-gilt text-sm tracking-[0.35em]">
              {toRoman(index + 1)}
              {photo.title && <span className="tracking-[0.15em] italic"> — {photo.title}</span>}
            </p>
            {details && (
              <p className="font-secondary text-ivory/50 text-[11px] tracking-[0.2em] uppercase mt-1">
                {details}
              </p>
            )}
            {photo.settings && (
              <p className="font-secondary text-ivory/35 text-[10px] tracking-[0.2em] mt-0.5">
                {photo.settings}
              </p>
            )}
          </motion.div>

          {/* Prev / Next */}
          {hasPrev && (
            <button
              onClick={() => onNavigate(index - 1)}
              className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-[2] p-3 text-3xl text-gilt/60 hover:text-gilt transition-colors cursor-pointer"
              aria-label="Previous photo"
            >
              ‹
            </button>
          )}
          {hasNext && (
            <button
              onClick={() => onNavigate(index + 1)}
              className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-[2] p-3 text-3xl text-gilt/60 hover:text-gilt transition-colors cursor-pointer"
              aria-label="Next photo"
            >
              ›
            </button>
          )}

          <p className="absolute bottom-4 z-[1] font-secondary text-[10px] tracking-[0.3em] uppercase text-ivory/30">
            {index + 1} / {photos.length}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
