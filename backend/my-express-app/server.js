require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");

// Routes
const categoryRoutes = require("./routes/categoryRoutes");
const foodRoutes = require("./routes/foodRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Uploaded images access
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "Restaurant Food Menu Backend is Running",
  });
});

// API routes
app.use("/api/categories", categoryRoutes);
app.use("/api/foods", foodRoutes);

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    message: "API route not found",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.message);

  if (err && err.name === "MulterError") {
    return res.status(400).json({
      message: "Image upload error: " + (err.message || "Invalid file"),
    });
  }

  return res.status(err.status || err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// Start server
const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(
        `Server running at http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
