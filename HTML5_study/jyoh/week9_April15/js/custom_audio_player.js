window.addEventListener('load', preparePostJob, false);

var audioTag;
var audiofilePath;
var audiofileName;

function preparePostJob () {
  audiofilePath = '../resources/audio/';
  audiofileName = 'wiki';
  audioTag = document.createElement('audio');
  var accessibleType = fetchAvailableAudio();

  if(accessibleType == null 
     || typeof accessibleType == 'undefined' 
     || accessibleType.trim() == '') {
    return;
  }

  audioTag.setAttribute('src', audiofilePath + audiofileName + accessibleType);
}

function fetchAvailableAudio(){
  var supportable = ['ogg', 'mp3', 'wav'];
  var ret = '';

  for(var i = 0; i < supportable.length; i++){
    var singleType = supportable[i];
    if(audioTag.canPlayType('audio/' + singleType) == 'probably' 
       || audioTag.canPlayType('audio/' + singleType) == 'maybe') {
      ret = singleType;
    }
  }
  return ret;
}
