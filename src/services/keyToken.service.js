"use strict";

const { Types } = require("mongoose");

const keyToken = require("../models/keyToken.model");

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      const filter = { user: userId };
      const update = {
        publicKey,
        privateKey,
        refreshTokensUsed: [],
        refreshToken,
      };
      const option = {
        upsert: true,
        new: true,
      };

      const tokens = await keyToken.findOneAndUpdate(filter, update, option);

      return tokens ? tokens?.publicKey : null;
    } catch (error) {}
  };

  static findByUserId = async (userId) => {
    return await keyToken.findOne({ user: new Types.ObjectId(userId) }).lean();
  };

  static removeKeyById = async (id) => {
    return await keyToken.findByIdAndDelete(id);
  };
}

module.exports = KeyTokenService;
