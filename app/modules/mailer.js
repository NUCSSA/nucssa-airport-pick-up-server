const nodemailer = require('nodemailer');
const _ = require('lodash');

const EMAIL_USER = process.env['EMAIL_USER'];
const EMAIL_PASSWORD = process.env['EMAIL_PASSWORD'];

const {
  getDriverSubmissionHTML,
  getStudentSubmissionHTML,
  getDriverVerificationSuccessHTML,
  getDriverTakingOrderHTML,
  getCancelOrderHTML,
  getStudentTakingOrderHTML,
  getSubscribeHTML,
  LISTSERV_EMAIL,
} = require('../data/emailTempaltes');

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});

function buildMailOptions({ from='"NUCSSA IT部" <nucssait@gmail.com>', to, subject, htmlText }) {
  return {
    from: from, // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    // text: 'Hello world?', // plain text body
    html: htmlText, // html body
  };
}

function buildDriverOptions(driverSubmission) {
  let { huskyEmail } = driverSubmission;

  return buildMailOptions({
    to: huskyEmail,
    subject: 'NUCSSA接机活动: 司机报名成功',
    htmlText: getDriverSubmissionHTML(driverSubmission),
  })
}


function buildStudentOptions(studentSubmission, individualStudent) {
  let { email } = individualStudent;

  return buildMailOptions({
    to: email,
    subject: 'NUCSSA接机活动: 乘客报名成功',
    htmlText: getStudentSubmissionHTML(studentSubmission, individualStudent),
  })
}

function buildDriverVerificationOptions(driverSubmission) {
  let { huskyEmail, name } = driverSubmission;

  return buildMailOptions({
    to: huskyEmail,
    subject: 'NUCSSA接机活动: 司机认证成功',
    htmlText: getDriverVerificationSuccessHTML(name),
  })
}

function buildDriverTakingOrderOptions(driverSubmission, studentWechatId) {
  let { huskyEmail, name } = driverSubmission;

  return buildMailOptions({
    to: huskyEmail,
    subject: 'NUCSSA接机活动: 成功接单',
    htmlText: getDriverTakingOrderHTML(name, studentWechatId),
  })
}

function buildStudentTakingOrderOptions(studentWechatId, individualStudent) {
  let { email, name } = individualStudent;

  return buildMailOptions({
    to: email,
    subject: 'NUCSSA接机活动: 乘客报名成功',
    htmlText: getStudentTakingOrderHTML(name, studentWechatId),
  })
}

function buildSubscriptionOptions(individualStudent) {
  let { email, name } = individualStudent;
  const fromStirng = `"${name}" <${email}>`
  return buildMailOptions({
    from: fromStirng,
    to: LISTSERV_EMAIL,
    subject: 'NUCSSA邮件列表订阅成功',
    htmlText: getSubscribeHTML(),
  })
}

function buildDriverCancelOrderOptions(individualStudent, driverSubmission) {
  let { email, name } = individualStudent;
  let {name: driverName, wechatId: driverWechatId } = driverSubmission
  return buildMailOptions({
    to: email,
    subject: 'NUCSSA接机活动: 您的订单被取消',
    htmlText: getCancelOrderHTML(name, driverName, driverWechatId),
  })
}

function buildStudentCancelOrderOptions(driverSubmission, studentSubmission) {
  let { name, huskyEmail } = driverSubmission
  let { wechatId } = studentSubmission
  let studentSetName = _.map(studentSubmission.studentSet, (s) => {
    return s.name
  }).join(', ')
  return buildMailOptions({
    to: huskyEmail,
    subject: 'NUCSSA接机活动: 您的订单被取消',
    htmlText: getCancelOrderHTML(name, studentSetName, wechatId),
  })
}


async function sendMail(mailOptions) {
  return transporter.sendMail(mailOptions);
}

async function sendMailWithoutAuth(mailOptions) {
  const sendmail = require('sendmail')({silent: true})
  return sendmail(mailOptions)
}

async function sendDriverEmail(driverSubmission) {
  let driverOptions = buildDriverOptions(driverSubmission);
  return sendMail(driverOptions)
}

async function sendStudentEmail(studentSubmission) {
  let studentMailOptionSet = _.map(studentSubmission.studentSet, (s) => {
    return buildStudentOptions(studentSubmission, s);
  });

  let asyncFunctionSet = _.map(studentMailOptionSet, (studentMailOption) => {
    return sendMail(studentMailOption);
  });

  return Promise.all(asyncFunctionSet);
}

async function sendDriverVerificationEmail(driverSubmission) {
  let driverVerificationOptions = buildDriverVerificationOptions(driverSubmission);
  return sendMail(driverVerificationOptions);
}

async function sendDriverTakingOrderEmail(driverSubmission, studentWechatId) {
  let driverTakingOrderOptions = buildDriverTakingOrderOptions(driverSubmission, studentWechatId);
  return sendMail(driverTakingOrderOptions);
}

async function sendDriverCancelOrderEmail(studentSubmission, driverSubmission) {
  let driverCancelMailOptionSet = _.map(studentSubmission.studentSet, (s) => {
    return buildDriverCancelOrderOptions(s, driverSubmission);
  });

  let asyncFunctionSet = _.map(driverCancelMailOptionSet, (driverCancelMailOption) => {
    return sendMail(driverCancelMailOption)
  });
  return Promise.all(asyncFunctionSet);
}

async function sendStudentCancelOrderEmail(driverSubmission, studentSubmission) {
  let studentCancelMailOption = buildStudentCancelOrderOptions(driverSubmission, studentSubmission);
  return sendMail(studentCancelMailOption)
}

async function sendStudentTakingOrderEmail(studentSubmission) {
  let studentMailOptionSet = _.map(studentSubmission.studentSet, (s) => {
    return buildStudentTakingOrderOptions(studentSubmission.wechatId, s);
  });

  let asyncFunctionSet = _.map(studentMailOptionSet, (studentMailOption) => {
    return sendMail(studentMailOption);
  });

  return Promise.all(asyncFunctionSet);
}

async function sendStudentSubscriptionEmail(studentSubmission) {

  let studentMailOptionSet = _.map(studentSubmission.studentSet, (s) => {
    return buildSubscriptionOptions(s);
  });

  let asyncFunctionSet = _.map(studentMailOptionSet, (studentMailOption) => {
    return sendMailWithoutAuth(studentMailOption);
  });

  return Promise.all(asyncFunctionSet);
}

module.exports = {
  sendDriverEmail,
  sendStudentEmail,
  sendDriverVerificationEmail,
  sendDriverTakingOrderEmail,
  sendDriverCancelOrderEmail,
  sendStudentTakingOrderEmail,
  sendStudentCancelOrderEmail,
  sendStudentSubscriptionEmail,
};
