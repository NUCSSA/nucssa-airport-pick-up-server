'use strict';

const express = require('express');
// const Joi = require('joi');
const _ = require('lodash');
const router = express.Router();

const { findAllDrivers, findDriver, verifyDriver } = require('../../modules/drivers');
const { sendDriverVerificationEmail } = require('../../modules/mailer');


router.get('/drivers', async function(req, res) {
  const allDrivers = await findAllDrivers();
    res.json(allDrivers);
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

router.get('/driver/:driverWechatId', async function(req, res) {
  let driverWechatId = req.params['driverWechatId'];
  let driver = await findDriver({ driverWechatId });
  if (_.isNil(driver)) {
    res.json({
      error: 'No driver found',
    });
  } else {
    res.json(driver);
  }
})
module.exports = router;