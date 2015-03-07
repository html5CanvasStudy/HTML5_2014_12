window.addEventListener('load', prepareApp, false);

var videoDiv;
var videoElement;
var videoPath = '../video/sample.';

function prepareApp(){
	prepareVideo();
	videoElement.addEventListener('canplay', executeApp, false);
}

function prepareVideo(){
	var availableVideoType;
	videoDiv = document.createElement('div');
	videoElement = document.createElement('video');
	availableVideoType = getVideoType(videoElement);
	if(availableVideoType == ''){
		Debugger.log('Browser [' + navigator.userAgent + '] can not play any video format.');
	}

	videoElement.setAttribute('style', 'display:none;');
	//videoElement.setAttribute('src', videoPath + availableVideoType);
	videoElement.src = videoPath + availableVideoType;

	videoDiv.appendChild(videoElement);
	document.body.appendChild(videoDiv);
}

function getVideoType(video){
	var typeList = ['mp4', 'webm', 'ogg'];
	for(var i = 0; i < typeList.length; i++){
		var type = typeList[i];
		if(video.canPlayType('video/' + type) == 'probably'
			|| video.canPlayType('video/' + type) == 'maybe') {
			if(type == 'ogg') type = 'ogv';
			return type;
		}
	}
	return '';
}

function executeApp(){
	var canvas = document.getElementById('anim_video');

	if(!canvas || !canvas.getContext){
		Debugger.log('Can not find HTML5 Canvas Object.');
		return;
	}

	canvas.width = 800;
	canvas.height = 600;

	var videoPaddingHorizontal = (canvas.width - videoElement.videowidth) / 2;
	var videoPaddingVertical = (canvas.height - videoElement.videoHeight) / 2;

	// video 객체들 
	var videos = new Array();
	var maxVideoCnt = 12;

	// 배열에 밀어 넣기 
	for(var i = 0; i < maxVideoCnt; i++){
		var singleVideo = new Video();
		var tmpAngle = Math.floor(Math.random() * 360);
		// tmpRadians 변수는 xUnits 와 yUnits 를 구하는데에만 사용됨.
		var tmpRadians = tmpAngle * Math.PI / 180;
		var tmpXUnits = Math.cos(tmpRadians) * 5;
		var tmpYUnits = Math.sin(tmpRadians) * 5;

		// videoWidth 나 videoHeight 를 조정하면 비디오의 사이즈 때문에 너무 크게 나오는 것을 방지할 수 있음.
		singleVideo.initialize(0, 0, videoElement.videoWidth/5, videoElement.videoHeight/5,
			5, tmpAngle, tmpRadians, tmpXUnits, tmpYUnits);
		videos.push(singleVideo);
	}


	var context = canvas.getContext('2d');

	function drawScreen(){
		context.fillStyle = '#FF6644';
		context.fillRect(0, 0, canvas.width, canvas.height);

		context.strokeStyle = '#000000';
		context.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);

		for(var i = 0; i < maxVideoCnt; i++){
			var single = videos[i];
			Debugger.log(single);
			single.x += single.xUnits;
			single.y += single.yUnits;
			context.drawImage(videoElement, single.x, single.y, single.width, single.height);

			if(single.x > canvas.width - single.width
				|| single.x < 0){
				single.angle = 180 - single.angle;
				single.updateVideo();
			} else if (single.y > canvas.height - single.height
				|| single.y < 0){
				single.angle = 360 - single.angle;
				single.updateVideo();
			}
			//else if 로 연결되면 안되지 않나요? else if --> if 로 변경하였음.

			/*
			if(single.y > canvas.height - single.height
				|| single.y < 0){
				single.angle = 360 - single.angle;
				single.updateVideo();
			}
			*/
			Debugger.log('=====================');
			Debugger.log(single);
		}
	} 

	videoElement.play();
	setInterval(drawScreen, 33);
	//drawScreen();
}