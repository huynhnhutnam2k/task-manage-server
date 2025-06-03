"use strict";

const { SuccessResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  signUp = async (req, res) => {
    new SuccessResponse({
      message: "Success",
      metadata: await AccessService.signUp(req.body),
    }).send(res);
  };

  signIn = async (req, res) => {
    new SuccessResponse({
      message: "Success",
      metadata: await AccessService.signIn(req.body),
    }).send(res);
  };

  logout = async (req, res) => {
    new SuccessResponse({
      message: "Success",
      metadata: await AccessService.logout(req.keyStore),
    }).send(res);
  };
  getProfile = async (req, res) => {
    new SuccessResponse({
      message: "Success",
      metadata: await AccessService.getProfile(req.headers.client_id),
    }).send(res);
  };

  updateProfile = async (req, res) => {
    new SuccessResponse({
      metadata: await AccessController.updateProfile(
        req.headers.client_id,
        req.body
      ),
    }).send(res);
  };
}

module.exports = new AccessController();
