const worldWidth = 5000;
const worldHeight = 3000;

var canvas, 
	ctx;
var socket;
var local_player,
	remote_players;
var keys;
var sprites;
var camera;
var bg_map;

var dead = false;
var defaultUsername = 'rando';

// visual assets
var grass_bg = new Image ();
grass_bg.src = '/assets/images/grass_bg.png'

var fox_idle1 = new Image ();
fox_idle1.src = '/assets/images/fox_idle1.png'
var fox_run1 = new Image ();
fox_run1.src = '/assets/images/fox_run1.png'
var fox_attack1 = new Image ();
fox_attack1.src = '/assets/images/fox_attack1.png'
var fox_idle0 = new Image ();
fox_idle0.src = '/assets/images/fox_idle0.png'
var fox_run0 = new Image ();
fox_run0.src = '/assets/images/fox_run0.png'
var fox_attack0 = new Image ();
fox_attack0.src = '/assets/images/fox_attack0.png'

var rabbit_idle1 = new Image ();
rabbit_idle1.src = '/assets/images/rabbit_idle1.png'
var rabbit_run1 = new Image ();
rabbit_run1.src = '/assets/images/rabbit_run1.png'
var rabbit_attack1 = new Image ();
rabbit_attack1.src = '/assets/images/rabbit_attack1.png'
var rabbit_idle0 = new Image ();
rabbit_idle0.src = '/assets/images/rabbit_idle0.png'
var rabbit_run0 = new Image ();
rabbit_run0.src = '/assets/images/rabbit_run0.png'
var rabbit_attack0 = new Image ();
rabbit_attack0.src = '/assets/images/rabbit_attack0.png'

function init () {
	canvas = document.getElementById ('game');
	ctx = canvas.getContext ('2d');

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	keys = new Keys ();

	var startX = Math.round(Math.random()*(worldWidth-10)),
		startY = Math.round(Math.random()*(worldHeight-10));

	local_player = new Player (startX, startY, fox_idle1, 64, false);
	local_player.username = prompt ('Username:\n') || defaultUsername;
	remote_players = {};
	sprites = [];
	sprites.push (local_player);

	bg_map = new Background (worldWidth, worldHeight);
	bg_map.generate();

	camera = new Camera (50, 0, canvas.width, canvas.height, worldWidth, worldHeight);
	camera.follow (local_player, canvas.width/2, canvas.height/2);

	socket = io ();

	setEventHandlers ();
}

function setEventHandlers () {
	window.addEventListener ('keydown', onKeyDown, false);
	window.addEventListener ('keyup', onKeyUp, false);
	window.addEventListener ('resize', onResize, false);

	socket.on ('connect', onSocketConnect);
	socket.on ('disconnect', onSocketDisconnect);

	socket.on ('new player', onNewPlayer);
	socket.on ('move player', onMovePlayer);
	socket.on ('delete player', onDeletePlayer);
	socket.on ('rabbit player', onRabbitPlayer);
	socket.on ('attack player', onAttackPlayer);
	socket.on ('score player', onScorePlayer);
}

var onKeyDown = (e) => { 
	if (local_player) {
		if (e.keyCode === 69 && !local_player.attacking && e.keyCode != local_player.prevKeyCode) {
			socket.emit ('attack player');
		}

		keys.onKeyDown (e);

	} 
};
var onKeyUp = (e) => { if (local_player) keys.onKeyUp (e) };

