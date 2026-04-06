import React, { useState, useEffect } from 'react';
import { useGoogleLogin, useGoogleOneTapLogin } from '@react-oauth/google';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // 👈 1. Import useNavigate

export default function Login() {
  const [isLogoSet, setIsLogoSet] = useState(false);
  const navigate = useNavigate(); // 👈 2. Initialize hook

  useGoogleOneTapLogin({
    onSuccess: (res) => {
      localStorage.setItem("token", res.credential);
      navigate("/"); // 👈 3. Dashboard ki jagah Landing par bhejo
    },
  });

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (res) => {
      try {
        const response = await fetch("http://127.0.0.1:8000/google-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: res.access_token })
        });

        const data = await response.json();

        if (data.business_id) {
          localStorage.setItem("token", data.token || res.access_token);
          localStorage.setItem("business_id", data.business_id);
          
          // ✅ 4. Final Redirect Change
          navigate("/"); // Dashboard se hatakar Home par
        } else {
          alert("Login failed: Business ID not returned from backend");
        }
      } catch (err) {
        console.error("Login Error:", err);
        alert("Backend connection failed during login!");
      }
    },
  });

  const boxClass = "w-full flex items-center justify-center gap-3 border border-white/10 bg-[#111111] hover:bg-[#181818] py-3 rounded-xl transition-all duration-200 cursor-pointer shadow-lg active:scale-[0.98] group";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] text-white px-6 font-sans overflow-hidden">
      
      {/* ⚡ STEP 1: THE ORIGINAL NEXORA 'N' DRAWING */}
      <div className="relative mb-8 flex items-center justify-center">
        <motion.div
          initial={{ backgroundColor: "rgba(79, 70, 229, 0)" }}
          animate={isLogoSet ? { backgroundColor: "rgba(79, 70, 229, 1)" } : {}}
          transition={{ duration: 0.5 }}
          className="w-16 h-16 rounded-2xl flex items-center justify-center relative overflow-hidden shadow-[0_0_30px_rgba(79,70,229,0.3)]"
        >
          <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <motion.path
              // ✅ Nexora Style Angled 'N' Path
              d="M25 80L25 20L75 80L75 20" 
              stroke="white"
              strokeWidth="12"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              onAnimationComplete={() => setIsLogoSet(true)}
            />
          </svg>
        </motion.div>
      </div>

      {/* 📦 STEP 2: CONTENT REVEAL (Everything you confirmed) */}
      <AnimatePresence>
        {isLogoSet && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-[400px] flex flex-col items-center"
          >
            <h1 className="text-3xl font-bold tracking-tight mb-2 text-center leading-tight italic">
                Nexora: your AI workspace.
            </h1>
            <p className="text-gray-500 text-base font-medium mb-12">Log in to your account</p>

            <div className="w-full space-y-4">
              {/* Google Block - With Real Icon */}
              <div onClick={() => loginWithGoogle()} className={`${boxClass} border-white/20 bg-white hover:bg-gray-100`}>
                <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                <span className="text-black font-bold text-sm">Continue with Google</span>
              </div>

              <div className="flex items-center gap-3 w-full opacity-30 py-2">
                 <div className="h-[1px] bg-white flex-1"></div>
                 <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">More methods</span>
                 <div className="h-[1px] bg-white flex-1"></div>
              </div>

              {/* Grid Buttons with Proper Logos */}
              <div className="grid grid-cols-2 gap-4 text-gray-400 font-semibold text-xs">
                <div className={boxClass}>
                   <svg width="18" height="18" fill="white" viewBox="0 0 16 16"><path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516.024.034 1.52.087 2.475-1.258.955-1.345.762-2.391.728-2.43Zm3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422.212-2.189 1.675-2.789 1.698-2.854.023-.065-.597-.79-1.254-1.157a3.692 3.692 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.308.083-1.193.34-1.49.34-.307 0-1.035-.328-1.323-.408-.31-.087-.992-.375-1.802-.212-.81.162-1.816.903-2.36 1.713-.583.87-.928 2.227-.265 4.39.663 2.162 2.137 5.146 3.821 5.146.417 0 1.268-.322 1.627-.322.358 0 1.15.318 1.564.318 1.621 0 2.977-2.618 3.518-3.763.15-.316.143-.323.08-.448Z"/></svg>
                   <span>Apple</span>
                </div>
                <div className={boxClass}>
                   <svg width="18" height="18" viewBox="0 0 23 23"><path fill="#f35325" d="M0 0h11.4v11.4H0z"/><path fill="#81bc06" d="M12.4 0H23.8v11.4H12.4z"/><path fill="#05a6f0" d="M0 12.4h11.4V23.8H0z"/><path fill="#ffba08" d="M12.4 12.4H23.8V23.8H12.4z"/></svg>
                   <span>Microsoft</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-gray-400 font-semibold text-xs">
                <div className={boxClass}>
                   <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg>
                   <span>Passkey</span>
                </div>
                <div className={boxClass}>
                   <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                   <span>SSO</span>
                </div>
              </div>
            </div>

            <p className="mt-12 text-[11px] text-gray-600 text-center leading-relaxed">
              By continuing, you agree to Nexora's <span className="underline decoration-gray-700 cursor-pointer">Terms</span> and <span className="underline decoration-gray-700 cursor-pointer">Privacy Policy</span>.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}