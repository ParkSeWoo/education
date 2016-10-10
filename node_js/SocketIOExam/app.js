
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

app.get('/', routes.index);
app.get('/users', user.list);

var server = http.createServer(app);
///////////////////////////////////////////
var socketio = require('socket.io');
var io = socketio.listen(server);
io.sockets.on('connection',function(socket){
	console.log('connection');
	
	socket.on('hello',function(raw_msg){
		var msg = JSON.parse(raw_msg);
		console.log(msg.hello);
		socket.emit('hi', JSON.stringify({hi:'fine thanks'}));
	});
});
////////////////////////////////////////////

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
