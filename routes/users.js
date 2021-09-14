const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User, validate} = require('../models/userModel');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

// GET: CURRENT USER
router.get('/me', auth.isAuth, async function(req, res) {
  let user = await User.findById(req.user._id).select('-password -__v');
  res.send(user);
});

// POST: REGISTER
router.post('/', async function(req,res) {

  const {error} = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email});
  if(user) return res.status(400).send('User already registered');

  user = new User(_.pick(req.body,['name', 'email','password']));
  const salts =await bcrypt.genSalt(12);
  user.password = await bcrypt.hash(user.password,salts);
  user = await user.save();
  let token = user.generateAuth();
  res.header('x-auth-token', token).send(_.pick(user,['name', 'email']));
});

module.exports = router;