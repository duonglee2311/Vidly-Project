const winston = require('winston');
// require('winston-mongodb');
require('express-async-errors');

module.exports = function() {
  winston.exceptions.handle(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ 
      level: 'error',
      filename: 'exceptions.log' 
    }));

    process.on('unhandledRejection', (ex) => {
      throw ex;
  });
  winston
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