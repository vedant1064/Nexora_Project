import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, CheckCircle2, Clock, DownloadCloud } from "lucide-react";

// 👉 ENSURE: Yahan 'export default' hona zaroori hai
export default function Billing() {
  const [history, setHistory] = useState([]);
  const BIZ_ID = localStorage.getItem("business_id");
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Sample data for testing
    const mockData = [
      { id: 1, plan: "Starter Free", amount: "₹0", date: "2026-02-10", status: "Active" },
      { id: 2, plan: "Pro Monthly", amount: "₹999", date: "2026-01-10", status: "Expired" }
    ];
    setHistory(mockData);
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div>
        <h2 className="text-4xl font-bold gradient-text">Billing History</h2>
        <p className="text-gray-500 mt-2">Manage your subscriptions and download invoices.</p>
      </div>

      <div className="glass-card overflow-hidden border-white/5 bg-white/[0.02]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="p-4 text-xs font-bold uppercase text-gray-400">Plan</th>
              <th className="p-4 text-xs font-bold uppercase text-gray-400">Amount</th>
              <th className="p-4 text-xs font-bold uppercase text-gray-400">Date</th>
              <th className="p-4 text-xs font-bold uppercase text-gray-400">Status</th>
              <th className="p-4 text-xs font-bold uppercase text-gray-400">Invoice</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {history.map((item) => (
              <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="p-4 font-semibold text-gray-200">{item.plan}</td>
                <td className="p-4 text-gray-300">{item.amount}</td>
                <td className="p-4 text-gray-400 text-sm">{item.date}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                    item.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="p-4 text-indigo-400 cursor-pointer hover:text-indigo-300">
                  <DownloadCloud size={18} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}