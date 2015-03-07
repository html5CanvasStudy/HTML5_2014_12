window.addEventListener('load', preparePuzzle, false);


var videoDiv;
var videoElement;

//In this function 
// - I will load video element to use 
function preparePuzzle(){
	prepareVideo();
	executeCanvas();
}

function prepareVideo(){
	Debugger.log('preparing video to display');
	videoDiv = document.createElement('div');
	videoElement = document.createElement('video');

	videoDiv.appendChild(videoElement);
	document.body.appendChild(videoDiv);

	videoDiv.setAttribute('style', 'display:none;');
	videoDiv.setAttribute('src', '../video/sample.' + getAbleVideoType(videoElement));
}

function getAbleVideoType(video){
	var returnVal = '';
	var types = ['webm', 'mp4', 'ogg'];
	for(var i = 0; i < types.length; i++){
		var curType = types[i];
		if(video.canPlayType('video/' + curType) == 'probably'
			|| video.canPlayType('video/' + curType) == 'maybe')
			returnVal = curType;
	}
	if(returnVal == 'ogg') returnVal = 'ogv';
	return returnVal;
}

//This Block has its own x,y and boolean variable to display itself.
//since x, y is index, I will not allow 0.
function Block(){
	this.x = 1;
	this.y = 1;
	this.display = false;
}

Block.prototype.initialize = function(col, row, display){
	this.x = col;
	this.y = row;
	this.display = display;
}


// All about Canvas element
function executeCanvas(){
	var canvas = document.getElementById('puzzle');

	if(!canvas || !canvas.getContext){
		Debugger.log('Can not execute this application. Your browser [' + navigator.userAgent + '] does not support HTML5 canvas.');
		alert('[' + navigator.userAgent + '] is not comportable with HTML5 canvas.');
		return;
	}

	canvas.width = 800;
	canvas.height = 600;

	var context = canvas.getContext('2d');

	//defining variables those we needed for puzzle
	var rows = 4;
	var cols = 4;
	//padding for space between blocks. 
	//6-10 has variables like xPad, yPad, xOffset, yOffset. 
	//However, I will use only padding variable for those uses.
	var padding = 10;

	for(var i = 0; i < cols; i++){
		for(var j = 0; j < rows; j++){
			var singleBlock = new Block();
		}
	}


	function drawPuzzle(){
		context.fillStyle = '#ff6644';
		context.fillRect(0, 0, canvas.width, canvas.height);

		context.strokeStyle = '#000000';
		context.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);
	}

	drawPuzzle();
}