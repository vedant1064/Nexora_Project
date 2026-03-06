/* Path: src/components/NotionStyleBlocks.jsx */
import { motion } from "framer-motion";

const features = [
  {
    title: "Think, then Execute",
    desc: "Nexora doesn't just chat. It understands intent and triggers your FastAPI workflows instantly.",
    sketch: (
      <svg viewBox="0 0 200 120" className="w-full h-full stroke-indigo-400 fill-none stroke-[1.5]">
        {/* Animated Hand-drawn Style Path */}
        <motion.path 
          d="M20,60 Q60,20 100,60 T180,60" 
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        <motion.rect x="70" y="30" width="60" height="60" rx="10" 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        />
      </svg>
    )
  },
  {
    title: "WhatsApp Orchestration",
    desc: "Scale your business with an AI agent that handles queries, payments, and leads on autopilot.",
    sketch: (
      <svg viewBox="0 0 200 120" className="w-full h-full stroke-cyan-400 fill-none stroke-[1.5]">
        <motion.circle cx="100" cy="60" r="40" 
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          transition={{ duration: 2 }}
        />
        <motion.path d="M80,60 L120,60 M100,40 L100,80" 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        />
      </svg>
    )
  }
];

export default function NotionStyleBlocks() {
  return (
    <section className="py-32 bg-[#050505]">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="mb-24 text-center lg:text-left">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Built with <span className="text-gray-500">Logic & Art.</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl">
            Nexora replaces bulky dashboards with elegant automation blocks.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 gap-16">
          {features.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group"
            >
              {/* The "Drawing" Canvas Area */}
              <div className="aspect-[16/10] mb-8 bg-white/5 border border-white/10 rounded-3xl overflow-hidden flex items-center justify-center p-12 transition-all group-hover:border-white/20">
                <div className="w-full max-w-[200px]">
                  {item.sketch}
                </div>
              </div>

              {/* Text Content */}
              <h3 className="text-2xl font-semibold mb-3 tracking-tight">{item.title}</h3>
              <p className="text-gray-400 leading-relaxed font-light">{item.desc}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}