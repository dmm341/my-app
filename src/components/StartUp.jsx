import React from "react";
import { Link } from "react-router-dom";

const StartUp = () => {
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
      <h1 className="bg-green-300 text-4xl font-bold">Welcome to Avocado Hub</h1>
      <p className="bg-green-300 text-lg mt-2 text-black">
        The best place to get fresh avocados!
      </p>
      <div className="space-y-4 mt-6">
        <Link to="/login">
          <button className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold text-lg hover:bg-green-700 transition">
            Login
          </button>
        </Link>
        <Link to="/register">
          <button className="w-full px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold text-lg hover:bg-orange-600 transition">
            Register
          </button>
        </Link>
      </div>
    </div>
  );
};

export default StartUp;