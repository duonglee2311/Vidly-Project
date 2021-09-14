const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const _ = require('lodash');
const {Customer, validate} = require('../models/customerModel');
const express = require('express');
const router = express.Router();

//GET: /api/customers/
router.get('/', async function(req, res) {
  const customers = await Customer.find().sort('name');
  res.send(customers);
});
//POST: /api/customers/
router.post('/', auth.isAuth, async function(req, res) {
  const { error} = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);
  
  const customer = new Customer(_.pick(req.body,['name', 'phone', 'isGold']));
  await customer.save();
  res.send(customer);
});
//PUT: /api/customers/:id
router.put('/:id', auth.isAuth, async function(req, res) {
  const { error} = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    _.pick(req.body,['name', 'phone', 'isGold']),
    { new: true});
  if(!customer) return res.status(400).send('the genre with the given ID is not found');
  res.send(customer);
});
//DELETE: /api/customers/:id
router.delete('/:id', [auth.isAuth, admin.isAdmin], async function(req, res) {
  let customer = await Customer.findByIdAndRemove( req.params.id);
  if(!customer) return res.status(400).send('the customer with the given ID is not found');
  
  res.send(customer);    
});
//GET: /api/customers/:id
router.get('/:id', async function(req, res) {
  const customer = await Customer.findById(req.params.id);
  if(!customer) return res.status(400).send('the customer with the given ID is not found');
  res.send(customer);
});

module.exports = router;