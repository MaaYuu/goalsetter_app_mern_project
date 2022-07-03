const mongoose = require('mongoose')

// Connecting to DB with the help of Mongoose


const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI)
    // cyan and underline comes from colors package(in server.js)
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline)
  } catch (error) {
    console.log(error)
    // Exit process with failure
    process.exit(1)
  }
}

module.exports = connectDB

// To connect DB, first create this script under config folder and use it in server.js file.