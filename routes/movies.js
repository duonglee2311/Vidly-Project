const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
const {Movie, validate} = require('../models/movieModel');
const {Genre} = require('../models/genreModel');
const express = require('express');
const router = express.Router();

router.get('/', async function(req, res) {
  const movies = await Movie.find().sort('name');
  res.send(movies);
});

router.post('/', [auth.isAuth, admin.isAdmin], async function(req, res) {
  const {error } = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if(!genre) return res.status(400).send('Invalid genre');
  
  let input = {
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate
  };
  let movie = await Movie.findOne(input);
  if(movie) return res.status(400).send('Movie is exists');
  
  movie = new Movie(input);
  await movie.save();
  res.send(movie);
});

router.put('/:id', [auth.isAuth, admin.isAdmin], async function(req, res) {
    
  const { error} = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);
  
  const genre = Genre.findById(req.body.genreId);
  if(!genre) return res.status(400).send('Invalid genre');

  const movie = await Movie.findByIdAndUpdate( req.params.id, {
    title: req.body.title,
    genre: genre,
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate
  },{ new: true });
  if(!movie) return res.status(400).send('the movie with the given ID is not found');
  res.send(movie);
});

router.delete('/:id', [auth.isAuth, admin.isAdmin], async function(req, res) {
  const movie = await Movie.findByIdAndRemove(req.params.id);
  if(!movie) return res.status(400).send('the movie with the given ID is not found');
  
  res.send(movie);    
});

router.get('/:id', validateObjectId, async function(req, res) {
  const movie = await Movie.findById(req.params.id);
  if(!movie) return res.status(400).send('the movie with the given ID is not found');
  
  res.send(movie);
});


module.exports = router;