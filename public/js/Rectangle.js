function Rectangle(left, top, width, height){
	this.left = left || 0;
	this.top = top || 0;
    this.width = width || 0;
	this.height = height || 0;
	this.right = this.left + this.width;
	this.bottom = this.top + this.height;
}

Rectangle.prototype.set = function(left, top, /*optional*/width, /*optional*/height){
	this.left = left;
    this.top = top;
    this.width = width || this.width;
    this.height = height || this.height
    this.right = (this.left + this.width);
    this.bottom = (this.top + this.height);
}

Rectangle.prototype.within = function(r) {
	return (r.left <= this.left && 
			r.right >= this.right &&
			r.top <= this.top && 
			r.bottom >= this.bottom);
}		

Rectangle.prototype.overlaps = function(r) {
	return (this.left < r.right && 
			r.left < this.right && 
			this.top < r.bottom &&
			r.top < this.bottom);
}

Rectangle.prototype.overlapArea = function(r) {
	if (this.overlaps(r)) {
		var x_overlap = Math.max(0, Math.min(this.right, r.right) - Math.max(this.left, r.left));
		var y_overlap = Math.max(0, Math.min(this.bottom, r.bottom) - Math.max(this.top, r.top));
		return x_overlap * y_overlap;
	}

	return 0;
};