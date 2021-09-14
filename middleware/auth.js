const jwt = require('jsonwebtoken');
const config =require('config');
function isAuth(req, res, next) {
  const token = req.header('x-auth-token');
  if(!token) return res.status(401).send('Access denied. No token provided');
  try {
    req.user = jwt.verify(token, config.get('jwtSecretKey'));
    next();
  } catch (ex) {
    res.status(400).send('Access denied. Invalid token');
  }
}

module.exports.isAuth = isAuth;