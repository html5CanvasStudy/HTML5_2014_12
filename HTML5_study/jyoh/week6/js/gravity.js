window.addEventListener('load', executeCanvas, false);

function executeCanvas(){
	var canvas = document.getElementById('gravity');

	if(!canvas || !canvas.getContext){
		Debugger.log('Can not find Canvas');
		return;
	}

	canvas.width = 800;
	canvas.height = 600;

	var context = canvas.getContext('2d');

	//ball
	var speed = 4;

	var gravity = .1;
	//why?
	var angle = 305;
	var radians = angle * Math.PI/180;
	var radius = 15;

	//??
	var vx = Math.cos(radians) * speed;
	var vy = Math.sin(radians) * speed;


	//왜 y 축의 기본 값인데 canvas.height 에서 연산을 안하고 canvas.width 에서 반지름을 빼나.
	var p1 = {x : 20, y : canvas.height - radius};
	var ball = {x : p1.x, y : p1.y, velocityX : vx, velocityY : vy, radius : radius};

	function drawCanvas(){
		//fill background
		context.fillStyle = '#EEEEEE';
		context.fillRect(0, 0, canvas.width, canvas.height);

		//draw box
		context.strokeStyle = '#000000';
		context.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);


		//공
		//1. 만약 공이 튕긴 높이가 캔버스의 높이보다 작으면 y 축 가속에 중력을 더한다.
		//round 가 돌수록 높이는 낮아지고 속도는 빨라짐 
		if(ball.y + ball.radius <= canvas.height){
			ball.velocityY += gravity;
		}else{
			ball.velocityX = 0;
			ball.velocityY = 0;
			ball.y = canvas.height - ball.radius;
		}

		ball.y += ball.velocityY;
		ball.x += ball.velocityX;

		Debugger.log(ball.x + ', ' +  ball.y);

		context.fillStyle = '#000000';
		context.beginPath();
			context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, true);
		context.closePath();
		context.fill();
	}

	setInterval(drawCanvas, 30);
}

//뭔가 공 튀는 꼬라지가 이상함.