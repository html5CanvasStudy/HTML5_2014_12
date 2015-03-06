function Video (){
	var x;
	var y;
	var width;
	var height;
	var speed;
	var angle;
	var radians;
	var xUnits;
	var yUnits;
}

Video.prototype.initialize = function(x, y, width, height, speed, angle, radians, xUnits, yUnits){
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.speed = speed;
	this.angle = angle;
	this.radians = radians;
	this.xUnits = xUnits;
	this.yUnits = yUnits;
}

Video.prototype.updateVideo = function(){
	// angle 변수를 anim_video.js 의 drawScreen() 에서 변경한다.
	this.radians = this.angle * Math.PI / 180;
	this.xUnits = Math.cos(this.radians) * this.speed;
	this.yUnits = Math.sin(this.radians) * this.speed;
}