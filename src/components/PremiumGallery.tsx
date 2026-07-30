import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react";
import { optimizedImageUrl } from "@/lib/images";

interface PremiumGalleryProps {
  images: string[];
}

// Predefined luxury scattered layout configurations for desktop (rotated, offset, varied sizes)
const DESKTOP_LAYOUTS = [
  { colSpan: "col-span-4", aspect: "aspect-[4/5]", rotate: "-rotate-2", translate: "translate-y-4", sizeClass: "w-full" },
  { colSpan: "col-span-4", aspect: "aspect-square", rotate: "rotate-3", translate: "-translate-y-8", sizeClass: "w-[90%]", align: "justify-self-center" },
  { colSpan: "col-span-4", aspect: "aspect-[4/3]", rotate: "-rotate-3", translate: "translate-y-12", sizeClass: "w-full", align: "justify-self-end" },
  
  { colSpan: "col-span-5", aspect: "aspect-[16/10]", rotate: "rotate-2", translate: "-translate-y-4", sizeClass: "w-full" },
  { colSpan: "col-span-3", aspect: "aspect-[3/4]", rotate: "-rotate-2", translate: "translate-y-8", sizeClass: "w-[85%]", align: "justify-self-center" },
  { colSpan: "col-span-4", aspect: "aspect-[4/3]", rotate: "rotate-1", translate: "-translate-y-10", sizeClass: "w-full" },
  
  { colSpan: "col-span-6", aspect: "aspect-[16/9]", rotate: "-rotate-2", translate: "translate-y-6", sizeClass: "w-[95%]" },
  { colSpan: "col-span-6", aspect: "aspect-square", rotate: "rotate-3", translate: "-translate-y-6", sizeClass: "w-[85%]", align: "justify-self-end" },
];

export function PremiumGallery({ images }: PremiumGalleryProps) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [mobileActiveIdx, setMobileActiveIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Lightbox keyboard navigation
  useEffect(() => {
    if (activeIdx === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveIdx(null);
      } else if (e.key === "ArrowRight") {
        setActiveIdx((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowLeft") {
        setActiveIdx((prev) => (prev !== null && prev > 0 ? prev - 1 : images.length - 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIdx, images.length]);

  // Keep track of scroll on mobile to update indicator dot
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    if (clientWidth > 0) {
      const idx = Math.round(scrollLeft / clientWidth);
      setMobileActiveIdx(idx);
    }
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activeIdx !== null) {
      setActiveIdx((activeIdx + 1) % images.length);
    }
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activeIdx !== null) {
      setActiveIdx((activeIdx - 1 + images.length) % images.length);
    }
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="relative w-full py-6">
      {/* MOBILE: Swipeable Cards */}
      <div className="block md:hidden relative w-full overflow-hidden">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-4 pb-4 px-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {images.map((url, idx) => (
            <div
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className="snap-center shrink-0 w-[88%] aspect-[4/3] rounded-3xl overflow-hidden shadow-md border border-slate-100/60 active:scale-[0.98] transition-all duration-300 relative group"
            >
              <img
                src={optimizedImageUrl(url, 600, 450)}
                alt={`Gallery ${idx + 1}`}
                loading="lazy"
                decoding="async"
                width="600"
                height="450"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60 pointer-events-none" />
              <div className="absolute bottom-4 right-4 bg-white/85 backdrop-blur-sm p-2 rounded-full shadow-sm text-slate-700">
                <Maximize2 className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>

        {/* Premium Scroll Indicators */}
        <div className="flex justify-center items-center gap-2 mt-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (scrollRef.current) {
                  const width = scrollRef.current.clientWidth;
                  scrollRef.current.scrollTo({ left: idx * (width + 16), behavior: "smooth" });
                }
              }}
              className={`h-1.5 transition-all duration-300 rounded-full ${
                mobileActiveIdx === idx ? "w-6 bg-slate-800" : "w-1.5 bg-slate-300"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* DESKTOP: Dynamic Premium Scattered Layout */}
      <div className="hidden md:grid grid-cols-12 gap-x-8 gap-y-16 py-12 px-4 items-center relative min-h-[500px]">
        {images.map((url, idx) => {
          const layout = DESKTOP_LAYOUTS[idx % DESKTOP_LAYOUTS.length];
          return (
            <div
              key={idx}
              className={`${layout.colSpan} ${layout.align || ""} relative z-10`}
            >
              <div
                onClick={() => setActiveIdx(idx)}
                style={{ contentVisibility: "auto" }}
                className={`
                  ${layout.aspect} ${layout.sizeClass} ${layout.rotate} ${layout.translate}
                  rounded-3xl overflow-hidden border border-slate-100 shadow-md hover:shadow-2xl 
                  transition-all duration-300 ease-out cursor-pointer hover:rotate-0 hover:scale-[1.04] hover:z-50
                  group relative active:scale-[1.01]
                `}
              >
                <img
                  src={optimizedImageUrl(url, 800)}
                  alt={`Gallery ${idx + 1}`}
                  loading="lazy"
                  decoding="async"
                  width="800"
                  height="600"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-semibold text-slate-800 shadow-sm flex items-center gap-1.5">
                    <Maximize2 className="w-3.5 h-3.5" /> View Fullscreen
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* LIGHTBOX / FULLSCREEN MODAL */}
      {activeIdx !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-xl transition-all duration-300 animate-fade-in">
          {/* Close button */}
          <button
            onClick={() => setActiveIdx(null)}
            className="absolute top-6 right-6 z-[110] bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-md transition-all duration-200 border border-white/10 shadow-lg"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous Button */}
          <button
            onClick={prevImage}
            className="absolute left-6 z-[110] bg-white/10 hover:bg-white/20 text-white p-4 rounded-full backdrop-blur-md transition-all duration-200 border border-white/10 shadow-lg active:scale-95"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next Button */}
          <button
            onClick={nextImage}
            className="absolute right-6 z-[110] bg-white/10 hover:bg-white/20 text-white p-4 rounded-full backdrop-blur-md transition-all duration-200 border border-white/10 shadow-lg active:scale-95"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Active Image container with layout shift protection */}
          <div className="relative max-w-[90vw] max-h-[85vh] flex items-center justify-center animate-zoom-in select-none">
            <img
              src={optimizedImageUrl(images[activeIdx], 1600)}
              alt={`Gallery fullscreen ${activeIdx + 1}`}
              width="1600"
              height="1200"
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-white/5"
            />
            {/* Index label */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-white/10 text-white font-medium text-xs px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-sm">
              {activeIdx + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
