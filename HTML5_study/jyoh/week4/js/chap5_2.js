window.addEventListener('load', readyCanvas, false);

function readyCanvas(){
  executeCanvas();
}

function executeCanvas(){
  var canvas = document.getElementById('canvas1');

  if(!canvas || !canvas.getContext){
    Debugger.log('This browser can not be supported');
    return;
  }

  canvas.width = 800;
  canvas.height = 600;
  var context = canvas.getContext('2d');

  var point1 = {
    x : 20,
    y : 250
  };

  var point2 = {
    x : canvas.width,
    y : 350
  };

  var speed = 15;
  var xDistance = point2.x - point1.x;
  var yDistance = point2.y - point1.y;

  var distance = Math.sqrt(xDistance * xDistance + yDistance * yDistance);
  var moves = distance/speed;

  var xUnits = (point2.x - point1.x)/moves;
  var yUnits = (point2.y - point1.y)/moves;

  var ball = {x: point1.x, y : point1.y};
  var points = new Array();

  var pointImg = new Image();
  pointImg.src = '../img/point.png';

  function drawCanvas(){
    context.fillStyle = '#AAAAAA';
    context.fillRect(0, 0, canvas.width, canvas.height);

    if(moves > 0){
      moves--;
      ball.x += xUnits;
      ball.y += yUnits;
    }

    points.push({x: ball.x, y : ball.y});

    context.fillStyle = '#000000';
    
    for(var i = 0; i < points.length; i++){
      try{
        context.drawImage(pointImg, points[i].x, points[i].y, 1, 1);
      }catch(exception){
        // 추적점 
        context.beginPath();
          //context.moveTo(points[i].x, points[i].y);
          context.arc(points[i].x, points[i].y, 1, 0, Math.PI * 2, true);
        context.closePath();
        context.fill();
         
      }
    }

    //큰 원 
    context.beginPath();
      //context.moveTo(ball.x, ball.y);
      context.arc(ball.x, ball.y, 15, 0, Math.PI * 2, true);
    context.closePath();
    context.fill();
  }

  function gameloop(){
    //setTimeout(gameloop, 20);
    //drawCanvas();
    setInterval(drawCanvas, 20);
  }

  gameloop();
}

/*
beginPath()/closePath() 를 이용했을 때와 moveTo() 만 이용했을 때,
같이 사용했을 때의 결과가 조금씩 다름. 원인 찾아보기
*/
