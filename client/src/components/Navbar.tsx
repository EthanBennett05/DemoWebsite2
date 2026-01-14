import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Helper to close menu when a link is clicked
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="bg-[#262c1f] text-white py-6 p-4 shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center md:justify-center">
          
          {/* Mobile Brand Name (only shows on mobile) */}
          <div className="md:hidden font-bold text-amber-400 uppercase tracking-widest">
            The Outfitter
          </div>

          {/* Desktop Links (Hidden on mobile) */}
          <div className="hidden md:flex gap-10">
            <Link to="/" className="text-xl font-semibold text-amber-400 hover:text-amber-500">Welcome</Link>
            <Link to="/huntPackages" className="text-xl font-semibold text-amber-400 hover:text-amber-500">Hunt Packages</Link>
            <Link to="/lodging" className="text-xl font-semibold text-amber-400 hover:text-amber-500">Lodging</Link>
            <Link to="/booking" className="text-xl font-semibold text-amber-400 hover:text-amber-500">Booking</Link>
            <Link to="/gallery" className="text-xl font-semibold text-amber-400 hover:text-amber-500">Gallery</Link>
          </div>

          {/* Hamburger Button (Hidden on desktop) */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-amber-400 p-2 focus:outline-none"
          >
            {/* Simple SVG Menu Icon */}
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Dropdown (Hidden on desktop) */}
        <div className={`${isOpen ? "block" : "hidden"} md:hidden mt-4 border-t border-amber-900/30 pt-4`}>
          <div className="flex flex-col gap-4 items-center">
            <Link onClick={closeMenu} to="/" className="text-lg font-semibold text-amber-400">Welcome</Link>
            <Link onClick={closeMenu} to="/huntPackages" className="text-lg font-semibold text-amber-400">Hunt Packages</Link>
            <Link onClick={closeMenu} to="/lodging" className="text-lg font-semibold text-amber-400">Lodging</Link>
            <Link onClick={closeMenu} to="/booking" className="text-lg font-semibold text-amber-400">Booking</Link>
            <Link onClick={closeMenu} to="/gallery" className="text-lg font-semibold text-amber-400">Gallery</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}