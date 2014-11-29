window.addEventListener("load", eventLoaded, false);

function eventLoaded(){
	canvasApp();
}

var Debugger = function(){};
Debugger.log = function(message){
	try{
		console.log(message);
	}catch(exception){
		return;
	}
}

function canvasApp(){
	Debugger.log('여기까지 탔음');
	var canvas = document.getElementById("canvas2");
	var context = canvas.getContext("2d");

	if(!canvas || !canvas.getContext){
		return;
	}

	//실제적인 작업을 한다. 
	function drawScreen(){

		//그림을 그릴 도화지를 준비한다.
		context.fillStyle = "#3366FF";
		context.fillRect(0, 0, 500, 500);

		//문자를 준비한다.
		context.fillStyle = "#000000";
		context.font = "20px Sans-serif";
		//context.font = "20px _sans";
		context.textBaseLine = "top";
		context.fillText("Getting know with Rect!", 20, 50);

		//가운데가 뚫린 사각형
		//context.fillStyle = "#FF9933";
		//이 친구는 fillStyle 아니고 strokeStyle 로 조절함 
		context.strokeStyle = "#FF9933";
		context.lineWidth = 10;
		context.strokeRect(5, 5, 490, 490);

		//특정 부분 투명화
		//3번째 4번째 인자를 도형이 끝나는 좌표로 착각하기 쉬운데, 
		//실은 넓이와 높이임 
		context.clearRect(100, 100, 300, 300);
	}

	drawScreen();
}