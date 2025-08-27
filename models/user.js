const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
//username and password are already stored by the passport so we don't have to need to write username:string or password:string
const userSchema=new Schema({
    email:String
})
userSchema.plugin(passportLocalMongoose);
const User=mongoose.model("User",userSchema);
module.exports=User;