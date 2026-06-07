const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

const connectDB = require("./config/db");
const authRegister = require("./routes/auth");
const ClassRoute = require("./routes/classRoutes");
const contentRoutes = require("./routes/contentRoutes");
const studentRoutes = require("./routes/studentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const { seedSuperAdmin } = require("./controllers/adminController");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB().then(() => {
  seedSuperAdmin();
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL, // frontend port
  credentials: true,
  methods:[ 'GET','HEAD','PUT','PATCH','POST','DELETE'],
  allowHeaders:['content-type','Authorization']
  
}));
app.use(express.json());

// Serve uploaded files
const uploadsPath = path.join(__dirname, "uploads");
const profileImagesPath = path.join(__dirname, "profile_images");

fs.mkdirSync(uploadsPath, { recursive: true });
fs.mkdirSync(profileImagesPath, { recursive: true });

app.use("/uploads", express.static(uploadsPath));
app.use("/profile_images", express.static(profileImagesPath));

// Routes
app.use("/api/auth", authRegister);            // Auth Routes
app.use("/api/classes", ClassRoute);           // Class Routes
app.use("/api", contentRoutes);                // Content Routes
app.use("/api/students", studentRoutes);      // Student Routes
app.use("/api/admin", adminRoutes);            // Admin Routes

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
