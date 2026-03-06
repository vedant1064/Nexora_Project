import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 1. Dashboard & Auth Pages
import DashboardMain from "./DashboardMain";
import Login from "./pages/dashboard/Login";
import Signup from "./pages/dashboard/Signup";
import ResetPassword from "./pages/dashboard/ResetPassword";

// 2. Landing Page Imports (Aapke saare purane imports)
import Navbar from "./components/Navbar";
import HeroPremium from "./components/HeroPremium";
import LogoMarquee from "./components/LogoMarquee";
import PreviewSection from "./components/PreviewSection";
import AutonomousFlow from "./components/AutonomousFlow";
import FeatureGrid from "./components/FeatureGrid";
import CreativeBlueprint from "./components/CreativeBlueprint";
import NeuralSketchpad from "./components/NeuralSketchpad";
import NotionStyleBlocks from "./components/NotionStyleBlocks";
import IntegrationGrid from "./components/IntegrationGrid";
import Comparison from "./components/Comparison";
import PipelineSection from "./components/PipelineSection";
import StripeStorySection from "./components/StripeStorySection";
import Pricing from "./components/Pricing";
import SystemUniverse from "./components/SystemUniverse";
import FinalCTA from "./components/FinalCTA";

// LANDING PAGE COMPONENT (Aapka pura UI yahan safe hai)
const Landing = () => (
  <div className="bg-[#050505] text-white selection:bg-indigo-500/30 overflow-x-hidden">
    <Navbar />
    <main>
      <section id="hero"><HeroPremium /><LogoMarquee /></section>
      <section id="preview"><PreviewSection /></section>
      <section id="art-flow"><AutonomousFlow /></section>
      <FeatureGrid />
      <CreativeBlueprint />
      <NeuralSketchpad />
      <section id="technical">
        <NotionStyleBlocks /><IntegrationGrid /><Comparison /><PipelineSection />
      </section>
      <StripeStorySection />
      <Pricing />
      <section id="final-zone"><SystemUniverse /><FinalCTA /></section>
    </main>
    <footer className="py-20 border-t border-white/5 bg-black text-center">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center gap-4">
           <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center font-bold italic">N</div>
           <p className="text-gray-600 text-[10px] font-mono tracking-[0.4em] uppercase">&copy; 2026 NEXORA AI // ALL SYSTEMS OPERATIONAL.</p>
        </div>
      </div>
    </footer>
  </div>
);

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard" element={<DashboardMain />} />
      </Routes>
    </Router>
  );
}