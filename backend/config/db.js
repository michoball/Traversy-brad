const mongoose = require("mongoose");
const { underline } = require("colors");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://kang1234:rkdaudgns@traversycluster.2fiy9.mongodb.net/supportdeskdb?retryWrites=true&w=majority"
    );
    console.log(`MongoDB Connnected : ${conn.connection.host} `.cyan.underline);
  } catch (error) {
    console.log(`Error : ${error.message}`.red.underline.bold);
    process.exit(1);
  }
};

module.exports = connectDB;
