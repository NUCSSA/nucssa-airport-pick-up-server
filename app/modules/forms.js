const Joi = require('joi');
const _ = require('lodash');

const { driverSubmissionSchemaString } = require('../models/driverSubmission');
const { studentSubmissionSchemaString } = require('../models/studentSubmission');
const mongoose = require('mongoose');

const DriverSubmission = mongoose.model(driverSubmissionSchemaString);
const StudentSubmission = mongoose.model(studentSubmissionSchemaString);

const driverType = 'driver';
const studentType = 'student';

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
  wechatId: Joi.string(),
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

const submissionType = (type) => {
  if (type === driverType) {
    return DriverSubmission
  } else if (type === studentType) {
    return StudentSubmission
  }
};

const isRepeatSubmission = async (submissionModel, wechatId)  => {
  let submission = await submissionModel.findOne({
    wechatId: wechatId,
  });
  return !_.isNil(submission)
};

const persistSubmission = async ({ newFormBody, formType }) => {
  const submissionModel = submissionType(formType)
  const { wechatId } = newFormBody
  if (isRepeatSubmission(submissionModel, wechatId)) {
    throw new Error('Cannot submit form more than once')
  }
  return submissionModel.findOneAndUpdate({
    wechatId: newFormBody.wechatId,
  }, newFormBody, {
    upsert: true,
  });
};

module.exports = {
  persistSubmission,
  driverType,
  studentType,
  joiDriverFormSchema,
  joiStudentFormSchema,
};
