/* Path: src/components/LogoMarquee.jsx */
import { motion } from "framer-motion";

const logos = ["FastAPI", "OpenAI", "WhatsApp", "PostgreSQL", "React", "Tailwind", "Python"];

export default function LogoMarquee() {
  return (
    <div className="py-10 border-y border-white/5 bg-black/50 overflow-hidden whitespace-nowrap relative">
      <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-black to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-black to-transparent z-10" />
      
      <motion.div 
        animate={{ x: [0, -1000] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="inline-block"
      >
        <div className="flex gap-20 items-center">
          {[...logos, ...logos].map((logo, i) => (
            <span key={i} className="text-gray-600 font-mono text-xl font-bold tracking-widest uppercase opacity-50 hover:opacity-100 transition-opacity cursor-default">
              {logo}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}