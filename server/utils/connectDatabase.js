const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectDatabase = () => {
  mongoose.set("strictQuery", false);
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Database Synced Successfully!!!");
    })
    .catch((error) => {
      console.log("~~~Database Sync Failed");
      console.log(error);
    });
};

module.exports = connectDatabase;

