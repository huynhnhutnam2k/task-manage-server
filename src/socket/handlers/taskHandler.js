const handleTaskEvents = (socket, io) => {
  // Join project room for task updates
  socket.on("join-project", (projectId) => {
    socket.join(`project-${projectId}`, (projectId) => {});

    socket.emit("joined-project", { projectId });
  });

  socket.on("leave-project", (projectId) => {
    socket.leave(`project-${projectId}`);
  });

  socket.on("request-task-update", async (data) => {
    try {
      const { taskId, newStatus, projectId } = data;

      // You can call your TaskService here if needed
      // const updatedTask = await TaskService.update(taskId, { status: newStatus });

      // Emit to all clients in the project room
      io.to(`project-${projectId}`).emit("task-status-changed", {
        taskId,
        newStatus,
        updatedBy: socket.id,
      });
    } catch (error) {
      socket.emit("error", { message: "Failed to update task" });
    }
  });
};

module.exports = { handleTaskEvents };
