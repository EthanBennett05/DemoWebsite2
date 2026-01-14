import { useEffect, useRef, useState } from "react";

const slides = [
  "/images/download.jpg",
  "/images/download-1.jpg",
  "/images/download-2.jpg",
];

export default function Slideshow() {
  const [index, setIndex] = useState(0);
  const startX = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const next = () => setIndex((i) => (i === slides.length - 1 ? 0 : i + 1));
  const prev = () => setIndex((i) => (i === 0 ? slides.length - 1 : i - 1));

  const stopAuto = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startAuto = () => {
    stopAuto();
    intervalRef.current = setInterval(next, 5000);
  };

  useEffect(() => {
    startAuto();
    return stopAuto;
  }, []); // Added the missing dependency array here to prevent multiple intervals

  const onTouchStart = (e: React.TouchEvent) => {
    stopAuto();
    startX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current === null) return;
    const endX = e.changedTouches[0].clientX;
    const diff = startX.current - endX;
    if (diff > 50) next();
    else if (diff < -50) prev();
    startX.current = null;
    startAuto();
  };

  return (
    <div
      className="relative w-full h-full overflow-hidden bg-black"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Slides */}
      {slides.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={`Slide ${i}`}
          /* object-center ensures the middle of your hunting photos stays visible 
             on narrow phone screens 
          */
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Controls - Hidden on small mobile to favor Swiping, visible on md: screens */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="hidden md:block absolute left-4 top-1/2 -translate-y-1/2 bg-[#7a5c3d]/60 hover:bg-[#7a5c3d] text-white px-5 py-3 text-3xl transition-colors font-black z-10"
      >
        ‹
      </button>

      <button
        onClick={next}
        aria-label="Next slide"
        className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 bg-[#7a5c3d]/60 hover:bg-[#7a5c3d] text-white px-5 py-3 text-3xl transition-colors font-black z-10"
      >
        ›
      </button>

      {/* Dots - Styled to be bigger 'touch targets' for mobile users */}
      <div className="absolute bottom-8 w-full flex justify-center gap-3 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              stopAuto();
              setIndex(i);
              startAuto();
            }}
            /* w-6 for mobile dots, w-10 for active */
            className={`h-1.5 transition-all duration-500 rounded-full ${
              i === index ? "bg-amber-600 w-10" : "bg-white/40 w-6"
            }`}
          />
        ))}
      </div>

      {/* Mobile Hint: Subtle gradient at bottom to help text readability above */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
    </div>
  );
}