
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
var fs = require('fs');
app.post('/upload', function(req,res) {
	console.log(req.files.myfile1.path);
	console.log(req.files.myfile2.path);
	fs.readFile(req.files.myfile1.path, function(err, data) {
		var date = new Date();
		var filePath = __dirname+'/public/'+req.files.myfile1.name+
			date.getFullYear()+date.getMonth()+date.getDate()+
			date.getHours()+date.getMinutes()+date.getSeconds()+
			'.jpg';
		console.log(filePath);
		fs.writeFile(filePath, data, function(err1) {
			if (err1) console.log(err1)
			else res.redirect("back");
		});
	});
});

app.get('/', routes.index);
app.get('/users', user.list);

var server = http.createServer(app);
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var socketio = require('socket.io');
var io = socketio.listen(server);
var ss = require('socket.io-stream');
io.sockets.on('connection', function(socket) {
	console.log('connection!!!!!');

  ss(socket).on('upload', function(stream, data) {
	 console.log(JSON.stringify(data));
    var filename = path.basename(data.name);
    console.log(filename);
    stream.pipe(fs.createWriteStream(filename));
  });
});

