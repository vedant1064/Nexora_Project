import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function AIStrategy() {
  const [features, setFeatures] = useState({
    shadowMode: true,
    dynamicPricing: false,
    visualInventory: true,
    ghostWriter: true,
    omnichannelMemory: true,
    sentimentRadar: false
  });

  const toggleFeature = (key) => {
    setFeatures(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const featureList = [
    { id: 'shadowMode', name: 'Shadow Mode Training', desc: 'AI seeks and learns from your live WhatsApp chats.', icon: '🧠' },
    { id: 'dynamicPricing', name: 'Dynamic Pricing Engine', desc: 'Auto-adjust prices based on stock and demand.', icon: '💰' },
    { id: 'visualInventory', name: 'Visual Matcher', desc: 'Recognize products directly from WhatsApp photos.', icon: '👁️' },
    { id: 'ghostWriter', name: 'Ghost-Writer Follow-ups', desc: 'AI writes personalized re-engagement messages.', icon: '✍️' },
    { id: 'omnichannelMemory', name: 'Cross-Platform Memory', desc: 'Link website "Add to Cart" data with WhatsApp.', icon: '🔄' },
    { id: 'sentimentRadar', name: 'Sentiment Radar', desc: 'Detect customer mood (Angry/Happy) in real-time.', icon: '📡' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold italic mb-2">AI Strategy Control</h1>
        <p className="text-gray-500 font-medium">Configure how Nexora AI manages your business autonomously.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {featureList.map((f) => (
          <motion.div 
            key={f.id}
            whileHover={{ y: -5 }}
            className="p-6 bg-[#0A0A0A] border border-white/5 rounded-2xl flex items-start justify-between gap-4 group hover:border-indigo-500/30 transition-all shadow-xl"
          >
            <div className="flex gap-4">
              <div className="text-3xl p-3 bg-white/5 rounded-xl">{f.icon}</div>
              <div>
                <h3 className="text-lg font-bold mb-1 group-hover:text-indigo-400 transition-colors">{f.name}</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">{f.desc}</p>
              </div>
            </div>

            {/* Custom Toggle Switch */}
            <div 
              onClick={() => toggleFeature(f.id)}
              className={`w-14 h-7 rounded-full p-1 cursor-pointer transition-colors duration-300 ${features[f.id] ? 'bg-indigo-600' : 'bg-gray-800'}`}
            >
              <motion.div 
                animate={{ x: features[f.id] ? 28 : 0 }}
                className="w-5 h-5 bg-white rounded-full shadow-md"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}