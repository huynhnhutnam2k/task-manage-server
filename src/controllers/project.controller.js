"use strict";

const { SuccessResponse } = require("../core/success.response");
const ProjectService = require("../services/project.service");

class ProjectController {
  create = async (req, res) => {
    new SuccessResponse({
      message: "Create project success",
      metadata: await ProjectService.create(req.body, req.headers.client_id),
    }).send(res);
  };
  update = async (req, res) => {
    new SuccessResponse({
      message: "Update project success",
      metadata: await ProjectService.update(req.params.id, req.body),
    }).send(res);
  };
  delete = async (req, res) => {
    new SuccessResponse({
      message: "Delete project success",
      metadata: await ProjectService.delete(req.params.id),
    }).send(res);
  };
  getProjectById = async (req, res) => {
    new SuccessResponse({
      metadata: await ProjectService.getProjectById(req.params.id, req.query),
    }).send(res);
  };
  getAll = async (req, res) => {
    new SuccessResponse({
      metadata: await ProjectService.getAll(req.query),
    }).send(res);
  };
  addMember = async (req, res) => {
    new SuccessResponse({
      message: "Add member to project success",
      metadata: await ProjectService.addMember(
        req.params.id,
        req.body.members,
        req.user
      ),
    }).send(res);
  };
  getList = async (req, res) => {
    console.log(req.headers.client_id, req.query);
    new SuccessResponse({
      message: "Get list of projects user success",
      metadata: await ProjectService.getList(req.headers.client_id, req.query),
    }).send(res);
  };
  joinProject = async (req, res) => {
    new SuccessResponse({
      metadata: await ProjectService.joinProject(req.params.id, req.user),
    }).send(res);
  };
}

module.exports = new ProjectController();
