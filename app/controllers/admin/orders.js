'use strict';

const express = require('express');
// const Joi = require('joi');
// const _ = require('lodash');
const router = express.Router();
const { findDriverOrders, removeOrder } = require('../../modules/orders')


router.get('/:driverWechatId', async function(req, res) {
  let driverWechatId = req.params['driverWechatId'];
  let driverOrders = await findDriverOrders({ driverWechatId });
  res.json(driverOrders);
});

router.delete('/:studentWechatId', async function(req, res) {
  let studentWechatId = req.params['studentWechatId'];
  try {
    await removeOrder({ studentWechatId })
    res.sendStatus(200);
  } catch (err) {
    console.log(err.message)
    res.status(500).send(err.message);
  }

});

module.exports = router;