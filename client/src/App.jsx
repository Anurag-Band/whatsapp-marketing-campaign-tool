import { useState, useEffect } from "react";
import axios from "axios";
import loader from "./assets/loader.svg";
import CampaignForm from "./components/CampaignForm/CampaignForm";
import CampaignList from "./components/CampaignList/CampaignList";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const App = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    setLoading(true);
    const response = await axios.get(`${SERVER_URL}/api/campaigns`);
    setCampaigns(response.data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-5">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-xl">
        <h1 className="text-2xl font-bold text-purple-600 mb-6 text-center">
          Create WhatsApp Campaign
        </h1>
        <CampaignForm fetchCampaigns={fetchCampaigns} />
        <h2 className="text-xl font-semibold mt-6 text-purple-600 mb-4">
          Existing Campaigns
        </h2>
        {loading ? (
          <div className="text-center text-gray-600 flex items-center justify-center h-24 w-full border border-gray-300 shadow-md rounded-md">
            <img src={loader} alt="loader" className="w-24 h-24" />
          </div>
        ) : campaigns.length === 0 ? (
          // make a box for no campaigns with centered text
          <div className="text-center text-gray-600 flex items-center justify-center h-24 w-full border border-gray-300 shadow-md rounded-md">
            <p className="text-gray-600 text-xl font-semibold">
              No campaigns found.
            </p>
          </div>
        ) : (
          <CampaignList campaigns={campaigns} fetchCampaigns={fetchCampaigns} />
        )}
      </div>
    </div>
  );
};


export default App;