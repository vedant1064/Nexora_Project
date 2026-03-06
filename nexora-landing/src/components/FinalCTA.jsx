/* Path: src/components/FinalCTA.jsx */
import { motion } from "framer-motion";

export default function FinalCTA() {
  const UI_URL = "http://localhost:5174";

  const goToSignup = () => {
    window.location.href = `${UI_URL}/signup`;
  };

  return (
    <section className="py-40 bg-indigo-600 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 800 800">
          <circle cx="400" cy="400" r="300" stroke="white" strokeWidth="2" fill="none" strokeDasharray="20 20" />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto text-center px-6 relative z-10">
        <motion.h2 
          whileInView={{ y: [20, 0], opacity: [0, 1] }}
          className="text-5xl md:text-7xl font-bold tracking-tighter mb-8"
        >
          Ready to automate <br /> your creative chaos?
        </motion.h2>
        
        <p className="text-indigo-100 text-xl mb-12 max-w-xl mx-auto font-medium">
          Join 500+ developers building the future of WhatsApp automation.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <button 
            onClick={goToSignup}
            className="bg-black text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-gray-900 transition-all shadow-2xl active:scale-95"
          >
            Create Free Account
          </button>
          <button 
            onClick={() => window.location.href = "mailto:support@nexora.ai"}
            className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all"
          >
            Contact Sales
          </button>
        </div>
      </div>
    </section>
  );
}