 /*var Player = function (startX, startY, startImg, rabbit) {
	var x = startX,
		y = startY,
		move_amount = 5,
		img = startImg;

	var sprite_name;
	 (rabbit) ? sprite_name = 'rabbit' : sprite_name = 'fox';

	var index = 0;
	var tickCount = 12;
	var tick = 0;
	
	var sprite = Sprite (x, y, img, 64);


	// X_SCALE:
	// 0 - facing left
	// 1 - facing right
	var x_scale = 1;
	
	var prevX = startX,
		prevY = startY;

	var fox_idle1 = new Image ();
	fox_idle1.src = '/assets/images/fox_idle1.png'
	var fox_run1 = new Image ();
	fox_run1.src = '/assets/images/fox_run1.png'
	var fox_idle0 = new Image ();
	fox_idle0.src = '/assets/images/fox_idle0.png'
	var fox_run0 = new Image ();
	fox_run0.src = '/assets/images/fox_run0.png'

	var rabbit_idle1 = new Image ();
	rabbit_idle1.src = '/assets/images/fox_idle1.png'
	var rabbit_run1 = new Image ();
	rabbit_run1.src = '/assets/images/fox_run1.png'
	var rabbit_idle0 = new Image ();
	rabbit_idle0.src = '/assets/images/fox_idle0.png'
	var rabbit_run0 = new Image ();
	rabbit_run0.src = '/assets/images/fox_run0.png'

	var getX = () => x;
	var getY = () => y;
	var getXscale = () => x_scale;
	var setXscale = (nx_s) => { x_scale = nx_s; setImage(eval(sprite_name + '_run' + x_scale))}
	var setPos = (nx, ny) => { x=nx; y=ny; sprite.setPos (nx, ny)};
	var setImage = (nimg) => sprite.setImage (nimg);
	var getSprite = () => sprite;
	var getSpriteName = () => sprite_name;
	var setRabbit = (nr) => {
		rabbit = nr;
		(rabbit) ? sprite_name = 'rabbit' : sprite_name = 'fox';
	}

	function update (keys) {
		if (!(keys.up||keys.down||keys.left||keys.right)) {
			setImage (eval(sprite_name + '_idle' + x_scale));
			return false;
		}

		var xprev = x;

		if (keys.up && y >= 0) {
			y -= move_amount;
		} else if (keys.down && y + 64 <= worldHeight) {
			y += move_amount;
		}

		if (keys.left && !keys.right && x - move_amount >= 0) {
			x -= move_amount;
		} else if (keys.right && !keys.left && x + 64 <= worldWidth) {
			x += move_amount;
		}

		(xprev > x) ? setXscale (0) : setXscale(1);
		// sprite.setImage (eval('fox_run' + x_scale));
		sprite.setPos (x, y);
		return true;
	}

	return {
		getX : getX,
		getY : getY,
		getSpriteName : getSpriteName, 
		setRabbit : setRabbit,
		prevX : prevX,
		prevY : prevY,
		getSprite : getSprite,
		getXscale : getXscale,
		setXscale : setXscale,
		setImage : setImage,
		setPos : setPos,
		update : update,
	}
} */

function Player (startX, startY, startImg, frameWidth, rabbit) {
	Sprite.call (this, startX, startY, startImg, frameWidth);

	this.move_amount = 5;
	// Attack on E key
	this.attackKey = 69;
	this.attacking = false;
	this.prevKeyCode;
	this.username;
	this.score = 0;

	// X_SCALE:
	// 0 - facing left
	// 1 - facing right
	this.x_scale = 1;

	this.sprite_name;
	(rabbit) ? this.sprite_name = 'rabbit' : this.sprite_name = 'fox';

	
	this.prevX = startX,
	this.prevY = startY;
}

