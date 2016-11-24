/**
 * Created by SoRa on 2016/11/15 0015.
 */
var Category = require('../models/category');
var _=require('underscore');


exports.new = function(req,res){
    res.render('category_admin',{
        title:'imooc 后台分类录入页',
        category:{}
    })
}

exports.list = function(req,res){
    Category.fetch(function(err,categoies){
        if(err){
            console.log(err);
        }
        res.render('categorylist',{
            title:"imocc 分类列表页",
            categories:categoies
        })
    })
}

exports.save =function(req,res){
    var _category = req.body.category;
    var category = new Category(_category);

    category.save(function(err,category){
        if(err){
            console.log(err);
        }
        res.redirect('/admin/category/list');
    })
}

