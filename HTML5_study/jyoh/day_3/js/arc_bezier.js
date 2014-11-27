window.addEventListener("load", readyCanvas, false);

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
	var canvas = document.getElementById('canvas3');

	if(!canvas || !canvas.getContext){
		return;
	}

	var context = canvas.getContext('2d');

	function drawScreen(){

		//이렇게 그렸을 때 도넛이 찌그러지는 이유는?
		context.strokeStyle = "black";
		context.lineWidth = 1;
		context.lineCap = "round";
		context.beginPath();

		//param1 을 x 축으로
		//param2 를 y 축으로 하는 중심점에서
		//반지름이 20 원을 
		//0 도에서 360 도까지 그린다.
		//마지막 파라미터는 시계 방향(clockwise)으로 돌거나 반대로 돌거나 default 는 false
		//context.arc(100, 100, 20, (Math.PI/180)*0, (Math.PI/180)*360, false);
		
		//반시계로 돌리기 
		context.arc(100, 100, 20, (Math.PI/180)*0, (Math.PI/180)*120, false);
		context.stroke();
		//여기서 새로 패스를 다시 만들지 않으면 두개의 도형을 직선으로 연결한다 
		context.closePath();

		context.beginPath();
		context.strokeStyle = '#FF9933';
		//시계방향으로 돌리기 
		context.arc(100, 100, 20, (Math.PI/180)*0, (Math.PI/180)*50, true);
		context.stroke();

		//Path 를 여닫지 않고 위치를 옮기는 방법은 moveTo를 사용하는 것이다.
		//제대로 동작하지 않음// 뭐가 문제지?
		context.moveTo(0, 0);
		context.lineTo(50, 0);
		context.arcTo(50, 10, 50, 30, 60);
		context.lineTo(50, 50);
		context.stroke();

		context.closePath();
	}

	drawScreen();
}