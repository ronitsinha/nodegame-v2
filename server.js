var util = require('util');
var express = require ('express'),
	app = express();
var http = require ('http').Server(app);
var io = require ('socket.io')(http);
var Client = require ('./Client.js').Client;
var clients = {};

var port = process.env.PORT || 8000;

var isThereRabbit = false;

http.listen (port, () => util.log ('server started on port ' + port));

app.use (express.static (__dirname + '/public')).get ('/', (req, res) => res.sendFile (__dirname + '/public/index.html'));

io.on ('connection', function (socket) {
	util.log ('user has connected: ' + socket.id);
	socket.on ('new player', onNewPlayer);
	socket.on ('move player', onPlayerMove);
	socket.on ('disconnect', onClientDisconnect);
	socket.on ('delete player', onPlayerDelete);
	socket.on ('attack player', onPlayerAttack);
});

function onClientDisconnect (data) {
	util.log ('user has disconnected: ' + this.id);
	if (clients[this.id]) {
		if (clients[this.id].getRabbit()) {
			isThereRabbit = false;
		}
		delete clients[this.id];
		if (!isThereRabbit) {
			var rab = pickRandomProperty (clients);
			if (rab) {
				clients[rab].setRabbit (true);
				this.broadcast.emit ('rabbit player', {id : rab});
				isThereRabbit = true;
			}
		}
		this.broadcast.emit ('delete player', {id : this.id});
	}
}

function onPlayerDelete (data) {
	util.log ('user has died: ' + this.id);
	if (clients[this.id]) {
		if (clients[this.id].getRabbit()) {
			isThereRabbit = false;
		}
		delete clients[this.id];
		if (!isThereRabbit) {
			var rab = pickRandomProperty (clients);
			if (rab) {
				clients[rab].setRabbit (true);
				this.broadcast.emit ('rabbit player', {id : rab});
				isThereRabbit = true;
			}
		}
		this.broadcast.emit ('delete player', {id : this.id});
	}
}

function onNewPlayer (data) {
	var amiRabbit = false;

	if (!isThereRabbit) {
		isThereRabbit = true;
		amiRabbit = true;
		this.emit ('rabbit player');	
	}

	this.broadcast.emit ('new player', {x : data.x, y : data.y, id : this.id, rabbit : amiRabbit, name : data.name});

	for (var id in clients) {
		this.emit ('new player', {x : clients[id].getX(), y : clients[id].getY(), id : id, rabbit : clients[id].getRabbit(), name : clients[id].getName()});
	}

	clients[this.id] = new Client(data.x, data.y);
	clients[this.id].setName (data.name);
	clients[this.id].setRabbit (amiRabbit);
}

function onPlayerMove (data) {
	if (clients[this.id] != null) {
		clients[this.id].setPos (data.x, data.y);
		this.broadcast.emit ('move player', {id : this.id, x : data.x, y : data.y, x_scale : data.x_scale});
	}
}

function onPlayerAttack (data) {
	this.broadcast.emit ('attack player', {id : this.id});
}

function pickRandomProperty(obj) {
    var result;
    var count = 0;
    for (var prop in obj)
        if (Math.random() < 1/++count)
           result = prop;
    return result;
}

var size = (obj) => {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};