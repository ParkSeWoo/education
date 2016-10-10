
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

var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/daumapi');
var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

var ItemSchema = new Schema({
	id:ObjectId,
	title:String,
	publish_date:String,
	shoppingmall_count:String,
	maker:String,
	link:String,
	shoppingmall:String,
	review_count:String,
	brand:String,
	product_type:String,
	price_max:String,
	price_group:String,
	price_min:String,
	docid:String,
	description:String,
	category_name:String,
	image_url:String
});

var ItemModel = mongoose.model('shopping_itme', ItemSchema);

//###########
var request = require('request');
var headers = {
'Content-Type':     'application/json',
}
var apikey = '85ac72bf4d97eef7a3de4fafb5407f5c';
var query = encodeURIComponent('신학기 가방');
var options = {
url: 'https://apis.daum.net/shopping/search?apikey='+apikey+'&q='+query+
            '&result=20&pageno=3&output=json&sort=min_price',
method: 'GET',
headers: headers
}
request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body);//JSON 문자열
        var obj = JSON.parse(body);//문자열 -> 객체
        console.log(obj.channel.item.length);
        
        var itemArray = obj.channel.item;
        for(itemName in itemArray) {
        	var item = new ItemModel();
        	item.title = itemArray[itemName].title;
        	item.publish_Date = itemArray[itemName].publish_date;
        	item.shoppingmall_count = itemArray[itemName].shoppingmall_count;
        	item.maker = itemArray[itemName].maker;
        	item.link = itemArray[itemName].link;
        	item.shoppingmall = itemArray[itemName].shoppingmall;
        	item.review_count = itemArray[itemName].review_count;
        	item.brand = itemArray[itemName].brand;
        	item.product_type = itemArray[itemName].product_type;
        	item.price_max = itemArray[itemName].price_max;
        	item.price_group = itemArray[itemName].price_group;
        	item.price_min = itemArray[itemName].price_min;
        	item.docid = itemArray[itemName].docid;
        	item.description = itemArray[itemName].description;
        	item.category_name = itemArray[itemName].category_name;
        	item.image_url = itemArray[itemName].image_url;
        	item.save(function (err){});
        }
    }
});

app.get('/', function(req, res) {
	ItemModel.find({}, function(err, docs){
		res.render('index.jade',{title:'Daum Shopping Open API', items:docs})
	});
}); /* routes.index */
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
