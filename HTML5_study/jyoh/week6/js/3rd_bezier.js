window.addEventListener('load', executeCanvas, false);

function executeCanvas(){
	var canvas = document.getElementById('3rd_bezier');

	if(!canvas || !canvas.getContext){
		Debugger.log('Can not find canvas Element');
		return;
	}

	canvas.width = 800;
	canvas.height = 600;

	var context = canvas.getContext('2d');


	//베지어 곡선을 나타내기 위한 점들을 정의한다.

	//시작점 
	var p0 = {x: 60, y:10};

	var p1 = {x: 70, y: 200};
	var p2 = {x: 125, y : 295};

	//종료점 
	var p3 = {x: 350, y: 350};

	//t는 번스타인의 정의에 명시된 변수로 0 ~ 1 사이의 값 
	//0 이면 시작점 1 이면 끝점 
	var ball = {x : 0, y : 0, speed : .01, t: 0};
	var trace = new Array();

	function drawCanvas(){

		//fill background
		context.fillStyle = '#FFFFFF';
		context.fillRect(0, 0, canvas.width, canvas.height);

		//draw box
		context.strokeStyle = '#000000';
		context.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);

		////
		var t = ball.t;

		//p.297
		var cx = 3 * (p1.x - p0.x);
		var bx = 3 * (p2.x - p1.x) - cx;
		var ax = p3.x - p0.x - cx - bx;


		var cy = 3 * (p1.y - p0.y);
		var by = 3 * (p2.y - p1.y);
		var ay = p3.y - p0.y - cy - by;


		var xt = ax * (t * t * t) + bx * (t * t) + cx * t + p0.x;
		var yt = ay * (t * t * t) + by * (t * t) + cy * t + p0.y;

		ball.t += ball.speed;

		//곡선이 종료되었다면 
		if(ball.t > 1) {
			//1보다 큰데 계속 진행하면 어떻게 되나?
			ball.t = 1;
		}

		//여기서 부터 실제 베지어 곡선을 그리는 부분

		//시작점
		context.font = '10px sans';
		context.fillStyle = '#FF0000';
		context.beginPath();
			context.arc(p0.x, p0.y, 8, 0, Math.PI * 2, true);
		context.closePath();
		context.fill();
		context.fillStyle = '#FFFFFF';
		context.fillText('0', p0.x - 2, p0.y + 2);

		//점 1
		context.fillStyle = '#FF0000';
		context.beginPath();
			context.arc(p1.x, p1.y, 8, 0, Math.PI * 2, true);
		context.closePath();
		context.fill();
		context.fillStyle = '#FFFFFF';
		context.fillText('1', p1.x - 2, p1.y + 2);

		//점 2
		context.fillStyle = '#FF0000';
		context.beginPath();
			context.arc(p2.x, p2.y, 8, 0, Math.PI * 2, true);
		context.closePath();
		context.fill();
		context.fillStyle = '#FFFFFF';
		context.fillText('2', p2.x - 2, p2.y + 2);

		//점 3
		context.fillStyle = '#FF0000';
		context.beginPath();
			context.arc(p3.x, p3.y, 8, 0, Math.PI * 2, true);
		context.closePath();
		context.fill();
		context.fillStyle = '#FFFFFF';
		context.fillText('1', p3.x - 2, p3.y + 2);

		//p.302 예제에 context.beginPath() 가 없는데 context.closePath() 가 있음 

		//궤적 
		trace.push({x : xt, y : yt});
		for(var i = 0; i < trace.length; i++){
			context.fillStyle = '#00FF00';
			context.beginPath();
				context.arc(trace[i].x, trace[i].y, 2, 0, Math.PI * 2, true);
			context.closePath();
			context.fill();
		}

		//곡선 운동 그리기
		context.fillStyle = '#000000';
		context.beginPath();
			context.arc(xt, yt, 5, 0, Math.PI * 2, true);
		context.closePath();
		context.fill();
	}

	setInterval(drawCanvas, 30);
}

//결과가 뭔가 쫌... 이상함.
//책에는 변곡점 아래서 라인이 형성되는데,
//이 코드는 제 2 점 부근에서 라인 밖으로 나갔다가 들어옴
