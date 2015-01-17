window.addEventListener('load', prepareCanvas, false);

function prepareCanvas() {
	executeCanvas();
}

function executeCanvas() {
	var canvas = document.getElementById('physics3');

	if(!canvas || !canvas.getContext){
		return;
	}

	canvas.width = 800;
	canvas.height = 600;

	var context = canvas.getContext('2d');

	// ball

	var numBalls = 15;
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
	var tempRadian;
	//var tempXunits;
	//var tempYunits;
	var tempVelocityx;
	var tempVelocityy;

	//마찰 계수 
	var friction = 0.01;

	//add for void to overlay object


	//setting balls
	for(var i = 0; i < numBalls; i++) {
		//tempRadius = Math.floor(Math.random() * maxSize) + minSize;
		tempRadius = 5;
		var placeOK = false;

		while(!placeOK) {	
			tempX = tempRadius * 3 + (Math.floor(Math.random() * canvas.width) - tempRadius * 3);
			tempY = tempRadius * 3 + (Math.floor(Math.random() * canvas.height) - tempRadius * 3);

			tempSpeed = 4;
			//tempSpeed = maxSpeed - tempRadius;
			tempAngle = Math.floor(Math.random() * 360);
			tempRadian = tempAngle * Math.PI / 180;

			//tempXunits = Math.cos(tempRadian) * tempSpeed;
			//tempYunits = Math.sin(tempRadian) * tempSpeed;
			tempVelocityx = Math.cos(tempRadian) * tempSpeed;
			tempVelocityy = Math.sin(tempRadian) * tempSpeed;

			tempBall = {
				x : tempX,
				y : tempY,
				nextx : tempX,
				nexty : tempY,
				radius : tempRadius,
				speed : tempSpeed,
				angle : tempAngle,
				//xunits : tempXunits,
				//yunits : tempYunits
				velocityx : tempVelocityx,
				velocityy : tempVelocityy,
				mass : tempRadius
			};	
			placeOK = canStartHere(tempBall);
		}
		balls.push(tempBall);
	} 


	function drawCanvas () {

		// fill background
		context.fillStyle = '#00FF00';
		context.fillRect(0, 0, canvas.width, canvas.height);

		// draw box
		context.strokeStyle = '#000000';
		context.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);

		update();
		testWalls();
		collide();
		render();
	}


	function update(){
		for(var i = 0; i < balls.length; i++){
			//임시 변수 ball 을 선언할 필요가 없는지.
			ball = balls[i];
			ball.nextx = (ball.x += ball.velocityx);
			ball.nexty = (ball.y += ball.velocityy)
		}
	}

	//벽이랑 충돌 확인 
	function testWalls(){
		var ball;
		var testBall;

		for(var i = 0; i < balls.length; i++) {
			ball = balls[i];

			//x축
			if(ball.nextx + ball.radius > canvas.width) {
				ball.velocityx = ball.velocityx * -1;
				ball.nextx = canvas.width - ball.radius;
			} else if(ball.nextx - ball.radius < 0) {
				ball.velocityx = ball.velocityx * -1;
				//ball.nextx = canvas.width - ball.radius;
				ball.nextx = ball.radius;
			}
			//y축
			else if(ball.nexty + ball.radius > canvas.height) {
				ball.velocityy = ball.velocityy * -1;
				ball.nexty = canvas.height - ball.radius;
			}else if(ball.nexty - ball.radius < 0) {
				ball.velocityy = ball.velocityy * -1;
				ball.nexty = ball.radius;
			}
		}
	}

	//객체끼리 충돌 확인 
	function collide (){
		var ball;
		var testBall;
		for(var i = 0; i < balls.length; i++){
			ball = balls[i];
			for(var j = i + 1; j < balls.length; j++){
				testBall = balls[j];
				if(hitTestCircle(ball, testBall)){
					collideBalls(ball, testBall);
				}
			}
		}
	}

	function collideBalls(ball1, ball2){

		var dx = ball1.nextx - ball2.nextx;
		var dy = ball1.nexty - ball2.nexty;

		//collision angle //arctan
		var collisionAngle = Math.atan2(dy, dx);

		// 속도도 피타고라스 정리로?
		var speed1 = Math.sqrt(plusSqrt(ball1.velocityx, ball1.velocityy));
		var speed2 = Math.sqrt(plusSqrt(ball2.velocityx, ball2.velocityy));

		var direction1 = Math.atan2(ball1.velocityy, ball1.velocityx);
		var direction2 = Math.atan2(ball2.velocityy, ball2.velocityx);

		//??? 나갈 때의 공의 속도 
		var velocityx_1 = speed1 * Math.cos(direction1 - collisionAngle);
		var velocityy_1 = speed1 * Math.sin(direction1 - collisionAngle);
		
		var velocityx_2 = speed2 * Math.cos(direction2 - collisionAngle);
		var velocityy_2 = speed2 * Math.sin(direction2 - collisionAngle);

		//왜 x 의 속도, y 의 속도의 공식이 다른지.
		var final_velocityx_1 = ((ball1.mass - ball2.mass) * velocityx_1 +
								(ball2.mass + ball2.mass) * velocityx_2) / (ball1.mass + ball2.mass);
		var final_velocityx_2 = ((ball1.mass + ball1.mass) * velocityx_1 +
								(ball2.mass - ball1.mass) * velocityx_2) / (ball1.mass + ball2.mass);

		var final_velocityy_1 = velocityy_1;
		var final_velocityy_2 = velocityy_2;

		ball1.velocityx = Math.cos(collisionAngle) * final_velocityx_1 +
							Math.cos(collisionAngle + Math.PI / 2) * final_velocityy_1;
		ball1.velocityy = Math.sin(collisionAngle) * final_velocityx_1 +
							Math.sin(collisionAngle + Math.PI / 2) * final_velocityy_1;

		ball2.velocityx = Math.cos(collisionAngle) * final_velocityx_2 +
							Math.cos(collisionAngle + Math.PI / 2) * final_velocityy_2;
		ball2.velocityy = Math.sin(collisionAngle) * final_velocityx_2 +
							Math.sin(collisionAngle + Math.PI / 2) * final_velocityy_2;

		ball1.nextx = (ball1.nextx += ball1.velocityx);
		ball1.nexty = (ball1.nexty += ball1.velocityy);
		
		ball2.nextx = (ball2.nextx += ball2.velocityx);
		ball2.nexty = (ball2.nexty += ball2.velocityy);
	}

	//공의 nextx, nexty 를 수정하여 표시 
	function render(){
		var ball;

		for(var i = 0; i < balls.length; i++){

			if(i%3 == 0){
				context.fillStyle = '#0000FF';
			}else{
				context.fillStyle = '#000000';				
			}

			ball = balls[i];

			ball.x = ball.nextx;
			ball.y = ball.nexty;

			context.beginPath();
				context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, true);
			context.closePath();
			context.fill();
		}
	}

	// 5-8
	function canStartHere(ball) {
		var retval = true;
		for(var i = 0; i < balls.length; i++) {
			if(hitTestCircle(ball, balls[i])){
				retval = false;
			}
		}
		return retval;
	}

	function hitTestCircle(ball1, ball2){
		var retval = false;

		// 각각의 중심점에서 다른 중심점 사이의 거리를 구함 
		var dx = ball1.nextx - ball2.nextx;
		var dy = ball1.nexty - ball2.nexty;

		// x 제곱 + y 제곱
		var distance = (plusSqrt(dx, dy));

		// 왜 2 개를 곱하는지.
		if(distance <= (ball1.radius + ball2.radius) * (ball1.radius + ball2.radius)){
			retval = true;
		}
		return retval;
	}

	function plusSqrt(val1, val2){
		return val1 * val1 + val2 * val2;
	}

	setInterval(drawCanvas, 30);
}

//아크탄젠트 알아보기 