var mongoose = require('mongoose');
var log = require('debug')('ptt-bot');
var myBot = require('./PTT-BOT/ptt-bot');
var fs = require('fs');
var iconv = require('iconv-lite');
var User = require('./model/userInfo').User;

var numberOfUser = 0;

mongoose.connect('mongodb://localhost:27017/PTT');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	log('connect to database');
	myBot.login('parsertest0','test0',function(){
		console.log('登入');
	})


	myBot.toUserList(function(){
		console.log('UserList');
		numberOfUser = parseInt(myBot.escapeANSI(myBot.getScreen().split('\r')[2].split(" ")[4].split(":")[1]))
	})

	parseUserInfo(5);
});

var parseUserInfo = function(num){
	let infos = Array(num).fill(0);
	infos.forEach(function(){
		myBot.getUserInfo(function(){
			let userInfo = myBot.escapeANSI(myBot.getScreen()).split("\r");

			let info = userInfo.filter((val,index,arr)=>{
				val = val.replace(/\s/g,"");
				if(val.split("\r").length>1)
					val = val.split("\r")[1];
				if(index<6&&index>1)
					return val 
			});
			new User({
				ID: info[0].split(" ")[0].substring(7),
				news:info[2].split(" ")[0].substring(7),
				lastTime:info[3].split(" ")[0].substring(7)+" "+info[3].split(" ")[1],
				lastIP:info[3].split(" ")[7].substring(6)
			}).save((err,user)=>{
				if(err) console.error(err);
				console.log(user.ID);
			})
		})
	})
}
