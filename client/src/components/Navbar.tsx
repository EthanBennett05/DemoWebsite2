import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <>
    <nav className="flex justify-center bg-[#262c1f] text-white py-8 p-4 shadow-lg">
        <div className="flex gap-6 md:gap-10 justify-center md:justify-end">
          <Link to="/" className="md:text-xl font-semibold text-amber-400 hover:text-amber-500">
            Welcome
          </Link>
          <Link to="/huntPackages" className="md:text-xl font-semibold text-amber-400 hover:text-amber-500">
            Hunt Packages
          </Link>
          <Link to="/lodging" className="md:text-xl font-semibold text-amber-400 hover:text-amber-500">
            Lodging
          </Link>
          <Link to="/booking" className="md:text-xl font-semibold text-amber-400 hover:text-amber-500">
            Booking
          </Link>
          <Link to="/gallery" className="md:text-xl font-semibold text-amber-400 hover:text-amber-500">
            Gallery
          </Link>
        </div>
    </nav>
    </>
  );
}