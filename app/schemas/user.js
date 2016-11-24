/**
 * Created by SoRa on 2016/11/1 0001.
 */
/**
 * Created by SoRa on 2016/10/22 0022.
 */
var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
var SALT_WORK_FACTOR = 10;
var UserSchema = new mongoose.Schema({
    name:{
        unique:true,
        type: String
    },
    password:{
        unique:true,
        type: String
    },
    //0 :nomal
    //1 :verified
    //2 :professonal
    role: {
        type: Number,
        default:0
    },
    meta:{
        createAt:{
            type:Date,
            default:Date.now()
        },
        updateAt:{
            type:Date,
            default:Date.now()
        }

    }
});
UserSchema.pre('save',function(next) {
    var user = this;
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    }
    else {
        this.meta.update = Date.now();
    }
    var salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
    var hash = bcrypt.hashSync(user.password,salt);
    user.password = hash;
//    bcrypt.getSalt(SALT_WORK_FACTOR, function (err, salt) {
//        if(err) return next(err);
//        bcrypt.hash(user.password,salt,function(err,hash){
//            if(err) return next(err);
//            user.password = hash;
//            next();
//        })
//    });
    next();
});
UserSchema.methods = {
    comparePassword :function(_password,cb){
        bcrypt.compare(_password,this.password,function(err,isMatch){
            if(err) return cb(err);
            cb(null,isMatch);
        });
        //cb(null,bcrypt.compareSync(_password,this.password));
    }
}

UserSchema.statics = {
    fetch: function(cb){
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb)
    },
    findById: function(id,cb){
        return this
            .findOne({_id:id})
            .exec(cb)
    }
}

module.exports = UserSchema;