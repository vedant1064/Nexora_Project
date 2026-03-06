/* Path: src/components/PipelineSection.jsx */
import { motion } from "framer-motion";

const pipelineSteps = [
  { id: "ingest", label: "WhatsApp Ingest", color: "bg-green-500/20", border: "border-green-500/40", x: -200, y: -80 },
  { id: "analyze", label: "Intent Classifier", color: "bg-purple-500/20", border: "border-purple-500/40", x: 0, y: -150 },
  { id: "execute", label: "FastAPI Executor", color: "bg-blue-500/20", border: "border-blue-500/40", x: 200, y: -80 },
  { id: "output", label: "AI Response", color: "bg-indigo-500/20", border: "border-indigo-500/40", x: 0, y: 50 }
];

export default function PipelineSection() {
  return (
    <section className="relative py-40 bg-[#050505] overflow-hidden">
      
      {/* Background Section Title */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none">
        <h2 className="text-[20vw] font-black uppercase">Engine</h2>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="text-center mb-32">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">
            The <span className="text-indigo-500">Orchestration</span> Layer
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Nexora breaks down every message into tokens and executes them through a high-performance neural pipeline.
          </p>
        </div>

        {/* The Pipeline Canvas */}
        <div className="relative h-[500px] flex items-center justify-center">
          
          {/* Animated SVG Connections (Specify Style) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
            <defs>
              <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
            {/* Drawing lines between steps */}
            <motion.path 
              d="M 400,250 L 500,150 L 700,250 L 500,350 Z" 
              stroke="url(#line-grad)" 
              strokeWidth="1" 
              fill="none"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </svg>

          {/* Pipeline Modules (Exploded Tokens) */}
          {pipelineSteps.map((step, i) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.2 }}
              style={{ x: step.x, y: step.y }}
              className={`absolute px-6 py-4 rounded-2xl border ${step.border} ${step.color} backdrop-blur-md shadow-2xl flex flex-col items-center gap-2`}
            >
              <div className="w-10 h-1 bg-white/20 rounded-full mb-2" />
              <span className="text-sm font-mono tracking-widest text-white uppercase">{step.label}</span>
              <div className="text-[10px] text-gray-400 font-mono">STATUS: OPERATIONAL</div>
            </motion.div>
          ))}

          {/* Central AI Brain Node */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-32 h-32 border border-white/5 rounded-full flex items-center justify-center"
          >
             <div className="w-20 h-20 bg-indigo-500/10 rounded-full blur-xl absolute" />
             <div className="text-2xl">⚡</div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}