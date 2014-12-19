window.addEventListener("load", eventLoaded, false);

var Debugger = function(){};
Debugger.log = function(message){
	try{
		console.log(message);
	}catch(exception){
		return;
	}
}

function eventLoaded(){
	canvasApp();
}

function canvasApp(){
	var canvas = document.getElementById('canvas3');

	Debugger.log(canvas);

	if(!canvas || !canvas.getContext){
		return;
	}

	var context = canvas.getContext('2d');
	Debugger.log('2D context Called');

	function drawScreen(){

		Debugger.log('선 그리기');

		//선 스타일 
		context.strokeStyle = 'black';
		context.strokeStyle = '#000000';
		context.lineWidth = 10;

		//lineCap 은 뭘까?
		//butt 끝이 사각이며 딱 길이만큼 끝남
		//round 끝이 둥그렇고 butt 에서 반원의 반지름만큼 길다.
		//square butt 이랑 비슷하나 길이는 round의 길이 
		context.lineCap = 'square';

		//캔버스 콘텍스트에는 반드시 하나의 current Path 만 존재한다.
		context.beginPath();

		context.moveTo(20, 50);
		context.lineTo(100, 50);

		//이거 호출 안하면 아무것도 출력되지 않음 
		context.stroke();
		//context.closePath();

		//꺽쇠를 그려보자 lineJoin 속성
		//context.beginPath();

		//lineJoin
		//round 둥글게 꺾임
		//miter 뾰족하게 꺾임
		//bevel 뽀족하게 꺽이는데 꼭짓점 자름
		context.lineJoin = 'bevel';

		context.moveTo(20, 20);
		context.lineTo(100, 50);
		context.lineTo(20, 100)
		context.stroke();
		context.closePath();
	}

	drawScreen();
}