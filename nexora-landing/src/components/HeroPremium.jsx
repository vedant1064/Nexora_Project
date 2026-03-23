/* Path: src/components/HeroPremium.jsx */
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function HeroPremium() {
  const navigate = useNavigate(); // ✅ Hook ko initialize karo

  // ✅ Smart Navigation Function
  const handleStart = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard"); // Agar login hai
    } else {
      navigate("/login"); // Agar login nahi hai
    }
  };
  const scrollToArchitecture = () => {
    const element = document.getElementById("technical"); // App.jsx mein ye ID di hui hai
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Content */}
        <div className="z-10 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/5 text-indigo-400 text-xs font-medium mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Autonomous Automation Engine
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9] mb-6"
          >
            Nexora <span className="text-gray-500">AI</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg md:text-xl max-w-xl mb-10 leading-relaxed"
          >
            Conversations don't just happen. They execute. Connect WhatsApp, OpenAI, and FastAPI into a single autonomous brain.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4 justify-center lg:justify-start"
          >
            <button 
              onClick={handleStart} // ✅ Function ko yahan connect karo
              className="px-8 py-4 bg-white text-black rounded-xl font-semibold hover:bg-indigo-50 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]"
            >
              Unlock Automation
            </button>
            <button 
              onClick={scrollToArchitecture}
              className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-semibold hover:bg-white/10 transition-all"
            >
              Watch Architecture
            </button>
          </motion.div>
        </div>

        {/* Right Side: The "Specify" Style Engine Visual */}
        <div className="relative flex justify-center items-center h-[500px]">
          {/* Central Glowing Core */}
          <motion.div 
            animate={{ scale: [1, 1.05, 1], rotate: 45 }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute w-48 h-48 bg-indigo-600/20 border border-indigo-500/40 rounded-3xl blur-xl"
          />
          <div className="relative w-40 h-40 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl rotate-45 flex items-center justify-center shadow-[0_0_80px_rgba(99,102,241,0.5)] border border-white/20">
             <div className="rotate-[-45deg] text-4xl font-bold italic">N</div>
          </div>

          {/* Floating Modules (WhatsApp, OpenAI, etc.) */}
          <FloatingModule label="WhatsApp" icon="💬" delay={0} x={-140} y={-100} color="border-green-500/30" />
          <FloatingModule label="OpenAI" icon="🧠" delay={1} x={140} y={-80} color="border-purple-500/30" />
          <FloatingModule label="FastAPI" icon="⚡" delay={0.5} x={0} y={160} color="border-blue-500/30" />
          
          {/* Connection Lines (Simulated with CSS) */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
             <svg width="100%" height="100%" viewBox="0 0 400 400" className="overflow-visible">
                <motion.circle cx="200" cy="200" r="150" fill="none" stroke="white" strokeDasharray="5 10" animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} />
             </svg>
          </div>
        </div>

      </div>
    </section>
  );
}

function FloatingModule({ label, icon, delay, x, y, color }) {
  return (
    <motion.div
      initial={{ x, y, opacity: 0 }}
      animate={{ x, y: [y, y - 15, y], opacity: 1 }}
      transition={{ duration: 5, delay, repeat: Infinity, ease: "easeInOut" }}
      className={`absolute px-4 py-3 bg-black/40 backdrop-blur-xl border ${color} rounded-2xl flex items-center gap-3 shadow-2xl`}
    >
      <span className="text-xl">{icon}</span>
      <span className="text-xs font-mono tracking-wider uppercase text-gray-300">{label}</span>
    </motion.div>
  );
}