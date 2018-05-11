'use strict';
module.exports = function (app) {
  const express = require('express');

  const apiRouter = express.Router();
  app.use('/api', apiRouter);

  apiRouter.get('/hello', async function(req, res) {
    res.send('Hello World');
  });


};