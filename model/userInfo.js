var mongoose = require('mongoose')
var UserSchema = mongoose.Schema({
    ID:String,
    news:String,
    lastTime:Date,
    lastIP:String
});
var User = mongoose.model('user',UserSchema);
module.exports = { User };