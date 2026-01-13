import { useEffect, useState, useCallback } from 'react';

function PublicGallery() {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5002';

  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      // Ensure the port matches your current backend (usually 5002)
      const res = await fetch(`${API_BASE}/api/images`);
      
      if (!res.ok) {
        throw new Error('Failed to fetch images');
      }
      
      const data = await res.json();
      setImages(data.images);
      setError('');
    } catch (err) {
      console.error('Error fetching images:', err);
      setError('Connection to archive failed');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return (
    <div className="min-h-screen bg-[#1a1c18] text-[#e8dcc4] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <header className="text-center mb-16">
          <span className="text-amber-600 font-bold tracking-[.4em] text-xs uppercase">Visual Documentation</span>
          <h1 
            className="text-5xl md:text-6xl font-black text-[#d4b896] mt-4 uppercase tracking-tighter"
            style={{ fontFamily: "Georgia, serif" }}
          >
            The <span className="italic">Archive</span>
          </h1>
          <div className="h-1 w-20 bg-amber-600 mx-auto mt-6"></div>
        </header>
        
        {/* States Management */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-600 mb-4"></div>
            <p className="text-[#7a5c3d] uppercase tracking-widest text-xs font-bold">Accessing Field Logs...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-900/50 p-6 text-center rounded-sm">
            <p className="text-red-400 font-mono text-sm uppercase tracking-widest">{error}</p>
            <button 
              onClick={() => fetchImages()}
              className="mt-4 text-xs font-black text-white underline decoration-amber-600 underline-offset-4"
            >
              RETRY CONNECTION
            </button>
          </div>
        )}
        
        {/* High-Density Gallery Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {images.length === 0 ? (
              <div className="col-span-full py-32 border-2 border-dashed border-[#7a5c3d]/30 rounded-sm text-center">
                <p className="text-[#7a5c3d] uppercase tracking-[.3em] text-sm">No visual data currently logged</p>
              </div>
            ) : (
              images.map((img, index) => (
                <div 
                  key={index} 
                  className="group relative aspect-square bg-[#242622] border border-[#7a5c3d]/40 overflow-hidden shadow-lg transition-all duration-500 hover:border-amber-600"
                >
                  <img
                    src={`${API_BASE}${img}`}
                    alt={`Field Entry ${index}`}
                    className="w-full h-full object-cover transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-110"
                  />
                  
                  {/* Subtle Detail Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                    <p className="text-[#d4b896] text-[9px] font-mono uppercase tracking-tighter">
                      REF_LOG_{index + 100}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        
        {/* Footer Brand Seal */}
        {!loading && (
          <div className="mt-20 flex justify-center opacity-20">
          </div>
        )}
      </div>
    </div>
  );
}

export default PublicGallery;