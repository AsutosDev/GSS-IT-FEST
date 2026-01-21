import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = "http://localhost:5000";

function App() {
  const [items, setItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // State for new item form
  const [newItem, setNewItem] = useState({ title: '', category: 'Tools', location: 'Kathmandu' });

  // 1. Fetch Items from Backend
  const fetchItems = async () => {
    const res = await axios.get(`${API_BASE}/items`);
    setItems(res.data);
  };

  useEffect(() => { fetchItems(); }, []);

  // 2. Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/login`, { email, password });
      if (res.data.success) setIsLoggedIn(true);
    } catch (err) { alert("Invalid Credentials"); }
  };

  // 3. Handle Adding Item
  const handleAddItem = async (e) => {
    e.preventDefault();
    await axios.post(`${API_BASE}/add-item`, newItem);
    setNewItem({ title: '', category: 'Tools', location: 'Kathmandu' });
    fetchItems(); // Refresh list
  };

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <form onSubmit={handleLogin} className="p-8 bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-blue-600">Sharehood Login</h2>
          <input className="border p-2 w-full mb-2" placeholder="Email" onChange={e => setEmail(e.target.value)} />
          <input className="border p-2 w-full mb-4" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
          <button className="bg-blue-600 text-white w-full py-2 rounded">Enter Community</button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-blue-700">Sharehood Nepal 🇳🇵</h1>
        <span className="text-green-600 font-medium">Logged in as {email}</span>
      </header>

      {/* Add Item Section */}
      <section className="bg-blue-50 p-6 rounded-xl mb-8">
        <h2 className="font-bold mb-3 text-lg">Lend an Item</h2>
        <form onSubmit={handleAddItem} className="flex gap-2">
          <input className="border p-2 flex-1 rounded" placeholder="What are you lending? (e.g. Drill)" 
            value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} />
          <input className="border p-2 w-32 rounded" placeholder="Location" 
            value={newItem.location} onChange={e => setNewItem({...newItem, location: e.target.value})} />
          <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">List It</button>
        </form>
      </section>

      {/* Display Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map(item => (
          <div key={item._id} className="border p-4 rounded-lg shadow-sm hover:shadow-md transition bg-white">
            <h3 className="text-xl font-semibold">{item.title}</h3>
            <p className="text-gray-500">{item.category} • {item.location}</p>
            <button className="mt-3 text-blue-600 font-bold">Request to Borrow →</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;