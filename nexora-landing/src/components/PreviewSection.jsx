/* Path: src/components/PreviewSection.jsx */
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";
import PhoneMockup from "./PhoneMockup";

export default function PreviewSection() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring effect for the spotlight
  const springConfig = { damping: 25, stiffness: 150 };
  const lightX = useSpring(mouseX, springConfig);
  const lightY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      mouseX.set(clientX);
      mouseY.set(clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section className="relative py-40 bg-[#050505] overflow-hidden flex flex-col items-center">
      
      {/* STRIPE STYLE SPOTLIGHT */}
      <motion.div 
        style={{ 
          left: lightX, 
          top: lightY,
          transform: "translate(-50%, -50%)"
        }}
        className="fixed w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none z-0"
      />

      <div className="max-w-4xl mx-auto text-center mb-20 relative z-10 px-6">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">
          Experience the <span className="text-gray-500">Interface.</span>
        </h2>
        <p className="text-gray-400 text-lg font-light">
          No complex dashboards. Just a simple, powerful automation engine that lives where your customers are.
        </p>
      </div>

      {/* CENTER STAGE: THE PHONE MOCKUP */}
      <div className="relative z-10">
        {/* Background Decorative Rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/5 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-white/5 rounded-full opacity-50" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <PhoneMockup />
        </motion.div>
      </div>

      {/* Floating Meta-Data (Specify Style) */}
      <div className="absolute bottom-20 left-10 hidden xl:block">
        <div className="font-mono text-[10px] text-gray-600 space-y-1">
          <div>LATENCY: 140ms</div>
          <div>ENCRYPTION: AES-256</div>
          <div>MODEL: NEXORA_CORE_v2</div>
        </div>
      </div>
    </section>
  );
}