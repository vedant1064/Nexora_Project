import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

export default function PhonePreview() {

  const scrollRef = useRef();

  // auto scroll loop
  useEffect(() => {

    const el = scrollRef.current;

    let pos = 0;

    const interval = setInterval(() => {

      pos += 1;

      if (pos >= el.scrollHeight - el.clientHeight) {
        pos = 0;
      }

      el.scrollTop = pos;

    }, 30);

    return () => clearInterval(interval);

  }, []);

  return (

    <motion.div
      initial={{ opacity: 0, y: 80, rotate: -8 }}
      whileInView={{ opacity: 1, y: 0, rotate: -4 }}
      whileHover={{ rotate: 0, scale: 1.05 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: false }}
      className="relative"
    >

      {/* phone frame */}
      <div className="w-[300px] h-[600px] bg-black rounded-[40px] p-3 shadow-2xl border border-white/10">

        {/* screen */}
        <div
          ref={scrollRef}
          className="
            w-full h-full
            bg-[#0b141a]
            rounded-[30px]
            overflow-hidden
            p-4
            space-y-3
          "
        >

          <Chat text="Hi 👋" side="left"/>
          <Chat text="Hello! How can I help?" side="right"/>
          <Chat text="Price kya hai?" side="left"/>
          <Chat text="₹499 per month plan hai" side="right"/>
          <Chat text="Demo dikhao" side="left"/>
          <Chat text="Sure, sending now..." side="right"/>
          <Chat text="Thanks!" side="left"/>
          <Chat text="Welcome 😊" side="right"/>

          {/* duplicate for infinite loop */}
          <Chat text="Hi 👋" side="left"/>
          <Chat text="Hello! How can I help?" side="right"/>
          <Chat text="Price kya hai?" side="left"/>
          <Chat text="₹499 per month plan hai" side="right"/>

        </div>

      </div>

    </motion.div>

  );
}


function Chat({ text, side }) {

  const isRight = side === "right";

  return (

    <motion.div
      initial={{ opacity: 0, x: isRight ? 50 : -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className={`flex ${isRight ? "justify-end" : "justify-start"}`}
    >

      <div className={`
        px-4 py-2
        rounded-xl
        max-w-[70%]
        text-sm
        ${isRight
          ? "bg-green-500 text-black"
          : "bg-gray-800 text-white"}
      `}>

        {text}

      </div>

    </motion.div>

  );

}