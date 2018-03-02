function Background(width, height) {
	this.width = width;
	this.height = height;

	this.image = null;

}

Background.prototype.generate = function() {
	var ctx = document.createElement("canvas").getContext("2d");		
	ctx.canvas.width = this.width;
	ctx.canvas.height = this.height;	
	var grass_bg = new Image ();
	grass_bg.src = '/assets/images/grass_bg.png';

	var rows = ~~(this.width/64) + 1;
	var columns = ~~(this.height/64) + 1;

	ctx.save ();

	for (var y = 0; y < columns; y++) {
		for (var x = 0; x < rows; x++) {
			ctx.drawImage (grass_bg, x*64, y*64);
		}		
	}	

	ctx.restore();

	this.image = new Image ();
	this.image.src = ctx.canvas.toDataURL ('image/png');

	ctx = null;
}

Background.prototype.draw = function(context, xView, yView){					
	// easiest way: draw the entire map changing only the destination coordinate in canvas
	// canvas will cull the image by itself (no performance gaps -> in hardware accelerated environments, at least)
	//context.drawImage(this.image, 0, 0, this.image.width, this.image.height, -xView, -yView, this.image.width, this.image.height);
	
	
	var sx, sy, dx, dy;
    var sWidth, sHeight, dWidth, dHeight;
	
	sx = xView;
	sy = yView;
	
	// dimensions of cropped image			
	sWidth =  context.canvas.width;
	sHeight = context.canvas.height;

	// if cropped image is smaller than canvas we need to change the source dimensions
	if(this.image.width - sx < sWidth){
		sWidth = this.image.width - sx;
	}
	if(this.image.height - sy < sHeight){
		sHeight = this.image.height - sy; 
	}
	
	// location on canvas to draw the croped image
	dx = 0;
	dy = 0;
	// match destination with source to not scale the image
	dWidth = sWidth;
	dHeight = sHeight;									
	
	// TODO: Fix bug where bg doesn't draw on first load
	context.drawImage(this.image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);			
}