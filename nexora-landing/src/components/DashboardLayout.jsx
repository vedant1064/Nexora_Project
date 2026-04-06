import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Zap, MessageSquare, Package, Settings, LogOut } from 'lucide-react';

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isReady, setIsReady] = useState(false);

  // 🛡️ AUTH CHECK: Bina token ke koi andar nahi aayega
  // DashboardLayout.jsx mein line 11 ke aas-paas replace karein
  useEffect(() => {
    const token = localStorage.getItem("token");
    const isPaid = localStorage.getItem("subscription_status") === "active"; 

    if (!token) {
      navigate("/login");
    } else if (!isPaid) {
      // Agar login hai par payment nahi ki, toh pricing section par bhejo
      navigate("/#pricing"); 
    } else {
      setIsReady(true);
    }
  }, [navigate]);

  const menuItems = [
    { name: 'Overview', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'AI Strategy', icon: <Zap size={20} />, path: '/dashboard/strategy' },
    { name: 'Conversations', icon: <MessageSquare size={20} />, path: '/dashboard/chats' },
    { name: 'Inventory', icon: <Package size={20} />, path: '/dashboard/inventory' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/dashboard/settings' },
  ];

  // Logout Function
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!isReady) return null; // Initializing screen ko bypass karne ke liye

  return (
    <div className="flex h-screen bg-[#050505] text-white font-sans overflow-hidden">
      
      {/* 🟢 SIDEBAR */}
      <aside className="w-64 border-r border-white/5 bg-[#0A0A0A] flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.4)]">
            <span className="text-xl font-bold italic text-white">N</span>
          </div>
          <span className="text-lg font-bold tracking-tight italic">Nexora AI</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {menuItems.map((item) => (
            <div
              key={item.name}
              onClick={() => {
                // Idhar magic ho raha hai:
                const pageKey = item.name.toLowerCase().replace(" ", ""); 
                setPage(pageKey === "overview" ? "dashboard" : pageKey); 
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 ${
                // Idhar active state check karne ke liye location ki jagah hum page state use karenge (Agle step mein batata hoon)
                location.pathname === item.path 
                ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20' 
                : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.icon}
              <span className="text-sm font-semibold">{item.name}</span>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-400 cursor-pointer transition-colors"
          >
            <LogOut size={20} />
            <span className="text-sm font-semibold">Logout</span>
          </div>
        </div>
      </aside>

      {/* 🔵 MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-16 border-b border-white/5 bg-[#0A0A0A]/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-xl font-bold tracking-tight italic">
            {menuItems.find(item => item.path === location.pathname)?.name || "Dashboard"}
          </h2>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-gray-500 font-medium tracking-tight">Welcome back,</p>
              <p className="text-sm font-bold tracking-tight">Vedant Ojha</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border border-white/10 shadow-lg cursor-pointer"></div>
          </div>
        </header>

        <section className="p-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={location.pathname} // Page change hone par animation trigger hoga
          >
            {children}
          </motion.div>
        </section>
      </main>
    </div>
  );
}