// lib/socket.ts

import { Server as HTTPServer } from "http";
import { Server as SocketIOServer } from "socket.io";

export function setupSocket(server: HTTPServer) {
  const io = new SocketIOServer(server, {
    path: "/api/socketio",
    addTrailingSlash: false,
    cors: {
      origin: "*", // Adjust as needed for security
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on("joinConversation", (conversationId: string) => {
      socket.join(conversationId);
      console.log(`Socket ${socket.id} joined conversation ${conversationId}`);
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  // Attach the Socket.io server to the global object to access it in API routes
  (global as any).io = io;

  return io;
}
