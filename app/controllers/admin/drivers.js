'use strict';

const express = require('express');
const Joi = require('joi');
const _ = require('lodash');
const router = express.Router();

const {
  findAllDrivers,
  findDriver,
  verifyDriver,
  updateDriver,
} = require('../../modules/drivers');
const { sendDriverVerificationEmail } = require('../../modules/mailer');
const { joiDriverFormSchema } = require('../../modules/forms');
const { sendJoiValidationError } = require('../../util');

router.get('/list', async function(req, res) {
  try {
    const allDrivers = await findAllDrivers();
    res.json(allDrivers);
  } catch (err) {
    res.status(500).send(err.message)
  }
});

router.post('/verify/:driverWechatId', async function(req, res) {
  const driverWechatId = req.params['driverWechatId'];
  try {
    await verifyDriver({ driverWechatId });
    const driver = await findDriver({ driverWechatId });
    try {
      await sendDriverVerificationEmail(driver);
    } catch (err) {
      console.log(err);
    }
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get('/:driverWechatId', async function(req, res) {
  let driverWechatId = req.params['driverWechatId'];
  let driver = await findDriver({ driverWechatId });
  if (_.isNil(driver)) {
    res.json({
      error: 'No driver found',
    });
  } else {
    res.json(driver);
  }
});

router.post('/update/:driverWechatId', async function(req, res) {
  let driverWechatId = req.params['driverWechatId'];
  let newFormBody;
  req.body.wechatId = driverWechatId;
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
  try {
    await updateDriver({
      driverWechatId,
      newFormBody,
    });
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;

