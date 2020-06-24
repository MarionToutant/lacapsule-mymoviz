var mongoose = require('mongoose');
var movieschema = mongoose.Schema({
    movieName: String,
    movieImg: String
});
var MovieModel = mongoose.model('movies', movieschema);
module.exports = MovieModel;