import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const App = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [contacts, setContacts] = useState("");
  const [campaigns, setCampaigns] = useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    const response = await axios.get(`${SERVER_URL}/api/campaigns`);
    setCampaigns(response.data);
  };

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
      .filter((contact) => contact.number); // Filter out any empty contact numbers

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
      contacts: contactList, // Send the formatted contacts
    });
    if (res) {
      toast.success("Campaign created successfully!", {
        position: "top-right",
        autoClose: 5000,
      });
      fetchCampaigns(); // Refresh the campaigns list
    }
    setName("");
    setMessage("");
    setContacts("");
    fetchCampaigns(); // Refresh the campaigns list
  };
  const handleSendAll = async (campaignId) => {
    const res = await axios.post(
      `${SERVER_URL}/api/campaigns/${campaignId}/sendAll`
    );

    if (res) {
      toast.success("All messages sent successfully!", {
        position: "top-right",
        autoClose: 5000,
      });
      fetchCampaigns(); // Refresh the campaigns list
    }
  };

  const handleSend = async (campaignId, contact) => {
    const res = await axios.post(
      `${SERVER_URL}/api/campaigns/${campaignId}/send`,
      {
        contact,
      }
    );
    if (res) {
      toast.success("message sent successfully!", {
        position: "top-right",
        autoClose: 5000,
      });
      fetchCampaigns(); // Refresh the campaigns list
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Set the uploaded file
  };

  const handleUpload = async (campaignId) => {
    const formData = new FormData();
    formData.append("file", file); // Append the file to FormData

    try {
      const res = await axios.post(
        `${SERVER_URL}/api/campaigns/${campaignId}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res) {
        toast.success("Contacts uploaded !", {
          position: "top-right",
          autoClose: 5000,
        });
        fetchCampaigns(); // Refresh the campaigns list
      }
    } catch (error) {
      if (error) {
        toast.error(`Error: ${error.response.data.error}`, {
          position: "top-right",
          autoClose: 5000,
        });
      }
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-5">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-xl">
        <h1 className="text-2xl font-bold text-purple-600 mb-6 text-center">
          Create WhatsApp Campaign
        </h1>
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

        <h2 className="text-xl font-semibold mt-6 text-purple-600 mb-4">
          Existing Campaigns
        </h2>
        {campaigns.length === 0 ? (
          // make a box for no campaigns with centered text
          <div className="text-center text-gray-600 flex items-center justify-center h-24 w-full border border-gray-300 shadow-md rounded-md">
            <p className="text-gray-600 text-xl font-semibold">
              No campaigns found.
            </p>
          </div>
        ) : (
          <ul className="mt-4">
            {campaigns?.map((campaign) => (
              <li key={campaign._id} className="bg-white p-2 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{campaign.name}</span>
                  <span className="text-gray-600 flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-green-400 text-white rounded">
                      {campaign.messagesSent}
                      <span> sent</span>
                    </div>
                    <div className="p-2 bg-red-400 text-white rounded">
                      {campaign.messagesPending}
                      <span> pending</span>
                    </div>
                  </span>
                </div>
                <div className="my-2">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="mb-2"
                  />
                  <button
                    disabled={!file}
                    onClick={() => handleUpload(campaign._id)}
                    className="bg-blue-500 text-white p-2 text-sm rounded-md hover:bg-blue-600 transition"
                  >
                    Upload Contacts
                  </button>
                </div>
                {campaign.contacts.length > 0 ? (
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-100 text-gray-600">
                        <th className="px-4 py-2 text-left">Contact</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {campaign.contacts.map((contact) => (
                        <tr key={contact.number} className="hover:bg-gray-100">
                          <td className="border px-4 py-2">{contact.number}</td>
                          <td
                            className={`border px-4 py-2 ${
                              contact.status === "pending"
                                ? "text-red-500"
                                : "text-green-500"
                            } `}
                          >
                            {contact.status}
                          </td>
                          <td className="border px-4 py-2">
                            <button
                              disabled={contact.status !== "pending"}
                              onClick={() =>
                                handleSend(campaign._id, contact.number)
                              }
                              className="bg-purple-500 text-white p-1 rounded hover:bg-purple-600 transition disabled:bg-purple-100 disabled:text-gray-600"
                            >
                              Send Message
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-600 font-semibold text-xl">
                    No contacts uploaded
                  </p>
                )}
                <button
                  disabled={campaign.messagesPending === 0}
                  onClick={() => handleSendAll(campaign._id)}
                  className="mt-2 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition disabled:bg-blue-100 disabled:text-gray-600"
                >
                  Send Messages to All
                </button>
                <hr className="p-1 border my-3 border-b-gray-800 " />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default App;


