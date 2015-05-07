window.addEventListener('load', prepare, false);

var resourcePath  = '../resources/';
var supportedFormat = '';

function prepare(){
	executeApp();
}


// Audio concern
//   Get Playable Audio Format
function getAudioFormat(audioTag) {
	var ret = '';
	var playableCondidates = ['ogg', 'mp3', 'wav'];

	for(var i = 0; i < playableCondidates.length; i++) {
		var single = playableCondidates[i];
		var testType = 'audio/' + single;
		if(audioTag.canPlayType(testType) == 'probably'
			|| audioTag.canPlayType(testType) == 'maybe') {
			ret = single;
			break;
		}
	}
	return ret;
}

// Execute Applications
function executeApp() {
	var canvas = document.getElementById('playground');

	//   Check Canvas availability
	if(!canvas || !canvas.getContext) {
		alert('Your browser [ ' + navigator.userAgent + ' ] is not comfortable to run this Application.');
		return;
	}

	//    constant variables for state (state-pattern?)
	const STATE_INIT = 10;
	const STATE_LOADING = 20;
	const STATE_RESET = 30;
	const STATE_PLAYING = 40;

	//    Local variables
	var gameState = STATE_INIT;
	var loadCount = 0;
	var itemsToLoad = 0;

	//      Game Objects
	var alienImage = new Image();
	var missileImage = new Image();
	var playerImage = new Image();

	//    Audio resource Management
	const SOUND_EXEPLODE = 'explode1';
	const SOUND_SHOOT = 'shoot1';
	//      Sound pool
	const MAX_SOUNDS = 6;
	var soundPool = new Array();
	var explodeSound;
	var explodeSound2;
	var explodeSound3;
	var shootSound;
	var shootSound2;
	var shootSound3;
	var audioType;

	//    Mouse Control Management
	var mouseX;
	var mouseY;
	// 사용자 위치 초기화 다시하기 - Dynamic 하게 
	var player = {x:250, y:475};
	var aliens = new Array();
	var missiles = new Array();

	const ALIEN_START_X = 25;
	const ALIEN_START_Y = 25;
	const ALIEN_ROWS = 5;
	const ALIEN_COLS = 8;
	const ALIEN_SPACING = 40;


	// Now code begins!
	canvas.width = 500;
	canvas.height = 500;

	var ctx = canvas.getContext('2d');

	// recursive?
	function itemLoaded(e) {
		loadCount++;
		if(loadCount >= itemsToLoad) {
			shootSound.removeEventListener('canplaythrough', itemLoaded, false);
			shootSound2.removeEventListener('canplaythrough', itemLoaded, false);
			shootSound3.removeEventListener('canplaythrough', itemLoaded, false);

			explodeSound.removeEventListener('canplaythrough', itemLoaded, false);
			explodeSound2.removeEventListener('canplaythrough', itemLoaded, false);
			explodeSound3.removeEventListener('canplaythrough', itemLoaded, false);

			soundPool.push({name:'explode1', element: explodeSound, played: false});
			soundPool.push({name:'explode1', element: explodeSound2, played: false});
			soundPool.push({name:'explode1', element: explodeSound3, played: false});

			soundPool.push({name:'shoot1', element: shootSound, played: false});
			soundPool.push({name:'shoot1', element: shootSound2, played: false});
			soundPool.push({name:'shoot1', element: shootSound3, played: false});

			gameState = STATE_RESET;
		}
	}

	// Initialize Game
	function initApp() {
		loadCount = 0;
		itemsToLoad = 9;

		explodeSound = getAudioTag('explode1');
		explodeSound2 = getAudioTag('explode1');
		explodeSound3 = getAudioTag('explode1');

		shootSound = getAudioTag('shoot1');
		shootSound2 = getAudioTag('shoot1');
		shootSound3 = getAudioTag('shoot1');

		alienImage = getImage('alien.png');
		playerImage = getImage('player.png');
		missileImage = getImage('missile.png');

		gameState = STATE_LOADING;
	}

	// Initialize Game_sub1
	function getAudioTag(fileName) {
		var tmpAudio = document.createElement('audio');
		if(supportedFormat == ''){
			supportedFormat = getAudioFormat(tmpAudio);
		}
		var src = resourcePath + 'audio/' + fileName + '.' + supportedFormat;
		tmpAudio.setAttribute('src', src);
		tmpAudio.addEventListener('canplaythrough', itemLoaded, false);
		document.body.appendChild(tmpAudio);
		return tmpAudio;
	}

	// Initialize Game_sub2
	function getImage(fileName) {
		var tmpImage = new Image();
		tmpImage.onload = itemLoaded;
		tmpImage.src = resourcePath + 'images/' + fileName;
		return tmpImage;
	}


	// Prepare Alien Object
	function startLevel() {
		for(var row = 0; row < ALIEN_ROWS; row++) {
			for(var col = 0; col < ALIEN_COLS; col++) {
				aliens.push({
					speed: 2
					, x: ALIEN_START_X + col * ALIEN_SPACING
					, y: ALIEN_START_Y + row * ALIEN_SPACING
					, width: alienImage.width
					, height: alienImage.height 
				});
			}
		}
	}

	function resetApp() {
		playSound(SOUND_EXEPLODE, 0);
		playSound(SOUND_SHOOT, 0);
		startLevel();
		gameState = STATE_PLAYING;
	}



	// CANVAS ACTIVITY

	function drawScreen() {

		// missile activity
		for(var i = 0; i < missiles.length; i++) {
			missiles[i].y -= missiles[i].speed;
			if(missiles[i].y < (0 - missiles[i].height)) {
				// why splice?
				missiles.splice(i, 1);
			}
		}


		// alien activity
		for(var i = aliens.length - 1; i >= 0; i--) {
			var singleAlien = aliens[i];
			singleAlien.x += singleAlien.speed;

			if(singleAlien.x > (canvas.width - singleAlien.width)
				|| singleAlien.x < 0) {
				singleAlien.speed *= -1;
				singleAlien.y += 20;
			}

			if(singleAlien.y > canvas.height) {
				aliens.splice(i, 1);
			}
		}

		// check collision
		// check colon sytax : like goto?
		missile : for(var i = missiles.length - 1; i >= 0; i--) {
			var tmpMissile = missiles[i];
			for(var j = aliens.length - 1; j >= 0; j--) {
				var tmpAlien = aliens[j];
				if(hit(tmpMissile, tmpAlien)) {
					playSound(SOUND_EXEPLODE, .5);
					missiles.splice(i, 1);
					aliens.splice(j, 1);
					break missile;
				}
			}
			if(aliens.length <= 0) {
				gameState = STATE_RESET;
			}
		}

		ctx.fillStyle = '#000000';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		ctx.fillStroke = '#EEEEEE';
		ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);

		// draw ship
		ctx.drawImage(playerImage, player.x, player.y);

		// draw missile
		for(var i = missiles.length - 1; i >= 0; i--) {
			var singleMissile = missiles[i];
			ctx.drawImage(missileImage, singleMissile.x, singleMissile.y);
		}

		// draw aliens
		for(var i = aliens.length - 1; i >= 0; i--) {
			var singleAlien = aliens[i];
			ctx.drawImage(alienImage, singleAlien.x, singleAlien.y);
		}

		// fillText
		ctx.fillStyle = '#FFFFFF';
		//   위치 다이나믹하게 변경 
		ctx.fillText('Active Sound count >> ' + soundPool.length, 200, 480);
	}


	// collision
	function hit(image1, image2) {
		var info1 = getImageInfo(image1);
		var info2 = getImageInfo(image2);
		var ret = false;
		if((info1.left > info2.right) 
			|| (info1.right < info2.left) 
			|| (info1.bottom < info2.top) 
			|| (info1.top > info2.bottom)) {
		} else {
			ret = true;
		}
		return ret;
	}

	// collision_sub
	function getImageInfo(image) {
		return {left: image.x, right: image.x + image.width, top: image.y, bottom: image.y + image.height};
	}

	//mouse event handler
	function eventMouseMove(e) {
		if(e.layerX || e.layerX == 0) { //FF 
			mouseX = e.layerX;
			mouseY = e.layerY;
		} else if (e.offsetX || e.offsetX == 0) { //Opera
			mouseX = e.offsetX;
			mouseY = e.offsetY;
		}
		player.x = mouseX;
		player.y = mouseY;
	}

	function eventMouseUp(e) {
		missiles.push({
			speed: 5
			, x: player.x + .5 * playerImage.width
			, y: player.y - missileImage.height
			, width: missileImage.width
			, height: missileImage.height
		});
		playSound(SOUND_SHOOT, .5);
	}

	// Sound Management
	function playSound(sound, vol) {
		var soundFound = false;
		var soundIdx = 0;
		var tmpSound;

		if(soundPool.length > 0) {
			while (!soundFound && soundIdx < soundPool.length) {
				var singleSound = soundPool[soundIdx];
				if((singleSound.element.ended || !singleSound.played) 
					|| singleSound.name == sound) {
					soundFound = true;
					singleSound.played = true;
				}else {
					soundIdx++;
				}
			}
		}

		if(soundFound) {
			tmpSound = soundPool[soundIdx].element;
			tmpSound.volume = vol;
			tmpSound.play();
		} else if (soundPool.length < MAX_SOUNDS) {
			tmpSound = document.createElement('audio');
			tmpSound.setAttribute('src', resourcePath + 'audio/' + sound + '.' + supportedFormat);
			tmpSound.volume = vol;
			tmpSound.play();
			soundPool.push({
				name: sound
				,element : tmpSound
				,type: supportedFormat
				,played: true
			});
		}
	}

	function run() {
		switch(gameState) {
			case STATE_INIT :
				initApp();
				break;
			case STATE_LOADING :
				break;
			case STATE_RESET :
				resetApp();
				break;
			case STATE_PLAYING :
				drawScreen();
				break;
		}
	}

	canvas.addEventListener('mouseup', eventMouseUp, false);
	canvas.addEventListener('mousemove', eventMouseMove, false);

	setInterval(run, 33);
}