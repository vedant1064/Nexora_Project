// Purani line: import { useEffect, useState } from "react";
// ✅ Nayi line (Ise copy karo):
import { useEffect, useState, useRef } from "react";
import { jwtDecode } from "jwt-decode";

// ✅ Claude's Logical Imports - Correct Paths
import Analytics from "./pages/dashboard/Analytics.jsx";
import Billing from "./pages/dashboard/Billing.jsx";
import Leads from "./pages/dashboard/Leads.jsx";
import Products from "./pages/dashboard/Products.jsx";
import LiveChat from "./pages/dashboard/LiveChat.jsx";
import Pricing from "./pages/dashboard/Pricing.jsx";
import Profile from "./pages/dashboard/Profile.jsx";
import EditBusinessModal from "./pages/dashboard/EditBusinessModal.jsx";
import Overview from "./pages/Dashboard/Overview"; // 👈 Path check kar lena sahi ho
import AIStrategy from "./pages/Dashboard/AIStrategy"; // 👈 AIStrategy bhi import kar lo agar use kar rahe ho

import { 
  LayoutDashboard, Zap, Users, Package, MessageSquare, 
  BarChart3, CreditCard, Settings, LogOut, Flame, 
  Thermometer, TrendingUp, ShoppingBag, ChevronDown,
  X, Mail, ShieldCheck // 👈 YE TEENO ADD KARO
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
const API_BASE_URL = import.meta.env.VITE_API_URL;
export default function DashboardMain() {
  const BIZ_ID = localStorage.getItem("business_id");
  const token = localStorage.getItem("token");

  // 1. Token decode karke Google data nikalo
  let googleUser = null;
  if (token) {
    try { googleUser = jwtDecode(token); } catch (e) {}
  }

  // --- STATE MANAGEMENT ---
  const [leads, setLeads] = useState([]);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState("dashboard");
  // --- PAYMENT LOGIC START ---
const handleSubscription = (planKey) => {
  fetch(`${API_BASE_URL}/create-subscription`, {
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
        name: me?.name || "User", // 'me' state se naam uthao
        email: me?.email || "",   // 'me' state se email uthao
        contact: ""               // Contact user khud bhar dega
      },

      // ✅ YE WALA PART UPDATE KARO
      handler: (res) => {
        alert("Bhai, Payment Chaka-chak ho gayi! ID: " + res.razorpay_payment_id);

        // Backend ko payment verify karne ke liye call karo
        fetch('${API_BASE_URL}/verify-payment', {
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
  const [me, setMe] = useState({
    name: googleUser?.name || "User",
    email: googleUser?.email || "",
    picture: googleUser?.picture || null
  });
  const [chatMessages, setChatMessages] = useState([]);
  const chatEndRef = useRef(null); // 👈 Ye scroll target define karega
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", description: "" });
  const [profileOpen, setProfileOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const [editingProduct, setEditingProduct] = useState(null); 
  const [editProductModalOpen, setEditProductModalOpen] = useState(false);

  // --- DASHBOARD REAL-TIME STATS (SAFE CALCULATION) ---
  const totalLeads = Array.isArray(leads) ? leads.length : 0;
  const hotLeadsCount = Array.isArray(leads) ? leads.filter(l => l.classification === "Hot").length : 0;
  const avgPrice = (Array.isArray(products) && products.length > 0) 
    ? products.reduce((acc, p) => acc + (p.price || 0), 0) / products.length 
    : 500;
  const estimatedRevenue = hotLeadsCount * avgPrice;
  const [stats, setStats] = useState({
    total_messages: 0,
    total_leads: 0,
    hot_leads: 0,
    products: 0
  });

  const fetchAnalytics = () => {
    fetch('${API_BASE_URL}/analytics/${BIZ_ID}', {
      headers: { Authorization: `Bearer ${token}` } 
    })
    .then(res => res.json())
    .then(data => setStats(data))
    .catch(err => console.error("Analytics error:", err));
  };
  // --- CORE DATA FETCHING ---
  useEffect(() => {
    if (!BIZ_ID || !token) return;

    // Fetch Profile
    fetch('${API_BASE_URL}/me/${BIZ_ID}', { 
      headers: { Authorization: `Bearer ${token}` } 
    })
    .then(res => res.json())
    .then(data => { 
      if (data && !data.detail) {
        // Purane state (Google data) ko backend data ke saath merge karo
        setMe(prev => ({ ...prev, ...data })); 
      }
    })
    .catch(err => console.error("Me fetch error:", err));
  }, [BIZ_ID, token]);
   
  const fetchLeads = () => {
    const currentId = localStorage.getItem("business_id");
    const currentToken = localStorage.getItem("token");
    
    if (!currentId || currentId === "null" || !currentToken) return;

    fetch('${API_BASE_URL}/leads/${currentId}', {
      headers: { Authorization: `Bearer ${currentToken}` } 
    })
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data)) setLeads(data); 
    })
    .catch(err => console.error("Leads fetch error:", err));
  };

  const fetchProducts = () => {
  const currentId = localStorage.getItem("business_id");
  const currentToken = localStorage.getItem("token");

  if (!currentId || !currentToken) return;

  fetch('${API_BASE_URL}/products/${currentId}', {
    headers: { Authorization: `Bearer ${currentToken}` } 
  })
  .then(res => res.json())
  .then(data => {
    console.log("📦 Data received from Backend:", data);
    // ✅ Agar backend se empty array [] aa raha hai tab bhi check karega
    if (Array.isArray(data)) {
      setProducts(data); 
    } else {
      setProducts([]); // Security ke liye khali array set karo
    }
  })
  .catch(err => {
    console.error("Fetch Products Error:", err);
    setProducts([]);
  });
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

  fetch('${API_BASE_URL}/whatsapp-webhook', {
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
  fetch('${API_BASE_URL}/chat-history/${BIZ_ID}/${phone}', {
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
  const currentToken = localStorage.getItem("token");
  const currentBizId = localStorage.getItem("business_id");

  // 🚨 AGAR ID NULL HAI TOH AGAY MAT BADHO
  if (!currentBizId || currentBizId === "null" || currentBizId === null) {
    alert("Bhai, Business ID missing hai! Ek baar Logout karke Login karo.");
    return;
}

  // ✅ 2. Data structure ko backend ke hisaab se set karo
  const productData = {
    business_id: String(currentBizId), // String mein convert karna safe hai
    name: newProduct.name,
    price: parseFloat(newProduct.price) || 0,
    description: newProduct.description || "No description",
    image_url: newProduct.image_url || "",
    category: "General",
    stock_quantity: parseInt(newProduct.stock_quantity) || 0
  };

  console.log("🚀 Sending Product:", productData);

  fetch('${API_BASE_URL}/products', {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${currentToken}` 
    },
    body: JSON.stringify(productData)
  })
  .then(async (res) => {
    if (res.ok) {
      alert("Product Add ho gaya! 🔥");
      // Form reset
      setNewProduct({ name: "", price: "", description: "", stock_quantity: 0, image_url: "" });
      // ✅ 3. List Refresh
      fetchProducts(); 
    } else {
      const err = await res.json();
      console.error("Backend Error Details:", err.detail);
      alert("Error: " + JSON.stringify(err.detail));
    }
  })
  .catch(err => alert("Connection Failed!"));
};
  
  const handleEditClick = (product) => {
    console.log("✏️ Editing Product:", product); 
    
    // 1. Sabse important: React ko batao kaunsa product edit ho raha hai
    // Isi se button "Save Changes" banega
    setEditingProduct(product); 
    
    // 2. Form mein purana data bhar do
    setNewProduct({
      id: product.id, 
      name: product.name,
      price: product.price,
      description: product.description,
      stock_quantity: product.stock_quantity,
      image_url: product.image_url
    });

    // 3. Inventory page par jump karo
    setPage("products"); 
  };

  const updateProduct = () => {
  const currentToken = localStorage.getItem("token");
  const currentBizId = localStorage.getItem("business_id");

  // Hum handleEditClick mein 'editingProduct' set karenge
  if (!editingProduct) return;

  const productData = {
    business_id: String(currentBizId),
    name: newProduct.name,
    price: parseFloat(newProduct.price) || 0,
    description: newProduct.description || "No description",
    image_url: newProduct.image_url || "",
    category: "General",
    stock_quantity: parseInt(newProduct.stock_quantity) || 0
  };

  fetch('${API_BASE_URL}/products/${editingProduct.id}', {
    method: "PUT", // 👈 Naya banane ki jagah 'Update' karega
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${currentToken}` 
    },
    body: JSON.stringify(productData)
  })
  .then(res => {
    if (res.ok) {
      alert("Product Update ho gaya! ✨");
      setEditingProduct(null); // Reset edit state
      setNewProduct({ name: "", price: "", description: "", stock_quantity: 0, image_url: "" });
      fetchProducts(); // List refresh karo
    }
  })
  .catch(err => alert("Update Fail ho gaya!"));
};
  const deleteProduct = (id) => {
    if (!window.confirm("Bhai, kya aap is product ko delete karna chahte hain?")) return;

    fetch('${API_BASE_URL}/products/${id}', {
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
  <motion.div 
    initial={{ opacity: 0, y: 10 }} 
    animate={{ opacity: 1, y: 0 }} 
    className="space-y-8"
  >
    {/* Header Section */}
    <div>
      <h2 className="text-3xl font-bold tracking-tight italic text-white/90">Nexora Intelligence Center</h2>
      <p className="text-gray-500 text-sm mt-1">Real-time performance of your AI autonomous workflows.</p>
    </div>

    {/* 3 Stats Cards (SS1 Style) */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard 
        icon={<div className="p-2 bg-green-500/10 rounded-lg text-green-500"><ShoppingBag size={20} /></div>}
        label="Total Revenue Saved" 
        value="₹42,850" 
        growth="+12.5% ↗"
      />
      <StatCard 
        icon={<div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400"><MessageSquare size={20} /></div>}
        label="AI Conversations" 
        value="1,284" 
        growth="+18.2% ↗"
      />
      <StatCard 
        icon={<div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><Users size={20} /></div>}
        label="Recovered Leads" 
        value="156" 
        growth="+5.4% ↗"
      />
    </div>

    {/* Live AI Activity Section */}
    <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 shadow-2xl">
      <h3 className="text-lg font-bold flex items-center gap-2 mb-8">
        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
        Live AI Activity
      </h3>
      
      <div className="space-y-8">
        <ActivityItem 
          num="01" 
          title="Cross-Platform Memory Triggered" 
          desc="User Vedant added 'Blue Sneakers' to cart on Website. AI sent a WhatsApp follow-up with 5% discount."
          status="SUCCESS • 2M AGO"
          color="text-indigo-400"
        />
        <ActivityItem 
          num="02" 
          title="Shadow Mode: New Pattern Learned" 
          desc="AI learned how you handle 'Bulk Order' queries from a live chat. Knowledge base updated."
          status="LEARNED • 15M AGO"
          color="text-purple-400"
        />
        <ActivityItem 
          num="03" 
          title="Visual Matcher: Product Identified" 
          desc="User sent a photo on WhatsApp. AI identified Model-X Part from Website Gallery."
          status="MATCHED • 1H AGO"
          color="text-green-500"
        />
      </div>
    </div>
  </motion.div>
);


// --- Small Helper Components (Inhe Overview ke upar ya niche paste kar dena) ---
const StatCard = ({ icon, label, value, growth }) => (
  <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-3xl relative overflow-hidden group">
    <div className="flex justify-between items-start mb-4">
      {icon}
      <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full uppercase tracking-tighter">
        {growth}
      </span>
    </div>
    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">{label}</p>
    <h3 className="text-2xl font-bold tracking-tight text-white/90">{value}</h3>
  </div>
);

const ActivityItem = ({ num, title, desc, status, color }) => (
  <div className="flex gap-4 group">
    <div className={`w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold ${color} shrink-0`}>
      {num}
    </div>
    <div>
      <h4 className="text-sm font-bold text-white/90">{title}</h4>
      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{desc}</p>
      <p className={`text-[10px] font-black uppercase tracking-widest mt-2 ${color} opacity-80`}>{status}</p>
    </div>
  </div>
);

  return (
    <div className="flex h-screen bg-[#050505] text-white font-sans overflow-hidden">
      
      {/* 🟢 SIDEBAR (Exact SS2 Style) */}
      <aside className="w-64 border-r border-white/5 bg-[#0A0A0A] flex flex-col z-50">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.3)]">
            <span className="text-xl font-bold italic text-white">N</span>
          </div>
          <span className="text-lg font-bold tracking-tight italic">Nexora AI</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {[
            { id: 'dashboard', name: 'Overview', icon: <LayoutDashboard size={20} /> },
            { id: 'strategy', name: 'AI Strategy', icon: <Zap size={20} /> },
            { id: 'chat', name: 'Conversations', icon: <MessageSquare size={20} /> },
            { id: 'products', name: 'Inventory', icon: <Package size={20} /> },
            { id: 'leads', name: 'Recent Leads', icon: <Users size={20} /> }, // 👈 Leads tab wapas add kiya
            { id: 'analytics', name: 'Analytics', icon: <BarChart3 size={20} /> },
            { id: 'settings', name: 'Settings', icon: <Settings size={20} /> },
          ].map((item) => (
            <div
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 ${
                page === item.id 
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
            onClick={() => { localStorage.clear(); window.location.href = "/login"; }}
            className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-400 cursor-pointer transition-colors"
          >
            <LogOut size={20} />
            <span className="text-sm font-semibold">Logout</span>
          </div>
        </div>
      </aside>

      {/* 🔵 MAIN CONTENT AREA (Top Profile & Dark Background) */}
      <main className="flex-1 flex flex-col overflow-y-auto bg-[#050505]">
        <header className="h-16 border-b border-white/5 bg-[#0A0A0A]/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-xl font-bold tracking-tight italic capitalize">
            {page === "dashboard" ? "Overview" : page.replace("-", " ")}
          </h2>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-gray-500 font-medium tracking-tight">Welcome back,</p>
              <p className="text-sm font-bold tracking-tight">{me?.name || "Vedant Ojha"}</p>
            </div>
            {/* ✅ Profile icon top-right mein shift ho gaya */}
            <div 
              onClick={() => setProfileOpen(true)}
              className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border border-white/10 shadow-lg cursor-pointer"
            ></div>
          </div>
        </header>

        <section className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {page === "dashboard" && <DashboardOverview />}
              {page === "strategy" && <AIStrategy />}
              {page === "leads" && <Leads leads={leads} badgeColor={badgeColor} loadChatHistory={loadChatHistory} />}
              {page === "products" && <Products products={products} newProduct={newProduct} setNewProduct={setNewProduct} createProduct={createProduct} deleteProduct={deleteProduct} handleEditClick={handleEditClick} updateProduct={updateProduct}/>}
              {page === "chat" && <LiveChat chatMessages={chatMessages} chatInput={chatInput} setChatInput={setChatInput} sendChatMessage={sendChatMessage} chatLoading={chatLoading} chatEndRef={chatEndRef} />}
              {page === "analytics" && <Analytics />}
              {page === "pricing" && <Pricing subscribe={handleSubscription} />}
              {page === "settings" && <SettingsUI bizId={BIZ_ID} token={token} />}
            </motion.div>
          </AnimatePresence>
        </section>
      </main>


      {/* ======================== PROFILE SLIDE-OVER (Nexora Theme) ======================== */}
      <AnimatePresence>
        {profileOpen && (
          <>
            {/* Background Overlay - Glass effect */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              onClick={() => setProfileOpen(false)} 
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]" 
            />
            
            {/* Side Panel - Nexora Dark Look */}
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} 
              transition={{ type: "spring", damping: 25, stiffness: 200 }} 
              className="fixed right-0 top-0 h-full w-85 bg-[#050505] border-l border-white/5 z-[101] shadow-2xl flex flex-col font-sans"
            >
              {/* ❌ Subtle Close Button */}
              <button 
                onClick={() => setProfileOpen(false)} 
                className="absolute top-5 right-5 p-1.5 rounded-lg bg-white/5 text-gray-500 hover:text-white hover:bg-white/10 transition-all z-[102] border border-white/5 group"
              >
                <X size={18} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>

              {/* Header - Indigo Gradient with Dynamic Alphabet */}
              <div className="p-8 bg-gradient-to-b from-indigo-600/10 to-transparent">
                {/* Profile Circle Logic */}
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white uppercase shadow-xl">
                  {me?.name ? me.name.charAt(0) : (googleUser?.name ? googleUser.name.charAt(0) : "V")}
                </div>
                
                <h2 className="text-2xl font-bold tracking-tight text-white/90 capitalize">
                  {me?.name || "Vedant Ojha"}
                </h2>
                <p className="text-xs text-indigo-400 font-black uppercase tracking-[3px] mt-1">
                  Business Owner
                </p>
              </div>

              {/* Info Boxes - SS1 Style Spacing */}
              <div className="px-8 space-y-5 flex-1 overflow-y-auto">
                <ProfileInfoBox label="Email Address" value={me?.email || "N/A"} icon={<Mail size={14} />} />
                <ProfileInfoBox label="Active Plan" value={me?.plan || "Starter Free"} highlight icon={<Zap size={14} />} />
                <ProfileInfoBox label="Business ID" value={BIZ_ID} mono icon={<ShieldCheck size={14} />} />
              </div>

              {/* Bottom Actions - Nexora Dark Style */}
              <div className="p-8 border-t border-white/5 bg-[#080808] space-y-3">
                <button 
                  onClick={() => setEditModalOpen(true)} 
                  className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all text-sm flex items-center gap-3 font-bold border border-white/5 group"
                >
                  <Settings size={18} className="group-hover:rotate-45 transition-transform" /> 
                  Edit Business
                </button>
                
                <button 
                  onClick={() => { localStorage.clear(); window.location.href = "/login"; }} 
                  className="w-full py-4 bg-red-500/5 hover:bg-red-500/10 text-red-500 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 border border-red-500/10"
                >
                  <LogOut size={18} /> 
                  Log Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <EditBusinessModal 
        isOpen={editModalOpen} 
        onClose={() => setEditModalOpen(false)} 
        currentName={me?.name} 
        BIZ_ID={BIZ_ID} 
        token={token} 
      />
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
    fetch('${API_BASE_URL}/business/${bizId}', { headers: { Authorization: `Bearer ${token}` } })
    .then(res => res.json())
    .then(data => { if(data) setSettings({ ai_tone: data.ai_tone || "professional", ai_prompt: data.ai_prompt || "" }); });
  }, [bizId, token]);

  const handleSave = () => {
    fetch('${API_BASE_URL}/ai-settings', {
      method: "PUT",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ 
        biz_id: String(bizId), 
        ai_name: "Nexora AI", 
        system_prompt: settings.ai_prompt || "You are a helpful assistant." 
      })
    })
    .then(res => {
      if(res.ok) alert("AI Personality Saved! ✨");
      else alert("Backend validation failed!");
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight italic text-white/90">AI Configuration</h2>
        <p className="text-gray-500 text-sm mt-1">Define how Nexora AI interacts with your customers.</p>
      </div>

      {/* Main Settings Card */}
      <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 shadow-2xl space-y-10">
        
        {/* Tone Selection Block */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[3px]">Tone of Voice</label>
          <div className="relative group">
            <select 
              value={settings.ai_tone} 
              onChange={(e) => setSettings({...settings, ai_tone: e.target.value})} 
              // ✅ Nayi Styling: bg-gray-900 aur text-gray-200 force kiya hai
              className="w-full bg-[#111111] border border-white/10 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/40 text-sm text-gray-200 transition-all appearance-none cursor-pointer"
            >
              {/* ✅ Har option ko alag se dark style diya hai */}
              <option value="professional" className="bg-[#0A0A0A] text-white">Professional & Direct</option>
              <option value="friendly" className="bg-[#0A0A0A] text-white">Friendly & Warm</option>
              <option value="persuasive" className="bg-[#0A0A0A] text-white">Sales-Driven & Persuasive</option>
              <option value="casual" className="bg-[#0A0A0A] text-white">Casual & Conversational</option>
            </select>
            
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
              <ChevronDown size={18} />
            </div>
          </div>
        </div>

        {/* System Prompt Block */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-purple-400 uppercase tracking-[3px]">System Instructions</label>
          <textarea 
            value={settings.ai_prompt} 
            onChange={(e) => setSettings({...settings, ai_prompt: e.target.value})} 
            className="w-full bg-white/[0.03] border border-white/10 p-6 rounded-2xl h-56 outline-none focus:ring-2 focus:ring-purple-500/40 text-sm text-gray-200 resize-none transition-all leading-relaxed" 
            placeholder="Define custom rules (e.g., 'Focus on bulk orders', 'Always mention warranty')..." 
          />
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <button 
            onClick={handleSave} 
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-95"
          >
            Save Personality
          </button>
        </div>
      </div>
    </motion.div>
  );
};
