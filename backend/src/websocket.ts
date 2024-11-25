import { Server, Socket } from 'socket.io';
import { ServerService } from './services/serverService';

const serverService = new ServerService();

export function setupWebSocketHandlers(io: Server) {
  io.on('connection', (socket: Socket) => {
    console.log('Client connected:', socket.id);

    // Forward server events to connected clients
    serverService.on('statusChange', (status) => {
      socket.emit('serverStatus', status);
    });

    serverService.on('log', (message) => {
      socket.emit('serverLog', message);
    });

    serverService.on('error', (error) => {
      socket.emit('serverError', error);
    });

    // Handle client commands
    socket.on('startServer', async () => {
      try {
        await serverService.start();
      } catch (error) {
        socket.emit('error', error.message);
      }
    });

    socket.on('stopServer', async () => {
      try {
        await serverService.stop();
      } catch (error) {
        socket.emit('error', error.message);
      }
    });

    socket.on('kickPlayer', async (username: string) => {
      try {
        await serverService.kickPlayer(username);
      } catch (error) {
        socket.emit('error', error.message);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
}