import { useState, useEffect } from "react";
import axios from "axios";
import CampaignForm from "./components/CampaignForm";
import CampaignList from "./components/CampaignList";
import Loader from "./components/Loader";

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

        <Loader loading={loading} />
        <CampaignList
          campaigns={campaigns}
          fetchCampaigns={fetchCampaigns}
          loading={loading}
        />
      </div>
    </div>
  );
};










export default App;