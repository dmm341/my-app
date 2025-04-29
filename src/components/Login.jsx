import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user)); // Store user details
        alert("Login successful!");
        navigate("/LayoutSelector"); // Redirect to dashboard
      } else {
        alert(data.message || "Invalid credentials.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  

  return (
    <div
      style={{
        backgroundImage: "url('/src/bg1.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
      }}
      className="flex flex-col items-center justify-center text-white"
    >
      <h2 className="text-3xl font-bold ">Login</h2>
      <form onSubmit={handleSubmit} className="flex flex-col mt-4 text-black">
        <input
          type="email"
          placeholder="Email"
          className="p-2 mb-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="p-2 mb-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="bg-green-500 px-6 py-2 rounded text-white">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;