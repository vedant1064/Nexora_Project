import React, { useState } from "react";
import { LayoutDashboard, Users, Package, MessageSquare, BarChart3, CreditCard, Settings, LogOut } from "lucide-react";

// Naye paths ke mutabiq components import karein
import Analytics from "../pages/dashboard/Analytics.jsx";
import Billing from "../pages/dashboard/Billing.jsx";
import Leads from "../pages/dashboard/Leads.jsx";
import Products from "../pages/dashboard/Products.jsx";
import LiveChat from "../pages/dashboard/LiveChat.jsx";

export default function DashboardMain() {
  const [activeTab, setActiveTab] = useState("Analytics");

  // Render logic for active page
  const renderPage = () => {
    switch(activeTab) {
      case "Analytics": return <Analytics />;
      case "Leads": return <Leads />;
      case "Products": return <Products />;
      case "LiveChat": return <LiveChat />;
      case "Billing": return <Billing />;
      default: return <Analytics />;
    }
  };

  return (
    <div className="flex h-screen bg-black overflow-hidden font-sans">
      {/* --- SIDEBAR --- */}
      <aside className="w-64 flex flex-col bg-gray-900 border-r border-white/10">
        {/* Fixed Top: Logo */}
        <div className="p-6 shrink-0">
          <h2 className="text-xl font-bold text-white tracking-tighter">NEXORA AI</h2>
        </div>

        {/* Scrollable Middle: Nav Links */}
        <nav className="flex-1 overflow-y-auto no-scrollbar px-4 space-y-2">
          <NavItem icon={BarChart3} label="Analytics" active={activeTab === "Analytics"} onClick={() => setActiveTab("Analytics")} />
          <NavItem icon={Users} label="Leads" active={activeTab === "Leads"} onClick={() => setActiveTab("Leads")} />
          <NavItem icon={Package} label="Products" active={activeTab === "Products"} onClick={() => setActiveTab("Products")} />
          <NavItem icon={MessageSquare} label="Live Chat" active={activeTab === "LiveChat"} onClick={() => setActiveTab("LiveChat")} />
          <NavItem icon={CreditCard} label="Billing" active={activeTab === "Billing"} onClick={() => setActiveTab("Billing")} />
        </nav>

        {/* Fixed Bottom: Profile Section */}
        <div className="mt-auto p-4 border-t border-white/10 bg-gray-900 shrink-0">
          <div className="flex items-center p-3 rounded-2xl bg-white/5 mb-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white">V</div>
            <div className="ml-3">
              <p className="text-sm font-semibold text-white">Vedant</p>
              <p className="text-[10px] text-gray-400">Admin Pro</p>
            </div>
          </div>
          <button className="w-full flex items-center p-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
            <LogOut size={20} />
            <span className="ml-3 font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 overflow-y-auto bg-black p-8">
        {renderPage()}
      </main>
    </div>
  );
}

function NavItem({ icon: Icon, label, active, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center p-3 rounded-xl cursor-pointer transition-all ${
        active ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "text-gray-400 hover:bg-white/5 hover:text-white"
      }`}
    >
      <Icon size={20} />
      <span className="ml-3 font-medium text-sm">{label}</span>
    </div>
  );
}