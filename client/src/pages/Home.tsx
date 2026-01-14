import Slideshow from "../components/Slideshow"; 
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="bg-[#1a1c18] min-h-screen text-white">
      
      {/* 1. Hero / Slideshow Section */}
      <section className="relative h-[80vh] w-full border-b-4 border-amber-900/30">
        <Slideshow />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-6">
          
          {/* Mobile: text-4xl | Desktop: text-8xl */}
          <h1 className="text-4xl md:text-8xl font-black uppercase tracking-tighter mb-4 leading-none">
            The <span className="text-amber-600 italic">Outfitter</span>
          </h1>
          
          {/* Mobile: text-lg | Desktop: text-2xl */}
          <p className="max-w-2xl text-amber-100/80 font-serif italic text-lg md:text-2xl mb-10 px-2">
            "Premier guided expeditions across the heart of the wild."
          </p>
          
          {/* Mobile: Vertical Stack | Desktop: Horizontal Row */}
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-[280px] sm:max-w-none">
            <Link to="/huntPackages" className="bg-amber-600 hover:bg-amber-500 text-black px-8 py-4 font-black uppercase tracking-widest text-xs transition-all text-center">
              View Hunts
            </Link>
            <Link to="/gallery" className="border border-white/20 hover:bg-white/10 px-8 py-4 font-black uppercase tracking-widest text-xs transition-all text-center">
              The Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Brief Intro Section */}
      <section className="max-w-4xl mx-auto py-16 md:py-24 px-6 text-center">
        <h2 className="text-amber-500 font-bold uppercase tracking-[0.3em] text-[10px] md:text-xs mb-6">
          Established 2026
        </h2>
        
        {/* Mobile: text-xl | Desktop: text-4xl */}
        <p className="text-xl md:text-4xl font-light leading-relaxed text-amber-50/90">
          From the misty mountain draws to the golden morning marshes, we provide more than a hunt—we provide a <span className="text-white font-bold italic">legacy.</span>
        </p>
        
        <div className="w-16 md:w-24 h-1 bg-amber-900/50 mx-auto mt-8 md:mt-12"></div>
      </section>
    </div>
  );
}