"use strict";

const mongoose = require("mongoose");
const os = require('os')
const process = require('process')
const _SECONDS = 5000
const countConnect = () => {
  const numConnection = mongoose.connections.length;
  return numConnection
};

const checkOverload = () => {
    setInterval(() => {
        const numConnection = mongoose.connections.length
        const numCores = os.cpus().length
        const memoryUsage = process.memoryUsage().rss
        // if maximum number of connection based on number osf cores
        const maxConnects = numCores * 5;
        return {
            memoryUsage: memoryUsage / 1024 / 1024, 
            activeConnection: numConnection, 
            isOverloadDetect: numConnection > maxConnects
        }
    },_SECONDS) // monitor every 5 seconds
}

module.exports = { countConnect, checkOverload };