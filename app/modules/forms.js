const Joi = require('joi');
const axios = require('axios');
const _ = require('lodash');

const { convertObjectToBase64 } = require('../util');

const driverType = 'driver';
const studentType = 'student';

const GITEE_ACCESS_TOKEN = process.env['GITEE_ACCESS_TOKEN'];
const GITEE_USERNAME = process.env['GITEE_USERNAME'];
const GITEE_REPOSITORY = process.env['GITEE_REPOSITORY_NAME'];
const GITEE_DB_URI = `https://gitee.com/api/v5/repos/${GITEE_USERNAME}/${GITEE_REPOSITORY}/contents/`;


const joiDriverFormSchema = Joi.object().keys({
  availableTimeSlot: Joi.string(),
  carType: Joi.string(),
  degree: Joi.string(),
  email: Joi.string().optional(),
  gender: Joi.string(),
  huskyEmail: Joi.string(),
  name: Joi.string(),
  phone: Joi.string(),
  remark: Joi.string().optional(),
  status: Joi.string(),
  wechatId: Joi.string(),
});

const joiStudentFormSchema = Joi.object().keys({
  studentSet: Joi.array().min(1).max(3).items(
    Joi.object().keys({
      name: Joi.string(),
      nuid: Joi.string(),
      degree: Joi.string(),
      email: Joi.string(),
      wechatId: Joi.string(),
      phone: Joi.string(),
    })
  ),
  arrivingTime: Joi.string(),
  flightNumber: Joi.string(),
  address: Joi.string(),
  luggageNumber: Joi.string(),
  remark: Joi.string().optional(),
});


const generateBody = async ({ newFormBody, formType }) => {
  let base64Content = convertObjectToBase64(newFormBody);

  let postBody = {
    'access_token': GITEE_ACCESS_TOKEN,
    'content': base64Content,
  };

  let filePath = GITEE_DB_URI;
  if (formType === driverType) {
    let wechatId = newFormBody['wechatId'];
    filePath += 'driver/' + wechatId;
    _.assign(postBody, {
      'message': wechatId,
    })
  } else if (formType === studentType) {
    let wechatId = newFormBody['studentSet'][0]['wechatId'];
    filePath += 'student/' + wechatId;
    _.assign(postBody, {
      'message': wechatId,
    });
  }

  return axios.post(filePath, postBody);
};

module.exports = {
  generateBody,
  driverType,
  studentType,
  joiDriverFormSchema,
  joiStudentFormSchema,
};
