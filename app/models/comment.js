/**
 * Created by SoRa on 2016/11/14 0014.
 */
var mongoose = require("mongoose");
var CommentSchema = require('../schemas/comment');
var Comment = mongoose.model('Comment',CommentSchema);

module.exports = Comment;