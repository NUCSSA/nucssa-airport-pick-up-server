'use strict';

const express = require('express');
const Joi = require('joi');
const _ = require('lodash');
const router = express.Router();

const { sendJoiValidationError } = require('../util');


const {
  studentType,
  driverType,
  persistSubmission,
  joiDriverFormSchema,
  joiStudentFormSchema,
} = require('../modules/forms');
const {
  sendDriverEmail,
  sendStudentEmail,
  sendStudentSubscriptionEmail,
} = require('../modules/mailer');

router.post('/submissions/:formType', async function (req, res) {

  let formType = req.params['formType'];
  let newFormBody;
  if (formType === driverType) {

    const fieldList = ['availableTimeSlot', 'carType', 'degree', 'email',
      'gender', 'huskyEmail', 'email', 'name', 'phone', 'remark', 'status', 'wechatId'];

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
    const fieldList = ['wechatId', 'studentSet', 'arrivingTime',
      'flightNumber', 'address', 'luggageNumber', 'remark'];
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
    await persistSubmission({
      newFormBody,
      formType,
    });
    try {
      if (formType === driverType) {
        // await sendDriverEmail(newFormBody);
        // Don't wait for email
        await sendDriverEmail(newFormBody);
      } else if (formType === studentType) {
        // await sendStudentEmail(newFormBody);
        // Don't wait for email
        await sendStudentEmail(newFormBody);
        await sendStudentSubscriptionEmail(newFormBody)
      }
    } catch (err) {
      // TODO: should use sentry to log the error
      console.log(err);
    }

    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }

});


module.exports = router;
