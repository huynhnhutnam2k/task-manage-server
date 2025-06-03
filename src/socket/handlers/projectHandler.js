const handleProjectEvents = (socket, io) => {
  // Join project room
  socket.on("join-project-room", (projectId) => {
    socket.join(`project-${projectId}`);
    socket.emit("joined-project-room", { projectId });
  });

  // Leave project room
  socket.on("leave-project-room", (projectId) => {
    socket.leave(`project-${projectId}`);
  });

  // Handle project updates
  socket.on("project-update", (data) => {
    const { projectId, updateType, payload } = data;

    // Broadcast to all users in the project
    socket.to(`project-${projectId}`).emit("project-updated", {
      updateType,
      payload,
      updatedBy: socket.id,
    });
  });
};

module.exports = { handleProjectEvents };
