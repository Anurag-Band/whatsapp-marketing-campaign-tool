// backend/server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const campaignRoutes = require("./routes/campaign.routes");
const connectDatabase = require("./utils/connectDatabase");

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();

// Connect to MongoDB database
connectDatabase();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());
app.use("/api/campaigns", campaignRoutes);

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));

