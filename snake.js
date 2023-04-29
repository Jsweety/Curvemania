var canvas,ctx;
var width,height;
var left,right;
var player = {x:0,y:0,size:8};
var angle = 0;
var rx = 0,ry = 0;
var trail = [], trailLength, trailSplit, iStart;
var start = true,dead = false;
var fps = 100,fpsInterval,startTime,now,then,elapsed;
var cookies,cookie,playerCookie,patternsCookie,extrasCookie,colorsCookie,splitNumber;
var colors = ["red","blue","purple","green","cyan","orange","yellow","pink","white"];
var shape = ["square","round"],gap = [14,20,28,36],shadow = [0,10];
var audioCollision = new Audio('sound/collision.wav');
var audioCoin = new Audio('sound/coin.wav');
var snakeX=snakeY=200,snakeScore = 0;
var snakeHighscore = localStorage.getItem('snakeHighscore') != null ? parseInt(localStorage.getItem('snakeHighscore')) : "0";

window.onload = function() {
	document.getElementById('snake-highscore').innerHTML = "Highscore: " + snakeHighscore;
    cookies();
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    ctx.width = "900";
    width = ctx.width;
    ctx.height = "600";
    height = ctx.height;
    ctx.strokeStyle = "white";
    ctx.lineJoin='round'; 
    ctx.lineWidth = 4;
    ctx.fillStyle = "white";
    ctx.font = "bold 45px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    startDrawing(fps);
}
function cookies() {
    cookies = document.cookie.replace(/\s+/g, '');
    cookie = cookies.split(/[=;]/);
    playerCookie = cookie[cookie.indexOf("player")+1];
    patternsCookie = cookie[cookie.indexOf("patterns")+1];
    extrasCookie = cookie[cookie.indexOf("extras")+1];
    colorsCookie = cookie[cookie.indexOf("colors")+1];
    splitNumber = parseInt(playerCookie[0]);
}
function startDrawing(fps) {
    fpsInterval = 1000 / fps;
    then = window.performance.now();
    startTime = then;
    draw();
}
function draw(newtime) {
    if(checkConditions()) {
        now = newtime;
        elapsed = now - then;
        if (elapsed > fpsInterval) {
            then = now - (elapsed % fpsInterval);
            ctx.clearRect(0,0,width,height);
            startPosition();
            newPosition();
            drawTrail();
			drawCoin();
			checkCoinCollision();
			checkTrailCollision();
            checkCollision();
        }
    }
    requestAnimationFrame(draw);
}
function startPosition() {
    if(start) {
        player.x = 8;
        player.y = 200;
        start = false;
    }
}
function newPosition() {
    if(left) angle -= Math.acos(0.99875);
    if(right) angle += Math.acos(0.99875);
    rx = 2*Math.cos(angle);
    ry = 2*Math.sin(angle);
    player.x += rx;
    player.y += ry;
}
function drawTrail() {
    trail.unshift(player.y);
    trail.unshift(player.x);
    ctx.save();
    ctx.lineWidth = player.size;
    ctx.lineCap = shape[playerCookie[2]];
    ctx.shadowBlur = shadow[playerCookie[3]];
    ctx.shadowColor = colors[playerCookie[4]];
    ctx.strokeStyle = colors[playerCookie[4]];
    ctx.beginPath();
    ctx.moveTo(trail[0],trail[1]);
    for (var i=2;i<128+snakeScore*20;i+=2) {
        ctx.lineTo(trail[i],trail[i+1]);
    }
    ctx.stroke();
    ctx.restore();
}
function drawCoin() {
	ctx.save(); ctx.strokeStyle="yellow"; ctx.fillStyle = "yellow";
	ctx.beginPath();ctx.arc(snakeX,snakeY,4,0,2*Math.PI);ctx.stroke();ctx.fill();
	ctx.restore();
}
function checkCoinCollision() {
	if(isPointInStroke()) {
		snakeScore++;
		document.getElementById('snake-score').innerHTML = "Score: " + snakeScore;
		do {
			snakeX = Math.floor(Math.random()*(394-6+1)+6);
			snakeY = Math.floor(Math.random()*(394-6+1)+6);
		}
		while(snakeX<8 || snakeY<30 || snakeX>392 || snakeY>392);
		if(audio) {
			audioCoin.currentTime = 0;
			audioCoin.play();
    	}
	}
}
function checkTrailCollision() {
	ctx.save();
	ctx.strokeStyle = "transparent";
	ctx.beginPath();
    ctx.moveTo(trail[8],trail[9]);
    for (var i=10;i<128+snakeScore*20;i+=2) {
        ctx.lineTo(trail[i],trail[i+1]);
    }
    ctx.stroke();
    ctx.restore();
    if(isPointInStroke()) return true;
    else return false;
}
function checkCollision() {
    if(wallCollision() || checkTrailCollision()) {
        document.getElementById('canvas').style.boxShadow = "10px 10px 10px red";
    	if(audio) {
			audioCollision.currentTime = 0;
			audioCollision.play();
    	}
        deadMessage();
        left = right = false;
        start = dead = true;
        trail = [];
        angle = 0;
        snakeX = snakeY = 200;
    }
}
function checkConditions() {
    if(start && !dead && (!left && !right)) {
        ctx.clearRect(0,0,width,height);
        drawSquare();
        drawCoin();
        document.getElementById('canvas-message').style.display = "none";
        return false;
    }
    if(start && dead) {
        return false;
    }
    return true;
}
function wallCollision() {
	ctx.save();ctx.strokeStyle="transparent";ctx.lineWidth=0;ctx.beginPath();ctx.rect(0,0,400,400);ctx.stroke();ctx.restore();
	return isPointInStroke();
}
function deadMessage() {
    document.getElementById('canvas-message').style.display = "block";
    document.getElementById('canvas-message').innerHTML = "Spacebar to restart";
}
function drawSquare() {
    trail[0] = 4;trail[1] = 200;trail[2] = 0;trail[3] = 200;
    ctx.beginPath();
    ctx.moveTo(trail[0],trail[1]);ctx.lineTo(trail[2],trail[3]);
    ctx.save();
    ctx.lineCap = shape[playerCookie[2]];
    ctx.shadowBlur = shadow[playerCookie[3]];
    ctx.shadowColor = colors[playerCookie[4]];
    ctx.strokeStyle = colors[playerCookie[4]];
    ctx.lineWidth = player.size;
    ctx.stroke();
    ctx.restore();
}
function isPointInStroke() {
    return ctx.isPointInStroke(player.x,player.y) || ctx.isPointInStroke(player.x-ry*2,player.y+rx*2) || 
    ctx.isPointInStroke(player.x+ry*2,player.y-rx*2);
}
document.onkeydown = function(e) {
    if(e.keyCode == 37) left = true,right = false;
    if(e.keyCode == 39) right = true,left = false;
    if(e.keyCode == 32) document.getElementById('canvas').style.boxShadow = "none";
    if(e.keyCode == 32 && dead) {
    	dead = false;
    	if(snakeScore > snakeHighscore) {
        	localStorage.setItem("snakeHighscore", snakeScore);
			document.getElementById('snake-highscore').innerHTML = "Highscore: " + snakeScore;
		}
    	snakeScore = 0;
        document.getElementById('snake-score').innerHTML = "Score: " + snakeScore;
    }
    if(dead) left = false,right = false;
}
document.onkeyup = function(e) {
    if(e.keyCode == 37) left = false;
    if(e.keyCode == 39) right = false;
}