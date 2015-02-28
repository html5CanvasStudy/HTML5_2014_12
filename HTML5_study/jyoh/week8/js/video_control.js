window.addEventListener('load', prepareApp, false);

var videoDiv;
var videoElement;
var videoControlSheet;

function prepareApp(){
	prepareVideo();
	loadSprite();
	videoElement.addEventListener('canplaythrough', executeApp, false);
}

function prepareVideo(){

	Debugger.log('Preparing video.');
	videoDiv = document.createElement('div');
	videoElement = document.createElement('video');

	var videoType = getAvailableExtension(videoElement);
	if(videoType == '') {
		alert('This browse [' + navigator.userAgent + '] can not display any video types.');
		return;
	}

	var videoPath = '../video/sample.' + getAvailableExtension();
	videoElement.setAttribute('style', 'display:none;');
	videoElement.setAttribute('src', videoPath);

	videoDiv.appendChild(videoElement);
	document.body.appendChild(videoDiv);

	Debugger.log('Video element loaded.');
}

function getAvailableExtension(video){
	var typeArr = ['mp4', 'ogg', 'webm'];
	for(var i = 0; i < typeArr.length; i++){
		if(video.canPlayType('video/' + typeArr[i]) == 'probably'
			|| video.canPlayType('video/' + typeArr[i]) == 'maybe'){
			return typeArr[i];
		}
	}
	return '';
}

function loadSprite(){
	videoControlSheet = new Image();
	videoControlSheet.src = '../image/videocontrol.png';
}


function executeApp(){
	var canvas = document.getElementById('video_canvas');

	if(!canvas || !canvas.getContext){
		Debugger.log('Can not find canvas Element.');
		return;
	}

	canvas.width = 800;
	canvas.height = 600;

	var context = canvas.getContext('2d');

}