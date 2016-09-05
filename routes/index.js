var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res) {
  res.render('index', { title: '輸入ID找登入記錄跟過去曾經用相同IP的人' });
});

module.exports = router;
