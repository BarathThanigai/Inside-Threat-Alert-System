const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/logs", require("./routes/logs"));
app.use("/api/alerts", require("./routes/alerts"));

// MongoDB connection
mongoose.connect("mongodb+srv://baratht2024_db_user:barath@insidethreatdetection.gm7hkey.mongodb.net/insidethreatdetection?retryWrites=true&w=majority&appName=InsideThreatDetection", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error("MongoDB Error:", err));

const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.send("✅ Insider Threat Detection Backend is running!");
});
app.listen(PORT, () => console.log(`Server running at: http://localhost:${PORT}`));
