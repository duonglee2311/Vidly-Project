const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Joi = require('joi')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
});
userSchema.methods.generateAuth = function() {
  return jwt.sign({ _id: this._id, isAdmin: this.isAdmin}, config.get('jwtSecretKey'));
}
const User = mongoose.model('Users', userSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(1024).required(),
  });
  return schema.validate({
    name: user.name,
    email: user.email,
    password: user.password
  });
}
module.exports.User = User;
module.exports.validate = validateUser;