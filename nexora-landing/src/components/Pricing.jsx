/* Path: src/components/Pricing.jsx */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const navigate = useNavigate();

  // 🛠️ STEP 1: Razorpay SDK load karna
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const plans = [
    { 
      name: "Starter", 
      monthly: 299, // Number format for calculation
      yearly: 2999, 
      features: ["1000 Messages/mo", "Basic OpenAI", "Razorpay Secure"],
      color: "border-gray-300" 
    },
    { 
      name: "Pro", 
      monthly: 499, 
      yearly: 4999, 
      features: ["Unlimited Messages", "FastAPI Hooks", "Neural Memory"],
      highlight: true,
      color: "border-indigo-600" 
    },
    { 
      name: "Premium", 
      monthly: 999, 
      yearly: 9999, 
      features: ["Custom AI Agents", "Priority Execution", "Enterprise API"],
      color: "border-black" 
    }
  ];

  // 🛠️ STEP 2: Payment Handling Logic
  const handlePayment = (plan) => {
    // ⚡ Pehle ye verify karo ki click kaam kar raha hai
    console.log("Plan Clicked:", plan.name);

    // 🛠️ DIRECT KEY DALO (Environment variables ko abhi bypass karo)
    const MY_RAZORPAY_KEY = "rzp_test_SYsoP7hL5xbJ0n";

    const options = {
      key: MY_RAZORPAY_KEY, 
      amount: (billingCycle === 'monthly' ? plan.monthly : plan.yearly) * 100,
      currency: "INR",
      name: "Nexora AI",
      description: `${plan.name} Subscription`,
      handler: function (response) {
        verifyPayment(response, plan);
      },
      prefill: {
        email: "test@nexora.ai",
      },
      theme: { color: "#6366f1" },
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Razorpay Trigger Error:", err);
    }
  };

    // 🛠️ STEP 3: Payment Verification (Backend Sync)
    const verifyPayment = async (paymentDetails, plan) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${import.meta.env.VITE_API_URL}/verify-payment`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        // 🚨 Keys ke naam backend model se match hone chahiye
        razorpay_payment_id: paymentDetails.razorpay_payment_id || "test_pay_id",
        razorpay_order_id: paymentDetails.razorpay_order_id || "test_order_id",
        razorpay_signature: paymentDetails.razorpay_signature || "test_sig",
        plan_name: plan.name,
        business_id: localStorage.getItem("business_id")  
      })
    });

    const data = await response.json();

    if (response.ok) {
      // 🔑 NAYA TOKEN: Purana wala invalidate karke naya save karo
      localStorage.setItem("whatsapp_access_token", data.new_token); 
      localStorage.setItem("subscription_status", "active");
      
      alert("Payment Verified! Your new automation token is active.");
      navigate("/dashboard");
    } else {
      // Agar backend bole ki signature match nahi hua
      alert(`Verification failed: ${data.detail || "Unknown Error"}`);
    }
  } catch (err) {
    console.error("Verification Error:", err);
    alert("Server connection error during verification.");
  }
};

  return (
    /* Pricing.jsx mein return ke andar pehla tag update karo */
    <section id="pricing" className="relative py-40 bg-[#f6f6f3] border-t border-gray-200 z-10">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center mb-16">
          <h2 className="text-6xl font-black text-black tracking-tighter mb-6">Ready to <span className="text-indigo-600 italic font-serif">scale?</span></h2>
          
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

              {/* 🛠️ STEP 4: handlePayment Function Connect Karo */}
              /* Plans map ke andar button update karo */
              <button 
                onClick={(e) => {
                  e.preventDefault(); // Kisi bhi unwanted behavior ko rokne ke liye
                  handlePayment(plan);
                }}
                className={`relative z-20 mt-12 w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95 ${
                  plan.highlight ? 'bg-indigo-600 text-white shadow-xl' : 'bg-black text-white hover:bg-gray-800'
                }`}
              >
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