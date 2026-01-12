import { useState, type FormEvent, type ChangeEvent } from "react";

interface BookingFormData {
  packageType: string;
  startDate: string;
  endDate: string;
  numHunters: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests: string;
}

function Booking() {
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5002";

  const [formData, setFormData] = useState<BookingFormData>({
    packageType: "",
    startDate: "",
    endDate: "",
    numHunters: 1,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialRequests: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); // Declared correctly here

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "numHunters" ? parseInt(value) : value,
    });
  };

const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setSubmitting(true);

  try {
    // Change "http://localhost:5002/api/bookings" to this:
    const res = await fetch(`${API_BASE}/api/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

      if (res.ok) {
        setShowSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top to see message
        setFormData({
          packageType: "",
          startDate: "",
          endDate: "",
          numHunters: 1,
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          specialRequests: "",
        });
      } else {
        alert("Transmission failed. Please verify your connection.");
      }
    } catch (err) {
      console.error("Booking error:", err);
      alert("Error submitting booking.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClasses =
    "w-full p-3 rounded-sm bg-[#2d3e2a] border border-[#7a5c3d]/40 text-[#e8dcc4] focus:border-amber-600 focus:outline-none transition-colors placeholder-[#7a5c3d]";
  const labelClasses =
    "block mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#d4b896]";

  return (
    <div className="min-h-screen bg-[#1a1c18] text-[#e8dcc4] py-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header (Stays visible for both states) */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <h2 className="text-[#d4b896] font-bold text-lg uppercase tracking-widest">
              Call to Book:{" "}
              <span className="text-amber-600">(000) 000-0000</span>
            </h2>
            <div className="flex items-center justify-center gap-4 mt-2">
              <div className="h-[1px] w-12 bg-[#7a5c3d]/40"></div>
              <span className="text-[#7a5c3d] text-[10px] uppercase tracking-[0.3em] font-black">
                or use our digital portal
              </span>
              <div className="h-[1px] w-12 bg-[#7a5c3d]/40"></div>
            </div>
          </div>

          <span className="text-amber-600 font-bold tracking-[.4em] text-xs uppercase">
            Reservation Request
          </span>
          <h1
            className="text-5xl md:text-6xl font-black text-[#d4b896] mt-2 uppercase tracking-tighter"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Book Your <span className="italic">Hunt</span>
          </h1>
          <div className="h-1 w-20 bg-amber-600 mx-auto mt-6"></div>

          <p className="mt-6 text-[#7a5c3d] text-[11px] uppercase tracking-widest max-w-md mx-auto leading-relaxed">
            All digital submissions are treated as{" "}
            <span className="text-amber-600/80">pending requests</span>.
            Reservations are not finalized until reviewed and accepted.
          </p>
        </div>

        {showSuccess ? (
          /* --- STYLED SUCCESS MESSAGE --- */
          <div className="bg-[#242622] p-12 border-4 border-[#7a5c3d] text-center shadow-2xl animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(217,119,6,0.3)]">
              <svg className="w-10 h-10 text-[#1a1c18]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tighter text-[#d4b896] mb-4">Transmission Received</h2>
            <p className="text-[#7a5c3d] uppercase tracking-[0.2em] text-[10px] font-bold mb-8 leading-relaxed max-w-sm mx-auto">
              Your field report has been logged. Lead guides will review your requested dates and contact you shortly to finalize your expedition.
            </p>
            <button 
              onClick={() => setShowSuccess(false)}
              className="border border-[#7a5c3d] text-[#d4b896] px-10 py-4 text-xs font-black uppercase tracking-[0.3em] hover:bg-[#7a5c3d] hover:text-[#faf8f3] transition-all duration-300"
            >
              Submit Another Request
            </button>
          </div>
        ) : (
          /* --- ORIGINAL FORM --- */
          <form
            onSubmit={handleSubmit}
            className="bg-[#242622] p-8 border-4 border-[#7a5c3d] shadow-2xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700"
          >
            {/* Package Selection */}
            <div>
              <label className={labelClasses}>Select Expedition</label>
              <select
                name="packageType"
                value={formData.packageType}
                onChange={handleChange}
                required
                className={inputClasses}
              >
                <option value="">-- Select a Package --</option>
                <option value="Trophy Whitetail">Trophy Whitetail - $2,500</option>
                <option value="Mountain Elk">Mountain Elk - $4,500</option>
                <option value="Waterfowl Dawn">Waterfowl Dawn - $1,200</option>
              </select>
            </div>

            {/* Date Selection */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className={labelClasses}>Arrival Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>Departure Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  className={inputClasses}
                />
              </div>
            </div>

            {/* Number of Hunters */}
            <div>
              <label className={labelClasses}>Party Size (Max 6)</label>
              <input
                type="number"
                name="numHunters"
                min="1"
                max="6"
                value={formData.numHunters}
                onChange={handleChange}
                required
                className={inputClasses}
              />
            </div>

            {/* Contact Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className={labelClasses}>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className={inputClasses}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className={labelClasses}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className={inputClasses}
                />
              </div>
            </div>

            {/* Special Requests */}
            <div>
              <label className={labelClasses}>Special Requests / Equipment Needs</label>
              <textarea
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleChange}
                rows={4}
                className={inputClasses}
                placeholder="Dietary restrictions, weapon preferences, etc."
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#7a5c3d] text-[#faf8f3] py-4 rounded-sm text-sm font-black uppercase tracking-[0.3em] hover:bg-amber-700 transition-all duration-300 disabled:bg-[#4a5b47] shadow-lg"
            >
              {submitting ? "Transmitting..." : "Submit Field Report"}
            </button>
          </form>
        )}

        <p className="mt-8 text-center text-[#7a5c3d] text-xs uppercase tracking-widest">
          Secure Transmission // 11 Rock Ranch Official Portal
        </p>
      </div>
    </div>
  );
}

export default Booking;