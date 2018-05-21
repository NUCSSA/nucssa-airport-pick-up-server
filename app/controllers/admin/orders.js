'use strict';

const express = require('express');
const router = express.Router();
const { sendDriverCancelOrderEmail } = require('../../modules/mailer');
const { findDriver } = require('../../modules/drivers');
const { findStudentSubmission } = require('../../modules/students');
const {
  findDriverOrders,
  removeOrder,
  findAllOrders,
  findAllNeedToBeAssignedStudentSubmissions,
} = require('../../modules/orders')

router.get('/assignedList', async function(req, res) {
  const allOrders = await findAllOrders();
  console.log(allOrders);
  res.json(allOrders);
});

router.get('/unassignedList', async function(req, res) {
  const allUnassignedOrders = await findAllNeedToBeAssignedStudentSubmissions();
  console.log(allUnassignedOrders);
  res.json(allUnassignedOrders);
});

router.get('/:driverWechatId', async function(req, res) {
  let driverWechatId = req.params['driverWechatId'];
  let driverOrders = await findDriverOrders({ driverWechatId });
  res.json(driverOrders);
});

router.delete('/:studentWechatId', async function(req, res) {
  let studentWechatId = req.params['studentWechatId'];
  try {
    let order = await removeOrder({ studentWechatId })
    try {
      // TODO: Incorrect implementation shouldn't block the function.
      let { driverWechatId, studentWechatId } = order
      let driver = await findDriver({ driverWechatId });
      let student = await findStudentSubmission({ studentWechatId});
      sendDriverCancelOrderEmail(student, driver);
    } catch (err) {
      // TODO: should use sentry to log the error
      console.log(err);
    }
    res.sendStatus(200);
  } catch (err) {
    console.log(err.message)
    res.status(500).send(err.message);
  }

});



module.exports = router;