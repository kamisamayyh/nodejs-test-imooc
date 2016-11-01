/**
 * Created by SoRa on 2016/10/16 0016.
 */
var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var Movie = require('./modejs/movie');
var _=require('underscore');
var ejs = require('ejs');
var port = process.env.PORT || 3000;
var app = express();

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/movies");



//app.engine('html',ejs.__express);
app.use(require('body-parser').urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));//静态文件配置的目录

app.locals.moment = require('moment');

app.set('views','./views/pages');
//app.set('view engine','html');
app.set('view engine','jade');


app.listen(port);

console.log('imooc started on port'+ port)

app.get('/',function(req,res){
    Movie.fetch(function(err,movies){
        if(err){
            console.log(err);
        }
        res.render('index',{
            title:'imooc 首页',
            movies: movies
        })
    })

});
app.get('/admin/list',function(req,res){
    Movie.fetch(function(err,movies){
        if(err){
            console.log(err);
        }
        res.render('list',{
            title:'imooc 列表页',
            movies: movies
        })
    })
});
app.get('/movie/:id',function(req,res){
    var id = req.params.id;

    Movie.findById(id,function(err,movie){
        if(err){
            console.log(err);
        }
        res.render('detail',{
            title: 'imooc '+movie.title,
            movie:movie
        })
    })

});


app.get('/admin/movie',function(req,res){
    res.render('admin',{
        title: 'imooc 后台录入页',
        movie: {
            title: '',
            doctor: '',
            country: '',
            year: '',
            poster: '',
            flash: '',
            summary: '',
            language: ''
        }
    })
});

app.get('/admin/update/:id',function(req,res){
    var id = req.params.id;
    if(id){
        Movie.findById(id,function(err,movie){
            res.render('admin',{
                tittle:"imooc 后台更新",
                movie:movie
            })
        })
    }
})

app.post('/admin/movie/new',function(req,res){

    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie;
    if(id!==undefined && id !== "" && id !== null){
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

        _movie = new Movie({
            doctor:movieObj.doctor,
            title:movieObj.title,
            country:movieObj.country,
            language:movieObj.language,
            year:movieObj.year,
            poster:movieObj.poster,
            summary:movieObj.summary,
            flash:movieObj.flash
        });
        _movie.save(function(err,movie){
            if(err){
                console.log(err);
            }
            res.redirect('/movie/'+movie._id);
        })
    }
})

app.delete('/admin/list',function(req,res){
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
})