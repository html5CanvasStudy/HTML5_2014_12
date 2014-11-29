window.addEventListener('load', initCanvasEvent, false);

var Debugger = {};
Debugger.log = function(message){
	try{
		console.log(message);
	}catch(exception){
		return;
	}
}

function initCanvasEvent(){
	runCanvasApp();
}

function runCanvasApp(){
	var canvas = document.getElementById('canvas5');

	if(!canvas || !canvas.getContext){
		return;
	}

	var context = canvas.getContext('2d');

	function drawScreen(){
		context.fillStyle = 'rgba(0, 255, 0, 0.5)';

		context.shadowOffsetX = 4;
		context.shadowOffsetY = 4;
		//context.shadowOffsetX = -4;
		//context.shadowOffsetY = -4;
		context.shadowBlur = 10;
		context.shadowColor = 'blue';

		context.fillRect(100, 100, 200, 200)
	}

	drawScreen();
}