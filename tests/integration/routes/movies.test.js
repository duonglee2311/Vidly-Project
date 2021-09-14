const request = require('supertest');
let server;
const {Movie} = require('../../../models/movieModel');
const {Genre} = require('../../../models/genreModel');
const { User } = require('../../../models/userModel');
const mongoose = require('mongoose');

describe('/api/movies', ()=>{
  let genre;
  beforeEach(async()=>{
    server = require('../../../index');
    genre = await Genre({name: "Action"});
    await genre.save();
  });
  afterEach(async()=>{
    server.close();
    await Genre.deleteMany();
    await Movie.deleteMany();
  });
  describe('GET:', ()=>{
    it('should return all movies', async()=>{
      await Movie.insertMany([
        {
          title: 'The Avatar',
          genre: genre,
          numberInStock: 15,
          dailyRentalRate: 2
        },
        {
          title: 'The Avatar2',
          genre: genre,
          numberInStock: 15,
          dailyRentalRate: 2
        }
      ]);
      const res = await request(server).get('/api/movies');

      expect(res.status).toBe(200);
      expect(res.body.some( x => x.title === 'The Avatar')).toBeTruthy();
      expect(res.body.some( x => x.title === 'The Avatar2')).toBeTruthy();
    });
  });

  describe('GET /:id',  ()=>{
    it('should return valid movies when id is valid',async ()=>{
      let movie = new Movie({
        title: 'The Avatar',
        genre: genre,
        numberInStock: 15,
        dailyRentalRate: 2
      });
      await movie.save();
      let res = await request(server).get(`/api/movies/${movie._id}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('title', 'The Avatar');
      expect(res.body).toHaveProperty('numberInStock', 15);
      expect(res.body).toHaveProperty('dailyRentalRate', 2);
    });

    it('should return status 404 if input is a invalid id', async ()=>{
      let res = await request(server).get(`/api/movies/1`);
      expect(res.status).toBe(404);
    });

    it('should return status 400 if id is not exists',async ()=>{
      let id = new mongoose.Types.ObjectId().toHexString();
      let res = await request(server).get(`/api/movies/${id}`);
      expect(res.status).toBe(400);
    });
  });

  describe('POST', ()=>{
    //happy path
    let token, title, numberInStock, dailyRentalRate;
    const exec = async function(){
      return await request(server)
        .post('/api/movies')
        .set('x-auth-token',token)
        .send({
          title: title,
          genreId: genre._id,
          numberInStock: numberInStock,
          dailyRentalRate: dailyRentalRate
        });
    };
    beforeEach(()=>{
      token = new User({isAdmin: true}).generateAuth();
      title = 'The Avatar2';
      numberInStock = 15;
      dailyRentalRate = 2;
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
    it('should return 400 if title is less then 5 characters',async ()=> {
      title = 'a';
      const res =await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if title is more then 255 characters',async ()=> {
      title = new Array(257).join('a');
      const res =await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if genre is Invalid',async ()=> {
      genre = '';
      const res =await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if numberInStock is less then 5 characters',async ()=> {
      numberInStock = -1;
      const res =await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if numberInStock is more then 255 characters',async ()=> {
      numberInStock = 256;
      const res =await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if dailyRentalRate is less then 5 characters',async ()=> {
      dailyRentalRate = -1;
      const res =await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if dailyRentalRate is more then 255 characters',async ()=> {
      dailyRentalRate = 256;
      const res =await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if movie is exists', async() =>{
      let movie = await Movie(
        {
          title: 'The Avatar2',
          genre: {
            _id: genre._id,
             name: genre.name
          },
          numberInStock: numberInStock,
          dailyRentalRate: dailyRentalRate
        });
      await movie.save();
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 200 if movie is saving', async() =>{
      const res = await exec();
      expect(res.status).toBe(200);
    });
    it('should return movie if movie is saving', async() =>{
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toBeTruthy();
    });
  });

  describe('PUT', ()=>{
    let id, token, title, numberInStock, dailyRentalRate, movie, genreId;
    const exec = async function(){
      return await request(server)
        .put(`/api/movies/${id}`)
        .set('x-auth-token',token)
        .send({
          title: title,
          genreId: genreId,
          numberInStock: numberInStock,
          dailyRentalRate: dailyRentalRate
        });
    };
    beforeEach(async()=>{
      genreId = genre._id;
      token = new User({isAdmin: true}).generateAuth();
      title = 'The Avatar2';
      numberInStock = 15;
      dailyRentalRate = 2;
      movie = await Movie({
          title: 'The Avatar2',
          genre: {
            _id: genre._id,
             name: genre.name
          },
          numberInStock: numberInStock,
          dailyRentalRate: dailyRentalRate
        });
      await movie.save();
      id = movie._id;
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
    it('should return 400 if data is Invalid',async ()=> {
      title='a';
      const res =await exec();

      expect(res.status).toBe(400);
    });
    it('should return 400 if Invalid genres',async ()=> {
      genreId = '1';
      const res =await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if movie is not exist',async ()=> {
      genreId = '1';
      const res =await exec();
      expect(res.status).toBe(400);
    });
    it('should return movie if movie is update', async() =>{
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toBeTruthy();
    });
  });

  describe('DELETE', ()=>{
    let movie,token;
    const exec = async function(){
      return await request(server)
        .delete(`/api/movies/${id}`)
        .set('x-auth-token',token);
    };

    beforeEach(async()=>{
      token = new User({isAdmin: true}).generateAuth();
      movie = await Movie({
          title: 'The Avatar2',
          genre: {
            _id: genre._id,
             name: genre.name
          },
          numberInStock: 15,
          dailyRentalRate: 2
        });
      await movie.save();
      id = movie._id;
    })

    afterEach(()=>{
      Movie.deleteMany();
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
    it('should return 400 if id is Invalid',async()=>{
      id = new mongoose.Types.ObjectId().toHexString();
      const res =await exec();
      expect(res.status).toBe(400);
    });
    it('should return 200 if success',async()=>{
      const res =await exec();
      expect(res.status).toBe(200);
    });
  });
});