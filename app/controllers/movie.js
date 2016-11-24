/**
 * Created by SoRa on 2016/11/10 0010.
 */
var Movie = require('../models/movie');
var Comment = require('../models/comment');
var Category = require("../models/category");
var fs = require('fs');
var path = require('path');
var _=require('underscore');
exports.list = function(req,res){
    Movie.fetch(function(err,movies){
        if(err){
            console.log(err);
        }
        res.render('list',{
            title:'imooc 列表页',
            movies: movies
        })
    })
}
exports.detail = function(req,res){
    var id = req.params.id;
    Movie.update({_id:id},{$inc:{pv:1}},function(err){
        if(err)
            console.log(err);
    })
    Movie.findById(id,function(err,movie){

        Comment
            .find({movie :id})
            .populate("from","name")//通过user id 获取到 name 放入 from
            .populate('reply.from reply.to','name')
            .exec(function(err,comments){
//                for(var i in comments){
//
//                    console.log(comments[i].reply)
//                }
                res.render('detail',{
                    title: 'imooc '+movie.title,
                    movie:movie,
                    comments:comments
                })
        } )
    })
}


exports.new = function(req,res){
    Category.find({},function(err,categories){
        res.render('admin',{
            title: 'imooc 后台录入页',
            categories:categories,
            movie: {}
        })
    })

}

exports.update = function(req,res){
    var id = req.params.id;
    if(id){

        Movie.findById(id,function(err,movie){
            Category.find({},function(err,categories){
                res.render('admin',{
                    tittle:"imooc 后台更新",
                    movie:movie,
                    categories:categories
                })
            })

        })
    }
}
exports.savePoster = function(err,res,next){
    var posterData = req.files.uploadPoster;
    var filePath = posterData.path;
    var originalFilename = posterData.originalFilename;
    if(originalFilename){
        fs.readFile(filePath,function(err,data){
            var timestamp = Date.now();
            var type = posterData.type.split('/')[1];
            var poster = timestamp+"."+type;
            var newPath = path.join(__dirname,'../../','public/upload'+poster);
            fs.writeFile(newPath,data,function(err){
                req.poster = poster;
                next();
            });
        })
    }
    else{
        next();
    }

}
exports.save =function(req,res){
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie;
    if(req.poster){
        movieObj.poster = req.poster;
    }
    if(id){
        Movie.findById(id,function(err,movie){
            if(err){
                console.log(err);
            }
            _movie = _.extend(movie,movieObj);
            _movie.save(function(err,movie){
                if(err){
                    console.log(err);
                }
                res.redirect('/movie/'+movie._id);
            })
        });
    }
    else{
        console.log(movieObj)
        _movie = new Movie(movieObj);
        var categoryId = _movie.category;
        var categoryName = movieObj.categoryName;
        _movie.save(function(err,movie){
            if(err){
                console.log(err);
            }
            if(categoryId){
                Category.findById(categoryId,function(err,category){
                    category.movies.push(movie._id);
                    category.save(function(err,category){
                        res.redirect('/movie/'+movie._id);
                    })
                })
            }
            else if(categoryName){
                var category = new Category({
                    name:categoryName,
                    movies:[movie.id]
                })
                category.save(function(err,category){
                    _movie.category = category._id;
                    _movie.save(function(err,movie){
                        res.redirect('/movie/'+movie._id);
                    })

                })

            }


        })
    }
}

exports.del = function(req,res){
    var id = req.query.id;
    if(id){
        Movie.remove({_id:id},function(err,movie){
            if(err){
                console.log(err);
            }
            else{
                res.json({success:1});
            }
        })
    }
}