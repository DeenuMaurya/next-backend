const mongoose = require("mongoose");
const path = require("path");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            tls: true,
            tlsCAFile: path.join(__dirname, "../global-bundle.pem"),

            maxPoolSize: 200,
            minPoolSize: 20,

            maxIdleTimeMS: 30000,
            socketTimeoutMS: 120000,
            connectTimeoutMS: 30000,
            serverSelectionTimeoutMS: 30000,

            retryWrites: false
        });
        console.log("DocumentDB Connected");
    } catch (err) {
        console.error("Connection Error:", err);
        process.exit(1);
    }
};

module.exports = connectDB;