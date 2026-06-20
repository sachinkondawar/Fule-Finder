require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "fuel_finder_super_secret_key_12345";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// ✅ MongoDB Connection (EDIT THIS)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ DB Error:", err));


// ✅ Fuel Station Schema
const stationSchema = new mongoose.Schema({
  name: String,
  lat: Number,
  lng: Number,
  address: String,
  petrol: Boolean,
  diesel: Boolean,
  cng: Boolean,
  isOpen: Boolean
});

const Station = mongoose.model("Station", stationSchema);

// ✅ User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" } // 'user' or 'admin'
});
const User = mongoose.model("User", userSchema);

// 🔐 Middleware: Verify Admin Token
const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    if (verified.role !== "admin") return res.status(403).json({ error: "Admin access required." });
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token." });
  }
};


// 📏 Distance Function (Haversine Formula)
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;

  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}


// 🔐 Auth 1: Register User
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({ email, password: hashedPassword, role: role || "user" });
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ error: "Registration failed. Email might already exist." });
  }
});

// 🔐 Auth 2: Login User
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign({ _id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, role: user.role, email: user.email });
  } catch (err) {
    res.status(500).json({ error: "Server login error" });
  }
});

// 🚀 API 1: Add Fuel Station (Protected)
app.post("/api/stations", verifyAdmin, async (req, res) => {
  try {
    const station = await Station.create(req.body);
    res.json(station);
  } catch (err) {
    res.status(500).json({ error: "Failed to add station" });
  }
});


// 🚀 API 2: Get All Stations
app.get("/api/stations", async (req, res) => {
  try {
    const stations = await Station.find();
    res.json(stations);
  } catch (err) {
    res.status(500).json({ error: "Error fetching stations" });
  }
});


// 🚀 API 2: Get Nearby Stations
app.get("/api/nearby", async (req, res) => {
  try {
    const { lat, lng, radius } = req.query;
    if (!lat || !lng) return res.status(400).json({ error: "Location needed" });

    const maxDistance = radius ? parseFloat(radius) : 20;
    const stations = await Station.find();

    // Calculate distance and filter
    const nearby = stations
      .map(station => {
        const distance = getDistance(parseFloat(lat), parseFloat(lng), station.lat, station.lng);
        return { ...station.toObject(), distance };
      })
      .filter(station => station.distance <= maxDistance)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 50);

    res.json(nearby);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch nearby stations" });
  }
});


// 🚀 API 4: Update Station (Protected)
app.put("/api/stations/:id", verifyAdmin, async (req, res) => {
  try {
    const updated = await Station.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});


// 🚀 API 5: Delete Station (Protected)
app.delete("/api/stations/:id", verifyAdmin, async (req, res) => {
  try {
    await Station.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});


// 🏠 Test Route
app.get("/", (req, res) => {
  res.send("🚀 Fuel Finder Backend Running");
});


// ▶️ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});