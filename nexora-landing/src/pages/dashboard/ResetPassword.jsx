import { useState, useEffect } from "react";

export default function ResetPassword() {

  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {

    const params = new URLSearchParams(window.location.search);
    const t = params.get("token");

    if (t) {
      setToken(t);
    }

  }, []);

  function resetPassword() {

    fetch("http://127.0.0.1:8000/reset-password", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        token: token,
        new_password: password
      })

    })
    .then(res => res.json())
    .then(data => {

      alert("Password reset successful");

      window.location.href = "/";

    });

  }

  return (

    <div className="flex items-center justify-center h-screen bg-gray-950">

      <div className="bg-gray-900 p-6 rounded-xl w-96">

        <h2 className="text-2xl mb-4 text-white">
          Reset Password
        </h2>

        <input
          type="password"
          placeholder="New Password"
          onChange={(e) => setPassword(e.target.value)}
          className="block mb-4 p-2 bg-gray-800 text-white w-full"
        />

        <button
          onClick={resetPassword}
          className="bg-indigo-600 px-4 py-2 rounded text-white w-full"
        >
          Reset Password
        </button>

      </div>

    </div>

  );

}
