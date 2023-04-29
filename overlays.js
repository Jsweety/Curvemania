var speedrun = false;
var pbTrail = false;
var audio = true;
function fullScreen() {
    var isInFullScreen = (document.fullscreenElement && document.fullscreenElement !== null);
    if (!isInFullScreen) {
        if(document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        }
    }
    else {
        if(document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}
function playAudio() {
	if(audio) document.getElementById('audio').src = "images/audiono.png";
	else document.getElementById('audio').src = "images/audio.png";
	audio = !audio;
}
function speedrunMode() {
	if(speedrun) document.getElementById('speedrun').src = "images/speedrunno.png";
	else document.getElementById('speedrun').src = "images/speedrun.png";
	speedrun = !speedrun;
}
function trailShadow() {
	if(pbTrail) document.getElementById('trail').src = "images/trailno.png";
	else document.getElementById('trail').src = "images/trail.png";
	pbTrail = !pbTrail;
}
function friends() {
	if(document.getElementById('friend-select').style.display !== "block") {
		document.getElementById('friend-select').style.display = "block";
		document.getElementById('send-button').style.display = "block";
	}
	else {
		document.getElementById('friend-select').style.display = "none";
		document.getElementById('send-button').style.display = "none";
	}
}