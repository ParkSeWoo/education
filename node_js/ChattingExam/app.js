
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
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
var socketio = require('socket.io');
var io = socketio.listen(server);
var users = [];
///////////////////////////////////////////////////
var mongoose = require('mongoose');
var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;
mongoose.connect('mongodb://127.0.0.1:27017/chat');
var ChatMsgSchema = new Schema({
	id:ObjectId,
	message:String,
	date:String
});
var ChatMsgModel = mongoose.model('chatmsg', ChatMsgSchema);
//////////////////////////////////////////////////
var redis = require('redis');
var publisher = redis.createClient();
var subscriber = redis.createClient();

io.sockets.on('connection', function(socket) {
	console.log('connection!!!!!');
	socket.on('chat_conn', function(raw_msg) {
		console.log(raw_msg);
		var msg = JSON.parse(raw_msg);
		console.log(msg.chat_id);
		//채팅방 입장 아이디가 이미 채팅방에 존재하는지 확인
		//= users 배열에 해당 아이디가 존재하는지 체크
		var index = users.indexOf(msg.chat_id);
		if (index != -1) {//채팅방 입장 불가능
			socket.emit('chat_fail', JSON.stringify(msg));
		} else {//채팅방 입장 가능
			users.push(msg.chat_id);//배열에 아이디 추가
			socket.emit('chat_join', JSON.stringify(users));
			socket.broadcast.emit('chat_user', JSON.stringify(users));
			/////////////////////////////
			ChatMsgModel.find({}, function(err, docs) {
				socket.emit('messages', JSON.stringify(docs));
			});
		}
	});
	socket.on('chat_leave', function(raw_msg) {
		var msg = JSON.parse(raw_msg);
		if (msg.chat_id != '' && msg.chat_id != undefined) {
			var index = users.indexOf(msg.chat_id);
			if (index != -1) {
				users.splice(index, 1);//배열에서 해당 ID 삭제
				socket.broadcast.emit('chat_user',
						JSON.stringify(users));
			}
		}
	});
	socket.on('message', function(raw_msg) {//메시지 중계
		var msg = JSON.parse(raw_msg);
		/*socket.emit('message', 
				JSON.stringify({message:msg.chat_id+':'+msg.message}));
		socket.broadcast.emit('message',
				JSON.stringify({message:msg.chat_id+':'+msg.message}));*/
		publisher.publish('chat', msg.chat_id+':'+msg.message);
		////////////////////////////
		var chatMsg = new ChatMsgModel();
		chatMsg.message = msg.chat_id+':'+msg.message;
		chatMsg.date = new Date();
		chatMsg.save(function(err) {});
	});
	subscriber.subscribe('chat');
	subscriber.on('message', function(channel, message) {
		socket.emit('message', 
				JSON.stringify({message:message}));
	});
});







