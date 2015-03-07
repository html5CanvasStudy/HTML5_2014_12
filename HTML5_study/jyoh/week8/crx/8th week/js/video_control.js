window.addEventListener('load', prepareApp, false);

var videoDiv;
var videoElement;
var videoControlSheet;
var controlWidth = 32;

function prepareApp(){
	prepareVideo();
	loadSprite();
	// canplaythrough 대신 canplay 를 사용하면 
	// 비디오가 로드될 때까지 기다리지 않고, 로드된 만큼만이라도 플레이가 가능하다.
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

	var videoPath = '../video/sample.' + getAvailableExtension(videoElement);
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
	// ???
	//videoControlSheet.onload = itemLoaded;
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

	// playX/Y, pauseX/Y, stopX/Y 는 개별 스프라이트에 대한 캔버스 내 위치값이다.
	var videoXMargin = (canvas.width - videoElement.videoWidth) / 2;
	var videoYMargin = (canvas.height - videoElement.videoHeight) / 2;
	var btnMargin = controlWidth / 3;
	var pauseX = (canvas.width - controlWidth) / 2;
	var stopX = pauseX + controlWidth + btnMargin;
	var playX = pauseX - (controlWidth + btnMargin);
	// 어차피 버튼의 Y 좌표는 전부 동일함.
	var btnY = videoYMargin + videoElement.videoHeight + btnMargin;
	

	// canvas에 마우스 클릭 이벤트 주기 
	canvas.addEventListener('mouseup', eventMouseUp, false);


	function drawScreen(){
		context.fillStyle = '#FF6644';
		context.fillRect(0, 0, canvas.width, canvas.height);

		context.strokeStyle = '#000000';
		context.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);

		context.drawImage(videoElement, videoXMargin, videoYMargin);

		//버튼 처리 
		if(videoElement.paused){
			context.drawImage(videoControlSheet, 0, 0, controlWidth, controlWidth, playX, btnY, controlWidth, controlWidth);			
			if(videoElement.currentTime != 0){
				//일시 정지 눌림, 정지 안눌림.
				context.drawImage(videoControlSheet, controlWidth, controlWidth, controlWidth, controlWidth, pauseX, btnY, controlWidth, controlWidth);
				context.drawImage(videoControlSheet, controlWidth * 2, 0, controlWidth, controlWidth, stopX, btnY, controlWidth, controlWidth);
			}else{
				//일시 정지는 안눌림, 정지 눌림
				context.drawImage(videoControlSheet, controlWidth, 0, controlWidth, controlWidth, pauseX, btnY, controlWidth, controlWidth);
				context.drawImage(videoControlSheet, controlWidth * 2, 32, controlWidth, controlWidth, stopX, btnY, controlWidth, controlWidth);
			}
		} else {
			context.drawImage(videoControlSheet, 0, controlWidth, controlWidth, controlWidth, playX, btnY, controlWidth, controlWidth);		
			context.drawImage(videoControlSheet, controlWidth, 0, controlWidth, controlWidth, pauseX, btnY, controlWidth, controlWidth);	
			context.drawImage(videoControlSheet, controlWidth * 2, 0, controlWidth, controlWidth, stopX, btnY, controlWidth, controlWidth);
		}
	}

	// 이 펑션은 마우스 클릭이벤트를 처리하기 위한 펑션이지만,
	// 버튼의 좌표를 공유해야 하기 때문에 executeApp 안에 선언 
	function eventMouseUp(event){
		var mouseX;
		var mouseY;

		if(event.layerX || event.layerX == 0){ //FF
			mouseX = event.layerX;
			mouseY = event.layerY;
		} else if(event.offsetX || event.offsetX == 0){ //OP
			mouseX = event.offsetX;
			mouseY = event.offsetY;
		}

		// play 버튼 
		if((mouseY >= btnY) && (mouseY <= btnY + controlWidth) 
			&& (mouseX >= playX) && (mouseX <= playX + controlWidth)){
			if(videoElement.paused){
				videoElement.play();
			}
		}
		
		// stop 버튼 
		if((mouseY >= btnY) && (mouseY <= btnY + controlWidth)
			&& (mouseX >= stopX) && (mouseX <= stopX + controlWidth)){
			videoElement.pause();
			videoElement.currentTime = 0;
		}

		// pause 버튼 
		if((mouseY >= btnY) && (mouseY <= btnY + controlWidth)
			&& (mouseX >= pauseX) && (mouseX <= pauseX + controlWidth)){
			if(!videoElement.paused){
				videoElement.pause();
			}else{
				videoElement.play();
			}
		}
	}
	setInterval(drawScreen, 33);
}

