window.addEventListener("load", addEvent, false);

var Debugger = {};
Debugger.log = function(message){
	try{
		console.log(message);
	}catch(exception){
		return;
	}
}

function addEvent(){
	canvasApp();
}

function canvasApp(){
	var canvas = document.getElementById('canvas4');
	var canvas1 = document.getElementById('canvas4_2');

	if(!canvas || !canvas.getContext){
		return;
	}

	var context = canvas.getContext('2d');
	var context1 = canvas1.getContext('2d');

	function drawScreen(){
		context.strokeStyle = '#000000';
		context.moveTo(50, 20);
		context.bezierCurveTo(80, 20, 80, 100, 50, 100);
		context.bezierCurveTo(20, 100, 20, 180, 50, 180);
		context.stroke();

		context1.strokeStyle ='#FF9933';
		context1.moveTo(20, 20);
		context1.quadraticCurveTo(20, 50, 50, 20);
		context1.stroke();
	}

	drawScreen();
}