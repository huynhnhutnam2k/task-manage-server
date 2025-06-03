"use strict";
const { STATUS_CODE, REASON_STATUS_CODE } = require("../constants/common");

class SuccessResponse {
  constructor({
    message = "ok",
    statusCode = STATUS_CODE.OK,
    reason = REASON_STATUS_CODE.OK,
    metadata = {},
  }) {
    this.message = message ?? reason;
    this.status = statusCode;
    this.metadata = metadata;
  }
  send(res, header = {}) {
    return res.status(this.status).json(this);
  }
}

class OK extends SuccessResponse {
  constructor({ message, metadata }) {
    super({ message, metadata });
  }
}

class CREATED extends SuccessResponse {
  constructor({
    message,
    statusCode = STATUS_CODE.CREATED,
    reason = REASON_STATUS_CODE.CREATED,
    metadata,
    options = {},
  }) {
    super({ message, metadata, statusCode, reason });
    this.options = options;
  }
}

module.exports = {
  OK,
  CREATED,
  SuccessResponse,
};
