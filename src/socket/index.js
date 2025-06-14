const socketIo = require("socket.io");
const { handleTaskEvents } = require("./handlers/taskHandler");
const { handleProjectEvents } = require("./handlers/projectHandler");

let io;

const initializeSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: true,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    handleTaskEvents(socket, io);

    handleProjectEvents(socket, io);

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO not initialized");
  }
  return io;
};

module.exports = { initializeSocket, getIO };
