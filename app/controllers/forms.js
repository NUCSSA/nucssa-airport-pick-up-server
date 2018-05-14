'use strict';

const express = require('express');
const Joi = require('joi');
const _ = require('lodash');

const { sendJoiValidationError } = require('../util');
const router = express.Router();

const {
  studentType,
  driverType,
  generateBody,
  joiDriverFormSchema,
  joiStudentFormSchema,
} = require('../modules/forms');
const {
  sendDriverEmail,
  sendStudentEmail,
} = require('../modules/mailer');

router.post('/submissions/:formType', async function (req, res) {

  let formType = req.params['formType'];
  let newFormBody;
  if (formType === driverType) {

    const fieldList = ['availableTimeSlot', 'carType', 'degree', 'email',
      'gender', 'huskyEmail', 'name', 'phone', 'remark', 'status', 'wechatId'];

    newFormBody = _.pick(req.body, fieldList);

    // validate field
    const joiResult  = Joi.validate(newFormBody, joiDriverFormSchema, {
      presence: 'required',
      abortEarly: false,
    });
    const joiError = joiResult.error;

    if (!_.isNil(joiError)) {
      return sendJoiValidationError(joiError, res);
    }
  } else if (formType === studentType) {
    const fieldList = ['studentSet', 'arrivingTime', 'flightNumber', 'address',
      'luggageNumber', 'remark'];
    newFormBody = _.pick(req.body, fieldList);

    // validate field
    const joiResult  = Joi.validate(newFormBody, joiStudentFormSchema, {
      presence: 'required',
      abortEarly: false,
    });
    const joiError = joiResult.error;

    if (!_.isNil(joiError)) {
      return sendJoiValidationError(joiError, res);
    }
  } else {
    res.status(404).send('unsupported Type');
    return;
  }

  try {
    await generateBody({
      newFormBody,
      formType,
    });

    if (formType === driverType) {
      await sendDriverEmail(newFormBody);
    } else if (formType === studentType) {
      await sendStudentEmail(newFormBody);
    }

    res.sendStatus(200);
  } catch (err) {
    if (err.response.status) {
      res.sendStatus(err.response.status);
    } else {
      res.status(500).send(err.message);
    }
  }

});


module.exports = router;
