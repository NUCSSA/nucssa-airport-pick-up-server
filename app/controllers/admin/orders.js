'use strict';

const express = require('express');
const router = express.Router();
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
    await removeOrder({ studentWechatId })
    res.sendStatus(200);
  } catch (err) {
    console.log(err.message)
    res.status(500).send(err.message);
  }

});



module.exports = router;