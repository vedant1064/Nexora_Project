/* Path: src/components/PhoneMockup.jsx */
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const CHAT_DATA = [
  { id: 1, text: "Hi, Nexora! My orders are late.", sender: "user" },
  { id: 2, text: "Checking your status... ⚡", sender: "ai" },
  { id: 3, text: "Found it! Order #992 is in transit. Want the tracking link?", sender: "ai" },
  { id: 4, text: "Yes, please!", sender: "user" },
  { id: 5, text: "Here it is: nexora.ai/track/992. Anything else?", sender: "ai" },
];

export default function PhoneMockup() {
  const [messages, setMessages] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (index < CHAT_DATA.length) {
        setMessages((prev) => [...prev, CHAT_DATA[index]]);
        setIndex((prev) => prev + 1);
      } else {
        // Loop restart after delay
        setTimeout(() => {
          setMessages([]);
          setIndex(0);
        }, 3000);
      }
    }, 1800);
    return () => clearTimeout(timeout);
  }, [index]);

  return (
    <div className="relative mx-auto w-[280px] h-[580px] bg-[#050505] rounded-[3rem] border-[8px] border-white/10 shadow-2xl overflow-hidden">
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-white/10 rounded-b-2xl z-20" />

      {/* Chat Screen */}
      <div className="h-full flex flex-col p-4 pt-10">
        <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === "user"
                    ? "ml-auto bg-white/10 text-white rounded-br-none"
                    : "mr-auto bg-indigo-600 text-white rounded-bl-none shadow-[0_0_15px_rgba(79,70,229,0.4)]"
                }`}
              >
                {msg.text}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Fake Input Bar */}
        <div className="mt-4 p-3 bg-white/5 border border-white/10 rounded-full flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse" />
          <div className="text-[10px] text-gray-500">Nexora is thinking...</div>
        </div>
      </div>

      {/* Reflection Glow */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/5 to-transparent" />
    </div>
  );
}