const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const studentSubmissionSchemaString = 'StudentSubmission';

const StudentSubmissionSchema = new Schema({
  wechatId: { type: String, required: true, unique: true },
  studentSet: [{
    name: { type: String, required: true },
    nuid: { type: String, required: true },
    degree: { type: String, required: true },
    email: { type: String, required: true },
    wechatId: { type: String, required: true },
    phone: { type: String, required: true },
    emergencyContact: { type: String, required: true },
    emergencyContactPhone: { type: String, required: true },
  }],
  arrivingTime: { type: Date, required: true },
  flightNumber: { type: String, required: true },
  address: { type: String, required: true },
  luggageNumber: { type: Number, required: true },
  remark: { type: String, required: false },
}, {
  timestamps: true,
});

mongoose.model(studentSubmissionSchemaString, StudentSubmissionSchema);

module.exports = {
  studentSubmissionSchemaString,
  StudentSubmissionSchema,
};
