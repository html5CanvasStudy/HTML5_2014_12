
var Ball = function(){
	this.x = 0;
	this.y = 0;
	this.radius = 0;
	this.velocityX = 0;
	this.velocityY = 0;
	this.mass = 0;
	this.maxSpeed = 20;
	this.minSpeed = .1;
	this.speedUp = false;
	this.increaseInterval = .1;
	this.color = '#000000';
}

Ball.prototype.initialize = function(x, y, radius, veloX, veloY, mass){
	this.x = x;
	this.y = y;
	this.radius = radius;
	this.velocityX = veloX;
	//바닥에서 시작하므로 반드시 최초에는 위로만 가야한다.
	if(veloY > 0) veloY *= -1;
	this.velocityY = veloY;
	this.mass = mass;
}

//공의 위치 업데이트 

Ball.prototype.update = function(){
	if(this.speedUp == true && this.velocityX < this.maxSpeed) this.velocityX += this.increaseInterval;
	if(this.speedUp == true && this.velocityY < this.maxSpeed) this.velocityY += (this.increaseInterval * -1);
	this.x += this.velocityX;
	this.y += this.velocityY;
}

Ball.prototype.render = function(ctx){

	ctx.fillStyle = this.color;
	
	ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true);
	ctx.closePath();
	
	ctx.fill();
}

//=== 난수 생성과 색상.

function getRand(max, min){
	return Math.floor(Math.random() * (max - min)) + min;
}

Ball.prototype.setColor = function(color){
	if(color == 'random'){
		this.color = '#' + getRandColor();
	}else{
		this.color = '#' + color;
	}
}

function getRandColor(){
	var r = getRand(256, 0);
	var g = getRand(256, 0);
	var b = getRand(256, 0);
	return r.toString(16) + g.toString(16) + b.toString(16);
}

//=== 공 부가 정보 변경

Ball.prototype.setSpeedLimit = function(min, max){
	this.minSpeed = min;
	this.maxSpeed = max;
}

Ball.prototype.increaseSpeed = function(interval){
	this.speedUp = true;
	this.increaseInterval = interval;
}

//최종적으로 실행을 위해 호출하게 될 부분
/*
Ball.prototype.run = function(ctx){
		this.update();
		this.collideWall(ctx);
		this.render(ctx);
}
*/