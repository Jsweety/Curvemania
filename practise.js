var canvas,ctx;
var width,height;
var left,right;
var player = {
    x:0,y:0,size:8
};
var angle = 0;
var rx = 0,ry = 0;
var trail = [];
var start = true,dead = false,wallCollision = false,lvlCollision = false;
var fps = 100,fpsInterval,startTime,now,then,elapsed;
var cookies,cookie,playerCookie,patternsCookie,extrasCookie,colorsCookie,splitNumber;
var colors = ["red","blue","purple","green","cyan","orange","yellow","pink","white"];
var shape = ["square","round"],gap = [14,20,28,36],shadow = [0,10];
var audioCollision = new Audio('sound/collision.wav');

window.onload = function() {
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
            drawRectangle();
            drawRoom();
            checkCollision();
        }
    }
    requestAnimationFrame(draw);
}
function startPosition() {
    if(start) {
        player.x = 12;
        player.y = 300;
        start = false;
    }
}
function newPosition() {
    if(left) angle -= 0.05;
    if(right) angle += 0.05;
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
    ctx.setLineDash([(120/(splitNumber+1))-gap[playerCookie[1]]*((splitNumber)/(splitNumber+1)),gap[playerCookie[1]]]);
    ctx.beginPath();
    ctx.moveTo(trail[0],trail[1]);
    for (var i=2;i<122;i+=2) {
        ctx.lineTo(trail[i],trail[i+1]);
    }
    ctx.stroke();
    ctx.restore();
}
function drawRoom() {
    ctx.beginPath();
    ctx.moveTo(250,250);ctx.lineTo(250,100);ctx.lineTo(400,100);ctx.moveTo(300,250);ctx.lineTo(300,150);ctx.lineTo(400,150);
    ctx.moveTo(250,350);ctx.lineTo(250,500);ctx.lineTo(400,500);ctx.moveTo(300,350);ctx.lineTo(300,450);ctx.lineTo(400,450);
    ctx.moveTo(650,250);ctx.lineTo(650,100);ctx.lineTo(500,100);ctx.moveTo(600,250);ctx.lineTo(600,150);ctx.lineTo(500,150);
    ctx.moveTo(650,350);ctx.lineTo(650,500);ctx.lineTo(500,500);ctx.moveTo(600,350);ctx.lineTo(600,450);ctx.lineTo(500,450);
    ctx.moveTo(385,270);ctx.lineTo(385,235);ctx.lineTo(420,235);ctx.moveTo(385,330);ctx.lineTo(385,365);ctx.lineTo(420,365);
    ctx.moveTo(515,270);ctx.lineTo(515,235);ctx.lineTo(480,235);ctx.moveTo(515,330);ctx.lineTo(515,365);ctx.lineTo(480,365);
    ctx.rect(437,287, 26, 26);
    ctx.moveTo(80,250);ctx.lineTo(252,250);ctx.moveTo(80,350);ctx.lineTo(252,350);
    ctx.rect( 80,  0, 15,100);ctx.rect( 80,160, 15, 90);ctx.rect(160,  0, 15, 60);ctx.rect(160,120, 15,130);
    ctx.rect( 80,500, 15,100);ctx.rect( 80,350, 15, 90);ctx.rect(160,540, 15, 60);ctx.rect(160,350, 15,130);
    ctx.moveTo(850,165);ctx.lineTo(850, 75);ctx.lineTo(825, 50);ctx.lineTo(725, 50);ctx.closePath();
    ctx.moveTo(700,100);ctx.lineTo(700,180);ctx.lineTo(725,205);ctx.lineTo(805,205);ctx.closePath();
    ctx.moveTo(850,435);ctx.lineTo(850,525);ctx.lineTo(825,550);ctx.lineTo(735,550);ctx.closePath();
    ctx.moveTo(700,500);ctx.lineTo(700,420);ctx.lineTo(725,395);ctx.lineTo(805,395);ctx.closePath();
    ctx.moveTo(250,  0);ctx.lineTo(250, 50);ctx.moveTo(325,100);ctx.lineTo(325, 50);ctx.moveTo(400,  0);ctx.lineTo(400, 50);
    ctx.moveTo(500,  0);ctx.lineTo(500, 50);ctx.moveTo(575,100);ctx.lineTo(575, 50);ctx.moveTo(650,  0);ctx.lineTo(650, 50);
    ctx.moveTo(250,600);ctx.lineTo(250,550);ctx.moveTo(325,500);ctx.lineTo(325,550);ctx.moveTo(400,600);ctx.lineTo(400,550);
    ctx.moveTo(500,600);ctx.lineTo(500,550);ctx.moveTo(575,500);ctx.lineTo(575,550);ctx.moveTo(650,600);ctx.lineTo(650,550);
    ctx.moveTo(850,250);ctx.lineTo(700,250);ctx.lineTo(700,350);ctx.lineTo(850,350);ctx.moveTo(750,300);ctx.lineTo(900,300);
    ctx.stroke();
    lvlCollision = isPointInStroke();
}
function checkCollision() {
    if(wallCollision || lvlCollision) {
        document.getElementById('canvas').style.boxShadow = "10px 10px 10px red";
        if(audio) {
			audioCollision.currentTime = 0;
			audioCollision.play();
    	}
        deadMessage();
        wallCollision = lvlCollision = left = right = false;
        start = dead = true;
        trail = [];
        angle = 0;
    }
}
function checkConditions() {
    if(start && !dead && (!left && !right)) {
        ctx.clearRect(0,0,width,height);
        drawSquare();
        drawRectangle();
        drawRoom();
        document.getElementById('canvas-message').style.display = "none";
        return false;
    }
    if(start && dead) {
        return false;
    }
    return true;
}
function deadMessage() {
    document.getElementById('canvas-message').style.display = "block";
    document.getElementById('canvas-message').innerHTML = "Spacebar to restart";
}
function drawRectangle() {
    ctx.beginPath();
    ctx.rect(2,2,896,596);
    ctx.stroke();
    wallCollision = isPointInStroke();
}
function drawSquare() {
    trail[0] = 8;trail[1] = 300;trail[2] = 4;trail[3] = 300;
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
    if(e.keyCode == 32 && dead) dead = false;
    if(dead) left = false,right = false;
}
document.onkeyup = function(e) {
    if(e.keyCode == 37) left = false;
    if(e.keyCode == 39) right = false;
}