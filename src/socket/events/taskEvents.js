const { getIO } = require("../index");

const emitTaskCreated = (projectId, task) => {
  try {
    const io = getIO();
    io.to(`project-${projectId}`).emit("task-created", {
      task,
      projectId,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Failed to emit task-created event:", error);
  }
};

const emitTaskUpdated = (projectId, taskId, oldStatus, newStatus, task) => {
  try {
    const io = getIO();
    io.to(`project-${projectId}`).emit("task-updated", () => {
      return {
        taskId,
        oldStatus,
        newStatus,
        task,
        projectId,
        timestamp: new Date(),
      };
    });
  } catch (error) {
    console.error("Failed to emit task-updated event:", error);
  }
};

const emitTaskDeleted = (projectId, taskId) => {
  try {
    const io = getIO();
    io.to(`project-${projectId}`).emit("task-deleted", {
      taskId,
      projectId,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Failed to emit task-deleted event:", error);
  }
};

const emitTaskStatusChanged = (projectId, taskId, oldStatus, newStatus) => {
  try {
    const io = getIO();
    io.to(`project-${projectId}`).emit("task-status-changed", {
      taskId,
      oldStatus,
      newStatus,
      projectId,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Failed to emit task-status-changed event:", error);
  }
};

module.exports = {
  emitTaskCreated,
  emitTaskUpdated,
  emitTaskDeleted,
  emitTaskStatusChanged,
};
