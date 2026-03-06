/* Path: src/components/SystemUniverse.jsx */
import { motion } from "framer-motion";

const dataPackets = [...Array(12)];

export default function SystemUniverse() {
  return (
    <section className="relative py-40 bg-[#050505] overflow-hidden">
      
      {/* Background Grid - Minimalist & Premium */}
      <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]">
        <div className="absolute inset-0 border-t border-white/[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-400 text-[10px] font-mono tracking-[0.2em] uppercase mb-8"
        >
          System_Status: Fully_Autonomous
        </motion.div>

        <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8">
          The brain that <br /> <span className="text-gray-500 font-light italic">never sleeps.</span>
        </h2>

        {/* Visual: Data Packets moving towards the center */}
        <div className="relative h-[400px] w-full flex items-center justify-center">
          
          {/* Central AI Core */}
          <div className="relative z-20 w-32 h-32 bg-indigo-600/10 rounded-full border border-indigo-500/30 flex items-center justify-center backdrop-blur-3xl shadow-[0_0_100px_rgba(79,70,229,0.2)]">
            <div className="w-16 h-16 bg-indigo-500 rounded-full blur-2xl animate-pulse absolute" />
            <div className="text-3xl">🧠</div>
          </div>

          {/* Floating Action Cards */}
          <ActionCard label="FastAPI Execution" x={-280} y={-100} delay={0} />
          <ActionCard label="OpenAI Reasoning" x={280} y={-60} delay={0.5} />
          <ActionCard label="WhatsApp Webhook" x={-200} y={120} delay={1} />
          <ActionCard label="Vector Memory" x={200} y={150} delay={1.5} />

          {/* Animated Particles (Data Flow) */}
          {dataPackets.map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-indigo-400 rounded-full"
              initial={{ 
                x: Math.random() * 800 - 400, 
                y: Math.random() * 400 - 200, 
                opacity: 0 
              }}
              animate={{ 
                x: 0, 
                y: 0, 
                opacity: [0, 1, 0] 
              }}
              transition={{ 
                duration: 3 + Math.random() * 2, 
                repeat: Infinity, 
                delay: Math.random() * 5 
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ActionCard({ label, x, y, delay }) {
  return (
    <motion.div
      initial={{ x, y, opacity: 0 }}
      whileInView={{ opacity: 1 }}
      animate={{ y: [y, y - 10, y] }}
      transition={{ duration: 4, repeat: Infinity, delay }}
      className="absolute px-4 py-2 bg-white/[0.02] border border-white/10 rounded-xl backdrop-blur-md hidden md:flex items-center gap-3"
    >
      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,1)]" />
      <span className="text-[11px] font-mono text-gray-400 tracking-wider uppercase">{label}</span>
    </motion.div>
  );
}