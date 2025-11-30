const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
const allowedOrigins = [
    "https://excel-analytics-platform-nehal.netlify.app",
    "https://excel-analytics-backend.onrender.com", 
    "http://localhost:3000",
    "http://localhost:5173"
];

app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Make uploads directory if it doesn't exist
const fs = require("fs");
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}


// Test endpoint
app.get("/api/test", (req, res) => {
    res.json({
        message: "Backend is working!",
        env: process.env.NODE_ENV,
        port: PORT
    });
});

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/upload", require("./routes/upload"));
app.use("/api/data", require("./routes/data"));
app.use("/api/admin", require("./routes/admin"));






// Routes
// app.use("/api/auth", require("./routes/auth"));
// app.use("/api/upload", require("./routes/upload"));
// app.use("/api/data", require("./routes/data"));
// app.use("/api/admin", require("./routes/admin"));

// Basic route for testing
app.get("/api/health", (req, res) => {
    res.json({message: "Server is running!"});
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error(error);

    if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({message: "File too large"});
    }

    res.status(500).json({message: error.message || "Server Error"});
});

// Handle undefined routes
app.use((req, res) => {
    res.status(404).json({message: "Route not found"});
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
