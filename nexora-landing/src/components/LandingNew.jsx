import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function LandingNew() {

  return (

    <div style={styles.container}>

      {/* ORB 1 */}
      <motion.div
        animate={{ x:[0,50,0], y:[0,30,0] }}
        transition={{ duration:12, repeat:Infinity }}
        style={{
          position:"absolute",
          width:"600px",
          height:"600px",
          background:"radial-gradient(circle,#6366F1,transparent)",
          filter:"blur(120px)",
          opacity:0.15,
          top:"-200px",
          left:"-200px"
        }}
      />

      {/* ORB 2 */}
      <motion.div
        animate={{ x:[0,-50,0], y:[0,-30,0] }}
        transition={{ duration:14, repeat:Infinity }}
        style={{
          position:"absolute",
          width:"500px",
          height:"500px",
          background:"radial-gradient(circle,#8B5CF6,transparent)",
          filter:"blur(120px)",
          opacity:0.15,
          bottom:"-200px",
          right:"-200px"
        }}
      />

      <Navbar />

      <Hero />

      <DashboardSimulation />

      <Features />

      <AutomationDemo />

      <Pricing />

      <CTA />

      <Footer />

    </div>

  );

}


/* NAVBAR */

function Navbar() {

  return (

    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={styles.navbar}
    >

      <div style={styles.logo}>
        Nexora
      </div>

      <div style={styles.navRight}>

        <button style={styles.secondaryBtn}>
          Login
        </button>

        <button style={styles.primaryBtn}>
          Start Free
        </button>

      </div>

    </motion.div>

  );

}


/* HERO */

function Hero() {

  return (

    <div style={styles.hero}>
        <motion.div
        animate={{ opacity:[0.2,0.4,0.2] }}
        transition={{ duration:4, repeat:Infinity }}
        style={{
            position:"absolute",
            width:"600px",
            height:"200px",
            background:"linear-gradient(90deg,#6366F1,#8B5CF6)",
            filter:"blur(120px)",
            top:"120px",
            left:"50%",
            transform:"translateX(-50%)",
            opacity:0.2
        }}
        />

      <motion.h1
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{duration: 1.2,ease: "easeOut"}}
        style={styles.headline}
      >

        Run Your Business
        <br />

        <span style={styles.gradient}>
          on Autopilot
        </span>

      </motion.h1>


      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 0.3 }}
        style={styles.subtext}
      >

        AI that automates sales, support, and workflows instantly.

      </motion.p>


      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={styles.heroBtns}
      >

        <button style={styles.primaryBtn}>
          Start Free
        </button>

        <button style={styles.secondaryBtn}>
          Watch Demo
        </button>

      </motion.div>

    </div>

  );

}


/* DASHBOARD SIMULATION */

function DashboardSimulation() {

    const [messages, setMessages] = useState([
    "Customer: Hi, I need help with pricing",
    ]);

    const aiReplies = [
    "AI: Sure. Here are our plans.",
    "AI: Pro plan recommended.",
    "AI: Automation enabled.",
    "AI: Pipeline updated."
    ];

    useEffect(() => {

    let i = 0;

    const interval = setInterval(() => {

        setMessages(prev => {

        if(i >= aiReplies.length) return prev;

        return [...prev, aiReplies[i++]];

        });

    }, 1800);

    return () => clearInterval(interval);

    }, []);


  return (

    <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 100 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        whileHover={{ scale: 1.02 }}
    >

      {/* chart */}

      <div style={styles.chart}>

    {[40,70,55,90,65].map((h,i)=>(

        <motion.div
        key={i}
        initial={{ height:0 }}
        animate={{ height:h+"px" }}
        transition={{ duration:1, delay:i*0.2 }}
        style={{
            width:"20%",
            background:"linear-gradient(#6366F1,#8B5CF6)",
            borderRadius:"4px"
        }}
        />

    ))}

    </div>

      {/* pipeline */}

      <div style={styles.pipeline}>
        <div style={styles.pipelineStage} />
        <div style={styles.pipelineStage} />
        <div style={styles.pipelineStage} />
      </div>

      {/* chat */}

      <div style={styles.chat}>

        {messages.slice(-4).map((m, i) => (

          <div key={i} style={styles.chatMsg}>
            {m}
          </div>

        ))}

      </div>

    </motion.div>

  );

}


/* FEATURES */

