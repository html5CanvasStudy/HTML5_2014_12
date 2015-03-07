//현재는 모든 브라우저(모바일 포함)에서 지원하는 형식이 없기 때문에
//.ogg, .mp4, .webm 을 모두 지원하는 코드를 작성

window.addEventListener('load', eventWindowLoaded, false);

var videoName = 'sample';

var sizeController;
var videoElement;
var loadingStatus;

//Canvas Video의 처리
var videoDiv;
var canvasVideo;
var canvasVideoElement;

function eventWindowLoaded() {

	sizeController = document.getElementById('videoSize');
	videoElement = document.getElementById('jsvideo');
	loadingStatus = document.getElementById('loadingStatus'); 

	prepareElements();


	//video 넓이와 높이는 videoWith, videoHeight 로 정의되어 있음.
	var originalVideoWidth = videoElement.videoWidth;

	//하단 슬라이드바 최초값 설정. 비디오 소스 원본의 너비 
	sizeController.value = originalVideoWidth;

	//이벤트 추가
	sizeController.addEventListener('change', videoSizeChanged, false);

	//이하부터는 preloading 
	//정상 작동하지 않
	videoElement.addEventListener('progress', updateLoadingStatus, false);
	videoElement.addEventListener('canplaythrough', playVideo, false);
	playVideo();
}


function videoSizeChanged(e){
	var target = e.target;
	videoElement.width = target.value;
	videoElement.videoHeight = (videoElement.height * target.value) / videoElement.width;
	//너비에 따라 자동반응하도록 auto를 값으로 할당해 보았으나 안됨.
	//videoElement.height = 'auto';
}


function updateLoadingStatus(){
	console.log('upd');
	var percentStr = (videoElement.buffered.end(0) / videoElement.duration) * 100;
	var percentage = parseInt(percentStr);
	loadingStatus.innerHTML = percentage + '%';
}

function playVideo(){
	videoElement.play();
}

//6-6 예제
function prepareElements(){

	//캔버스 안에 비디오를 넣는다.
	canvasVideoElement = document.createElement('video');
	videoDiv = document.createElement('div');
	document.getElementById('canvasVideoArea').appendChild(videoDiv);
	videoDiv.appendChild(canvasVideoElement);
	videoDiv.setAttribute('style', 'display:none;');

	//지원 비디오 타입 확인 
	var videoType = getSupportedVideoType(canvasVideoElement);
	if(videoType == ''){
		Debugger.log('This Browser can not support video');
		return;
	}
	Debugger.log('display video type >> ' + videoType);

	canvasVideoElement.setAttribute('src', '../video/' + videoName + '.' + videoType);
	canvasVideoElement.addEventListener('canplaythrough', videoloaded, false);

	canvasVideo = document.getElementById('canvasVideo');
	document.body.appendChild(videoDiv);
}

function getSupportedVideoType(video) {
	var types = ['webm', 'mp4', 'ogg'];
	var returnVal = '';

	for(var i = 0; i < types.length; i++){
		var type = types[i];
		if(video.canPlayType('video/' + type) == 'probably' || 
			video.canPlayType('video/' + type) == 'maybe'){
			returnVal = type;
		}		
	}
	if(returnVal == 'ogg') returnVal = 'ogv';
	return returnVal;
}

function videoloaded(){
	executeCanvasApp();
}

function executeCanvasApp(){
	var canvas = document.getElementById('video1');

	if(!canvas || !canvas.getContext){
		Debugger.log('can not support canvas');
		return;
	}

	canvas.width = 600;
	canvas.height = 400;

	var context = canvas.getContext('2d');

	function drawScreen(){
		context.fillStyle = '#FFFFAA';
		context.fillRect(0, 0, canvas.width, canvas.height);

		context.fillStroke = '#000000';
		context.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);

		context.drawImage(canvasVideoElement, canvas.width / 2 - canvasVideoElement.videoWidth / 2, canvas.height / 2 - canvasVideoElement.videoHeight / 2, 
			canvasVideoElement.videoWidth, canvasVideoElement.videoHeight);
	}

	canvasVideoElement.play();
	setInterval(drawScreen, 33);
}