import { useState } from "react";

export default function Login({ onLogin }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [blink, setBlink] = useState(false);

  const [forgotMode, setForgotMode] = useState(false);


  function login() {
    fetch("http://127.0.0.1:8000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(data => {
      if (data.token) {
        // 1. Storage update karo
        localStorage.setItem("token", data.token);
        localStorage.setItem("business_id", data.business_id);

        // 2. Hard Refresh (Taki App naya token uthaye)
        window.location.href = "/dashboard"; 
      } else {
        alert("Invalid email or password");
      }
    })
    .catch(err => alert("Backend band hai shayad!"));
  }


  function forgotPassword() {

    if (!email) {

      alert("Enter email first");
      return;

    }

    fetch("http://127.0.0.1:8000/forgot-password", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        email
      })

    })
    .then(() => {

      alert("Reset link sent");
      setForgotMode(false);

    });

  }


  // ✅ ENTER KEY HANDLER (FORM SUBMIT)
  function handleSubmit(e) {

    e.preventDefault();

    if (forgotMode) {
      forgotPassword();
    } else {
      login();
    }

  }


  return (

    <div className="flex items-center justify-center h-screen bg-gray-950">

      <div className="bg-gray-900 p-8 rounded-2xl w-96 border border-gray-800 shadow-2xl">

        <h2 className="text-white text-2xl mb-4">
          Login
        </h2>


        {/* ✅ FORM START */}
        <form onSubmit={(e) => {
            e.preventDefault();
            login();
          }}>



          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-3 p-2 bg-gray-800 text-white rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />


          {/* PASSWORD */}
          {!forgotMode && (

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

          )}


          {/* BUTTON */}
          <button
            type="submit"
            className="bg-indigo-600 px-4 py-2 rounded text-white w-full"
          >
            {forgotMode ? "Send Reset Link" : "Login"}
          </button>


        </form>
        {/* ✅ FORM END */}


        {/* FORGOT PASSWORD */}
        <div
          onClick={() => setForgotMode(!forgotMode)}
          className="text-indigo-400 mt-3 cursor-pointer text-sm text-center"
        >
          {forgotMode ? "Back to Login" : "Forgot Password?"}
        </div>


        {/* SIGNUP */}
        <div className="text-center mt-3">

          <button
            onClick={() => onLogin("signup")}
            className="text-sm text-gray-400 hover:text-white"
          >
            Create account
          </button>

        </div>


      </div>

    </div>

  );

}
