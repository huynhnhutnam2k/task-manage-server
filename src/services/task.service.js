"use strict";

const Task = require("../models/task.model");
const Project = require("../models/project.model");

const { BadRequestError } = require("../core/error.response");
const { buildPopulateArray, convertToObjectIdMongodb } = require("../utils");

const {
  emitTaskCreated,
  emitTaskUpdated,
  emitTaskDeleted,
} = require("../socket/events/taskEvents");
const { getIO } = require("../socket");

class TaskService {
  static populateConfig = {
    user: {
      path: "user",
      select: "name email",
    },
    subtasks: {
      path: "task",
    },
  };

  static create = async (body, user) => {
    const task = await Task.create({
      ...body,
      user: user.userId,
    });

    if (!task) {
      throw new BadRequestError("Create task failure");
    }

    await Project.findByIdAndUpdate(task.projectId, {
      $push: {
        tasks: task._id,
      },
    });

    if (task.parentId) {
      await Task.findByIdAndUpdate(task.parentId, {
        $push: {
          subtasks: task._id,
        },
      });
    }

    emitTaskCreated(task.projectId, task);

    return task;
  };
  static update = async (id, body) => {
    const foundTask = await Task.findById(id);

    if (!foundTask) {
      throw new BadRequestError("Task not found");
    }

    if (foundTask.status === "done") {
      throw new BadRequestError("Cannot change completed task");
    }

    const updatedTask = await Task.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedTask) {
      throw new BadRequestError("Update Task failure");
    }

    if (updatedTask.parentId) {
      const parentTask = await Task.findById(updatedTask.parentId);
      if (!parentTask) {
        throw new BadRequestError("Parent task not found");
      }

      const totalSubtasks = parentTask.subtasks.length;
      const doneSubtasks = parentTask.subtasks.filter(
        (subtask) => subtask.status === "done"
      ).length;

      const process = (doneSubtasks / totalSubtasks) * 100;
      await Task.findByIdAndUpdate(
        updatedTask.parentId,
        { process },
        { new: true }
      );
    } else if (!updatedTask.parentId && updatedTask.status === "done") {
      const project = await Project.findById(updatedTask.projectId).populate(
        "tasks"
      );

      const totalTasks = project.tasks.length;

      const doneTasks = project.tasks.filter((task) => task.status === "done");

      await Project.findByIdAndUpdate(updatedTask.projectId, {
        process: (doneTasks / totalTasks) * 100,
      });
    }

    emitTaskUpdated(
      updatedTask.projectId,
      updatedTask._id,
      foundTask.status,
      updatedTask.status,
      updatedTask
    );
    return updatedTask;
  };
  static delete = async (id) => {
    await Task.findByIdAndDelete(id);

    return {
      message: "Delete project success",
    };
  };

  static getAll = async (params) => {
    const { includes, projectId } = params;
    const query = Task.find({
      parentId: null,
      projectId,
    });
    if (includes && includes.length > 0) {
      const populateArray = buildPopulateArray(
        this.populateConfig,
        includes.split(",").map((item) => item.trim())
      );

      populateArray.forEach((populateConfig) => {
        query.populate(
          populateConfig,
          this.populateConfig[populateConfig].select
        );
      });
    }

    const tasks = await query;

    return tasks;
  };
}

module.exports = TaskService;
