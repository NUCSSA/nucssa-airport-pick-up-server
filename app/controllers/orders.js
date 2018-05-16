'use strict';

const express = require('express');
const Joi = require('joi');
const _ = require('lodash');
const router = express.Router();

const { sendJoiValidationError } = require('../util');
const {
  findDriverOrders,
  findStudentOrder,
  findAllNeedToBeAssignedStudentSubmissions,
  findAllStudentSubmissions,
  createOrder,
  findAllOrders,
  joiOrderSchema,
} = require('../modules/orders');
const { sendDriverTakingOrderEmail, sendStudentTakingOrderEmail } = require('../modules/mailer');
const { findDriver } = require('../modules/drivers');
const { findStudentSubmission } = require('../modules/students');


router.get('/studentSubmissions', async function(req, res) {
  let studentSubmissions = await findAllStudentSubmissions();
  res.json(studentSubmissions);
});

router.get('/needToBeAssignedStudentSubmissions', async function(req, res) {
  let needToBeAssignedStudentSubmissions = await findAllNeedToBeAssignedStudentSubmissions();
  res.json(needToBeAssignedStudentSubmissions);
});

router.get('/student/:studentWechatId', async function(req, res) {
  let studentWechatId = req.params['studentWechatId'];
  let studentOrder = await findStudentOrder({ studentWechatId });
  res.json(studentOrder);
});

router.get('/driver/:driverWechatId', async function(req, res) {
  let driverWechatId = req.params['driverWechatId'];
  let driverOrders = await findDriverOrders({ driverWechatId });
  res.json(driverOrders);
});

router.post('/create', async function(req, res) {
  const fieldList = ['studentWechatId', 'driverWechatId'];
  let reqBody = _.pick(req.body, fieldList);

  // validate field
  const joiResult  = Joi.validate(reqBody, joiOrderSchema, {
    presence: 'required',
    abortEarly: false,
  });
  const joiError = joiResult.error;

  if (!_.isNil(joiError)) {
    return sendJoiValidationError(joiError, res);
  }
  try {
    await createOrder(reqBody);
    try {
      // TODO: Incorrect implementation shouldn't block the function.
      let { studentWechatId, driverWechatId } = reqBody;
      let driver = await findDriver({ driverWechatId });
      sendDriverTakingOrderEmail(driver, studentWechatId);
      let studentSubmission = await findStudentSubmission({ studentWechatId});
      sendStudentTakingOrderEmail(studentSubmission);
    } catch (err) {
      // TODO: should use sentry to log the error
      console.log(err);
    }
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get('/all', async function(req, res) {
  let allOrders = await findAllOrders();
  res.json(allOrders);
});

module.exports = router;
