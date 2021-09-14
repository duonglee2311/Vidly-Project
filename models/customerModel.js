const mongoose = require('mongoose');
const joi = require('joi');

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
  const schema = joi.object({
    name: joi.string().min(5).max(50).required(),
    phone: joi.string().min(10).max(10).required(),
    isGold: joi.boolean()
  })
  return schema.validate({
    name: customer.name,
    phone: customer.phone,
    isGold: customer.isGold,
  });
}

module.exports.Customer = Customer;
module.exports.validate = validateCustomer;