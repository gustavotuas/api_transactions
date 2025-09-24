const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "api",
    });

    console.log(`MongoDB connected in: ${conn.connection.host}`.green.inverse);
  } catch (err) {
    console.log(`MongoDB error: ${err}`.red.inverse);
    process.exit();
  }
};

module.exports = dbConnection;
