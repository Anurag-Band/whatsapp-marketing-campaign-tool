import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const CampaignList = ({ campaigns, fetchCampaigns }) => {
  const [file, setFile] = useState(null);

  const handleSendAll = async (campaignId) => {
    const res = await axios.post(
      `${SERVER_URL}/api/campaigns/${campaignId}/sendAll`
    );

    if (res) {
      toast.success("All messages sent successfully!", {
        position: "top-right",
        autoClose: 5000,
      });
      fetchCampaigns();
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
      fetchCampaigns();
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (campaignId) => {
    const formData = new FormData();
    formData.append("file", file);

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
        fetchCampaigns();
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
                        onClick={() => handleSend(campaign._id, contact.number)}
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
  );
};

export default CampaignList;


