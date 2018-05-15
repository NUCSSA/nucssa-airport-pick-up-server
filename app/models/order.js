const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const orderSchemaString = 'Order';

const { driverSubmissionSchemaString } = require('./driverSubmission');
const { studentSubmissionSchemaString } = require('./studentSubmission');

const IN_PROGRESS = 'IN_PROGRESS';
const DONE = 'DONE';
const BEFORE = 'BEFORE';

const OrderSchema = new Schema({
  driverWechatId: {
    type: String,
    required: true,
  },
  studentWechatId: {
    type: String,
    require: true,
    unique: true,
  },
  status: {
    type: String,
    enum: [IN_PROGRESS, DONE, BEFORE],
  },
}, {
  timestamps: true,
});

OrderSchema.virtual('driver', {
  ref: driverSubmissionSchemaString,
  localField: 'driverWechatId',
  foreignField: 'wechatId',
  justOne: true,
});

OrderSchema.virtual('student', {
  ref: studentSubmissionSchemaString,
  localField: 'studentWechatId',
  foreignField: 'wechatId',
  justOne: true,
});

OrderSchema.set('toObject', { virtuals: true });
OrderSchema.set('toJson', { virtuals: true });

OrderSchema.statics = {
  findWithPopulate(query) {
    return this.find(query)
      .populate('student')
      .populate('driver');
  },
};

mongoose.model(orderSchemaString, OrderSchema);

module.exports = {
  orderSchemaString,
  OrderSchema,
  IN_PROGRESS,
  DONE,
  BEFORE,
};
