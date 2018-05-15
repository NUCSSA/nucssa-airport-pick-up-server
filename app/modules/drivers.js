// const _ = require('lodash');
const mongoose = require('mongoose');
// const Joi = require('joi');

const { driverSubmissionSchemaString } = require('../models/driverSubmission');

const DriverSubmission = mongoose.model(driverSubmissionSchemaString);

async function findAllDrivers() {
  return DriverSubmission.find();
}

async function verifyDriver({ driverWechatId }) {
  return DriverSubmission.findOneAndUpdate({
    wechatId: driverWechatId,
  }, {
    verified: true,
  });
}

module.exports = {
  findAllDrivers,
  verifyDriver,
};

