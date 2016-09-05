'use strict'
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../model/userInfo').User;
router.all('/', function(req, res, next) {
    next()
});
router.post('/', function(req, res) {
    console.log(req.body);
    if (mongoose.connection.readyState == 0)
        mongoose.connect('mongodb://140.118.126.240:27017/PTT');
    var db = mongoose.connection;
    let back = "";
    let ans = [];
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        getDocs({
            ID: req.body.id
        }, (err, doc) => {
            if (err){
                console.err(err);
                res.send(['fail'])
            }
            
            console.log(doc);
            if(doc.length==0){
                res.send('no data')
            }
            back = doc;
            let ips = removeDuplicate(back, 'lastIP');
            let count = 0;
            if (doc.length > 0) {
                console.log('find member with same ip')
                console.log(ips)
                ips.forEach(ele => {
                    console.log(ele)
                    getDocs({
                        lastIP: ele,
                        ID: {
                            '$ne': req.body.id
                        }
                    }, (err, doc) => {
                        ans = ans.concat(doc);
                        if (count == ips.length - 1) {
                            // ans = removeDuplicate(ans, 'ID');
                            db.close();
                            res.send({record:back, related:ans});
                        } else
                            count++;
                    })
                })
            } else {
                console.err('not found');
                db.close();
                res.send([]);
            }

        })
    });

});

function removeDuplicate(obj, field) {
    let temp = obj.map(function(ele) {
        return ele[field];
    })
    let ans = temp.filter(function(ele, index, self) {
        return index == self.indexOf(ele);
    })
    return ans;
}

function getDocs(condition, callback) {
    User.find(condition, callback);
}

module.exports = router;