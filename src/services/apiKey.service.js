'use strict'
const crypto = require('crypto')
const apiKeyModel = require("../models/apiKey.model")

const findById = async (key) => {
    // const newKey = await apiKeyModel.create({
    //     key: crypto.randomBytes(64).toString('hex'), 
    //     permissions: ['0000']
    // })
    const objKey = await apiKeyModel.findOne({key, status: true}).lean()
    return objKey
}

module.exports = {
    findById
}