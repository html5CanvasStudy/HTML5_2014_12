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
	var fontSize = '50';
	var fontColor = '#000000';
	
	Debugger.log(message);

	var canvas = document.getElementById('canvas1');
	var ctx = canvas.getContext('2d');

	if(!canvas || !canvas.getContext){
		return;
	}

	var form = document.getElementById('text');
	Debugger.log(form);

	form.addEventListener('keyup', textChanged, false);

	form = document.getElementById('fillorstroke');
	form.addEventListener('change', paintTypeChanged, false);
	Debugger.log(form);


	var fstyle = document.getElementById('fontStyle');
	var fweight = document.getElementById('fontWeight');
	var tfont = document.getElementById('textFont');
	var tSize = document.getElementById('textSize');


	fstyle.addEventListener('change', styleChange, false);
	fweight.addEventListener('change', weightChange, false);
	tfont.addEventListener('change', fontChange, false);
	tSize.addEventListener('change', sizeChange, false);


	drawScreen();

	function drawScreen(){
		ctx.fillStyle = '#ffffaa';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		ctx.strokeStyle = '#000000';
		ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);

		//[font style] [font weight] [font size] [font face]
		//ctx.font = '50px serif';
		//ctx.font = 'normal lighter 50px cursive';
		ctx.font = styleType + ' ' + weightType + ' ' 
			+ fontSize  + 'px ' + fontType;

		var matrics = ctx.measureText(message);
		var textWidth = matrics.width;
		var xPosition = (canvas.width / 2) - (canvas.width / 2);
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

	function textFillColorChanged(e){
		var target = e.target;
		fontColor = '#' + target.value;
		drawScreen();
	}
}