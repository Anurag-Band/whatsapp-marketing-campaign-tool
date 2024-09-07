import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const CampaignForm = ({ fetchCampaigns }) => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [contacts, setContacts] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure contacts is a string and format it
    const contactList = contacts
      .split("\n")
      .map((contact) => {
        const trimmedContact = contact.trim();
        return {
          number: trimmedContact,
          status: "pending",
        };
      })
      .filter((contact) => contact.number);

    // Validate that each contact number is exactly 10 digits
    const invalidContacts = contactList.filter(
      (contact) => !/^\d{10}$/.test(contact.number)
    );

    if (invalidContacts.length > 0) {
      toast.error(
        "Please ensure all contact numbers are exactly 10 digits long.",
        {
          position: "top-right",
          autoClose: 5000,
        }
      );
      return;
    }

    const res = await axios.post(`${SERVER_URL}/api/campaigns`, {
      name,
      message,
      contacts: contactList,
    });
    if (res) {
      toast.success("Campaign created successfully!", {
        position: "top-right",
        autoClose: 5000,
      });
      fetchCampaigns();
      setName("");
      setMessage("");
      setContacts("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Campaign Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-400"
      />
      <textarea
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
        className="border border-gray-300 rounded-lg p-2 w-full h-24 focus:outline-none focus:ring-2 focus:ring-purple-400"
      />
      <textarea
        placeholder="Contacts (one per line)"
        value={contacts}
        onChange={(e) => setContacts(e.target.value)}
        className="border border-gray-300 rounded-lg p-2 w-full h-24 focus:outline-none focus:ring-2 focus:ring-purple-400"
      />
      <button
        type="submit"
        className="w-full bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition"
      >
        Create Campaign
      </button>
    </form>
  );
};

export default CampaignForm;


