import http from 'http';
import { Server } from 'socket.io';

import { config } from './app/config.ts';
import { app } from './app/index.ts';
import { connect } from './app/database.ts';


const { port } = config;

// Create Web Server
const server = http.createServer(app);

// Connect to database
connect();

// Create Socket Server
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
  },
});

// Listen for new connections
io.on('connection', (socket) => {
  console.log(`⚡ Character connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`⚡ Character disconnected: ${socket.id}`);
  });

  socket.on('message', (payload) => {
    socket.broadcast.emit('message', payload);
  });
});

// Start the Web server
server.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