Player.prototype = Object.create (Sprite.prototype, {
	getX : { 
		value : function() {
			return this.x;
		}
	},

	getY : { 
		value : function() {
			return this.y;
		}
	},

	draw : {
		value : function(ctx, xView, yView) {
			Sprite.prototype.draw.apply (this, arguments);
			// ADD specific attacking code
			if (this.img === eval(this.sprite_name + '_attack' + this.x_scale) && (this.index+1)*this.width >= this.img.naturalWidth && this.attacking) {
				this.attacking = false;
				this.setImage(eval(this.sprite_name+'_idle'+this.x_scale));
			}

			ctx.fillStyle = 'black';
			ctx.font = '20px Arial';
			ctx.textAlign = "center";
			ctx.fillText (this.username, this.ctx_x+this.width/2, this.ctx_y);
		}
	},

	getSpriteName : {
		value : function() {
			return this.sprite_name;
		}
	},

	setRabbit : {
		value : function(nr) {
			(nr) ?  this.sprite_name = 'rabbit' : this.sprite_name = 'fox';
		}
	},

	getXscale : { 
		value : function() {
			return this.x_scale;
		}
	},

	setXscale : { 
		value : function(nx_s) { 
			this.x_scale = nx_s; this.setImage(eval(this.sprite_name + '_run' + this.x_scale))
		}
	},

	update : {
		value : function(keys) {
			if (keys.getKeyCodeDown() === this.attackKey && !this.attacking && this.prevKeyCode != this.attackKey) {

				this.attacking = true;
				this.setImage (eval(this.sprite_name + '_attack' + this.x_scale));
				this.prevKeyCode = keys.getKeyCodeDown();
			}

			this.prevKeyCode = keys.getKeyCodeDown();

			if (this.attacking) {
				return false;
			}



			if (!(keys.up||keys.down||keys.left||keys.right)) {
				this.setImage (eval(this.sprite_name + '_idle' + this.x_scale));
				return false;
			}

			var xprev = this.x;
			this.prevKeyCode = keys.getKeyCodeDown();

			if (keys.up && this.y >= 0) {
				this.y -= this.move_amount;
			} else if (keys.down && this.y + 64 <= worldHeight) {
				this.y += this.move_amount;
			}

			if (keys.left && !keys.right && this.x - this.move_amount >= 0) {
				this.x -= this.move_amount;
			} else if (keys.right && !keys.left && this.x + 64 <= worldWidth) {
				this.x += this.move_amount;
			}

			if (xprev > this.x) { 
				this.setXscale (0) 
			} else if (xprev != this.x) {
				this.setXscale(1);
			}
			this.setImage(eval(this.sprite_name + '_run' + this.x_scale));
			this.setPos (this.x, this.y);
			return true;
		}
	}
});

Player.prototype.constructor = Player;

/*function Player (startX, startY, startImg, rabbit) {
	this.x = startX;
	this.y = startY;
	this.move_amount = 5;
	this.img = startImg;
	// Attack on E key
	this.attackKey = 69;
	this.attacking = false;

	// X_SCALE:
	// 0 - facing left
	// 1 - facing right
	this.x_scale = 1;

	this.sprite_name;
	(rabbit) ? this.sprite_name = 'rabbit' : this.sprite_name = 'fox';

	this.index = 0;
	this.tickCount = 12;
	this.tick = 0;
	
	this.sprite = Sprite (this.x, this.y, this.img, 64);


	
	this.prevX = startX,
	this.prevY = startY;
}

Player.prototype.getX = function() {return this.x;}
Player.prototype.getY = function() {return this.y;}
Player.prototype.setPos = function(nx, ny) { this.x=nx; this.y=ny; this.sprite.setPos (nx, ny)};

Player.prototype.getXscale = function() {return this.x_scale;}
Player.prototype.setXscale = function(nx_s) { this.x_scale = nx_s; this.setImage(eval(this.sprite_name + '_run' + this.x_scale))}

Player.prototype.setImage = function(nimg) {this.sprite.setImage (nimg);}

Player.prototype.getSprite = function() {return this.sprite;}
Player.prototype.getSpriteName = function() {return this.sprite_name;}
Player.prototype.setRabbit = function(nr) {(nr) ?  this.sprite_name = 'rabbit' : this.sprite_name = 'fox';}


Player.prototype.update = function(keys) {
	if (keys.keyCodeDown === this.attackKey && !this.attacking) {
		this.attacking = true;
		this.setImage (eval(this.sprite_name + '_attack' + this.x_scale));
		return false;
	}

	if (!(keys.up||keys.down||keys.left||keys.right)) {
		this.setImage (eval(this.sprite_name + '_idle' + this.x_scale));
		return false;
	}

	var xprev = this.x;

	if (keys.up && this.y >= 0) {
		this.y -= this.move_amount;
	} else if (keys.down && this.y + 64 <= worldHeight) {
		this.y += this.move_amount;
	}

	if (keys.left && !keys.right && this.x - this.move_amount >= 0) {
		this.x -= this.move_amount;
	} else if (keys.right && !keys.left && this.x + 64 <= worldWidth) {
		this.x += this.move_amount;
	}

	if (xprev > this.x) { 
		this.setXscale (0) 
	} else if (xprev != this.x) {
		this.setXscale(1);
	}
	this.setImage(eval(this.sprite_name + '_run' + this.x_scale));
	this.sprite.setPos (this.x, this.y);
	return true;
}*/