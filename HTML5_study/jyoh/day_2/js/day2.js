

//세번째 파라미터는 capture phrase 에 관한 것으로 DOM3 모델에서부터 적용 그림 addEventListener3rd.png 참고
window.addEventListener("load", eventWindowLoaded, false);

var Debugger = {};
Debugger.log = function(message){
	try{
		console.log(message);
	}catch(exception){
		return;
	}
}


//이 파라미터는 bitrate 를 재는 용도로 사용한다. 
//var idx = 0;

function eventWindowLoaded(){
	console.log('이벤트 윈도우 로드되었음');
	canvasApp();
}

function canvasApp(){

	var canvas = document.getElementById("canvas2");
	var context = canvas.getContext("2d");

	// var canvas 여기는 물론 라인 순서가 맞아야만 실행이 됨 // Modernizr 를 사용할 경우에는 다를 수 있음 
	if(!canvas || !canvas.getContext){
		return;
	}


	function drawScreen(){
		//context 객체에 기본적으로 내장된 변수들 찾아보기
		//배경
		context.globalAlpha = 1;
		context.fillStyle = "#000000";
		context.fillRect(0, 0, 640, 480);

		//이미지
		//0.25 아니고 .25?
		context.globalAlpha = .25;
		context.drawImage(helloworldImg, 0, 0);

		if(fadeIn){
			alpha += .01;
			if(alpha >= 1){
				alpha = 1;
				fadeIn = false;
			}
		}else{
			alpha -= .01;
			if(alpha < 0){
				alpha = 0;
				fadeIn = true;
			}
		}

		//문자 처리
		context.font = "72px Sans-Serif";
		context.textBaseLine = "top";

		context.globalAlpha = alpha;
		context.fillStyle = "#FFFFFF";
		context.fillText(text, 150, 200);

		//Debugger.log(idx++ + "사이클 돌았음");
	}

	var alpha = 0;
	var fadeIn = true;
	var text = "Hello, HTML5 Canvas";
	var helloworldImg = new Image();
	helloworldImg.src = "../images/html5bg.jpg";

	function gameLoop(){
		window.setTimeout(gameLoop, 20);
		drawScreen();
	}
	gameLoop();
}