'use strict';
module.exports = function (app) {
  const express = require('express');
  const { checkJwt } = require('../middlewares/authorization');
  const { authErrorHandler } = require('../middlewares/errorHandler')

  const apiRouter = express.Router();
  app.use('/api', apiRouter);

  apiRouter.get('/hello', async function(req, res) {
    res.send('Hello World');
  });

  const formsRouter = require('./forms');
  apiRouter.use('/forms', formsRouter);

  const orders = require('./orders');
  apiRouter.use('/orders', orders);

  const drivers = require('./drivers');
  apiRouter.use('/drivers', drivers);

  // Private routes
  apiRouter.use(checkJwt)
  const admin = require('./admin/drivers');
  apiRouter.use('/admin', admin)

  apiRouter.use(authErrorHandler)


};