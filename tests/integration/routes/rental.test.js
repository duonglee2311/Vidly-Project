const request = require('supertest');
let server;
const {Movie} = require('../../../models/movieModel');
const {Genre} = require('../../../models/genreModel');
const { Rental } = require('../../../models/rentalModel');
const { Customer } = require('../../../models/customerModel');
const { User } = require('../../../models/userModel');
const mongoose = require('mongoose');
describe('/api/rentals',()=>{
  let genre, movie, customer, rental, rentalId;
  beforeEach(async()=>{
    server = require('../../../index');

    genre = await Genre({name: "Action"}).save();

    movie = await Movie({
      title: 'The Avatar2',
      genre: {
        _id: genre._id,
         name: genre.name
      },
      numberInStock: 15,
      dailyRentalRate: 2
    }).save();

    customer = await Customer({
      name: 'customer1',
      phone: '1234567891'
    }).save();
    
    rental = await Rental({
      customer, movie
    }).save();
    rentalId = rental._id;
  });
  afterEach(async()=>{
    server.close();
    await Genre.deleteMany();
    await Movie.deleteMany();
    await Customer.deleteMany();
    await Rental.deleteMany();
  });
  describe('GET', ()=>{
    let token;
    const exec = async function() {
      return await request(server)
        .get('/api/rentals')
        .set('x-auth-token',token)
    }
    beforeEach(()=>{
      token = new User().generateAuth();
    });

    it('should return 401 if User not logged in',async()=>{
      token = '';
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it('should return rentals if status equal to 200',async()=>{
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toBeTruthy();
    });
  });
  
  describe('GET/:id', ()=>{
    //default data
    let token;
    const exec = async function() {
      return await request(server)
        .get(`/api/rentals/${rentalId}`)
        .set('x-auth-token',token)
    }
    beforeEach(()=>{
      token = new User().generateAuth();
    });

    it('should return 401 if User not logged in',async()=>{
      token = '';
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it('should return 404 if rentalId not a ObjectId',async()=>{
      rentalId = '1';
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it('should return 400 if rentalId Invalid',async()=>{
      rentalId = new mongoose.Types.ObjectId().toHexString();
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('should return rental if status equal to 200',async()=>{
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toBeTruthy();
    });
  });

  describe('POST', ()=>{
    let token;
    const exec = async function() {
      return await request(server)
        .post(`/api/rentals`)
        .set('x-auth-token',token)
        .send({
          customerId, movieId
        })
    }
    beforeEach(async()=>{
      token = new User().generateAuth();
      newCustomer = await Customer({
        name: 'customer1',
        phone: '1234567891'
      }).save();
      customerId = newCustomer._id;
      movieId = movie._id;
    });

    it('should return 401 if User not logged in',async()=>{
      token = '';
      const res = await exec();
      expect(res.status).toBe(401);
    });
    it('should return 400 if customerId not ObjectId',async()=>{
      customerId = '123';
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if movieId not ObjectId',async()=>{
      movieId = '123';
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if customerId Invalid',async()=>{
      customerId = new mongoose.Types.ObjectId().toHexString();
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if movieId Invalid',async()=>{
      movieId = new mongoose.Types.ObjectId().toHexString();
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return new rental if status equal to 200',async()=>{
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toBeTruthy();
    });
  });
});
