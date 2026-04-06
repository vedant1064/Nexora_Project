/* Path: nexora-ui/src/pages/dashboard/Analytics.jsx */
import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { motion } from "framer-motion";

export default function Analytics() {
  const [data, setData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const businessId = localStorage.getItem("business_id");
  const token = localStorage.getItem("token");
  const [error, setError] = useState(null);

  async function loadAnalytics() {
    try {
      const res = await fetch(`http://127.0.0.1:8000/analytics/${businessId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const result = await res.json();
      setData(result);

      setChartData(prev => {
        const newPoint = {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          messages: result.total_messages || 0,
          leads: result.total_leads || 0
        };
        return [...prev.slice(-14), newPoint];
      });
    } catch (err) {
      console.error("Analytics Fetch Error:", err);
      setError("Failed to sync with Nexora Intelligence.");
    }
  }

  useEffect(() => {
    loadAnalytics();
    const interval = setInterval(loadAnalytics, 10000);
    return () => clearInterval(interval);
  }, []);

  // 🔴 1. ERROR STATE
  if (error) return (
    <div className="flex h-screen items-center justify-center text-red-400 bg-[#050505]">
      <p className="font-mono text-xs uppercase tracking-widest">{error}</p>
    </div>
  );

  // 🟡 2. LOADING STATE (Ye missing tha, isliye crash ho raha tha)
  if (!data) return (
    <div className="flex h-screen items-center justify-center text-indigo-400 bg-[#050505]">
       <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="relative min-h-screen p-2 text-white overflow-hidden">
      <div className="mb-10">
        <motion.h1 initial={{y:-20, opacity:0}} animate={{y:0, opacity:1}} className="text-5xl font-black tracking-tighter italic text-white/90">
          Intelligence Dashboard
        </motion.h1>
        <p className="text-gray-500 mt-2 font-medium tracking-wide flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          {/* 🟢 Optional Chaining use ki hai yahan */}
          Real-time data stream for {data?.business_name || "Enterprise"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Interactions" value={data?.total_messages || 0} color="#6366f1" />
        <StatCard title="AI Success Rate" value={data?.total_messages > 0 ? ((data.total_replies / data.total_messages) * 100).toFixed(1) + "%" : "0%"} color="#8b5cf6" />
        <StatCard title="Live Leads" value={data?.total_leads || 0} color="#06b6d4" />
        <StatCard title="Active Inventory" value={data?.products || 0} color="#ec4899" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <LeadBox label="Priority Leads (Hot)" value={data?.hot_leads || 0} borderColor="border-red-500" bg="bg-red-500/5" text="text-red-400" />
        <LeadBox label="Interested (Warm)" value={data?.warm_leads || 0} borderColor="border-yellow-500" bg="bg-yellow-500/5" text="text-yellow-400" />
        <LeadBox label="General (Cold)" value={data?.cold_leads || 0} borderColor="border-blue-500" bg="bg-blue-500/5" text="text-blue-400" />
      </div>

      <motion.div initial={{y:20, opacity:0}} animate={{y:0, opacity:1}} className="bg-[#0A0A0A] p-8 border border-white/5 rounded-[32px] shadow-2xl relative overflow-hidden">
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
            <XAxis dataKey="time" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ backgroundColor: '#050505', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', fontSize: '12px' }} />
            <Area type="monotone" dataKey="messages" stroke="#6366f1" strokeWidth={4} fillOpacity={0.1} fill="#6366f1" />
            <Area type="monotone" dataKey="leads" stroke="#06b6d4" strokeWidth={3} fillOpacity={0.1} fill="#06b6d4" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}

// Reusable Components
function StatCard({ title, value, color }) {
  return (
    <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-[24px] group relative overflow-hidden">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 mb-2">{title}</p>
      <div className="text-4xl font-bold tracking-tighter italic" style={{ color }}>{value}</div>
    </div>
  );
}

function LeadBox({ label, value, borderColor, bg, text }) {
  return (
    <div className={`${bg} border-l-4 ${borderColor} p-6 rounded-2xl`}>
       <p className={`text-[10px] font-black uppercase tracking-widest ${text}`}>{label}</p>
       <h3 className="text-4xl font-bold mt-2 text-white/90 italic">{value}</h3>
    </div>
  );
}