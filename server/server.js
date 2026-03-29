const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const helmet = require("helmet");

// Init
dotenv.config();
connectDB();

const app = express();

// Middleware
// Helmet configuration: crossOriginResourcePolicy ko false rakha hai taaki images/sockets mein issue na aaye
app.use(helmet({
    crossOriginResourcePolicy: false,
}));

// Yahan humne Localhost aur Vercel dono ko allow kar diya hai
const allowedOrigins = [
    "http://localhost:3000",
    "https://zoom-clone-live.vercel.app"
];

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));

app.get("/", (req, res) => {
    res.send("Backend Server is Running correctly.");
});

// Create server
const server = http.createServer(app);

// Socket.io Setup
const io = new Server(server, {
    cors: {
        origin: allowedOrigins, // Same allowed origins yahan bhi use ho rhe hain
        methods: ["GET", "POST"],
        credentials: true
    },
});

// Socket logic
require("./sockets/socket")(io);

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ msg: "Something went wrong" });
});

// Start server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`🚀 SERVER RUNNING ON PORT ${PORT}`);
});