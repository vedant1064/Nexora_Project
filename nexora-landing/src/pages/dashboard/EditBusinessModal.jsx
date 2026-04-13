import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function EditBusinessModal({ isOpen, onClose, currentName, BIZ_ID, token }) {
  const [newName, setNewName] = useState(currentName || "");

  const updateBusinessName = () => {
    if (!newName.trim()) return alert("Bhai, naam toh likho!");

    fetch(`${import.meta.env.API_URL}/update-business/${BIZ_ID}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json", 
        "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify({ name: newName })
    })
    .then(res => res.json())
    .then(() => {
      alert("Business Name Updated! 🚀");
      onClose(); // Modal band karne ke liye
      window.location.reload(); // Changes dikhane ke liye page refresh
    })
    .catch(err => console.error("Update error:", err));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop Overlay */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />
          
          {/* Modal Card */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-gray-900 border border-white/10 p-8 rounded-3xl shadow-2xl max-w-md w-full z-[201]"
          >
            <h3 className="text-2xl font-bold mb-2 gradient-text">Edit Business Details</h3>
            <p className="text-gray-400 text-sm mb-6">Apne business ka naya naam yahan update karein.</p>
            
            <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2 block">Business Name</label>
            <input 
              type="text" 
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 mb-6 text-white"
              placeholder="e.g. Nexora Enterprise"
            />
            
            <div className="flex gap-4">
              <button onClick={onClose} className="flex-1 py-4 rounded-2xl font-bold hover:bg-white/5 transition-all text-gray-400">
                Cancel
              </button>
              <button onClick={updateBusinessName} className="flex-1 py-4 bg-indigo-600 rounded-2xl font-bold shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 transition-all">
                Save Changes
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}