const _ = require('lodash');
const mongoose = require('mongoose');
const Joi = require('joi');

const { studentSubmissionSchemaString } = require('../models/studentSubmission');
// const { orderSchemaString, BEFORE, DONE, IN_PROGRESS } = require('../models/order');
const { orderSchemaString, BEFORE } = require('../models/order');


const StudentSubmission = mongoose.model(studentSubmissionSchemaString);
const Order = mongoose.model(orderSchemaString);

const joiOrderSchema = Joi.object().keys({
  studentWechatId: Joi.string(),
  driverWechatId: Joi.string(),
});


async function findAllStudentSubmissions() {
  return StudentSubmission.find();
}

async function createOrder({ driverWechatId, studentWechatId }) {
  let order = await Order.findOne({
    studentWechatId,
  });

  if (!_.isNil(order)) {
    throw new Error(`student order ${studentWechatId} has already been taken.`);
  }

  return Order.findOneAndUpdate({
    studentWechatId,
  }, {
    driverWechatId,
    studentWechatId,
    status: BEFORE,
  }, {
    upsert: true,
  })
}

async function findStudentOrder({ studentWechatId }) {
  return Order.findOne({
    studentWechatId,
  });
}

async function findDriverOrders({ driverWechatId }) {
  return Order.find({
    driverWechatId,
  });
}

async function findAllOrders() {
  return Order.findWithPopulate();
}

async function findAllNeedToBeAssignedStudentSubmissions() {
  let orderSet = await Order.find({});
  let studentWechatIdSet = _.map(orderSet, (o) => o.studentWechatId);

  return StudentSubmission.find({
    wechatId: {
      $nin: studentWechatIdSet,
    },
  });
}

module.exports = {
  findStudentOrder,
  findDriverOrders,
  findAllNeedToBeAssignedStudentSubmissions,
  findAllStudentSubmissions,
  createOrder,
  findAllOrders,
  joiOrderSchema,
};

