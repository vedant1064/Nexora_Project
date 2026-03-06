/* Path: src/components/FeatureGrid.jsx */
import { motion } from "framer-motion";

export default function FeatureGrid() {
  return (
    <section className="py-20 bg-[#050505] px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Large Card */}
        <div className="md:col-span-2 bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-10 relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-3xl font-bold mb-4">Neural Command Center</h3>
            <p className="text-gray-400 max-w-sm">Monitor every FastAPI trigger and OpenAI reasoning step in real-time from one unified dashboard.</p>
          </div>
          {/* Subtle Background Art */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-500/10 blur-[80px] group-hover:bg-indigo-500/20 transition-all" />
        </div>

        {/* Small Card 1 */}
        <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 flex flex-col justify-between">
          <div className="text-4xl">⚡</div>
          <div>
            <h4 className="text-xl font-bold mb-2">Ultra-Low Latency</h4>
            <p className="text-sm text-gray-500">Responses delivered in under 200ms.</p>
          </div>
        </div>

        {/* Small Card 2 */}
        <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 flex flex-col justify-between">
          <div className="text-4xl">🔒</div>
          <div>
            <h4 className="text-xl font-bold mb-2">Secure Vault</h4>
            <p className="text-sm text-gray-500">Enterprise-grade encryption for all WhatsApp data.</p>
          </div>
        </div>

        {/* Small Card 3 */}
        <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 flex flex-col justify-between">
          <div className="text-4xl">🧠</div>
          <div>
            <h4 className="text-xl font-bold mb-2">Vector Memory</h4>
            <p className="text-sm text-gray-500">Nexora remembers past contexts for smarter replies.</p>
          </div>
        </div>

        {/* Medium-Wide Card */}
        <div className="md:col-span-2 bg-gradient-to-r from-indigo-900/20 to-transparent border border-white/10 rounded-[2.5rem] p-10">
           <h3 className="text-2xl font-bold mb-4 font-mono uppercase tracking-widest text-indigo-400">System_Uptime: 99.9%</h3>
           <div className="flex gap-2">
              {[...Array(12)].map((_, i) => (
                <motion.div 
                  key={i} 
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
                  className="h-8 w-1.5 bg-indigo-500 rounded-full" 
                />
              ))}
           </div>
        </div>

      </div>
    </section>
  );
}