window.addEventListener('load', prepareAudio, false);

var audioDiv;
var audioTag;

function prepareAudio(){
  setAudio();
  audioTag.addEventListener('canplaythrough', audioLoaded, false);
  audioTag.addEventListener('progress', updateLoadingStatus, false);
  audioTag.load();
}


function setAudio(){
  audioDiv = document.createElement('div');
  audioTag = document.createElement('audio');

  audioTag.setAttribute('loop', true);
  audioTag.setAttribute('controls', true);
  //audioTag.setAttribute('autoplay', true);
  audioTag.setAttribute('src', '../resources/audio/wiki.ogg');

  audioDiv.appendChild(audioTag);
  document.body.appendChild(audioDiv);
}


function updateLoadingStatus(){
  var loadingStatus = document.getElementById('loadingStatus');
  var percentageLoaded = parseInt((audioTag.buffered.end(0) / audioTag.duration) * 100);
  loadingStatus.innerHTML = 'loaded ' + percentageLoaded + ' %';
}


function audioLoaded(){
  executeApp();
}


function executeApp () {
  var canvas = document.getElementById('canvas_audio');
  
  if(!canvas || !canvas.getContext) {
    return;
  }

  canvas.width = 600;
  canvas.height = 400;

  var context = canvas.getContext('2d');

  function drawScreen() {
    //fill bg
    context.fillStyle = '#FFFFAA';
    context.fillRect(0, 0, canvas.width, canvas.height);

    //draw box
    context.fillStroke = '#000000';
    context.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);

    //text
    context.fillStyle = '#000000';
    context.fillText('Duration >> ' + audioTag.duration, 20, 20);
    context.fillText('Current time >> ' + audioTag.currentTime, 20, 40);
    context.fillText('Loop >> ' + audioTag.loop, 20, 60);
    context.fillText('Autoplay >> ' + audioTag.autoplay, 20, 80);
    context.fillText('Muted >> ' + audioTag.muted, 20, 100);
    context.fillText('Controls >> ' + audioTag.controls, 20, 120);
    context.fillText('Volume >> ' + audioTag.volume, 20, 140);
    context.fillText('Paused >> ' + audioTag.paused, 20, 160);
    context.fillText('Ended >> ' + audioTag.ended, 20, 180);
    context.fillText('Source >> ' + audioTag.currentSrc, 20, 200);
    context.fillText('Can play OGG >> ' + audioTag.canPlayType('audio/ogg'), 20, 220);
    context.fillText('Can play MP3 >> ' + audioTag.canPlayType('audio/mp3'), 20, 240);
    context.fillText('Can play WAV >> ' + audioTag.canPlayType('audio/wav'), 20, 260);
  }
  
  audioTag.play();

  //drawScreen();
  setInterval(drawScreen, 30);
}

