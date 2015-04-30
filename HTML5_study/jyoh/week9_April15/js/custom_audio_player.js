window.addEventListener('load', preparePostJob, false);

var audioTag;

var loadCount = 0;
var itemToLoaded = 0;
var buttonSheet;
var buttonWait = 5;
var timeWait = buttonWait;

const audioPath = '../resources/audio/';
const imagePath = '../resources/images/';
const audiofileName = 'song1';
const imagefileName = 'audio_controls.png';


function preparePostJob () {
  audioTag = document.createElement('audio');
  var accessibleType = fetchAvailableAudio();

  if(accessibleType == null 
     || typeof accessibleType == 'undefined' 
     || accessibleType.trim() == '') {
    return;
  }

  // 둘 중 어떤 것이 먼저 오는게 옳은지
  audioTag.addEventListener('canplaythrough', itemLoaded, false);
  audioTag.setAttribute('src', audioPath + audiofileName + '.' + accessibleType);

  buttonSheet = new Image();
  buttonSheet.onload = itemLoaded;
  buttonSheet.src = imagePath + imagefileName;
}


// 지원하는 음원 확장자 가져오기
function fetchAvailableAudio(){
  var supportable = ['ogg', 'mp3', 'wav'];
  var ret = '';

  for(var i = 0; i < supportable.length; i++){
    var singleType = supportable[i];
    if(audioTag.canPlayType('audio/' + singleType) == 'probably' 
       || audioTag.canPlayType('audio/' + singleType) == 'maybe') {
      ret = singleType;
    }
  }
  return ret;
}

function itemLoaded(){
  loadCount ++;
  if(loadCount >= itemToLoaded) {
    executeApp();
  }
}


