function paddle() {
	this.x = 0;
	this.y = 0;
	this.width = 0;
	this.weight = 1;
	this.color = '#000000';
}

paddle.prototype.initialize = function(startX, startY, width, weight, color){
	this.x = startX;
	this.y = startY;
	this.width = width;
	this.weight = weight;
	this.color = color;
}






	//drawCanvas();

	/* 시작 버튼

	context.strokeStyle = '#96F56E';
	context.fillStyle = '#96F56E';
	//context.fillRect(canvas.width/2, canvas.height/2, 120, 30);
	
	context.beginPath();
		context.moveTo(canvas.width/2, canvas.height/2 - 20);
		context.lineTo(canvas.width/2 + 60, canvas.height/2 - 20);
		context.quadraticCurveTo(canvas.width/2 + 70, canvas.height/2 - 20, canvas.width/2 + 70, canvas.height/2 - 10);
		context.lineTo(canvas.width/2 + 70, canvas.height/2 + 10);
		context.quadraticCurveTo(canvas.width/2 + 70 , canvas.height/2 + 20, canvas.width/2 + 60, canvas.height/2 + 20);
		context.lineTo(canvas.width/2 - 110, canvas.height/2 - 20 + 40);
		context.quadraticCurveTo(canvas.width/2 - 120, canvas.height/2 + 20, canvas.width/2 - 120, canvas.height/2 + 10);
		context.lineTo(canvas.width/2 - 120, canvas.height/2 - 20 + 40 - 10 - 20);
		context.quadraticCurveTo(canvas.width/2 - 120, canvas.height/2 - 20, canvas.width/2 - 110, canvas.height/2 - 20);
		context.lineTo(canvas.width/2, canvas.height/2 - 20);
		context.fill();
		//context.stroke();
	context.closePath();	
	*/