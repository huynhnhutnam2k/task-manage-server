const socketIo = require("socket.io");
const { handleTaskEvents } = require("./handlers/taskHandler");
const { handleProjectEvents } = require("./handlers/projectHandler");

let io;

const initializeSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin:
        process.env.NODE_ENV === "production"
          ? ["https://yourdomain.com"]
          : [
              "http://localhost:3000",
              "http://localhost:5173",
              "http://127.0.0.1:3000",
              "http://127.0.0.1:5173",
            ],
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
