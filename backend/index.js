import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import pool from "./config/config.js";
import fs from 'fs';
import http from 'http';
import { Server } from 'socket.io';
import connectDB from './db.js'; // Add MongoDB connection
import mongoose from 'mongoose'; // Add mongoose import
import patientRoutes from './routes/patientRoutes.js';
import authRoutes from "./routes/auth.js";
import predictionRoutes from "./routes/prediction.js";
import feedbackRoutes from "./routes/feedback.js";

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const httpServer = http.createServer(app);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/patients', patientRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/prediction", predictionRoutes);
app.use("/api/feedback", feedbackRoutes);

// Add database health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Check MongoDB connection
    if (mongoose.connection.readyState === 1) {
      // Check PostgreSQL connection
      await pool.query('SELECT NOW()');
      return res.status(200).json({ status: 'healthy', mongodb: 'connected', postgresql: 'connected' });
    } else {
      return res.status(503).json({ 
        status: 'unhealthy', 
        mongodb: mongoose.STATES[mongoose.connection.readyState], // Convert number to readable state
        postgresql: 'unknown' 
      });
    }
  } catch (error) {
    console.error('Health check failed:', error);
    return res.status(503).json({ 
      status: 'unhealthy', 
      error: error.message 
    });
  }
});

// Socket.IO server
const io = new Server(httpServer, {
    cors: {
        origin: ["http://localhost:3000","https://7jnrc5p7-3000.inc1.devtunnels.ms"], // Allow requests from Next.js frontend
        methods: ["GET", "POST"]
    }
});

const rooms = {}; // Object to store room data

io.on('connection', (socket) => {
    const userName = socket.handshake.auth.userName;
    const password = socket.handshake.auth.password;

    if (password !== "x") {
        socket.disconnect(true);
        return;
    }

    // When a user creates a room
    socket.on('createRoom', (roomName) => {
        if (!rooms[roomName]) {
            rooms[roomName] = {
                offerers: [],
                answerers: [],
                iceCandidates: {}
            };
            socket.join(roomName); // User joins the room
            socket.emit('roomCreated', roomName);
        } else {
            socket.emit('roomExists', roomName);
        }
    });

    // When a user joins a room
    socket.on('joinRoom', (roomName) => {
        if (rooms[roomName]) {
            socket.join(roomName); // User joins the room
            io.to(roomName).emit('newUserJoined', userName); // Notify others in the room
            socket.emit('roomJoined', roomName); // Acknowledge that the room was joined
        } else {
            socket.emit('roomNotFound', roomName);
        }
    });

    // Handle new offer
    socket.on('newOffer', (newOffer, roomName) => {
        rooms[roomName].offerers.push(newOffer);
        socket.broadcast.to(roomName).emit('newOfferAwaiting', newOffer);
    });

    // Handle answer to an offer
    socket.on('newAnswer', (offerObj, roomName, ackFunction) => {
        const offererSocket = rooms[roomName].offerers.find(o => o.offererUserName === offerObj.offererUserName);
        if (offererSocket) {
            ackFunction(rooms[roomName].iceCandidates[offerObj.offererUserName] || []);
            rooms[roomName].answerers.push(offerObj);
            io.to(roomName).emit('answerResponse', offerObj);
        }
    });

    // Handle ICE candidates
    socket.on('sendIceCandidateToSignalingServer', (iceCandidateObj, roomName) => {
        const { iceUserName, iceCandidate, didIOffer } = iceCandidateObj;

        if (!rooms[roomName]) return;

        if (didIOffer) {
            if (!rooms[roomName].iceCandidates[iceUserName]) {
                rooms[roomName].iceCandidates[iceUserName] = [];
            }
            rooms[roomName].iceCandidates[iceUserName].push(iceCandidate);
            socket.broadcast.to(roomName).emit('receivedIceCandidateFromServer', iceCandidate);
        } else {
            socket.to(rooms[roomName].offerers.find(o => o.offererUserName === iceUserName).socketId).emit('receivedIceCandidateFromServer', iceCandidate);
        }
    });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
