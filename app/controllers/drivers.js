'use strict';

const express = require('express');
// const Joi = require('joi');
const _ = require('lodash');
const router = express.Router();

// const { sendJoiValidationError } = require('../util');
const { findAllDrivers, findDriver, verifyDriver} = require('../modules/drivers');
const { sendDriverVerificationEmail } = require('../modules/mailer');

router.get('/', async function(req, res) {
  let allDrivers = await findAllDrivers();
  res.json(allDrivers);
});

router.get('/:driverWechatId', async function(req, res) {
  let driverWechatId = req.params['driverWechatId'];
  let driver = await findDriver({ driverWechatId });
  if (_.isNil(driver)) {
    res.json({
      error: '找不到司机，请确认您已经成功报名',
    });
  } else if (driver['verified'] === false) {
    res.json({
      error: '您的账号还未被认证，请联系NUCSSA管理员来认证您的驾照，管理员微信：loujiadong',
    });
  } else {
    res.json(driver);
  }

});

router.post('/verify/:driverWechatId', async function(req, res) {
  let driverWechatId = req.params['driverWechatId'];
  try {
    await verifyDriver({ driverWechatId });
    let driver = await findDriver({ driverWechatId });
    try {
      sendDriverVerificationEmail(driver);
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