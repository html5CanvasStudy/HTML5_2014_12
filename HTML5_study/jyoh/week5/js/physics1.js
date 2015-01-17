window.addEventListener('load', prepareCanvas, false);

function prepareCanvas(){
	executeCanvas();
}

function executeCanvas(){

	//about ball
	var speed = 5;
	//which point is it!?
	var p1 = {x: 20, y: 20};

	var angle = 35;
	var radian = 0;
	var xunits = 0;
	var yunits = 0;

	var ball = {x: p1.x, y : p1.y};


	var canvas = document.getElementById('physics');

	if(!canvas || !canvas.getContext){
		Debugger.log('This browser does not support Canvas element.');
		return;
	}

	canvas.width = 800;
	canvas.height = 600;

	var context = canvas.getContext('2d');

	function drawCanvas(){

		//fill background
		context.fillStyle = '#00FF00';
		context.fillRect(0, 0, canvas.width, canvas.height);

		//draw box
		context.strokeStyle = '#000000';
		context.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);

		//ball
		ball.x += xunits;
		ball.y += yunits;
		context.fillStyle = '#000000';
		context.beginPath();
			context.arc(ball.x, ball.y, 10, 0, Math.PI * 2, true);
		context.closePath();
		context.fill();

		//bounce
		if(ball.x > canvas.width || ball.x < 0) {
			//angle = 145
			angle = 180 - angle;
			updateBall();
		} else if(ball.y > canvas.height || ball.y < 0) {
			//angle = 325
			angle = 360 - angle;
			updateBall();
		}
	}

	function start(){
		//setInterval(drawCanvas, 100);
		setInterval(drawCanvas, 30);
	}

	function updateBall(){
		radian = angle * Math.PI / 180;
		//cos, sin 알아보기 
		xunits = Math.cos(radian) * speed;
		yunits = Math.sin(radian) * speed;
	}
	updateBall();
	start();
}

// 뒤에다 점선 그려보기
// FIFO 방식으로 구현하기 
// 공 반지름 계산해서 튕겨보기 
// cos, sin  알아보기
// 왜 반사각이 35 인지 조사 
