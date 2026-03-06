/* Path: nexora-ui/src/pages/LiveChat.jsx */
import { motion } from "framer-motion";

export default function LiveChat({ chatMessages, chatInput, setChatInput, sendChatMessage, chatLoading, chatEndRef }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto h-[calc(100vh-160px)] flex flex-col">
      <h2 className="text-3xl font-bold mb-6">Nexora Live AI</h2>
      
      {/* 🟢 Yahan 'no-scrollbar' add kiya aur extra empty div hata diya */}
      <div className="glass-card flex-1 overflow-y-auto mb-4 space-y-4 p-6 custom-scrollbar no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        
        {chatMessages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`px-4 py-3 rounded-[1.5rem] max-w-[88%] shadow-lg ${
                  msg.role === "user" ? "bg-indigo-600 text-white" : "bg-white/10 text-gray-200 border border-white/5 p-5"
                }`}>
              <div className="whitespace-pre-wrap text-sm leading-relaxed font-sans">
                  {msg.text || msg.content || "No message content"}
              </div>
              <div className="text-[10px] opacity-50 mt-1">{msg.time}</div>
            </div>
          </div>
        ))}

        {/* 🚀 ASLI JAGAH: Map khatam hone ke thik baad */}
        <div ref={chatEndRef} /> 

        {chatLoading && (
          <div className="flex gap-2 items-center text-indigo-400 font-mono text-xs">
            <span className="animate-bounce">●</span>
            <span className="animate-bounce delay-75">●</span>
            <span className="animate-bounce delay-150">●</span>
            AI is thinking...
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <input 
          value={chatInput} 
          onChange={(e) => setChatInput(e.target.value)} 
          onKeyDown={(e) => e.key === "Enter" && sendChatMessage()} 
          className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-indigo-500 focus:bg-white/10 transition-all" 
          placeholder="Type a message to test AI response..." 
        />
        <button onClick={sendChatMessage} className="bg-indigo-600 hover:bg-indigo-700 px-8 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-500/20">
          Send
        </button>
      </div>
    </motion.div>
  );
}