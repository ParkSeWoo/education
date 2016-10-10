
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/login';
var dbObj = null;
MongoClient.connect(url, function(err, db) {
	if (err) console.log(err);
	else {
		dbObj = db;
		console.log("Connected correctly to server");
	}
});
var crypto = require('crypto');
app.get('/login', function(req, res) {
	res.render('login', {title:'Login'});
});
app.post('/login', function(req, res) {
	var hmac = crypto.createHmac('sha256', 'hash password');
	var pass = hmac.update(req.param('password')).digest('hex');
	var collection = dbObj.collection('users');
	collection.find({userid:req.param('id')}).toArray(function(err,docs) {
		if (err) res.send(err);
		else {
			if (docs.length > 0) {
				if (docs[0].password == pass) {//암호화된 패스워드끼리 비교
					//로그인 성공
					if (docs[0].admin == true) {
						//관리자
						res.send('Admin User!');
					} else {
						//일반 사용자
						res.send('Normal User!');
					}
				} else {
					//로그인 실패
					res.send('Wrong Password!!!');
				}
			} else {
				//시용자 없음
				res.redirect('\join');
				//res.send('Don\'t Exist User information');
			}
		}
	});
	//res.send(req.param('id')+","+req.param('password')+","+pass);
});
app.get('/join', function(req, res) {
	res.render('join', {title:'Join'});
});
app.post('/join', function(req, res) {
	var hmac = crypto.createHmac('sha256', 'hash password');
	var pass = hmac.update(req.param('password')).digest('hex');
	var admin = false;
	if (req.param('admin') == 'on') admin = true;
	var collection = dbObj.collection('users');
	collection.save({userid:req.param('id'),password:pass,admin:admin},
			function(err,result){
		if (err) res.send(err);
		else res.redirect('/login');
	});
	//res.send(req.param('id')+","+pass+","+admin);
	//res.send(req.param('id')+","+req.param('password')+","+req.param('admin'));
});

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
