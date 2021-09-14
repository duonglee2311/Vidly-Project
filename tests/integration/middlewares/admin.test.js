let server;
const request = require('supertest');
const auth = require('../../../middleware/auth');
const { Genre } = require('../../../models/genreModel');
const { User } = require('../../../models/userModel');

describe('auth middleware', ()=>{
  //happy paths
  let token, isAdmin;
  const exec = async ()=>{
    token = new User({isAdmin}).generateAuth();
    return await request(server).post('/api/genres')
     .set('x-auth-token', token)
     .send({name: 'Genre1'});
  };
  
  beforeEach(()=>{
    isAdmin = true;
    token = new User().generateAuth();
    server = require('../../../index');
  });
  afterEach(async ()=> {
    server.close();
    await Genre.deleteMany({});
  });
  it('should return 403 if user is not Admin', async ()=>{
    isAdmin = false;
    const res = await exec();
    expect(res.status).toBe(403);
  });

  it('should return 200 if user is Admin', async ()=>{
    const res =await exec();
    expect(res.status).toBe(200);
  });
});