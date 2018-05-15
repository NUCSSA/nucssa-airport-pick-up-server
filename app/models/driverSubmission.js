const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const driverSubmissionSchemaString = 'DriverSubmission';

const driverSubmissionSchema = new Schema({
  availableTimeSlot: { type: String, required: true },
  carType: { type: String, required: true },
  degree: { type: String, required: true },
  gender: { type: String, required: true },
  huskyEmail: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  status: { type: String, required: true },
  wechatId: { type: String, required: true, unique: true },
}, {
  timestamps: true,
});
mongoose.model(driverSubmissionSchemaString, driverSubmissionSchema);

module.exports = {
  driverSubmissionSchemaString,
  driverSubmissionSchema,
};
