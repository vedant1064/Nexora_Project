// Purani line: import { useEffect, useState } from "react";
// ✅ Nayi line (Ise copy karo):
import { useEffect, useState, useRef } from "react";

// ✅ Claude's Logical Imports - Correct Paths
import Analytics from "./pages/dashboard/Analytics.jsx";
import Billing from "./pages/dashboard/Billing.jsx";
import Leads from "./pages/dashboard/Leads.jsx";
import Products from "./pages/dashboard/Products.jsx";
import LiveChat from "./pages/dashboard/LiveChat.jsx";
import Pricing from "./pages/dashboard/Pricing.jsx";
import Profile from "./pages/dashboard/Profile.jsx";
import EditBusinessModal from "./pages/dashboard/EditBusinessModal.jsx";

// Icons & Animation
import { 
  LayoutDashboard, Users, Package, MessageSquare, 
  BarChart3, CreditCard, Settings, LogOut, Flame, Thermometer, TrendingUp 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardMain() {
  const BIZ_ID = localStorage.getItem("business_id");
  const token = localStorage.getItem("token");

  // --- STATE MANAGEMENT ---
  const [leads, setLeads] = useState([]);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState("dashboard");
  // --- PAYMENT LOGIC START ---
const handleSubscription = (planKey) => {
  fetch("http://127.0.0.1:8000/create-subscription", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ biz_id: BIZ_ID, plan_key: planKey })
  })
  .then(res => res.json())
  .then(data => {
    const options = {
      key: "rzp_test_SE3gBmIPM6rVAQ", 
      subscription_id: data.subscription_id,
      name: "Nexora AI",
      description: `Upgrade to ${planKey}`,
      prefill: {
        name: "Vedant Ojha",
        email: "vedant@gmail.com",
        contact: "919999999999" 
      },

      // ✅ YE WALA PART UPDATE KARO
      handler: (res) => {
        alert("Bhai, Payment Chaka-chak ho gayi! ID: " + res.razorpay_payment_id);

        // Backend ko payment verify karne ke liye call karo
        fetch("http://127.0.0.1:8000/verify-payment", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json", 
            "Authorization": `Bearer ${token}` 
          },
          body: JSON.stringify({
            razorpay_payment_id: res.razorpay_payment_id,
            razorpay_subscription_id: data.subscription_id, // data se subscription id lo
            biz_id: BIZ_ID
          })
        })
        .then(() => {
          alert("Membership Updated! Refreshing...");
          window.location.reload(); 
        })
        .catch(err => alert("Payment ho gayi par backend update fail hua!"));
      },

      theme: { color: "#6366f1" } 
    };
    
    const rzp = new window.Razorpay(options);
    rzp.open();
  });
};
// --- PAYMENT LOGIC END ---

  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [me, setMe] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const chatEndRef = useRef(null); // 👈 Ye scroll target define karega
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", description: "" });
  const [profileOpen, setProfileOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // --- DASHBOARD REAL-TIME STATS (SAFE CALCULATION) ---
  const totalLeads = Array.isArray(leads) ? leads.length : 0;
  const hotLeadsCount = Array.isArray(leads) ? leads.filter(l => l.classification === "Hot").length : 0;
  const avgPrice = (Array.isArray(products) && products.length > 0) 
    ? products.reduce((acc, p) => acc + (p.price || 0), 0) / products.length 
    : 500;
  const estimatedRevenue = hotLeadsCount * avgPrice;

  // --- CORE DATA FETCHING ---
  useEffect(() => {
    if (!BIZ_ID || !token) return;

    // Fetch Profile
    fetch(`http://127.0.0.1:8000/me/${BIZ_ID}`, { 
      headers: { Authorization: `Bearer ${token}` } 
    })
    .then(res => res.json())
    .then(data => { if (data && !data.detail) setMe(data); })
    .catch(err => console.error("Me fetch error:", err));
    
    const refreshData = () => { fetchLeads(); fetchProducts(); };
    refreshData();
    const interval = setInterval(refreshData, 30000);
    return () => clearInterval(interval);
  }, [BIZ_ID, token]);

  const fetchLeads = () => {
  if (!BIZ_ID || !token) return;
  fetch(`http://127.0.0.1:8000/leads/${BIZ_ID}`, { // 👈 URL check karo
    headers: { Authorization: `Bearer ${token}` } 
  })
  .then(res => res.json())
  .then(data => {
    console.log("LEADS DATA:", data); // 👈 Debugging ke liye ye line daalo
    if (Array.isArray(data)) setLeads(data); 
  })
  .catch(err => console.error("Leads fetch error:", err));
};

  const fetchProducts = () => {
    fetch(`http://127.0.0.1:8000/products/${BIZ_ID}`, { 
      headers: { Authorization: `Bearer ${token}` } 
    })
    .then(res => res.json())
    .then(setProducts)
    .catch(() => {});
  };

  // DashboardMain.jsx mein fetch logic ke niche:
  useEffect(() => {
    // Jab bhi chatMessages array badlega, ye niche jump karega
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const sendChatMessage = () => {
  if (!chatInput.trim()) return;
  const userMsg = { role: "user", text: chatInput, time: new Date().toLocaleTimeString() };
  setChatMessages(prev => [...prev, userMsg]);
  setChatLoading(true);

  fetch("http://127.0.0.1:8000/whatsapp-webhook", {
    method: "POST",
    headers: { 
      "Content-Type": "application/json", 
      "Authorization": `Bearer ${token}` 
    },
    body: JSON.stringify({ 
      biz_id: String(BIZ_ID), 
      phone: "9999999999", 
      message: chatInput 
    })
  })
  .then(res => res.json())
  .then(data => {
    // ⚠️ Check karo agar 'reply' field aa rahi hai ya 'response'
    const botReply = data.reply || data.response || "AI is thinking, but couldn't generate text.";
    
    setChatMessages(prev => [...prev, { 
      role: "bot", 
      text: botReply, 
      time: new Date().toLocaleTimeString() 
    }]);
    setChatLoading(false);
  })
  .catch((err) => {
    console.error("Chat Error:", err);
    setChatMessages(prev => [...prev, { 
      role: "bot", 
      text: "Backend Connection Failed. Check if FastAPI is running!", 
      time: new Date().toLocaleTimeString() 
    }]);
    setChatLoading(false);
  });
  
  setChatInput("");
};

  // --- LEADS BADGE COLOR LOGIC ---
const badgeColor = (type) => {
  if (type === "Hot") return "bg-red-500/20 text-red-400 border-red-500/30";
  if (type === "Warm") return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
  return "bg-blue-500/20 text-blue-400 border-blue-500/30"; // Cold ya default ke liye
};

const loadChatHistory = (phone) => {
  if (!phone) return;
  
  // 1. Pehle chat page par redirect karo
  setPage("chat");
  
  // 2. Phir us specific number ki history fetch karo
  fetch(`http://127.0.0.1:8000/chat-history/${BIZ_ID}/${phone}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(res => res.json())
  .then(data => {
    if (Array.isArray(data)) setChatMessages(data);
  })
  .catch(err => console.error("Chat fetch error:", err));
};

  // --- YE DONO FUNCTIONS PASTE KARO ---

  const createProduct = () => {
  const currentBizId = localStorage.getItem("business_id");
  
  if (!newProduct.name || !newProduct.price) {
    alert("Bhai, Name aur Price toh daal do!");
    return;
  }

  // Pehle jaisa simple logic, bina extra String conversion ke
  const productData = {
    business_id: currentBizId, // Direct use karo jaisa storage mein hai
    name: newProduct.name,
    price: parseFloat(newProduct.price),
    description: newProduct.description || "No description",
    category: "General",
    stock_quantity: 0
  };

  fetch("http://127.0.0.1:8000/products", {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}` 
    },
    body: JSON.stringify(productData)
  })
  .then(async (res) => {
    const data = await res.json();
    if (!res.ok) {
      // Yahan alert mein error ko dhyan se padhna ki wo kya maang raha hai
      alert("Backend Error: " + JSON.stringify(data.detail));
      return;
    }
    setNewProduct({ name: "", price: "", description: "" });
    fetchProducts();
    alert("Product Add ho gaya! 🔥");
  })
  .catch(err => alert("Connection Failed!"));
};

  const deleteProduct = (id) => {
    if (!window.confirm("Bhai, kya aap is product ko delete karna chahte hain?")) return;

    fetch(`http://127.0.0.1:8000/products/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === "deleted") {
        fetchProducts();
        alert("Product deleted!");
      }
    })
    .catch(err => console.error("Delete Error:", err));
  };

  // --- AB TERA BAAKI CODE SHURU HOGA ---

  // --- SUB-COMPONENTS (RETAINING OLD PREMIUM DESIGN) ---
  const DashboardOverview = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
      <h2 className="text-4xl font-bold gradient-text tracking-tight">Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardStat icon={Users} label="Total Leads" value={totalLeads} color="from-indigo-500 to-purple-500" />
        <DashboardStat icon={Flame} label="Conversions (Hot)" value={hotLeadsCount} color="from-orange-500 to-red-500" />
        <DashboardStat icon={TrendingUp} label="Est. Revenue" value={`₹${estimatedRevenue.toFixed(0)}`} color="from-green-500 to-emerald-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
        <div className="glass-card p-6 border-white/5">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <BarChart3 className="text-indigo-400" /> Automation Funnel
          </h3>
          <div className="space-y-6">
            <FunnelBar label="Total Messages" value={totalLeads * 4} percent={100} color="bg-indigo-500" />
            <FunnelBar label="Product Inquiries" value={totalLeads} percent={68} color="bg-blue-400" />
            <FunnelBar label="AI Hot Leads" value={hotLeadsCount} percent={25} color="bg-green-500" />
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="flex h-screen bg-gray-950 text-white relative overflow-hidden font-sans">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />

      {/* ======================== SIDEBAR (Old Visual Consistency) ======================== */}
      <motion.div 
        animate={{ width: sidebarCollapsed ? 84 : 260 }} 
        onMouseEnter={() => setSidebarCollapsed(false)} 
        onMouseLeave={() => setSidebarCollapsed(true)} 
        className="m-4 glass-card relative z-50 flex flex-col transition-all duration-300 ease-in-out border-white/10"
      >
        <div className="p-4 flex flex-col h-full items-center">
          {/* Logo Section */}
          <div className={`mt-2 mb-12 flex items-center ${sidebarCollapsed ? "justify-center" : "gap-4 px-4 w-full"}`}>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 flex items-center justify-center font-bold text-xl text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] shrink-0">N</div>
            {!sidebarCollapsed && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                <h1 className="text-xl font-bold gradient-text tracking-tight">Nexora AI</h1>
                <div className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Enterprise</div>
              </motion.div>
            )}
          </div>

          {/* Nav Items */}
          <nav className="flex-1 w-full space-y-3 px-3">
            <SidebarNavItem icon={LayoutDashboard} label="Dashboard" active={page === "dashboard"} onClick={() => setPage("dashboard")} collapsed={sidebarCollapsed} />
            <SidebarNavItem icon={Users} label="Leads" active={page === "leads"} onClick={() => setPage("leads")} collapsed={sidebarCollapsed} />
            <SidebarNavItem icon={Package} label="Products" active={page === "products"} onClick={() => setPage("products")} collapsed={sidebarCollapsed} />
            <SidebarNavItem icon={MessageSquare} label="Live Chat" active={page === "chat"} onClick={() => setPage("chat")} collapsed={sidebarCollapsed} />
            <SidebarNavItem icon={BarChart3} label="Analytics" active={page === "analytics"} onClick={() => setPage("analytics")} collapsed={sidebarCollapsed} />
            <SidebarNavItem icon={CreditCard} label="Pricing" active={page === "pricing"} onClick={() => setPage("pricing")} collapsed={sidebarCollapsed} />
          </nav>

          {/* Bottom Settings & Profile */}
          <div className="mt-auto pt-6 border-t border-white/5 space-y-3 w-full px-3">
            <SidebarNavItem icon={Settings} label="Settings" active={page === "settings"} onClick={() => setPage("settings")} collapsed={sidebarCollapsed} />
            
            <div onClick={() => setProfileOpen(true)} className={`relative flex items-center ${sidebarCollapsed ? "justify-center" : "px-4"} py-3 rounded-2xl cursor-pointer hover:bg-white/5 transition-all group`}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center font-bold text-sm shadow-md shrink-0">
                {me?.name?.charAt(0) || "V"}
              </div>
              {!sidebarCollapsed && (
                <div className="ml-3 truncate">
                  <p className="text-sm font-semibold truncate">{me?.name || "User"}</p>
                  <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Profile</p>
                </div>
              )}
            </div>

            <div onClick={() => { localStorage.clear(); window.location.href = "/login"; }} className={`relative flex items-center ${sidebarCollapsed ? "justify-center" : "px-4"} py-3 rounded-2xl cursor-pointer text-red-400 hover:bg-red-500/10 transition-all group`}>
              <LogOut size={20} className="shrink-0 group-hover:rotate-12 transition-transform" />
              {!sidebarCollapsed && <span className="ml-3 font-medium text-sm">Logout</span>}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ======================== MAIN CONTENT ======================== */}
      <main className="flex-1 overflow-auto p-8 relative z-10 custom-scrollbar">
        <AnimatePresence mode="wait">
          {page === "dashboard" && <DashboardOverview />}
          {/* DashboardMain.jsx mein jahan Leads render ho raha hai */}
          {page === "leads" && (
            <Leads 
              leads={Array.isArray(leads) ? leads : []} // 👈 Pakka karo ki hamesha array hi jaye
              badgeColor={badgeColor || ((type) => "bg-gray-500/20")} // Default function agar missing ho
              loadChatHistory={loadChatHistory} 
            />
          )}
          {page === "chat" && (
              <LiveChat 
                  chatMessages={chatMessages} 
                  chatInput={chatInput} 
                  setChatInput={setChatInput} 
                  sendChatMessage={sendChatMessage} 
                  chatLoading={chatLoading}
                  chatEndRef={chatEndRef} // 👈 Ye prop pass karo
              />
          )}
          {/* DashboardMain.jsx mein niche jahan Products render ho raha hai */}
          {page === "products" && (
            <Products 
              products={products} 
              newProduct={newProduct} 
              setNewProduct={setNewProduct} 
              createProduct={createProduct} // 👈 Ye line check kar, ye honi chahiye!
              deleteProduct={deleteProduct} 
            />
          )}
          {/* Purana galat code: userEmail is not defined */}
          {/* DashboardMain.jsx mein line 350 ke aaspass */}
          {page === "pricing" && (
            <Pricing 
              subscribe={handleSubscription} // 👈 Pakka karo ki prop ka naam 'subscribe' hi ho
            />
          )}
          {page === "settings" && <SettingsUI bizId={BIZ_ID} token={token} />}
          {page === "analytics" && <Analytics />}
          {page === "billing" && <Billing />}
        </AnimatePresence>
      </main>

      {/* ======================== PROFILE SLIDE-OVER (Old Design Retained) ======================== */}
      <AnimatePresence>
        {profileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setProfileOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25 }} className="fixed right-0 top-0 h-full w-85 bg-gray-950 border-l border-white/10 z-[101] shadow-2xl flex flex-col">
              <div className="p-8 bg-gradient-to-b from-indigo-500/10 to-transparent">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center text-3xl font-bold shadow-xl mb-6">
                  {me?.name?.charAt(0) || "V"}
                </div>
                <h2 className="text-2xl font-bold">{me?.name || "Vedant Ojha"}</h2>
                <p className="text-sm text-indigo-400 font-medium uppercase tracking-widest">Business Owner</p>
              </div>

              <div className="px-8 space-y-5 flex-1 overflow-y-auto">
                <ProfileInfoBox label="Email Address" value={me?.email || "N/A"} />
                <ProfileInfoBox label="Active Plan" value={me?.plan || "Starter Free"} highlight />
                <ProfileInfoBox label="Business ID" value={BIZ_ID} mono />
              </div>

              <div className="p-8 border-t border-white/5 space-y-3">
                <button onClick={() => setEditModalOpen(true)} className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all text-sm flex items-center gap-3 font-medium">
                  <Settings size={18} /> Edit Business
                </button>
                <button onClick={() => { localStorage.clear(); window.location.href = "/login"; }} className="w-full py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-2xl font-bold transition-all flex items-center justify-center gap-2">
                  <LogOut size={18} /> Log Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <EditBusinessModal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} currentName={me?.name} BIZ_ID={BIZ_ID} token={token} />
    </div>
  );
}

// ======================== HELPER COMPONENTS ========================

function SidebarNavItem({ icon: Icon, label, active, onClick, collapsed }) {
  return (
    <div 
      onClick={onClick} 
      className={`relative flex items-center ${collapsed ? "justify-center" : "px-4"} py-3 rounded-2xl cursor-pointer transition-all duration-300 group ${active ? "bg-indigo-500/10 text-indigo-400 shadow-[inset_0_0_10px_rgba(99,102,241,0.05)]" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
    >
      <Icon size={collapsed ? 24 : 20} className={`shrink-0 transition-transform ${active ? "scale-110" : "group-hover:scale-110"}`} />
      {!collapsed && <span className="ml-3 font-semibold text-sm whitespace-nowrap">{label}</span>}
      {active && <motion.div layoutId="active-indicator" className="absolute left-[-12px] w-1 h-6 bg-indigo-500 rounded-r-full shadow-[0_0_15px_rgba(99,102,241,0.8)]" />}
    </div>
  );
}

function DashboardStat({ icon: Icon, label, value, color }) {
  return (
    <div className="glass-card p-6 border-white/5 relative overflow-hidden group">
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${color} opacity-5 blur-2xl group-hover:opacity-10 transition-all`} />
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">{label}</p>
          <h2 className="text-3xl font-black text-white">{value}</h2>
        </div>
        <div className={`p-2 rounded-xl bg-gradient-to-br ${color} shadow-lg shadow-black/20`}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
    </div>
  );
}

function FunnelBar({ label, value, percent, color }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs font-bold">
        <span className="text-gray-400 uppercase tracking-tighter">{label}</span>
        <span className="text-white">{value}</span>
      </div>
      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${percent}%` }} className={`h-full ${color} shadow-[0_0_10px_rgba(255,255,255,0.1)]`} />
      </div>
    </div>
  );
}

