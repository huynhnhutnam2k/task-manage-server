"use strict";
//#region lib
const bcrypt = require("bcrypt");
const crypto = require("crypto");
//endregion
const {
  ConflictRequestError,
  BadRequestError,
} = require("../core/error.response");
const { ROLES } = require("../constants/common");

const user = require("../models/user.model");
const KeyTokenService = require("./keyToken.service");
const { createToken } = require("../auth/authUtils");
const { getData } = require("../utils");
const ProjectService = require("./project.service");

class AccessService {
  static generateKeys = () => {
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    return {
      privateKey,
      publicKey,
    };
  };

  static signUp = async (body) => {
    const { name, email, password, projectId } = body;

    const userExist = await user.findOne({ email });
    if (userExist) {
      throw new ConflictRequestError("User existed");
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const newUser = await user.create({
      name,
      email,
      password: hashPassword,
    });

    if (!newUser) {
      throw new BadRequestError("Create new user failure");
    }

    if (projectId) {
      const joinProject = await ProjectService.joinProject(projectId, {
        email,
      });

      if (!joinProject) {
        throw new BadRequestError("Join project error");
      }
    }

    const { privateKey, publicKey } = this.generateKeys();

    const tokens = await createToken({
      userId: newUser._id,
      email: newUser.email,
    });

    await KeyTokenService.createKeyToken({
      userId: newUser._id,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });

    return {
      user: getData(newUser, ["email", "name", "status", "role"]),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  };

  static signIn = async (body) => {
    const { email, password } = body;
    const existUser = await user.findOne({ email });

    if (!existUser) {
      throw new BadRequestError("User not exists");
    }

    const validPassword = await bcrypt.compare(password, existUser.password);

    if (!validPassword) {
      throw new BadRequestError("Password is not correct");
    }

    const { privateKey, publicKey } = this.generateKeys();

    const tokens = await createToken({
      userId: existUser._id,
      email,
    });

    await KeyTokenService.createKeyToken({
      userId: existUser._id,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });

    return {
      user: getData(existUser, ["_id", "email"]),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  };

  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    return delKey;
  };

  static getProfile = async (userId) => {
    const profile = await user.findById(userId).select("-password");
    if (!profile) {
      throw new BadRequestError("User not found");
    }
    return getData(profile, ["_id", "email", "name", "status"]);
  };

  static updateProfile = async (userId, body) => {
    const foundUser = await user.findById(userId);

    if (!foundUser) {
      throw new BadRequestError("User not found");
    }

    const updateUser = await user.findByIdAndUpdate(userId, body);

    return updateUser;
  };
}

module.exports = AccessService;
