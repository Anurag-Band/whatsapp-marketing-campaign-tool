const fs = require("fs");
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
        .filter((contact) => contact.number) // Filter out any empty contact numbers
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

  // Track the number of successfully sent messages
  let sentCount = 0;

  for (const contact of campaign.contacts) {
    if (contact.status === "pending") {
      try {
        // Simulate sending a message
        // Replace this with actual sending logic
        // For example, you might call an external API to send the message

        // Simulate successful sending
        contact.status = "sent"; // Mark as sent
        sentCount++; // Increment the sent count
      } catch (error) {
        contact.status = "failed"; // Mark as failed
      }
    }
  }

  // Update the campaign's sent and pending counts
  campaign.messagesSent += sentCount; // Update sent count
  campaign.messagesPending -= sentCount; // Decrement pending count based on successful sends

  await campaign.save(); // Save the updated campaign

  res.status(200).json(campaign); // Return the updated campaign
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
    // Replace this with actual sending logic
    campaign.contacts[contactIndex].status = "sent"; // Mark as sent
    campaign.messagesSent++;
    campaign.messagesPending--; // Decrement pending count
  } catch (error) {
    campaign.contacts[contactIndex].status = "failed"; // Mark as failed
  }

  await campaign.save();
  res.json(campaign);
};

// Upload contacts via CSV
exports.uploadContacts = async (req, res) => {
  const { id } = req.params;
  const campaign = await Campaign.findById(id);
  if (!campaign) return res.status(404).send("Campaign not found");

  // Read the uploaded CSV file
  const contacts = fs.readFileSync(req.file.path, "utf8").split(","); // Split by commas for CSV format

  // Format and validate contacts
  const formattedContacts = contacts
    .map((contact) => {
      const trimmedContact = contact.trim();
      return { number: trimmedContact, status: "pending" };
    })
    .filter((contact) => contact.number); // Filter out any empty contact numbers

  // Check for valid 10-digit numbers
  const invalidContacts = formattedContacts.filter(
    (contact) => !/^\d{10}$/.test(contact.number)
  );
  if (invalidContacts.length > 0) {
    return res
      .status(400)
      .json({ error: "All contact numbers must be exactly 10 digits long." });
  }

  // Add the valid contacts to the campaign
  campaign.contacts.push(...formattedContacts);
  campaign.messagesPending += formattedContacts.length;
  await campaign.save();

  res.json(campaign);
};

