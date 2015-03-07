window.addEventListener('load', prepareApp, false);

var videoArea;
var videoElement;
var displatVideoType;
var originalVideoWidth = 0;
var originalVideoHeight = 0;
var videoName = 'sample';
var basicVideoDirectory = '../video/';


function prepareApp(){
	videoArea = document.getElementById('videoArea');
	videoElement = document.createElement('video');
	videoArea.appendChild(videoElement);
	prepareVideoElement();
}

function prepareVideoElement(){
	displatVideoType = getBrowserSupportVideo(videoElement);
	if(displatVideoType == ''){
		Debugger.log('can not support video type.');
		return;
	}

	videoElement.setAttribute('src', basicVideoDirectory + videoName + '.' + displatVideoType);
	videoElement.setAttribute('style', 'display:none;');
	videoElement.setAttribute('controls', true);
	videoElement.setAttribute('loop', true);

	originalVideoWidth = videoElement.videoWidth;
	originalVideoHeight = videoElement.videoHeight;

	videoElement.addEventListener('canplaythrough', executeCanvasApp, false);
}

function executeCanvasApp(){
	var canvas = document.getElementById('video2');

	if(!canvas || !canvas.getContext){
		Debugger.log('Can not load canvas element!');
		return;
	}

	canvas.width = 800;
	canvas.height = 600;

	var context = canvas.getContext('2d');

	function drawScreen(){
		//### fill BG
		context.fillStyle = '#FFFFAA';
		context.fillRect(0, 0, canvas.width, canvas.height);

		//### draw Boundary
		context.fillStroke = '#000000';
		context.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);

		//### draw scene
		context.drawImage(videoElement, 
			canvas.width / 2 - videoElement.videoWidth / 2, canvas.height / 2 - videoElement.videoHeight / 2);

		describeVideo(context, videoElement);
	}

	function describeVideo(ctx, video){
		var ticks = ['duration', 'currentTime', 'loop', 'autoplay', 'muted', 'controls', 'volume'];
		ctx.fillStyle = '#000000';
		for(var i = 0; i < ticks.length; i++){
			var tick = ticks[i];
			var videoValue = videoElement.getAttribute(tick);
			//Debugger.log(tick + ' : ' + videoValue);
			//var message = tick + ' : ' + videoValue;
			var message = tick + ' : ' + eval("videoElement."+tick);
			//console.log(eval("videoElement."+tick));
			ctx.fillText(message, canvas.width / 2 - videoElement.videoWidth / 2 ,  canvas.height / 2 + videoElement.videoHeight / 2 + (10 * (i + 1)));
		}		
	}

	videoElement.play();
	//drawScreen();
	setInterval(drawScreen, 100);
}


function getBrowserSupportVideo(video){
	var extension = '';
	var supportedTypes = ['mp4', 'ogg', 'webm'];

	for(var i = 0; i < supportedTypes.length; i++){
		var type = supportedTypes[i];
		if(video.canPlayType('video/' + type) == 'probably' ||
			video.canPlayType('video/' + type) == 'maybe')
			extension = type;
	}
	if(extension == 'ogg') extension = 'ogv';
	return extension;
}