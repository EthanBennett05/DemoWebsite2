import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

interface Booking {
  id: string;
  packageType: string;
  startDate: string;
  endDate: string;
  numHunters: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests: string;
  status: "pending" | "approved" | "denied";
  createdAt: string;
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "denied">("all");
  
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5002';
  const token = localStorage.getItem("adminToken");

  const fetchBookings = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/api/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setBookings(Array.isArray(data.bookings) ? data.bookings : []);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      navigate("/admin");
      return;
    }
    fetchBookings();
  }, [token, navigate, fetchBookings]);

const updateBookingStatus = async (id: string, status: "approved" | "denied" | "pending") => {
  // 1. UPDATE UI IMMEDIATELY (Optimistic)
  const previousBookings = [...bookings]; // Save for rollback if error
  setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));

  try {
    const res = await fetch(`${API_BASE}/api/bookings/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      throw new Error("Server rejected the update");
    }
    
    // Optional: sync with server data
    fetchBookings(); 
  } catch (err) {
    console.error("Error updating booking:", err);
    // 2. ROLLBACK if it actually failed
    setBookings(previousBookings);
    alert("Connection to 11R Command lost. Record not updated.");
  }
};

  const deleteBooking = async (id: string) => {
    if (!window.confirm("Permanently strike this record from the archive?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/bookings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchBookings();
    } catch (err) {
      console.error("Error deleting booking:", err);
    }
  };

  const filteredBookings = filter === "all" 
    ? bookings 
    : bookings.filter((b) => b.status === filter);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1c18] text-[#e8dcc4] flex items-center justify-center">
        <p className="animate-pulse tracking-[0.4em] uppercase text-xs font-bold text-[#7a5c3d]">Syncing Records...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1c18] text-[#e8dcc4] p-8">
        <nav className="bg-[#242622] border-b border-[#7a5c3d] p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-black uppercase tracking-tighter text-[#d4b896]" style={{ fontFamily: "Georgia, serif" }}>
            11R <span className="italic text-white">Command</span>
          </h1>
          <div className="flex gap-6">
            <button onClick={() => navigate('/admin/dashboard')} className="text-[#7a5c3d] hover:text-white text-xs font-black uppercase tracking-widest transition-colors">
              Schedule
            </button>
            <button onClick={() => navigate('/admin/bookings')} className="text-amber-600 border-b-2 border-amber-600 pb-1 text-xs font-black uppercase tracking-widest transition-colors">
              Bookings
            </button>
            <button onClick={() => navigate('/admin/gallery-manager')} className="text-[#7a5c3d] hover:text-white text-xs font-black uppercase tracking-widest">
              Gallery Manager
            </button>
          </div>
        </div>
        <button onClick={() => { localStorage.removeItem('adminToken'); navigate('/admin'); }} className="text-red-900 text-[10px] font-black uppercase tracking-widest">Logout</button>
      </nav>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12 border-b border-[#7a5c3d] pb-6">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-[#d4b896]" style={{ fontFamily: "Georgia, serif" }}>
            Reservation <span className="italic text-white">Ledger</span>
          </h1>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="border border-[#7a5c3d] text-[#7a5c3d] px-6 py-2 rounded-sm hover:bg-[#7a5c3d] hover:text-white transition-all uppercase text-[10px] font-black tracking-widest"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-12">
          {(["all", "pending", "approved", "denied"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === f ? "bg-amber-600 text-black shadow-lg" : "bg-[#242622] text-[#7a5c3d] hover:text-[#d4b896]"
              }`}
            >
              {f} ({f === "all" ? bookings.length : bookings.filter((b) => b.status === f).length})
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-[#242622] border-2 border-dashed border-[#7a5c3d]/30 p-20 text-center">
            <p className="text-[#7a5c3d] uppercase tracking-[0.4em] text-xs">No entries found</p>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="bg-[#242622] border-l-4 border-[#7a5c3d] p-8 shadow-2xl relative overflow-hidden group">
                {/* Status Watermark */}
                <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-6xl uppercase tracking-tighter pointer-events-none">
                  {booking.status}
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4 border-b border-white/5 pb-6">
                  <div>
                    <h3 className="text-3xl font-black uppercase tracking-tighter text-[#d4b896]">
                      {booking.firstName} {booking.lastName}
                    </h3>
                    <div className="flex gap-2 mt-2">
                       <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest ${
                         booking.status === 'approved' ? 'bg-green-900/40 text-green-400' : 
                         booking.status === 'denied' ? 'bg-red-900/40 text-red-400' : 'bg-amber-900/40 text-amber-500'
                       }`}>
                         STATUS: {booking.status}
                       </span>
                    </div>
                  </div>
                  <div className="md:text-right">
                    <p className="text-[9px] uppercase tracking-widest text-[#7a5c3d]">Transaction Record</p>
                    <p className="font-mono text-sm text-amber-600/60 uppercase">{booking.id.slice(-12)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-8 p-6 bg-[#1a1c18] border border-[#7a5c3d]/20">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-[#7a5c3d] mb-2 font-bold">Package Selection</p>
                    <p className="font-bold text-white text-sm uppercase">{booking.packageType}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-[#7a5c3d] mb-2 font-bold">Dates Requested</p>
                    <p className="font-bold text-white text-sm uppercase">{booking.startDate} — {booking.endDate}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-[#7a5c3d] mb-2 font-bold">Party Details</p>
                    <p className="font-bold text-white text-sm uppercase">{booking.numHunters} Active Hunters</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-[#7a5c3d] mb-2 font-bold">Contact Channel</p>
                    <p className="font-bold text-amber-600 text-xs">{booking.email}</p>
                    <p className="text-[10px] text-white/40 font-mono mt-1">{booking.phone}</p>
                  </div>
                </div>

                {booking.specialRequests && (
                  <div className="mb-8 p-6 bg-black/20 border border-amber-900/20 italic font-serif text-amber-100/60 text-sm">
                    "{booking.specialRequests}"
                  </div>
                )}

                <div className="flex flex-wrap gap-4 pt-4 border-t border-white/5">
                  {booking.status === "pending" ? (
                    <>
                      <button
                        onClick={() => updateBookingStatus(booking.id, "approved")}
                        className="bg-[#7a5c3d] text-white px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-green-700 transition-all"
                      >
                        Authorize Hunt
                      </button>
                      <button
                        onClick={() => updateBookingStatus(booking.id, "denied")}
                        className="border border-red-900/50 text-red-600 px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-900 hover:text-white transition-all"
                      >
                        Deny
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => updateBookingStatus(booking.id, "pending")}
                      className="bg-zinc-800 text-[#7a5c3d] px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-amber-600 hover:text-black transition-all"
                    >
                      Revert to Review
                    </button>
                  )}
                  <button
                    onClick={() => deleteBooking(booking.id)}
                    className="ml-auto text-zinc-600 hover:text-red-500 text-[9px] font-black uppercase tracking-widest transition-colors"
                  >
                    Permanent Expunge
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}