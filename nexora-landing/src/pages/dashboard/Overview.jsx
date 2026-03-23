import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Users, MessageCircle, ArrowUpRight } from 'lucide-react';

export default function Overview() {
  // Mock data - Isse baad mein backend (FastAPI) se connect karenge
  const stats = [
    { name: 'Total Revenue Saved', value: '₹42,850', icon: <ShoppingCart className="text-green-400" />, growth: '+12.5%' },
    { name: 'AI Conversations', value: '1,284', icon: <MessageCircle className="text-indigo-400" />, growth: '+18.2%' },
    { name: 'Recovered Leads', value: '156', icon: <Users className="text-purple-400" />, growth: '+5.4%' },
  ];

  return (
    <div className="space-y-8">
      {/* 👋 Header Section */}
      <div>
        <h1 className="text-3xl font-bold italic mb-2">Nexora Intelligence Center</h1>
        <p className="text-gray-500 font-medium">Real-time performance of your AI autonomous workflows.</p>
      </div>

      {/* 📊 Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 bg-[#0A0A0A] border border-white/5 rounded-2xl shadow-xl hover:border-indigo-500/20 transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white/5 rounded-xl">{item.icon}</div>
              <span className="flex items-center text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                {item.growth} <ArrowUpRight size={14} />
              </span>
            </div>
            <p className="text-gray-500 text-sm font-medium">{item.name}</p>
            <h3 className="text-2xl font-bold mt-1 tracking-tight">{item.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* ⚡ LIVE ACTIVITY FEED */}
      <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 shadow-xl">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
          <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
          Live AI Activity
        </h3>
        
        <div className="space-y-6">
          {/* Activity 1: Cross-Platform Memory */}
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs font-bold font-mono">01</div>
            <div>
              <p className="text-sm font-semibold">Cross-Platform Memory Triggered</p>
              <p className="text-xs text-gray-500 mt-1">User <span className="text-white">Vedant</span> added "Blue Sneakers" to cart on Website. AI sent a WhatsApp follow-up with 5% discount.</p>
              <p className="text-[10px] text-indigo-500 mt-2 font-bold uppercase tracking-widest">Success • 2m ago</p>
            </div>
          </div>

          {/* Activity 2: Shadow Mode */}
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-xs font-bold font-mono">02</div>
            <div>
              <p className="text-sm font-semibold">Shadow Mode: New Pattern Learned</p>
              <p className="text-xs text-gray-500 mt-1">AI learned how you handle "Bulk Order" queries from a live chat. Knowledge base updated.</p>
              <p className="text-[10px] text-purple-500 mt-2 font-bold uppercase tracking-widest">Learned • 15m ago</p>
            </div>
          </div>

          {/* Activity 3: Visual Matcher */}
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xs font-bold font-mono">03</div>
            <div>
              <p className="text-sm font-semibold">Visual Matcher: Product Identified</p>
              <p className="text-xs text-gray-500 mt-1">User sent a photo on WhatsApp. AI identified <span className="text-white">Model-X Part</span> from Website Gallery.</p>
              <p className="text-[10px] text-green-500 mt-2 font-bold uppercase tracking-widest">Matched • 1h ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}