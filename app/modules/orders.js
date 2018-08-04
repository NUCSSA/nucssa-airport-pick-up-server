const _ = require('lodash');
const mongoose = require('mongoose');
const Joi = require('joi');

const { studentSubmissionSchemaString } = require('../models/studentSubmission');
// const { orderSchemaString, BEFORE, DONE, IN_PROGRESS } = require('../models/order');
const { orderSchemaString, BEFORE, DONE } = require('../models/order');


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

async function completeOrder({ studentWechatId }) {
  return Order.findOneAndUpdate({
    studentWechatId,
  }, {
    status: DONE,
  });
}

async function removeOrder({ studentWechatId }) {
  return Order.findOneAndDelete({
    studentWechatId,
  })
}

async function findStudentOrder({ studentWechatId }) {
  let studentOrder = await Order.definedPopulate(
    Order.findOne({
      studentWechatId,
    })
  );

  if(!_.isNil(studentOrder)) {
    return studentOrder;
  } else {
    let studentSubmission = await StudentSubmission.findOne({
      wechatId: studentWechatId,
    });

    if (_.isNil(studentSubmission)) {
      return null;
    }

    return {
      student: studentSubmission,
      studentWechatId,
      driver: null,
      driverWechatId: null,
    };
  }
}

async function findDriverOrders({ driverWechatId }) {
  return Order.definedPopulate(
    Order.find({
      driverWechatId,
    })
  );
}

async function findDriversOrdersReport() {
  return Order.aggregate([
    {
      $group: {
        _id: '$driverWechatId',
        count: { $sum: 1 },
      },
    },
  ]);
}

async function findAllOrders() {
  return Order.definedPopulate(Order.find());
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
  findDriversOrdersReport,
  findAllNeedToBeAssignedStudentSubmissions,
  findAllStudentSubmissions,
  createOrder,
  completeOrder,
  findAllOrders,
  removeOrder,
  joiOrderSchema,
};

