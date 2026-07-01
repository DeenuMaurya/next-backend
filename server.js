require("dotenv").config();

const express = require("express");
const compression = require("compression");
const { monitorEventLoopDelay } = require("perf_hooks");

const connectDB = require("./config/db");

const app = express();

// Connect Database
connectDB();

// Compression
app.use(compression());

// Body Parser
app.use(
    express.json({
        limit: "50mb",
    })
);

app.use(
    express.urlencoded({
        extended: true,
        limit: "50mb",
    })
);

// Development Request Logger
if (process.env.NODE_ENV === "development") {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.originalUrl}`);
        next();
    });
}

// Request Timing Middleware
app.use((req, res, next) => {
    const start = process.hrtime.bigint();

    res.on("finish", () => {
        const end = process.hrtime.bigint();

        console.log(
            `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} | Status: ${
                res.statusCode
            } | Time: ${(Number(end - start) / 1e6).toFixed(2)} ms`
        );
    });

    next();
});

// Health Check
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Server is running",
        uptime: process.uptime().toFixed(2) + " seconds",
    });
});

// Routes
app.use("/api/users", require("./routes/userRoutes"));

// -------------------------
// Event Loop Monitoring
// -------------------------

const histogram = monitorEventLoopDelay({
    resolution: 20,
});

histogram.enable();

// -------------------------
// Server Monitoring
// -------------------------

setInterval(() => {
    const mem = process.memoryUsage();

    console.log("=====================================");
    console.log("SERVER STATS");
    console.log("=====================================");

    console.log({
        RSS_MB: (mem.rss / 1024 / 1024).toFixed(2),
        Heap_Used_MB: (mem.heapUsed / 1024 / 1024).toFixed(2),
        Heap_Total_MB: (mem.heapTotal / 1024 / 1024).toFixed(2),
        External_MB: (mem.external / 1024 / 1024).toFixed(2),
        EventLoopDelay_MS: (histogram.mean / 1e6).toFixed(2),
        Uptime_Minutes: (process.uptime() / 60).toFixed(2),
        Active_Handles: process._getActiveHandles().length,
        Active_Requests: process._getActiveRequests().length,
    });

    console.log("=====================================");

    histogram.reset();
}, 10000);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err);

    res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
});

// Start Server
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

// Graceful Shutdown
const shutdown = () => {
    console.log("\nGracefully shutting down...");

    server.close(() => {
        console.log("HTTP Server Closed");
        process.exit(0);
    });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

// Global Exception Handlers
process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Rejection:", reason);
});