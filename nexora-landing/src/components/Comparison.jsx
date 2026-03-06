/* Path: src/components/Comparison.jsx */
import { motion } from "framer-motion";

const data = [
  { feature: "Intelligence", old: "Basic Keyword Matching", nexora: "Context-Aware OpenAI Brain", icon: "🧠" },
  { feature: "Logic", old: "Static Button Flows", nexora: "Custom FastAPI Execution", icon: "⚡" },
  { feature: "Speed", old: "Human Dependent", nexora: "Autonomous 24/7", icon: "🚀" },
  { feature: "Memory", old: "Resets Every Session", nexora: "Deep Vector Database", icon: "💾" },
];

export default function Comparison() {
  const UI_URL = "http://localhost:5174";

  return (
    <section id="technical" className="py-40 bg-[#050505]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-32">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white">
            Standard vs <span className="text-indigo-500">Nexora</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 relative z-10">
          {data.map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="relative p-10 bg-white/[0.02] border border-white/10 rounded-[3rem] overflow-hidden"
            >
              <div className="flex items-center gap-6 mb-8">
                <span className="text-4xl">{item.icon}</span>
                <h3 className="text-3xl font-bold text-white">{item.feature}</h3>
              </div>

              <div className="grid grid-cols-2 gap-10">
                <div className="opacity-40">
                  <div className="text-[10px] font-mono uppercase tracking-widest mb-2">Traditional</div>
                  <div className="text-lg line-through text-gray-400">{item.old}</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest mb-2 text-indigo-400">Nexora Core</div>
                  <div className="text-lg font-semibold text-indigo-100">{item.nexora}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* THE CTA BOX - Increased Z-Index for clickability */}
        <div className="mt-24 p-12 bg-indigo-600/5 border border-indigo-500/20 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-10 relative z-[9999]">
          <div className="text-left text-white max-w-xl">
            <h4 className="text-2xl font-bold mb-2">Stop settling for basic bots.</h4>
            <p className="text-gray-400 font-medium">Upgrade your WhatsApp commerce with Nexora's FastAPI-powered engine.</p>
          </div>
          <button 
            type="button"
            onClick={() => window.open(`${UI_URL}/signup`, "_self")}
            style={{ pointerEvents: 'auto', cursor: 'pointer' }}
            className="group relative px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:bg-indigo-500 active:scale-95 transition-all"
          >
            Switch to Nexora Today
          </button>
        </div>
      </div>
    </section>
  );
}