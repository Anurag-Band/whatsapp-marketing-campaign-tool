const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  message: { type: String, required: true },
  contacts: [
    {
      number: { type: String, required: true },
      status: { type: String, default: "pending" },
    },
  ],
  messagesSent: { type: Number, default: 0 },
  messagesPending: { type: Number, default: 0 },
});

module.exports = mongoose.model("Campaign", campaignSchema);

