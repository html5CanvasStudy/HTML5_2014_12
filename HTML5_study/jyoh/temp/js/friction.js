window.addEventListener('load', prepareCanvas, false);

function prepareCanvas(){
	executeCanvas();
}

function executeCanvas(){
	var canvas = document.getElementById('friction');

	//canvas element validation
	if(!canvas || !canvas.getContext){
		Debugger.log('can not find canvas element');
		return;
	}

	canvas.width = 800;
	canvas.height = 600;

	var context = canvas.getContext('2d');

	//variables
	var numBalls = 50;
	var maxSize = 12;
	var minSize = 3;
	var maxSpeed = maxSize + 5;
	var balls = new Array();

	var tempBall;
	var tempX;
	var tempY;
	var tempSpeed;
	var tempAngle;
	var tempRadius;
	var tempRadians;
	var tempVelocityX;
	var tempVelocityY;

	//ready 

	for(var i = 0; i < numBalls; i++){
		tempRadius = Math.floor(Math.random() * maxSize) + minSize;
		var placeOK = false;

		while(!placeOK){
			tempX = tempRadius * 3 + (Math.floor(Math.random() * canvas.width) - tempRadius * 3);
			tempY = tempRadius * 3 + (Math.floor(Math.random() * canvas.height) - tempRadius * 3);
			tempSpeed = maxSpeed - tempRadius;

			//Angle
			tempAngle = Math.floor(Math.random() * 360);
			tempRadians = tempAngle * Math.PI / 180;

			tempVelocityX = Math.cos(tempRadius) * tempSpeed;
			tempVelocityY = Math.sin(tempRadius) * tempSpeed;

			tempBall = {
				x 			: tempX,
				y 			: tempY,
				radius 		: tempRadius,
				speed 		: tempSpeed,
				angle 		: tempAngle,
				velocityX 	: tempVelocityX,
				velocityY 	: tempVelocityY,
				mass 		: tempRadius * 8,
				nextX 		: tempX,
				nextY 		: tempY
			}

			placeOK = canStartHere(tempBall);
		}
		Debugger.log('ball [' + i + '] >> ' + tempBall);
		balls.push(tempBall);
	}

	function canStartHere(ball){
		var retval = true;

		for(var i = 0; i < balls.length; i ++) {
			if(hitTest(ball, balls[i])){
				retval = false;
			}
		}
		return retval;
	}

	function hitTest(b1, b2){
		Debugger.log(b1 + '  vs  ' + b2);
		var retval = false;

		var dx = b1.nextX - b2.nextX;
		var dy = b1.nextY - b2.nextY;

		var distance = Math.sqrt(sqrtSum(dx, dy));

		if(distance <= (b1.radius + b2.radius)){
			retval = true;
		}
		return retval;
	}

	function sqrtSum(x, y){
		return x * x + y * y;
	}

	//--- DrawScreen

	function drawScreen(){
		//fill background
		context.fillStyle = '#FFFFFF';
		context.fillRect(0, 0, canvas.width, canvas.height);

		//draw a box
		context.strokeStyle = '#000000';
		context.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);

		//update();
		//testWalls();
		//collide();
		render();
	}

	//--- Render

	function render() {
		var ball;

		context.fillStyle = '#FF4455';

		for(var i = 0; i < balls.length; i++){
			ball = balls[i];
			ball.x = ball.nextX;
			ball.y = ball.nextY;

			context.beginPath();
				context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, true);
			context.closePath();

			//do not forget to call fill()
			context.fill();
		}
	}

	setInterval(drawScreen, 30);
}