const express = require("express");
const router = express.Router();
const Log = require("../models/Log");

// Get all logs
router.get("/", async (req, res) => {
  try {
    const logs = await Log.find().sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new log (for testing/demo)
router.post("/", async (req, res) => {
  try {
    const newLog = new Log(req.body);
    await newLog.save();
    res.json(newLog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
