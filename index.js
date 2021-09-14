const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const express = require('express');
const winston = require('winston');

const app = express();

require('./startup/logging')();
require('./startup/db')();
require('./startup/config')();
require('./startup/routes')(app);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, ()=> winston.log('info',`link: http://localhost:${PORT}/api`));
module.exports = server;