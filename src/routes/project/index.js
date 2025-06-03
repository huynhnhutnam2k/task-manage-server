"use strict";

const express = require("express");
const projectController = require("../../controllers/project.controller");
const { authentication } = require("../../auth/authUtils");
const asyncHandler = require("../../helpers/asyncHandler");

const router = express.Router();

router.use(authentication);

router.get("/list", asyncHandler(projectController.getList));

router.post("/:id/add-member", asyncHandler(projectController.addMember));

router.post("/:id/join-project", asyncHandler(projectController.joinProject));

router.patch("/:id", asyncHandler(projectController.update));

router.get("/:id", asyncHandler(projectController.getProjectById));

router.delete("/:id", asyncHandler(projectController.delete));

router.post("/", asyncHandler(projectController.create));

router.get("/", asyncHandler(projectController.getAll));

module.exports = router;
