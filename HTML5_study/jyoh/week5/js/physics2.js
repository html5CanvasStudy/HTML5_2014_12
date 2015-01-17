window.addEventListener('load', prepareCanvas, false);

function prepareCanvas() {
	executeCanvas();
}

function executeCanvas() {
	var canvas = document.getElementById('physics2');

	if(!canvas || !canvas.getContext){
		return;
	}

	canvas.width = 800;
	canvas.height = 600;

	var context = canvas.getContext('2d');

	// ball

	var numBalls = 100;
	var maxSize = 8;
	var minSize = 5;
	var maxSpeed = maxSize + 5;
	var balls = new Array();

	var tempBall;
	var tempX;
	var tempY;
	var tempSpeed;
	var tempAngle;
	var tempRadius;
	var tempRadian;
	var tempXunits;
	var tempYunits;

	//setting balls
	for(var i = 0; i < numBalls; i++) {
		tempRadius = Math.floor(Math.random() * maxSize) + minSize;
		
		tempX = tempRadius * 2 + (Math.floor(Math.random() * canvas.width) - tempRadius * 2);
		tempY = tempRadius * 2 + (Math.floor(Math.random() * canvas.height) - tempRadius * 2);

		tempSpeed = maxSpeed - tempRadius;
		tempAngle = Math.floor(Math.random() * 360);
		tempRadian = tempAngle * Math.PI / 180;

		tempXunits = Math.cos(tempRadian) * tempSpeed;
		tempYunits = Math.sin(tempRadian) * tempSpeed;

		tempBall = {
			x : tempX,
			y : tempY,
			radius : tempRadius,
			speed : tempSpeed,
			angle : tempAngle,
			xunits : tempXunits,
			yunits : tempYunits
		};
		balls.push(tempBall);
	} 


	function drawCanvas () {

		// fill background
		context.fillStyle = '#00FF00';
		context.fillRect(0, 0, canvas.width, canvas.height);

		// draw box
		context.strokeStyle = '#000000';
		context.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);

		// balls
		context.fillStyle = '#000000';
		var ball;

		for (var i = 0; i < balls.length; i++){
			ball = balls[i];
			//??
			ball.x += ball.xunits;
			ball.y += ball.yunits;

			context.beginPath();
				context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, true);
			context.closePath();
			context.fill();

			if(ball.x > canvas.width || ball.x < 0) {
				ball.angle = 180 - ball.angle;
				updateBall(ball);
			} else if (ball.y > canvas.height || ball.y < 0) {
				ball.angle = 360 - ball.angle;
				updateBall(ball);
			}
		}
	}


	function updateBall(ball) {
		ball.radian = ball.angle * Math.PI / 180;
		ball.xunits = Math.cos(ball.radian) * ball.speed;
		ball.yunits = Math.sin(ball.radian) * ball.speed;
	}

	setInterval(drawCanvas, 30);
}