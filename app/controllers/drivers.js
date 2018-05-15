'use strict';

const express = require('express');
const Joi = require('joi');
const _ = require('lodash');
const router = express.Router();

const { sendJoiValidationError } = require('../util');
const { findAllDrivers, verifyDriver} = require('../modules/drivers');

router.get('/', async function(req, res) {
  let allDrivers = await findAllDrivers();
  res.json(allDrivers);
});

router.post('/verify/:driverWechatId', async function(req, res) {
  let driverWechatId = req.params['driverWechatId'];
  await verifyDriver({ driverWechatId });
  res.sendStatus(200);
});

module.exports = router;