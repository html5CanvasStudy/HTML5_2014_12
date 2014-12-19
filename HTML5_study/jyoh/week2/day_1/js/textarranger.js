window.addEventListener('load', readyCanvasApp, false);

function readyCanvasApp(){
	runCanvasApplication();
}

function runCanvasApplication(){
	var message = 'This is Canvas Application';
	var paintType = 'fill';
	var styleType = 'normal';
	var weightType = 'normal';
	var fontType = 'serif';
	var fontSize = '30';
	var fontColor = '#000000';
	var textBaseline = 'middle';
	var textAlign = 'center';
	var textAlpha = 1.0;

	//toDataURL
	var imageFormat = 'jpg';
	var compLevel = 1.0;

	
	//Debugger.log(message);

	var canvas = document.getElementById('canvas1');
	var ctx = canvas.getContext('2d');


	if(!canvas || !canvas.getContext){
		return;
	}

	//예제에서는 formElemebt 변수를 계속해서 재사용하는데 이유를 모르겠음
	var form = document.getElementById('text');
	Debugger.log(form);

	form.addEventListener('keyup', textChanged, false);

	form = document.getElementById('fillorstroke');
	form.addEventListener('change', paintTypeChanged, false);
	//Debugger.log(form);

	//onchange 이벤트 등록 
	document.getElementById('fontStyle').addEventListener('change', styleChange, false);
	document.getElementById('fontWeight').addEventListener('change', weightChange, false);
	document.getElementById('textFont').addEventListener('change', fontChange, false);
	document.getElementById('textSize').addEventListener('change', sizeChange, false);
	document.getElementById('textColor').addEventListener('change', colorChange, false);
	document.getElementById('textBaseline').addEventListener('change', baselineChange, false);
	document.getElementById('textAlign').addEventListener('change', alignChange, false);
	document.getElementById('textAlpha').addEventListener('change', alphaChange, false);
	document.getElementById('canvasWidth').addEventListener('change', canvasWidthChange, false);
	document.getElementById('canvasHeight').addEventListener('change', canvasHeightChange, false);
	document.getElementById('canvasStyleWidth').addEventListener('change', canvasStyleChange, false);
	document.getElementById('canvasStyleHeight').addEventListener('change', canvasStyleChange, false);

	//toDataURL
	document.getElementById('imageFormat').addEventListener('change', imageFormatChange, false);
	document.getElementById('compLevel').addEventListener('change', compLevelChange, false);

	document.getElementById('dataGenerateBtn').addEventListener('click', generateImage, false);




	Debugger.log(textBaseline);
	Debugger.log(textAlign);

	drawScreen();

	function drawScreen(){

		ctx.fillStyle = '#ffffaa';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		ctx.strokeStyle = '#000000';
		ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);

		//문자열 세로정렬 
		ctx.textBaseline = textBaseline;

		//문자열 가로정렬 
		ctx.textAlign = textAlign;

		//문자열 투명도
		ctx.globalAlpha = textAlpha;

		//[font style] [font weight] [font size] [font face]
		//ctx.font = '50px serif';
		//ctx.font = 'normal lighter 50px cursive';
		ctx.font = styleType + ' ' + weightType + ' ' 
			+ fontSize  + 'px ' + fontType;

		var matrics = ctx.measureText(message);
		var textWidth = matrics.width;
		//var xPosition = (canvas.width / 2) - (textWidth.width / 2);
		var xPosition = (canvas.width / 2);
		var yPosition = (canvas.height / 2);

		switch(paintType){
			case 'fill' :
				ctx.fillStyle = fontColor;
				ctx.fillText(message, xPosition, yPosition);
				break;
			case 'stroke' :
				ctx.strokeStyle = fontColor;
				ctx.strokeText(message, xPosition, yPosition);
				break;
			case 'both' :
				ctx.fillStyle = fontColor;
				ctx.fillText(message, xPosition, yPosition);
				ctx.strokeStyle = '#FF0000';
				ctx.strokeText(message, xPosition, yPosition);
				break;
		} 
	}

	function textChanged(e){
		var target = e.target;
		message = target.value;
		drawScreen();
	}

	function paintTypeChanged(e){
		var target = e.target;
		paintType = target.value;
		drawScreen();
	}

	function styleChange(e){
		var target = e.target;
		styleType = target.value;
		drawScreen();
	}

	function weightChange(e){
		var target = e.target;
		weightType = target.value;
		drawScreen();
	}

	function fontChange(e){
		var target = e.target;
		fontType = target.value;
		drawScreen();
	}

	function sizeChange(e){
		var target = e.target;
		fontSize = target.value;
		drawScreen();
	}

	function colorChange(e){
		var target = e.target;
		fontColor = '#' + target.value;
		drawScreen();		
	}

	function alignChange(e){
		textAlign = e.target.value;
		drawScreen();
	}

	function baselineChange(e){
		textBaseline = e.target.value;
		drawScreen();
	}

	function alphaChange(e){
		textAlpha = e.target.value;
		drawScreen();
	}

	function canvasWidthChange(e){
		canvas.width = e.target.value;
		drawScreen();
	}

	function canvasHeightChange(e){
		canvas.height = e.target.value;
		drawScreen();
	}

	function canvasStyleChange(e){
		canvas.setAttribute('style', 
			'width:' + document.getElementById('canvasStyleWidth').value + 'px;'
			+ 'height:' + document.getElementById('canvasStyleHeight').value + 'px;');
		drawScreen();
	}

	function imageFormatChange(e){
		var format = e.target.value;
		if(format == 'jpg'){
			//activate compLevel
			document.getElementById('compLevel').removeAttribute('disabled');
		}else{
			document.getElementById('compLevel').setAttribute('disabled', 'disabled');
		}
		imageFormat = format;
	}

	function compLevelChange(e){
		compLevel = e.target.value;
	}

	function generateImage(){
		var target = document.getElementById('imageDisplay');
		console.log(imageFormat);
		if(imageFormat == 'jpg'){
			console.log(compLevel);
			//책에는 image/jpg 라고 되어있지만, jpeg 만 적용됨. jpg 로 진행할 경우 자동으로 png로 변환됨 
			//모든 MIME 을 지원하는 것 같지는 않음 
			//http://stackoverflow.com/questions/14383557/setting-canvas-todataurl-jpg-quality
			target.value = canvas.toDataURL('image/jpeg', compLevel);
		}else if(imageFormat == 'png'){
			target.value = canvas.toDataURL();
		}

		window.open(target.value, 'canvasImage', 
			'left=0, top=0, width=' + canvas.width 
			+ ', height=' + canvas.height + ', toolbar=0, resizable=0');
	}
}

/*
1.0 에서 2.0 예제로 가면서 슬라이드에 대한 반응이 부드러워진다고 하는데 뭐가 부드러워지는 건지 모르겠음.
알파값 조절 시 0.0 으로 슬라이드 바를 밀어도 문자열이 보이는 경우가 종종 발생
*/