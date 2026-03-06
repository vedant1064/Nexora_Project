/* Path: nexora-ui/src/pages/Leads.jsx */
import { motion } from "framer-motion";

export default function Leads({ leads, badgeColor, loadChatHistory }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-3xl font-bold mb-6 gradient-text">Leads Intelligence</h2>
      <div className="glass-card overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-gray-400">
            <tr>
              <th className="p-4">Customer Phone</th>
              <th className="p-4">AI Classification</th>
              <th className="p-4">Conversion %</th>
              <th className="p-4">Latest Intent</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((l) => (
              <tr key={l.id} className="border-t border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="p-4 text-indigo-400 font-medium cursor-pointer" onClick={() => loadChatHistory(l.customer_phone)}>
                  {l.customer_phone}
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${badgeColor(l.classification)}`}>
                    {l.classification}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400" 
                        style={{ width: `${l.conversion_probability}%` }}
                      />
                    </div>
                    <span className="text-sm">{l.conversion_probability}%</span>
                  </div>
                </td>
                <td className="p-4 text-gray-400 text-sm truncate max-w-[200px]">{l.ai_summary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}