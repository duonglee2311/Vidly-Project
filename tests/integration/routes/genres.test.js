let server;
const request = require('supertest');
const { Genre } = require('../../../models/genreModel');
const { User } = require('../../../models/userModel');
const mongoose = require('mongoose');

describe('/api/genres', ()=> {
  beforeEach(()=>{
    server = require('../../../index');
  });
  afterEach(async ()=> {
    server.close();
    await Genre.deleteMany({})
  });

  describe('GET /', ()=> {
    it('should return all genres.', async ()=> {
      await Genre.insertMany([
        {name: "Action"},
        {name: "Action2"}
      ]);
      let res = await request(server).get('/api/genres');
      // 
      expect(res.status).toBe(200);
      expect(res.body.some(x=> x.name=='Action')).toBeTruthy();
      expect(res.body.some(x=> x.name=='Action2')).toBeTruthy();
    });
  });

  describe('GET /:id',  ()=>{
    it('should return valid genres when id í valid',async ()=>{
      let genre = new Genre({name: 'Duong'});
      await genre.save();
      let res = await request(server).get(`/api/genres/${genre._id}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', 'Duong');
    });

    it('should return status 404 if input is a invalid id', async ()=>{
      let res = await request(server).get(`/api/genres/1`);
      expect(res.status).toBe(404);
    });

    it('should return status 400 if id is not exists',async ()=>{
      let id = new mongoose.Types.ObjectId().toHexString();
      let res = await request(server).get(`/api/genres/${id}`);
      expect(res.status).toBe(400);
    });
  });

  describe('POST', ()=> {

    let name,token;
    const exec =async ()=>{ 
      return await request(server).post('/api/genres')
        .set('x-auth-token',token)
        .send({name});
    };

    beforeEach(()=>{
      token = new User({isAdmin: true}).generateAuth();
      name = 'Genre1';
    })

    it('should return 401 if client is not logged in',async ()=> {
      token = '';
      const res =await exec();

      expect(res.status).toBe(401);
    });
    
    it('should return 403 if client is not the admin',async ()=> {
      token = new User().generateAuth();
      const res =await exec();

      expect(res.status).toBe(403);
    });

    it('should return 400 if genres is less then 5 characters',async ()=> {
      name = '1234';
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('should return 400 if genres is more then 50 characters',async ()=> {
      name = new Array(52).join('a');
      const res = await exec();
      expect(res.status).toBe(400);
    });
    
    it('should save the genre if genres is Valid',async ()=> {
      
      await exec();

      const genre = await Genre.find({name: name});
      expect(genre).not.toBeNull();
    });
    
    it('should return the genre if genres is Valid',async ()=> {
      const res = await exec();
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name',name);
    });


  });

  describe('PUT',()=>{
    //happy path
    let id,token,name;
    const exec = async ()=>{
      return await request(server)
        .put(`/api/genres/${id}`)
        .set('x-auth-token',token)
        .send({name})
    }
    beforeEach( async ()=>{
      id = new mongoose.Types.ObjectId();
      token = new User({isAdmin: true}).generateAuth();
      name = 'Duong1';
      genre = new Genre({'_id': id, 'name': 'Duong'});
      await genre.save();
    });

    it('should return 401 if client is not logged in',async ()=> {
      token = '';
      const res =await exec();

      expect(res.status).toBe(401);
    });
    
    it('should return 403 if client is not the admin',async ()=> {
      token = new User().generateAuth();
      const res =await exec();

      expect(res.status).toBe(403);
    });

    it('should return 400 if genre is less then 5 characters', async()=>{
      name = 'aa';
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('should return 400 if genre is more then 50 characters', async()=>{
      name = new Array(52).join('a');
      const res = await exec();
      expect(res.status).toBe(400);
    });
    
    it('should return 400 if the genre is Invalid', async()=>{
      id = new mongoose.Types.ObjectId().toHexString();
      const res = await exec();
      expect(res.status).toBe(400);

    });

    it('should return genre if the genre is valid', async()=>{
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name',name);
    });
  });

  describe('DELETE', ()=>{
    let id,token;
    const exec = async ()=>{
      return await request(server)
        .delete(`/api/genres/${id}`)
        .set('x-auth-token',token)
    }
    beforeEach( async ()=>{
      id = new mongoose.Types.ObjectId();
      token = new User({isAdmin: true}).generateAuth();
      genre = new Genre({'_id': id, 'name': 'Duong'});
      await genre.save();
    })

    it('should return 401 when customer is not logging in', async()=>{
      token='';
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it('should return 403 when customer is not the admin', async()=>{
      token = new User({isAdmin: false}).generateAuth();
      const res = await exec();
      expect(res.status).toBe(403);
    });

    it('should return 400 when input is Invalid', async()=>{
      id = new mongoose.Types.ObjectId().toHexString();
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('should delete the genre if input is valid', async () => {
      await exec();

      const genreInDb = await Genre.findById(id);

      expect(genreInDb).toBeNull();
    });

    it('should return deleted genre when input is valid', async()=>{
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name','Duong');
    });

  });
});