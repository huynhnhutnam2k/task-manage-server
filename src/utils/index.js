"use strict";

const _ = require("lodash");
const { Types } = require("mongoose");

const getData = (object, fields = []) => {
  return _.pick(object, fields);
};

const buildPopulateArray = (populateConfig, includes) => {
  if (!Array.isArray(includes) || includes.length === 0) {
    return [];
  }

  return includes.filter((field) => populateConfig[field]);
};

const convertToObjectIdMongodb = (id) => {
  return new Types.ObjectId(id);
};

module.exports = { getData, buildPopulateArray, convertToObjectIdMongodb };
