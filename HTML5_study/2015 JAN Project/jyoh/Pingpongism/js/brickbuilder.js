function Options (width, height, mass) {
	this.brickWidth = width;
	this.brickHeight = height;
	this.brickMass = mass;
}

function Brick () {
	this.x = 0;
	this.y = 0;
	this.width = 0;
	this.height = 0;
	this.color = '';
	this.mass = 0;
	this.exist = true;
}

function StageBuilder (hasBorder, color) {
	this.hasBorder = hasBorder;
	this.borderColor = (color == null || color.trim() == '') ? getRandColor() : color;
	this.bricks = new Array();
}

StageBuilder.prototype.buildRandomBricks = function(brickStartX, brickStartY, totalWidth, totalHeight, options){
	//options 에는 개별 블럭의 스펙이 들어감
	//brickWidth, brickHeight, brickMass

	//col 은 열 , row 는 행 

	console.log(brickStartX + ', ' + brickStartY + ', ' + totalWidth + ', ' + totalHeight);

	if((totalWidth - brickStartX) < 0 || (totalHeight - brickStartY) < 0){
		console.log('wrong parameter. please, check start point X, start point Y, max Width, max Height.');
	}

	var maxColCnt = (totalWidth - brickStartX)/options.brickWidth;
	var maxRowCnt = (totalHeight - brickStartY)/options.brickHeight;

	//maxRowBricks 를 기준으로 랜덤하게 행마다 세로의 개수를 잡는다.
	//가로로 가다가 이빨빠진 줄을 어떻게 구현할지
	console.log('maximum rows >> ' + maxRowCnt);
	console.log('maximum cols >> ' + maxColCnt);

	for(var i = 0; i < maxRowCnt; i++){

		//현재까지 그린 벽돌의 수이며 이 수가 찰 때까지 가로 열은 돌아야 함 
		var drawCnt = 0;
		var curCol = 0;		

		//현재 줄에 몇개의 블럭을 그릴 것인지 
		var currentRowBlockCnt = getRand(maxColCnt, 1);
		console.log('current row >> ' + i + ', I will draw ' + currentRowBlockCnt + ' columns in this row');

		while(drawCnt < currentRowBlockCnt){
			if(curCol > maxColCnt) curCol = 0;
			var tmpBrick = new Brick();						
			tmpBrick.x = brickStartX + options.brickWidth * curCol;
			tmpBrick.y = brickStartY + options.brickHeight * i;
			tmpBrick.width = options.brickWidth;
			tmpBrick.height = options.brickHeight;
			tmpBrick.mass = options.brickMass;
			var result = getRand(2, 0) % 2;
			var isEmpty = (result == 0) ? true : false;	

			if(isEmpty){
				tmpBrick.exist = false;
			}else{
				tmpBrick.color = '#' + getRandColor();
				drawCnt++;
			}
			this.bricks.push(tmpBrick);
			if(drawCnt > currentRowBlockCnt) {
				break;
			}
			curCol++;		
		}
	}
}

StageBuilder.prototype.drawBricks = function(ctx){
	if(ctx == null || typeof ctx == 'undefined'){
		console.log('unexpected parameter >> ' + ctx);
		return;
	}

	for(var i = 0; i < this.bricks.length; i++){
		var tmpBrick = this.bricks[i];
		if(tmpBrick.exist){
			ctx.fillStyle = tmpBrick.color;
			ctx.fillRect(tmpBrick.x, tmpBrick.y, tmpBrick.width, tmpBrick.height);
			//테두리를 그려라 
			if(this.hasBorder){
				ctx.strokeStyle = this.borderColor;
				ctx.strokeRect(tmpBrick.x + 1, tmpBrick.y + 1, tmpBrick.width - 2, tmpBrick.height - 2);
			}
		}
	}
}

function getRand(max, min){
	return Math.floor(Math.random() * (max - min)) + min;
}

function getRandColor(){
	var r = getRand(256, 0);
	var g = getRand(256, 0);
	var b = getRand(256, 0);
	return r.toString(16) + g.toString(16) + b.toString(16);
}
