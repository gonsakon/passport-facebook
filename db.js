var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/facebookDB');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {});
var Schema  = mongoose.Schema;
var UserSchema =  new Schema({
    account:String,
    password:String
});
var alluser = new Schema({
	userid: String,
	name: String,
    token        : String,
});
mongoose.model( 'alluser', alluser );


