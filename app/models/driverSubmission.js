const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const driverSubmissionSchemaString = 'DriverSubmission';

const DriverSubmissionSchema = new Schema({
  availableTimeSlot: { type: String, required: true },
  carType: { type: String, required: true },
  degree: { type: String, required: true },
  gender: { type: String, required: true },
  huskyEmail: { type: String, required: true },
  email: { type: String, required: false },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  status: { type: String, required: true },
  wechatId: { type: String, required: true, unique: true },
  verified: { type: Boolean, required: true, default: false },
  remark: { type: String, required: false },
}, {
  timestamps: true,
});
mongoose.model(driverSubmissionSchemaString, DriverSubmissionSchema);

module.exports = {
  driverSubmissionSchemaString,
  DriverSubmissionSchema,
};
