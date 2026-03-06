/* Path: nexora-ui/src/pages/Products.jsx */
import { motion } from "framer-motion";

export default function Products({ products, newProduct, setNewProduct, createProduct, deleteProduct }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-3xl font-bold mb-6 gradient-text">Product Inventory</h2>
      
      {/* ADD PRODUCT FORM - Fixed 499 Bug */}
      <div className="glass-card mb-8 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="text-xs text-gray-500 ml-2 uppercase font-bold tracking-widest">Product Name</label>
          <input 
            value={newProduct.name || ""} 
            onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
            className="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none focus:border-indigo-500 transition-all" 
            placeholder="e.g. Premium Subscription" 
          />
        </div>
        <div className="w-32">
          <label className="text-xs text-gray-500 ml-2 uppercase font-bold tracking-widest">Price (₹)</label>
          <input 
            type="number"
            value={newProduct.price || ""} 
            onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
            className="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none focus:border-indigo-500 transition-all" 
            placeholder="0" 
          />
        </div>
        <button 
          onClick={createProduct} 
          className="bg-indigo-600 px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
        >
          Add Item
        </button>
      </div>

      {/* REAL PRODUCT LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.length === 0 ? (
          <p className="text-gray-500 italic">No products found. Add your first product above.</p>
        ) : (
          products.map(p => (
            <div key={p.id} className="glass-card flex justify-between items-center group border border-white/5 hover:border-indigo-500/30 transition-all">
              <div>
                <h3 className="font-bold text-lg text-white">{p.name}</h3>
                <p className="text-indigo-400 font-mono font-bold text-xl">₹{p.price}</p>
                <p className="text-gray-500 text-sm mt-1">{p.description || "Active Inventory Item"}</p>
              </div>
              <button 
                onClick={() => deleteProduct(p.id)}
                className="opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-500/10 p-3 rounded-xl transition-all"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}