window.addEventListener('load', preparePing, false);

function preparePing(){
	playPingPong();
}

function playPingPong(){
	var canvas = document.getElementById('playground');

	if(!canvas || !canvas.getContext){
		alert('this browser does not support canvas!');
		return;
	}

	var blockMargin = 50;
	canvas.width = 800;
	canvas.height = 600;

	var context = canvas.getContext('2d');
	

	/* ========================= 여기서는 랜덤으로 스테이지를 생성한다. ============================== */ 

	//width/height/mass	
	var opt = new Options(50, 20, 1);
	var builder = new StageBuilder(true, null);
	//st_point_x/st_point_y/tot_area_width/tot_area_height/options
	//옵션을 어떨게 전달받아야 될지는 jquery_plot.js 의 옵션 첨부 방식을 참조하기.
	//같이 공부할 부분은 만약 옵션에 포함되지 않은 키값이 들어왔을 때 어떤 방식으로 사용자에게 핸들링할 것인지.
	builder.buildRandomBricks(blockMargin, blockMargin, canvas.width - blockMargin * 2, 200, opt);
	var blockArray = builder.bricks;


	/* ============================== 여기서는 공 객체를 생성한다. ================================ */
	
	//공은 어차피 하나만 존재할 것이며 위치만 변경될 것이므로 캔버스 내 전역(?) 객체로 선언
	var myball = new Ball(); 
	//공의 초기 위치는 패들의 정 가운데여야 하지만 일단은 가장 바닥이라고 가정한다.
	//파라미터는 공 중앙의 x 좌표, y 좌표, 반지름, x 가속, y 가속, 중량을 받는다.
	var myballRadius = 10;
	myball.initialize(canvas.width/2, canvas.height - myballRadius - 2, myballRadius, 5, -5, 10);
	//myball.setColor('random');

	//가속도 처리에는 오류가 있음 02 05
	//myball.increaseSpeed(.5);

	function drawCanvas(){

		//=== 배경 칠하기
		context.fillStyle = '#8CBDED';
		context.fillRect(0, 0, canvas.width, canvas.height);

		//=== 배경 테두리 
		context.strokeStyle = '#FF50CF';
		context.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);

		builder.drawBricks(context);
		myball.run(context);
	}

	setInterval(drawCanvas, 50);
}


















	//drawCanvas();

	/* 시작 버튼

	context.strokeStyle = '#96F56E';
	context.fillStyle = '#96F56E';
	//context.fillRect(canvas.width/2, canvas.height/2, 120, 30);
	
	context.beginPath();
		context.moveTo(canvas.width/2, canvas.height/2 - 20);
		context.lineTo(canvas.width/2 + 60, canvas.height/2 - 20);
		context.quadraticCurveTo(canvas.width/2 + 70, canvas.height/2 - 20, canvas.width/2 + 70, canvas.height/2 - 10);
		context.lineTo(canvas.width/2 + 70, canvas.height/2 + 10);
		context.quadraticCurveTo(canvas.width/2 + 70 , canvas.height/2 + 20, canvas.width/2 + 60, canvas.height/2 + 20);
		context.lineTo(canvas.width/2 - 110, canvas.height/2 - 20 + 40);
		context.quadraticCurveTo(canvas.width/2 - 120, canvas.height/2 + 20, canvas.width/2 - 120, canvas.height/2 + 10);
		context.lineTo(canvas.width/2 - 120, canvas.height/2 - 20 + 40 - 10 - 20);
		context.quadraticCurveTo(canvas.width/2 - 120, canvas.height/2 - 20, canvas.width/2 - 110, canvas.height/2 - 20);
		context.lineTo(canvas.width/2, canvas.height/2 - 20);
		context.fill();
		//context.stroke();
	context.closePath();	
	*/