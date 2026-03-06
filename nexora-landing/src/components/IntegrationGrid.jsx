/* Path: src/components/IntegrationGrid.jsx */
import { motion } from "framer-motion";

const integrations = [
  { name: "Shopify", icon: "🛍️", color: "#96bf48" },
  { name: "Google Sheets", icon: "📊", color: "#34a853" },
  { name: "Razorpay", icon: "💳", color: "#3395ff" },
  { name: "Slack", icon: "💬", color: "#4a154b" },
  { name: "CRM", icon: "📁", color: "#f2a033" },
];

export default function IntegrationGrid() {
  const UI_URL = "http://localhost:5174";

  return (
    <section id="technical" className="relative py-60 bg-[#050505] overflow-hidden">
      {/* Background Rings */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full"
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        <h2 className="text-6xl font-bold tracking-tighter mb-40 text-white">
          Connectivity <span className="text-indigo-500 italic">Unleashed.</span>
        </h2>

        {/* Icons Container */}
        <div className="relative h-[600px] flex items-center justify-center pointer-events-none">
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="z-20 w-32 h-32 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center shadow-[0_0_100px_rgba(79,70,229,0.5)] border border-white/20"
          >
            <span className="text-4xl font-black italic text-white">N</span>
          </motion.div>

          {integrations.map((item, i) => (
            <OrbitingIcon key={i} item={item} index={i} total={integrations.length} />
          ))}
        </div>

        {/* ACTUAL CLICKABLE BUTTON AREA */}
        <div className="mt-20 relative z-[9999]"> 
          <button 
            type="button"
            onClick={(e) => {
              e.preventDefault();
              console.log("Forcing redirect...");
              window.open(`${UI_URL}/signup`, "_self");
            }}
            style={{ pointerEvents: 'auto', cursor: 'pointer' }}
            className="group relative px-10 py-5 bg-white/5 border border-white/10 rounded-2xl font-mono text-[10px] uppercase tracking-[0.3em] hover:bg-indigo-600 hover:text-white transition-all overflow-hidden"
          >
            <span className="relative z-10">View All 50+ Webhook Integrations</span>
            <div className="absolute inset-0 bg-indigo-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </button>
        </div>
      </div>
    </section>
  );
}

function OrbitingIcon({ item, index, total }) {
  const angle = (index / total) * (2 * Math.PI);
  const radius = 250;
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;

  return (
    <motion.div
      animate={{ x: [x, x + 20, x], y: [y, y - 20, y] }}
      transition={{ duration: 6 + index, repeat: Infinity, ease: "easeInOut" }}
      className="absolute p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-3xl flex flex-col items-center gap-3"
      style={{ boxShadow: `0 0 30px ${item.color}15` }}
    >
      <span className="text-4xl">{item.icon}</span>
      <span className="text-[10px] font-mono tracking-[0.3em] text-gray-500 uppercase">{item.name}</span>
    </motion.div>
  );
}