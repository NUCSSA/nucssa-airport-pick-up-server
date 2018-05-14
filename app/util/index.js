const Base64 = require('js-base64').Base64;


function convertObjectToBase64(obj) {
  return Base64.encode(JSON.stringify(obj, null, 2));
}



function sendJoiValidationError(error, res) {
  return res.status(400).send(error.details);
}

module.exports = {
  convertObjectToBase64,
  sendJoiValidationError,
};

