const http = require("http");

const app = require("./src/app");

const { initializeSocket } = require("./src/socket");

const PORT = process.env.PORT || 8080;

const server = http.createServer(app);

initializeSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on("SIGINT", () => {
  server.close(() => console.log("Exit server express"));
});
