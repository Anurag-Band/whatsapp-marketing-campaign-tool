const Campaign = require("../models/campaign.model");

// Get all campaigns
exports.getAllCampaigns = async (req, res) => {
  const campaigns = await Campaign.find();
  res.status(200).json(campaigns);
};

// Create a new campaign
exports.createCampaign = async (req, res) => {
  const { name, message, contacts } = req.body;

  // Validate contacts
  const formattedContacts = Array.isArray(contacts)
    ? contacts
        .map((contact) => ({
          number: contact.number.trim(),
          status: "pending",
        }))
        .filter((contact) => contact.number)
    : [];

  // Check for valid 10-digit numbers
  const invalidContacts = formattedContacts.filter(
    (contact) => !/^\d{10}$/.test(contact.number)
  );
  if (invalidContacts.length > 0) {
    return res
      .status(400)
      .json({ error: "All contact numbers must be exactly 10 digits long." });
  }

  const newCampaign = new Campaign({
    name,
    message,
    contacts: formattedContacts,
    messagesPending: formattedContacts.length,
  });

  try {
    await newCampaign.save();
    res.status(201).json(newCampaign);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Send messages to all contacts
exports.sendAllMessages = async (req, res) => {
  const { id } = req.params;
  const campaign = await Campaign.findById(id);
  if (!campaign) return res.status(404).send("Campaign not found");

  let sentCount = 0;

  for (const contact of campaign.contacts) {
    if (contact.status === "pending") {
      try {
        // Simulate sending a message
        contact.status = "sent";
        sentCount++;
      } catch (error) {
        contact.status = "failed"; // Mark as failed
      }
    }
  }

  // Update the campaign's sent and pending counts
  campaign.messagesSent += sentCount;
  campaign.messagesPending -= sentCount;

  await campaign.save();

  res.status(200).json(campaign);
};
// Send a message to a specific contact
exports.sendMessages = async (req, res) => {
  const { id } = req.params;
  const { contact } = req.body;
  const campaign = await Campaign.findById(id);
  if (!campaign) return res.status(404).send("Campaign not found");

  const contactIndex = campaign.contacts.findIndex((c) => c.number === contact);
  if (contactIndex === -1) return res.status(404).send("Contact not found");

  try {
    // Simulate sending a message
    campaign.contacts[contactIndex].status = "sent";
    campaign.messagesSent++;
    campaign.messagesPending--;
  } catch (error) {
    campaign.contacts[contactIndex].status = "failed";
  }

  await campaign.save();
  res.json(campaign);
};

// Upload contacts via CSV
exports.uploadContacts = async (req, res) => {
  const { id } = req.params;

  const campaign = await Campaign.findById(id);
  if (!campaign) return res.status(404).send("Campaign not found");

  if (!req.file) return res.status(400).send("No file uploaded");

  const contacts = req.file.buffer.toString().split(",");

  // Format and validate contacts
  const formattedContacts = contacts
    .map((contact) => {
      const trimmedContact = contact.trim();
      return { number: trimmedContact, status: "pending" };
    })
    .filter((contact) => contact.number);

  // Check for valid 10-digit numbers
  const invalidContacts = formattedContacts.filter(
    (contact) => !/^\d{10}$/.test(contact.number)
  );
  if (invalidContacts.length > 0) {
    return res.status(400).json({
      error: "All contact numbers must be exactly 10 digits long.",
    });
  }

  campaign.contacts.push(...formattedContacts);
  campaign.messagesPending += formattedContacts.length;

  await campaign.save();

  res.json(campaign);
};

