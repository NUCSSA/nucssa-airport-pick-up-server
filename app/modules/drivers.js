// const _ = require('lodash');
const mongoose = require('mongoose');
// const Joi = require('joi');

const { driverSubmissionSchemaString } = require('../models/driverSubmission');

const DriverSubmission = mongoose.model(driverSubmissionSchemaString);

async function findAllDrivers() {
  return DriverSubmission.find();
}

async function findDriver({ driverWechatId }) {
  return DriverSubmission.findOne({
    wechatId: driverWechatId,
  });
}
async function verifyDriver({ driverWechatId }) {
  return DriverSubmission.findOneAndUpdate({
    wechatId: driverWechatId,
  }, {
    verified: true,
  });
}

async function updateDriver({ driverWechatId, newFormBody }) {
  return DriverSubmission.findOneAndUpdate({
    wechatId: driverWechatId,
  }, newFormBody,);
}

module.exports = {
  findAllDrivers,
  verifyDriver,
  findDriver,
  updateDriver,
};

