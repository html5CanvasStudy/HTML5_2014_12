function Ball = function(){
	this.x = 0;
	this.y = 0;
	this.radius = 0;
	this.velocityX = 0;
	this.velocityY = 0;
	this.mass = 0;
	this.color = '#000000';
}

Ball.prototype.initialize = function(x, y, radius, veloX, veloY, mass){
	this.x = x;
	this.y = y;
	this.radius = radius;
	this.velocityX = veloX;
	this.velocityY = veloY;
	this.mass = mass;
}

Ball.prototype.setColor = function(color){
	if(color == 'random'){
		this.color = '#' + getRandColor();
	}else{
		this.color = '#' + color;
	}
}

Ball.prototype.update = function(ctx){

}

Ball.prototype.render = function(ctx){


}

function getRand(max, min){
	return Math.floor(Math.random() * (max - min)) + min;
}

function getRandColor(){
	var r = getRand(256, 0);
	var g = getRand(256, 0);
	var b = getRand(256, 0);
	return r.toString(16) + g.toString(16) + b.toString(16);
}
