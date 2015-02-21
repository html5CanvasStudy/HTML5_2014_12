window.addEventListener('load', readyCanvasApp, false);

//Theese messages will never going to change
//Message Object has time, expression, x position, y position --> This concept is concrete

function Message () {
	this.time = 0;
	this.message = '';
	this.x = 0;
	this.y = 0;
}

Message.prototype.newInstance = function(time, message, x, y){
	this.time = time;
	this.message = message;
	this.x = x;
	this.y = y;
}

var messages;
var videoElement;
var videoDiv;
var originVideoWidth;
var originVideoHeight;
var marginHorizontal;
var marginVertical;

function readyCanvasApp(){
	prepareMessages();
	prepareVideo();
	executeCanvasApp();
}

//prepare video element and attributes
function prepareVideo(){
	videoDiv = document.createElement('div');
	videoElement = document.createElement('video');

	videoDiv.appendChild(videoElement);
	videoDiv.setAttribute('style','display: none;');
	document.body.appendChild(videoDiv);

	var type = getSupportVideoType(videoElement);

	//Not now... Since I play this app in readyCanvasApp function. 
	//--> What difference will be made call below function triggered by event or not?

	//videoElement.addEventListener('load', executeCanvasApp. false);
	//'canplaythrough' event does not seems to supported.
	//videoElement.addEventListener('canplaythrough', executeCanvasApp. false);

	//I can not initialize those originVideo* variables in some reasons.
	//originVideoWidth = videoElement.videoWidth;
	//originVideoHeight = videoElement.videoHeight;
	videoElement.setAttribute('src', '../video/sample.' + type);
}

function getSupportVideoType(video){
	var videoTypes = ['webm' , 'mp4', 'ogg'];
	var type = '';
	for(var i = 0; i < videoTypes.length; i++){
		if(able2Display(video, videoTypes[i]))
			type = videoTypes[i];
	}
	if(type == 'ogg') type = 'ogv';
	return type;
}

function able2Display(video, type){
	var returnVal = false;
	if(video.canPlayType('video/' + type) == 'probably'
		|| video.canPlayType('video/' + type) == 'maybe')
		returnVal = true;
	return returnVal;
}

// prepare Messages to display
function prepareMessages(){
	messages = new Array();
	var m1 = new Message();
	var m2 = new Message();

	m1.newInstance(4, 'first message', 90, 200);
	m2.newInstance(8, 'second message', 240, 240);

	//is chainning is possible on original javascript Object?
	//messages.push(m1).push(m2);
	messages.push(m1);
	messages.push(m2);
}

function executeCanvasApp(){

	var canvas = document.getElementById('videoMessage');

	if(!canvas || !canvas.getContext){
		Debugger.log(navigator.userAgent + ' seems that does not support HTML Canvas!');
	}

	canvas.width = 800;
	canvas.height = 600;
	var rotation = 0;
	var ratio = 2;
	var movement = -.1;

	var context = canvas.getContext('2d');

	function drawScreen(){
		//Even though I could not initialize those variables in (f)prepareVideo, 
		//videoElement.videoWith/videoHeight works in (f)drawScreen.
		//It might be an execute order issue. 
		marginHorizontal = (canvas.width - videoElement.videoWidth) / 2;
		marginVertical = (canvas.height - videoElement.videoHeight) / 2;

		context.fillStyle = '#FF6644';
		context.fillRect(0, 0, canvas.width, canvas.height);	

		context.strokeStyle = '#000000';
		context.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);

		Debugger.log(marginHorizontal);
		context.drawImage(videoElement, marginHorizontal, marginVertical);

		//Those X/Y positions are not based on video coordinates, 
		//those refers to canvas coordinates
		for(var i = 0; i < messages.length; i++){
			context.fillStyle = '#000000';
			context.font = 'bold 14px sans serif';
			context.fillText(messages[i].message, messages[i].x, messages[i].y);
		}
	}

	function drawRotate(){
		marginHorizontal = (canvas.width - videoElement.videoWidth) / 2;
		marginVertical = (canvas.height - videoElement.videoHeight) / 2;

		context.fillStyle = '#FF6644';
		context.fillRect(0, 0, canvas.width, canvas.height);	

		context.strokeStyle = '#000000';
		context.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);

		if(ratio < .1 || ratio > 2){
			movement *= -1;
		}

		//Begin rotation
		context.save();
			context.setTransform(1, 0, 0, 1, 0, 0);
			var radians = rotation * Math.PI / 180;
			//context.translate(marginHorizontal + videoElement.videoWidth / 2, marginVertical + videoElement.videoHeight / 2);
			context.translate(canvas.width / 2, canvas.height / 2);
			context.scale(ratio, ratio);
			context.rotate(radians);
			context.drawImage(videoElement, 0 - videoElement.videoWidth / 2, 0 - videoElement.videoHeight / 2);
		context.restore();
		rotation++;
		ratio += movement;
	}

	videoElement.play();
	setInterval(drawRotate, 30);
	//drawRotate();
	//setInterval(drawScreen, 30);
	//drawScreen();
}