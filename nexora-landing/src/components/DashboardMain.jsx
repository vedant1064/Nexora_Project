/* Path: src/components/DashboardMain.jsx */
import { motion } from "framer-motion";

export default function DashboardMain() {
  const stats = [
    { label: "Total Messages", value: "1,284", change: "+12%", icon: "💬" },
    { label: "AI Tokens Used", value: "45.2k", change: "+5%", icon: "🧠" },
    { label: "FastAPI Triggers", value: "892", change: "+18%", icon: "⚡" },
    { label: "Success Rate", value: "99.2%", change: "0%", icon: "✅" },
  ];

  return (
    <div className="p-8 bg-[#f6f6f3] min-h-screen font-sans text-black">
      {/* Header Area */}
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tighter">Console_v2</h1>
          <p className="text-gray-400 font-mono text-[10px] uppercase tracking-widest mt-1">Project: Nexora Commerce AI // Active</p>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-2 border-2 border-black font-bold text-xs rounded-xl shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all bg-white">
            Export Logs
          </button>
          <button className="px-6 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-[4px_4px_0px_#000] active:scale-95">
            + New Automation
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 bg-white border-2 border-black rounded-3xl shadow-[8px_8px_0px_#000] group cursor-default"
          >
            <div className="text-2xl mb-4">{stat.icon}</div>
            <div className="text-xs font-black text-gray-400 uppercase tracking-widest">{stat.label}</div>
            <div className="flex items-end gap-2">
              <div className="text-3xl font-black">{stat.value}</div>
              <div className="text-[10px] font-bold text-green-600 mb-1">{stat.change}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Grid: Live Feed & Knowledge Base */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Live WhatsApp Log Preview */}
        <div className="lg:col-span-2 bg-white border-2 border-black rounded-[2.5rem] p-8 shadow-[12px_12px_0px_#000] relative overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-lg uppercase tracking-tighter">Live Execution Stream</h3>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-mono font-bold text-gray-400 uppercase">System_Live</span>
            </div>
          </div>
          
          <div className="space-y-4 font-mono text-[11px]">
            <LogEntry time="12:40:02" type="INPUT" msg="User: 'Where is my order #402?'" />
            <LogEntry time="12:40:03" type="AI" msg="Reasoning: Intent=Order_Tracking, Extraction=402" color="text-indigo-600" />
            <LogEntry time="12:40:04" type="API" msg="FastAPI: Triggered GET /orders/402" color="text-orange-500" />
            <LogEntry time="12:40:05" type="SUCCESS" msg="Bot: 'Your order is currently in Jaipur...'" color="text-green-600" />
          </div>
        </div>

        {/* AI Control Card */}
        <div className="bg-indigo-600 text-white border-2 border-black rounded-[2.5rem] p-8 shadow-[12px_12px_0px_#000]">
          <h3 className="font-black text-lg uppercase tracking-tighter mb-6">OpenAI Configuration</h3>
          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-bold opacity-60 uppercase block mb-2">Current Model</label>
              <div className="p-3 bg-white/10 rounded-xl font-mono text-xs border border-white/20">GPT-4o-mini</div>
            </div>
            <div>
              <label className="text-[10px] font-bold opacity-60 uppercase block mb-2">System Prompt</label>
              <div className="p-3 bg-white/10 rounded-xl font-mono text-[10px] h-32 overflow-y-auto border border-white/20 leading-relaxed">
                You are Nexora AI, a helpful commerce assistant for Vedant's business. You handle orders using FastAPI hooks...
              </div>
            </div>
            <button className="w-full py-3 bg-white text-indigo-600 font-black rounded-xl text-xs uppercase tracking-widest shadow-[4px_4px_0px_#000] active:translate-y-1 active:shadow-none transition-all">
              Update Brain
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

function LogEntry({ time, type, msg, color = "text-gray-900" }) {
  return (
    <div className="flex gap-4 border-b border-gray-50 pb-2">
      <span className="text-gray-300">{time}</span>
      <span className={`font-black min-w-[60px] ${color}`}>[{type}]</span>
      <span className="text-gray-600">{msg}</span>
    </div>
  );
}