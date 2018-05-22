'use strict';

const express = require('express');
const router = express.Router();
const Joi = require('joi');
const _ = require('lodash');
// const { sendDriverVerificationEmail } = require('../../modules/mailer');
const { joiStudentFormSchema } = require('../../modules/forms');
const { sendJoiValidationError } = require('../../util');
const { findStudentSubmission, updateStudent } = require('../../modules/students');
const {
  findAllOrders,
  findAllNeedToBeAssignedStudentSubmissions,
} = require('../../modules/orders')

router.get('/assignedList', async function(req, res) {
  try {
    const allOrders = await findAllOrders();
    res.json(allOrders);
  } catch (err) {
    res.status(500).send(err.message)
  }
});

router.get('/unassignedList', async function(req, res) {
  try {
    const allUnassignedOrders = await findAllNeedToBeAssignedStudentSubmissions();
    res.json(allUnassignedOrders);
  } catch (err) {
    res.status(500).send(err.message)
  }
});

router.get('/:studentWechatId', async function(req, res) {
  let studentWechatId = req.params['studentWechatId'];
  let student = await findStudentSubmission({ studentWechatId });
  if (_.isNil(student)) {
    res.json({
      error: 'No student found',
    });
  } else {
    res.json(student);
  }
});

router.post('/update/:studentWechatId', async function(req, res) {
  let studentWechatId = req.params['studentWechatId'];
  let newFormBody;
  let newStudentSet;
  req.body.wechatId = studentWechatId;
  const fieldList = ['wechatId', 'studentSet', 'arrivingTime',
    'flightNumber', 'address', 'luggageNumber', 'remark'];
  const singleStudentFieldList = ['name', 'nuid', 'degree', 'email',
    'wechatId', 'phone', 'emergencyContact', 'emergencyContactPhone']

  newFormBody = _.pick(req.body, fieldList);
  newStudentSet = _.map(newFormBody.studentSet, (s) => {
    return _.pick(s, singleStudentFieldList)
  })
  newFormBody.studentSet = newStudentSet

  // validate field
  const joiResult  = Joi.validate(newFormBody, joiStudentFormSchema, {
    presence: 'required',
    abortEarly: false,
  });
  const joiError = joiResult.error;
  if (!_.isNil(joiError)) {
    return sendJoiValidationError(joiError, res);
  }
  try {
    await updateStudent({
      studentWechatId,
      newFormBody,
    });
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
