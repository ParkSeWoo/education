
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
var url = 'mongodb://localhost:27017/moviest';
var dbObj = null;
MongoClient.connect(url, function(err, db) {
	if (err) console.log(err);
	else {
		dbObj = db;
		console.log("Connected correctly to server");
	}
});
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root1234',
  database : 'moviest'
});
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + connection.threadId);
});

/*var movieList = ['아바타','스타워즈','인터스텔라'];
var movieDetail = {
	'아바타':{
		director:'제임스 카메론'
	},
	'스타워즈':{
		director:'조지 루카스'
	},
	'인터스텔라':{
		director:'크리스토퍼 놀란'
	}
};*/
app.get('/movies', function(req,res) {
	//res.send(JSON.stringify({result:true,movieList:movieList}));
	
	/*var collection = dbObj.collection('movies');
	collection.find({},{title:1,_id:0}).toArray(function(err, docs) {
		if (err) res.send(JSON.stringify({result:false,movieList:[]}));
		else {
			//res.send(JSON.stringify({result:true,movieList:docs}));
			var results = [];
			for (var i = 0; i < docs.length; i++) {
				results.push(docs[i].title);
			}
			res.send(JSON.stringify({result:true,movieList:results}));
		}
	});*/
	
	connection.query('SELECT title,director FROM movie', function(err, rows, fields) {
	  if (err) res.send(JSON.stringify({result:false,movieList:[]}));
	  else {
		  var results = [];
		  for (var i = 0; i < rows.length; i++) {
			  results.push(rows[i].title);
		  }
		res.send(JSON.stringify({result:true,movieList:results}));  
	  }
	});
});
app.get('/movies/:title', function(req,res) {
	/*console.log(req.params.title);
	var item = movieDetail[req.params.title];
	if (item) {
		res.send(JSON.stringify(item));
	} else {
		res.send('Wrong movie name');
	}*/
	/*var collection = dbObj.collection('movies');
	collection.find({title:req.params.title},{_id:0}).toArray(function(err, docs) {
		if (err) res.send('Wrong movie name');
		else res.send(JSON.stringify(docs[0]));
	});*/
	connection.query('SELECT title,director FROM movie WHERE title=?;', [req.params.title], 
			function(err, rows, fields) {
		if (err) res.send('Wrong movie name');
		else {
			var collection = dbObj.collection('movies');
			collection.find({title:req.params.title},{_id:0}).toArray(function(err, docs) {
				var resultObj = {};
				resultObj.title = rows[0].title;
				resultObj.director = rows[0].director;
				resultObj.review = docs[0].review;
				res.send(JSON.stringify(resultObj));
			});
			
		}
	});
});
app.post('/movies', function(req, res) {
	/*movieList.push(req.param('title'));
	movieDetail[req.param('title')] = {director:req.param('director')};
	res.send(JSON.stringify({result:true,movieList:movieList,
		movieDetail:movieDetail[req.param('title')]}));*/
	/*var collection = dbObj.collection('movies');
	collection.insert({title:req.param('title'),director:req.param('director')}, function(err, result) {
		if (err) res.send(JSON.stringify({result:false,movieList:[],movieDetail:{}}));
		else {
			collection.find({},{title:1,_id:0}).toArray(function(err, docs) {
				if (err) res.send(JSON.stringify({result:false,movieList:[],movieDetail:{}}));
				else {
					var results = [];
					for (var i = 0; i < docs.length; i++) {
						results.push(docs[i].title);
					}
					res.send(JSON.stringify({result:true,movieList:results,
						movieDetail:{director:req.param('director')}}));
				}
			});
		}
	});*/
	connection.query('INSERT INTO movie(title,director) VALUES(?,?);', [req.param('title'),req.param('director')],
			function(err, rows, fields) {
		if (err) res.send(JSON.stringify({result:false,movieList:[],movieDetail:{}}));
		else {
			if (req.param('review') != undefined) {
				var collection = dbObj.collection('movies');
				collection.insert({title:req.param('title'),review:req.param('review')}, function(err, result) {
				});
			}
			connection.query('SELECT title,director FROM movie', function(err1, rows1, fields1) {
				if (err1) res.send(JSON.stringify({result:false,movieList:[],movieDetail:{}}));
				else {
					var results = [];
					for (var i = 0; i < rows1.length; i++) {
						results.push(rows1[i].title);
					}
					res.send(JSON.stringify({result:true,movieList:results,
						movieDetail:{director:req.param('director')}}));
				}
			});
		}
	});
});
//[{"title":"토토로","director":"미야자키하야오"}]
app.put('/movies', function(req, res) {
	var movies = JSON.parse(req.param('movieList'));
	/*movieList = [];
	movieDetail = {};
	for (var i = 0; i < movies.length; i++) {
		movieList.push(movies[i].title);
		movieDetail[movies[i].title] = {director:movies[i].director};
	}
	res.send(JSON.stringify({result:true, movieList:movieList,
		movieDetail:movieDetail}));*/
	var collection = dbObj.collection('movies');
	collection.remove({}, function(err, result) {
		collection.insertMany(movies, function(err, result) {
			if (err) res.send(JSON.stringify({result:false,movieList:[],movieDetail:{}}));
			else {
				collection.find({}, {_id:0}).toArray(function(err, docs) {
					if (err) res.send(JSON.stringify({result:false,movieList:[],movieDetail:{}}));
					else {
						var results = [];
						var details = {};
						for (var i = 0; i < docs.length; i++) {
							results.push(docs[i].title);
							details[docs[i].title] = { director : docs[i].director };
						}
						res.send(JSON.stringify({result:true,movieList:results,movieDetail:details}));
					}
				});
			}
		});
	});
});
app.put('/movies/:title', function(req, res) {
	/*if (movieDetail[req.params.title]) {
		movieDetail[req.params.title].director = req.param('director');
	} else {
		movieList.push(req.params.title);
		movieDetail[req.params.title] = {director:req.param('director')};
	}
	res.send(JSON.stringify({result:true, movieDetail:movieDetail}));*/
	var collection = dbObj.collection('movies');
	collection.updateOne({title:req.params.title}, {$set:{director:req.param('director')}}, function(err,result) {
		if (err) res.send(JSON.stringify({result:false,movieDetail:{}}));
		else res.send(JSON.stringify({result:true,movieDetail:req.param('director')}));
	});
});
app.delete('/movies', function(req, res) {
	/*movieList = [];
	movieDetail = {};
	res.send(JSON.stringify({result:true,movieList:movieList,
		movieDetail:movieDetail}));*/
	/*var collection = dbObj.collection('movies');
	collection.remove({}, function(err, result) {
		if (err) res.send(JSON.stringify({result:false}));
		else res.send(JSON.stringify({result:true, movieList:[], movieDetail:{}}));
	});*/
	connection.query('DELETE FROM movie;', function(err, rows, fields) {
		if (err) res.send(JSON.stringify({result:false}));
		else res.send(JSON.stringify({result:true, movieList:[], movieDetail:{}}));
	});
});
app.delete('/movies/:title', function(req, res) {
	connection.query('DELETE FROM movie WHERE title=?;', [ req.params.title ], function(err, rows, fields) {
		if (err) res.send('Wrong movie name');
		else {
			connection.query('SELECT title,director FROM movie', function(err1, rows1, fields1) {
				if (err) res.send(JSON.stringify({result:false,movieList:[],movieDetail:{}}));
				else {
					var results = [];
					var details = {};
					for (var i = 0; i < rows.length; i++) {
						results.push(rows[i].title);
						details[rows[i].title] = { director : rows[i].director };
					}
					res.send(JSON.stringify({result:true,movieList:results,movieDetail:details}));
				}
			});
		}
	});
	/*var collection = dbObj.collection('movies');
	collection.remove({title:req.params.title}, function(err, result) {
		if (err) res.send('Wrong movie name');
		else {
			collection.find({}, {_id:0}).toArray(function(err, docs) {
				if (err) res.send(JSON.stringify({result:false,movieList:[],movieDetail:{}}));
				else {
					var results = [];
					var details = {};
					for (var i = 0; i < docs.length; i++) {
						results.push(docs[i].title);
						details[docs[i].title] = { director : docs[i].director };
					}
					res.send(JSON.stringify({result:true,movieList:results,movieDetail:details}));
				}
			});
		}
	});*/
	/*if (movieDetail[req.params.title]) {
		var index = movieList.indexOf(req.params.title);
		if (index != -1) {
			movieList.splice(index, 1);
		}
		delete movieDetail[req.params.title];
		res.send(JSON.stringify({result:true,movieList:movieList,
			movieDetail:movieDetail}));
	} else {
		res.send('Wrong movie name');
	}*/
});


app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
