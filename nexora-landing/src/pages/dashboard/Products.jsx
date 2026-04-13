/* Path: nexora-ui/src/pages/dashboard/Products.jsx */
import { motion, AnimatePresence } from "framer-motion";
import { Package, Trash2, Plus, Edit3, Image as ImageIcon, FileText, X } from "lucide-react";
import { useState } from "react";

// Line 6 ko badal kar ye karo:
// Products.jsx ki pehli line aisi honi chahiye:
export default function Products({ 
  products, newProduct, setNewProduct, createProduct, deleteProduct, 
  handleEditClick, editingProduct, updateProduct // 👈 YE DONO YAHAN BHI DALO
}) {
  const [isAdding, setIsAdding] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight italic text-white/90">Master Inventory</h2>
          <p className="text-gray-500 text-sm mt-1 font-medium">Add images and descriptions to train your AI matcher.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className={`px-6 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 ${isAdding ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'}`}
        >
          {isAdding ? <X size={18} /> : <Plus size={18} />} {isAdding ? "Close" : "New Product"}
        </button>
      </div>

      {/* 🟢 EXPANDABLE ADD PRODUCT FORM */}
      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[32px] shadow-2xl space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Name */}
                <div className="space-y-2">
                  <label className="text-[10px] text-indigo-400 uppercase font-black tracking-[3px] ml-1">Product Name</label>
                  <input 
                    value={newProduct.name || ""} 
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full bg-white/[0.03] border border-white/10 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/40 text-white font-bold" 
                    placeholder="e.g. Vintage Leather Jacket" 
                  />
                </div>
                {/* Price */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] text-purple-400 uppercase font-black tracking-[3px] ml-1">Price (₹)</label>
                    <input 
                      type="number" step="any"
                      value={newProduct.price || ""} 
                      onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                      className="w-full bg-white/[0.03] border border-white/10 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-purple-500/40 text-white font-bold" 
                      placeholder="0.00" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-green-400 uppercase font-black tracking-[3px] ml-1">Stock Qty</label>
                    <input 
                      type="number"
                      value={newProduct.stock_quantity || ""} 
                      onChange={(e) => setNewProduct({...newProduct, stock_quantity: e.target.value})}
                      className="w-full bg-white/[0.03] border border-white/10 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-green-500/40 text-white font-bold" 
                      placeholder="0" 
                    />
                  </div>
                </div>
              </div>

              {/* Description Box */}
              <div className="space-y-2">
                <label className="text-[10px] text-gray-500 uppercase font-black tracking-[3px] ml-1 flex items-center gap-2">
                  <FileText size={12} /> Detailed Description
                </label>
                <textarea 
                  value={newProduct.description || ""} 
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  className="w-full bg-white/[0.03] border border-white/10 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/40 text-white text-sm h-28 resize-none leading-relaxed" 
                  placeholder="Describe materials, sizes, or unique features for the AI..." 
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                {/* Image Placeholder UI */}
                <div className="flex items-center gap-4 py-4">
                  <input 
                    type="file" id="product-image-input" className="hidden" accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;

                      const token = localStorage.getItem("token"); // 👈 1. Token nikaalo
                      const formData = new FormData();
                      formData.append("file", file);

                      try {
                        const res = await fetch(`${import.meta.env.API_URL}/upload-image`, { 
                          method: "POST", 
                          body: formData,
                          headers: {
                            "Authorization": `Bearer ${token}` // 👈 2. Token header mein dalo
                          }
                        });

                        const data = await res.json();
                        if (res.ok) {
                          setNewProduct({ ...newProduct, image_url: data.url });
                          alert("Photo Uploaded! ✅");
                        } else {
                          alert(`Upload Fail: ${data.detail || "Server Error"}`);
                        }
                      } catch (err) { 
                        alert("Upload Fail! Connection check karo."); 
                      }
                    }}
                  />
                  <label htmlFor="product-image-input" className="cursor-pointer flex items-center gap-4 text-gray-500 hover:text-indigo-400 group transition-all">
                    <div className="w-16 h-16 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center group-hover:border-indigo-500/40 overflow-hidden bg-white/5">
                      {newProduct.image_url ? <img src={newProduct.image_url} className="w-full h-full object-cover" /> : <ImageIcon size={24} />}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/70">Select Photo</span>
                      <span className="text-[9px] text-gray-600 font-bold uppercase">From Computer</span>
                    </div>
                  </label>
                </div>

                {/* ✅ Products.jsx - Create/Update Button (Line 69 approx) */}
                <button 
                  onClick={() => { 
                    // 1. Check karo ki kya 'id' majood hai, iska matlab hum edit kar rahe hain
                    if (newProduct.id) { 
                        console.log("✏️ Calling Update:", newProduct.id); 
                        updateProduct(); // 👈 2. Explicitly UPDATE call karo
                    } else {
                        console.log("➕ Calling Create"); 
                        createProduct(); // 👈 3. Warna naya banao
                    }
                    // Form close karne se pehle zaroori data clear karo (optional)
                    setIsAdding(false); 
                  }} 
                  className={`bg-indigo-600 px-10 py-4 rounded-2xl font-bold text-white transition-all shadow-lg ${
                    newProduct.id ? 'bg-purple-600' : 'bg-indigo-600'
                  }`}
                >
                  {newProduct.id ? "Update Product" : "Create Product"} 
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 📦 PRODUCT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {!Array.isArray(products) || products.length === 0 ? (
          <div className="col-span-3 py-24 text-center bg-[#0A0A0A] border border-dashed border-white/10 rounded-[40px]">
            <Package size={60} className="mx-auto text-gray-800 mb-6 opacity-20" />
            <p className="text-gray-500 font-medium italic">
              {!Array.isArray(products) ? "Session expired. Please Login again." : "Empty Shelf. Add products to activate AI Recommendations."}
            </p>
          </div>
        ) : (
          products.map(p => (
            <div key={p.id || p.product_id} className="bg-[#0A0A0A] border border-white/5 rounded-[32px] group hover:border-indigo-500/30 transition-all overflow-hidden shadow-xl flex flex-col">
              
              {/* Product Image Area */}
              <div className="h-48 bg-white/[0.02] border-b border-white/5 flex items-center justify-center relative overflow-hidden">
                {p.image_url ? (
                  <img 
                    src={p.image_url} 
                    alt={p.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                ) : (
                  <ImageIcon size={40} className="text-gray-800 opacity-20 group-hover:scale-110 transition-transform duration-500" />
                )}

                {/* Edit/Delete Buttons - Always Visible */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button 
                    onClick={() => {
                      handleEditClick(p); // 👈 Ye dashboard mein data bhejega
                      setIsAdding(true);   // 👈 Ye form ko open karega
                    }} 
                    className="bg-black/50 backdrop-blur-md p-2 rounded-lg text-gray-400 hover:text-white transition-colors border border-white/10"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button 
                    onClick={() => deleteProduct(p.id)} 
                    className="bg-black/50 backdrop-blur-md p-2 rounded-lg text-gray-400 hover:text-red-500 transition-colors border border-white/10"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-bold text-lg text-white/90 truncate">{p.name}</h3>
                  <p className="text-gray-500 text-[11px] mt-1 line-clamp-2 leading-relaxed min-h-[32px]">
                    {p.description || "No description provided for this item."}
                  </p>
                </div>
                
                <div className="flex justify-between items-center pt-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-tighter">Selling Price</span>
                    <span className="text-2xl font-black text-indigo-400 italic">₹{p.price}</span>
                  </div>
                  
                  {p.stock_quantity > 0 ? (
                    <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-3 py-1.5 rounded-full uppercase tracking-tighter">
                      {p.stock_quantity} IN STOCK
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-red-500 bg-red-500/10 px-3 py-1.5 rounded-full uppercase tracking-tighter animate-pulse">
                      OUT OF STOCK
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}