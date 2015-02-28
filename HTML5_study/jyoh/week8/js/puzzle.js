window.addEventListener('load', prepareApp, false);

var videoDiv;
var videoElement;
var videoPath;

function prepareApp(){
	prepareVideo();
	videoElement.addEventListener('canplaythrough', executeApp, false);
}

function prepareVideo(){
	Debugger.log('Application is preparing video...');
	videoDiv = document.createElement('div');
	videoElement = document.createElement('video');

	var extension = getAvailableExtension(videoElement);
	if(extension == '') { Debugger.log('This browser [' + navigator.userAgent + '] can not play any video Type.'); return; }
	videoPath = '../video/sample.' + getAvailableExtension(videoElement);

	videoElement.setAttribute('style', 'display: none;');
	videoElement.setAttribute('src', videoPath);

	videoDiv.appendChild(videoElement);
	document.body.appendChild(videoDiv);

	//이거 안됨.
	//Debugger.log('Video Width >> ' + videoElement.videoWidth);
	//Debugger.log('Video Height >> ' + videoElement.videoHeight);

	//undefined
	//Debugger.log('Video Width >> ' + videoDiv.width);
	//Debugger.log('Video Height >> ' + videoDiv.height);
	Debugger.log('Video setting is done.');
}

function getAvailableExtension(video){
	var videoTypes = ['mp4', 'ogg', 'webm'];
	for(var i = 0; videoTypes.length; i++){
		var curType = videoTypes[i];
		if(video.canPlayType('video/' + curType) == 'propably'
			|| video.canPlayType('video/' + curType) == 'maybe'){
			Debugger.log(navigator.userAgent + ' video element support video type [' + curType + '].');
			return curType;
		}
	}
	return '';
}

//rnadomize tiles
function randomizeBoard(board){

	Debugger.log('Shuffling board...');

	var newBoard = new Array();
	var cols = board.length;
	var rows = board[0].length;

	for(var i = 0; i < cols; i++){
		newBoard[i] = new Array();
		for(var j = 0; j < rows; j++){

			var found = false;
			var randCol = 0;
			var randRow = 0;
			while(!found){
				Debugger.log('infinite loop?');
				//random 에 cols 와 rows 를 삽입하는 것은 무슨 의미인지.
				randCol = Math.floor(Math.random() * cols);
				randRow = Math.floor(Math.random() * rows);

				if(board[randCol][randRow] != false){
					found = true;
				}
			}

			newBoard[i][j] = board[randCol][randRow];
			board[randCol][randRow] = false;
		}
	}

	Debugger.log('Suffling is done.');
	return newBoard;
}


function executeApp(){
	Debugger.log('Puzzle Application is running...');

	var canvas = document.getElementById('puzzle');

	if(!canvas || !canvas.getContext){
		Debugger.log('can not find canvas element.');
		alert(navigator.userAgent + ' is not support Canvas application.');
		return;
	}

	canvas.width = 800;
	canvas.height = 600;

	var context = canvas.getContext('2d');

	//================================ Video Attributes definition

	var rows = 4;
	var cols = 4;
	var padding = 10;
	var blockWidth = videoElement.videoWidth / cols;
	var blockHeight = videoElement.videoHeight / rows;

	Debugger.log('cols & rows >> ' + cols + ' x ' + rows);
	Debugger.log('block padding >> ' + padding);
	Debugger.log('single block size >> ' + blockWidth + ' x ' + blockHeight);

	var board = new Array();

	for(var i = 0; i < cols; i++){
		board[i] = new Array();
		for(var j = 0; j < rows; j++){
			board[i][j] = { finalCol : i, finalRow : j, selected : false };
		}
	}

	board = randomizeBoard(board);

	//================================ Video definition ends



	//================================ Mouse Event Handling

	function eventMouseUp(event){
		var mouseX;
		var mouseY;
		var posX;
		var posY;
		var x; 
		var y;

		if(event.pageX || event.pageY){
			x = event.pageX;
			y = event.pageY;
		}else{
			//왜 두번이나 계산하는지 알아볼 필요가 있음.
			x = event.clientX + document.body.scrollLeft + document.body.scrollLeft;
			y = event.clientY + document.body.scrollTop + document.scrollTop;
		}

		//canvas 의 offsetLeft 와 offsetTop 에 대한 조사가 필요.
		x -= canvas.offsetLeft;
		y -= canvas.offsetTop;

		mouseX = x; mouseY = y;

		var selectedList = new Array();
		for(var c = 0;  c < cols; c++){
			for(var r = 0; r < rows; r++){
				posX = c * (padding + blockWidth) + padding;
				posY = r * (padding + blockHeight) + padding;

				//마우스 좌표가 현재 블럭 안에 있을 때, 선택된 블럭이라면 미선택 상태로,
				//반대도 작동.
				if((mouseY >= posY) && (mouseY <= posY + blockHeight)
					&& (mouseX >= posX) && (mouseX <= posX + blockWidth)){
					board[c][r].selected = (board[c][r].selected) ? false : true;
				}
				//선택된 항목들을 담는다. 이 때 리스트에 담기는 오브젝트는 위치 정보만 가지고 있음.
				//차라리 board 객체를 담는 건 어떠한가...
				if(board[c][r].selected) selectedList.push({col : c , row : r});
			}
		}

		Debugger.log(selectedList);		 

		//선택된 항목의 수량을 파악한다.
		// == : 벨류 
		// === : 타입이랑 벨류
		if(selectedList.length == 2){
			Debugger.log('Switching...');
			var selected1 = selectedList[0];
			var selected2 = selectedList[1];

			//두 객체의 값을 교환 
			var tmpPiece = board[selected1.col][selected1.row];
			board[selected1.col][selected1.row] =  board[selected2.col][selected2.row];
	        board[selected2.col][selected2.row] = tmpPiece;
	        board[selected1.col][selected1.row].selected = false;
	        board[selected2.col][selected2.row].selected = false;
		}

	}


	//================================ Mouse Event Handling Ends


	function drawScreen(){
		context.fillStyle = '#FF6644';
		context.fillRect(0, 0, canvas.width, canvas.height);

		context.strokeStyle = '#000000';
		context.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);

		//put videos in
		for(var c = 0; c < cols; c++){
			for(var r = 0; r < rows; r++){
				var tmpPiece = board[c][r];

				var imageX = tmpPiece.finalCol * blockWidth;
				var imageY = tmpPiece.finalRow * blockHeight;
				var posX = c * (blockWidth + padding) + padding;
				var posY = r * (blockHeight + padding) + padding;

				context.drawImage(videoElement, imageX, imageY, blockWidth, blockHeight
					, posX, posY, blockWidth, blockHeight);

				if(tmpPiece.selected){
					context.strokeStyle = '#00FF00';
					context.strokeRect(posX, posY, blockWidth, blockHeight);
				}
			}
		}
	}

	videoElement.play();
	//click 과 mouseup의 차이는?
	canvas.addEventListener('mouseup', eventMouseUp, false);
	setInterval(drawScreen, 50);
}

/*
- Video 라는 요소가 메모리에 로드되는 시점을 알아볼 필요가 있음.
  아래는 실험으로 검증된 사실임.

- setAttribute 에 src 를 넣는 시점에는 Video 의 정보를 받아올 수 없음.
- canplaythrough 가 호출된 시점 이후에는 Video 의 정보를 받아올 수 있음.

*/