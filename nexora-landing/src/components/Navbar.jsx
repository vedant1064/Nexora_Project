/* Navbar.jsx mein ye update karo */
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ⚡ Ye har page change par check karega ki token hai ya nahi
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location]); 

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/"; // Pura refresh taaki state clear ho jaye
  };

  return (
    <nav className="fixed top-0 inset-x-0 z-[100] bg-black/60 backdrop-blur-md border-b border-white/5 py-4 px-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center font-black text-xl italic shadow-[0_0_20px_rgba(79,70,229,0.4)]">N</div>
          <span className="text-xl font-bold tracking-tighter">NEXORA AI</span>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-6">
          {isLoggedIn ? (
            <>
              <button 
                onClick={() => navigate('/dashboard')} 
                className="text-[10px] font-black uppercase tracking-widest text-indigo-400 border border-indigo-500/20 px-4 py-2 rounded-lg bg-indigo-500/5"
              >
                Go to Console
              </button>
              <button onClick={handleLogout} className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="text-xs font-bold uppercase tracking-widest hover:text-indigo-400 transition-colors">
                Login
              </button>
              <button onClick={() => navigate('/signup')} className="bg-white text-black px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all shadow-lg">
                Sign Up Free
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}