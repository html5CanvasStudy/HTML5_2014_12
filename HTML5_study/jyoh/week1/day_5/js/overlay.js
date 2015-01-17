window.addEventListener("load", addCanvasEvent, false);

var Debugger = {};
Debugger.log = function(message){
	try{
		console.log(message);
	}catch(exception){
		return;
	}
}

function addCanvasEvent(){
	Debugger.log('trigging...');
	executeCanvasApp();
}

function executeCanvasApp(){
	var canvas = document.getElementById('canvas5');

	if(!canvas || !canvas.getContext){
		return;
	}

	var context = canvas.getContext('2d');

	function drawScreen(){
		Debugger.log('Drawing...');

		//투명도  (투명)0 ~ 1.0(불투명)
		//context.globalAlpha = 0.5;

		//globalCompositeOperation
		//source 는 윗그림, destination 은 밑그림
		//in 은 겹친 부분만, out은 겹치지 않은 부분만

		context.fillStyle = 'black';
		context.fillRect(10, 10, 200, 200);

		//설정하지 않았으므로 source-over : 가장 윗그림부터 출력
		context.fillStyle = 'red';
		context.fillRect(1, 1, 50, 50);

		context.globalCompositeOperation = "source-over";
		context.fillRect(60, 1, 50, 50);

		//destination-atop : 밑그림이 위에 출력
		context.globalCompositeOperation = "destination-over";
		//context.globalCompositeOperation = "destination-lighter";
		//context.globalCompositeOperation = "destination-in";
		//context.globalCompositeOperation = "destination-out";
		context.fillRect(1, 60, 50, 50);

		context.globalAlpha = .5;

		context.globalCompositeOperation = "source-atop";
		context.fillRect(60, 60, 50, 50);
	}

	drawScreen();
}