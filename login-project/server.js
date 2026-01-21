const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to your MongoDB
mongoose.connect('mongodb://localhost:27017/loginSystem')
  .then(() => console.log("✅ Connected to MongoDB!"))
  .catch(err => console.error("❌ Connection error:", err));

// Simple User Schema
const User = mongoose.model('User', new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true }
}));

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });

  if (user) {
    res.json({ success: true, message: "Login successful!" });
  } else {
    res.status(401).json({ success: false, message: "Invalid email or password" });
  }
});
app.get('/', (req, res) => {
  res.send("Server is running! Ready for the Hackathon.");
});
app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));