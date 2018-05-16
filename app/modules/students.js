// const _ = require('lodash');
const mongoose = require('mongoose');
// const Joi = require('joi');

const { studentSubmissionSchemaString } = require('../models/studentSubmission');

const StudentSubmission = mongoose.model(studentSubmissionSchemaString);

async function findStudentSubmission({ studentWechatId }) {
  return StudentSubmission.findOne({
    wechatId: studentWechatId,
  });
}

module.exports = {
  findStudentSubmission,
};

