import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert("Registration successful!");
        navigate("/login"); // Redirect to login page
      } else {
        alert(data.error || "Registration failed.");
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
      className="flex flex-col items-center justify-center text-black"
    >
      <h2 className="text-3xl font-bold text-white">Register</h2>
      <form onSubmit={handleSubmit} className="flex flex-col mt-4">
        <input
          type="text"
          placeholder="Username"
          className="p-2 mb-2 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
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
        <button type="submit" className="bg-blue-500 px-6 py-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;