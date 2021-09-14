const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
const {Rental, validate} = require('../models/rentalModel');
const {Movie} = require('../models/movieModel');
const {Customer} = require('../models/customerModel');
const express = require('express');
const router = express.Router();

router.get('/', auth.isAuth, async function(req, res) {
  const rentals = await Rental.find().sort('-dateOut');
  res.send(rentals);
});

router.post('/', auth.isAuth, async function(req, res){

  const { error} = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);
  
  let customer = await Customer.findById(req.body.customerId);
  if(!customer) return res.status(400).send('Invalid customerId');
  const movie = await Movie.findById(req.body.movieId);
  if(!movie) return res.status(400).send('Invalid movieId');
  if(movie.numberInStock === 0) return res.status(400).send('Movie not in Stock.');
  
  const rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
      isGold: customer.isGold,
    },
    movie: {
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    }
  });
  await rental.save();
  movie.numberInStock--;
  movie.save();
  res.send(rental);
})

router.get('/:id', [auth.isAuth, validateObjectId], async function(req, res) {

  let rental = await Rental .findById(req.params.id);
  if(!rental) return res.status(400).send('the renta with the given ID is not found');
  res.send(rental);
});


module.exports = router;
