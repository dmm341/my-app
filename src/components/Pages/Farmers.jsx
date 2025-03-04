import React, { useState, useEffect } from "react";

const Farmers = () => {
  const [farmers, setFarmers] = useState([]);
  const [newFarmer, setNewFarmer] = useState({
    name: "",
    contact: "",
    location: "",
    avocado_type: "Hass",
    total_fruits: 0,
    total_money: 0.0,
  });
  const [editingFarmer, setEditingFarmer] = useState(null);
  const [showForm, setShowForm] = useState(false); // State to control form visibility

  // Fetch all farmers
  useEffect(() => {
    fetch("http://localhost:5000/farmers")
      .then((res) => res.json())
      .then((data) => setFarmers(data))
      .catch((error) => console.error("Error fetching farmers:", error));
  }, []);

  // Add or Update Farmer
  const saveFarmer = async () => {
    if (!newFarmer.name || !newFarmer.contact || !newFarmer.location) return;

    const url = editingFarmer
      ? `http://localhost:5000/farmers/${editingFarmer.id}`
      : "http://localhost:5000/farmers";

    const method = editingFarmer ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newFarmer),
    });

    if (response.ok) {
      setNewFarmer({ name: "", contact: "", location: "", avocado_type: "Hass", total_fruits: 0, total_money: 0.0 });
      setEditingFarmer(null);
      setShowForm(false); // Hide form after save
      window.location.reload();
    }
  };

  // Delete Farmer
  const deleteFarmer = async (id) => {
    if (!window.confirm("Are you sure you want to delete this farmer?")) return;

    const response = await fetch(`http://localhost:5000/farmers/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("Farmer deleted successfully!");
      setFarmers(farmers.filter((farmer) => farmer.id !== id));
    } else {
      alert("Failed to delete farmer.");
    }
  };

  // Populate fields for editing
  const editFarmer = (farmer) => {
    setNewFarmer(farmer);
    setEditingFarmer(farmer);
    setShowForm(true); // Show form when editing
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Farmers</h2>

      {/* Action Buttons */}
      <div className="mb-4 flex space-x-4">
        <button onClick={() => { setShowForm(true); setEditingFarmer(null); }} className="bg-green-500 text-white px-4 py-2 rounded">
          Add Farmer
        </button>
      </div>

      {/* Add/Edit Farmer Form (Hidden by Default) */}
      {showForm && (
        <div className="bg-gray-100 p-4 mb-6 rounded shadow">
          <h3 className="text-xl font-bold mb-2">{editingFarmer ? "Edit Farmer" : "Add Farmer"}</h3>
          <div className="space-y-2">
            <input type="text" placeholder="Name" value={newFarmer.name} onChange={(e) => setNewFarmer({ ...newFarmer, name: e.target.value })} className="p-2 border rounded w-full" />
            <input type="text" placeholder="Contact" value={newFarmer.contact} onChange={(e) => setNewFarmer({ ...newFarmer, contact: e.target.value })} className="p-2 border rounded w-full" />
            <input type="text" placeholder="Location" value={newFarmer.location} onChange={(e) => setNewFarmer({ ...newFarmer, location: e.target.value })} className="p-2 border rounded w-full" />

            {/* Avocado Type Dropdown */}
            <select value={newFarmer.avocado_type} onChange={(e) => setNewFarmer({ ...newFarmer, avocado_type: e.target.value })} className="p-2 border rounded w-full">
              <option value="Hass">Hass</option>
              <option value="Fuerte">Fuerte</option>
              <option value="Both">Both</option>
            </select>

            <input type="number" placeholder="Total Fruits" value={newFarmer.total_fruits} onChange={(e) => setNewFarmer({ ...newFarmer, total_fruits: e.target.value })} className="p-2 border rounded w-full" />
            <input type="number" placeholder="Total Money Given" value={newFarmer.total_money} onChange={(e) => setNewFarmer({ ...newFarmer, total_money: e.target.value })} className="p-2 border rounded w-full" />

            <div className="flex space-x-4">
              <button onClick={saveFarmer} className="bg-blue-500 text-white px-4 py-2 rounded">
                {editingFarmer ? "Update" : "Save"}
              </button>
              <button onClick={() => setShowForm(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Farmers Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Contact</th>
            <th className="border border-gray-300 px-4 py-2">Location</th>
            <th className="border border-gray-300 px-4 py-2">Avocado Type</th>
            <th className="border border-gray-300 px-4 py-2">Total Fruits</th>
            <th className="border border-gray-300 px-4 py-2">Total Money</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {farmers.map((farmer) => (
            <tr key={farmer.id} className="text-center">
              <td className="border border-gray-300 px-4 py-2">{farmer.id}</td>
              <td className="border border-gray-300 px-4 py-2">{farmer.name}</td>
              <td className="border border-gray-300 px-4 py-2">{farmer.contact}</td>
              <td className="border border-gray-300 px-4 py-2">{farmer.location}</td>
              <td className="border border-gray-300 px-4 py-2">{farmer.avocado_type}</td>
              <td className="border border-gray-300 px-4 py-2">{farmer.total_fruits}</td>
              <td className="border border-gray-300 px-4 py-2">ksh{farmer.total_money}</td>
              <td className="border border-gray-300 px-4 py-2">
                <button onClick={() => editFarmer(farmer)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">Edit</button>
                <button onClick={() => deleteFarmer(farmer.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Farmers;
