window.addEventListener("load", addCanvasEvent, false);

var Debugger = {};
Debugger.log = function(message){
	try{
		console.log(message);
	}catch(exception){
		return;
	}	
};

function addCanvasEvent(){
	executeCanvasApp();
}

function executeCanvasApp(){
	var canvas = document.getElementById("canvas5");

	if(!canvas || !canvas.getContext){
		return;
	}

	var context = canvas.getContext('2d');

	function drawScreen(){

		context.fillStyle = 'black';
		context.fillRect(10, 10, 200, 200);

		//커다란 배경을 그린 다음 좌상단의 작은 부분만 보여줌.
		//아래 코드를 지우면 나머지 부분이 존재함.
		context.save();
		context.beginPath();
		context.rect(0, 0, 50, 50);
		context.clip();
		context.closePath();

		//red circle
		//이 원은 부분만 출력됨
		context.beginPath();
		context.strokeStyle = 'red';
		context.lineWidth = 5;
		context.arc(100, 100, 100, (Math.PI/180)*0, (Math.PI/180)*360, false);
		context.stroke();
		context.closePath();

		//????
		context.restore();

		//reclip to the entire canvas
		context.beginPath();
		context.rect(0, 0, 500, 500);
		context.clip();

		//draw a blue line that is not clipped
		context.beginPath();
		context.strokeStyle = 'blue';
		context.lineWidth = 5;
		context.arc(100, 100, 50, (Math.PI/360)*0, (Math.PI)*360, true);

		context.stroke();
		context.closePath();
	}
	drawScreen();
}