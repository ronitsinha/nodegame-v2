/* var Sprite = (startx, starty, img, frameWidth) => {
	var x = startx,
		y = starty,
		img = img,
		width = frameWidth;

	var depth = -y;
	var ctx_x,
		ctx_y;

	var index = 0;
	var tickCount = 12;
	var tick = 0;

	var boundingBox = new Rectangle (x-frameWidth/2, y-frameWidth/2, frameWidth, frameWidth);

	var setImage = (nimg) => img = nimg;
	var setPos = (nx, ny) => {x=nx; y=ny; depth=-y}
	var getBoundingBox = () => boundingBox;
	var getDepth = () => depth;


	var draw = (ctx, xView, yView) => {
		tick ++;
		if (tick >= tickCount) {
			tick = 0;
			index ++;
		}
		
		ctx_x = (x-width/2) - xView;
		ctx_y = (y-width/2) - yView;

		ctx.rect (ctx_x, ctx_y, width, width);
		boundingBox.set (ctx_x, ctx_y);

		var i = index;

		if (img.naturalWidth > width) {
			if (index*width >= img.naturalWidth) {
				index = 0;
			}
			ctx.drawImage (img, index*width, 0, width, width,  ctx_x, ctx_y, width, width);
		} else {
			ctx.drawImage (img, ctx_x, ctx_y);
		}

		return index;
	}

	return {
		setImage : setImage,
		setPos : setPos,
		getDepth : getDepth,
		getBoundingBox : getBoundingBox,
		draw : draw
	}
} */

function Sprite (startx, starty, img, frameWidth) {
	this.x = startx;
	this.y = starty;
	this.img = img;
	this.width = frameWidth;

	this.depth = -starty;
	this.ctx_x,
	this.ctx_y;

	this.index = 0;
	this.tickCount = 12;
	this.tick = 0;

	this.boundingBox = new Rectangle (this.x-frameWidth/2, this.y-frameWidth/2, frameWidth, frameWidth);

}

Sprite.prototype.setImage = function(nimg) {
	this.img = nimg;
}

Sprite.prototype.setPos = function(nx, ny) {
	this.x = nx; 
	this.y = ny; 
	this.depth = -ny;
}

Sprite.prototype.getBoundingBox = function() { 
	return this.boundingBox;
}

Sprite.prototype.getDepth = function() {
	return this.depth;
}

Sprite.prototype.draw = function (ctx, xView, yView) {
	this.tick ++;
	if (this.tick >= this.tickCount) {
		this.tick = 0;
		this.index ++;
	}
	
	this.ctx_x = (this.x-this.width/2) - xView;
	this.ctx_y = (this.y-this.width/2) - yView;

	this.boundingBox.set (this.ctx_x, this.ctx_y);

	if (this.img.naturalWidth > this.width) {
		if (this.index*this.width >= this.img.naturalWidth) {
			this.index = 0;
		}
		
		ctx.drawImage (this.img, this.index*this.width, 0, this.width, this.width,  this.ctx_x, this.ctx_y, this.width, this.width);
	} else {
		ctx.drawImage (this.img, this.ctx_x, this.ctx_y);
	}
}