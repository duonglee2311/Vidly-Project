const mongoose = require('mongoose');
const Joi = require('Joi');

const Customer = mongoose.model('customers', new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  isGold: {
    type: Boolean,
    default: false
  },
  phone: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 10
  }
}));

function validateCustomer(customer) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    phone: Joi.string().min(10).max(10).required(),
    isGold: Joi.boolean()
  })
  return schema.validate({
    name: customer.name,
    phone: customer.phone,
    isGold: customer.isGold,
  });
}

module.exports.Customer = Customer;
module.exports.validate = validateCustomer;