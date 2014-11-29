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
	executeCanvasApp();
}

function executeCanvasApp(){
	var canvas = document.getElementById('canvas5');

	if(!canvas || !canvas.getContext){
		return;
	}

	Debugger.log('got canvas');

	var context = canvas.getContext('2d');

	function drawScreen(){

		//context.fillStype = 'red';
		//context.rgb(255, 0, 0);

		//red green blue alpha
		//context.rgba(255, 0, 0, 7);

		//왼쪽 상단의 좌표와 오른쪽 종료점의 좌표 
		//수평 
		var gr = context.createLinearGradient(0, 0, 100, 0);
		//수직
		//var gr = context.createLinearGradient(0, 0, 100, 0);

		//방사형 그라디언트
		//첫번째 원의 중심 좌표, 반지름, 두번째 원의 중심 좌표, 반지름
		//gr = context.createRadialGradient(50, 50, 25, 100, 100, 100);

		//지점 추가 
		//gr.addColorStop(0, 	'#FF0000');
		//gr.addColorStop(.5, '#00FF00');
		//gr.addColorStop(1, 	'#0000FF');
		gr.addColorStop(0, 	'rgba(255, 0, 0, .2)');
		gr.addColorStop(.5, 'rgba(0, 255, 0, .2)');
		gr.addColorStop(1, 	'rgba(0, 0, 255, .2)');

		context.fillStyle = gr;

		context.beginPath();
		context.moveTo(0, 0);
		context.lineTo(50, 0);
		context.lineTo(100, 50);
		context.lineTo(50, 100);
		context.lineTo(0, 100);
		context.lineTo(0, 0);

		context.stroke();
		context.fill();
		context.closePath();

		//context.fillRect(0, 0, 200, 200);

		//var grd = context.createLinearGradient(0, 0, 170, 0);
		//grd.addColorStop(0, "black");
		//grd.addColorStop(1, "white");

		//context.fillStyle = grd;
		//context.fillRect(20, 20, 150, 100);
	}
	drawScreen();
}