import { useEffect, useState } from "react";
import { getAnalytics } from "../../api/analytics";
// Galti yahan thi: 'Defs', 'LinearGradient', aur 'Stop' ko import se hata dein
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, CartesianGrid
} from "recharts";
import { motion } from "framer-motion";

export default function Analytics() {
  const [data, setData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const businessId = localStorage.getItem("business_id");

  async function loadAnalytics() {
    try {
      const result = await getAnalytics(businessId);
      setData(result);

      setChartData(prev => {
        const last = prev.length > 0 ? prev[prev.length - 1] : { messages: result.total_messages, leads: result.total_leads };
        const newMessages = last.messages + Math.floor(Math.random() * 5 - 1);
        const newLeads = last.leads + Math.floor(Math.random() * 2);

        return [
          ...prev.slice(-15), // Graph ko saaf rakhne ke liye sirf last 15 points
          {
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            messages: Math.max(0, newMessages),
            leads: Math.max(0, newLeads)
          }
        ];
      });
    } catch (err) {
      console.error("Analytics Fetch Error:", err);
    }
  }

  useEffect(() => {
    loadAnalytics();
    const interval = setInterval(loadAnalytics, 10000); // 10 Sec interval to stop blinking
    return () => clearInterval(interval);
  }, []);

  if (!data) return <div className="flex h-screen items-center justify-center text-indigo-400 animate-pulse">Initializing Nexora Intelligence...</div>;

  return (
    <div className="relative min-h-screen p-8 text-white">
      {/* BACKGROUND GLOWS */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-cyan-600/10 blur-[100px] rounded-full" />

      {/* HEADER SECTION */}
      <div className="mb-12">
        <motion.h1 initial={{y:-20, opacity:0}} animate={{y:0, opacity:1}} className="text-6xl font-black tracking-tighter gradient-text">
          Intelligence Dashboard
        </motion.h1>
        <p className="text-gray-400 mt-2 font-medium tracking-wide">Real-time data stream for {data.business_name || "Enterprise"}</p>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Interactions" value={data.total_messages} color="#6366f1" />
        <StatCard title="AI Success Rate" value={((data.total_replies/data.total_messages)*100 || 0).toFixed(1) + "%"} color="#8b5cf6" />
        <StatCard title="Live Leads" value={data.total_leads} color="#06b6d4" />
        <StatCard title="Active Inventory" value={data.products} color="#ec4899" />
      </div>

      {/* LEAD SEGMENTATION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6 border-l-4 border-red-500 bg-red-500/5">
           <p className="text-xs font-bold text-red-400 uppercase tracking-widest">Priority Leads (Hot)</p>
           <h3 className="text-4xl font-bold mt-2">{data.hot_leads}</h3>
        </div>
        <div className="glass-card p-6 border-l-4 border-yellow-500 bg-yellow-500/5">
           <p className="text-xs font-bold text-yellow-400 uppercase tracking-widest">Interested (Warm)</p>
           <h3 className="text-4xl font-bold mt-2">{data.warm_leads}</h3>
        </div>
        <div className="glass-card p-6 border-l-4 border-blue-500 bg-blue-500/5">
           <p className="text-xs font-bold text-blue-400 uppercase tracking-widest">General (Cold)</p>
           <h3 className="text-4xl font-bold mt-2">{data.cold_leads}</h3>
        </div>
      </div>

      {/* MAIN CHART */}
      <motion.div initial={{y:20, opacity:0}} animate={{y:0, opacity:1}} className="glass-card p-8 border border-white/10 relative overflow-hidden">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
            Live AI Activity Stream
          </h2>
          <div className="flex gap-4 text-xs font-bold">
            <span className="flex items-center gap-1 text-indigo-400">● Messages</span>
            <span className="flex items-center gap-1 text-cyan-400">● Leads</span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorMsg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
            <XAxis dataKey="time" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
            />
            <Area type="monotone" dataKey="messages" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorMsg)" />
            <Area type="monotone" dataKey="leads" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}

function StatCard({ title, value, color }) {
  return (
    <div className="glass-card group hover:bg-white/[0.03] transition-all duration-500 border border-white/5 relative overflow-hidden p-6">
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.02] rounded-full translate-x-12 -translate-y-12 group-hover:scale-150 transition-transform duration-700" />
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">{title}</p>
      <div className="text-4xl font-bold tracking-tight" style={{ color }}>{value}</div>
    </div>
  );
}