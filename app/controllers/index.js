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
  const admin_drivers = require('./admin/drivers');
  const admin_orders = require('./admin/orders')
  const admin_students = require('./admin/students')
  apiRouter.use('/admin/drivers', admin_drivers)
  apiRouter.use('/admin/orders', admin_orders)
  apiRouter.use('/admin/students', admin_students)

  apiRouter.use(authErrorHandler)


};