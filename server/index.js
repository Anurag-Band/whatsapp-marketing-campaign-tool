// backend/server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const campaignRoutes = require("./routes/campaign.routes");
const connectDatabase = require("./utils/connectDatabase");

dotenv.config();
const PORT = process.env.PORT || 5000;

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const app = express();

// Connect to MongoDB database
connectDatabase();

app.use(
  cors({
    origin: FRONTEND_URL,
  })
);
app.use(express.json());

// test route at home
app.get("/", (req, res) => {
  console.log("App is Running Properly!");
  res.send("App is Running Properly!");
});

app.use("/api/campaigns", campaignRoutes);

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);
  process.exit(1);
});

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});




