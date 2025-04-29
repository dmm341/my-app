import React from 'react';
import { useNavigate } from 'react-router-dom';

const LayoutSelector = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100">
      <h1 className="text-2xl font-bold mb-4">Choose a Layout</h1>
      <button
        onClick={() => navigate('/dashboard')}
        className="bg-green-500 text-white px-6 py-3 m-2 rounded-lg"
      >
        first Layout
      </button>
      <button
        onClick={() => navigate('/newlayout')}
        className="bg-blue-500 text-white px-6 py-3 m-2 rounded-lg"
      >
        new Layout
      </button>
    </div>
  );
};

export default LayoutSelector;
