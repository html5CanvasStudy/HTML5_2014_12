//싱글톤으로 구현되는 gameControl 객체
//여기서는 
//1. stage와 ball 의 충돌
//2. ball 과 bricks 의 충돌
//3. paddle 과  ball 충돌 
//4. 게임의 시작과 종료를 관장함.
// context 를 받아야 하나?

function gameControl(){
	this.ball = {};
	this.bricks = {};
	this.paddle = {};
}

gameControl.prototype.ready = function(ball, bricks, paddle){
	this.ball = ball;
	this.bricks = bricks;
	this.paddle = paddle;
}

//스테이지 구성 
gameControl.prototype.drawBricks = function(ctx){
	for(var i = 0; i < this.bricks.length; i++){
		var tmpBrick = this.bricks[i];
		if(!tmpBrick.exist) continue;

		ctx.fillStyle = tmpBrick.color;
		ctx.fillRect(tmpBrick.x, tmpBrick.y, tmpBrick.width, tmpBrick.height);
		//테두리를 그려라 // 일단은 테두리가 필수라고 가정 
		ctx.strokeStyle = this.borderColor;
		ctx.strokeRect(tmpBrick.x + 1, tmpBrick.y + 1, tmpBrick.width - 2, tmpBrick.height - 2);
	}
}

//공과 블록의 충돌. 
gameControl.prototype.checkBreak = function (){
	for(var i = 0; i < this.bricks.length; i++){
		var singleBrick = this.bricks[i];

		if(!singleBrick.exist) continue;
		var mBall = this.ball;
		if(mBall.x + mBall.radius > singleBrick.x && mBall.x - mBall.radius < singleBrick.x + singleBrick.width){
			// |-----------------------|
			if(mBall.y + mBall.radius > singleBrick.y && mBall.y - mBall.radius < singleBrick.y + singleBrick.height){
				singleBrick.exist = false;

				
				//정확하게 그대로 튕겨내는 (꼭지점)의 각도 
				var brickDistanceX = singleBrick.x - (singleBrick.x + singleBrick.width/2);
				var brickDistanceY = singleBrick.y - (singleBrick.y + singleBrick.height/2);
				brickDistanceX = (brickDistanceX < 0) ? brickDistanceX * -1 : brickDistanceX;
				brickDistanceY = (brickDistanceY < 0) ? brickDistanceY * -1 : brickDistanceY;
				var brickClearRadian = Math.atan2(brickDistanceX, brickDistanceY);
				var brickClearDegree = (brickClearRadian * 180) / Math.PI;

				var xDistance = singleBrick.x + (singleBrick.width/2) - mBall.x;
				var yDistance = singleBrick.y + (singleBrick.height/2) - mBall.y;
				//이게 음수라면 좌에서 우로, 아래서 위로 이동 중 
				//방향 측정을 위한 거리 정수화 
				xDistance = (xDistance < 0) ? xDistance * -1 : xDistance;
				yDistance = (yDistance < 0) ? yDistance * -1 : yDistance;
				var curClearRadian = Math.atan2(xDistance, yDistance);
				var curClearDegree = (curClearRadian * 180) / Math.PI;
				
				/* 뭐가 메소드로 덜 빠졌나... 실행 결과가 다름 
				var brickClearDegree = getReflectionDegree(
					singleBrick.x, singleBrick.y, singleBrick.width/2, singleBrick.height/2);
				var curClearDegree = getReflectionDegree(
					singleBrick.x, singleBrick.y, (singleBrick.width/2) - mBall.x, (singleBrick.height/2) - mBall.y);
				*/

				//console.log('현재 들어오는 각도 >> ' + curClearDegree);

				if(brickClearDegree == curClearDegree){
					mBall.velocityX *= -1;
					mBall.velocityY *= -1;	
				}
				if(brickClearDegree > curClearDegree){
					mBall.velocityY *= -1;
				}
				if(brickClearDegree < curClearDegree){
					mBall.velocityX *= -1;
				}
				break;
			}
		}
	}
}

