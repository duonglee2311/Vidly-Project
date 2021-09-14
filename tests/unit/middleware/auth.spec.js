const mongoose = require('mongoose');
const auth =require('../../../middleware/auth');
const { User } = require('../../../models/userModel');

describe('auth middleware unit',()=>{
  test('should populate req.user with a valid jwt', ()=>{
    let req, res,next;
    let token = new User({
      _id: mongoose.Types.ObjectId().toHexString(),
      name: 'User1',
      isGold: false,
      isAdmin: true
    }).generateAuth();
    req = {
      header: jest.fn().mockReturnValue(token)
    }
    next = jest.fn();
    auth.isAuth(req,res,next);
    
    expect(req.user).toBeDefined();
    
  });
});