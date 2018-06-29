const ADMIN_WECHAT_ACCOUNT = 'loujiadong';

const LISTSERV_EMAIL = 'listserv@listserv.neu.edu'

const getDriverSubmissionHTML = ({ name, wechatId, gender, huskyEmail, status, degree, phone, carType }) => {
  return `
  <h4>您好，${name}</h4>
  <h4>    感谢您报名NUCSSA接机服务，请您联系NUCSSA管理员，您需要提供您的驾照来认证您的账号：${ADMIN_WECHAT_ACCOUNT}</h4>
  <h4>主要负责人微信: ${ wechatId }</h4>
  <h4>姓名: ${ name }</h4>
  <h4>性别: ${ gender }</h4>
  <h4>NEU husky邮箱: ${ huskyEmail }</h4>
  <h4>就读状态: ${ status }</h4>
  <h4>就读项目: ${ degree }</h4>
  <h4>电话: ${ phone }</h4>
  <h4>车型: ${ carType }</h4>
  <br/>
  <h4>NUCSSA IT部</h4>
  `;
};

const getStudentSubmissionHTML = (studentSubmission,
  { name, nuid, degree, email, wechatId, phone, emergencyContact, emergencyContactPhone }
  ) => {

  let { arrivingTime, flightNumber, address, luggageNumber } = studentSubmission;
  return `
  <h4>您好，${name}</h4>
  <h4>    感谢您报名NUCSSA接机服务，因为司机的数量有限，NUCSSA不确保您的订单有可能被受理</h4>
  <h4>    请您牢记您的主要联系人微信账号: ${studentSubmission.wechatId}</h4>
  <h4>到达时间: ${arrivingTime}</h4>
  <h4>航班号: ${flightNumber}</h4>
  <h4>目的地地址: ${address}</h4>
  <h4>行李箱总数量: ${luggageNumber}</h4>
  
  <br/>
  <h4>主要负责人微信: ${ wechatId }</h4>
  <h4>姓名: ${ name }</h4>
  <h4>NUID: ${ nuid }</h4>
  <h4>就读项目: ${ degree }</h4>
  <h4>邮箱: ${ email }</h4>
  <h4>微信ID: ${ wechatId }</h4>
  <h4>电话: ${ phone }</h4>
  <h4>紧急联系人: ${ emergencyContact }</h4>
  <h4>紧急联系人电话: ${ emergencyContactPhone }</h4>
  <br/>
  <h4>NUCSSA IT部</h4>
  `;
};

const getDriverVerificationSuccessHTML = (name) => {
  return `
  <h4>您好，${name}</h4>
     <h4>您的司机账号已经成功认证，您可以通过来
     <a href="https://nucssa.github.io/nucssa-pick-up-form/#/driver/login">管理页面</a>
     接单</h4>
  <br/>
  <h4>NUCSSA IT部</h4>
  `
};

const getDriverTakingOrderHTML = (name, studentWechatId) => {
  return `
  <h4>您好，${name}</h4>
     <h4>您以接收订单：
     <a href='https://nucssa.github.io/nucssa-pick-up-form/#/order/detail/${studentWechatId}'>点击查看详情</a>
     </h4>
  <br/>
  <h4>NUCSSA IT部</h4>
  `
};

const getStudentTakingOrderHTML = (name, studentWechatId) => {
  return `
  <h4>您好，${name}</h4>
     <h4>您的订单已被受理：
     <a href='https://nucssa.github.io/nucssa-pick-up-form/#/order/detail/${studentWechatId}'>点击查看详情</a>
     </h4>
  <br/>
  <h4>NUCSSA IT部</h4>
  `
};

const getCancelOrderHTML = (name, cancellerName, cancellerWechatId) => {
  return `
  <h4>您好，${name}</h4>
     <h4>您的订单已被${cancellerName}(微信ID: ${ cancellerWechatId }) 取消.
     <h4>详情请联系司机, 或者NUCSSA管理员：${ADMIN_WECHAT_ACCOUNT}</h4>
     </h4>
  <br/>
  <h4>NUCSSA IT部</h4>
  `
}

const getSubscribeHTML = () => {
  return `
    <p>SUBSCRIBE CSSA@LISTSERV.NEU.EDU Anonymous</p>
  `
}

module.exports = {
  getDriverSubmissionHTML,
  getStudentSubmissionHTML,
  getDriverVerificationSuccessHTML,
  getDriverTakingOrderHTML,
  getStudentTakingOrderHTML,
  getCancelOrderHTML,
  getSubscribeHTML,
  LISTSERV_EMAIL,
};
