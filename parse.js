var mongoose = require('mongoose');
var log = require('debug')('ptt-bot');
var myBot = require('./PTT-BOT/ptt-bot');
var fs = require('fs');
var iconv = require('iconv-lite');
var User = require('./model/userInfo').User;
var Account = require('./account');


var numberOfUser = 0;

mongoose.connect('mongodb://140.118.126.240:27017/PTT');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	account = Account(process.argv[2]);
	myBot.login(account.ID,account.password,function(){
		console.log('成功登入');
	})


	myBot.toUserList(function(){
		console.log('UserList');
		numberOfUser = parseInt(myBot.escapeANSI(myBot.getScreen().split('\r')[2].split(" ")[4].split(":")[1]))	
		parseUserInfo(parseInt(numberOfUser));

	})


});

var parseUserInfo = function(num){
	console.log(num)
	let infos = Array(num).fill(0);
	var count = 0;
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
			var id,news,time,ip;
			try{
				id = info[0].split(" ")[0].substring(7);
				news = info[2].split(" ")[0].substring(7);
				time = info[3].split(" ")[0].substring(7)+" "+info[3].split(" ")[1];
				ip = info[3].split(" ")[7].substring(6);
			}catch(err){
				console.error(err);
				console.error(userInfo);
				return;
			}	
			new User({
				ID: id,
				news:news,
				lastTime:time,
				lastIP:ip,
				time:new Date()
			}).save((err,user)=>{
				if(err) console.error(err);
				console.log(user.ID);
			})
			
			count+=1;
			if(count == num+1)
				db.close();

		})
	})
}