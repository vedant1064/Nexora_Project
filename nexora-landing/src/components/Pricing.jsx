/* Path: src/components/Pricing.jsx */
import { useState } from "react";
import { motion } from "framer-motion";

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState("monthly");

  const plans = [
    { 
      name: "Starter", 
      monthly: "299", 
      yearly: "2999", 
      features: ["1000 Messages/mo", "Basic OpenAI", "Razorpay Secure"],
      color: "border-gray-300" 
    },
    { 
      name: "Pro", 
      monthly: "499", 
      yearly: "4999", 
      features: ["Unlimited Messages", "FastAPI Hooks", "Neural Memory"],
      highlight: true,
      color: "border-indigo-600" 
    },
    { 
      name: "Premium", 
      monthly: "999", 
      yearly: "9999", 
      features: ["Custom AI Agents", "Priority Execution", "Enterprise API"],
      color: "border-black" 
    }
  ];

  return (
    <section id="pricing" className="py-40 bg-[#f6f6f3] border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center mb-16">
          <h2 className="text-6xl font-black text-black tracking-tighter mb-6">Ready to <span className="text-indigo-600 italic font-serif">scale?</span></h2>
          
          {/* Custom Toggle for Razorpay Cycles */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-sm font-bold ${billingCycle === 'monthly' ? 'text-black' : 'text-gray-400'}`}>Monthly</span>
            <button 
              onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
              className="w-14 h-8 bg-black rounded-full p-1 relative"
            >
              <motion.div 
                animate={{ x: billingCycle === 'monthly' ? 0 : 24 }}
                className="w-6 h-6 bg-white rounded-full shadow-lg"
              />
            </button>
            <span className={`text-sm font-bold ${billingCycle === 'yearly' ? 'text-black' : 'text-gray-400'}`}>Yearly (Save 20%)</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {plans.map((plan, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -15, rotate: i % 2 === 0 ? -1 : 1 }}
              className={`relative p-12 rounded-[3rem] border-4 flex flex-col justify-between shadow-[15px_15px_0px_#000] transition-all bg-white ${plan.color}`}
            >
              <div>
                <div className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-2">{plan.name}</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-black">₹{billingCycle === 'monthly' ? plan.monthly : plan.yearly}</span>
                  <span className="text-gray-400 font-mono text-xs">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                </div>
                
                <ul className="mt-10 space-y-5">
                  {plan.features.map((f, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm font-bold text-gray-800">
                      <span className="text-indigo-600">●</span> {f}
                    </li>
                  ))}
                </ul>
              </div>

              <button className={`mt-12 w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95 ${plan.highlight ? 'bg-indigo-600 text-white shadow-xl' : 'bg-black text-white hover:bg-gray-800'}`}>
                Pay via Razorpay
              </button>

              {plan.highlight && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-yellow-300 border-2 border-black px-4 py-1 text-[10px] font-black uppercase tracking-widest rotate-2">
                  Most Popular
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-20 text-center text-gray-400 font-mono text-[10px] uppercase tracking-widest">
          Secure 256-bit SSL encrypted payments provided by Razorpay.
        </div>
      </div>
    </section>
  );
}