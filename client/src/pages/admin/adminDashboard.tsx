import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { type EventInput } from '@fullcalendar/core';

interface Booking {
  id: string;
  firstName: string;
  lastName: string;
  packageType: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'denied';
  specialRequest: string;
}

export default function AdminDashboard() {
  const [events, setEvents] = useState<EventInput[]>([]);
  const [pendingCount, setPendingCount] = useState<number>(0);
  
  // Modal State for In-Person Bookings
  const [showModal, setShowModal] = useState(false);
  const [manualBooking, setManualBooking] = useState({
    firstName: '',
    lastName: '',
    packageType: 'Trophy Whitetail',
    startDate: '',
    endDate: '',
    email: 'in-person@11rockranch.com', // Internal placeholder
    phone: 'IN-PERSON',
    numHunters: 1,
    specialRequests: '',
    status: 'approved' // Set to approved by default for admin entry
  });

  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');
  const API_BASE = 'http://localhost:5002';

  // 1. Unified data loader
  const loadData = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/api/bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!res.ok) throw new Error("Unauthorized Access");
      
      const data = await res.json();
      const rawBookings: Booking[] = data.bookings || [];

      // Update notification bubble count
      const pending = rawBookings.filter(b => b.status === 'pending').length;
      setPendingCount(pending);
      
      // Transform to calendar format
      const calendarEvents: EventInput[] = rawBookings.map((b: Booking) => ({
        id: b.id,
        title: `${b.firstName.toUpperCase()} - ${b.packageType}`,
        start: b.startDate,
        end: b.endDate,
        backgroundColor: b.status === 'approved' ? '#7a5c3d' : '#2d3e2a',
        borderColor: b.status === 'approved' ? '#d4b896' : '#7a5c3d',
        textColor: '#e8dcc4',
        allDay: true,
      }));
      
      setEvents(calendarEvents);
    } catch (err) {
      console.error("Dashboard Load Error:", err);
    }
  }, [token, API_BASE]);

  useEffect(() => {
    if (!token) {
      navigate('/admin');
      return;
    }
    loadData();
  }, [token, navigate, loadData]);

  // 2. Handler for Manual Submission
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/bookings`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(manualBooking),
      });

      if (res.ok) {
        setShowModal(false);
        setManualBooking({
            firstName: '', lastName: '', packageType: 'Trophy Whitetail',
            startDate: '', endDate: '', email: 'in-person@11rockranch.com',
            phone: 'IN-PERSON', numHunters: 1, status: 'approved', specialRequests: ''
        });
        loadData(); // Re-sync calendar
      }
    } catch (err) {
      console.error("Manual Entry Error:", err);
      alert("Failed to sync manual entry to ledger.");
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1c18] text-[#e8dcc4]">
      {/* Sidebar Navigation */}
      <nav className="bg-[#242622] border-b border-[#7a5c3d] p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-black uppercase tracking-tighter text-[#d4b896]" style={{ fontFamily: "Georgia, serif" }}>
            11R <span className="italic text-white">Command</span>
          </h1>
          <div className="flex gap-6 items-center">
            <button className="text-amber-600 border-b-2 border-amber-600 pb-1 text-xs font-black uppercase tracking-widest">
              Schedule
            </button>
            
            <button 
              onClick={() => navigate('/admin/bookings')}
              className="relative text-[#7a5c3d] hover:text-white text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2"
            >
              Bookings
              {pendingCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] text-white animate-pulse shadow-lg font-bold">
                  {pendingCount}
                </span>
              )}
            </button>

            <button 
              onClick={() => navigate('/admin/gallery-manager')}
              className="text-[#7a5c3d] hover:text-white text-xs font-black uppercase tracking-widest transition-colors"
            >
              Gallery Manager
            </button>
          </div>
        </div>
        <button 
          onClick={() => { localStorage.removeItem('adminToken'); navigate('/admin'); }}
          className="text-red-900 hover:text-red-500 text-[10px] font-black uppercase tracking-widest transition-all"
        >
          Logout Session
        </button>
      </nav>

      <div className="max-w-7xl mx-auto p-8">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Expedition <span className="text-amber-600">Calendar</span></h2>
            <p className="text-[#7a5c3d] text-xs uppercase tracking-[.3em] mt-2 font-bold">Field Deployment Schedule</p>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={() => setShowModal(true)}
              className="bg-amber-600 text-black px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-2"
            >
              <span className="text-lg">+</span> Manual Log
            </button>
          </div>
        </header>

        {/* Calendar Container */}
        <div className="bg-[#242622] p-6 border-2 border-[#7a5c3d] shadow-2xl admin-calendar">
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={events}
            height="70vh"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: ''
            }}
          />
        </div>
      </div>

      {/* MANUAL ENTRY MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="bg-[#242622] border-2 border-[#7a5c3d] p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-300">
            <h3 className="text-xl font-black uppercase tracking-tighter text-[#d4b896] mb-6 border-b border-[#7a5c3d]/30 pb-4">Manual Expedition Log</h3>
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="First Name" 
                  required 
                  className="bg-[#1a1c18] border border-[#7a5c3d]/40 p-3 text-sm focus:border-amber-600 outline-none"
                  onChange={e => setManualBooking({...manualBooking, firstName: e.target.value})}
                />
                <input 
                  type="text" 
                  placeholder="Last Name" 
                  required 
                  className="bg-[#1a1c18] border border-[#7a5c3d]/40 p-3 text-sm focus:border-amber-600 outline-none"
                  onChange={e => setManualBooking({...manualBooking, lastName: e.target.value})}
                />
              </div>
              
              <label className="text-[10px] font-black uppercase tracking-widest text-[#7a5c3d]">Package</label>
              <select 
                className="w-full bg-[#1a1c18] border border-[#7a5c3d]/40 p-3 text-sm text-[#d4b896] outline-none"
                onChange={e => setManualBooking({...manualBooking, packageType: e.target.value})}
              >
                <option>Trophy Whitetail</option>
                <option>Mountain Elk</option>
                <option>Waterfowl Dawn</option>
              </select>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#7a5c3d]">Arrival</label>
                  <input 
                    type="date" 
                    required 
                    className="w-full bg-[#1a1c18] border border-[#7a5c3d]/40 p-3 text-sm mt-1"
                    onChange={e => setManualBooking({...manualBooking, startDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#7a5c3d]">Departure</label>
                  <input 
                    type="date" 
                    required 
                    className="w-full bg-[#1a1c18] border border-[#7a5c3d]/40 p-3 text-sm mt-1"
                    onChange={e => setManualBooking({...manualBooking, endDate: e.target.value})}
                  />
                </div>
                <div className="col-span-2 ">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#7a5c3d]">Special Requests</label>
                  <input 
                    type="text" 
                    placeholder='Extra Information'
                    className="w-full bg-[#1a1c18] border border-[#7a5c3d]/40 p-3 text-sm mt-1"
                    onChange={e => setManualBooking({...manualBooking, specialRequests: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-6">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-[#7a5c3d] text-[#7a5c3d] text-[10px] uppercase font-black py-4 hover:bg-red-900/10 transition-colors"
                >
                  Discard
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-amber-600 text-black text-[10px] uppercase font-black py-4 hover:bg-amber-100 transition-colors"
                >
                  Submit to calendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .admin-calendar .fc { background: #1a1c18; color: #e8dcc4; font-family: ui-sans-serif, system-ui; border: none; }
        .admin-calendar .fc-toolbar-title { font-family: Georgia, serif; text-transform: uppercase; font-weight: 900; color: #d4b896; letter-spacing: -0.05em; }
        .admin-calendar .fc-col-header-cell { background: #242622; padding: 12px 0; text-transform: uppercase; font-size: 10px; letter-spacing: 0.2em; color: #7a5c3d; border: 1px solid rgba(122, 92, 61, 0.1); }
        .admin-calendar .fc-daygrid-day { border: 1px solid rgba(122, 92, 61, 0.15) !important; }
        .admin-calendar .fc-daygrid-day-number { font-weight: 800; padding: 10px; font-size: 12px; color: #7a5c3d; }
        .admin-calendar .fc-button-primary { background: #7a5c3d !important; border: none !important; text-transform: uppercase !important; font-size: 10px !important; font-weight: 900 !important; border-radius: 0px !important; }
        .admin-calendar .fc-event { border-radius: 0px; border-left: 3px solid #d4b896 !important; padding: 2px 5px; font-size: 10px; font-weight: 900; }
      `}</style>
    </div>
  );
}