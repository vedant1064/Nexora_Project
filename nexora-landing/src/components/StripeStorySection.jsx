/* Path: src/components/StripeStorySection.jsx */
import { motion } from "framer-motion";

export default function StripeStorySection() {
  return (
    <section className="relative min-h-screen bg-[#050505] py-32 flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-indigo-500 font-mono text-[10px] uppercase tracking-[0.4em] mb-6 block">
            Our Vision
          </span>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-16 text-white">
            Engineering the future of <br /> 
            <span className="text-gray-500 font-light italic">WhatsApp Commerce.</span>
          </h2>
          
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[3rem] blur opacity-10"></div>
            
            <div className="relative bg-[#0a0a0a] border border-white/5 rounded-[2.8rem] p-12 md:p-20 shadow-2xl">
              <p className="text-2xl md:text-4xl font-medium text-gray-200 leading-[1.4] mb-12">
                "Nexora is designed to bridge the gap between AI reasoning and business execution. By integrating FastAPI with OpenAI, we're building an autonomous engine for WhatsApp automation."
              </p>
              
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-2xl shadow-lg border-4 border-black text-white font-bold">
                  VO
                </div>
                <div>
                  <div className="font-bold text-xl text-white">Vedant Ojha</div>
                  <div className="text-xs text-indigo-400 font-mono uppercase tracking-widest mt-1">Founder, Nexora Commerce AI</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}