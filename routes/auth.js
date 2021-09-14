const bcrypt = require('bcrypt');
const Joi = require('Joi');
const _ = require('lodash');
const { User} = require('../models/userModel');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

// POST: LOGIN
router.post('/', async function(req,res) {
  let {error} = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ 
    email: req.body.email
  });
  if(!user) return res.status(400).send('Invalid email or password');
  let isAuth = await bcrypt.compare(req.body.password, user.password);
  if(!isAuth) return res.status(400).send('Invalid email or password');

  const token = user.generateAuth();
  
  res.send(token);
});

function validate(user) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(1024).required(),
  });
  return schema.validate({
    email: user.email,
    password: user.password
  });
}
module.exports = router;