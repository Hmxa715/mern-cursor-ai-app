const mongoose = require("mongoose");

const QuerySchema = new mongoose.Schema({
  userQuery: { type: String, required: true },
  aiResponse: { type: String, default: "" },
  requestPayload: { type: mongoose.Schema.Types.Mixed },
  responsePayload: { type: mongoose.Schema.Types.Mixed },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending"
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Query", QuerySchema);