function Features() {

  const items = [

    "AI Chat Automation",

    "WhatsApp Automation",

    "Sales Pipeline Automation",

    "Customer Intelligence",

    "Live Dashboard",

    "Workflow Automation"

  ];


  return (

    <div style={styles.features}>

      {items.map((item, i) => (

        <motion.div
        key={i}
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{
            scale: 1.05,
            boxShadow: "0 0 40px rgba(99,102,241,0.4)"
        }}
        transition={{ duration: 0.4 }}
        style={styles.featureCard}
        >

          {item}

        </motion.div>

      ))}

    </div>

  );

}


/* AUTOMATION DEMO */

function AutomationDemo() {

  return (

    <div style={styles.demo}>

      AI automatically responds, updates pipeline, and manages workflows.

    </div>

  );

}


/* PRICING */

function Pricing() {

  return (

    <div style={styles.pricing}>

      {["Free", "Pro", "Enterprise"].map((plan, i) => (

        <div key={i} style={styles.priceCard}>
          {plan}
        </div>

      ))}

    </div>

  );

}


/* CTA */

function CTA() {

  return (

    <div style={styles.cta}>

      Start automating your business today.

      <br />

      <button style={styles.primaryBtn}>
        Start Free
      </button>

    </div>

  );

}


/* FOOTER */

function Footer() {

  return (

    <div style={styles.footer}>
      © Nexora AI
    </div>

  );

}


/* STYLES */

const styles = {

container:{
background:"#0B0F1A",
color:"white",
fontFamily:"Inter",
minHeight:"100vh",
position:"relative",
overflow:"hidden",
perspective:"1000px"
},

navbar:{
display:"flex",
justifyContent:"space-between",
padding:"20px 40px",
position:"sticky",
top:0,
background:"rgba(11,15,26,0.5)",
backdropFilter:"blur(10px)",
borderBottom:"1px solid rgba(255,255,255,0.05)",
zIndex:10
},

logo:{
fontSize:"20px",
fontWeight:"600"
},

navRight:{
display:"flex",
gap:"15px"
},

hero:{
textAlign:"center",
marginTop:"140px",
marginBottom:"80px"
},

headline:{
fontSize:"clamp(48px, 8vw, 96px)",
fontWeight:"700",
letterSpacing:"-2px",
lineHeight:"1.1"
},

gradient:{
background:"linear-gradient(90deg,#6366F1,#8B5CF6)",
WebkitBackgroundClip:"text",
color:"transparent"
},

subtext:{
marginTop:"20px",
fontSize:"20px",
color:"#9CA3AF"
},

heroBtns:{
marginTop:"30px",
display:"flex",
justifyContent:"center",
gap:"15px"
},

primaryBtn:{
background:"linear-gradient(90deg,#6366F1,#8B5CF6)",
border:"none",
padding:"12px 24px",
borderRadius:"8px",
color:"white"
},

secondaryBtn:{
background:"transparent",
border:"1px solid #374151",
padding:"12px 24px",
borderRadius:"8px",
color:"white"
},

dashboard:{
width:"900px",
margin:"80px auto",
background:"#111827",
padding:"20px",
borderRadius:"16px",
boxShadow:"0 0 40px rgba(99,102,241,0.15)",
border:"1px solid rgba(255,255,255,0.05)"
},

chart:{
display:"flex",
alignItems:"flex-end",
gap:"8px",
height:"120px"
},

pipeline:{
display:"flex",
gap:"10px",
marginTop:"20px"
},

pipelineStage:{
flex:1,
height:"60px",
background:"#1F2937",
borderRadius:"6px"
},

chat:{
marginTop:"20px"
},

chatMsg:{
background:"#1F2937",
padding:"10px",
marginTop:"5px",
borderRadius:"6px"
},

features:{
display:"grid",
gridTemplateColumns:"repeat(3,1fr)",
gap:"20px",
padding:"80px"
},
featureCard:{
background:"#111827",
padding:"30px",
borderRadius:"12px",
border:"1px solid rgba(255,255,255,0.05)",
transition:"0.3s",
cursor:"pointer",
boxShadow:"0 0 0 rgba(99,102,241,0)"
},

demo:{
textAlign:"center",
marginTop:"100px",
fontSize:"24px"
},

pricing:{
display:"flex",
gap:"20px",
justifyContent:"center",
marginTop:"80px"
},

priceCard:{
background:"#111827",
padding:"40px",
borderRadius:"12px"
},

cta:{
textAlign:"center",
marginTop:"100px",
fontSize:"32px"
},

footer:{
textAlign:"center",
padding:"40px",
opacity:"0.5"
}

};