function ProfileInfoBox({ label, value, highlight, mono }) {
  return (
    <div className={`p-4 rounded-xl border ${highlight ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-white/[0.02] border-white/5'}`}>
      <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">{label}</p>
      <p className={`text-sm truncate ${highlight ? 'text-indigo-400 font-bold' : 'text-gray-200'} ${mono ? 'font-mono text-xs' : ''}`}>{value}</p>
    </div>
  );
}

const SettingsUI = ({ bizId, token }) => {
  const [settings, setSettings] = useState({ ai_tone: "professional", ai_prompt: "" });

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/business/${bizId}`, { headers: { Authorization: `Bearer ${token}` } })
    .then(res => res.json())
    .then(data => { if(data) setSettings({ ai_tone: data.ai_tone || "professional", ai_prompt: data.ai_prompt || "" }); });
  }, [bizId, token]);

  const handleSave = () => {
    fetch("http://127.0.0.1:8000/ai-settings", {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json", 
        "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify({ 
        biz_id: String(bizId), // 👈 Biz ID ko string mein convert kiya
        ai_name: "Nexora AI",   // 👈 Backend ye field maang raha hai
        system_prompt: settings.ai_prompt || "You are a helpful assistant." 
      })
    })
    .then(res => {
      if(res.ok) alert("AI Personality Saved! ✨");
      else alert("Backend validation failed! Check Console.");
    })
    .catch(() => alert("Connection error!"));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl space-y-8">
      <h2 className="text-3xl font-black gradient-text">AI Configuration</h2>
      <div className="glass-card p-8 space-y-8 border-white/5">
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Tone of Voice</label>
          <select value={settings.ai_tone} onChange={(e) => setSettings({...settings, ai_tone: e.target.value})} className="w-full mt-3 bg-gray-900 border border-white/10 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/40 text-gray-200 transition-all">
            <option value="professional">Professional & Direct</option>
            <option value="friendly">Friendly & Warm</option>
            <option value="persuasive">Sales-Driven & Persuasive</option>
            <option value="casual">Casual & Conversational</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">System Instructions</label>
          <textarea value={settings.ai_prompt} onChange={(e) => setSettings({...settings, ai_prompt: e.target.value})} className="w-full mt-3 bg-gray-900 border border-white/10 p-5 rounded-2xl h-44 outline-none focus:ring-2 focus:ring-indigo-500/40 text-gray-200 resize-none transition-all" placeholder="Define custom rules (e.g., 'Focus on bulk orders', 'Always mention warranty')..." />
        </div>
        <button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-500 px-10 py-4 rounded-2xl font-bold shadow-xl shadow-indigo-500/20 transition-all hover:scale-[1.02]">Save Personality</button>
      </div>
    </motion.div>
  );
};