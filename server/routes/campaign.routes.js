const express = require("express");
const multer = require("multer");
const {
  getAllCampaigns,
  createCampaign,
  sendAllMessages,
  sendMessages,
  uploadContacts,
} = require("../controllers/campaign.controller");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Get all campaigns
router.get("/", getAllCampaigns);

// Create a new campaign
router.post("/", createCampaign);

// Simulate sending messages to all contacts
router.post("/:id/sendAll", sendAllMessages);

// Simulate sending messages to a specific contact
router.post("/:id/send", sendMessages);

// Upload contacts via CSV
router.post("/:id/upload", upload.single("file"), uploadContacts);

module.exports = router;

