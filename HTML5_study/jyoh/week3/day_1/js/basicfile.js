window.addEventListener('load', prepareCanvas, false);

function prepareCanvas(){
	Debugger.log('캔버스 앱을 실행합니다.');
	executeCanvas(500, 300);
}

function executeCanvas(x, y){

	var canvas = document.getElementById('canvas1');
	var spaceShip = new Image();
	spaceShip.src = '../resources/images/ship.png';

	if(!canvas || !canvas.getContext){
		return;
	}

	var context = canvas.getContext('2d');
	canvas.width = x;
	canvas.height = y;

	function drawScreen(){
		context.fillStyle = '#AAAAAA';
		context.fillRect(0, 0, x, y);

		context.fillStyle = '#000000';
		context.font = '20px sans-serif';
		context.textBaseLine = 'top';
		context.fillText('CANVAS!', 100, 100);
	}

	drawScreen();
}