import { useState, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // Unified API Port to 5002 to match your server.js
  const API_URL = 'http://localhost:5002/api/login';

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('adminToken', data.token);
        navigate('/admin/dashboard');
      } else {
        setError(data.error || 'Invalid Credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Connection to Secure Server Failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full p-3 rounded-sm bg-[#1a1c18] border border-[#7a5c3d]/40 text-[#e8dcc4] focus:border-amber-600 focus:outline-none transition-colors";
  const labelClasses = "block mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#d4b896]";

  return (
    <div className="min-h-screen bg-[#1a1c18] text-[#e8dcc4] flex items-center justify-center p-4">
      {/* Decorative Border Wrapper */}
      <div className="bg-[#242622] p-10 border-4 border-[#7a5c3d] w-full max-w-md shadow-2xl relative">
        
        {/* Logo/Header */}
        <div className="text-center mb-10">
          <div className="inline-block border-2 border-[#7a5c3d] p-3 rounded-full mb-4">
             <span className="text-[#7a5c3d] font-black text-xl tracking-tighter">11R</span>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-[#d4b896]" style={{ fontFamily: "Georgia, serif" }}>
            Admin <span className="italic">Portal</span>
          </h1>
          <p className="text-[#7a5c3d] text-[10px] uppercase tracking-[0.3em] mt-2 font-bold">Authorized Personnel Only</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={labelClasses}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
              className={inputClasses}
              placeholder="ENTER IDENTIFIER"
              required
            />
          </div>
          
          <div>
            <label className={labelClasses}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              className={inputClasses}
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-900/50 p-3 text-center">
              <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#7a5c3d] text-[#faf8f3] py-4 rounded-sm text-sm font-black uppercase tracking-[0.3em] hover:bg-amber-700 transition-all duration-300 disabled:bg-[#4a5b47] shadow-lg"
          >
            {loading ? 'Verifying...' : 'Login'}
          </button>
        </form>

        <div className="mt-8 text-center opacity-30">
          <p className="text-[9px] uppercase tracking-widest">Secure AES-256 Encrypted Transmission</p>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;