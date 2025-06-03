"use strict";

const express = require("express");

// const { apiKey, permission } = require("../auth/checkAuth");

const router = express.Router();

//#region Check apikey
// router.use(apiKey);
//#endregion

//#region Check permissions
// router.use(permission('0000'));

//#endregion

router.use("/projects", require("./project"));
router.use("/tasks", require("./task"));
router.use("/", require("./access"));

module.exports = router;
