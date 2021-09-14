const jwt = require('jsonwebtoken');
const {User} =require('../../../models/userModel');
const mongoose = require('mongoose');
const config = require('config');

describe('userModel', ()=>{
  it('should return a valid jwt token', ()=> {
    const payload = {_id: new mongoose.Types.ObjectId(123).toHexString()};
    const user = new User(payload);
    const token = user.generateAuth();
    const result = jwt.verify(token, config.get('jwtSecretKey'));
    expect(result).toMatchObject(payload);
  });
});

// userModel.test.js