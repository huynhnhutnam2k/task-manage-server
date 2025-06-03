"use strict";
const jwt = require("jsonwebtoken");

const asyncHandler = require("../helpers/asyncHandler");
const { HEADER } = require("../constants/common");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const keyToken = require("../models/keyToken.model");
const KeyTokenService = require("../services/keyToken.service");

const createToken = async (payload) => {
  try {
    const accessToken = await jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "2 days",
    });
    const refreshToken = await jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "2 days",
    });

    jwt.verify(accessToken, process.env.SECRET_KEY, (err, decode) => {
      if (err) {
        console.log(`Error verify jwt`, err);
      }
    });

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {}
};

const authentication = asyncHandler(async (req, res, next) => {
  /**
   * 1. Check user id missing
   * 2. get access token
   * 3. verify token
   * 4. check user in database
   * 5. check key store with this user id
   * 6. passed all -> return next()
   */

  const userId = req.headers[HEADER.CLIENT_ID];

  if (!userId) throw new AuthFailureError("Invalid request");

  const keyStore = await KeyTokenService.findByUserId(userId);

  if (!keyToken) throw new NotFoundError("Not found key token");

  const accessToken = req.headers[HEADER.AUTHORIZATION];

  if (!accessToken) throw new AuthFailureError("Invalid request");

  try {
    const token = accessToken.split(" ")[1];

    const decodeUser = jwt.verify(token, process.env.SECRET_KEY);
    if (decodeUser?.userId !== userId) {
      throw new AuthFailureError("Invalid userID");
    }

    req.keyStore = keyStore;
    req.user = decodeUser;

    return next();
  } catch (error) {}
});

module.exports = { createToken, authentication };
