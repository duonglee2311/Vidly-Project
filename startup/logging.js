const winston = require('winston');
// require('winston-mongodb');
require('express-async-errors');

module.exports = function() {
  winston.add(new winston.transports.File( {
    filename: 'exceptions.log',
    level: 'error',
    handleExceptions: true,
    handleRejections: true
  }))
  .add(new winston.transports.File({ 
    filename: 'logfile.log',
    level: 'info',
    format: winston.format.combine(winston.format.timestamp(), winston.format.json())
  }));
  // .add(new winston.transports.MongoDB({
  // db: 'mongodb://localhost:27017/vidly',
  // options: {useUnifiedTopology: true}
  // }));
}