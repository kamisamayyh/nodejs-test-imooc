/**
 * Created by SoRa on 2016/11/15 0015.
 */
var mongoose = require("mongoose");
var CategorySchema = require('../schemas/category');
var Category = mongoose.model('Category',CategorySchema);

module.exports = Category;