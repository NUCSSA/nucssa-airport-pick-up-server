'use strict';

const express = require('express');
const _ = require('lodash');
// const Joi = require('joi');

const router = express.Router();

const driverType = 'driver';
const studentType = 'student';

router.post('/submissions/:formType', async function (req, res) {

  // const fieldList = ['availableTimeSlot', 'carType', 'degree', 'email',
  //     'gender', 'huskyEmail', 'name', 'phone', 'remark', 'status', 'wechatId'];
  // const newFormBody = _.pick(req.body, fieldList);

  // const joiResult  = Joi.validate(newFormBody, JoiLikeSchema, {
  //     presence: 'required',
  //     abortEarly: false,
  // });
  // const joiError = joiResult.error;
  //
  // if (!_.isNil(joiError)) {
  //     return sendJoiValidationError(joiError, res);
  // }
  console.log(req.params);
  console.log(req.body);
  res.sendStatus(200);

});

// router.get('/:userId', async function (req, res) {
//     const { userId } = req.params;
//
//     try {
//         const user = await usersModule.getUser({ userId });
//         return res.status(200).send(user);
//     } catch (error) {
//         return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
//     }
// });


module.exports = router;
