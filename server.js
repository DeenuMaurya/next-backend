require("dotenv").config();

const express = require("express");

const connectDB = require("./config/db");

const app = express();

connectDB();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Server is running");
});

app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

app.use("/api/users", require("./routes/userRoutes"));

app.listen(process.env.PORT, () => {

    console.log(`Server running on ${process.env.PORT}`);

});