window.addEventListener('load', executeCanvas, false);

function executeCanvas(){
	var canvas = document.getElementById('cross');

	if(!canvas || !canvas.getContext){
		Debugger.log('Can not find Canvas');
		return;
	}

	canvas.width = 800;
	canvas.height = 600;

	//object
	var ball = {x : 0, y : 0, speed : .01, t: 0};
	var trace = new Array();

	var p0 = {x : 150, y : 440};
	var p1 = {x : 450, y : 10};
	var p2 = {x : 50, y : 10};
	var p3 = {x : 325, y : 450};

	var context = canvas.getContext('2d');

	function drawCanvas(){

		//fill background
		context.fillStyle = '#FFFFFF';
		context.fillRect(0, 0, canvas.width, canvas.height);

		//draw box
		context.strokeStyle = '#000000';
		context.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);

		//번스타인의 공식
		var t = ball.t;

		var cx = 3 * (p1.x - p0.x);
		var bx = 3 * (p2.x - p1.x) - cx;
		var ax = p3.x - p0.x - cx - bx;

		var cy = 3 * (p1.y - p0.y);
		var by = 3 * (p2.y - p1.y) - cy;
		var ay = p3.y - p0.y - cy - by;

		var xt = ax * (t * t * t) + bx * (t * t) + cx * t + p0.x;
		var yt = ay * (t * t * t) + by * (t * t) + cy * t + p0.y;

		Debugger.log('x : ' + xt + ' , y : ' + yt);

		ball.t += ball.speed;

		if(ball.t > 1){
			ball.t = 1;
		}


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


		trace.push({x : xt, y : yt});
		for(var i = 0; i < trace.length; i ++){
			context.fillStyle = '#0000FF';
			context.beginPath();
				context.arc(trace[i].x, trace[i].y, 1, 0, Math.PI * 2 , true);
			context.closePath();
			context.fill();
		}		

		ball.x = xt 

		//객체 그리기
		context.fillStyle = '#000000';
		context.beginPath();
			context.arc(xt, yt, 5, 0, Math.PI * 2, true);
		context.closePath();
		context.fill();
	}

	setInterval(drawCanvas, 30);
}

//변곡점을 잡는 순서에 따라 영향을 받는다.