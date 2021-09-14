let server;
const request = require('supertest');
const auth = require('../../../middleware/auth');
const { Genre } = require('../../../models/genreModel');
const { User } = require('../../../models/userModel');

describe('auth middleware', ()=>{
  //happy paths
  let token;
  const exec = async ()=>{
    return await request(server).post('/api/genres')
     .set('x-auth-token', token)
     .send({name: 'Genre1'});
  };
  
  beforeEach(()=>{
    server = require('../../../index');
    token = new User({isAdmin: true}).generateAuth();
  });
  afterEach(async ()=> {
    server.close();
    await Genre.deleteMany({});
  });
  it('should return 401 if no token is provided', async ()=>{
    token = '';
    const res = await exec();
    expect(res.status).toBe(401);
  });

  it('should return 400 if Invalid token is provided', async ()=>{
    token = '1';
    const res =await exec();
    expect(res.status).toBe(400);
  });
});