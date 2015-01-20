window.addEventListener('load', readyCanvas, false);

function readyCanvas(){
	executeCanvas();
}


function executeCanvas(){
	var canvas = document.getElementById('tank_canvas');
	var tankSprite = new Image();
	tankSprite.src='../img/tank.png';

	//tank의 이동모션 스프라이트
	var moveFrames = [1, 2, 3, 4, 5, 6, 7, 8];
	var moveIdx = 0;
	var startPointX = canvas.width / 2;
	var startPointY = canvas.height / 2;

	//탱크 객체
	var myTank = {};
	//myTank.xPos = 0;
	//myTank.yPos = 0;
	myTank.xPos = canvas.width / 2;
	myTank.yPos = canvas.height / 2;
	myTank.xMove = 0;
	myTank.yMove = 0;
	myTank.direction = 0;

	//키보드 동시 입력 처리
	var keyPressed = [];

	if(!canvas || !canvas.getContext){
		alert('can not find canvas element!!!');
	}

	var ctx = canvas.getContext('2d');
	//그냥 도큐먼트에 이벤트를 주는 걸로
	//canvas.addEventListener('keypress', actionTank, false);

	//부동값 - 안먹어서 html로 뺐음. 
	//canvas.width = 800;
	//canvas.height = 600;

	function drawScreen(){
		ctx.fillStyle = '#AAAAAA';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		
		//탱크만 처리 
		ctx.save();

			ctx.setTransform(1, 0 , 0, 1, 0 , 0);
			var angleRadian = myTank.direction * Math.PI / 180;
			//ctx.translate(startPointX, startPointY);
			ctx.translate(myTank.xPos - 16, myTank.yPos -16);
			ctx.rotate(angleRadian);

			myTank.spriteX = Math.floor(moveFrames[moveIdx] % 8) * 32;
			myTank.spriteY = Math.floor(moveFrames[moveIdx] / 8) * 32;
			//myTank.yPos = Math.floor(moveFrames[moveIdx] % 8) * 32;
			ctx.drawImage(tankSprite, myTank.spriteX, myTank.spriteY, 32, 32, myTank.xMove, myTank.yMove, 32, 32);
		ctx.restore();

		moveIdx++;
		if(moveIdx == moveFrames.length) moveIdx = 0;
	}

	drawScreen();

	function activate(){
		setInterval(updateTank, 50);
	}

	window.onkeydown = function(e){
		console.log('k-down');
		keyPressed[e.keyCode] = true;
	}

	window.onkeyup = function(e){
		console.log('k-up');
		keyPressed[e.keyCode] = false;
	}

	function updateTank(){
		var press = false;

		if (keyPressed[38]) {
			myTank.yMove -= 1;
			press = true;
		}
		if (keyPressed[40]) {
			myTank.yMove += 1;
			press = true;
		}
		if (keyPressed[37]) {
			myTank.direction -= 1;
			press = true;
		}
		if (keyPressed[39]) {
			myTank.direction += 1;
			press = true;
		}
		if (keyPressed[32]) {
		   alert('발사');
		}

		if(press){
			drawScreen();
		}
	}

/*
	한번에 두개의 키 처리를 못한다.

	document.onkeydown = function(e){
		e = e ? e : window.event;

		switch(e.keyCode){
			case 38 : 
			myTank.yPos-=1;
			drawScreen();
			break;
			case 40 :
			myTank.yPos+=1;
			drawScreen();
			break;
			case 37 :
			myTank.direction-=1;
			//좌로 틀기
			break;
			case 39 :
			myTank.direction+=1;
			//우로 틀기 
			break;
			case 32 :
			//발사
			break;
		}
	}
*/

//  keypress 이벤트는 문자만 받는다.
//	document.onkeypress = actionTank;
//	var actionTank = function(e){
//		alert(e.keyCode);
//	}

	activate();
}