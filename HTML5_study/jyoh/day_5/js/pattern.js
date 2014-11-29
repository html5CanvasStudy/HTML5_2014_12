window.addEventListener('load', readyCanvas, false);
var Debugger = {};
Debugger.log = function(message){
	try{
		console.log(message);
	}catch(exception){
		return;
	}
}

function readyCanvas(){
	runCanvasApp();	
}

function runCanvasApp(){

	var canvas = document.getElementById('canvas5');

	if(!canvas || !canvas.getContext){
		return;
	}

	Debugger.log('Canvas is valid');

	var context = canvas.getContext('2d');

	function drawScreen(){
		var fillImg = new Image();
		fillImg.src = '../images/pattern1.jpeg';

		fillImg.onload = function(){
			//context.drawImage(fillImg, 0, 0);		
			//세번째 파라미터는 반복의 방향을 나타낸다.
			//repeat-x, repeat-y, no-repeat, repeat 이 있음 
			var fillPattern = context.createPattern(fillImg, 'repeat');
			context.fillStyle = fillPattern;
			context.fillRect(0, 0, 1600, 1600);
		}
		//var fillPattern = context.createPattern(fillImg, 'repeat');
		//context.fillRect(0, 0, 800, 800);
	}
	drawScreen();
}