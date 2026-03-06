// =============================
// Imports
// =============================
import React, { useState } from "react";
import { Flame, Thermometer, TrendingUp, MessageSquare } from "lucide-react";


// =============================
// Lead Panel (Premium Only)
// =============================
const LeadPanel = ({ leads, plan }) => {
  if (plan !== "PREMIUM") {
    return (
      <div className="p-6 bg-gray-100 rounded-xl text-center text-gray-500">
        🔒 Lead Intelligence is available on Premium plan only.
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 rounded-xl">
      <h1 className="text-2xl font-bold mb-6">High-Intent Leads</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {leads.map((lead) => (
          <div
            key={lead.id}
            className="bg-white rounded-xl shadow border p-4"
          >
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                {lead.classification === "Hot" ? (
                  <Flame className="text-orange-500" />
                ) : (
                  <Thermometer className="text-blue-400" />
                )}
                <span className="font-bold">
                  {lead.classification}
                </span>
              </div>

              <div className="flex items-center gap-1 text-green-600 font-bold">
                <TrendingUp size={16} />
                {lead.conversion_probability}%
              </div>
            </div>

            <h3 className="font-semibold">{lead.customer_phone}</h3>
            <p className="text-sm text-gray-500 mb-2">
              Intent: {lead.last_intent}
            </p>

            <div className="bg-gray-50 p-2 text-sm rounded border-l-4 border-purple-400 italic">
              "{lead.ai_summary}"
            </div>

            <button className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
              <MessageSquare size={16} className="inline mr-2" />
              Take Over Chat
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};


// =============================
// Conversion Funnel (Pro+)
// =============================
const ConversionFunnel = ({ data, plan }) => {
  if (plan === "STARTER") {
    return (
      <div className="p-6 bg-gray-100 rounded-xl text-center text-gray-500">
        🔒 Sales Analytics available in Pro & Premium plans.
      </div>
    );
  }

  const inquiryPercent = Math.round((data.inquiries / data.total) * 100);
  const quotePercent = Math.round((data.quotations / data.total) * 100);

  return (
    <div className="bg-white p-6 rounded-xl border shadow">
      <h3 className="text-lg font-bold mb-6">Sales Automation Funnel</h3>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Total Inbound Messages</span>
            <span className="font-bold">{data.total}</span>
          </div>
          <div className="w-full bg-gray-200 h-3 rounded">
            <div className="bg-blue-500 h-full w-full rounded"></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Product Inquiries</span>
            <span className="font-bold">{data.inquiries}</span>
          </div>
          <div className="w-full bg-gray-200 h-3 rounded">
            <div
              className="bg-blue-400 h-full rounded"
              style={{ width: `${inquiryPercent}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>AI Quotations</span>
            <span className="font-bold">{data.quotations}</span>
          </div>
          <div className="w-full bg-gray-200 h-3 rounded">
            <div
              className="bg-green-500 h-full rounded"
              style={{ width: `${quotePercent}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};


// =============================
// Pricing Table (Dynamic)
// =============================
const PricingTable = ({ onSelectPlan }) => {
  const tiers = [
    {
      name: "Starter",
      price: 499,
      features: [
        "Smart Replies",
        "Product Info",
        "Hindi/English Support",
        "Basic Automation",
      ],
    },
    {
      name: "Pro",
      price: 999,
      features: [
        "Quantity Detection",
        "Auto Calculations",
        "Session Memory",
        "Analytics Dashboard",
      ],
      highlight: true,
    },
    {
      name: "Premium",
      price: 1999,
      features: [
        "Lead Scoring",
        "Conversion Tracking",
        "Upselling Logic",
        "Priority Support",
      ],
    },
  ];

  return (
    <div className="py-10">
      <div className="grid md:grid-cols-3 gap-6">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`p-6 rounded-xl border ${
              tier.highlight
                ? "border-purple-500 shadow-lg"
                : "border-gray-200"
            }`}
          >
            <h3 className="text-xl font-bold">{tier.name}</h3>
            <p className="text-3xl font-extrabold mt-2">
              ₹{tier.price}/month
            </p>

            <ul className="mt-4 space-y-2">
              {tier.features.map((f) => (
                <li key={f}>✔ {f}</li>
              ))}
            </ul>

            <button
              onClick={() => onSelectPlan(tier.name)}
              className="mt-6 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
            >
              Choose Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};


// =============================
// Main Dashboard
// =============================
const Dashboard = () => {
  const [plan, setPlan] = useState("STARTER");

  const dummyLeads = [
    {
      id: 1,
      classification: "Hot",
      conversion_probability: 82,
      customer_phone: "+91 9876543210",
      last_intent: "Bulk Order",
      ai_summary: "Interested in 100 units. Asked for discount.",
    },
  ];

  const dummyFunnel = {
    total: 1240,
    inquiries: 840,
    quotations: 310,
  };

  const handlePlanSelect = async (selectedPlan) => {
    setPlan(selectedPlan);

    // Call backend to create subscription
    const res = await fetch("/create-subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        biz_id: "622bb52f-af29-4615-874f-ac49b3328b6c",
        plan: selectedPlan,
      }),
    });

    const data = await res.json();

    if (data.short_url) {
      window.location.href = data.short_url;
    }
  };

  return (
    <div className="space-y-10 p-6">
      <PricingTable onSelectPlan={handlePlanSelect} />
      <ConversionFunnel data={dummyFunnel} plan={plan} />
      <LeadPanel leads={dummyLeads} plan={plan} />
    </div>
  );
};

export default Dashboard;