function onResize (e) {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

var onSocketConnect = () => { console.log ('connected!'); socket.emit ('new player', {x : local_player.getX(), y : local_player.getY(), name : local_player.username}); }
var onSocketDisconnect = () => console.log ('disconnected!');
var onNewPlayer = (data) => { 
	if (data.rabbit) {
		remote_players[data.id] = new Player (data.x, data.y, fox_idle0, 64, data.rabbit);
	} else {
		remote_players[data.id] = new Player (data.x, data.y, rabbit_idle0, 64, data.rabbit);
	}

	remote_players[data.id].username = data.name;
	
	sprites.push (remote_players[data.id]);
}

var onMovePlayer = (data) => {
	remote_players[data.id].prevX = remote_players[data.id].getX();
	remote_players[data.id].prevY = remote_players[data.id].getY();
	remote_players[data.id].setPos (data.x, data.y);
	remote_players[data.id].setXscale(data.x_scale);
	remote_players[data.id].setImage (eval(remote_players[data.id].getSpriteName() + '_run'+remote_players[data.id].getXscale()));
}

var onRabbitPlayer = (data) => {
	if (data) {
		if (remote_players[data.id]) {
			remote_players[data.id].setRabbit (true);
		} else {
			local_player.setRabbit (true);
		}
	} else {
		local_player.setRabbit (true);
	}
}

var onAttackPlayer = (data) => {
	console.log ('attacking player: ' + data.id);
	remote_players[data.id].attacking = true;
	remote_players[data.id].setImage (eval(remote_players[data.id].sprite_name + '_attack' + remote_players[data.id].getXscale()));
}

var onScorePlayer = (data) => {
	remote_players[data.id].score += data.amount;
	// TODO: sort remote players by score (also include local player to display on leaderboard)
}

var onDeletePlayer = (data) => {
	sprites.splice (sprites.indexOf(remote_players[data.id]), 1);
	delete remote_players[data.id];
}

var frame = () => {update (); draw (); window.requestAnimFrame(frame); };

function update () {
	if (!dead) {
		var update_val = local_player.update(keys);
		if (update_val) socket.emit ('move player', {x : local_player.getX(), y : local_player.getY(), x_scale : local_player.getXscale()});
	}

	if (local_player) camera.update();

	for (var id in remote_players) {		
		if (remote_players[id]) {
			if (!remote_players[id].attacking && remote_players[id].prevX === remote_players[id].getX() && remote_players[id].prevY === remote_players[id].getY()) {
				remote_players[id].setImage (eval(remote_players[id].getSpriteName() + '_idle'+remote_players[id].getXscale()));
			}

			remote_players[id].prevX = remote_players[id].getX();
			remote_players[id].prevY = remote_players[id].getY();

			if (!dead) {
				if (local_player.getBoundingBox().overlapArea(remote_players[id].getBoundingBox()) > 2000 && remote_players[id].attacking) {
					if (remote_players[id].attacking) {
						console.log ('I\'m being attacked');
						document.getElementById('deathmenu').style.display = 'block';
						socket.emit ('delete player');
						dead = true;
					} else if (local_player.attacking) {
						if (remote_players[id].sprite_name === 'rabbit') {
							local_player.score += 50;
							socket.emit ('score player', {amount : 50});
						} else {
							local_player.score += 10;
							socket.emit ('score player', {amount : 10});
						}
					}
				}
			}
		}
	}
	
	sprites.sort ((a, b) => b.getDepth()-a.getDepth());
}

function gameRestart() {
	dead = false;
	document.getElementById('deathmenu').style.display = 'none';
	var startX = Math.round(Math.random()*(worldWidth-10)),
		startY = Math.round(Math.random()*(worldHeight-10));

	local_player = new Player (startX, startY, fox_idle1, 64, false);
	local_player.username = prompt ('Username:\n') || defaultUsername;
	remote_players = {};
	sprites = [];
	sprites.push (local_player);

	camera = new Camera (50, 0, canvas.width, canvas.height, worldWidth, worldHeight);
	camera.follow (local_player, canvas.width/2, canvas.height/2);

	socket.emit ('new player', {x : local_player.getX(), y : local_player.getY()});
}

function draw () {
	// clear (if necessary)
	ctx.clearRect (0, 0, canvas.width, canvas.height);

	// Draw tile background
	// ctx.fillStyle = ctx.createPattern (grass_bg, 'repeat');
	// ctx.fillRect (0, 0, worldWidth, worldHeight);
	bg_map.draw (ctx, camera.xView, camera.yView);

	for (var i = 0; i < sprites.length; i ++) {
		if (sprites[i]) {
			sprites[i].draw (ctx, camera.xView, camera.yView);
		}
	}
}