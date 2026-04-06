/* Path: src/components/IntegrationGrid.jsx */
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const integrations = [
  { name: "Shopify", icon: "🛍️", color: "#96bf48" },
  { name: "Google Sheets", icon: "📊", color: "#34a853" },
  { name: "Razorpay", icon: "💳", color: "#3395ff" },
  { name: "Slack", icon: "💬", color: "#4a154b" },
  { name: "CRM", icon: "📁", color: "#f2a033" },
];

export default function IntegrationGrid() {
  const navigate = useNavigate();

  // ⚡ Smart Navigation Logic
  const handleViewIntegrations = () => {
    const token = localStorage.getItem("token");
    if (token) {
      // Agar user login hai, toh usko dashboard ke andar le jao
      navigate("/dashboard");
    } else {
      // Agar login nahi hai, toh account banwane ke liye signup par bhejo
      navigate("/signup");
    }
  };

  return (
    <section id="technical" className="relative py-40 md:py-60 bg-[#050505] overflow-hidden z-10">
      {/* Background Rings - Lower Z-Index */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[600px] md:h-[600px] border border-white/5 rounded-full z-0"
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        <h2 className="text-5xl md:text-6xl font-bold tracking-tighter mb-20 md:mb-40 text-white">
          Connectivity <span className="text-indigo-500 italic">Unleashed.</span>
        </h2>

        {/* Icons Container */}
        <div className="relative h-[400px] md:h-[600px] flex items-center justify-center pointer-events-none">
          {/* Central Logo */}
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="z-20 w-24 h-24 md:w-32 md:h-32 bg-indigo-600 rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center shadow-[0_0_100px_rgba(79,70,229,0.5)] border border-white/20"
          >
            <span className="text-3xl md:text-4xl font-black italic text-white">N</span>
          </motion.div>

          {integrations.map((item, i) => (
            <OrbitingIcon key={i} item={item} index={i} total={integrations.length} />
          ))}
        </div>

        {/* 🛠️ Updated Button Area */}
        <div className="mt-20 relative z-30"> 
          <button 
            type="button"
            onClick={handleViewIntegrations} // 👈 1. Handle Function connected
            className="group relative px-10 py-5 bg-white/5 border border-white/10 rounded-2xl font-mono text-[10px] uppercase tracking-[0.3em] hover:bg-indigo-600 hover:text-white hover:border-indigo-500 transition-all overflow-hidden active:scale-95 shadow-xl"
          >
            <span className="relative z-10 text-white group-hover:text-white">View All 50+ Webhook Integrations</span>
            {/* Hover Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </button>
        </div>
      </div>
    </section>
  );
}

function OrbitingIcon({ item, index, total }) {
  const angle = (index / total) * (2 * Math.PI);
  // Responsive radius
  const radius = window.innerWidth < 768 ? 150 : 250;
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;

  return (
    <motion.div
      animate={{ x: [x, x + 15, x], y: [y, y - 15, y] }}
      transition={{ duration: 6 + index, repeat: Infinity, ease: "easeInOut" }}
      className="absolute p-4 md:p-6 bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl backdrop-blur-3xl flex flex-col items-center gap-2 md:gap-3 pointer-events-auto"
      style={{ boxShadow: `0 0 30px ${item.color}15` }}
    >
      <span className="text-3xl md:text-4xl">{item.icon}</span>
      <span className="text-[8px] md:text-[10px] font-mono tracking-[0.3em] text-gray-500 uppercase">{item.name}</span>
    </motion.div>
  );
}