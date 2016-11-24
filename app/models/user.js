/**
 * Created by SoRa on 2016/11/2 0002.
 */
var mongoose = require("mongoose");
var UserSchema = require('../schemas/user');
var User = mongoose.model('User',UserSchema);

module.exports = User;