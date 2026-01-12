import { useEffect, useRef, useState } from "react";

const slides = [
  "/images/download.jpg",
  "/images/download-1.jpg",
  "/images/download-2.jpg",
];

export default function Slideshow() {
  const [index, setIndex] = useState(0);
  
  // 1. Explicitly tell TypeScript the ref can hold a number or null
  const startX = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const next = () =>
    setIndex((i) => (i === slides.length - 1 ? 0 : i + 1));

  const prev = () =>
    setIndex((i) => (i === 0 ? slides.length - 1 : i - 1));

  const stopAuto = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startAuto = () => {
    stopAuto();
    // 2. This assignment now works because of the type definition above
    intervalRef.current = setInterval(next, 5000);
  };

  // 3. Added empty dependency array [] so this only runs once on mount
  useEffect(() => {
    startAuto();
    return stopAuto;
  },); 


  // Touch handlers with proper types
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
      className="relative w-full h-full overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Slides */}
      {slides.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={`Slide ${i}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Controls - Updated to match 11 Rock Ranch style */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-[#7a5c3d]/60 hover:bg-[#7a5c3d] text-white px-4 py-2 text-2xl transition-colors font-black"
      >
        ‹
      </button>

      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#7a5c3d]/60 hover:bg-[#7a5c3d] text-white px-4 py-2 text-2xl transition-colors font-black"
      >
        ›
      </button>

      {/* Dots */}
      <div className="absolute bottom-5 w-full flex justify-center gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2 w-8 transition-all duration-300 ${
              i === index ? "bg-amber-600 w-12" : "bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}