"use strict";

const { SuccessResponse } = require("../core/success.response");
const TaskService = require("../services/task.service");

class TaskController {
  create = async (req, res) => {
    new SuccessResponse({
      message: "Create task success",
      metadata: await TaskService.create(req.body, req.user),
    }).send(res);
  };
  update = async (req, res) => {
    new SuccessResponse({
      message: "Update task success",
      metadata: await TaskService.update(req.params.id, req.body),
    }).send(res);
  };
  delete = async (req, res) => {
    new SuccessResponse({
      message: "Delete task success",
      metadata: await TaskService.delete(req.params.id),
    }).send(res);
  };
  getTaskById = async (req, res) => {
    new SuccessResponse({
      message: "Logout success",
      metadata: await TaskService.getTaskById(req.params.id),
    }).send(res);
  };
  getAll = async (req, res) => {
    new SuccessResponse({
      message: "Get list tasks success",
      metadata: await TaskService.getAll(req.query),
    }).send(res);
  };
}

module.exports = new TaskController();
