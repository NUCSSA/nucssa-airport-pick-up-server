const nodemailer = require('nodemailer');
const _ = require('lodash');

const EMAIL_USER = process.env['EMAIL_USER'];
const EMAIL_PASSWORD = process.env['EMAIL_PASSWORD'];

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});


function buildMailOptions({ to, subject, htmlText }) {
  return {
    from: '"NUCSSA IT部" <nucssait@gmail.com>', // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    // text: 'Hello world?', // plain text body
    html: htmlText, // html body
  };
}

function buildDriverOptions(driverSubmission) {
  let { huskyEmail, name } = driverSubmission;

  return buildMailOptions({
    to: huskyEmail,
    subject: 'NUCSSA接机活动: 司机报名成功',
    htmlText: `<h4>你好，${name}</h4><h4>    感谢您报名NUCSSA接机服务</h4>`,
  })
}


function buildStudentOptions(individualStudent) {
  let { email, name } = individualStudent;

  return buildMailOptions({
    to: email,
    subject: 'NUCSSA接机活动: 乘客报名成功',
    htmlText: `<h4>你好，${name}</h4><h4>    感谢您报名NUCSSA接机服务</h4>`,
  })
}

async function sendMail(mailOptions) {
  return transporter.sendMail(mailOptions);
}

async function sendDriverEmail(driverSubmission) {
  let driverOptions = buildDriverOptions(driverSubmission);
  return sendMail(driverOptions)
}

async function sendStudentEmail(studentSubmission) {
  let studentMailOptionSet = _.map(studentSubmission.studentSet, (s) => {
    return buildStudentOptions(s);
  });

  let asyncFunctionSet = _.map(studentMailOptionSet, (studentMailOption) => {
    return sendMail(studentMailOption);
  });

  return Promise.all(asyncFunctionSet);
}

module.exports = {
  sendDriverEmail,
  sendStudentEmail,
};
