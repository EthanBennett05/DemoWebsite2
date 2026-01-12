import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminGalleryManager() {
  const [images, setImages] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const navigate = useNavigate();
  
  const API_BASE = 'http://localhost:5002';
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    if (!token) { navigate('/admin'); return; }
    fetchImages();
  }, [token, navigate]);

  const fetchImages = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/images`);
      const data = await res.json();
      setImages(data.images || []);
    } catch (err) { console.error(err); }
  };

  const handleUpload = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const targetForm = e.currentTarget;
    if (!selectedFile) return setMessage('Select a file first');

    setUploading(true);
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const res = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      if (res.ok) {
        setMessage('Asset archived successfully');
        setSelectedFile(null);
        fetchImages();
        targetForm.reset();
      }
    } catch (err) { setMessage('Upload failed'+ err); }
    finally { setUploading(false); }
  };

  const handleDelete = async (filename: string) => {
    if (!window.confirm("Delete this asset?")) return;
    const name = filename.split('/').pop();
    try {
      const res = await fetch(`${API_BASE}/api/images/${name}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchImages();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen bg-[#1a1c18] text-[#e8dcc4]">
      {/* Shared Navigation */}
      <nav className="bg-[#242622] border-b border-[#7a5c3d] p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-black uppercase tracking-tighter text-[#d4b896]" style={{ fontFamily: "Georgia, serif" }}>
            11R <span className="italic text-white">Command</span>
          </h1>
          <div className="flex gap-6">
            <button onClick={() => navigate('/admin/dashboard')} className="text-[#7a5c3d] hover:text-white text-xs font-black uppercase tracking-widest transition-colors">
              Schedule
            </button>
            <button onClick={() => navigate('/admin/bookings')} className="text-[#7a5c3d] hover:text-white text-xs font-black uppercase tracking-widest transition-colors">
              Bookings
            </button>
            <button className="text-amber-600 border-b-2 border-amber-600 pb-1 text-xs font-black uppercase tracking-widest">
              Gallery Manager
            </button>
          </div>
        </div>
        <button onClick={() => { localStorage.removeItem('adminToken'); navigate('/admin'); }} className="text-red-900 text-[10px] font-black uppercase tracking-widest">Logout</button>
      </nav>

      <div className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column: Upload Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-[#242622] p-8 border-2 border-[#7a5c3d] shadow-2xl">
              <h2 className="text-xl font-black uppercase tracking-widest text-[#d4b896] mb-6">Archive Asset</h2>
              <form onSubmit={handleUpload} className="space-y-6">
                <div className="border border-dashed border-[#7a5c3d]/50 p-6 bg-[#1a1c18] text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="block w-full text-[10px] text-[#7a5c3d] file:mr-4 file:py-2 file:px-4 file:bg-[#7a5c3d] file:text-white file:border-0 file:uppercase file:font-black cursor-pointer"
                  />
                </div>
                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full bg-amber-600 text-black py-4 font-black uppercase tracking-widest text-xs hover:bg-amber-500 disabled:bg-zinc-800 transition-all"
                >
                  {uploading ? 'Transmitting...' : 'Upload'}
                </button>
              </form>
              {message && <p className="mt-4 text-[10px] font-mono uppercase text-amber-500">{message}</p>}
            </div>
          </div>

          {/* Right Column: Image Grid */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-black uppercase tracking-widest text-white mb-6">Current Archive <span className="text-[#7a5c3d]">({images.length})</span></h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {images.map((img, idx) => (
                <div key={idx} className="group relative aspect-square bg-[#242622] border border-[#7a5c3d]/30 overflow-hidden">
                  <img src={`${API_BASE}${img}`} alt="Asset" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                  <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center p-4">
                    <button onClick={() => handleDelete(img)} className="bg-red-900/80 hover:bg-red-600 text-white text-[9px] font-black uppercase tracking-[0.2em] py-2 px-4 w-full">
                      Delete Entry
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}