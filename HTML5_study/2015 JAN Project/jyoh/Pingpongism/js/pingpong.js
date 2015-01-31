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
	context.fillStyle = '#8CBDED';
	context.fillRect(0, 0, canvas.width, canvas.height);

	context.strokeStyle = '#FF50CF';
	context.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);
	

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
	//var myball = new Ball(); 


	function drawCanvas(){
		builder.drawBricks(context);
	}

	drawCanvas();

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
}