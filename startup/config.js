const config = require('config');

module.exports = function() {
  if(!config.get('jwtSecretKey')) {
    throw new Error('FATAL error: jwtSecretKey is not defined.');
  }
}