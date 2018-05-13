'use strict';

const express = require('express');
const _ = require('lodash');
const axios = require('axios');
const Base64 = require('js-base64').Base64;

// const Joi = require('joi');

const router = express.Router();

const driverType = 'driver';
const studentType = 'student';

const GITEE_USERNAME = process.env['GITEE_USERNAME'];
const GITEE_REPOSITORY = process.env['GITEE_REPOSITORY_NAME'];
const GITEE_ACCESS_TOKEN = process.env['GITEE_ACCESS_TOKEN'];
const GITEE_DB_URI = `https://gitee.com/api/v5/repos/${GITEE_USERNAME}/${GITEE_REPOSITORY}/contents/`;

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
  // console.log(req.params);
  // console.log(req.body);

  let base64Content = Base64.encode(JSON.stringify(req.body, null, 2));

  let postBody = {
    'access_token': GITEE_ACCESS_TOKEN,
    'content': base64Content,
  };

  let formType = req.params['formType'];
  let path = GITEE_DB_URI;
  if (formType === driverType) {
    let wechatId = req.body['wechatId'];
    path += 'driver/' + wechatId;
    _.assign(postBody, {
      'message': wechatId,
    })
  } else if (formType === studentType) {
    let wechatId = req.body['studentSet']['wechatId'];
    path += 'student/' + wechatId;
    _.assign(postBody, {
      'message': wechatId,
    });
  }
  try {
    await axios.post(path, postBody);
    res.sendStatus(200);
    // res.sendStatus(giteeResponse.status);
  } catch (err) {
    res.sendStatus(err.response.status);
  }

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
