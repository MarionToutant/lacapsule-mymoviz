var express = require('express');
var router = express.Router();
var request = require('sync-request');
var MovieModel = require('../models/movies');
const dotenv = require('dotenv');
dotenv.config();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/new-movies', function(req, res, next) {
  var data = request("GET", `https://api.themoviedb.org/4/discover/movie?api_key=${process.env.API_KEY}&language=fr-FR&sort_by=popularity.desc&include_adult=false&include_video=false&page=1`);
  var dataParse = JSON.parse(data.body);
  res.json({result: true, movies: dataParse.results});
});

router.post('/wishlist-movie', async function(req, res, next) {
  var newMovie = new MovieModel ({
    movieName: req.body.name,
    movieImg: req.body.img
  });
  var movieSave = await newMovie.save();
  var result = false; 
  if(movieSave.movieName){ 
    result = true;
  } 
  res.json({result});
});

router.delete('/wishlist-movie/:name', async function(req, res, next) {
  var returnDb = await MovieModel.deleteOne({ movieName: req.params.name})
  var result = false
  console.log(req.params.name);
  if(returnDb.deletedCount == 1){
    result = true
  }
  res.json({result})
});

router.get('/wishlist-movie', async function(req, res, next) {
  var movies = await MovieModel.find();
  res.json({movies});
});

module.exports = router;
