"use strict";

const mongoose = require("mongoose");
const {
  db: { host, name, port },
} = require("../configs/config.mongodb");
const connectStr =
  process.env.MONGODB_URI || "mongodb://localhost:27017/task-management";
class Database {
  constructor() {
    this.connect();
  }

  connect(type = "mongodb") {
    mongoose
      .connect(connectStr)
      .then((_) => {
        console.log(`Connect mongodb success`);
      })
      .catch((err) => console.log("Connect error", err));

    if (1 == 1) {
      // mongoose.set("debug", true);
      // mongoose.set("debug", { color: true });
    }
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();

module.exports = instanceMongodb;
