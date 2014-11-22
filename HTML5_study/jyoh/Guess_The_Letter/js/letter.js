

window.addEventListener("load", eventWindowLoaded, false);
function eventWindowLoaded(){
	canvasApp();
}

function canvasApp(){
	// 게임의 시도 수 
	var guesses = 0;
	var message = "Guess The Letter From a (lower) to z (higher)";
	var letters = [];
	var date = new Date();
	var letterToGuess = "";
	var higherOrLower = "";
	var letterGuessed;
	var gameOver = false;

	//97 'a' 122 'z'
	//책 예제처럼 넣는 건 좀 귀찮아서..
	for(var i = 0; i < 26; i++){
		var member = String.fromCharCode(i + 97);
		letters[i] = member;
	}	

	Debugger.log('맨 뒤 값 >> ' +  letters[25]);

	var canvas = document.getElementById("canvas1");
	//유효성 검사 
	if(!canvas || !canvas.getContext){
		Debugger.log('Canvas load failed');
		return;
	}

	var context = canvas.getContext("2d");

	//초기화 
	initGame();

	function initGame(){
		//소수점 버림 - 배열 인덱스는 0 부터 시작하니까.
		var letterIndex = Math.floor(Math.random() * letters.length);
		

		letterToGuess = letters[letterIndex];
		Debugger.log('인덱스 : ' + letterIndex + ', 정답 : ' + letterToGuess);

		guesses = 0;
		letterGuessed = [];
		gameOver = false;

		//왜 윈도우 이벤트를 initGame() 안에서 호출하는지?
		window.addEventListener("keydown", eventKeyPressed, true);

		//이 펑션을 실행하면 현재 화면을 캡쳐해서 새로운 창으로 띄운다.
		var formElement = document.getElementById("createImageData");
		formElement.addEventListener("click", createImageDataPressed, false);

		drawScreen();
	}

	function eventKeyPressed(e){
		if(!gameOver){
			var letterPressed = String.fromCharCode(e.keyCode);
			//사용자가 대문자를 칠 수도 있으므로 일괄 소문자로 변환 
			letterPressed = letterPressed.toLowerCase();
			guesses ++;
			letterGuessed.push(letterPressed);

			Debugger.log('입력된 문자 :: ' + letterPressed);

			if (letterPressed == letterToGuess) {
				gameOver = true;
			} else {

				letterIndex = letters.indexOf(letterToGuess);
				//처음 등장한 지역 변수?
				guessIndex = letters.indexOf(letterPressed);

				if(guessIndex < 0) {
					higherOrLower = "That is not a letter";
				}else if(guessIndex > letterIndex){
					higherOrLower = "Lower";
				}else{
					higherOrLower = "Higher";
				}
			}
			drawScreen();
		}
	}

	function drawScreen(){

		//배경색 
		context.fillStyle = '#ffffaa';
		context.fillRect(0, 0, 500, 300);

		//경계
		context.strokeStyle = "#000000";
		context.strokeRect(5, 5, 490, 290);

		//문자열 정렬 위치
		//context.textBaseLine("top") 으로 하면 안되나?
		context.textBaseLine = "top";

		//날짜 출력 
		context.fillStyle = "#000000";
		context.font = "10px Sans-Serif";
		context.fillText (date, 150, 10);

		//메세지
		context.fillStyle = "#FF0000";
		context.font = "14px Sans-Serif";
		context.fillText(message, 125, 30); //추측한 알파벳 

		context.fillStyle = "#109910";
		context.font = "16px Sans-Serif";
		context.fillText("guesses: " + guesses, 215, 50);

		//High or Low
		context.fillStyle = "#000000";
		context.font = "16px Sans-Serif";
		context.fillText("Higher Or Lower : " + higherOrLower, 150, 125);

		//
		context.fillStyle = "#FF0000";
		context.font = "16px Sans-Serif";
		context.fillText("Letters Guessed : " + letterGuessed.toString(), 10, 260);

		if(gameOver){
			context.fillStyle = "#FF0000";
			context.font = "40px Sans-Serif";
			context.fillText("You got it!", 150, 180);		
		}

	}

	function createImageDataPressed (e) {
		window.open(canvas.toDataURL(), "canvasImage", "left=0, top=0, width=" + canvas.width + ", hight=" + canvas.height +", toolbar=0, resizable=0");
	}
}

//책에는 있지만 실제 예제에는 존재하지 않는 코드 


var Debugger = {};
Debugger.log = function(message){
	try{
		console.log(message);
	}catch(exception){
		return;
	}
};
