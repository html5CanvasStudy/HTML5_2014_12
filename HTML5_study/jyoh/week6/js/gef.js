window.addEventListener('load', executeCanvas, false);

function executeCanvas(){
	var canvas = document.getElementById('gef');

	if(!canvas || !canvas.getContext){
		Debugger.log('Can not find canvas');
		return;
	}

	canvas.width = 800;
	canvas.height = 600;

	var context = canvas.getContext('2d');

	//Elements

	var speed = 6;
	var gravity = .1;
	var friction = 0.008;
	var elasticity = .5;
	var angle = 285;
	var radians = angle * Math.PI/180;
	var radius = 15;

	var vx = Math.cos(radians) * speed;
	var vy = Math.sin(radians) * speed;

	var p1 = {x : 20, y : canvas.height - radius};
	var ball = {x : p1.x, y : p1.y, velocityX : vx, velocityY : vy, radius : radius, elasticity : elasticity};


	function drawCanvas(){
		context.fillStyle = '#EEEEEE';
		context.fillRect(0, 0, canvas.width, canvas.height);

		context.strokeStyle = '#000000';
		context.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);

		//세로로는 중력, 가로로는 마찰력이 작용함 
		ball.velocityX = ball.velocityX - (ball.velocityX * friction);
		ball.velocityY += gravity;

		if(ball.y + ball.radius > canvas.height) {
			ball.velocityY = -(ball.velocityY) * ball.elasticity;
		}

		ball.y += ball.velocityY;
		ball.x += ball.velocityX;

		context.fillStyle = '#000000';
		context.beginPath();
			context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, true);
		context.closePath();
		context.fill();
	}

	setInterval(drawCanvas, 30);
}