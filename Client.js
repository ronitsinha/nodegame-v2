var Client = function (startX, startY) {
	var x = startX,
		y = startY;

	var rabbit = false;
	var name;

	var getX = () => x;
	var getY = () => y;
	var getRabbit = () => rabbit;
	var setRabbit = (nrab) => rabbit=nrab;
	var setPos = (nx, ny) => { x=nx; y=ny };
	var getName = ()=> name;
	var setName = (nname) => name = nname;

	return {
		getX : getX,
		getY : getY,
		getRabbit : getRabbit,
		getName : getName,
		setRabbit : setRabbit,
		setPos : setPos,
		setName : setName
	}
}

exports.Client = Client;