function getReflectionDegree(x1, y1, x2, y2){
	var distanceX = x1 - x2;
	var distanceY = y1 - y2;
	positiveDistanceX = (distanceX < 0) ? distanceX * -1 : distanceX;
	positiveDistanceY = (distanceY < 0) ? distanceY * -1 : distanceY;
	var radianBetweenTwo = Math.atan2(positiveDistanceX, positiveDistanceY);
	return (radianBetweenTwo * 180) / Math.PI;
}

//공&벽 충돌
gameControl.prototype.collideWall = function(ctx){
	var playGroundWidth = ctx.canvas.width;
	var playGroundHeight = ctx.canvas.height;

	//천장과 바닥
	if(this.ball.y + this.ball.radius >= playGroundHeight || this.ball.y - this.ball.radius <= 0){
		this.ball.velocityY *= -1;
	}

	//좌우 
	if(this.ball.x + this.ball.radius >= playGroundWidth || this.ball.x - this.ball.radius <= 0){
		this.ball.velocityX *= -1;
	}	
}

//게임의 시작과 종료
gameControl.prototype.render = function (ctx){
	//this.drawBricks(ctx);
	ctx.beginPath();
		ctx.fillStyle = this.ball.color;
		ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.fill();
}	

gameControl.prototype.drawPaddle = function(ctx){
	ctx.beginPath();
		/*
		ctx.fillStroke = '#FF0000';
		var paddle_width = 80;
		var paddle_height = 20;
		var paddle_round = 10;
		var paddleCenterX = ctx.canvas.width/2;
		var paddle_top = ctx.canvas.height - 50;
		*/
		ctx.fillStyle = this.paddle.color;
		var paddle_width = this.paddle.width;
		var paddle_height = this.paddle.weight;
		var paddle_round = 10;
		var paddle_top = this.paddle.y;
		var paddleCenterX = this.paddle.x;
		//var paddleCenterY = this.paddle.y/2; 

		//line 1
		ctx.moveTo(paddleCenterX - (paddle_width/2) + paddle_round, paddle_top);
		ctx.lineTo(paddleCenterX + (paddle_width/2), paddle_top);

		//curve 1
		ctx.quadraticCurveTo(paddleCenterX + (paddle_width/2) + paddle_round, paddle_top, 
			paddleCenterX + (paddle_width/2) + paddle_round, paddle_top + paddle_round);

		//line 2
		ctx.lineTo(paddleCenterX + (paddle_width/2) + paddle_round, paddle_top + paddle_height - paddle_round);

		//curve 2
		ctx.quadraticCurveTo(paddleCenterX + (paddle_width/2) + paddle_round , paddle_top + paddle_height, paddleCenterX + (paddle_width/2), paddle_top + paddle_height);

		//line 3
		ctx.lineTo(paddleCenterX - (paddle_width/2) + paddle_round, paddle_top + paddle_height);
		
		//curve 3
		ctx.quadraticCurveTo(paddleCenterX - (paddle_width/2), paddle_top + paddle_height, paddleCenterX - (paddle_width/2), paddle_top + paddle_height - paddle_round);
		
		//line 4
		ctx.lineTo(paddleCenterX - (paddle_width/2), paddle_top + paddle_round);
		
		//final curve
		ctx.quadraticCurveTo(paddleCenterX - (paddle_width/2), paddle_top, paddleCenterX - (paddle_width/2) + paddle_round, paddle_top);
		
	ctx.closePath();

	ctx.fill();
	//context.stroke();
}


gameControl.prototype.run = function(ctx){
	this.collideWall(ctx);
	this.checkBreak();
	this.ball.update();
	this.drawBricks(ctx);
	this.drawPaddle(ctx);
	this.render(ctx);
}

gameControl.prototype.exit = function(ctx){}
