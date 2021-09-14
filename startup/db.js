const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config');

module.exports = function() {
  const db = config.get('db');
  mongoose.connect(db,{
    // --detectOpenHandles
    useNewUrlParser: true ,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => winston.log('info',`Connecting to ${db}`));
}