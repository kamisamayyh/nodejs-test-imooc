/**
 * Created by SoRa on 2016/10/22 0022.
 */
var mongoose = require("mongoose");
var MovieSchema = require('../schemas/movie');
var Movie = mongoose.model('Movie',MovieSchema);

module.exports = Movie;