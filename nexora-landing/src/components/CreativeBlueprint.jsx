/* Path: src/components/CreativeBlueprint.jsx */
import { motion } from "framer-motion";

export default function CreativeBlueprint() {
  return (
    <section className="relative py-60 bg-[#f9f9f8] overflow-hidden">
      {/* Background Decorative Grid (Sketchy) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, backgroundSize: '30px 30px' }} />

      <div className="max-w-7xl mx-auto px-6 relative">
        
        {/* Floating Creative Header */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-full text-center z-10">
          <motion.div
            initial={{ rotate: -2, scale: 0.9 }}
            whileInView={{ rotate: 0, scale: 1 }}
            className="inline-block bg-yellow-100 border-2 border-gray-900 px-6 py-2 shadow-[4px_4px_0px_#000] rotate-[-1deg]"
          >
            <span className="font-mono text-xs font-bold uppercase tracking-widest">Project: Infinite_Automation_v3</span>
          </motion.div>
        </div>

        {/* THE INFINITE CANVAS */}
        <div className="relative h-[700px] w-full border-4 border-gray-900 bg-white rounded-[3rem] shadow-[30px_30px_0px_#efefe9] overflow-hidden">
          
          {/* SVG Connection Layer (Advanced Curves) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <motion.path
              d="M 100 350 C 200 100, 400 600, 700 350"
              stroke="#6366f1"
              strokeWidth="2"
              fill="none"
              strokeDasharray="12 8"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.path
              d="M 200 100 Q 500 50, 800 200"
              stroke="#a855f7"
              strokeWidth="2"
              fill="none"
              opacity="0.3"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            />
          </svg>

          {/* ADVANCED CREATIVE NODES */}
          
          {/* 1. The "Logic" Sticky Note */}
          <BlueprintElement x="10%" y="20%" rotate={-5}>
            <div className="bg-blue-50 border-2 border-blue-200 p-6 rounded-xl shadow-sm max-w-[200px]">
              <div className="text-2xl mb-2">📋</div>
              <h4 className="font-bold text-sm mb-1">Custom Logic</h4>
              <p className="text-[10px] text-gray-500 leading-tight font-medium">FastAPI handles the heavy lifting while you focus on creativity.</p>
            </div>
          </BlueprintElement>

          {/* 2. Central Neural Hub (The Heart) */}
          <BlueprintElement x="45%" y="40%" rotate={0}>
            <motion.div 
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="w-48 h-48 bg-gray-900 rounded-full flex flex-col items-center justify-center text-white shadow-2xl relative"
            >
              <div className="text-6xl mb-2">🧠</div>
              <div className="text-[10px] font-mono tracking-tighter opacity-50 uppercase">Neural_Core</div>
              {/* Spinning Ring */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-2 border-dashed border-indigo-500/50 rounded-full m-2"
              />
            </motion.div>
          </BlueprintElement>

          {/* 3. The "Creative" Polaroids */}
          <BlueprintElement x="75%" y="15%" rotate={8}>
            <div className="bg-white p-3 border-2 border-gray-100 shadow-xl rotate-6">
              <div className="w-32 h-32 bg-purple-100 rounded mb-2 overflow-hidden flex items-center justify-center text-4xl">🎨</div>
              <div className="text-[9px] font-bold font-mono uppercase text-gray-400">Design_Token.png</div>
            </div>
          </BlueprintElement>

          {/* 4. The "Execution" Card */}
          <BlueprintElement x="70%" y="65%" rotate={-3}>
            <div className="bg-green-50 border-2 border-green-200 p-6 rounded-[2rem] shadow-sm flex items-center gap-4">
              <div className="text-3xl">🚀</div>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-green-700">Live Deploy</div>
                <div className="text-[10px] text-green-600/70 font-mono">Status: 200 OK</div>
              </div>
            </div>
          </BlueprintElement>

          {/* Floating 'Doodles' (The Advanced Creativity) */}
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity }} className="absolute top-10 right-1/4 text-4xl opacity-10">⚙️</motion.div>
          <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute bottom-1/4 left-1/4 text-4xl opacity-10">✨</motion.div>

        </div>
      </div>
    </section>
  );
}

function BlueprintElement({ children, x, y, rotate }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="absolute z-20 cursor-grab active:cursor-grabbing"
      style={{ left: x, top: y, rotate: `${rotate}deg` }}
    >
      {children}
    </motion.div>
  );
}