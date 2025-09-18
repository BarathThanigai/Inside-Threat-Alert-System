const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema({
  user_id: String,
  action: String,
  timestamp: { type: Date, default: Date.now },
  file_name: String,
  file_size: Number,
  application: String,
  command: String,
  source_ip: String
}, { collection: "logs" });  // 👈 explicitly point to 'logs'

module.exports = mongoose.model("Log", LogSchema);

