/* Path: src/components/Navbar.jsx */
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  // Aapke nexora-ui project ka URL (Vite port 5174)
  const UI_URL = "http://localhost:5174";

  

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 inset-x-0 z-[100] bg-black/60 backdrop-blur-md border-b border-white/5 py-4 px-8"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo Area */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center font-black text-xl italic shadow-[0_0_20px_rgba(79,70,229,0.4)]">
            N
          </div>
          <span className="text-xl font-bold tracking-tighter">NEXORA AI</span>
        </div>
        
        {/* Center Links (Smooth Scroll for Landing Page) */}
        <div className="hidden md:flex items-center gap-10 text-[11px] font-mono uppercase tracking-[0.2em] text-gray-400">
          <button 
            onClick={() => {
              const token = localStorage.getItem("token");
              navigate(token ? "/dashboard" : "/login");
            }} 
            className="hover:text-white transition-colors uppercase"
          >
            Workspace
          </button>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#technical" className="hover:text-white transition-colors">Docs</a>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/login')} // ✅ Ab ye 5173 par hi khulega
            className="text-xs font-bold uppercase tracking-widest hover:text-indigo-400 transition-colors"
          >
            Login
          </button>
          <button 
            onClick={() => navigate('/signup')} // ✅ Ab ye bhi 5173 par
            className="bg-white text-black px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all shadow-lg active:scale-95"
          >
            Sign Up Free
          </button>
        </div>
      </div>
    </motion.nav>
  );
}