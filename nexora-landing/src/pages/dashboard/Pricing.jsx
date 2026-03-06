/* Path: nexora-ui/src/pages/Pricing.jsx */
import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function Pricing({ subscribe }) {
  const [isYearly, setIsYearly] = useState(false);

  // Exact figures as requested by you
  const plans = [
    { 
      key: isYearly ? "STARTER_YEARLY" : "STARTER_MONTHLY", 
      name: "Starter", 
      price: isYearly ? "2999" : "299", 
      features: ["1000 Messages", "Basic Analytics", "Email Support"] 
    },
    { 
      key: isYearly ? "PRO_YEARLY" : "PRO_MONTHLY", 
      name: "Pro", 
      price: isYearly ? "4999" : "499", 
      features: ["Unlimited Messages", "Advanced AI", "Priority Support"], 
      popular: true 
    },
    { 
      key: isYearly ? "PREMIUM_YEARLY" : "PREMIUM_MONTHLY", 
      name: "Premium", 
      price: isYearly ? "9999" : "999", 
      features: ["Custom AI Training", "API Access", "Dedicated Manager"] 
    }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div>
          <h2 className="text-4xl font-extrabold mb-2 gradient-text">Scale Your Business</h2>
          <p className="text-gray-400">Unlock premium AI features with our flexible plans.</p>
        </div>

        {/* SWITCH FOR MONTHLY/YEARLY */}
        <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10">
          <button 
            onClick={() => setIsYearly(false)}
            className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${!isYearly ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20' : 'text-gray-500 hover:text-gray-300'}`}
          >
            Monthly
          </button>
          <button 
            onClick={() => setIsYearly(true)}
            className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all relative ${isYearly ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20' : 'text-gray-500 hover:text-gray-300'}`}
          >
            Yearly
            <span className="absolute -top-4 -right-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-[10px] text-white px-2 py-0.5 rounded-full font-black">
              2 MONTHS FREE
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map(plan => (
          <div key={plan.key} className={`glass-card relative flex flex-col p-8 transition-all duration-300 ${plan.popular ? 'border-indigo-500/50 ring-2 ring-indigo-500/10 scale-105 z-20' : 'border-white/5'}`}>
            {plan.popular && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                Recommended
              </span>
            )}
            
            <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-4xl font-black gradient-text">₹{plan.price}</span>
              <span className="text-gray-500 font-medium">
                {isYearly ? "/year" : "/mo"}
              </span>
            </div>
            
            <div className="space-y-5 mb-10 flex-1">
              {plan.features.map(f => (
                <div key={f} className="flex items-center gap-3 text-sm font-medium text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-indigo-500/10 flex items-center justify-center">
                    <Check size={12} className="text-indigo-400" strokeWidth={3} />
                  </div>
                  {f}
                </div>
              ))}
            </div>

            <button 
              onClick={() => subscribe(plan.key)}
              className={`w-full py-4 rounded-[1.5rem] font-black tracking-wide transition-all ${plan.popular ? 'bg-indigo-600 hover:bg-indigo-700 shadow-[0_0_30px_rgba(79,70,229,0.3)]' : 'bg-white/5 hover:bg-white/10 border border-white/10'}`}
            >
              SUBSCRIBE {isYearly ? 'YEARLY' : 'MONTHLY'}
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}