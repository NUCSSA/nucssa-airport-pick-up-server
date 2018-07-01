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
  huskyEmail: Joi.string().email(),
  name: Joi.string(),
  phone: Joi.string(),
  remark: Joi.string().optional(),
  status: Joi.string(),
  wechatId: Joi.string().alphanum(),
});

const joiStudentFormSchema = Joi.object().keys({
  wechatId: Joi.string().alphanum(),
  studentSet: Joi.array().min(1).max(3).items(
    Joi.object().keys({
      name: Joi.string(),
      nuid: Joi.string(),
      degree: Joi.string(),
      email: Joi.string().email(),
      wechatId: Joi.string().alphanum(),
      phone: Joi.string(),
      emergencyContact: Joi.string(),
      emergencyContactPhone: Joi.string(),
    })
  ),
  arrivingTime: Joi.string(),
  flightNumber: Joi.string(),
  address: Joi.string(),
  luggageNumber: Joi.number().integer().min(1).max(6),
  remark: Joi.string().optional(),
});

const submissionType = (type) => {
  if (type === driverType) {
    return DriverSubmission
  } else if (type === studentType) {
    return StudentSubmission
  }
};

const isRecordExist = async (submissionModel, wechatId)  => {
  let submission = await submissionModel.findOne({
    wechatId: wechatId,
  });
  return !_.isNil(submission)
};

const persistSubmission = async ({ newFormBody, formType }) => {
  const submissionModel = submissionType(formType);
  const { wechatId } = newFormBody;
  let isExist = await isRecordExist(submissionModel, wechatId);
  if (isExist === true) {
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
