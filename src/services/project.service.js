"use strict";

const Project = require("../models/project.model");
const Task = require("../models/task.model");
const User = require("../models/user.model");

const { BadRequestError, NotFoundError } = require("../core/error.response");
const {
  buildPopulateArray,
  convertToObjectIdMongodb,
  getUnselectData,
} = require("../utils");
const EmailService = require("./email.service");

class ProjectService {
  static populateConfig = {
    created_by: {
      path: "created_by",
      select: "name email",
    },
    // tasks: {
    //   path: "tasks",
    //   select: getUnselectData([''])
    // },
    members: {
      path: "members",
      select: getUnselectData(["__v"]),
    },
  };

  static create = async (body, userId) => {
    const { members, ...rest } = body;
    const project = await Project.create({
      ...rest,
      created_by: userId,
      //   members: body.members || [user.userId],
      members: [userId],
    });

    if (!project) {
      throw new BadRequestError("Create project failure");
    }

    return project;
  };

  static update = async (id, body) => {
    const foundProject = await Project.findById(id);

    if (!foundProject) {
      throw new BadRequestError("Project not found");
    }

    const updatedProject = await Project.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedProject) {
      throw new BadRequestError("Update project failure");
    }
    return updatedProject;
  };

  static delete = async (id) => {
    await Project.findByIdAndDelete(id);

    return {
      message: "Delete project success",
    };
  };

  static getProjectById = async (id, params) => {
    const { includes } = params;

    const query = Project.findById(id);
    if (includes && includes.length > 0) {
      const populateArray = buildPopulateArray(
        this.populateConfig,
        includes.split(",")
      );

      populateArray.forEach((populateConfig) => {
        query.populate(
          populateConfig,
          this.populateConfig[populateConfig].select
        );
      });
    }

    const projects = await query;

    return projects;
  };

  static getAll = async (params) => {
    const { includes } = params;

    const query = Project.find({});
    if (includes && includes.length > 0) {
      const populateArray = buildPopulateArray(
        this.populateConfig,
        includes.split(",")
      );

      populateArray.forEach((populateConfig) => {
        query.populate(
          populateConfig,
          this.populateConfig[populateConfig].select
        );
      });
    }

    const projects = await query;

    return projects;
  };

  static calculateProgress = async (projectId) => {
    const tasks = await Task.find({ projectId });
    if (tasks.length === 0) return 0;

    const completedTasks = tasks.filter(
      (task) => task.status === "done"
    ).length;
    const progress = Math.round((completedTasks / tasks.length) * 100);

    // Update project progress
    await Project.findByIdAndUpdate(projectId, { progress });

    return progress;
  };

  static getMemberIds = async (members) => {
    return Promise.all(
      members.map(async (member) => {
        const mem = await User.findOne({ email: member });
        if (!mem) return;
        return mem._id;
      })
    );
  };

  static addMember = async (projectId, members, invitation) => {
    const project = await Project.findById(projectId);

    let message = "Add member success, please check invite's email";

    if (!project) {
      throw new BadRequestError("Project not found");
    }

    const member = await User.findOne({ email: members[0] }).lean();

    if (!member) {
      if (project.memberQueue.includes(members[0])) {
        throw new BadRequestError("Member already invited");
      }
      project.memberQueue.push(members[0]);

      const sendEmail = await EmailService.sendProjectInvitation(
        members[0],
        project,
        invitation.email
      );

      if (!sendEmail) {
        throw new BadRequestError("Send email failure");
      }

      message = "Invite user success";
    } else {
      if (project.members.includes(member._id)) {
        throw new BadRequestError("No new members to add");
      } else {
        project.members.push(member._id);
      }
    }

    const updatedProject = await project.save();

    if (!updatedProject) {
      throw new BadRequestError("Add member to project failure");
    }

    return {
      message,
      updatedProject,
    };
  };

  static joinProject = async (projectId, body) => {
    const project = await Project.findById(projectId);

    if (!project) {
      throw new NotFoundError("Not found project");
    }

    const { email } = body;

    if (!project.memberQueue.includes(email)) {
      throw new BadRequestError("Not found in member queue");
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new NotFoundError("Not found user");
    }

    project.members.push(user._id);

    project.memberQueue = project.memberQueue.filter(
      (member) => member !== email
    );

    const updatedProject = await project.save();

    if (!updatedProject) {
      throw new BadRequestError("Update project fail");
    }

    return updatedProject;
  };

  static getList = async (userId, params) => {
    const { includes } = params;
    const query = Project.find({
      //   members: { $in: userId },
      members: userId,
    });

    if (includes && includes.length > 0) {
      const populateArray = buildPopulateArray(
        this.populateConfig,
        includes.split(",")
      );

      populateArray.forEach((populateConfig) => {
        query.populate(
          populateConfig,
          this.populateConfig[populateConfig].select
        );
      });
    }

    const projects = await query;

    return projects;
  };
}

module.exports = ProjectService;
