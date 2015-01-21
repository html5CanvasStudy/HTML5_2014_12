window.addEventListener('load', executeCanvas, false);

function executeCanvas(){
	
	var canvas = document.getElementById('circulation');

	if(!canvas || !canvas.getContext){
		Debugger.log('can not find the canvas');
		return;
	}

	canvas.width = 800;
	canvas.height = 600;

	var context = canvas.getContext('2d');

	function drawScreen(){
		//fill background
		context.fillStyle = '#FFFFFF';
		context.fillRect(0, 0, canvas.width, canvas.height);

		//draw box
		context.strokeStyle = '#000000';
		context.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);

		//drawBall();
		drawSpiralBall();
	}

	//define a ball
	var ball = {x : 0, y : 0, speed : .01};

	var circle = {centerX : canvas.width / 2, centerY : canvas.height / 2, angle : 0, radius : 125};
	var trace = new Array();


	function drawBall(){
		var tempBall = {};
		ball.x = circle.centerX + Math.cos(circle.angle) * circle.radius;
		ball.y = circle.centerY + Math.sin(circle.angle) * circle.radius;

		circle.angle += ball.speed;


		for(var i = 0; i < trace.length; i++) {
			context.fillStyle = '#000000';
			context.beginPath();
				context.arc(trace[i].x, trace[i].y, 1, 0, Math.PI * 2, true);
			context.closePath();
			context.fill();
		}

		context.fillStyle = '#55FF44';		

		context.beginPath();
			context.arc(ball.x, ball.y, 15, 0, Math.PI * 2, true);
		context.closePath();

		tempBall.x = ball.x;
		tempBall.y = ball.y;
		trace.push(tempBall);
		context.fill();
	}

	var radiusInc = 1;

	function drawSpiralBall() {
		circle.radius += radiusInc;
		drawBall();
	}


	setInterval(drawScreen, 30);
}