window.addEventListener('load', readyCanvas, false);

function readyCanvas(){
  executeCanvas();
}


function executeCanvas(){

  var canvas = document.getElementById('canvas1');

  var x = 250;
  var y = 10;
  var speed = 5;
  
  if(!canvas || !canvas.getContext){
    Debugger.log('This browser does not support canvas!');
    return;
  }

  canvas.width = 800;
  canvas.height = 600;

  var context = canvas.getContext('2d');

  function drawCanvas(){
    //배경
    context.fillStyle = '#AAAAAA';
    context.fillRect(0, 0, canvas.width, canvas.height);  


    //구 생성 
 
    //?
    y += speed;


    context.fillStyle = '#000000';
    context.beginPath();
      Debugger.log('draw ARC');
      context.arc(x, y, 15, 0, Math.PI * 2, true);
    context.closePath();
    context.fill();
  }

  function gameloop(){
    setTimeout(gameloop, 20);
    drawCanvas();

    //위 코드와 아래 코드가 무엇이 다른지.
    //아래 코드의 경우에는 공이 그냥 최초 위치에 머물러 있음.
    //setTimeout(drawCanvas, 20);
  }

  gameloop();
}
