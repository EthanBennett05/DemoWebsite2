import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import HuntPackages from "./pages/HuntPackage"
import Booking from "./pages/booking"
import Lodging from "./pages/Lodging"
import PublicGallery from "./pages/Gallery"

import Navbar from "./components/Navbar"
import AdminLogin from "./pages/admin/adminLogin"
import AdminDashboard from "./pages/admin/adminDashboard"
import AdminBookings from "./pages/admin/adminBookings"
import GalleryManager from "./pages/admin/admingallerymanager"


export default function App() {
  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/huntPackages" element={<HuntPackages />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="lodging" element={<Lodging />} />
        <Route path="gallery" element={<PublicGallery/>} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/bookings" element={<AdminBookings />}/>
        <Route path="/admin/gallery-manager" element={<GalleryManager/>} />
      </Routes>
    </BrowserRouter>
  )
}