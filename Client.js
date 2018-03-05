// var Client = function (startX, startY) {
// 	var x = startX,
// 		y = startY;

// 	var rabbit = false;
// 	var name;

// 	var getX = () => x;
// 	var getY = () => y;
// 	var getRabbit = () => rabbit;
// 	var setRabbit = (nrab) => rabbit=nrab;
// 	var setPos = (nx, ny) => { x=nx; y=ny };
// 	var getName = ()=> name;
// 	var setName = (nname) => name = nname;

// 	return {
// 		getX : getX,
// 		getY : getY,
// 		getRabbit : getRabbit,
// 		getName : getName,
// 		setRabbit : setRabbit,
// 		setPos : setPos,
// 		setName : setName
// 	}
// }

// exports.Client = Client;

function Client (startX, startY) {
	this.x = startX;
	this.y = startY;
	this.score = 0;

	this.rabbit;
	this.name;
}

Client.prototype.getX = function() {
	return this.x;
};

Client.prototype.getY = function() {
	return this.y;
};

Client.prototype.getRabbit = function() {
	return this.rabbit;
};

Client.prototype.getName = function() {
	return this.name;
};

Client.prototype.setPos = function(nx, ny) {
	this.x = nx;
	this.y = ny;
};

Client.prototype.setRabbit = function(nr) {
	this.rabbit = nr;
};

Client.prototype.setName = function (nname) {
	this.name = nname;
}

exports.Client = Client;