function executeApp() {
  var canvas = document.getElementById('audio_canvas');

  // validation
  if(!canvas || !canvas.getContext) {
    console.log('This browser [' + navigator.userAgent + '] can not handle HTML5 canvas element.');
    return;
  }

  canvas.width = 800; canvas.height = 600;
  var ctx = canvas.getContext('2d');

  function drawScreen() {

    console.log(canvas.width + ' ' + canvas.height);
    ctx.fillStyle = '#FFFFAA';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStroke = '#000000';
    ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);

    printText(ctx);
    drawControls(ctx);    
  }

  function printText(ctx) {
    ctx.fillStyle = '#000000';
    ctx.fillStyle = "#000000";
    ctx.fillText  ("Duration:" + audioTag.duration,  20 ,20);
    ctx.fillText  ("Current time:" + audioTag.currentTime,  250 ,20);
    ctx.fillText  ("Loop: " + audioTag.loop,  20 ,40);
    ctx.fillText  ("Autoplay: " + audioTag.autoplay,  250 ,40);
    ctx.fillText  ("Muted: " + audioTag.muted,  20 ,60);
    ctx.fillText  ("Controls: " + audioTag.controls,  250 ,60);
    ctx.fillText  ("Volume: " + audioTag.volume,  20 ,80);
    ctx.fillText  ("Paused: " + audioTag.paused,  250 ,80);
    ctx.fillText  ("Ended: " + audioTag.ended,  20 ,100);
    ctx.fillText  ("Can Play OGG: " + audioTag.canPlayType("audio/ogg"), 250 ,100);
    ctx.fillText  ("Can Play WAV: " + audioTag.canPlayType("audio/wav"), 20 ,120);
    ctx.fillText  ("Can Play MP3: " + audioTag.canPlayType("audio/mp3"), 250 ,120);
    ctx.fillText  ("Source: " + audioTag.currentSrc, 20 ,140);
    //ctx.fillText  ("volumeSliderDrag: " + volumeSliderDrag, 20 ,160););
  }

  function drawControls(ctx){

    //Play Button
    if(audioTag.paused) {
      ctx.drawImage(buttonSheet, 0, 0, bW, bH, playX, playY, bW, bH);
    } else {
      ctx.drawImage(buttonSheet, 0, 32, bW, bH, playX, playY, bW, bH);
    }

    //Loop Button
    if(audioTag.loop) {
      ctx.drawImage(buttonSheet, 114, 32, bW, bH, loopX, loopY, bW, bH);
    } else {
      ctx.drawImage(buttonSheet, 82, 32, bW, bH, loopX, loopY, bW, bH);
    }

    // Play Background
    ctx.drawImage(buttonSheet, 32, 32, volBackW, bH, volBackX, volBackY, volBackW, bH);

    var slideIncrement = playBackW/audioTag.duration;
    var slideX = (controlStartX + bW) + (slideIncrement * audioTag.currentTime);
    ctx.drawImage(buttonSheet, 238, 0, slideW, bH, slideX, controlStartY, slideW, bH);

    if(audioTag.ended && !audioTag.loop) {
      audioTag.currentTime = 0;
      audioTag.pause();
    }

    if(volumeSliderDrag) {
      volumeSliderX = mouseX;
      if (volumeSliderX > volumeSliderEnd) {
        volumeSliderX = volumeSliderEnd;
      }

      if(volumeSliderX < volumeSliderStart) {
        volumeSliderX = volumeSliderStart;
      }
    } else {
      volumeSliderX = volumeSliderStart + (audioTag.volume * (volBackW - slideW));
    }

    ctx.drawImage(buttonSheet, 238, 0, slideW, bH, volumeSliderX, volumeSliderY, slideW, bW);
    timeWait++;
  }


  function mouseDown (e) {
    if((mouseY >= volumeSliderY) && (mouseY <= volumeSliderY + slideH)
      && (mouseX >= volumeSliderX) && (mouseX <= volumeSliderX + slideW)) {
      volumeSliderDrag = true;
    }
  }

  function mouseMove(e) {
    var x;
    var y;
    if(e.pageX || e.pageY) {
      x = e.pageX;
      y = e.pageY;
    } else {
      x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }

    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;

    mouseX = x;
    mouseY = y;
  }

  function mouseUp(e) {
    if(timeWait >= buttonWait) {
      timeWait = 0;
      //플레이 눌림
      if((mouseY >= playY) && (mouseY <= playY + bH)
        && (mouseX >= playX) && (mouseX <= playX + bW)) {
        if(audioTag.paused) {
          audioTag.play();
        } else {
          audioTag.pause();
        }
      }

      //반복버튼 눌림 
      if((mouseY >= loopY) && (mouseY <= loopY + bH)
        && (mouseX >= loopX) && (mouseX <= loopX + bW)) {
        if(audioTag.loop) {
          audioTag.loop = false;
        } else {
          audioTag.loop = true;
        }
      }
    }

    if(volumeSliderDrag) {
      volumeSliderDrag = false;
    }
  }

  var bW = 32;
  var bH = 32;
  var playBackW = 206;
  var volBackW = 50;
  var slideW = 10;
  var slideH = 32;
  var controlStartX = 25;
  var controlStartY =200;
  var playX = controlStartX;
  var playY = controlStartY;
  var playBackX = controlStartX+bW;
  var playBackY = controlStartY;
  var volBackX = controlStartX+bW+playBackW;
  var volBackY = controlStartY;
  var loopX = controlStartX+bW+playBackW+volBackW;
  var loopY = controlStartY;
  var mouseX;
  var mouseY;

  canvas.addEventListener('mouseup', mouseUp, false);
  canvas.addEventListener('mousedown', mouseDown, false);
  canvas.addEventListener('mousemove', mouseMove, false);

  audioTag.play();
  audioTag.loop = false;
  audioTag.volume = .5;
  var volumeSliderStart = volBackX;
  var volumeSliderEnd = volumeSliderStart + volBackW -slideW;
  var volumeSliderX = volumeSliderStart + (audioTag.volume*(volBackW -slideW));
  var volumeSliderY = controlStartY;
  var volumeSliderDrag = false;
  var volumeIncrement = 1/(volBackW -slideW);

  setInterval(drawScreen, 33);

}