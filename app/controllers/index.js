/**
 * Created by SoRa on 2016/11/10 0010.
 */
var Movie = require('../models/movie');
var Category = require('../models/category');
exports.index = function(req,res){
    Category
        .find({})
        .populate({path:'movies',options:{limit:5}})
        .exec(function(err,categories){
            if(err){
                console.log(err);
            }
            res.render('index',{
                title:'imooc 首页',
                categories:categories
            })
        })

}
exports.search = function(req,res){
    var catId = req.query.cat;
    var q = req.query.q;
    var page = parseInt(req.query.p) || 0;
    var count =2;
    var index = page *count;
    if(catId){
        Category
            .find({_id:catId})
            .populate({path:'movies'})
            .exec(function(err,categories){

                if(err){
                    console.log(err);
                }
                var category = categories[0] || {};
                var movies = category.movies || [];
                var results = movies.slice(index,index +count);
                res.render('results',{
                    title:'imooc 结果列表',
                    keyword :category.name,
                    currentPage: (page+1),
                    totalPage: Math.ceil(movies.length/count),
                    query: 'cat='+catId,
                    movies:results
                })
            })
    }
    else{
        Movie
            .find({title:new RegExp(q+".*",'i')})
            .exec(function(err,movies){
                if(err){
                    console.log(err);
                }
                console.log(page)
                var results = movies.slice(index,index +count);
                console.log(results);
                res.render('results',{
                    title:'imooc 结果列表',
                    keyword :q,
                    currentPage: (page + 1),
                    totalPage: Math.ceil(movies.length/count),
                    query: 'cat='+catId,
                    movies:results
                })
            })
    }



}
