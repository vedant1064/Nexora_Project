/* Path: src/components/NeuralSketchpad.jsx */
import { motion } from "framer-motion";

export default function NeuralSketchpad() {
  return (
    <section className="relative py-60 bg-[#f6f6f3] overflow-hidden border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
        
        {/* Left: Hand-Drawn Narrative */}
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, rotate: -3 }}
            whileInView={{ opacity: 1, rotate: 0 }}
            className="inline-block bg-indigo-600 text-white px-4 py-1 mb-8 font-mono text-[10px] uppercase tracking-[0.3em] shadow-[8px_8px_0px_#000]"
          >
            Phase_03: The_Human_Interface
          </motion.div>
          <h2 className="text-6xl font-bold tracking-tighter text-gray-900 mb-8">
            Where logic <br /> <span className="text-indigo-600 font-serif italic">meets ink.</span>
          </h2>
          <p className="text-xl text-gray-500 font-medium leading-relaxed">
            Nexora isn't just code. It's a canvas where your business logic is sketched into reality through FastAPI and OpenAI.
          </p>
        </div>

        {/* Right: The Advanced Sketch Interaction */}
        <div className="relative h-[500px] flex items-center justify-center">
          
          {/* Animated Pencil Path (The Connection) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <motion.path 
               d="M 50 400 Q 250 50 450 400"
               stroke="#6366f1" strokeWidth="4" fill="none"
               strokeDasharray="15 15"
               initial={{ pathLength: 0 }}
               whileInView={{ pathLength: 1 }}
               transition={{ duration: 4, repeat: Infinity }}
            />
          </svg>

          {/* The Notion Character (Floating) */}
          <motion.div 
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-20 w-64 h-64 bg-white border-4 border-black rounded-[3rem] shadow-[20px_20px_0px_rgba(0,0,0,0.05)] flex items-center justify-center overflow-hidden"
            style={{ borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" }}
          >
            {/* Doodle Face inside Node */}
            <div className="flex flex-col items-center">
                <div className="flex gap-6 mb-2">
                    <motion.div animate={{ scaleY: [1, 0.1, 1] }} transition={{ repeat: Infinity, duration: 3 }} className="w-2 h-2 bg-black rounded-full" />
                    <motion.div animate={{ scaleY: [1, 0.1, 1] }} transition={{ repeat: Infinity, duration: 3 }} className="w-2 h-2 bg-black rounded-full" />
                </div>
                <div className="w-10 h-4 border-b-4 border-black rounded-full" />
            </div>
            
            <div className="absolute bottom-4 font-mono text-[10px] font-black text-gray-300">NEXORA_ENTITY</div>
          </motion.div>

          {/* Floating 'Logic' Sticky Notes */}
          <StickyNote icon="💡" text="Intent Engine" x="-30%" y="10%" delay={0.2} />
          <StickyNote icon="🐍" text="FastAPI Logic" x="40%" y="-20%" delay={0.4} />
          <StickyNote icon="🤖" text="LLM Reasoning" x="30%" y="40%" delay={0.6} />

        </div>
      </div>
    </section>
  );
}

function StickyNote({ icon, text, x, y, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: "spring" }}
      className="absolute bg-yellow-100 border-2 border-black p-4 shadow-[4px_4px_0px_#000] rotate-[-5deg] z-30"
      style={{ left: x, top: y }}
    >
      <div className="flex items-center gap-3">
        <span className="text-xl">{icon}</span>
        <span className="text-[10px] font-black font-mono tracking-tighter text-gray-900 uppercase">{text}</span>
      </div>
    </motion.div>
  );
}
