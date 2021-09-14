const Joi = require('joi');
const mongoose = require('mongoose');
const moment = require('moment');

const rentalSchema = new mongoose.Schema({
  customer: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
      },
      isGold: {
        type: Boolean,
        default: false
      },
      phone: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 10
      }
    }),
    required: true
  },
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255
      },
      dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
      }
    }),
    required: true
  },
  dateOut: { type: Date, default: Date.now},
  dateReturned: { type: Date},
  rentalFee: { type: Number, min: 0}
});

rentalSchema.methods.return = function() {
  this.dateReturned = new Date();
  let a = this.dateOut;
  const rentalDays = moment().diff(this.dateOut, 'days');
  console.log({a,rentalDays});
  this.rentalFee = rentalDays * this.movie.dailyRentalRate;
}

const Rental = new mongoose.model('Rentals', rentalSchema);



function validateRental(rental){
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required()
  });
  return schema.validate({customerId: rental.customerId, movieId: rental.movieId});
}

module.exports.Rental = Rental;
module.exports.validate = validateRental;