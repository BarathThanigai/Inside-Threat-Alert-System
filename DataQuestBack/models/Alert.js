const mongoose = require("mongoose");

const AlertSchema = new mongoose.Schema({
  user_id: String,
  action: String,
  timestamp: { type: Date, default: Date.now },
  alert_level: { type: String, enum: ["LOW", "MEDIUM", "HIGH"], default: "LOW" },
  reason: String
}, { collection: "alerts" });  // 👈 explicitly point to 'alerts'

module.exports = mongoose.model("Alert", AlertSchema);


