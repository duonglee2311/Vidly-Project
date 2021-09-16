const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {Rental} = require('../models/rentalModel');
const {Movie} = require('../models/movieModel');
const Joi = require('joi');
const express = require('express');
const router = express.Router();

router.post('/', auth.isAuth, async function(req, res) {
  const {error} = validateReturn(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const rental = await Rental.findOne({
    'customer._id': req.body.customerId,
    'movie._id': req.body.movieId,
    'dateReturned': {$exists: false}
  });
  if(!rental) return res.status(400).send('Rental not found');
  if (rental.dateReturned) return res.status(400).send('Return already processed.');

  rental.return();
  await rental.save();
  await Movie.updateOne({ _id: rental.movie._id }, {
    $inc: { numberInStock: 1 }
  });

  return res.send(rental);
});

function validateReturn(body) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required()
  });
  return schema.validate({
    customerId: body.customerId,
    movieId: body.movieId,
  });
}
module.exports = router;