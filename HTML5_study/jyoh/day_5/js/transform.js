window.addEventListener('load', readyCanvas, false);

function readyCanvas(){
	executeCanvas();
}

function executeCanvas(){
	var canvas = document.getElementById('canvas5');

	if(!canvas || !canvas.getContext){
		return;
	}

	console.log('a');
	var context = canvas.getContext('2d');

	function drawScreen(){
		var x = 100;
		var y = 100;
		var width = 50;
		var height = 50;

		//파라미터 6 개 받는데 이유를 찾아보기 
		//context.setTransform(1, 0, 0, 1, 0, 0);
		//가로로 몇배 늘릴 것인지
		//가로로 얼마나 뒤틀 것인지
		//세로로 얼마나 뒤틀 것인지
		//세로로 몇배 늘릴 것인지
		//시작 점의 좌표 x, y
		context.setTransform(1, 0, 0, 1, 0, 0);


		context.translate(x + width/2, y + height/2);
		context.rotate(((Math.PI)/180) * 45);
		context.scale(2, 1);

		context.fillStyle = 'green';
		//사각형은 모서리부터 그리기 때문에 계산 필요 
		context.fillRect(width/2 * -1, height/2 * -1, width, height);


		/*
		//예제 1. 최초 빨간 사각형과 돌아간 녹색 사각형 
		context.fillStyle = 'red';
		context.fillRect(100, 100, 50, 50);

		//이후의 코드에만 영향을 미친다 
		context.setTransform(1, 0, 0, 1, 0, 0);

		var angleInRadians = 45 * (Math.PI/180);
		context.rotate(angleInRadians);
		context.fillStyle = 'green';
		context.fillRect(100, 100, 50, 50);
		*/
	}
	drawScreen();
}