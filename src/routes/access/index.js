"use strict";

const express = require("express");
const accessController = require("../../controllers/access.controller");
const asyncHandler = require("../../helpers/asyncHandler");
// const { authentication } = require("../../auth/authUtils");

const router = express.Router();

router.post("/signup", asyncHandler(accessController.signUp));
router.post("/signin", asyncHandler(accessController.signIn));
router.get("/profile", asyncHandler(accessController.getProfile));
router.patch("/update", asyncHandler(accessController.updateProfile));

// router.use(authentication)
// router.post('/logout', asyncHandler(accessController.logout))
// router.post('/handleRefreshToken', asyncHandler(accessController.handleRefreshToken))

module.exports = router;
