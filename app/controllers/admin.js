'use strict';

const express = require('express');
// const Joi = require('joi');
// const _ = require('lodash');
const router = express.Router();

const { findAllDrivers } = require('../modules/drivers');


router.get('/drivers', async function(req, res) {
    let allDrivers = await findAllDrivers();
    res.json(allDrivers);
});

module.exports = router;