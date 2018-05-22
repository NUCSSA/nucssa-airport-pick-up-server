'use strict';

const express = require('express');
const router = express.Router();
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

module.exports = router;
