const express = require("express");
const router = express.Router();
const Alert = require("../models/Alert");

// Get all alerts
router.get("/", async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ timestamp: -1 });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new alert (for testing/demo)
router.post("/", async (req, res) => {
  try {
    const newAlert = new Alert(req.body);
    await newAlert.save();
    res.json(newAlert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
