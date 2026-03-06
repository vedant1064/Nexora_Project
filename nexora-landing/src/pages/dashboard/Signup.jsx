import { useState } from "react";

export default function Signup({ onSignup }) {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [blink, setBlink] = useState(false);


  function signup() {
    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    fetch("http://127.0.0.1:8000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    })
    .then(res => res.json())
    .then(data => {
      // ✅ Check karo agar backend token bhej raha hai (Auto-Login)
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("business_id", data.business_id);
        alert("Account created! Redirecting to Dashboard...");
        window.location.href = "/dashboard"; // 🚀 Sidha dashboard pe entry
      } 
      // ✅ Agar sirf success status aa raha hai (Manual Login flow)
      else if (data.status) {
        alert("Account created successfully! Please login.");
        onSignup(); // Login page par bheje ga
      } else {
        alert("Signup failed: " + (data.detail || "Unknown error"));
      }
    })
    .catch(() => {
      alert("Server error");
    });
  }


  // ✅ ENTER KEY HANDLER
  function handleSubmit(e) {

    e.preventDefault();
    signup();

  }


  return (

    <div className="flex items-center justify-center h-screen bg-gray-950">

      <div className="bg-gray-900 p-8 rounded-2xl w-96 border border-gray-800 shadow-2xl">

        <h2 className="text-white text-2xl mb-4">
          Create Account
        </h2>


        {/* ✅ FORM START */}
        <form onSubmit={(e) => {
            e.preventDefault();
            signup();
            }}>


          {/* NAME */}
          <input
            type="text"
            placeholder="Name"
            className="w-full mb-3 p-2 bg-gray-800 text-white rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />


          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-3 p-2 bg-gray-800 text-white rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />


          {/* PASSWORD WITH EYE */}
          <div className="relative mb-3">

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-2 bg-gray-800 text-white pr-10 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <span
              onClick={() => {

                setBlink(true);

                setTimeout(() => {

                  setShowPassword(!showPassword);
                  setBlink(false);

                }, 150);

              }}
              className={`absolute right-3 top-2 cursor-pointer text-gray-400 hover:text-white transition-all duration-150 ${
                blink
                  ? "scale-75 opacity-50"
                  : "scale-100 opacity-100"
              }`}
            >
              👁️
            </span>

          </div>


          {/* SIGNUP BUTTON */}
          <button
            type="submit"
            className="bg-indigo-600 px-4 py-2 rounded text-white w-full"
          >
            Signup
          </button>


        </form>
        {/* ✅ FORM END */}


        {/* BACK TO LOGIN */}
        <div className="text-center mt-3">

          <button
            onClick={onSignup}
            className="text-sm text-gray-400 hover:text-white"
          >
            Back to Login
          </button>

        </div>


      </div>

    </div>

  );

}
