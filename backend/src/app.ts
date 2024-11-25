import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { config } from 'dotenv';
import serverRoutes from './routes/serverRoutes';
import { authenticate } from './utils/authUtil';
import { setupWebSocketHandlers } from './websocket';

config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/servers', authenticate, serverRoutes);

// WebSocket setup
setupWebSocketHandlers(io);

export { app, httpServer };