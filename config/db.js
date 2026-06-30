const mongoose = require("mongoose");
const path = require("path");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            tls: true,
            tlsCAFile: path.join(__dirname, "../global-bundle.pem"),
        });

        console.log("DocumentDB Connected");
    } catch (err) {
        console.error("Connection Error:", err);
        process.exit(1);
    }
};

module.exports = connectDB;