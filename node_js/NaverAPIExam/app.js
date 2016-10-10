
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

//https://openapi.naver.com/v1/search/blog.xml?query=뽑기 윗봉
var request = require('request');
var parseString = require('xml2js').parseString;
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/naverapi';
MongoClient.connect(url, function(err, db) {
	if (err) {
		console.log(err);
	} else {
		console.log("Connected correctly to server");

		var headers = {
		 'Content-Type':     'application/xml',
		 'X-Naver-Client-Id':'FLu8zC9pAML9JtAj21YE',
		 'X-Naver-Client-Secret':'bhYphxsabn'
		}
		var options = {
		 url: 'https://openapi.naver.com/v1/search/blog.xml?query=뽑기 윗봉',
		 method: 'GET',
		 headers: headers
		}
		request(options, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log(body)//body --> XML 문자열
				parseString(body, function (err, result) {
				    console.dir(result);//result --> JSON 객체
				    console.log(JSON.stringify(result.rss.channel));
				    var array = result.rss.channel[0].item;
				    insertDocuments(db, array, function(err, result) {
				    		if (err) console.log(err);
				    		else {
				    			console.log(result);
				    		}
				    });
				    /*for (var i = 0; i < array.length; i++) {
				    		var obj = array[i];
				    		console.log(obj.description[0]);
				    }*/
				});
			}
		});
		
		//db.close();
	}
});

var insertDocuments = function(db, array, callback) {
	var collection = db.collection('blogs');
	collection.insertMany(array, function(err, result) {
		if (err) callback(err);
		else callback(null, result);
	});
}
//////////////////////////////////////////////////////////////
var mongoose = require('mongoose');
var conn = mongoose.createConnection('mongodb://localhost:27017/naverapi');
var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;
var BlogPost = new Schema({
	id    		: ObjectId,
	title     	: String,
	link      	: String,
	description : String,
	bloggername : String,
	bloggerlink : String,
	date      	: Date
});
var BlogModel = conn.model('blogmodel', BlogPost);
var headers = {
 'Content-Type':     'application/xml',
 'X-Naver-Client-Id':'FLu8zC9pAML9JtAj21YE',
 'X-Naver-Client-Secret':'bhYphxsabn'
}
var options = {
 url: 'https://openapi.naver.com/v1/search/blog.xml?query=뽑기 윗봉',
 method: 'GET',
 headers: headers
}
request(options, function (error, response, body) {
	if (!error && response.statusCode == 200) {
		console.log(body)//body --> XML 문자열
		parseString(body, function (err, result) {
		    console.dir(result);//result --> JSON 객체
		    console.log(JSON.stringify(result.rss.channel));
		    var array = result.rss.channel[0].item;
		    for (var i = 0; i < array.length; i++) {
		    		var obj = array[i];
		    		var model = new BlogModel;
		    		model.title = obj.title[0];
		    		model.link = obj.link[0];
		    		model.description = obj.description[0];
		    		model.bloggername = obj.bloggername[0];
		    		model.bloggerlink = obj.bloggerlink[0];
		    		model.date = new Date();
		    		model.save(function(err) {
		    			
		    		});
		    }
		});
	}
});




app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
