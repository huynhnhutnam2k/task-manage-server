"use strict";

const express = require("express");
const taskController = require("../../controllers/task.controller");
const { authentication } = require("../../auth/authUtils");
const asyncHandler = require("../../helpers/asyncHandler");

const router = express.Router();

router.use(authentication);

router.post("/", asyncHandler(taskController.create));

router.patch("/:id", asyncHandler(taskController.update));

router.get("/:id", asyncHandler(taskController.getTaskById));

router.delete("/:id", asyncHandler(taskController.delete));

router.get("/", asyncHandler(taskController.getAll));

module.exports = router;
