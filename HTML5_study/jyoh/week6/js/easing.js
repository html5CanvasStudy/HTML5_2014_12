window.addEventListener('load', readyEvent, false);

//여러곳에서 참조할 수 있게 글로벌 
var shipImage = new Image();

function readyEvent(){
	shipImage.src = '../img/ship.png';
	shipImage.onload = executeCanvas;
}

function executeCanvas(){
	var canvas = document.getElementById('easing');

	if(!canvas || !canvas.getContext){
		Debugger.log('Can not find canvas');
		return;
	}

	canvas.width = 800;
	canvas.height = 600;

	var context = canvas.getContext('2d');

	//Elements
	var easeValue = .05;
	//시작점
	var p1 = {x : 240, y : - shipImage.height/2};
	var p2 = {x : 240, y : canvas.height - shipImage.height};

	var ship = {x : p1.x, y : p1.y, endX : p2.x, endY : p2.y, velocityX : 0, velocityY : 0};
	var trace = new Array();

	document.addEventListener('keydown', takeoffShip, false);
	//document.addEventListener('keyup', landShip, false);

	function drawCanvas(){
		//bg
		context.fillStyle = '#000000';
		context.fillRect(0, 0, canvas.width, canvas.height);

		//box
		context.strokeStyle = '#FFFFFF';
		context.strokeRect(0, 0, canvas.width - 2, canvas.height - 2);

		var dx = ship.endX - ship.x;
		var dy = ship.endY - ship.y;

		ship.velocityX = dx * easeValue;
		ship.velocityY = dy * easeValue;

		ship.x += ship.velocityX;
		ship.y += ship.velocityY;

		trace.push({x : ship.x, y : ship.y});
		for(var i = 0; i < trace.length; i ++){
			context.fillStyle = '#FF0000';
			context.beginPath();
				context.arc(trace[i].x + shipImage.width/2, trace[i].y, 1, 0, Math.PI * 2, true);
			context.closePath();
			context.fill();
		}

		//draw ship
		context.drawImage(shipImage, ship.x, ship.y);
	}

	function moveShip(e){

		Debugger.log(e.keyCode);
		var keyCode = e.keyCode;

		switch(keyCode){
			case 38 :
			//이륙
			break;
			default :
			break;
		}
	}
		
	setInterval(drawCanvas, 30);
}
