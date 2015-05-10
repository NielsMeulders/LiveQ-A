var express = require('express'),
	app = express(),
	http = require('http').Server(app),
	mongoose = require('mongoose'),
	swig = require('swig'),
	bodyParser = require('body-parser'),
	path = require('path'),
	restful = require('node-restful'),
	io = require('socket.io')(http);

mongoose.connect('mongodb://localhost/imd');

app.engine('html', swig.renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req,res) {
res.render('index');
});

app.get("/detail.html", function(req, res) {
    res.render('detail');
});

var Product = app.product = restful.model('Product', mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	amount: {
		type: Number,
		required: true,
		default: 0
	}
}, {collection: 'product'})).methods(['get', 'post', 'put', 'delete']);
Product.register(app, '/product');

var Message = app.message = restful.model('Message', mongoose.Schema({
	message: {
		type: String,
		required: true
	},
    author: {
        name: String,
        required: false
    }
}, {collection: 'message'})).methods(['get', 'post', 'put', 'delete']);
Message.register(app, '/message');

io.on('connection', function(socket) {
	console.log('user connected');
	socket.on('disconnect', function() {
		console.log('user disconnected');
	});
	socket.on('message', function(a) {
		Message.create({message: a}, function(err, b) {
			console.log('b', b);
			io.emit('update', b);
		});
	});
});
io.on('connect', function(socket) {
	Message.find()
		.exec(function(err, messages) {
			socket.emit('startMessages', messages);
		});
});


var server = http.listen(3003, function(){
	console.log('Server running on http://localhost:3003');
});

module.exports = app;